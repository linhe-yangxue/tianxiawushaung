/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：公会商店：请求物品购买状态，记录购买行为
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/guild_shop');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var redisKey = require('../../common/redis_key');
var dbManager =  require('../../manager/redis_manager').Instance();
var async = require('async');
var csvManager = require('../../manager/csv_manager').Instance();
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var guildShopDb = require('../database/guild_shop');
var guildDb =  require('../database/guild');
var shopDb = require('../database/shop');
var playerDb = require('../database/player');
var timeUtil = require('../../tools/system/time_util');
var protocolObject = require('../../common/protocol_object');
var shopCommon = require('../common/shop_common');
var logsWater = require('../../common/logs_water');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会商店
 */
var CS_GuildShopQuery = (function() {

    /**
     * 构造函数
     */
    function CS_GuildShopQuery() {
        this.reqProtocolName = packets.pCSGuildShopQuery;
        this.resProtocolName = packets.pSCGuildShopQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildShopQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildShopQuery();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            /* 需要的参数*/
            var nowTime = parseInt(Date.now() / 1000);
            var guildLevel = 0;
            var limitFreshTime = nowTime;
            var myReqTime = nowTime;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 验证该玩家是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(!player || req.zgid !== player.guildId) {
                            callback(retCode.GUILD_ID_NOT_EXIST);
                            return;
                        }
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },

                /* 获取公会信息 */
                function (callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, false,callback);
                },

                /* 获取上次请求时间 */
                function(guildInfo, callback) {
                    guildLevel = guildInfo.level;
                    guildShopDb.getGuildShopFreshTime(req.zid, req.zgid, req.zuid, nowTime, callback);
                },

                /* 获取非限时公会商店购买信息 */
                function(time1, time2, callback) {
                    myReqTime = time1;
                    limitFreshTime = time2;
                    var date = new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date, 0); /* 当天的零点时间 */
                    var guildShopData = csvManager.GuildShopConfig();
                    if(myReqTime < zeroTime) {
                        shopDb.refreshShopItemsInfo(req.zid, req.zgid, req.zuid, guildShopData, 'guild_other', callback);
                    } else {
                        guildShopDb.getGuildShopItemsInfo(req.zid, req.zgid, req.zuid, callback);
                    }
                },

                /* 获取限时公会商店购买信息 */
                function(array, callback) {
                    res.otherArr =array;
                    var fresh = shopCommon.isFresh(limitFreshTime, nowTime);
                    var mFresh = shopCommon.isFresh(myReqTime, nowTime);
                    if(fresh) { /* 到刷新时间点,执行相关刷新操作 */
                        guildShopDb.refreshLimBuyState(req.zid,req.zgid,  req.zuid, guildLevel, callback);
                    } else if(mFresh) {
                        guildShopDb.refreshMyDealItemsInfo(req.zid,req.zgid,  req.zuid, callback);
                    } else {
                        guildShopDb.getGuildLimitShopItemsInfo(req.zid,req.zgid,  req.zuid, guildLevel, callback);
                    }
                },

                function(priArr, pubArr, callback) {
                    res.pubLimArr = pubArr;
                    res.priLimArr = priArr;
                    res.time = shopCommon.getLeftTime(nowTime); /* 距离下次刷新时间点的剩余时间 */
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
    return CS_GuildShopQuery;
})();

/**
 * 公会商店非限时购买
 */
