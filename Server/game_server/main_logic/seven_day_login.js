/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：七日登陆
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/seven_day_login');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var dateFormat = require('dateformat');
var filter = require('../common/filter_common');
var logsWater = require('../../common/logs_water');
var sevenActivityDb = require('../database/activity/seven_day_login');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 七日登录送礼请求
 */
var CS_SevenDayLoginQuery = (function() {

    /**
     * 构造函数
     */
    function CS_SevenDayLoginQuery() {
        this.reqProtocolName = packets.pCSSevenDayLoginQuery;
        this.resProtocolName = packets.pSCSevenDayLoginQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SevenDayLoginQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SevenDayLoginQuery();
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
            date = dateFormat(date, 'yyyy-mm-dd');
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取上次登录日期 */
                function(callback) {
                    sevenActivityDb.updateLastLoginDate(req.zid, req.zuid, date, callback);
                },
                function(lastDate, callback) {
                    var diff = new Date(date) - new Date(lastDate);
                    if(diff) {
                        sevenActivityDb.incrLoginDay(req.zid, req.zuid, callback); /* 递增并返回登录天数 */
                    }
                    else {
                        sevenActivityDb.getLoginDay(req.zid, req.zuid, callback); /* 获取已登录天数 */
                    }
                },
                /* 获取已领取奖励所对应的配表索引数组 */
                function(loginDay, callback) {
                    res.loginDay = loginDay;
                    sevenActivityDb.getRewardIndexArr(req.zid, req.zuid, function(err, array) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.indexArr = array;
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
    return CS_SevenDayLoginQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 七日登录送礼领取
 */
var CS_SevenDayLoginReward = (function() {

    /**
     * 构造函数
     */
    function CS_SevenDayLoginReward() {
        this.reqProtocolName = packets.pCSSevenDayLoginReward;
        this.resProtocolName = packets.pSCSevenDayLoginReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SevenDayLoginReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SevenDayLoginReward();
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
            var configTable = csvManager.SevenDayLoginEvent();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取已登录的天数 */
                function(callback) {
                    sevenActivityDb.getLoginDay(req.zid, req.zuid, callback);
                },
                function(day, callback) {
                    if( req.index > day) { /* 登录天数不对*/
                        callback(retCode.DAY_NUM_ERR);
                        return;
                    }
                    if(null == configTable[req.index]) { /* 索引不在配表范围*/
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    sevenActivityDb.getAwardBefore(req.zid, req.zuid, req.index, callback);
                },
                function(flag, callback) {
                    if(!flag) { /* 拦截重复领取 */
                        callback(retCode.CAN_NOT_REWARD_FUND);
                        return;
                    }
                    /* 奖励发放给玩家 */
                    var itemArr = filter.splitItemStr(configTable[req.index].LOGIN_AWARD, '|', '#');
                    var tmpArr = filter.getItemsInPackageOrNot(itemArr, false);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], itemArr,
                        req.channel, req.acc, logsWater.SEVEN_DAY_LOGIN_REWARD_LOGS, req.index, function(err, subArr, addArr) {
                            if(err) {
                                callback(err);
                                return;
                            }
                            res.items = addArr.concat(tmpArr);
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
    return CS_SevenDayLoginReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_SevenDayLoginQuery());
    exportProtocol.push(new CS_SevenDayLoginReward());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
