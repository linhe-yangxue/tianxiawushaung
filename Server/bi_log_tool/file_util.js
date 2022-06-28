/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：文件操作方法
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var fs = require('fs');
var path = require('path');
var async = require('async');
var define = require('./define.js');
var logObject = require('./logs_object.js');
var logger = require('../manager/log4_manager.js');
var biCode = require('../common/bi_code');

/**---------------------------------------------------------------------------------------------------------------*/
/**
 * 读logRunTime文件
 * @param rootPath [string] 日志文件根路径
 * @param checkStr [string] 日志文件名的条件
 * @param runTimeFullPath [string] 日志文件全路径
 * @param callback[] logRunTime对象
 */
var readLogRunTime = function(rootPath, checkStr, runTimeFullPath, callback) {
    fs.exists(runTimeFullPath, function(isExist){
        if(!isExist){
            createLogRunTime(rootPath, checkStr, runTimeFullPath, callback);
        }
        else {
            var data = fs.readFileSync(runTimeFullPath, 'utf-8');
            if(!data){/*读出的数据是空的*/
                createLogRunTime(rootPath, checkStr, runTimeFullPath, callback);
            }
            else{
                var logRunTime = JSON.parse(data);
                var newBuffer = new Buffer(logRunTime.surplusStr, encoding='utf8');
                logRunTime.surplusStr = newBuffer.toString();
                callback(null, logRunTime);
            }
        }
    })
};
exports.readLogRunTime = readLogRunTime;

/**
 * 新建logRunTime文件
 * @param rootPath [string] 日志文件根路径
 * @param checkStr [string] 日志文件名的条件
 * @param runTimeFullPath [string] 日志文件全路径
 * @param callback [] logRunTime对象
 */
var createLogRunTime = function(rootPath, checkStr, runTimeFullPath, callback){
    var minLogFile = getSortGameLogFileName(rootPath, checkStr);
    if(minLogFile.length < 1) {
        callback(define.FU_1);
    }
    else{
        var logRunTime = new logObject.logRunTime();
        logRunTime.fileNameEnd = minLogFile[0];
        writeLogRunTime(runTimeFullPath, logRunTime, function(err){
            if(err){
                callback(define.FU_3);
                return;
            }
            callback(null, logRunTime);
        })
    }
};
exports.createLogRunTime = createLogRunTime;

/**
 * 写logRunTime文件
 * @param runTimeFullPath [string] 日志文件全路径
 * @param logRunTime [string] logRunTime对象
 * @param callback [Object]
 */
var writeLogRunTime = function(runTimeFullPath, logRunTime, callback) {
    /*logRunTime.surplusStr字符串转成buffer*/
    var newBuffer = new Buffer(logRunTime.surplusStr, encoding='utf8');
    logRunTime.surplusStr = newBuffer;
    fs.writeFile(runTimeFullPath, JSON.stringify(logRunTime), function(err){
        if(err){
            logger.biLogErr('writeLogRunTime fail.err:' + err);
            callback(define.FU_3);
        }
        else{
            callback(null);
        }
    });
};
exports.writeLogRunTime = writeLogRunTime;

/**---------------------------------------------------------------------------------------------------------------*/
/**
 * 获取文件夹下所有log文件，按时间排序
 * @param rootPath [string] 日志文件根路径
 * @param checkStr [string] 日志文件名的条件
 * @return [arr] 从小到大（时间）排序的完整文件名
 */
var getSortGameLogFileName = function(rootPath, checkStr) {
    var arrFileName = fs.readdirSync(rootPath);
    var arrTime = [];
    for(var i = 0; i < arrFileName.length; i++){
        var index = arrFileName[i].indexOf(checkStr);
        if(index == -1){
            continue;
        }
        var index1 = arrFileName[i].indexOf(define.LOGPRE1);
        if(index1 == -1){
            continue;
        }
        arrTime.push(arrFileName[i]);
    }
    return arrTime.sort();
};

/**---------------------------------------------------------------------------------------------------------------*/
/**
 * 读log文件
 * @param rootPath [string] 日志文件根路径
 * @param fd [fd] 文档名
 * @param buffer [buffer] 缓冲区
 * @param length [int] 读取的字节数
 * @param position [int] 从哪里开始读取文件
 * @param surplusStr [string] 上次读取剩余的字符串
 * @param callback [arr] logContent对象的数组
 */
