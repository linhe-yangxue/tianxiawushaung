/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：神装商店定时刷新请求 和神装商店购买
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/cloth_shop');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var cPackage = require('../common/package');
var accountDb = require('../database/account');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var redisKey = require("../../common/redis_key");
var protocolObject = require('../../common/protocol_object');
var towerDb = require('../database/climb_tower');
var timeUtil = require('../../tools/system/time_util');
var shopCommon = require('../common/shop_common');
var shopDb = require('../database/shop');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 神装商店请求
 */
var CS_ClothShopQuery = (function() {

    /**
     * 构造函数
     */
    function CS_ClothShopQuery() {
        this.reqProtocolName = packets.pCSClothShopQuery;
        this.resProtocolName = packets.pSCClothShopQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ClothShopQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClothShopQuery();
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
                /*获得爬塔的最高星数*/
                function(callback) {
                    towerDb.getTowerClimbingInfo(req.zid, req.zuid, callback);
                },
                /* 获取上次请求时间 以便判断零点刷新 */
                function(climbInfo, callback) {
                    res.star = climbInfo.rankStars;
                    var nowTime  = parseInt(Date.now() / 1000);
                    shopDb.getSetRefreshTime(req.zid, -1, req.zuid, nowTime, 'cloth', callback);
                },
                function(time, callback) {
                    var date = new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date, 0); /* 当天的零点时间*/
                    var  clothShopData = csvManager.TowerShopConfig();

                    if(time <= zeroTime) { /*每天零点重新刷新当日购买次数 */
                        shopDb.refreshShopItemsInfo(req.zid, -1, req.zuid, clothShopData, 'cloth', callback);
                    } else {
                        shopDb.getShopItemsInfo(req.zid, req.zuid, 'cloth', callback);
                    }
                },
                /* 商店物品购买信息返给客户端 */
                function(array, callback) {
                    res.cloth = array;
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
    return CS_ClothShopQuery;
})();
/**
 * 神装商店购买
 */
var CS_ClothShopPurchase = (function() {

    /**
     * 构造函数
     */
    function CS_ClothShopPurchase() {
        this.reqProtocolName = packets.pCSClothShopPurchase;
        this.resProtocolName = packets.pSCClothShopPurchase;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ClothShopPurchase.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClothShopPurchase();
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

            var clothShopLine = null;
            var shopItem = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取爬塔相关信息 */
                function(callback) {
                    clothShopLine = csvManager.TowerShopConfig()[req.indexNum];
                    if(!clothShopLine) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    towerDb.getTowerClimbingInfo(req.zid, req.zuid, callback);
                },

                /* 判断是否为限购情况 */
                function(climbInfo, callback) {
                    var needStarLevel = clothShopLine.OPEN_STAR_NUM;
                    /*购买星数是否符合*/
                    if(!climbInfo || climbInfo.rankStars < needStarLevel) {
                        callback(retCode.STAR_LEVEL_NOT_ENOUGH);
                        return;
                    }
                    if(0 == clothShopLine.BUY_NUM) { /* 不限购买次数  */
                        callback(null, null);
                    } else {
                        shopDb.getShopItemInfo(req.zid, -1,  req.zuid, req.indexNum, 'cloth', callback);
                    }
                },

                /*购买次数是否达上限*/
                function(itemInfo, callback) {
                     shopItem = itemInfo;
                    shopCommon.isMaxBuyNum(shopItem, req.num, clothShopLine.BUY_NUM, callback);
                },

                /*所有条件都满足,扣消耗品,将物品加入背包或玩家身上 */
                function(callback) {
                    var clothShopData = csvManager.TowerShopConfig();
                    var costArr = shopCommon.computeCost(clothShopData, req.itemIdArr, req.indexNum, req.num);
                    var buyArr = shopCommon.getAddItem(clothShopData, req.indexNum, req.num);

                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr, buyArr,
                        req.channel, req.acc, logsWater.CLOTHSHOPURCHASE_LOGS, req.indexNum, function(err,  addArr) {
                            res.buyItem = addArr ? addArr : [];
                            callback(err);
                    });
                },
                function(callback) {
                    res.isBuySuccess = 1;
                    if(shopItem) {
                        shopDb.saveShopItemInfo(req.zid, -1,  req.zuid, req.indexNum, shopItem, 'cloth');
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
    return CS_ClothShopPurchase;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_ClothShopQuery());
    exportProtocol.push(new CS_ClothShopPurchase());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
