
/**
 * 包含的头文件
 */
var packets = require('../packets/limit_time_sale');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var logsCode = require('../../common/logs_code');
var limitTimeSaleDB = require('../database/limit_time_sale');
var timeTool = require('../../tools/system/time_util');
var type = require('../common/item_type');
var csvManager = require('../../manager/csv_manager').Instance();
var protocolObject = require('../../common/protocol_object');
var globalObject = require('../../common/global_object');
var logsWater = require('../../common/logs_water');
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var playerDB = require('../database/player.js');


/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 限时抢购请求
 */
var CS_LimitTimeSale = (function() {

    /**
     * 构造函数
     */
    function CS_LimitTimeSale() {
        this.reqProtocolName = packets.pCSLimitTimeSale;
        this.resProtocolName = packets.pSCLimitTimeSale;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_LimitTimeSale.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_LimitTimeSale();
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

            var theLastTime = 0;//保存数据库中的最后一次购买时间
            var date = new Date().toDateString();
            var zeroTime = timeTool.getDetailTime(date, 0);

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    /*获取玩家购买时间*/
                    limitTimeSaleDB.getGoodsBuyTime(req.zid, req.zuid, function(err, lastTime){
                       if(err){
                           callback(err);
                       }
                       else if(null == lastTime){
                           theLastTime = 0;
                           callback(null);
                       }
                       else {
                           theLastTime = lastTime;
                           callback(null);
                       }
                    });
                },
                function(callback){
                    /*次日购买数更新*/
                    if(theLastTime < zeroTime){
                        limitTimeSaleDB.delGoodsBuyNum(req.zid, req.zuid);
                        callback(null);
                    }
                    else{
                        limitTimeSaleDB.getGoodsBuyNum(req.zid, req.zuid, function(err, data){
                            if(err) {
                                callback(err);
                                return;
                            }
                            res.haveBuyNum = data;
                            callback(null);
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
    return CS_LimitTimeSale;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 抢购物品
 */
var CS_BuyCheapWares = (function() {

    /**
     * 构造函数
     */
    function CS_BuyCheapWares() {
        this.reqProtocolName = packets.pCSBuyCheapWares;
        this.resProtocolName = packets.pSCBuyCheapWares;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BuyCheapWares.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BuyCheapWares();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.buyWareIndex) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.buyWareIndex = parseInt(req.buyWareIndex);

            if(isNaN(req.zid) || isNaN(req.buyWareIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var goodsBuyNum = 0;//物品购买次数
            var nowTime = parseInt(Date.now() / 1000);
            var limitTimeSaleData = csvManager.LimitTimeSale();
            var objLimitTimeSaleData = Object.keys(limitTimeSaleData);
            var globGoodsState = new globalObject.GoodsState();


            var reward = new protocolObject.ItemObject();/*物品*/
            var arrAdd = [];
            var arrSub = [];
            var playerMoney = 0;

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /*判发的index是否合法*/
                function(callback){
                    if(req.buyWareIndex < 0 || req.buyWareIndex > objLimitTimeSaleData.length){
                        callback(retCode.BUY_WARE_INDEX_IS_ERROR);
                        return;
                    }
                    callback(null);
                },
                /*判断买的次数是否合法*/
                function(callback) {
                    limitTimeSaleDB.getAGoodsBuyNum(req.zid, req.zuid, req.buyWareIndex, function(err, array){
                       if(err){
                           callback(err);
                       }
                       else if(null == array){
                           goodsBuyNum = 0;
                           callback(null);
                       }
                       else{
                           goodsBuyNum = array.hadBuyNum;
                           callback(null);
                       }
                    });
                },

                /*判购买次数是否足够*/
                function(callback){
                    if(goodsBuyNum >= limitTimeSaleData[req.buyWareIndex].BUY_NUM){
                        callback(retCode.BUY_WARE_NUMBER_NOT_ENOUGH);
                    }
                    else{
                        callback(null);
                    }
                },

                /*判player元宝是否足够，顺便扣钱，顺便加物品*/
                function(callback) {
                    /*玩家元宝*/
                    playerDB.getPlayerData(req.zid, req.zuid, false, function (err, data) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            playerMoney = data.diamond;
                            callback(null);
                        }
                    });
                },
                function(callback){
                    /*判player元宝是否足够*/
                    if(null != limitTimeSaleData[req.buyWareIndex]){
                        var salePrice = limitTimeSaleData[req.buyWareIndex].NEW_COST_NUM;/*表，售价*/
                    }
                    else
                    {
                        callback(retCode.BUY_WARE_INDEX_IS_ERROR);
                        return;
                    }
                    if(playerMoney < salePrice)
                    {
                        callback(retCode.PLAYER_DIAMOND_NOT_ENOUGH);
                        return;
                    }
                    else{
                        reward.tid = type.ITEM_TYPE_DIAMOND;
                        reward.itemNum = salePrice;
                        arrSub.push(reward);
                    }
                    /*发物品*/
                    if(null != limitTimeSaleData[req.buyWareIndex].GroupID){
                        var groupID = limitTimeSaleData[req.buyWareIndex].GroupID;
                    }
                    else
                    {
                        callback(retCode.DON_NOT_HAVE_THIS_GROUPID);
                        return;
                    }
                    csvExtendManager.GroupIDConfig_DropId(groupID, 1, function (err, arr) {
                        if (err) {
                            callback(retCode.DON_NOT_HAVE_THIS_GROUPID);
                        }
                        else {
                            arrAdd = arr;
                            callback(null);
                        }
                    });
                },
                function(callback){
                    /*加物品，扣钱*/
                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.LIMIT_TIME_SALE_LOGS, req.buyWareIndex, function(err, retSub, retAdd){
                        if(err){
                            callback(err);
                        }
                        else{
                            res.randWareID = retAdd[0];
                            callback(null);
                        }
                    });
                },
                /*减次数，写入购买时间*/
                function(callback){
                    goodsBuyNum++;/*加已购买次数*/
                    res.haveBuyNum = goodsBuyNum;
                    globGoodsState.goodsIndex = req.buyWareIndex;
                    globGoodsState.hadBuyNum = goodsBuyNum;
                    limitTimeSaleDB.saveGoodsBuyNum(req.zid, req.zuid, req.buyWareIndex, globGoodsState);/*剩余次数存库*/
                    limitTimeSaleDB.saveGoodsBuyTime(req.zid, req.zuid, nowTime, callback);//gai
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
    return CS_BuyCheapWares;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_LimitTimeSale());
    exportProtocol.push(new CS_BuyCheapWares());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
