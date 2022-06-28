/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：图鉴功能
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/atlas');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var atlasDB = require('../database/atlas');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 图鉴
 */
var CS_PetAlbum = (function() {

    /**
     * 构造函数
     */
    function CS_PetAlbum() {
        this.reqProtocolName = packets.pCSPetAlbum;
        this.resProtocolName = packets.pSCPetAlbum;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PetAlbum.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PetAlbum();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    atlasDB.delAtlasNotice(req.zid, req.zuid);
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    atlasDB.getAtlas(req.zid, req.zuid, function(err, atlas) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        res.tidArr = atlas;
                        callback(null);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_PetAlbum;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_PetAlbum());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