var getGameLog = function(rootPath, fd, buffer, length, position, surplusStr, callback) {
    var fd = path.join(rootPath, fd);
    var logContentArr = [];
    var readOffset = 0;/*真正读出的字节数*/
    var newStr = '';
    async.waterfall([
        function(callback){
            fs.open(fd, 'r', callback);
        },

        /*在文件中读出buffer数据*/
        function(newFd, callback){
            fs.read(newFd, buffer, 0, length, position, function(err, bytesRead, buffer) {
                if (err) {
                    closeFile(newFd);
                    logger.biLogErr('getGameLog read fail.filename:'+JSON.stringify(fd));
                    callback(define.FU_2);
                }
                else if(bytesRead <= 0){
                    closeFile(newFd);
                    callback(define.FU_4);
                }
                else{
                    closeFile(newFd);
                    readOffset = bytesRead;
                    callback(null, buffer.slice(0, bytesRead).toString());
                }
            });
        },

        /*把buffer数据转成一行行的数据，及返回偏移量*/
        function(bufferStr, callback){
            buffer2line(bufferStr, surplusStr, function(lines, newBufferStr){
                newStr = newBufferStr;
                callback(null, lines);
            });
        },

        /*返回是写mysql的bi数据arr*/
        function(lines, callback){
            var arr = {};/*{zid:{tableid:[sql]}}*/
            for(var i=0; i<lines.length; i++){
                var arrResult = checkLogFormat(lines[i]);
                if(arrResult[0]){
                    /*格式正确*/
                    if(arr.length <= 0 || null == arr[arrResult[1]]){
                        arr[arrResult[1]] = {};
                        arr[arrResult[1]][arrResult[2]] = [];
                        arr[arrResult[1]][arrResult[2]].push(arrResult[3]);
                    }
                    else if(null == arr[arrResult[1]][arrResult[2]]){
                        arr[arrResult[1]][arrResult[2]] = [];
                        arr[arrResult[1]][arrResult[2]].push(arrResult[3]);
                    }
                    else{
                        arr[arrResult[1]][arrResult[2]].push(arrResult[3]);
                    }
                }
            }
            var max = define.MAX_BATCHINSERT_NUM;
            /*合并可批量插入mysql的语句*/
            for(var zid in arr){
                for(var tableid in arr[zid]){
                    var sqlArr = arr[zid][tableid];
                    /*礼包码表不合并*/
                    if(tableid == biCode.logs_gm_code){
                        for(var k = 0,len = sqlArr.length; k<len; k++){
                            var logContent = new logObject.logContent();
                            logContent.zid = zid;
                            logContent.tableIndex = tableid;
                            logContent.content = sqlArr[k];
                            logContentArr.push(logContent);
                        }
                        continue;
                    }

                    var lun = parseInt(sqlArr.length / max);
                    var remainder = sqlArr.length % max;
                    if(remainder > 0){
                        lun ++;
                    }
                    for(var j=0; j<lun; j++){
                        var logContent = new logObject.logContent();
                        logContent.zid = zid;
                        logContent.tableIndex = tableid;
                        if(j == lun-1){//最后一轮
                            logContent.content = sqlArr.slice(j*max).join('),(');
                        }
                        else{
                            logContent.content = sqlArr.slice(j*max, (j+1)*max).join('),(');
                        }
                        logContentArr.push(logContent);
                    }
                }
            }
            callback(null);
        }
    ], function(err) {
        if (err) {
            callback(err, logContentArr, readOffset, newStr);
        }else{
            callback(null, logContentArr, readOffset, newStr);
        }
    });
};
exports.getGameLog = getGameLog;

/**
 * 验证是否是要写mysql的日志
 * @param data [string] 日志文件中的一行
 * @return [array] 返回数组index=0是否要写mysql;index=1是表中要插入的内容;
 */
