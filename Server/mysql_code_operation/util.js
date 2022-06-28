/**
 * Created by Administrator on 2016/4/1.
 */
var mysql = require('mysql');
var fs = require('fs');
var cp = require('child_process');
var util = require('util');
var async = require('async');
var define = require('../bi_log_tool/define.js');
var logger = require('../manager/log4_manager.js');
var writeDBConfig = require('../../server_config/mysql.json');
var accountDb = require('../game_server/database/account');
var dbManager = require("../manager/redis_manager").Instance();
var cfgRedis = require('../../server_config/redis.json');

var connErrCode = {};/*防止大量打印出相同的错误日志,结构为zid:''*/
var onErrCode = {};/*防止大量打印出相同的错误日志,结构为zid:''*/
var globalConn = {};/*全局数据库连接,结构为zid:conn*/

/**
 *
 * @param zid
 * @param callback
 */
var getConnection = function(zid, callback){
    if(globalConn[zid]){
        callback(null, globalConn[zid]);
    }
    else{
        globalConn[zid] = mysql.createConnection(writeDBConfig[zid]);
        globalConn[zid].connect(function(err){
            if(!!err){
                globalConn[zid] = null;
                if(connErrCode[zid] !== err.code){
                    console.error('connect err, zid = '+ zid +', connection to db:' + err);
                    connErrCode[zid] = err.code;
                }
                callback(err);
                return;
            }
            globalConn[zid].on('error', function(err){
                globalConn[zid] = null;
                if(onErrCode[zid] !== err.code){
                    console.error('on err, zid = '+ zid +', db err:' + err);
                    onErrCode[zid] = err.code;
                }
            });
            connErrCode[zid] = null;
            onErrCode[zid] = null;
            console.log('conn success, zid = '+ zid +', id = '+ globalConn[zid].threadId);
            callback(null, globalConn[zid]);
        });
    }
};

module.exports.globalConn = globalConn;
module.exports.getConnection = getConnection;

/**
 *
 * @param host
 * @param port
 * @param user
 * @param password
 * @param database
 * @param fileName
 * @param cb
 */
var execSqlFile = function (host, port, user, password, database, fileName, cb) {
    var cmdLine = util.format('mysql -h %s -P %d --user=%s --password=%s %s < %s', host, port, user, password, database, fileName);
    cp.exec(cmdLine, function (err) {
        if(!!err) {
            console.error(cmdLine + ', exec err: ' + err);
            cb(err);
            return;
        }
        console.info(cmdLine + ', exec success');
        cb(null);
    });
}

module.exports.execSqlFile = execSqlFile;

/**
 *
 * @param host
 * @param port
 * @param user
 * @param password
 * @param database
 * @param fileName
 * @param cb
 */
var mysqlTableExport = function (host, port, user, password, database, tableName, fileName, cb) {
    var cmdLine = util.format('mysqldump -h %s -P %d --user=%s --password=%s %s %s > %s', host, port, user, password, database, tableName, fileName);
    cp.exec(cmdLine, function (err) {
        if(!!err) {
            console.error(cmdLine + ', exec err: ' + err);
            cb(err);
            return;
        }
        console.info(cmdLine + ', exec success');
        cb(null);
    });
}

module.exports.mysqlTableExport = mysqlTableExport;

/**
 *
 * @param host
 * @param port
 * @param user
 * @param password
 * @param database
 * @param tableName
 * @param fileName
 * @param cb
 */
var mysqlTableImport = function (host, port, user, password, database, fileName, cb) {
    var cmdLine = util.format('mysql -h %s -P %d --user=%s --password=%s %s < %s', host, port, user, password, database, fileName);
    cp.exec(cmdLine, function (err) {
        if(!!err) {
            console.error(cmdLine + ', exec err: ' + err);
            cb(err);
            return;
        }
        console.info(cmdLine + ', exec success');
        cb(null);
    });
}

module.exports.mysqlTableImport = mysqlTableImport;

/**
 *
 * @param tableName
 * @param zid
 * @returns {*}
 */
var generateSqlFile = function (tableName, zid) {
    return util.format(tableName + '_zid%d.sql', zid);
}

module.exports.generateSqlFile = generateSqlFile;