/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：不断循环运行，将io日志写入mysql
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

var path = require('path');
var schedule = require('node-schedule');
var async = require('async');
var define = require('./define.js');
var fileUtil = require('./file_util.js');
var logger = require('../manager/log4_manager.js');
var db = require('./db_util.js');
var writeDBConfig = require('../../server_config/mysql.json');


var isEnd = true;/*是否一轮操作结束*/
var buffer = new Buffer(10485760);
var rootPath = path.resolve('../logs/');
var runTimeFullPath = path.join(rootPath, define.RUNTIME_FILENAME);
db.setToolType(1);
//var logRunTime = new logObject.logRunTime();
//var newSurplusStr = '';/*剩余字符串*/
//var newOffset = 0;/*新的读到的字节数*/

/**
 * 初始定时器
 */
var begin = function(){
    if(null == writeDBConfig[define.DEFAULT_ZID_NAME]){
        logger.biLogErr('writeDBConfig not configured [default] ');
        return;
    }

    var arrSecond = [];
    for(var i=0; i<60; i++){
        arrSecond.push(i);
    }
    var rule = new schedule.RecurrenceRule();
    rule.second = arrSecond;
    schedule.scheduleJob(rule, function() {
        execute(function(){});
    });
};
exports.begin = begin;

/**
 * 开始执行函数
 */
var execute = function(callback) {
    if(!isEnd){
        callback(define.W_6);
        return;
    }
    else{
        isEnd = false;
    }

    var logRunTime;
    var newSurplusStr = '';/*剩余字符串*/
    var newOffset = 0;/*新的独到的字节数*/
    async.waterfall([
        function (callback) {
            /*获取上次写到哪里*/
            fileUtil.readLogRunTime(rootPath, define.LOGPRE, runTimeFullPath, function(err, data){
                if(err){
                    callback(err);
                }
                else{
                    logRunTime = data;
                    callback(null);
                }
            });
        },

        function (callback) {
            /*获取game log*/
            buffer.fill(0);
            fileUtil.getGameLog(rootPath, logRunTime.fileNameEnd, buffer, buffer.length, logRunTime.offset,
                logRunTime.surplusStr, function(err, logContentArr, offset, surplusStr) {
                if (err == define.FU_4) {
                    /*检查是否有新增文件*/
                    var newFileName = fileUtil.checkNewAddFileName(rootPath, define.LOGPRE, logRunTime.fileNameEnd);
                    if (!newFileName) {
                        callback(define.W_3);
                    }
                    else{
                        /*删除旧文件*/
                        fileUtil.deleteFile(rootPath, logRunTime.fileNameEnd);
                        logRunTime.fileNameEnd = newFileName;
                        logRunTime.offset = 0;
                        //logRunTime.surplusStr = logRunTime.surplusStr;
                        fileUtil.writeLogRunTime(runTimeFullPath, logRunTime, function(err){
                            if(err){
                                callback(err);
                            }
                            else{
                                callback(define.W_4);//下个循环再读
                            }
                        });
                    }
                }
                else if(err) {
                    callback(define.W_1);
                }else{
                    newOffset = offset;
                    newSurplusStr = surplusStr;
                    callback(null, logContentArr);
                }
            });
        },

        function (logContentArr, callback) {
            if(logContentArr.length < 1){
                /*会有单条日志比较大，要读几次才读完，要加offset*/
                if(newOffset > 0){
                    /*更新logRunTime*/
                    logRunTime.offset = logRunTime.offset + newOffset;
                    logRunTime.surplusStr = newSurplusStr;
                    fileUtil.writeLogRunTime(runTimeFullPath, logRunTime, callback);
                    callback(define.W_5);
                }
                else{
                    callback(define.W_2);//真的没有要写的数据
                }
            }
            else{
                /*写数据库*/
                db.batchInsert(logContentArr, function(err){
                    if(err){
                        callback(err);
                    }
                    else{
                        /*更新logRunTime*/
                        logRunTime.offset = logRunTime.offset + newOffset;
                        logRunTime.surplusStr = newSurplusStr;
                        fileUtil.writeLogRunTime(runTimeFullPath, logRunTime, callback);
                    }
                });
            }
        }
    ], function (err) {
        isEnd = true;
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};