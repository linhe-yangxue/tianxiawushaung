/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：领仙桃功能
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/reward_peach');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var accountDb = require('../database/account');
var peachDb = require('../database/activity/reward_peach');
var async = require('async');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var timeUtil = require('../../tools/system/time_util');
var csvManager = require('../../manager/csv_manager').Instance();
var protocolObject = require('../../common/protocol_object');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var itemType = require('../common/item_type');
var cZuid = require('../common/zuid');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领仙桃
 */
var CS_RewardPower = (function() {

    /**
     * 构造函数
     */
    function CS_RewardPower() {
        this.reqProtocolName = packets.pCSRewardPower;
        this.resProtocolName = packets.pSCRewardPower;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RewardPower.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RewardPower();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
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
            var energyData = csvManager.EnergyEvent();
            var nowTime = parseInt(Date.now() / 1000);
            var powerInfo = {};
            var addStamina = 0;/*要加的体力值*/
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取玩家领取仙桃状态信息 */
                function(callback) {
                    peachDb.getPeachInfo(req.zid, req.zuid, nowTime, function(err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        powerInfo = data;
                        callback(null);
                    });
                },
                /* 判断是否在领取时间内 */
                function(callback) {
                    var date = new Date().toDateString();
                    var twelveTime = timeUtil.getDetailTime(date, parseInt(energyData[1].START_TIME));
                    var fourteenTime = timeUtil.getDetailTime(date, parseInt(energyData[1].END_TIME));
                    var eighteenTime = timeUtil.getDetailTime(date, parseInt(energyData[2].START_TIME));
                    var twentyTime = timeUtil.getDetailTime(date, parseInt(energyData[2].END_TIME));
                    /* 判断是否在领取时间段一内 */
                    if(twelveTime <= nowTime && nowTime <= fourteenTime && 0 == powerInfo.isPower_1) {
                        powerInfo.isPower_1 = 1;
                        callback(null);
                        return;
                    }
                    /* 判断是否在领取时间段二内 */
                    if(eighteenTime <= nowTime && nowTime <= twentyTime && 0 == powerInfo.isPower_2) {
                        powerInfo.isPower_2 = 1;
                        callback(null);
                        return;
                    }
                    callback(retCode.CAN_NOT_REWARD_POWER);
                },
                function(callback) {
                    var powerArr = [];
                    var item = new protocolObject.ItemObject();
                    item.tid = energyData[1].ITEM;
                    item.itemNum = energyData[1].NUMBER;
                    powerArr.push(item);
                    if(item.tid == itemType.ITEM_TYPE_STAMINA){
                        addStamina = item.itemNum;
                    }
                    cPackage.updateItemWithLog(req.zid, req.zuid, [],
                        powerArr, req.channel, req.acc, logsWater.REWARDPOWER_LOGS, item.tid, function(err) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        peachDb.savePeachInfo(req.zid, req.zuid, powerInfo);
                        callback(null);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 4, 0, 1);
                    if(addStamina > 0){
                        logger.logBI(preZid, biCode.logs_stamina, preZid, req.channel, req.zuid, req.zuid, 0, 0,
                            logsWater.REWARDPOWER_LOGS, itemType.ITEM_TYPE_STAMINA, 0, addStamina, 0, 0, 0);
                    }
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_RewardPower;
})();

/**
 * 领仙桃请求
 */
var CS_PowerQuery = (function() {

    /**
     * 构造函数
     */
    function CS_PowerQuery() {
        this.reqProtocolName = packets.pCSPowerQuery;
        this.resProtocolName = packets.pSCPowerQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PowerQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PowerQuery();
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
            var nowTime = parseInt(Date.now() / 1000);
            var powerInfo = {};
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取玩家领取仙桃状态信息 */
                function(callback) {
                    peachDb.getPeachInfo(req.zid, req.zuid, nowTime, function(err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        powerInfo = data;
                        callback(null);
                    });
                },
                /* 每日刷新领取状态，以便下次可以继续领取*/
                function(callback) {
                    var date = new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date, 0);
                    if(powerInfo.freshTime < zeroTime) {
                        powerInfo.isPower_1 = 0;
                        powerInfo.isPower_2 = 0;
                    }
                    powerInfo.freshTime = nowTime;
                    res.isPower_1 = powerInfo.isPower_1;
                    res.isPower_2 = powerInfo.isPower_2;
                    peachDb.savePeachInfo(req.zid, req.zuid, powerInfo);
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
    return CS_PowerQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_RewardPower());
    exportProtocol.push(new CS_PowerQuery());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