var checkLogFormat = function(data) {
    var arrResult = [];
    /*验证'['有几个*/
    var smallStr = data.split('[');
    if(smallStr.length < 4){/*没错，第一个‘[’前也算一部分，最后一个‘[’后面也是一部分*/
        arrResult.push(false);
        return arrResult;
    }
    /*提取第1个'['']'中的数据*/
    var zidStr = smallStr[1].split(']');
    if(zidStr.length != 2){
        arrResult.push(false);
        return arrResult;
    }
    var zid = parseInt(zidStr[0]);
    if(isNaN(zid)){
        arrResult.push(false);
        return arrResult;
    }
    /*提取第2个'['']'中的数据*/
    var tableIndexStr = smallStr[2].split(']');
    if(tableIndexStr.length != 2){
        arrResult.push(false);
        return arrResult;
    }
    var tableIndex = parseInt(tableIndexStr[0]);
    if(isNaN(tableIndex)){
        arrResult.push(false);
        return arrResult;
    }
    /*提取第3个'['和最后一个']'中的数据，因有些JSON数据自己带[]*/
    var arrStr = [];
    for(var i=3; i<smallStr.length; i++){
        arrStr.push(smallStr[i]);
    }
    var lowerStr = arrStr.join('[');
    arrResult.push(true);
    arrResult.push(zid);
    arrResult.push(tableIndex);
    arrResult.push(lowerStr.substring(0, lowerStr.lastIndexOf(']')));
    return arrResult;
};
exports.checkLogFormat = checkLogFormat;

/**
 * buffer数据转成行
 * 备注：1、最后一行没换行符，扔掉，因数据不完整
 * @param bufferStr [buffer] buffer转成string的数据
 * @param surplusStr [string] 上次读取剩余的字符串
 * @param callback [func] 第一个返回值是按行保存的arr数据，第二个返回值是剩余的字符串
 */

var buffer2line = function(bufferStr, surplusStr, callback) {
    var arrStr = [];
    arrStr.push(surplusStr);
    arrStr.push(bufferStr);
    var separator = /\r\n?|\n/,
        newBufferStr = arrStr.join(''),/*直接用加号会加\n，勿修改*/
        retArr = [],
        separatorIndex = -1,
        separatorLen = 0;

    var findSeparator = function(){
        var result = separator.exec(newBufferStr);//返回第一个匹配的字符串，该字符串的位置，及原始字符串组成的数组。
        if(result && (result.index + result[0].length <= newBufferStr.length)){
            separatorIndex = result.index;
            separatorLen = result[0].length;
        }
        else{
            separatorIndex = -1;
        }
    };

    function getLine(){
        if(separatorIndex > 0){
            var ret = newBufferStr.substring(0, separatorIndex).toString();
            retArr.push(ret);
            newBufferStr = newBufferStr.substring(separatorIndex + separatorLen);//去掉已读过的
            return true;
        }
        else{
            return false;
        }
    }

    for(var i=0; i<100000; i++){//因要有限循环，先这样写
        findSeparator();
        if(!getLine()) break;
    }
    callback(retArr, newBufferStr);
};
exports.buffer2line = buffer2line;

/**
 * 检查是否有新增日志文件
 * @param rootPath [string] 日志文件根路径
 * @param checkStr [string] 日志文件名的条件
 * @param oldFileName [String] 现在正在读的日志文件名
 * @return new FileName [String] 新增的文件名
 */
var checkNewAddFileName = function(rootPath, checkStr, oldFileName) {
    var sortFileName = getSortGameLogFileName(rootPath, checkStr);
    var retFileName = null;
    for(var i=0; i<sortFileName.length; i++){
        if(sortFileName[i] && (sortFileName[i] > oldFileName)){
            retFileName = sortFileName[i];
            break;
        }
    }
    return retFileName;
};
exports.checkNewAddFileName = checkNewAddFileName;

/**
 * 关闭文件
 * @param fd [fd] 日志文件fd
 * @return []
 */
var closeFile = function(fd){
    fs.close(fd, function(err){
        if(err){
            logger.biLogErr('close file fail. err:' + err +',filename:'+JSON.stringify(fd));
        }
    })
};
exports.closeFile = closeFile;

/**
 * 删除文件
 * @param rootPath [string] 日志文件根路径
 * @param fileName [fd] 日志文件名
 * @return []
 */
var deleteFile = function(rootPath, fileName){
    var fd = path.join(rootPath, fileName);
    var states = fs.statSync(fd);
    fs.unlink(fd, function(err){
        if(err){
            logger.biLogErr('delete file fail. err:' + err);
        }
        else{
            logger.biLogInfo('delete file success.name:' + fileName + ',size=' + states.size);
        }
    })
};
exports.deleteFile = deleteFile;