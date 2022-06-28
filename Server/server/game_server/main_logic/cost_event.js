
/**
 * 包含的头文件
 */
var packets = require('../packets/cost_event');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var logsCode = require('../../common/logs_code');
var costPrizeDB = require('../database/cost_event');
var timeTool = require('../../tools/system/time_util');
var type = require('../common/item_type');
var csvManager = require('../../manager/csv_manager').Instance();
var protocolObject = require('../../common/protocol_object');
var globalObject = require('../../common/global_object');
var activityTimeDB = require('../database/activity_time');
var logsWater = require('../../common/logs_water');
var zuidCut = require('../common/zuid.js');
var filter = require('../common/filter_common');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 消费返利请求
 */
var CS_CostEvent = (function() {

    /**
     * 构造函数
     */
    function CS_CostEvent() {
        this.reqProtocolName = packets.pCSCostEvent;
        this.resProtocolName = packets.pSCCostEvent;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_CostEvent.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_CostEvent();
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
            var actOpenTime = 0;
            var actEndTime = 0;
            var actPrizeTime = 0;
            var gmAward;
            var uAndZId = zuidCut.zuidSplit(req.zuid);
            var oldZid = uAndZId[0];

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback){
                    activityTimeDB.getActivityTime(req.zid, oldZid, 2, function(err, objOpenTime){
                        if(err){
                            callback(err);
                        }
                        if(null == objOpenTime){
                            callback(retCode.NOT_IN_ACT_TIME);
                        }
                        actOpenTime = objOpenTime.beginTime;
                        actEndTime = objOpenTime.endTime;
                        actPrizeTime = objOpenTime.endAwardTime;
                        gmAward = objOpenTime;
                        callback(null);
                    });
                },
                /*获取玩家积累元宝数*/
                function(callback) {
                    costPrizeDB.getCostNum(req.zid, req.zuid, function(err, data){
                        if(err){
                            callback(err);
                            return;
                        }
                        res.costNums = data;//返回花费元宝
                        res.chargeAward = gmAward.chargeAward;/*获取返利内容列表*/
                        callback(null);
                    });
                },
                /*获取返利列表状态*/
                function(callback) {

                    costPrizeDB.getPrizeStatus(req.zid, req.zuid, function(err, data){
                        if(err){
                            callback(err);
                            return;
                        }
                        res.prizeStatus = data;//返回返利领取状态列表
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
    return CS_CostEvent;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取返利物品
 */
var CS_receivePrize = (function() {

    /**
     * 构造函数
     */
    function CS_receivePrize() {
        this.reqProtocolName = packets.pCSreceivePrize;
        this.resProtocolName = packets.pSCreceivePrize;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_receivePrize.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_receivePrize();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.clickItemMoney) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.clickItemMoney = parseInt(req.clickItemMoney);

            if(false || isNaN(req.zid) || isNaN(req.clickItemMoney)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var actPrizeTime = 0;
            var actOpenTime = 0;
            var actEndTime = 0;
            var nowTime = parseInt(Date.now() / 1000);
            var userCost = 0;//累计消费
            var gmAward = [];
            var giftItem;
            var i = 0;

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback){
                    var uAndZId = zuidCut.zuidSplit(req.zuid);
                    var oldZid = uAndZId[0];
                    activityTimeDB.getActivityTime(req.zid, oldZid, 2, function(err, objTime){
                        if(err){
                            callback(err);
                            return;
                        }
                        if(null == objTime){
                            callback(retCode.NOT_IN_ACT_TIME);
                            return;
                        }
                        actOpenTime = objTime.beginTime;
                        actEndTime = objTime.endTime;
                        actPrizeTime = objTime.endAwardTime;
                        gmAward = objTime.chargeAward;
                        callback(null);
                    });
                },
                function(callback){
                    if(nowTime < actOpenTime)
                    {
                        callback(retCode.NOT_IN_ACT_TIME);
                        return;
                    }
                    callback(null);
                },
                function(callback){
                    if(nowTime > actPrizeTime){
                        callback(retCode.NOT_IN_PRIZE_TIME);
                        return;
                    }
                    callback(null);
                },
                function(callback) {
                    /*点击合法,判消费大于零*/
                    if(0 > gmAward.rmbNum){
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    costPrizeDB.getCostNum(req.zid, req.zuid, function(err, data){
                        if(err){
                            callback(err);
                            return;
                        }
                        if(0 > data) {
                            callback(retCode.COST_NUMBER_ERROR);
                            return;
                        }
                        userCost = data;
                        callback(null);
                    });
                },
                /*遍历数据库返回的ChargeAward[]对象的rmbNum*/
                /******************************************************************************************************/
                function(callback){

                    while(gmAward[i].rmbNum){
                        if(req.clickItemMoney == gmAward[i].rmbNum){
                            giftItem = gmAward[i].items;
                            callback(null);
                            return;
                        }
                        i++;
                    }
                    callback(null);
                 },
                /*通过ItemID判断发放的福利*/
                function(callback){
                    if(userCost < gmAward[i].rmbNum){
                        callback(retCode.COST_NUMBER_ERROR);
                    }
                    callback(null);
                },
                function(callback) {
                    /*判断是否被领取过*/
                    costPrizeDB.savePrizeStatus(req.zid, req.zuid, req.clickItemMoney, function(err, state){
                        if(err) {
                            callback(err);
                        }
                        else if(0 == state) {
                            callback(retCode.HAVE_RECIVED_THIS_PRIZE);
                        }
                        else{
                            callback(null);
                        }

                    });
                },
                function(callback){
                    var tmpArr = filter.getItemsInPackageOrNot(giftItem, false);
                    var itemPrize = new protocolObject.ItemObject();
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], giftItem, req.channel, req.acc, logsWater.COST_EVENT_LOGS, itemPrize.tid, function(err, subArr, addArr){
                        if(err){
                            callback(err);
                            return;
                        }
                        res.prizeContent  = addArr.concat(tmpArr);
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
    return CS_receivePrize;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_CostEvent());
    exportProtocol.push(new CS_receivePrize());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