var CS_GuildShopOtherBuy = (function() {

    /**
     * 构造函数
     */
    function CS_GuildShopOtherBuy() {
        this.reqProtocolName = packets.pCSGuildShopOtherBuy;
        this.resProtocolName = packets.pSCGuildShopOtherBuy;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildShopOtherBuy.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildShopOtherBuy();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.gIndex
                || null == req.num
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.gIndex = parseInt(req.gIndex);
            req.num = parseInt(req.num);

            if(isNaN(req.zid) || isNaN(req.gIndex) || isNaN(req.num)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guildShopLine = null;
            var shopItem = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取玩家公会id判断是否在公会 */
                function(callback) {
                    guildShopLine = csvManager.GuildShopConfig()[req.gIndex];
                    if(!guildShopLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取公会信息 */
                function(player, callback) {
                    if(!player || req.zgid !== player.guildId) {
                        callback(retCode.GUILD_ID_NOT_EXIST);
                        return;
                    }
                    res.guildId = player.guildId;
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, false, callback);
                },

                /* 判断是否符合购买条件 以及判断是否为限购情况 */
                function(guild, callback) {
                    var needLevel = guildShopLine.OPEN_GUILD_LEVEL;
                    if(!guild || guild.level < needLevel) {
                        callback(retCode.GUILD_LEVEL_NOT_ENOUGH);
                        return;
                    }
                    if(0 == guildShopLine.BUY_NUM) { /* 不限购买次数 */
                        callback(null, null);
                    } else {
                        shopDb.getShopItemInfo(req.zid, req.zgid, req.zuid, req.gIndex, 'guild_other', callback);
                    }
                },

                /*购买次数是否达上限*/
                function(itemInfo, callback) {
                    shopItem = itemInfo;
                    shopCommon.isMaxBuyNum(shopItem, req.num, guildShopLine.BUY_NUM, callback);
                },

                /*未达购买上限,扣购买资源,同时将购买物品加入背包或玩家身上并将本次购买次数记入数据库*/
                function(callback) {
                    var guildShopData = csvManager.GuildShopConfig();
                    var costArr = shopCommon.computeCost(guildShopData, [], req.gIndex, req.num);
                    var buyArr = shopCommon.getAddItem(guildShopData,req.gIndex,req.num);
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr, buyArr, req.channel,
                        req.acc, logsWater.GUILDSHOPOTHERBUY_LOGS, res.guildId, function(err, addArr) {
                             res.buyItem = addArr ? addArr : [];
                             callback(err);
                    });
                },

                function(callback) {
                    res.isBuySuccess = 1;
                    if(shopItem) { /* 保存这次该物品的购买次数 */
                        shopDb.saveShopItemInfo(req.zid, req.zgid, req.zuid, req.gIndex, shopItem, 'guild_other');
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
    return CS_GuildShopOtherBuy;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会商店限时购买
 */
var CS_GuildShopLimitBuy = (function() {

    /**
     * 构造函数
     */
    function CS_GuildShopLimitBuy() {
        this.reqProtocolName = packets.pCSGuildShopLimitBuy;
        this.resProtocolName = packets.pSCGuildShopLimitBuy;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildShopLimitBuy.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildShopLimitBuy();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.gIndex
                || null == req.num
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.gIndex = parseInt(req.gIndex);
            req.num = parseInt(req.num);

            if(isNaN(req.zid) || isNaN(req.gIndex) || isNaN(req.num)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }


            var guildShopLine = null;
            var shopItem = null; /* 非限时商品购买信息 */
            var limitShopItem = null; /* 限时商品购买信息 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
               /* 获取玩家公会id信息 */
                function(callback) {
                    guildShopLine =  csvManager.GuildShopConfig()[req.gIndex];
                    if(!guildShopLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取公会信息 */
                function (player, callback) {
                    /* 判断是否在公会 */
                    if(!player || req.zgid !== player.guildId) {
                        callback(retCode.GUILD_ID_NOT_EXIST);
                        return;
                    }

                    res.guildId = player.guildId;
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, false, callback);
                },

                /* 获取所购物品的个人购买次数信息 */
                function(guild, callback) {
                    var needLevel = guildShopLine.OPEN_GUILD_LEVEL;

                    if(!guild || guild.level < needLevel) {
                        callback(retCode.GUILD_LEVEL_NOT_ENOUGH);
                        return;
                    }
                    shopDb.getShopItemInfo(req.zid, req.zgid, req.zuid, req.gIndex, 'guild_limit', callback);
                },

                /* 验证该物品的个人购买次数是否已达上限 */
                function(itemInfo, callback) {
                    shopItem = itemInfo;

                    if(!shopItem) {
                        callback(retCode.MAX_BUY_NUM_IS);
                        return;
                    }
                    shopCommon.isMaxBuyNum(shopItem, req.num, guildShopLine.BUY_NUM, callback);
                },

                /* 获取物品在整个公会的购买次数信息  */
                function(callback) {
                    guildShopDb.getSingleLimBuy(req.zid, req.zgid, req.gIndex, true, callback);
                },

                /* 验证该物品在整个公会的购买次数是否已达上限 */
                function(itemInfo, callback) {
                    limitShopItem = itemInfo;

                    if(!limitShopItem) {
                        callback(retCode.MAX_BUY_NUM_IS);
                        return;
                    }
                    shopCommon.isMaxBuyNum(limitShopItem, req.num, guildShopLine.MAX_ITEM_NUM, callback);
                },

                /*未达购买上限,扣购买资源,同时将购买物品加入背包或玩家身上并将本次购买次数记入数据库*/
                function(callback) {
                    var guildShopData = csvManager.GuildShopConfig();
                    var costArr = shopCommon.computeCost(guildShopData, [], req.gIndex, req.num);
                    var buyArr = shopCommon.getAddItem(guildShopData, req.gIndex, req.num);
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr, buyArr,
                        req.channel, req.acc, logsWater.GUILDSHOPOTHERBUY_LOGS, res.guildId, function(err, addArr) {
                            res.buyItem = addArr ? addArr : [];
                            callback(err);
                    });
                },

                function(callback) {
                    res.isBuySuccess = 1;
                    /* 保存这次该物品的购买次数到个人数据 */
                    if(shopItem) {
                        shopDb.saveShopItemInfo(req.zid, req.zgid, req.zuid, req.gIndex, shopItem, 'guild_limit');
                    }
                    /* 保存这次该物品的购买次数到整个公会数据 */
                    guildShopDb.saveSingleLimBuy(req.zid, req.zgid, req.gIndex, limitShopItem, callback);
                }
            ],function(err) {
                if(err) {
                    guildShopDb.openGuildShopLock(req.zid, req.zgid);
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildShopLimitBuy;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GuildShopQuery());
    exportProtocol.push(new CS_GuildShopOtherBuy());
    exportProtocol.push(new CS_GuildShopLimitBuy());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;


