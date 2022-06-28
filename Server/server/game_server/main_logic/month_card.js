
/**
 * 包含的头文件
 */
var packets = require('../packets/month_card');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var protocolObject = require('../../common/protocol_object');
var logsWater = require('../../common/logs_water');
var type = require('../common/item_type');
var csvManager = require('../../manager/csv_manager').Instance();
var filter = require('../common/filter_common');
var monthCardDb = require('../database/activity/month_card');
var timeUtil = require('../../tools/system/time_util');
var dateFormat = require('dateformat');
var notifDb = require('../database/notification');
var cNotif = require('../common/notification');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/


/**
 * 月卡领取
 */
var CS_MonthCardReward = (function() {

    /**
     * 构造函数
     */
    function CS_MonthCardReward() {
        this.reqProtocolName = packets.pCSMonthCardReward;
        this.resProtocolName = packets.pSCMonthCardReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MonthCardReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MonthCardReward();
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

            if(false || isNaN(req.zid) || isNaN(req.index)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var ChargeConfig = csvManager.ChargeConfig();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 通过配表索引获取相应商品的购买订单 */
                function(callback) {
                    if(null == ChargeConfig[req.index] || 0 == ChargeConfig[req.index].IS_CARD) { /* 拦截无效索引 */
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    monthCardDb.getMonthCardDate(req.zid, req.zuid,  req.index, callback);
                },
                /* 判断是否已买月卡 */
                function(dateStr, callback) {
                    var date = new Date().toDateString();
                    var todayDate = new Date(dateFormat(date, 'yyyy-mm-dd')); /* 今日日期 */
                    var deadDate = new Date(dateStr);
                    var diff = (deadDate - todayDate) / 1000 / 3600 / 24; /* 获取月卡剩余天数 */
                    if(diff <= 0) {
                        callback(retCode.NO_MONTH_CARD);
                        return;
                    }
                    callback(null);
                },
                /* 判断是否已领取过 */
                function(callback) {
                    monthCardDb.receiveBefore(req.zid, req.zuid, req.index, callback);
                },
                function(flag, callback) {
                    if(!flag) { /* 防止重复领取 */
                        callback(retCode.MONTH_CARD_RECEIVED);
                        return;
                    }

                    notifDb.addNotification(req.zid, req.zuid, cNotif.NOTIF_TASK_REFRESH);

                    var awardStr = ChargeConfig[req.index].DAILY_REWARD;
                    var awardArr = filter.splitItemStr(awardStr, '|', '#');
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], awardArr, req.channel,
                        req.acc, logsWater.MONTH_CARD_LOGS, req.index, function(err, subArr, addArr) { /* 加元宝 */
                            if(err) {
                                callback(err);
                                return;
                            }
                            res.diamond = awardArr[0].itemNum;
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
    return CS_MonthCardReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 月卡请求
 */
var CS_MonthCardQuery = (function() {

    /**
     * 构造函数
     */
    function CS_MonthCardQuery() {
        this.reqProtocolName = packets.pCSMonthCardQuery;
        this.resProtocolName = packets.pSCMonthCardQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MonthCardQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MonthCardQuery();
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
            var date = new Date().toDateString();
            var todayDate = new Date(dateFormat(date, 'yyyy-mm-dd'));
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    monthCardDb.getMonthCardsDates(req.zid, req.zuid, 1, 2, callback)
                },
                function(array, callback) {
                    var cheapDeadDate = new Date(array[0]);
                    var expensiveDeadDate = new Date(array[1]);
                    var diff = (cheapDeadDate - todayDate) / 1000 / 3600 / 24;
                    if(diff > 0) {
                        res.cheapLeft = diff; /* 获取小月卡剩余天数 */
                    }
                    diff = (expensiveDeadDate - todayDate) / 1000 / 3600 / 24;
                    if(diff > 0) {
                        res.expensiveLeft = diff; /* 获取大月卡剩余天数 */
                    }
                    callback(null);
                },
                /* 判断是否有大小月卡 并保存本次请求时间 */
                function(callback) {
                    if(0 != res.cheapLeft) {
                        res.haveCheapCard = 1;
                    }
                    if(0 != res.expensiveLeft) {
                        res.haveExpensiveCard = 1;
                    }
                    var nowTime = parseInt(Date.now() / 1000);
                    monthCardDb.getSetFreshTime(req.zid, req.zuid, nowTime, callback);
                },
                /* 月卡领取每日刷新判断 */
                function(time, callback) {
                    var zeroTime = timeUtil.getDetailTime(date, 0);
                    monthCardDb.getCardInfo(req.zid, req.zuid, time, zeroTime, function(err, array) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.cardArr = array;
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
    return CS_MonthCardQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/


/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_MonthCardReward());
    exportProtocol.push(new CS_MonthCardQuery());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;


