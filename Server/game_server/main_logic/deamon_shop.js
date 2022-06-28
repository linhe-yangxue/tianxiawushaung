/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：战功商店请求：根据上次请求的时间判断是否对购买次数进行刷新，并记录下这次请求的时间，战功商店购：判断购买次数
 * 是否已经超过今日购买上限，如果没有，记录这次购买的数量，并扣购买资源，物品加入背包
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/deamon_shop');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var shopCommon = require('../common/shop_common');
var shopDb = require('../database/shop');
var protocolObject = require('../../common/protocol_object');
var timeUtil = require('../../tools/system/time_util');
var logsWater = require('../../common/logs_water');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 战功商店请求
 */
var CS_DeamonShopQuery = (function() {

    /**
     * 构造函数
     */
    function CS_DeamonShopQuery() {
        this.reqProtocolName = packets.pCSDeamonShopQuery;
        this.resProtocolName = packets.pSCDeamonShopQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DeamonShopQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DeamonShopQuery();
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

                /* 获取上次请求时间  */
                function(callback) {
                    var nowTime =  parseInt(Date.now() / 1000);
                    shopDb.getSetRefreshTime(req.zid, -1, req.zuid, nowTime, 'demon', callback);
                },

                /* 是否重置商店所有物品购买次数 */
                function(time, callback) {
                    var date = new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date, 0);/* 当天的零点时间 */
                    var  demonShopData = csvManager.DeamonShopConfig();

                    if(time < zeroTime) {  /* 每天零点重新刷新当日购买次数 */
                        shopDb.refreshShopItemsInfo(req.zid, -1, req.zuid, demonShopData, 'demon', callback);
                    } else {
                        shopDb.getShopItemsInfo(req.zid, req.zuid, 'demon', callback); /* 获取玩家战功商店的购买信息 */
                    }
                },

                /* 商店物品购买信息返给客户端 */
                function(array, callback) {
                    res.buyState = array;
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_DeamonShopQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 战功商店购买
 */
var CS_DeamonShopPurchase = (function() {

    /**
     * 构造函数
     */
    function CS_DeamonShopPurchase() {
        this.reqProtocolName = packets.pCSDeamonShopPurchase;
        this.resProtocolName = packets.pSCDeamonShopPurchase;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DeamonShopPurchase.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DeamonShopPurchase();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.indexNum
                || null == req.num
                || null == req.itemIdArr) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.indexNum = parseInt(req.indexNum);
            req.num = parseInt(req.num);

            if(isNaN(req.zid) || isNaN(req.indexNum) || isNaN(req.num)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }


            var demonShopLine = null;
            var shopItem = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否为限购情况 */
                function(callback) {
                    demonShopLine = csvManager.DeamonShopConfig()[req.indexNum];
                    if (!demonShopLine) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    if (0 == demonShopLine.BUY_NUM) { /* 不限购买次数 */
                        callback(null, null);
                    } else {
                        shopDb.getShopItemInfo(req.zid, -1, req.zuid, req.indexNum, 'demon', callback);
                    }
                },

                /* 购买次数是否达上限 */
                function(itemInfo, callback) {
                    shopItem = itemInfo;
                    shopCommon.isMaxBuyNum(shopItem, req.num, demonShopLine.BUY_NUM, callback);
                },

                /*所有条件都满足,扣消耗品,将物品加入背包或玩家身上 */
                function(callback) {
                    var  demonShopData = csvManager.DeamonShopConfig();
                    var costArr = shopCommon.computeCost(demonShopData, req.itemIdArr, req.indexNum, req.num);
                    var buyArr = shopCommon.getAddItem(demonShopData, req.indexNum, req.num);

                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr, buyArr,
                        req.channel, req.acc, logsWater.DEAMONSHOPCONFIG_LOGS, req.indexNum, function(err, addArr) {
                            res.buyItem = addArr ? addArr : [];
                            callback(err);
                    });
                },

                function(callback) {
                    res.isBuySuccess = 1;
                    if(shopItem) { /* 限购时保存已购买次数 */
                        shopDb.saveShopItemInfo(req.zid, -1, req.zuid, req.indexNum, shopItem, 'demon');
                    }
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_DeamonShopPurchase;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_DeamonShopQuery());
    exportProtocol.push(new CS_DeamonShopPurchase());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

