
/**
 * 包含的头文件
 */
var packets = require('../packets/single_recharge');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var singleRechargeDb = require('../database/single_recharge');
var cSingleRecharge = require('../common/single_recharge');
var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取单冲信息
 */
var CS_GetSingleRechargeInfo = (function() {

    /**
     * 构造函数
     */
    function CS_GetSingleRechargeInfo() {
        this.reqProtocolName = packets.pCSGetSingleRechargeInfo;
        this.resProtocolName = packets.pSCGetSingleRechargeInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetSingleRechargeInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetSingleRechargeInfo();
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
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 初始化单冲状态 */
                function(callback) {
                    cSingleRecharge.refreshSingleRecharge(req.zid, req.zuid, callback);
                },

                /* 获取所有单冲活动对象 */
                function(callback) {
                    singleRechargeDb.getAllSingleRecharges(req.zid, req.zuid, callback);
                },

                function(asr, callback) {
                    var tt = cSingleRecharge.getBeginEndTime();
                    res.beginTime = tt[0];
                    res.endTime = tt[1];
                    res.singleRecharges = asr;
                    callback(null);
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
    return CS_GetSingleRechargeInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取单冲奖励
 */
var CS_RevSingleRechargeReward = (function() {

    /**
     * 构造函数
     */
    function CS_RevSingleRechargeReward() {
        this.reqProtocolName = packets.pCSRevSingleRechargeReward;
        this.resProtocolName = packets.pSCRevSingleRechargeReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RevSingleRechargeReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RevSingleRechargeReward();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.index) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.index = parseInt(req.index);

            if(isNaN(req.zid) || isNaN(req.index)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取单冲活动对象 */
                function(callback) {
                    var now = Date.now() / 1000;
                    if(!cSingleRecharge.isInSingleRechargeTime(now)) {
                        callback(retCode.NOT_IN_ACT_TIME);
                        return;
                    }

                    singleRechargeDb.getSingleRecharge(req.zid, req.zuid, req.index, callback);
                },

                function(sr, callback) {
                    if(sr.revCnt >= sr.rechargeCnt) {
                        callback(retCode.CAN_NOT_RECIVE_PRIZE);
                        return;
                    }

                    /* 更新单冲活动 */
                    sr.revCnt ++;
                    singleRechargeDb.setSingleRecharge(req.zid, req.zuid, sr);

                    /* 发奖励 */
                    var sreLine = csvManager.SingleRechargeEvent()[sr.index];
                    if(!sreLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    var arrAdd = [];
                    var itemsStrs = sreLine.REWARDE.split('|');
                    for(var i = 0; i < itemsStrs.length; ++i) {
                        var itemStr = itemsStrs[i].split('#');
                        var item = new globalObject.ItemBase();
                        item.tid = parseInt(itemStr[0]);
                        item.itemNum = parseInt(itemStr[1]);
                        arrAdd.push(item);
                    }

                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.SINGLE_RECHARGE_REWARD, sr.index, function(err, retAdd) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.rewards = retAdd;
                            callback(null);
                        }
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
    return CS_RevSingleRechargeReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetSingleRechargeInfo());
    exportProtocol.push(new CS_RevSingleRechargeReward());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
