/**
 * 包含的头文件
 */
var cluster = require('cluster');
var log4js = require('log4js');
var fs = require('fs');
var gmCode = require('../common/gm_code');
var biCode = require('../common/bi_code');
var cfgControl = require('../../server_config/control.json');

/* 创建logs文件夹 */
var logs = '../logs';
if(!fs.existsSync(logs)) {
    fs.mkdirSync(logs);
}

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 高级配置
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * log4日志对象的配置
 */
log4js.configure({
    'appenders':[
        {
            'category': 'Demo',
            'type': 'dateFile',
            'filename': '../logs/Demo',
            'pattern': '-yyyy-MM-dd-hh',
            'alwaysIncludePattern': true,
            //'maxLogSize': 100000000, /* 单位（bytes）不能和 type:dateFile 一起使用 */
            //'backups': 200, /* 单位（个）不能和 type:dateFile 一起使用 */
            'layout': {
                'type': 'pattern',
                'pattern': '[%r] [%x{pid}] [%p] [%c] %m',
                'tokens': {
                    'pid': function() {
                        return process.pid;
                    },
                    'serverName': function() {
                        return 'Demo';
                    }
                }
            }
        },
        {
            'category': 'GameServer',
            'type': 'dateFile',
            'filename': '../logs/GameServer',
            'pattern': '-yyyy-MM-dd-hh',
            'alwaysIncludePattern': true,
            'layout': {
                'type': 'pattern',
                'pattern': '[%r] [%x{pid}] [%p] [%c] %m',
                'tokens': {
                    'pid': function() {
                        return process.pid;
                    },
                    'serverName': function() {
                        return 'GameServer';
                    }
                }
            }
        },
        {
            'category': 'GmServer',
            'type': 'dateFile',
            'filename': '../logs/GmServer',
            'pattern': '-yyyy-MM-dd-hh',
            'alwaysIncludePattern': true,
            'layout': {
                'type': 'pattern',
                'pattern': '[%r] [%x{pid}] [%p] [%c] %m',
                'tokens': {
                    'pid': function() {
                        return process.pid;
                    },
                    'serverName': function() {
                        return 'GmServer';
                    }
                }
            }
        },
        {
            'category': 'BILogTool',
            'type': 'dateFile',
            'filename': '../logs/BILogTool',
            'pattern': '-yyyy-MM-dd',
            'alwaysIncludePattern': true,
            'layout': {
                'type': 'pattern',
                'pattern': '[%r] %m',
                'tokens': {
                    'serverName': function() {
                        return 'BILogTool';
                    }
                }
            }
        }
    ],
    'levels': {
        'Demo':'debug',
        'GameServer':'debug',
        'GmServer':'debug',
        'GameBILog':'debug',
        'BILogTool':'debug'
    }
});

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 常规配置
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 测试程序的日志对象
 */
var demo = log4js.getLogger('Demo'); /* 测试程序的日志对象 */
//demo.setLevel('INFO'); /* 选择注销，确保日志级别唯一 */
demo.setLevel('DEBUG'); /* 选择注销，确保日志级别唯一 */

/**
 * 游戏服务器的日志对象
 */
var gameServer = log4js.getLogger('GameServer'); /* 游戏服务器的日志对象 */
//gameServer.setLevel('INFO'); /* 选择注销，确保日志级别唯一 */
gameServer.setLevel('DEBUG'); /* 选择注销，确保日志级别唯一 */

/**
 * gm服务器的日志对象
 */
var gmServer = log4js.getLogger('GmServer'); /* gm服务器的日志对象 */
//gmServer.setLevel('INFO'); /* 选择注销，确保日志级别唯一 */
gmServer.setLevel('DEBUG'); /* 选择注销，确保日志级别唯一 */

/**
 * bi log服务器的日志对象
 */
var biLogTool= log4js.getLogger('BILogTool'); /* bi log服务器的日志对象 */
//biLogTool.setLevel('INFO'); /* 选择注销，确保日志级别唯一 */
biLogTool.setLevel('DEBUG'); /* 选择注销，确保日志级别唯一 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 行为日志
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * BI行为日志,参数是[int or string] 依次的表字段值(个数不定)
 * @returns []
 */
