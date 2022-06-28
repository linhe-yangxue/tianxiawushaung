require('./tools/system/string_util');
var cluster = require('cluster');
var redis = require("redis");
var csvParse = require('./tools/parse/csv');
var httpServer = require('./tools/net/http_server/http_server');
var logger = require('./manager/log4_manager').LoggerGame;
var async = require('async');
var dbManager = require("./manager/redis_manager").Instance();
var redisKey = require("./common/redis_key");
var csvManager = require('./manager/csv_manager');
var csvExtendManager = require('./manager/csv_extend_manager');
var cfgRedis = require('../server_config/redis.json');
var cfgServers = require('../server_config/servers.json');
var gameServer = null;

/** 错误处理 */
var sendDisconnect = true;
process.on('uncaughtException', function (err) {
    logger.error("[uncaughtException] " + err.stack);
    if(gameServer != null)  gameServer.stop();
    if(cluster.isWorker && sendDisconnect ) {
        cluster.worker.disconnect();
        sendDisconnect = false;
    }
    var killTimer = setTimeout( function() {
        process.exit(88888);
    },1000);
    killTimer.unref();// 非常重要，如果不使用unref方法，那么即使server的所有连接都关闭，Node也会等到killTimer定时器执行
});

/** 读取NodeId 和存储配置Redis的Ip和Port*/
var server_main = function() {
    async.waterfall([
        /* 获取redis配置 */
        function(callback) {
            dbManager.loadLogicDB(cfgRedis, false);
            callback(null);
        },
        /* 加载CSV配置文件到缓存中 */
        function(callback) {
            csvParse.Instance().load('../csvTables', callback);
        },
        /* 加载配置缓存到缓存对象类中 */
        function(callback) {
            csvManager.Instance();
            callback(null);
        },
        /* 加载配置扩展缓存到缓存对象类中 */
        function(callback) {
            csvExtendManager.Instance();
            callback(null);
        },
        /* 创建 Game server 的HTTP服务 */
        function(callback) {
            gameServer = new httpServer.HttpServerImpl(logger, httpServer.protoTypePath, function(res, req) {
                return true;
            });
            callback(null);
        },
        /* 绑定 Game server 的协议服务，并且开启HTTP服务 */
        function(callback) {
            gameServer.bindHttpProtocols('./game_server/main_logic');/* 绑定协议 */
            gameServer.start(cfgServers.gameServer.port); /* 启动HTTP服务 */
            logger.info("game server http server started : " + cfgServers.gameServer.port);
            callback(null);
        }
    ], function(err) {
        if (err) {
            logger.error("Server Start Error");
            return;
        }
        logger.info("----------------- Server Start OK -----------------");
    });
};

//单进程
if(process.env.DEBUG_LOCAL == 'true') {

    server_main();
//多进程
}else{

    var numCPUs = require('os').cpus().length;
    //主进程
    if (cluster.isMaster) {
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('listening', function (worker,address) {
            logger.info("[master]  worker:"   + worker.id + " pid:" + worker.process.pid + " listening:" + address.address + ":" +address.port);
        });

        cluster.on('disconnect', function (worker) {
            logger.error("[master]  worker disconnect");                              
        });

        cluster.on('exit', function (worker,code,signal) {
            logger.error("[master]  worker exit");
            cluster.fork();
        });
        //子进程
    }else{
        gameServer =  server_main();
    }
}




