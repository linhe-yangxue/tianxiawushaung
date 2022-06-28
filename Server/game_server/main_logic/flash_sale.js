
/**
 * 包含的头文件
 */
var packets = require('../packets/flash_sale');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var logsCode = require('../../common/logs_code');
var globalObject = require('../../common/global_object');
var playerDb = require('../database/player');
var csvManager = require('../../manager/csv_manager').Instance();
var flashSaleDb = require('../database/flash_sale');
var timeUtil = require('../../tools/system/time_util');
var flashSaleComm = require('../common/flash_sale');
var protocolObject = require('../../common/protocol_object');
var itemType = require('../common/item_type');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取限时抢购列表
 */
var CS_GetFlashSaleList = (function() {

    /**
     * 构造函数
     */
    function CS_GetFlashSaleList() {
        this.reqProtocolName = packets.pCSGetFlashSaleList;
        this.resProtocolName = packets.pSCGetFlashSaleList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetFlashSaleList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetFlashSaleList();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.type) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.type = parseInt(req.type);

            if(false || isNaN(req.zid) || isNaN(req.type)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var zid = req.zid;
            var zuid = req.zuid;
            var type = req.type;
            var player;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    flashSaleComm.updateFlashSale(zid, zuid, type, callback);
                },

                function (putawayItemListShow, callback) {
                    res.flashSaleList = putawayItemListShow;
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
    return CS_GetFlashSaleList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 限时抢购
 */
var CS_FlashPurchase = (function() {

    /**
     * 构造函数
     */
    function CS_FlashPurchase() {
        this.reqProtocolName = packets.pCSFlashPurchase;
        this.resProtocolName = packets.pSCFlashPurchase;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FlashPurchase.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FlashPurchase();
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

            if(false || isNaN(req.zid) || isNaN(req.index)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var zid = req.zid;
            var zuid = req.zuid;
            var index = req.index;
            var consumes = [];
            var rewards = [];
            var putawayItemListShow;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    flashSaleComm.updateFlashSale(zid, zuid, 0, callback);
                },

                function (putawayItemListShowCb,callback) {
                    putawayItemListShow = putawayItemListShowCb;
                    playerDb.getPlayerData(zid, zuid, false, callback);
                },

                function (player, callback) {
                    var flashSaleEventCfg = csvManager.FlashSaleEvent()[index];
                    if(!flashSaleEventCfg) {
                        callback(retCode.FLASH_SALE_NOT_EXIST);
                        return;
                    }
                    if(flashSaleEventCfg.PRICE.split('#')[1] > player.diamond) {
                        callback(retCode.LACK_OF_DIAMOND);
                        return;
                    }
                    for(var i = 0; i < putawayItemListShow.length; i++) {
                        if(putawayItemListShow[i].index === index) {
                            if(putawayItemListShow[i].state === 1) {
                                callback(retCode.FLASH_SALE_HAS_PURCHASED);
                                return;
                            }
                            break;
                        }
                    }
                    if(i >= putawayItemListShow.length) {
                        callback(retCode.FLASH_SALE_CAN_NOT_APPROACH);
                        return;
                    }
                    // 标记已购买
                    putawayItemListShow[i].state = 1;
                    callback(null, flashSaleEventCfg);
                },

                function (flashSaleEventCfg, callback) {
                    /* 元宝 */
                    var newItem = new protocolObject.ItemObject();
                    newItem.tid = itemType.ITEM_TYPE_DIAMOND;
                    newItem.itemNum = flashSaleEventCfg.PRICE.split('#')[1];
                    consumes.push(newItem);

                    rewards = getItems(flashSaleEventCfg.ITEM_LIST);
                    cPackage.smartUpdateItemWithLog(zid, zuid, consumes, rewards, req.channel, req.acc, logsWater.CHALLENGERESULT_LOGS, index, function (err, retAdd) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.rewards = retAdd;
                        callback(null);
                    });
                },

                function (callback) {
                    flashSaleDb.setFlashSaleItems(zid, zuid, putawayItemListShow, callback);
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
    return CS_FlashPurchase;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetFlashSaleList());
    exportProtocol.push(new CS_FlashPurchase());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;


var getItems = function(groupStr) {
    if('0' === groupStr) {
        return [];
    }
    var groupStrArr = groupStr.split('|');
    var items = [];
    for(var i in groupStrArr) {
        var arr = groupStrArr[i].split('#');
        var item = new globalObject.ItemBase();
        item.tid = parseInt(arr[0]);
        item.itemNum = parseInt(arr[1]);
        items.push(item);
    }
    return items;
};
