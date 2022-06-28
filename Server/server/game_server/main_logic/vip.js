/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：VIP礼包(集市)  根据VIP等级对物品购买行为结果记录
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/vip');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var playerDb = require('../database/player');
var vipShopDb = require('../database/vip');
var shopCommon = require('../common/shop_common');
var logsWater = require('../../common/logs_water');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP商店
 */
var CS_VIPShop = (function() {

    /**
     * 构造函数
     */
    function CS_VIPShop() {
        this.reqProtocolName = packets.pCSVIPShop;
        this.resProtocolName = packets.pSCVIPShop;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_VIPShop.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_VIPShop();
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

            if(isNaN(req.zid)  || isNaN(req.index)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var mallShopLine = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取玩家信息 */
                function(callback) {
                    mallShopLine = csvManager.MallShopConfig()[req.index];
                    if(!mallShopLine) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }

                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },
                function(player, callback) {
                    if(player.vipLevel <  mallShopLine.OPEN_NUM) {
                        callback(retCode.LACK_OF_VIP_LEVEL);
                        return;
                    }

                    /* 获取相应vip礼包的购买信息 */
                    vipShopDb.getVIPBuyInfo(req.zid, req.zuid, req.index, callback);
                },
                /* 扣除消耗品 */
                function(buyInfo, callback) {
                    /* 验证对应vip等级的礼包是否已购买过，不可重复购买 */
                    if(!buyInfo || 1 == buyInfo.buyNum) {
                        callback(retCode.VIP_GIFT_BOUGHT);
                        return;
                    }
                    var shopData = csvManager.MallShopConfig();
                    var costArr = shopCommon.computeCost(shopData,[], req.index, 1);
                    var buyArr = shopCommon.getAddItem(shopData, req.index, 1);
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr,
                        buyArr, req.channel, req.acc, logsWater.VIPSHOP_LOGS, req.index, function(err, addArr) {
                            if(err) {
                                callback(err);
                                return;
                            }
                            res.isBuySuccess = 1;
                            res.buyItem = addArr;
                            buyInfo.buyNum = 1;
                            vipShopDb.saveVIPBuyInfo(req.zid, req.zuid, req.index, buyInfo);
                            callback(null);
                    });
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
    return CS_VIPShop;
})();

/**
 * VIP商店请求
 */
var CS_VIPShopQuery = (function() {

    /**
     * 构造函数
     */
    function CS_VIPShopQuery() {
        this.reqProtocolName = packets.pCSVIPShopQuery;
        this.resProtocolName = packets.pSCVIPShopQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_VIPShopQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_VIPShopQuery();
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
                /* 获取所有vip礼包的购买状态信息 */
                function(callback) {
                    vipShopDb.getAllVIPBuyInfo(req.zid, req.zuid, function(err, array) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.buyInfo = array;
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
    return CS_VIPShopQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_VIPShop());
    exportProtocol.push(new CS_VIPShopQuery());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

