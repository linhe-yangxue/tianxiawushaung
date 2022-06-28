
/**
 * 包含的头文件
 */
var packets = require('../packets/half_price');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var halfPriceDb = require('../database/half_price');
var timeUtil = require('../../tools/system/time_util');
var csvManager =  require('../../manager/csv_manager').Instance();
var filter = require('../common/filter_common');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 半价抢购请求 
 */
var CS_HalfPriceQuery = (function() {

    /**
     * 构造函数
     */
    function CS_HalfPriceQuery() {
        this.reqProtocolName = packets.pCSHalfPriceQuery;
        this.resProtocolName = packets.pSCHalfPriceQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_HalfPriceQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_HalfPriceQuery();
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
                /* 获取购买状态 */
                function(callback) {
                    halfPriceDb.getBuyArrHalfPrice(req.zid, req.zuid, function(err, buyArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.buyArr = buyArr;
                        callback(null);
                    });
                },

                /* 获取半价物品领取数量 */
                function(callback) {
                    halfPriceDb.getAllHalfPriceNum(req.zid, function(err, useArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.useArr = useArr;
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
    return CS_HalfPriceQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 半价抢购
 */
var CS_HalfPrice = (function() {

    /**
     * 构造函数
     */
    function CS_HalfPrice() {
        this.reqProtocolName = packets.pCSHalfPrice;
        this.resProtocolName = packets.pSCHalfPrice;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_HalfPrice.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_HalfPrice();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.whichDay) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.whichDay = parseInt(req.whichDay);

            if(isNaN(req.zid) || isNaN(req.whichDay)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            /* 获取该天配表列表 */
            var hdRevelryTable = csvManager.HDrevelry();
            var whichDayInfo = [];
            for(var index in csvManager.HDrevelry()) {
                if(hdRevelryTable[index].PAGE == 4 && hdRevelryTable[index].DAY == req.whichDay) {
                    whichDayInfo = hdRevelryTable[index];
                    break;
                }
            }
            var buyArr = [];
            var costArr = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 开服时间获取以及是否有效时间内请求 */
                function(callback){
                    accountDb.getZoneInfo(req.zid, callback);
                },
                function(zoneInfo, callback) {
                    var openTime = parseInt(timeUtil.getDetailTime(zoneInfo.openDate, 0));
                    var nowTime = parseInt(new Date().getTime() / 1000);
                    var date =  new Date().toDateString();
                    var zeroTime = parseInt(timeUtil.getDetailTime(date,0));
                    var openDay = (zeroTime - openTime) / (3600 * 24) + 1;

                    if((nowTime - openTime) < 0 || (nowTime - openTime) > 10 * 24 * 3600){
                        callback(retCode.NOT_EVENT_TIME);
                        return;
                    }

                    if( req.whichDay < 1 || req.whichDay > openDay ) {
                        callback(retCode.NOT_EVENT_TIME);
                        return;
                    }
                    callback(null);
                },

                /* 获取购买记录 */
                function(callback) {
                    halfPriceDb.getBuyArrHalfPrice(req.zid, req.zuid, callback);
                },

                function(buyResult, callback) {
                    buyArr = buyResult;

                    /* 检查物品是否买过 */
                    if(buyArr.indexOf(req.whichDay) != -1) {
                        callback(retCode.REVELRY_ACCEPTED);
                        return;
                    }

                    /* 检查消耗是否足够 */
                    var costItem = filter.splitItemStr(whichDayInfo.PRICE, '|', '#')[1];
                    costArr.push(costItem);
                    cPackage.checkItemNum(req.zid, req.zuid, costArr, callback);
                },

                function(callback) {
                    /* 消耗足够，可以购买 */
                    halfPriceDb.incrHalfPrice(req.zid, req.whichDay, function(err, buyNum) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if (whichDayInfo.SERVER_LIMIT < buyNum) {
                            callback(retCode.HALFPRICE_ABOVE_LIMIT);
                            return;
                        }
                        buyArr.push(req.whichDay);
                        /* 更改某天的购买状态 */
                        halfPriceDb.setIsBuyHalfPrice(req.zid, req.zuid, buyArr);
                        /* 获取购买奖励和扣除消耗 */
                        var itemArr = filter.splitItemStr(whichDayInfo.REWARD, '|', '#');
                        var tmpArr = filter.getItemsInPackageOrNot(itemArr, false);
                        cPackage.updateItemWithLog(req.zid, req.zuid, costArr, itemArr, req.channel, req.acc, logsWater.HALF_PRICE_LOGS, itemArr[0].tid, function (err, subArr, addArr) {
                            if (err) {
                                callback(retCode.DB_ERR);
                                return;
                            }
                            res.buyItem = addArr.concat(tmpArr);
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
    return CS_HalfPrice;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_HalfPriceQuery());
    exportProtocol.push(new CS_HalfPrice());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
