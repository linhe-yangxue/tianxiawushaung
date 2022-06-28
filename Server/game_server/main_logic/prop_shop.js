/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：商店 物品购买状态请求  物品购买行为结果记录
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/prop_shop');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var redisKey = require('../../common/redis_key');
var csvManager = require('../../manager/csv_manager').Instance();
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var shopDb = require('../database/shop');
var playerDb = require('../database/player');
var protocolObject = require('../../common/protocol_object');
var shopCommon = require('../common/shop_common');
var itemType = require('../common/item_type');
var mission = require('../common/mission');
var timeUtil = require('../../tools/system/time_util');
var logsWater = require('../../common/logs_water');
var cRevelry = require('../common/revelry');


/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 道具商店请求
 */
var CS_PropShopQuery = (function() {

    /**
     * 构造函数
     */
    function CS_PropShopQuery() {
        this.reqProtocolName = packets.pCSPropShopQuery;
        this.resProtocolName = packets.pSCPropShopQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PropShopQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PropShopQuery();
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
                function(callback) {
                    var nowTime =  parseInt(Date.now() / 1000);
                    shopDb.getSetRefreshTime(req.zid, -1, req.zuid, nowTime, '', callback); /* 获取上次请求时间 以便判断零点刷新 */
                },
                function(time, callback) {
                    var date =  new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date, 0); /* 当天的零点时间 */
                    var propShopData = csvManager.MallShopConfig();

                    if(time < zeroTime) {
                        shopDb.refreshShopItemsInfo(req.zid, -1, req.zuid, propShopData, '', callback);
                    } else {
                        shopDb.getShopItemsInfo(req.zid, req.zuid, '', callback); /* 获取商店道具购买信息 */
                    }
                },
                /* 商店物品购买信息返给客户端 */
                function (array, callback) {
                    res.prop = array;
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
    return CS_PropShopQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 道具商店购买
 */
var CS_PropShopPurchase = (function() {

    /**
     * 构造函数
     */
    function CS_PropShopPurchase() {
        this.reqProtocolName = packets.pCSPropShopPurchase;
        this.resProtocolName = packets.pSCPropShopPurchase;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PropShopPurchase.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PropShopPurchase();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.sIndex
                || null == req.num) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.num = parseInt(req.num);
            req.sIndex = parseInt(req.sIndex);

            if(isNaN(req.zid) || isNaN(req.num)|| isNaN(req.sIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var  mallShopData = csvManager.MallShopConfig();
            var maxNum = 0;
            var index = 0;
            var buyArr = null;
            var shopItem = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取玩家VIP等级 */
                function(callback) {
                    if(null == mallShopData[ req.sIndex]) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 判断是否为限购情况 */
                function(player, callback) {
                    var vipLevel = player.vipLevel;
                    maxNum = shopCommon.getMaxNum(vipLevel, req.sIndex, mallShopData);
                    if(0 == maxNum) { /* 不限购买次数 */
                        callback(null, null);
                    } else {
                        shopDb.getShopItemInfo(req.zid, -1, req.zuid, req.sIndex, '', callback);
                    }
                },

                /* 购买次数是否达上限 */
                function(itemInfo, callback) {
                    shopItem = itemInfo;
                    index =  shopItem ? shopItem.buyNum : 0;
                    shopCommon.isMaxBuyNum(shopItem, req.num, maxNum, callback);
                },

                /*所有条件都满足,扣消耗品,将物品加入背包或玩家身上 */
                function(callback) {
                    var costArr = [];
                    var priceStr = mallShopData[req.sIndex].COST_NUM_1;
                    var priceArr = priceStr.split('|');
                    if( 1 == priceArr.length) {
                        costArr = shopCommon.computeCost(mallShopData, [], req.sIndex, req.num);
                    } else {
                        costArr = shopCommon.getCost(mallShopData, priceArr, index, req.sIndex, req.num);
                    }

                    buyArr = shopCommon.getAddItem(mallShopData, req.sIndex, req.num);
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr, buyArr,
                        req.channel, req.acc, logsWater.PROPSHOPPURCHASE_LOGS, req.sIndex, function(err, addArr) {
                            if(err) {
                                callback(err);
                                return;
                            }
                            res.buyItem = addArr;
                            res.isBuySuccess = 1;
                            callback(null);
                    });
                },
                /* 更新任务进度 */
                function (callback) {
                    /* 开服狂欢 */
                    for(var i = 0; i < buyArr.length; i++) {
                        if(buyArr[i].tid === 2000015) {
                            cRevelry.updateRevelryProgress(req.zid, req.zuid, 26, buyArr[i].itemNum);
                        }
                    }
                    var missionType = 0;
                    if (mallShopData[req.sIndex].ITEM_ID == itemType.ITEM_TYPE_STAMINA_PILL) { /* 体力丹 */
                        missionType = mission.TASK_TYPE_24;
                    }
                    else if (mallShopData[req.sIndex].ITEM_ID == itemType.ITEM_TYPE_SPIRIT_PILL) { /* 精力丹 */
                        missionType = mission.TASK_TYPE_25;
                    }

                    var number = shopItem ? shopItem.buyNum : 0;
                    if(missionType) {
                        mission.updateDailyTask(req.zid, req.zuid, missionType, 0, number);
                        mission.updateAchieveTask(req.zid, req.zuid, missionType, 0,  0, number);
                    }

                    if(shopItem) { /* 限购时保存已购买次数 */
                        shopDb.saveShopItemInfo(req.zid, -1, req.zuid, req.sIndex, shopItem, '');
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
    return CS_PropShopPurchase;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 道具商店单个物品购买请求
 */
var CS_PropShopItemQuery = (function() {

    /**
     * 构造函数
     */
    function CS_PropShopItemQuery() {
        this.reqProtocolName = packets.pCSPropShopItemQuery;
        this.resProtocolName = packets.pSCPropShopItemQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PropShopItemQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PropShopItemQuery();
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

            if(isNaN(req.zid) || isNaN(req.index)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    var nowTime =  parseInt(Date.now() / 1000);
                    shopDb.getSetRefreshTime(req.zid, -1, req.zuid, nowTime, '', callback); /* 获取上次请求时间 以便判断零点刷新 */
                },
                function(time, callback) {
                    var date =  new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date, 0); /* 当天的零点时间 */
                    if(time < zeroTime) {
                        shopDb.refreshShopItemsInfo(req.zid, -1, req.zuid,  csvManager.MallShopConfig(), '', function(err) {
                           callback(err, null);
                        });
                    } else {
                        shopDb.getShopItemInfo(req.zid, -1, req.zuid, req.index, '', callback);
                    }
                },
                function(itemInfo, callback) {
                    if(itemInfo) {
                        res.prop.push(itemInfo);
                    }
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
    return CS_PropShopItemQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_PropShopQuery());
    exportProtocol.push(new CS_PropShopPurchase());
    exportProtocol.push(new CS_PropShopItemQuery());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
