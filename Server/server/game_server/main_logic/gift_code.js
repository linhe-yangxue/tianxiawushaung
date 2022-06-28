/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：礼品码兑换
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/gift_code');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var giftDB = require('../database/activity/gift_code');
var gmGiftDB = require('../database/activation_gift');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var filter = require('../common/filter_common');
var cZuid = require('../common/zuid');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 礼品码兑换
 */
var CS_GiftCode = (function() {

    /**
     * 构造函数
     */
    function CS_GiftCode() {
        this.reqProtocolName = packets.pCSGiftCode;
        this.resProtocolName = packets.pSCGiftCode;
    }


    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GiftCode.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GiftCode();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid
                || null == req.giftCode) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var giftCodeInfo = {};
            var giftInfo = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 根据礼品码获取礼品id和使用次数信息 */
                function(callback) {
                    gmGiftDB.getActivationCode(req.giftCode, true, function(err, data) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if(null == data) {
                            callback(retCode.GIFT_CODE_NOT_EXIST);
                            return;
                        }
                        giftCodeInfo = data;
                        callback(null);
                    });
                },
                /* 判断礼品码是否为有效的 */
                function(callback) {
                    var now = parseInt(Date.now() / 1000);
                    gmGiftDB.getActivationGift(giftCodeInfo.agId, function (err, data) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if(null == data) {
                            callback(retCode.GIFT_CODE_NOT_EXIST);
                            return;
                        }
                        else if( data.endTime < now || now < data.beginTime) {
                            callback(retCode.GIFT_CODE_OVERDUE);
                            return;
                        }
                        else if(giftCodeInfo.useNum >= data.useMax) {
                            callback(retCode.GIFT_CODE_INVALID);
                            return;
                        }
                        giftInfo = data;
                        callback(null);
                    });
                },
                /* 同一类型的礼品码只能兑换其中一个 */
                function(callback) {
                    if(!giftInfo) {
                        callback(retCode.GIFT_CODE_INVALID);
                        return;
                    }
                    if(req.channel != giftInfo.channelId) { /* 不同渠道不能互领 */
                        callback(retCode.GIFT_CODE_INVALID);
                        return;
                    }
                    giftDB.giftCodeExchange(req.zid, req.zuid, giftInfo.giftType, function(err, isExchange) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if(isExchange) { /* 相同兑换码不能兑换多次 */
                            callback(retCode.GIFT_CODE_INVALID);
                            return;
                        }
                        callback(null);
                    });
                },
                /* 兑换成功发放奖励 */
                function(callback) {
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, [], giftInfo.items,
                        req.channel, req.acc, logsWater.GIFTCODE_LOGS, giftInfo.giftType, function(err,  addArr) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            res.exchangeItem = addArr;
                            giftCodeInfo.useNum += 1;
                            giftDB.saveGiftCodeExchange(req.zid, req.zuid, giftInfo.giftType);
                            gmGiftDB.saveActivationCode(req.giftCode, giftCodeInfo, true, callback);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    gmGiftDB.openActivationCodeLock();
                    if(retCode.GIFT_CODE_NOT_EXIST == err) {
                        res.errorIndex = 0;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    if(retCode.GIFT_CODE_OVERDUE == err) {
                        res.errorIndex = 1;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    if(retCode.GIFT_CODE_INVALID == err) {
                        res.errorIndex = 2;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    else {
                        logger.LoggerGame.info(err, JSON.stringify(req));
                        http.sendResponseWithResultCode(response, res, err);
                    }
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(0, biCode.logs_code_gift, preZid, req.channel, req.zuid, req.zuid, 0, req.giftCode, JSON.stringify(res.exchangeItem));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GiftCode;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GiftCode());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

