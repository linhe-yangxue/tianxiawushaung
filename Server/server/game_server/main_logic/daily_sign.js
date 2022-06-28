/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：每日签到请求：发给客户端这次应该签到的次数，每日签到领取记录这次签到，以便下次续签
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/daily_sign');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager =  require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var signDb = require('../database/activity/daily_sign');
var playerDB = require('../database/player');
var timeUtil = require('../../tools/system/time_util');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var singleChargeDB = require('../database/charge');
var filterCommon = require('../common/filter_common');
var dateFormat = require('dateformat');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日签到请求
 */
var CS_DailySignQuery = (function() {

    /**
     * 构造函数
     */
    function CS_DailySignQuery() {
        this.reqProtocolName = packets.pCSDailySignQuery;
        this.resProtocolName = packets.pSCDailySignQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DailySignQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DailySignQuery();
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

            var nowTime = parseInt(new Date().getTime() / 1000);
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取签到状态 结果为Sign类对象 */
                function(callback) {
                    signDb.getSign(req.zid, req.zuid, nowTime, callback);
                },
                function(signObj, callback) {
                    var time = parseInt(signObj.signTime);
                    var date =  new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date,0);
                    var index = signObj.signNum;
                    if(time <= zeroTime && (1 == signObj.isSign)) { /* 零点刷新签到次数，刷满28天重新再签到 */
                        signDb.refreshSign(req.zid, req.zuid, nowTime, index, function(err, sign) {
                            if(err) {
                                callback(err);
                                return;
                            }
                            res.signNum = sign.signNum;
                            res.isSign = sign.isSign;
                            callback(null);
                        });
                    }
                    else { /* 未到零点不刷新签到次数，保留这次请求的时间*/
                        signObj.signTime = nowTime;
                        signDb.saveSign(req.zid, req.zuid, signObj);
                        res.signNum = signObj.signNum;
                        res.isSign = signObj.isSign;
                        callback(null);
                    }
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
    return CS_DailySignQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日签到领取
 */
var CS_DailySign = (function() {

    /**
     * 构造函数
     */
    function CS_DailySign() {
        this.reqProtocolName = packets.pCSDailySign;
        this.resProtocolName = packets.pSCDailySign;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DailySign.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DailySign();
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
            var dailySignData = csvManager.DailySignEvent();
            var sign = new globalObject.Sign();
            var number = 0;
            var playerLevel = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取签到状态 结果为Sign类对象 */
                function(callback) {
                    var nowTime = parseInt(Date.now() / 1000);
                    signDb.getSign(req.zid, req.zuid, nowTime, callback);
                },
                function(data, callback) {
                    sign = data;
                    if(1 == sign.isSign) { /* 重复签到拦截 */
                        callback(retCode.CAN_NOT_SIGN);
                        return;
                    }
                    var index = sign.signNum + 1000;
                    playerDB.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        playerLevel = player.character.level;
                        if(0 != dailySignData[index].VIP_LEVEL && player.vipLevel >= dailySignData[index].VIP_LEVEL ) { /*指定VIP等级双倍数量*/
                            number = 2 * parseInt(dailySignData[index].COUNT);
                            callback(null, index);
                        }
                        else {
                            number = parseInt(dailySignData[index].COUNT);
                            callback(null, index);
                        }
                    });
                },
                function(indexNum, callback) {
                    /* 领取物品*/
                    var buyArr = [];
                    var buy = new protocolObject.ItemObject();
                    buy.itemNum = number;
                    buy.tid = dailySignData[indexNum].ITEM_ID;
                    buyArr.push(buy);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], buyArr, req.channel,
                        req.acc, logsWater.DAILYSIGN_LOGS, buy.tid, function(err, subArr, addArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.isSignSuccess = 1;
                        res.item = addArr;
                        if(0 == addArr.length) {
                            res.item = buyArr;
                        }
                        sign.isSign = 1;
                        signDb.saveSign(req.zid, req.zuid, sign);
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
                    logger.logBI(preZid, biCode.logs_sign, preZid, req.channel, req.zuid, req.zuid, playerLevel, sign.signNum);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_DailySign;
})();
/**-------------------------------------------------------------------------------------------------------------------*/



/**
 * 豪华签到请求
 */
var CS_LuxurySignQuery = (function() {

    /**
     * 构造函数
     */
    function CS_LuxurySignQuery() {
        this.reqProtocolName = packets.pCSLuxurySignQuery;
        this.resProtocolName = packets.pSCLuxurySignQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_LuxurySignQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_LuxurySignQuery();
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

            var nowTime = parseInt(new Date().getTime() / 1000);
            var date =  new Date().toDateString();
            var zeroTime = timeUtil.getDetailTime(date,0);
            var dateTwo = dateFormat(date,'yyyy-mm-dd');
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    signDb.getLuxurySign(req.zid, req.zuid, nowTime, callback);
                },
                function(luxurySignObj, callback) {
                    var time = parseInt(luxurySignObj.signTime);
                    var rechargeInfo = [];
                    if (time <= zeroTime ) {  /* 零点刷新 */
                        luxurySignObj.isSign = 0;
                        luxurySignObj.signTime = nowTime;
                        luxurySignObj.isRecharge = 0;
                        res.isSign = luxurySignObj.isSign;
                        res.isRecharge = luxurySignObj.isRecharge;
                        signDb.saveLuxurySign(req.zid, req.zuid, luxurySignObj);
                        callback(null);
                    }
                    else if (luxurySignObj.isSign == 1 || luxurySignObj.isRecharge == 1) { /* 已经签到或已经充钱 */
                        luxurySignObj.signTime = nowTime;
                        res.isSign = luxurySignObj.isSign;
                        res.isRecharge = luxurySignObj.isRecharge;
                        signDb.saveLuxurySign(req.zid, req.zuid, luxurySignObj);
                        callback(null);
                    }
                    else{

                            singleChargeDB.getSingleCharge(req.zid, req.zuid, function(err, info) {
                                if (err  || null == info) {
                                    callback(err);
                                    return;
                                }
                                rechargeInfo = info;
                                if(info.date == dateTwo) {
                                    luxurySignObj.isRecharge = 1;
                                    luxurySignObj.signTime = nowTime;
                                    res.isSign = luxurySignObj.isSign;
                                    res.isRecharge = luxurySignObj.isRecharge;
                                    signDb.saveLuxurySign(req.zid, req.zuid, luxurySignObj);
                                    callback(null);
                                }
                                else {
                                    luxurySignObj.signTime = nowTime;
                                    res.isSign = luxurySignObj.isSign;
                                    res.isRecharge = luxurySignObj.isRecharge;
                                    signDb.saveLuxurySign(req.zid, req.zuid, luxurySignObj);
                                    callback(null);
                                }
                            });
                    }
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
    return CS_LuxurySignQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 豪华签到领取
 */
var CS_LuxurySign = (function() {

    /**
     * 构造函数
     */
    function CS_LuxurySign() {
        this.reqProtocolName = packets.pCSLuxurySign;
        this.resProtocolName = packets.pSCLuxurySign;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_LuxurySign.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_LuxurySign();
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

            var luxurySign = new globalObject.LuxurySign();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    var nowTime = parseInt(Date.now() / 1000);
                    signDb.getLuxurySign(req.zid, req.zuid, nowTime, function(err, data) {
                       if(err) {
                           callback(err);
                           return;
                       }
                        luxurySign = data;
                        callback(null);
                    });
                },
                function(callback) {
                    if (1 == luxurySign.isSign) {
                        callback(retCode.CAN_NOT_LUXURYSIGN);
                        return;
                    }
                    var characterLevelExp = csvManager.CharacterLevelExp();
                    playerDB.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        var awardArr = filterCommon.splitItemStr(characterLevelExp[player.character.level].SIGN_GROUP_ID, '|', '#');
                        var tmpArr = filterCommon.getItemsInPackageOrNot(awardArr, false);
                        cPackage.updateItemWithLog(req.zid, req.zuid, [], awardArr, req.channel, req.acc, logsWater.LUXURYSIGN, 0,function (err, costArr , addArr) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            res.isSignSuccess = 1;
                            res.item = addArr.concat(tmpArr);
                            luxurySign.isSign = 1;
                            signDb.saveLuxurySign(req.zid, req.zuid, luxurySign);
                            callback(null);
                        });
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
    return CS_LuxurySign;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_DailySignQuery());
    exportProtocol.push(new CS_DailySign());
    exportProtocol.push(new CS_LuxurySignQuery());
    exportProtocol.push(new CS_LuxurySign());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
