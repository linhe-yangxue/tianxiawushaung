/**
 * 包含的头文件
 */
var csvParse = require('../tools/parse/csv');
var csvManager = require('../manager/csv_manager');
var log = require('../manager/log4_manager').LoggerDemo;

csvParse.Instance().load('../config', function()
{
    csvManager.Instance();
    //log.debug(csvManager.Instance().Table3()[6]);
});
