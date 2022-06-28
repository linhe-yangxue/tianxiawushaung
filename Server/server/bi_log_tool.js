/**
 * 写bi server的启动文件
 * 备注：加载worker后，程序就会启动
 */
var async = require('async');
var logger = require('./manager/log4_manager').LoggerBILog;
var worker = require('./bi_log_tool/worker.js');

var server_main = function() {
    logger.info("----------------- BILogServer Start OK -----------------");
    worker.begin();
};
server_main();