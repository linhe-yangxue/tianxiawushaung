require('./tools/system/string_util');
var redis = require("redis");
var csvParse = require('./tools/parse/csv');
var logger = require('./manager/log4_manager').LoggerGame;
var async = require('async');
var dbManager = require("./manager/redis_manager").Instance();
var redisKey = require("./common/redis_key");
var timer = require("./game_server/common/timer");
var csvManager = require('./manager/csv_manager');
var csvExtendManager = require('./manager/csv_extend_manager');
var arenaDb = require('./game_server/database/arena');
var mainUIDB = require('./game_server/database/main_ui_robot');
var cfgRedis = require('../server_config/redis.json');

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
        /* 初始化竞技场排名 */
        function(callback) {
            arenaDb.createArenaRank(callback);
        },
        function(callback) {
            mainUIDB.createMainUIRobotLevelRank(callback);
        },
        function(callback) {
            mainUIDB.createMainUIRobotPowerRank(callback);
        },
        /* 定时任务 */
        function(callback) {
            timer.setTimersInGame();
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





