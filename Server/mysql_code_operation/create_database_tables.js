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
var path = require('path');
var execSqlFile = require('./util').execSqlFile;
var getConnection = require('./util').getConnection;
var globalConn = require('./util').globalConn; /*全局数据库连接,结构为zid:conn*/

const createTableSqlFile = 'create_tables.sql';

/**
 *
 */
var initMysqlTable = function(callback) {
    async.waterfall([
        /* 获取redis配置 */
        function(callback) {
            dbManager.loadLogicDB(cfgRedis, false);
            callback(null);
        },

        function (callback) {
            accountDb.getAllZoneId(callback);
        },

        function(zidList, callback) { // 创建数据库
            zidList.push(0); /* 添加全局数据库 */
            async.eachSeries(zidList, function (zid, eachCb) {
                if(null == writeDBConfig[zid]){
                    zid = define.DEFAULT_ZID_NAME;/*未配置，读默认的配置*/
                }
                getConnection('global', function(err, conn){/*获取mysql连接*/
                    if(err || null == conn){
                        eachCb(null);
                        return;
                    }
                    var sql = util.format('create database if not exists `%s`', writeDBConfig[zid].database);
                    conn.query(sql, function (err) {
                        if (!!err) {
                            /*数据库正常关闭或者mysql端关闭连接，会返回该错误，但是on方法监听不到 连接超时这里特殊处理下*/
                            if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code === 'ECONNRESET'){
                                globalConn[zid] = null;
                            }
                            console.error(sql + ', exec error: ' + err) ;
                        }
                        console.log(sql + ', exec success');
                        eachCb(null);
                    });
                });
            }, function (err) {
                callback(err, zidList);
            });
        },

        function(zidList, callback){ // 创建表格
            async.eachSeries(zidList, function (zid, eachCb) {
                if(null == writeDBConfig[zid]){
                    zid = define.DEFAULT_ZID_NAME;/*未配置，读默认的配置*/
                }
                var sqlFile = path.join(process.cwd(), createTableSqlFile).replace(/\\/g, '/');
                execSqlFile(writeDBConfig[zid].host, writeDBConfig[zid].port, writeDBConfig[zid].user, writeDBConfig[zid].password, writeDBConfig[zid].database, sqlFile, eachCb);
            }, callback);
        }
    ], callback);
};

initMysqlTable();
