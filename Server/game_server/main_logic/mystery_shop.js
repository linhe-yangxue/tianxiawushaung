/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：神秘商店请求 神秘商店刷新 神秘商店购买
 * 开发者：许林(卢凯鹏重写)
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/mystery_shop');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var packageDb = require('../database/package');
var logger = require('../../manager/log4_manager');
var itemType = require("../common/item_type");
var shopCommon = require('../common/shop_common');
var csvManager = require('../../manager/csv_manager').Instance();
var mysteryShopDb = require('../database/mystery_shop');
var lotteryDb = require('../database/lottery');
var redisKey = require('../../common/redis_key');
var timeUtil = require('../../tools/system/time_util');
var globalObject = require('../../common/global_object');
var logsWater = require('../../common/logs_water');
var cRevelry = require('../common/revelry');
var cMysteryShop = require('../common/mystery_shop');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 神秘商店请求
 */
var CS_MysteryShopQuery = (function() {

    /**
     * 构造函数
     */
    function CS_MysteryShopQuery() {
        this.reqProtocolName = packets.pCSMysteryShopQuery;
        this.resProtocolName = packets.pSCMysteryShopQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MysteryShopQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MysteryShopQuery();
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
            
            var player, petPkg, petFrgPkg, lotteryCnt;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    lotteryDb.getLotteryCnt(req.zid, req.zuid, false, callback);
                },

                function(result, callback) {
                    lotteryCnt = result;
                    packageDb.getPlayerAndPackages(req.zid, req.zuid, false, callback);
                },
                
                function(result, callback) {
                    player = result[0];
                    petPkg = result[globalObject.PACKAGE_TYPE_PET];
                    petFrgPkg = result[globalObject.PACKAGE_TYPE_PET_FRAGMENT];
                    mysteryShopDb.getMysteryShop(req.zid, req.zuid, callback);
                },

                function(mysteryShop, callback) {
                    mysteryShop = cMysteryShop.updateMysteryShop(mysteryShop);

                    /* 初次打开商店，默认刷新一次 */
                    if(Object.keys(mysteryShop.itemsRcd).length == 0) {
                        mysteryShop.itemsRcd = cMysteryShop.refreshItemsIndex(player, petPkg, petFrgPkg, lotteryCnt);
                        mysteryShopDb.setMysteryShop(req.zid, req.zuid, mysteryShop);
                    }
                    
                    res.freeNum = cMysteryShop.freeRefreshLimit - mysteryShop.freeRefreshCnt;
                    res.leftTime = mysteryShop.freeRefreshTimeStamp + cMysteryShop.freeRefreshCoolDown - parseInt(Date.now() / 1000);
                    res.leftNum = csvManager.Viplist()[player.vipLevel].PART_NUM - mysteryShop.refreshCnt; /* 剩余次数 */
                    
                    for(var i in mysteryShop.itemsRcd) {
                        res.indexArr.push(parseInt(i));
                        if(mysteryShop.itemsRcd[i] > 0) {
                            res.mysteryArr.push(parseInt(i));
                        }
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
    return CS_MysteryShopQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 神秘商店刷新
 */
var CS_MysteryShopRefresh = (function() {

    /**
     * 构造函数
     */
    function CS_MysteryShopRefresh() {
        this.reqProtocolName = packets.pCSMysteryShopRefresh;
        this.resProtocolName = packets.pSCMysteryShopRefresh;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MysteryShopRefresh.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MysteryShopRefresh();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.consume) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.consume.itemId
                || null == req.consume.tid
                || null == req.consume.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.consume.itemId = parseInt(req.consume.itemId);
            req.consume.tid = parseInt(req.consume.tid);
            req.consume.itemNum = parseInt(req.consume.itemNum);

            if(isNaN(req.consume.itemId) || isNaN(req.consume.tid) || isNaN(req.consume.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var mysteryShop;
            var player, petPkg, petFrgPkg, lotteryCnt;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    lotteryDb.getLotteryCnt(req.zid, req.zuid, false, callback);
                },

                function(result, callback) {
                    lotteryCnt = result;
                    packageDb.getPlayerAndPackages(req.zid, req.zuid, false, callback);
                },

                function(result, callback) {
                    player = result[0];
                    petPkg = result[globalObject.PACKAGE_TYPE_PET];
                    petFrgPkg = result[globalObject.PACKAGE_TYPE_PET_FRAGMENT];
                    mysteryShopDb.getMysteryShop(req.zid, req.zuid, callback);
                },
                
                function(result, callback) {
                    mysteryShop = cMysteryShop.updateMysteryShop(result);

                    if(csvManager.Viplist()[player.vipLevel].PART_NUM - mysteryShop.refreshCnt <= 0) {
                        callback(retCode.LEFT_NUM_ZERO);
                        return;
                    }

                    /* 可以免费刷新 */
                    if(mysteryShop.freeRefreshCnt < cMysteryShop.freeRefreshLimit) {
                        mysteryShop.freeRefreshCnt += 1;
                        callback(null);
                        return;
                    }

                    mysteryShop.refreshCnt += 1;
                    var item = new globalObject.ItemBase();
                    item.tid = req.consume.tid;
                    item.itemId = req.consume.itemId;
                    item.itemNum = 0;
                    switch (item.tid) {
                        case itemType.ITEM_TYPE_DIAMOND:
                            item.itemNum = 20;
                            break;
                        case itemType.ITEM_TYPE_REFRESH_TOKEN:
                            item.itemNum = 1;
                            break;
                        default :
                            break;
                    }
                    if(item.itemNum == 0) {
                        callback(retCode.WRONG_ITEM_TYPE);
                        return;
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [item], [], req.channel, req.acc, logsWater.MYSTERYSHOPREFRESH_LOGS, req.consume.tid, function(err) {
                        callback(err);
                    });
                },

                function (callback) {
                    mysteryShop.itemsRcd = cMysteryShop.refreshItemsIndex(player, petPkg, petFrgPkg, lotteryCnt);

                    for(var i in mysteryShop.itemsRcd) {
                        res.indexArr.push(parseInt(i));
                        if(mysteryShop.itemsRcd[i] > 0) {
                            res.mysteryArr.push(parseInt(i));
                        }
                    }

                    mysteryShopDb.setMysteryShop(req.zid, req.zuid, mysteryShop);
                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 25, 1);
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
    return CS_MysteryShopRefresh;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 神秘商店购买
 */
var CS_MysteryShopPurchase = (function() {

    /**
     * 构造函数
     */
    function CS_MysteryShopPurchase() {
        this.reqProtocolName = packets.pCSMysteryShopPurchase;
        this.resProtocolName = packets.pSCMysteryShopPurchase;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MysteryShopPurchase.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MysteryShopPurchase();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.indexNum
                || null == req.num) {
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

            var  mysteryShop;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    mysteryShopDb.getMysteryShop(req.zid, req.zuid, callback);
                },

                function(result, callback) {
                    mysteryShop = cMysteryShop.updateMysteryShop(result);

                    if(mysteryShop.itemsRcd[req.indexNum] !== 0) {
                        callback(retCode.ERR);
                        return;
                    }

                    var mscTable = csvManager.MysteryShopConfig();
                    var arrSub = shopCommon.countCost(mscTable, req.indexNum, 1);
                    var arrAdd = shopCommon.getAddItem(mscTable, req.indexNum, 1);
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.MYSTERYSHOPREFRESH_LOGS, req.indexNum, function(err, retAdd) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        res.buyItem = retAdd;
                        callback(null);
                    });
                },

                function(callback) {
                    res.isBuySuccess = 1;
                    mysteryShop.itemsRcd[req.indexNum] = 1;
                    mysteryShopDb.setMysteryShop(req.zid, req.zuid, mysteryShop);
                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 24, 1);
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
    return CS_MysteryShopPurchase;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_MysteryShopQuery());
    exportProtocol.push(new CS_MysteryShopRefresh());
    exportProtocol.push(new CS_MysteryShopPurchase());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
