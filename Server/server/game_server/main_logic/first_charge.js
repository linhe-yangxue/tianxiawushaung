/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：首冲送礼
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/first_charge');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var csvManager = require('../../manager/csv_manager').Instance();
var chargeDb = require('../database/charge');
var firstChargeDb = require('../database/activity/first_charge');
var filter = require('../common/filter_common');
var logsWater = require('../../common/logs_water');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 首冲请求
 */
var CS_FirstChargeQuery = (function() {

    /**
     * 构造函数
     */
    function CS_FirstChargeQuery() {
        this.reqProtocolName = packets.pCSFirstChargeQuery;
        this.resProtocolName = packets.pSCFirstChargeQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FirstChargeQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FirstChargeQuery();
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


            if(false || isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 判断是否进行过充值 */
                function(callback) {
                    chargeDb.getTotalCharge(req.zid, req.zuid, callback);
                },
                /* 获取首冲礼包是否已领取 */
                function(money, callback) {
                    if(null != money) { /* 进行过首冲 */
                        res.code = 1;
                    }
                    firstChargeDb.acceptAwardBefore(req.zid, req.zuid, function(err, received) {
                        if(err) {
                            callback(retCode.DB_ERR);
                            return;
                        }
                        if(null != money && null != received) { /* 首充礼包已领取 */
                            res.code = 2;
                        }
                        callback(null);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_FirstChargeQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 首冲送礼
 */
var CS_FirstChargeReward = (function() {

    /**
     * 构造函数
     */
    function CS_FirstChargeReward() {
        this.reqProtocolName = packets.pCSFirstChargeReward;
        this.resProtocolName = packets.pSCFirstChargeReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FirstChargeReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FirstChargeReward();
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


            if(false || isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获得充值金额 */
                function(callback) {
                    chargeDb.getTotalCharge(req.zid, req.zuid, callback);
                },
                /* 拦截还未充值 */
                function(money, callback) {
                    if(null == money) {
                        callback(retCode.HAVE_NOT_CHARGE);
                        return;
                    }
                    firstChargeDb.acceptAwardBefore(req.zid, req.zuid, callback);
                },
                /* 奖励发放给玩家 */
                function(flag, callback) {
                    if(flag) { /* 拦截重复领取 */
                        callback(retCode.CHARGE_REWARD_RECEIVED);
                        return;
                    }

                    var groupIdStr = csvManager.FirstRechargeEvent()[1].REWARD;
                    var itemArr = filter.splitItemStr(groupIdStr, '|', '#');

                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, [], itemArr,
                        req.channel, req.acc, logsWater.FIRSTCHARGE_LOGS, 1, function(err, addArr) {
                            res.rewards = addArr ? addArr : [];
                            callback(err);
                        });
                },
                /* 设置奖励为已领取 */
                function(callback) {
                    firstChargeDb.acceptFirstChargeAward(req.zid, req.zuid);
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_FirstChargeReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_FirstChargeQuery());
    exportProtocol.push(new CS_FirstChargeReward());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

