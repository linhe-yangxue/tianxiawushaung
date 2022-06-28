/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：声望商店 物品购买状态请求  物品购买行为结果记录
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/prestige_shop');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var redisKey = require("../../common/redis_key");
var async = require('async');
var accountDb = require('../database/account');
var shopDb = require('../database/shop');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var dbManager = require('../../manager/redis_manager').Instance();
var globalObject = require('../../common/global_object');
var arenaDb = require('../database/arena');
var shopCommon = require('../common/shop_common');
var logsWater = require('../../common/logs_water');
var timeUtil = require('../../tools/system/time_util');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 声望商店请求
 */
var CS_PrestigeShopQuery = (function() {

    /**
     * 构造函数
     */
    function CS_PrestigeShopQuery() {
        this.reqProtocolName = packets.pCSPrestigeShopQuery;
        this.resProtocolName = packets.pSCPrestigeShopQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PrestigeShopQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PrestigeShopQuery();
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

                /* 返回历史最好排名 */
                function(callback) {
                    arenaDb.getArenaWarrior(req.zid, req.zuid, false, callback);
                },

                /* 获取上次请求时间  */
                function(rankInfo, callback) {
                    if(rankInfo) {
                        res.rank = rankInfo.bestRank;
                        res.curRank = rankInfo.curRank;
                    }

                    var nowTime =  parseInt(Date.now() / 1000);
                    shopDb.getSetRefreshTime(req.zid, -1, req.zuid, nowTime, 'prestige', callback);
                },

                /* 是否重置商店所有物品购买次数 */
                function(time, callback) {
                    var date =  new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date, 0); /* 当天的零点时间 */
                    var  prestigeShopData = csvManager.PrestigeShopConfig();

                    if(time <= zeroTime) { /* 每日零点购买次数归零*/
                        shopDb.refreshShopItemsInfo(req.zid, -1, req.zuid, prestigeShopData, 'prestige', callback);
                    } else {
                        shopDb.getShopItemsInfo(req.zid, req.zuid, 'prestige', callback);
                    }
                },

                /* 商店道具购买信息返给客户端 */
                function(array, callback) {
                    res.commodity = array;
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
    return CS_PrestigeShopQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 声望商店购买
 */
var CS_PrestigeShopPurchase = (function() {

    /**
     * 构造函数
     */
    function CS_PrestigeShopPurchase() {
        this.reqProtocolName = packets.pCSPrestigeShopPurchase;
        this.resProtocolName = packets.pSCPrestigeShopPurchase;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PrestigeShopPurchase.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PrestigeShopPurchase();
        res.pt = this.resProtocolName;

        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.pIndex
                || null == req.num
                || null == req.itemIdArr) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.pIndex = parseInt(req.pIndex);
            req.num = parseInt(req.num);

            if(isNaN(req.zid) || isNaN(req.pIndex) || isNaN(req.num)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }


            var prestigeShopLine = null;
            var shopItem = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取我的竞技场排名信息 */
                function(callback) {
                    prestigeShopLine = csvManager.PrestigeShopConfig()[req.pIndex];
                    if(!prestigeShopLine) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    arenaDb.getArenaWarrior(req.zid, req.zuid, false, callback);
                },

                /* 判断我的排名是否满足购买条件 */
                function(rankInfo, callback) {
                    var needRank = prestigeShopLine.OPEN_RANK;
                    var currentRank = prestigeShopLine.CURRENT_RANK;
                    if(0 == needRank && 0 == currentRank) { /* 没有排名限制 */
                        callback(null);
                        return;
                    }
                    if(needRank > 0){
                        if(!rankInfo || (rankInfo.bestRank >  needRank)) {
                            callback(retCode.ARENA_RANK_NOT_ENOUGH);
                            return;
                        }
                    }
                    if(currentRank > 0){
                        if(!rankInfo || rankInfo.curRank > currentRank) {
                            callback(retCode.ARENA_RANK_NOT_ENOUGH);
                            return;
                        }
                    }
                    callback(null);
                },

                /* 判断是否为限购情况 */
                function(callback) {
                    if(0 == prestigeShopLine.BUY_NUM) { /* 不限购买次数 */
                        callback(null, null);
                    } else {
                        shopDb.getShopItemInfo(req.zid, -1, req.zuid,  req.pIndex, 'prestige', callback);
                    }
                },

                /* 购买次数是否达上限 */
                function(itemInfo, callback) {
                    shopItem = itemInfo;
                    shopCommon.isMaxBuyNum(shopItem, req.num, prestigeShopLine.BUY_NUM, callback);
                },

                /*所有条件都满足,扣消耗品,将物品加入背包或玩家身上 */
                function(callback) {
                    var  prestigeShopData = csvManager.PrestigeShopConfig();
                    var costArr = shopCommon.computeCost(prestigeShopData, req.itemIdArr, req.pIndex, req.num);
                    var buyArr = shopCommon.getAddItem(prestigeShopData, req.pIndex, req.num);

                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr, buyArr, req.channel,
                        req.acc, logsWater.PRESTIGESHOPPURCHASE_LOGS, req.pIndex,function(err, addArr) {
                            res.buyItem = addArr ? addArr : [];
                            callback(err);
                    });
                },

                function(callback) {
                    res.isBuySuccess = 1;
                    if(shopItem) { /* 限购时保存已购买次数 */
                        shopDb.saveShopItemInfo(req.zid, -1, req.zuid, req.pIndex, shopItem, 'prestige');
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
    return CS_PrestigeShopPurchase;
})();


/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_PrestigeShopQuery());
    exportProtocol.push(new CS_PrestigeShopPurchase());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
