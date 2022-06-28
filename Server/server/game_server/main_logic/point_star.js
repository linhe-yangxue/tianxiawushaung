/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：点星相关功能：获取点星界面的功能、点击点亮按钮
 * 开发者：王强
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */



/**
 * 包含的头文件
 */
var packets = require('../packets/point_star');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var pointStarDb = require('../database/point_star');
var csvManager = require('../../manager/csv_manager').Instance();
var protocolObject = require('../../common/protocol_object');
var itemType = require('../common/item_type');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取点星界面的功能
 */
var CS_PointStarMap = (function() {

    /**
     * 构造函数
     */
    function CS_PointStarMap() {
        this.reqProtocolName = packets.pCSPointStarMap;
        this.resProtocolName = packets.pSCPointStarMap;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PointStarMap.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PointStarMap();
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
                /* 获取点星界面信息 */
                function(callback) {
                    pointStarDb.getPointStarIndex(req.zid, req.zuid, function(err, index) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.currentIndex = index;
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
    return CS_PointStarMap;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 点击点亮按钮
 */
var CS_PointLightenClick = (function() {

    /**
     * 构造函数
     */
    function CS_PointLightenClick() {
        this.reqProtocolName = packets.pCSPointLightenClick;
        this.resProtocolName = packets.pSCPointLightenClick;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PointLightenClick.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PointLightenClick();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid
                || null == req.itemArr) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            for(var i = 0; i < req.itemArr.length; ++i) {
                if(null == req.itemArr[i]
                    || null == req.itemArr[i].itemId
                    || null == req.itemArr[i].tid
                    || null == req.itemArr[i].itemNum) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }

                req.itemArr[i].itemId = parseInt(req.itemArr[i].itemId);
                req.itemArr[i].tid = parseInt(req.itemArr[i].tid);
                req.itemArr[i].itemNum = parseInt(req.itemArr[i].itemNum);

                if(isNaN(req.itemArr[i].itemId) || isNaN(req.itemArr[i].tid) || isNaN(req.itemArr[i].itemNum)) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }
            }

            var currentIndex;     /* 当前点星的索引 */
            var pointStarInfo;   /* 点星配置表数据 */
            var tmpArrLength;     /* 配置表长度 */
            var dropArr = [];     /* 消耗的道具 */
            var expendArr = [];   /* 新增的道具 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 判断当前索引值 */
                function(callback) {
                    pointStarDb.getPointStarIndex(req.zid, req.zuid, function (err, index) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        var map = csvManager.PointStarConfig();
                        tmpArrLength = Object.keys(map).length;
                        if (index <= 0 || index > tmpArrLength) {
                            callback(retCode.POINT_STAR_CURRENT_INDEX_NOT_EXIST);
                            return;
                        }
                        currentIndex = index;
                        callback(null);
                    });
                },
                /*点亮星星减少所消耗符文*/
                function(callback) {
                    var j = 0;
                    pointStarInfo = csvManager.PointStarConfig()[currentIndex];
                    if (!pointStarInfo) {
                        callback(retCode.POINT_STAR_CONFIG_ERROT);
                        return;
                    }
                    var len = req.itemArr.length;
                    for(var i = 0; i < len; ++i) {
                        if( req.itemArr[i].tid == itemType.ITEM_TYPE_RUNE) {
                            req.itemArr[i].itemNum = pointStarInfo.COST;
                            expendArr.push(req.itemArr[i]);
                        }
                        else {
                            ++j;
                            dropArr.push(req.itemArr[i]);
                        }
                    }
                    if(len  == j) { /* 没有消耗品 */
                        callback(retCode.TID_OR_STAR_COST_ERROR);
                        return;
                    }
                    cPackage.updateItemWithLog(req.zid, req.zuid, expendArr,
                        dropArr, req.channel, req.acc, logsWater.POINTLIGHTENCLICK, '', function (err, subArr, addArr) {
                        res.arr = addArr;
                        callback(err);
                    });
                },
                /* 置成功标志位,增加索引值 */
                function(callback) {
                    if(currentIndex > tmpArrLength) {
                        callback(retCode.POINT_STAR_CURRENT_INDEX_NOT_EXIST);
                        return;
                    }
                    ++currentIndex;
                    res.currentIndex = currentIndex;
                    pointStarDb.savePointStarIndex(req.zid, req.zuid, currentIndex);
                    if(5 == pointStarInfo.REWARD_TYPE) {
                        var upgradeTid = pointStarInfo.REWARD_NUMERICAL;
                        var upgradeArr = upgradeTid.split('|');
                        playerDb.getPlayerData(req.zid, req.zuid, true, function(err, player) {
                            if(err) {
                                callback(err);
                                return;
                            }
                            var index = parseInt((player.character.tid / 100) % 10);
                           // player.character.tid = parseInt(upgradeArr[index]);
                            var leftValue = parseInt(player.character.tid / 100);
                            var rightValue = parseInt(parseInt(upgradeArr[index]) / 100);
                            player.character.tid = parseInt(upgradeArr[index]);
                            if( leftValue != rightValue) {
                                player.character.tid = parseInt(upgradeArr[index+1]);
                            }
                            playerDb.savePlayerData(req.zid, req.zuid, player, true, callback);
                        });
                    }
                    else {
                        callback(null);
                    }
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_hero_star, preZid, req.channel, req.zuid, req.zuid, 0, '', '', 0, currentIndex, currentIndex - 1, JSON.stringify(expendArr), JSON.stringify(dropArr));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_PointLightenClick;
})();
/**-------------------------------------------------------------------------------------------------------------------*/






/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_PointStarMap());
    exportProtocol.push(new CS_PointLightenClick());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
