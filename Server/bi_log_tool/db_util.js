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
var define = require('./define.js');
var util = require('util');
var logger = require('../manager/log4_manager.js');
var writeDBConfig = require('../../server_config/mysql.json');

var connErrCode = {};/*防止大量打印出相同的错误日志,结构为zid:''*/
var onErrCode = {};/*防止大量打印出相同的错误日志,结构为zid:''*/
var globalConn = {};/*全局数据库连接,结构为zid:conn*/


var toolType = 0;/*表示哪个tool发来的*/
var setToolType = function(ttype){
    toolType = ttype;
};
exports.setToolType = setToolType;

/**
 * 获取数据库连接
 */
var getConnection = function(zid, callback){
    if(globalConn[zid]){
        callback(null, globalConn[zid]);
    }
    else{
        globalConn[zid] = mysql.createConnection(writeDBConfig[zid]);
        globalConn[zid].connect(function(err){
            if(err){
                globalConn[zid] = null;
                if(connErrCode[zid] !== err.code){
                    logger.biLogErr('['+ toolType +']connect err zid='+ zid +',connection to db:' + err);
                    connErrCode[zid] = err.code;
                }
                callback(err);
            }
            else{
                globalConn[zid].on('error', function(err){
                    globalConn[zid] = null;
                    if(onErrCode[zid] !== err.code){
                        logger.biLogErr('['+ toolType +']on err zid='+ zid +',db err:' + err);
                        onErrCode[zid] = err.code;
                    }
                });
                connErrCode[zid] = null;
                onErrCode[zid] = null;
                logger.biLogInfo('['+ toolType +']conn success,zid='+ zid +',id='+ globalConn[zid].threadId);
                callback(null, globalConn[zid]);
            }
        });
    }
};

/**
 * 批量插入
 */
var batchInsert = function(logContentArr, callback) {
    var sql;
    async.waterfall([
        function(callback){
            async.each(logContentArr, function (alogContent, eachCb) {
                var insertTableStr = getInsertTableStr(alogContent.tableIndex);
                if (!insertTableStr) {
                    logger.biLogErr('['+ toolType +']logContentArr1 = ' + JSON.stringify(alogContent));
                    eachCb(null);
                }
                else {
                    var nowZid = alogContent.zid;/*默认是日志中区id*/
                    if(null == writeDBConfig[nowZid]){
                        nowZid = define.DEFAULT_ZID_NAME;/*未配置，读默认的配置*/
                    }
                    getConnection(nowZid, function(err, conn){/*获取mysql连接*/
                        if(err || null == conn){
                            logger.biLogErr('['+ toolType +']logContentArr2 = ' + JSON.stringify(alogContent));
                            eachCb(null);
                        }
                        else{
                            sql = util.format(insertTableStr, writeDBConfig[nowZid].database, alogContent.content);
                            conn.query(sql, function (err) {
                                if (err) {
                                    /*数据库正常关闭||mysql端关闭连接，会返回该错误，但是on方法监听不到 连接超时这里特殊处理下*/
                                    if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code === 'ECONNRESET'){
                                        globalConn[nowZid] = null;
                                    }
                                    logger.biLogErr('['+ toolType +']logContentArr3 = ' + JSON.stringify(alogContent));
                                }
                                eachCb(null);
                            });
                        }
                    });
                }
            },function (err) {
                callback(err);
            });
        }
    ], callback);
};
exports.batchInsert = batchInsert;

/**
 * 获得表名
 */
var getInsertTableStr = function(tableIndex) {
    return define.mapInsertTableStr[tableIndex];
};
