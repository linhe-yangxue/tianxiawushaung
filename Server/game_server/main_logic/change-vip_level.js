
/**
 * 包含的头文件
 */
var packets = require('../packets/change_vip_level');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var cMission = require('../common/mission');
var logsWater = require('../../common/logs_water');
var cfgControl = require('../../../server_config/control.json');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 改变vip等级
 */
var CS_ChangeVipLevel = (function() {

    /**
     * 构造函数
     */
    function CS_ChangeVipLevel() {
        this.reqProtocolName = packets.pCSChangeVipLevel;
        this.resProtocolName = packets.pSCChangeVipLevel;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChangeVipLevel.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChangeVipLevel();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.vipLevel) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.vipLevel = parseInt(req.vipLevel);

            if(isNaN(req.zid) || isNaN(req.vipLevel)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, true, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        player.vipLevel = req.vipLevel;
                        playerDb.savePlayerData(req.zid, req.zuid, player,true, callback);

                        /* 更新任务进度 */
                        cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_13, 0, req.vipLevel);
                        cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_13, 0, 0, req.vipLevel);
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
    return CS_ChangeVipLevel;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];

    if(cfgControl.cheatProtocal) {
        exportProtocol.push(new CS_ChangeVipLevel());
    }

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
