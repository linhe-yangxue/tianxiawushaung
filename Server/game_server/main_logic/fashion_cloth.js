/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：当前时装状态请求, 时装的强化，时装重铸
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/fashion_cloth');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var dbManager_Csv = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var clothDB = require('../database/fashion_cloth');
var fashion = require('../common/fashion_cloth');
var logsWater = require('../../common/logs_water');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 时装请求
 */
var CS_FashionCloth = (function() {

    /**
     * 构造函数
     */
    function CS_FashionCloth() {
        this.reqProtocolName = packets.pCSFashionCloth;
        this.resProtocolName = packets.pSCFashionCloth;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request : 通讯协议的请求对象
     * @param response : 通讯协议的响应对象
     */
    CS_FashionCloth.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FashionCloth();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.clothID) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.clothID = parseInt(req.clothID);

            if(isNaN(req.zid) || isNaN(req.clothID)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    clothDB.getClothState(req.zid, req.zuid,(req.clothID).toString(),function(err,data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.clothLevel = data.clothLevel;
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
    return CS_FashionCloth;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 时装强化
 */
var CS_ClothStrength = (function() {

    /**
     * 构造函数
     */
    function CS_ClothStrength() {
        this.reqProtocolName = packets.pCSClothStrength;
        this.resProtocolName = packets.pSCClothStrength;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request : 通讯协议的请求对象
     * @param response : 通讯协议的响应对象
     */
    CS_ClothStrength.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClothStrength();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.clothID) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.clothID = parseInt(req.clothID);

            if(isNaN(req.zid) || isNaN(req.clothID)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var fashionCloth = new globalObject.ClothState();
            var avatarData = dbManager_Csv.AvatarLvConfig();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 獲取时装强化信息 */
                function(callback) {
                    if(undefined == avatarData[ req.clothID] || null == avatarData[ req.clothID]) { /* 时装不存在 */
                        callback(retCode.CLOTH_NOT_EXIST);
                        return;
                    }
                    clothDB.getClothState(req.zid, req.zuid,(req.clothID).toString(),function(err,data) {
                        if(err) {
                           callback(err);
                            return;
                        }
                        fashionCloth = data;
                        callback(null);
                    });
                },
                function(callback) {
                    var level = fashionCloth.clothLevel;
                    var costArr = fashion.computeCost(avatarData,req.clothID,req.consume,level);
                    cPackage.updateItemWithLog(req.zid, req.zuid, costArr, [], req.channel, req.acc, logsWater.CLOTHSTRENGTH_LOGS, req.clothID, function(err) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        fashionCloth.clothLevel += 1;
                        clothDB.saveClothState(req.zid, req.zuid,(req.clothID).toString(),fashionCloth,callback);
                    })
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
    return CS_ClothStrength;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 时装重铸
 */
var CS_ClothRecoin = (function() {

    /**
     * 构造函数
     */
    function CS_ClothRecoin() {
        this.reqProtocolName = packets.pCSClothRecoin;
        this.resProtocolName = packets.pSCClothRecoin;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request : 通讯协议的请求对象
     * @param response : 通讯协议的响应对象
     */
    CS_ClothRecoin.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClothRecoin();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.clothID) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.clothID = parseInt(req.clothID);

            if(isNaN(req.zid) || isNaN(req.clothID)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var avatarData = dbManager_Csv.AvatarLvConfig();
            var fashionCloth = new globalObject.ClothState();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    clothDB.getClothState(req.zid, req.zuid,(req.clothID).toString(),function(err,data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        fashionCloth = data;
                        callback(null);
                    });
                    callback(null);
                },
                function(callback) {
                    var level = fashionCloth.clothLevel;

                    var addArr = [];
                    /* 重铸返回的物品加入背包或者玩家身上 */
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], addArr, req.channel, req.acc, logsWater.CLOTHRECOIN_LOGS, req.clothID, function(err, subArr, addArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        fashionCloth.clothLevel = 1; /* 重铸成功后时装等级变为初始级数 */
                        clothDB.saveClothState(req.zid, req.zuid,(req.clothID).toString(),fashionCloth,callback); /* 保存该时装的状态 */
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
    return CS_ClothRecoin;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_FashionCloth());
    exportProtocol.push(new CS_ClothStrength());
    exportProtocol.push(new CS_ClothRecoin());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
