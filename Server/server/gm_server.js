require('./tools/system/string_util');
var cluster = require('cluster');
var redis = require("redis");
var csvParse = require('./tools/parse/csv');
var httpServer = require('./tools/net/http_server/http_server');
var logger = require('./manager/log4_manager').LoggerGm;
var async = require('async');
var dbManager = require("./manager/redis_manager").Instance();
var redisKey = require("./common/redis_key");
var csvManager = require('./manager/csv_manager');
var csvExtendManager = require('./manager/csv_extend_manager');
var timer = require("./game_server/common/gm_timer");
var cfgRedis = require('../server_config/redis.json');
var cfgServers = require('../server_config/servers.json');
var gmConfig = require("../server_config/gm_config.json");
var gmServer = null;
var publicKey = gmConfig.publicKey;

/** 错误处理 */
var sendDisconnect = true;
process.on('uncaughtException', function (err) {
    logger.error("[uncaughtException] " + err.stack);
    if(gmServer !=null)  gmServer.stop();
    if(cluster.isWorker && sendDisconnect ) {
        cluster.worker.disconnect();
        sendDisconnect =false;
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
        /* 创建 gm server 的HTTP服务 */
        function(callback) {
            gmServer = new httpServer.HttpServerImpl(logger, httpServer.protoTypeCmd, function(res, req) {
                return true;
            });
            callback(null);
        },
        /* 绑定 gm server 的协议服务，并且开启HTTP服务 */
        function(callback) {
            gmServer.bindHttpProtocols('./game_server/gm_logic');/* 绑定协议 */
            gmServer.start(cfgServers.gmServer.port); /* 启动HTTP服务 */
            logger.info("gm server http server started : " + cfgServers.gmServer.port);
            callback(null);
        },
        /* 定时任务 */
        function(callback) {
            timer.setTimers();
            callback(null);
        }
    ], function(err) {
        if (err == -1) {
            logger.error("Server Start Error");
            return;
        }
        logger.info("----------------- Server Start OK -----------------");
    });
};

server_main();

/*sign验证的公钥*/
exports.publicKey = publicKey;



