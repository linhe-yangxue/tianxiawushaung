/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：db操作
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var async = require('async');
var mysql = require('mysql');
var define = require('../bi_log_tool/define.js');
var util = require('util');
var logger = require('../manager/log4_manager.js');
var writeDBConfig = require('../../server_config/mysql.json');
var accountDb = require('../game_server/database/account');
var dbManager = require("../manager/redis_manager").Instance();
var cfgRedis = require('../../server_config/redis.json');
var mysqlTableExport = require('./util').mysqlTableExport;
var activation_code = require('./activation_code');
var generateSqlFile = require('./util').generateSqlFile;

/**
 * 批量导出
 */
var exportMysqlTable = function(callback) {
    async.waterfall([
        /* 获取redis配置 */
        function(callback) {
            dbManager.loadLogicDB(cfgRedis, false);
            callback(null);
        },

        function (callback) {
            accountDb.getAllZoneId(callback);
        },

        function(zidList, callback){ /* 导出生成的礼包码 */
            zidList.push(0); /* 添加全局数据库 */
            async.eachSeries(zidList, function (zid, eachCb) {
                if(null == writeDBConfig[zid]){
                    zid = define.DEFAULT_ZID_NAME;/*未配置，读默认的配置*/
                }
                mysqlTableExport(writeDBConfig[zid].host, writeDBConfig[zid].port, writeDBConfig[zid].user, writeDBConfig[zid].password, writeDBConfig[zid].database, activation_code.activation_code_table, generateSqlFile(activation_code.activation_code_table, zid), eachCb);
            }, function (err) {
                callback(err, zidList);
            });
        },

        function(zidList, callback){ /* 导出生成的礼包 */
            async.eachSeries(zidList, function (zid, eachCb) {
                if(null == writeDBConfig[zid]){
                    zid = define.DEFAULT_ZID_NAME;/*未配置，读默认的配置*/
                }
                mysqlTableExport(writeDBConfig[zid].host, writeDBConfig[zid].port, writeDBConfig[zid].user, writeDBConfig[zid].password, writeDBConfig[zid].database, activation_code.activation_gift_table, generateSqlFile(activation_code.activation_gift_table, zid), eachCb);
            }, callback);
        },
    ], callback);
};

exportMysqlTable();
