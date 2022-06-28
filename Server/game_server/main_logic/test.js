
/**
 * 包含的头文件
 */
var packets = require('../packets/test');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 测试
 */
var CS_Test = (function() {

    /**
     * 构造函数
     */
    function CS_Test() {
        this.reqProtocolName = packets.pCSTest;
        this.resProtocolName = packets.pSCTest;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_Test.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_Test();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            http.sendResponseWithResultCode(response, res, retCode.ERR);
        });
    };
    return CS_Test;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_Test());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
