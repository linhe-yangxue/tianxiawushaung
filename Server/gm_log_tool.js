/**
 * 写bi server的启动文件
 * 备注：加载worker后，程序就会启动
 */
var async = require('async');
var logger = require('./manager/log4_manager').LoggerBILog;
var worker = require('./gm_log_tool/worker.js');

var server_main = function() {
    logger.info("-----------------GM BILogServer Start OK -----------------");
    worker.begin();
};
server_main();