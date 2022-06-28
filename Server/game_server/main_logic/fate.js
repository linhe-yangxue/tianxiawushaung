/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：天命值清零: 根据上次客户段的请求时间判断清零与否，并记录这次请求的时间，天命升级：判断等级和升级资源是否满足
 * ，天命升级是以一定概率升级
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/fate');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var csvManager = require('../../manager/csv_manager').Instance();
var itemType = require("../common/item_type");
var attrType = require('../common/attribute_type');
var cPackage = require('../common/package');
var fateDb = require("../database/fate");
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var timeUtil = require('../../tools/system/time_util');
var cZuid = require('../common/zuid');
var rand = require('../../tools/system/math').rand;
var cRevelry = require('../common/revelry');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 天命值清零
 */
var CS_FateQuery = (function() {

    /**
     * 构造函数
     */
    function CS_FateQuery() {
        this.reqProtocolName = packets.pCSFateQuery;
        this.resProtocolName = packets.pSCFateQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FateQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FateQuery();
        res.pt = this.resProtocolName;

        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(!req || !req.tk || !req.zid || !req.zuid || !req.itemId || !req.tid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.itemId = parseInt(req.itemId);
            req.tid = parseInt(req.tid);

            if(isNaN(req.zid) || isNaN(req.itemId) || isNaN(req.tid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var aType; /* 属性类型 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                 },

                /* 判断是主角还是宠物 */
                function(callback) {
                    switch (itemType.getMainType(req.tid)) {
                        case itemType.MAIN_TYPE_CHARACTER:
                            aType = attrType.CHAR_FATE;
                            callback(null);
                            return;
                        case itemType.MAIN_TYPE_PET:
                            aType = attrType.PET_FATE;
                            callback(null);
                            return;
                        default:
                            callback(retCode.TYPE_ERR);
                            return;
                    }
                },

                /* 判断天命值是否要重置 */
                function(callback) {
                    fateDb.isFateExpNeedReset(req.zid, req.zuid, req.itemId, callback);
                },

                function(needReset, callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, aType, function(level, fateLevel, fateValue, fateStone, cb) {
                        if(needReset) {
                            fateValue = 0;
                        }

                        res.fateValue = fateValue;
                        cb(null, fateLevel, fateValue, fateStone);
                    }, callback);
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
    return CS_FateQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 天命升级
 */
var CS_FateUpgrade = (function() {

    /**
     * 构造函数
     */
    function CS_FateUpgrade() {
        this.reqProtocolName = packets.pCSFateUpgrade;
        this.resProtocolName = packets.pSCFateUpgrade;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FateUpgrade.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FateUpgrade();
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
                || null == req.itemId
                || null == req.tid
                || null == req.consume) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.itemId = parseInt(req.itemId);
            req.tid = parseInt(req.tid);

            if(isNaN(req.zid) || isNaN(req.itemId) || isNaN(req.tid)) {
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

            /* 请求前后的天命等级和天命值 */
            var preLevel, nextLevel, preValue, nextValue;
            var aType; /* 属性类型 */
            var curLvlStoneCost; /* 当前等级消耗天命石数量 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                 },

                /* 判断是主角还是宠物 */
                function(callback) {
                    switch (itemType.getMainType(req.tid)) {
                        case itemType.MAIN_TYPE_CHARACTER:
                            aType = attrType.CHAR_FATE;
                            callback(null);
                            return;
                        case itemType.MAIN_TYPE_PET:
                            aType = attrType.PET_FATE;
                            callback(null);
                            return;
                        default:
                            callback(retCode.TYPE_ERR);
                            return;
                    }
                },

                /* 判断天命值是否要重置 */
                function(callback) {
                    fateDb.isFateExpNeedReset(req.zid, req.zuid, req.itemId, callback);
                },

                function(needReset, callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, aType, function(level, fateLevel, fateValue, fateStone, cb) {
                        if (needReset) {
                            fateValue = 0;
                        }

                        /* 升级前的等级和天命值 */
                        preValue = fateValue;
                        preLevel = fateLevel;
                        cb(null, fateLevel, fateValue, fateStone);
                    },callback);
                },

                /* 扣除天命石 */
                function(callback) {
                    var fsTable = csvManager.FateStrengthConfig();
                    var fsLine = fsTable[preLevel];
                    if(!fsLine) {
                        callback(retCode.FATE_LEVEL_WRONG);
                        return;
                    }

                    if(!fsTable[preLevel + 1]) {
                        callback(retCode.FATE_LEVEL_MAX);
                        return;
                    }

                    var arrSub = [];
                    req.consume.tid = itemType.STONE_TYPE_FATE;
                    req.consume.itemNum = fsLine.COST_NUM;
                    arrSub.push(req.consume);
                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, [], req.channel, req.acc, logsWater.FATEUPGRADE_LOGS, req.consume.tid, function(err) {
                       callback(err);
                    });
                },

                /* 获取当前等级天命石总消耗 */
                function(callback) {
                    if(0 == preValue) {
                        callback(null, 0);
                    }
                    else {
                        fateDb.getFateStoneCost(req.zid, req.zuid, req.itemId, callback);
                    }
                },

                /* 更新天命 */
                function(result, callback) {
                    curLvlStoneCost = result;

                    var levelUp = 0;
                    var fsLine = csvManager.FateStrengthConfig()[preLevel];

                    /* 消耗天命石数量升级  */
                    curLvlStoneCost += fsLine.COST_NUM;
                    var a = fsLine.LV_UP_RATE.split('|');
                    for(var i = 0; i < a.length; ++i) {
                        var b = a[i].split('#');
                        if(curLvlStoneCost >= parseInt(b[0]) && curLvlStoneCost <= parseInt(b[1])
                            && Math.random() <= parseFloat(b[2])) {
                            levelUp = 1;
                            break;
                        }
                    }

                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, aType, function(level, fateLevel, fateValue, fateStone, cb) {
                        fateStone += fsLine.COST_NUM;

                        if(levelUp) {
                            fateLevel += 1;
                            fateValue = 0;
                        }
                        else {
                            var a = fsLine.PROGRESS_ADD.split('#');
                            var b = rand(0, a.length-1);
                            fateValue += parseInt(a[b]);

                            if(fateValue >= fsLine.NEED_NUM) {
                                fateValue -= fsLine.NEED_NUM;
                                fateLevel += 1;
                            }
                        }

                        /* 升级前的等级和天命值 */
                        nextValue = fateValue;
                        nextLevel = fateLevel;

                        res.fateValue = nextValue;
                        if(nextLevel > preLevel) {
                            res.isFateSuccess = 1;
                            cRevelry.updateRevelryProgress(req.zid, req.zuid, 32, nextLevel);
                        }
                        cb(null, fateLevel, fateValue, fateStone);
                    },callback);
                },

                /* 更新当天当前等级消耗天命石数量 */
                function(callback) {
                    if(res.isFateSuccess) {
                        fateDb.setFateStoneCost(req.zid, req.zuid, req.itemId, 0);
                    }
                    else {
                        fateDb.setFateStoneCost(req.zid, req.zuid, req.itemId, curLvlStoneCost);
                    }
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_fate, preZid, req.channel, req.zuid, req.zuid, req.itemId, req.tid, JSON.stringify(req.consume), preLevel, nextLevel, preValue, nextValue);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_FateUpgrade;
})();

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_FateQuery());
    exportProtocol.push(new CS_FateUpgrade());
    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;


