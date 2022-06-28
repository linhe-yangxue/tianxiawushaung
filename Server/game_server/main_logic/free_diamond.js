
/**
 * 包含的头文件
 */
var packets = require('../packets/free_diamond');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var protocolObject = require('../../common/protocol_object');
var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var cardDB = require('../database/activity/free_diamond');
var tool = require('../../tools/system/time_util');
var math = require('../../tools/system/math');
var type = require('../common/item_type');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 幸运翻牌请求
 */
var CS_FreeDiamond = (function() {

    /**
     * 构造函数
     */
    function CS_FreeDiamond() {
        this.reqProtocolName = packets.pCSFreeDiamond;
        this.resProtocolName = packets.pSCFreeDiamond;
    }

    /**F
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FreeDiamond.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FreeDiamond();
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

            var cardState;
            var date = new Date().toDateString();
            var nowTime = parseInt(Date.now() / 1000);
            var zeroTime = tool.getDetailTime(date,0);
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取玩家的翻牌状态 CardState*/
                function(callback) {
                    cardDB.getCardState(req.zid, req.zuid, nowTime, function(err, data){
                        if(err) {
                            callback(err);
                            return;
                        }
                        cardState = data;
                        callback(null);
                    });
                },
                function(callback){
                    if(cardState.theLastTime < zeroTime) {
                        /*次日次数更新*/
                        cardState.residueNum = 3;
                    }
                    res.residueNum = cardState.residueNum;
                    cardState.theLastTime = nowTime;
                    cardDB.saveCardState(req.zid, req.zuid, cardState);
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
    return CS_FreeDiamond;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开始翻牌
 */
var CS_transformCard = (function() {

    /**
     * 构造函数
     */
    function CS_transformCard() {
        this.reqProtocolName = packets.pCStransformCard;
        this.resProtocolName = packets.pSCtransformCard;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_transformCard.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_transformCard();
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
            var cardState;
            var cardData = csvManager.LuckCard();
            var nowTime = parseInt(Date.now() / 1000);
            var probability = 0;
            var reward = new protocolObject.ItemObject();
            var rewardArr = [];

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /*获取翻牌状态 可翻牌次数*/
                function(callback) {
                   cardDB.getCardState(req.zid, req.zuid, nowTime, function(err, data){
                       if(err){
                           callback(null);
                           return;
                       }
                       cardState = data;
                       callback(null);
                   });
                },

                function(callback){
                    /*可用次数为0，不能再翻牌*/
                    if(cardState.residueNum <= 0){
                        callback(retCode.CAN_NOT_TURNOVER);
                        return;
                    }
                    callback(null);
                },
                /*元宝加入玩家身上*/
                function(callback){
                    reward.tid = type.ITEM_TYPE_DIAMOND;
                    var obj_cardData = Object.keys(cardData);
                    for(var i = 1; i <= obj_cardData.length; ++i) {
                        probability += cardData[i].PROBABILITY;
                    }
                    var rand = math.rand(1, probability);
                    var randCount = 1;
                    for(var j = 1; j <= obj_cardData.length ; ++j){
                        randCount += cardData[j].PROBABILITY;
                        if(rand <= randCount){
                            reward.itemNum = cardData[j].NUMBER;
                            rewardArr.push(reward);
                            break;
                        }
                    }
                    callback(null);
                },
                function(callback) {
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], rewardArr, req.channel, req.acc, logsWater.LUCK_CARD_LOGS, reward.tid, function(err){
                        if(err) {
                            callback(err);
                            return;
                        }
                        cardState.residueNum--;//次数-1
                        res.diamondIndex = reward.itemNum;
                        res.residueNum = cardState.residueNum;
                        cardDB.saveCardState(req.zid, req.zuid, cardState);
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
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 8, 3-cardState.residueNum, 1);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_transformCard;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_FreeDiamond());
    exportProtocol.push(new CS_transformCard());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
