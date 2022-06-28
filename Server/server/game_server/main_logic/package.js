/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取背包内容
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：floven [审阅完成]
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/package');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var packageDb = require('../database/package');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取背包
 */
var CS_GetPackageList = (function() {

    /**
     * 构造函数
     */
    function CS_GetPackageList() {
        this.reqProtocolName = packets.pCSGetPackageList;
        this.resProtocolName = packets.pSCGetPackageList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetPackageList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetPackageList();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.pkgId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.pkgId = parseInt(req.pkgId);

            if(isNaN(req.zid) || isNaN(req.pkgId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            /* Package ID 验证 */
            if(req.pkgId < 1 || req.pkgId > 7) {
                http.sendResponseWithResultCode(response, res, retCode.ERR );
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取背包数据 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, req.pkgId, false, callback);
                },

                /* 设置返回值 */
                function(pack, callback) {
                    for(var i = 0; i < pack.content.length; ++i) {
                        res.itemList[pack.content[i].itemId] = pack.content[i];
                    }
                    res.pkgId = req.pkgId;
                    callback(null);
                }

            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetPackageList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetPackageList());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
