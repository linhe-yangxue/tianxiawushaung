
/**
 * 包含的头文件
 */
var packets = require('../packets/guild_exp');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var playerDb = require('../database/player');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var guildCommon = require('../common/guild_common');
var cfgControl = require('../../../server_config/control.json');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会经验
 */
var CS_AddGuildExp = (function() {

    /**
     * 构造函数
     */
    function CS_AddGuildExp() {
        this.reqProtocolName = packets.pCSAddGuildExp;
        this.resProtocolName = packets.pSCAddGuildExp;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AddGuildExp.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_AddGuildExp();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.exp) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.exp = parseInt(req.exp);

            if(false || isNaN(req.zid) || isNaN(req.exp)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    guildCommon.addGuildExp(req.zid, req.zuid,  req.exp, callback);
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
    return CS_AddGuildExp;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    if(cfgControl.cheatProtocal) {
        exportProtocol.push(new CS_AddGuildExp());
    }


    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

