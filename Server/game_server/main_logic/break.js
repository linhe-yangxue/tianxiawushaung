/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：符灵 主角突破升级
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/break');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require("async");
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var type = require("../common/item_type");
var attrType = require('../common/attribute_type');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var protocolObject = require("../../common/protocol_object");
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 突破升级
 */
var CS_BreakUpgrade = (function() {

    /**
     * 构造函数
     */
    function CS_BreakUpgrade() {
        this.reqProtocolName = packets.pCSBreakUpgrade;
        this.resProtocolName = packets.pSCBreakUpgrade;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BreakUpgrade.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BreakUpgrade();
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

            for(var i = 0; i < req.consume.length; ++i) {
                if(null == req.consume[i]
                    || null == req.consume[i].itemId
                    || null == req.consume[i].tid
                    || null == req.consume[i].itemNum) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }

                req.consume[i].itemId = parseInt(req.consume[i].itemId);
                req.consume[i].tid = parseInt(req.consume[i].tid);
                req.consume[i].itemNum = parseInt(req.consume[i].itemNum);

                if(isNaN(req.consume[i].itemId) || isNaN(req.consume[i].tid) || isNaN(req.consume[i].itemNum)) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }
            }

            var curBreakLevel = 0; /* 当前突破等级 */
            var roleLevel = 0; /* 当前角色的等级 */
            var breakType = 0; /* 突破类型 */
            var nowLevel = 0; /* 突破后等级 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                 accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                 },

                /* 判断是主角突破还是宠物突破 */
                function(callback) {
                    var pType = type.getMainType(req.tid);
                    if(pType == type.MAIN_TYPE_CHARACTER) {
                        breakType = attrType.CHAR_BREAK;
                    } else if(pType == type.MAIN_TYPE_PET) {
                        breakType = attrType.PET_BREAK;
                    }
                   if(0 == breakType) {
                       callback(retCode.TYPE_NOT_KNOW);
                       return;
                   }
                   callback(null);
                },

                function(callback) {
                    /*　获取角色当前的等级和突破等级*/
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, breakType, function(rLevel, level, cb) {
                        roleLevel = rLevel;
                        curBreakLevel = level;
                        cb(null, level);
                    },callback)
                },
                function(callback) {
                    var cardNum = 0;
                    var BreakData = csvManager.BreakLevelConfig();
                    var cardNeedNum = parseInt(BreakData[curBreakLevel].ACTIVE_NUM);
                    for(var i = 0, len = req.consume.length; i < len; ++i) {
                        if(type.STONE_TYPE_BREAK_STONE == req.consume[i].tid) {
                            req.consume[i].itemNum = BreakData[curBreakLevel].NEED_GEM_NUM;
                        } else if(req.tid == req.consume[i].tid) {
                            ++cardNum;
                        }else {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                    }
                    /* 卡片消耗不一致 只有宠物突破才会吃卡 */
                    if(breakType == attrType.PET_BREAK && ! isNaN(cardNeedNum) && cardNum != cardNeedNum) {
                        callback(retCode.CARD_CONSUME_NOT_RIGHT);
                        return;
                    }
                    callback(null);
                },
                function(callback) {
                    var BreakData = csvManager.BreakLevelConfig();
                    if(null == BreakData[curBreakLevel]) {
                        callback(retCode.BREAK_LEVEL_NOT_RIGHT);
                        return;
                    }
                    if(roleLevel < BreakData[curBreakLevel].ACTIVE_LEVEL) { /* 角色等级不够 */
                        callback(retCode.ROLE_LEVEL_NOT_ENOUGH);
                        return;
                    }
                    var length = Object.keys(BreakData).length;
                    if(curBreakLevel >= (BreakData[length - 1].INDEX + 1)) { /* 突破等级已达上限 */
                        callback(retCode.SUCCESS);
                        return;
                    }
                    var costArr = req.consume;
                    var item =  new protocolObject.ItemObject();
                    item.tid = type.ITEM_TYPE_GOLD;
                    item.itemNum = BreakData[curBreakLevel].NEED_COIN_NUM;
                    costArr.push(item);
                    cPackage.updateItemWithLog(req.zid, req.zuid, costArr, [],
                        req.channel, req.acc, logsWater.BREAKUPGRADE_LOGS, req.tid, function(err, subArr, addArr) { /*扣消耗品*/
                        callback(err);
                    });
                },

                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, breakType, function (rLevel, level, cb) {
                        var breakLevel = level;
                        breakLevel += 1;
                        res.isBreakSuccess = 1;
                        nowLevel = breakLevel;
                        cb(null, breakLevel);
                    }, callback);
                }

            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_hero_advanced, preZid,
                        req.channel, req.zuid, req.zuid, roleLevel, req.tid, '', 0, '突破', curBreakLevel, nowLevel);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_BreakUpgrade;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_BreakUpgrade());
    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

