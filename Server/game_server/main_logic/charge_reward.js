/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：充值送礼
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/charge_reward');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var chargeDb = require('../database/charge');
var activityTimeDb = require('../database/activity_time');
var csvManager = require('../../manager/csv_manager').Instance();
var filter = require('../common/filter_common');
var logger = require('../../manager/log4_manager');
var globalObject = require('../../common/global_object');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 充值送礼请求
 */
var CS_ChargeRewardQuery = (function() {

    /**
     * 构造函数
     */
    function CS_ChargeRewardQuery() {
        this.reqProtocolName = packets.pCSChargeRewardQuery;
        this.resProtocolName = packets.pSCChargeRewardQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChargeRewardQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChargeRewardQuery();
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

            var chargeArr = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取累计充值总金额 */
                function(callback) {
                    chargeDb.getTotalCharge(req.zid, req.zuid, callback);
                },
                function(money, callback) {
                    if(null != money) {
                        res.money = parseInt(money);
                    }
                    var preZid = cZuid.zuidSplit(req.zuid);
                    /* 从GM获取累充送礼的奖励信息和活动开始结束时间信息 */
                    activityTimeDb.getActivityTime(req.zid, preZid[0], 1, callback);
                },
                function(chargeAwardInfo, callback) {
                    if(null == chargeAwardInfo) {
                        callback(retCode.SUCCESS);
                        return;
                    }
                    chargeArr = chargeAwardInfo.chargeAward; /* 奖励信息数组 */
                    chargeDb.getChargeAwards(req.zid, req.zuid, callback);
                },
                function(array, callback) {
                    var i = 0;
                    var awardInfo = null;
                    var awardArr = [];
                    var len = chargeArr.length;
                    if(array.length == 0) {
                        for( i = 0; i < len; ++i) {
                            if (!chargeArr[i]) {
                                continue;
                            }
                            awardInfo = new globalObject.AwardInfo();
                            awardInfo.rmbNum = chargeArr[i].rmbNum;
                            awardInfo.items = chargeArr[i].items;
                            awardArr.push(awardInfo);
                        }
                    } else {
                        for(i = 0; i < len; ++i) {
                            if (!chargeArr[i]) {
                                continue;
                            }
                            awardInfo = new globalObject.AwardInfo();
                            if(-1 == array.indexOf(chargeArr[i].rmbNum)) {
                                awardInfo.rmbNum = chargeArr[i].rmbNum;
                                awardInfo.items = chargeArr[i].items;
                            } else {
                                awardInfo.rmbNum = chargeArr[i].rmbNum;
                                awardInfo.items = chargeArr[i].items;
                                awardInfo.hasAward = 1;
                            }
                            awardArr.push(awardInfo);
                        }
                    }
                    res.indexArr = awardArr;
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
    return CS_ChargeRewardQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 充值送礼领取
 */
var CS_ChargeReward = (function() {

    /**
     * 构造函数
     */
    function CS_ChargeReward() {
        this.reqProtocolName = packets.pCSChargeReward;
        this.resProtocolName = packets.pSCChargeReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChargeReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChargeReward();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.rmbNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.rmbNum = parseInt(req.rmbNum);

            if(false || isNaN(req.zid) || isNaN(req.rmbNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var activityInfo = null;
            var awardArr = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取GM中配置的充值金额信息以及对应的奖励信息 */
                function(callback) {
                    var preZid = cZuid.zuidSplit(req.zuid);
                    activityTimeDb.getActivityTime(req.zid, preZid[0], 1, callback);
                },
                /* 获取累计充值金额 */
                function(info, callback) {
                    var nowTime = parseInt(Date.now() / 1000);
                    activityInfo = info;
                    if(!activityInfo || nowTime > activityInfo.endAwardTime || null == activityInfo.chargeAward) { /* 时间不对 */
                        callback(retCode.TIME_OVERDUE);
                        return;
                    }
                    chargeDb.getTotalCharge(req.zid, req.zuid, callback);
                },
                /* 判断是否满足奖励领取条件 */
                function(money, callback) {
                    var chargeArr = activityInfo.chargeAward;
                    for(var i = 0, len =  chargeArr.length; i < len; ++i) {
                        if(null != chargeArr[i].rmbNum && req.rmbNum == chargeArr[i].rmbNum) {
                            awardArr = chargeArr[i].items;
                            break;
                        }
                    }
                    if(null == money || 0 == awardArr.length || money < req.rmbNum) {  /* 累计充值不足 */
                        callback(retCode.HAVE_NOT_CHARGE);
                        return;
                    }
                    /* 获取奖励领取信息 */
                    chargeDb.updateChargeReward(req.zid, req.zuid, req.rmbNum, function(err, mark) {
                        if(err) {
                            callback(retCode.DB_ERR);
                            return;
                        }
                        if(0 == mark) { /* 防止重复领取*/
                            callback(retCode.CAN_NOT_REWARD_AGAIN);
                            return;
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    var tmpArr = filter.getItemsInPackageOrNot(awardArr, false);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], awardArr, req.channel, req.acc,
                        logsWater.CHARGE_AWARD_LOGS, req.rmbNum, function(err, subArr, addArr) { /* 成功领取 */
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.awardArr = addArr.concat(tmpArr);
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
    return CS_ChargeReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 活动相关时间
 */
var CS_OpenEndTime = (function() {

    /**
     * 构造函数
     */
    function CS_OpenEndTime() {
        this.reqProtocolName = packets.pCSOpenEndTime;
        this.resProtocolName = packets.pSCOpenEndTime;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_OpenEndTime.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_OpenEndTime();
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
                /* 获取活动相关时间 */
                function(callback) {
                    var preZid = cZuid.zuidSplit(req.zuid);
                    activityTimeDb.getAllActivityTime(req.zid, preZid[0], callback);
                },
                function(array, callback) {
                    if(null != array[0]) {
                        /* 充值送礼活动时间 */
                        res.rechargeTime.activityOpenTime = array[0].beginTime;
                        res.rechargeTime.activityEndTime = array[0].endTime;
                        res.rechargeTime.rewardEndTime = array[0].endAwardTime;
                    }
                    if(null != array[1]) {
                        /* 累计消费活动时间 */
                        res.cumulativeTime.activityOpenTime = array[1].beginTime;
                        res.cumulativeTime.activityEndTime = array[1].endTime;
                        res.cumulativeTime.rewardEndTime = array[1].endAwardTime;
                    }
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
    return CS_OpenEndTime;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_ChargeRewardQuery());
    exportProtocol.push(new CS_ChargeReward());
    exportProtocol.push(new CS_OpenEndTime());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