var logBI = function() {
    if(cfgControl.isWriteLogs) {
        var args = Array.prototype.slice.call(arguments);
        var contentStr = '';
        var now = new Date();
        var timeStr = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
        for(var i = 2; i < args.length; i++) {
            contentStr += ','+'\''+args[i]+'\'';
        }
        var log = '['+args[0]+']'+'['+args[1]+']'+'[\''+timeStr+'\''+contentStr+']';
        console.info(log);
    }
};

/**
 * BI行为日志,自带时间,参数是[int or string] 依次的表字段值(个数不定)
 * @returns []
 */
var logBIHaveTime = function() {
    if(cfgControl.isWriteLogs) {
        var args = Array.prototype.slice.call(arguments);
        var contentStr = '';
        for (var i = 2; i < args.length; i++) {
            contentStr += ',' + '\'' + args[i] + '\'';
        }
        contentStr = contentStr.substr(1);
        var log = '['+args[0]+']'+'['+args[1]+']'+'['+contentStr+']';
        console.info(log);
    }
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * GM行为日志
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * GM行为请求日志
 * @param err [int] 错误码
 * @param operatorId [int] 操作人ID
 * @param cmd [String] 消息号
 * @param userName [String] 被操作的角色名
 * @param zid [string] 区ID
 * @param obj [string] req请求
 * @param isWriteGmLog [bool] 是否写bi日志，true为写，false为不写
 * @returns []
 */
var logGM = function(err, operatorId, cmd, userName, zid, obj, isWriteGmLog) {
    if(err == gmCode.GM_SUCCESS){
        if(isWriteGmLog){
            logBI(0, biCode.logs_gm_operation, zid, '', '', '', operatorId, cmd, userName, JSON.stringify(obj));
        }
    }
    else{
        var now = new Date();
        var logsFormat = '{0}-{1}-{2} {3}:{4}:{5}';
        var timeStr = logsFormat.format(now.getFullYear(), now.getMonth()+1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
        var logsGMFormat = "[{0}]['{1}','{2}','{3}','{4}','{5}','{6}']";
        var log = logsGMFormat.format(err, timeStr, operatorId, cmd, userName, zid, JSON.stringify(obj));
        gmServer.info(log);
    }
};

/**
 * GM请求的返回日志
 * @param obj [string] res返回
 * @returns []
 */
var logGMRes = function(obj) {
    var logsGMFormat = "[{0}][{1}]";
    var log = logsGMFormat.format(gmCode.GM_RES, obj);
    gmServer.info(log);
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * bi log日志
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * bi log错误日志
 * @param str [String] 写进log的字符串
 * @returns []
 */
var biLogErr = function(str) {
    biLogTool.error(str);
};
/**
 * bi log信息日志
 * @param str [String] 写进log的字符串
 * @returns []
 */
var biLogInfo = function(str){
    biLogTool.info(str);
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 测试程序的日志对象
 */
exports.LoggerDemo = demo;

/**
 * 游戏服务器的日志对象
 */
exports.LoggerGame = gameServer;

/**
 * gm服务器的日志对象
 */
exports.LoggerGm = gmServer;

/**
 * bi log服务器的日志对象
 */
exports.LoggerBILog = biLogTool;

/**
 * BI行为日志,参数是[int or string] 依次的表字段值(个数不定)
 * @returns []
 */
exports.logBI = logBI;

/**
 * BI行为日志,自带时间,参数是[int or string] 依次的表字段值(个数不定)
 * @returns []
 */
exports.logBIHaveTime = logBIHaveTime;

/**
 * 输出对象参数的GM行为日志
 * @param err [int] 错误码
 * @param operatorId [int] 操作人ID
 * @param cmd [String] 消息号
 * @param userName [String] 被操作的角色名
 * @param zid [string] 区ID
 * @param obj [string] req请求
 * @param isWriteGmLog [bool] 是否写bi日志，true为写，false为不写
 * @returns []
 */
exports.logGM = logGM;

/**
 * GM请求的返回日志
 * @param obj [string] res返回
 * @returns []
 */
exports.logGMRes = logGMRes;

/**
 * bi log错误日志
 * @param str [String] 写进log的字符串
 * @returns []
 */
exports.biLogErr = biLogErr;

/**
 * bi log信息日志
 * @param str [String] 写进log的字符串
 * @returns []
 */
exports.biLogInfo = biLogInfo;