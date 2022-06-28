/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：次日登录奖励领取
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/login_reward');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var loginRewardDb = require('../database/activity/login_reward');
var csvExtends = require('../../manager/csv_manager').Instance();
var protocolObject = require('../../common/protocol_object');
var filter = require('../common/filter_common');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 次日录送礼请求
 */
var CS_LoginRewardQuery = (function() {

    /**
     * 构造函数
     */
    function CS_LoginRewardQuery() {
        this.reqProtocolName = packets.pCSLoginRewardQuery;
        this.resProtocolName = packets.pSCLoginRewardQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_LoginRewardQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_LoginRewardQuery();
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
                /* 获取flag判断是否已领取返回给客户端 */
                function(callback) {
                    loginRewardDb.setFirstLoginTime(req.zid, req.zuid); /* 设置首次请求次日登陆有礼的时间戳 */
                    loginRewardDb.getLoginRewardInfo(req.zid, req.zuid, callback);
                },
                function(flag, callback) {
                    if(null != flag) {
                        res.dayArr.push(1);
                    }
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
    return CS_LoginRewardQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 次日登录送礼领取
 */
var CS_LoginReward = (function() {

    /**
     * 构造函数
     */
    function CS_LoginReward() {
        this.reqProtocolName = packets.pCSLoginReward;
        this.resProtocolName = packets.pSCLoginReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_LoginReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_LoginReward();
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
                /* 判断活动奖励是否已领取 拦截重复领取 */
                function(callback) {
                    loginRewardDb.loginOtherDay(req.zid, req.zuid, callback);
                },
                function(flag, callback) {
                    if(flag) {
                        callback(retCode.DAY_NUM_OVER);
                        return;
                    }
                    /* 从配表读取领取奖励 */
                    var loginOther = csvExtends.HDlogin();
                    var rewardArr = loginOther[1].ITEM;
                    var awardArr = filter.splitItemStr(rewardArr, '|', '#');
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, [], awardArr,
                        req.channel, req.acc,  logsWater.LOGIN_OTHER_AWARD_LOGS, 1, function(err,  addArr) { /* 奖励发放给玩家 */
                            if(err) {
                                callback(err);
                                return;
                            }
                            res.loginReward = addArr;
                            callback(null);
                    });
                },
                function(callback) { /* 防止出现背包满的情况时 不能领取 */
                    loginRewardDb.setLoginRewardInfo(req.zid, req.zuid);
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
    return CS_LoginReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_LoginRewardQuery());
    exportProtocol.push(new CS_LoginReward());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

