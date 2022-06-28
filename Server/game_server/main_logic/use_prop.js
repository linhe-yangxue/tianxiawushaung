/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：使用道具, 开宝箱玩家自选物品
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/use_prop');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtend =  require('../../manager/csv_extend_manager').Instance();
var logsWater = require('../../common/logs_water');
var filter = require('../common/filter_common');
var guildCommon = require('../common/guild_common');
var wallPaper = require('../database/wallPaper');
var itemType = require("../common/item_type");
var lotteryDb = require('../database/lottery');
var cLottery = require('../common/lottery');
var packageDb = require('../database/package');
var globalObject = require('../../common/global_object');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 使用道具
 */
var CS_UseProp = (function() {

    /**
     * 构造函数
     */
    function CS_UseProp() {
        this.reqProtocolName = packets.pCSUseProp;
        this.resProtocolName = packets.pSCUseProp;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_UseProp.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_UseProp();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.prop) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.prop.itemId
                || null == req.prop.tid
                || null == req.prop.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.prop.itemId = parseInt(req.prop.itemId);
            req.prop.tid = parseInt(req.prop.tid);
            req.prop.itemNum = parseInt(req.prop.itemNum);

            if(isNaN(req.prop.itemId) || isNaN(req.prop.tid) || isNaN(req.prop.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player, petPkg, petFrgPkg;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    packageDb.getPlayerAndPackages(req.zid, req.zuid, false, callback);
                },

                function(pap, callback) {
                    player = pap[0];
                    petPkg = pap[globalObject.PACKAGE_TYPE_PET];
                    petFrgPkg = pap[globalObject.PACKAGE_TYPE_PET_FRAGMENT];

                    lotteryDb.getLotteryCnt(req.zid, req.zuid, false, callback);
                },

                function(lotteryCnt, callback) {
                    var tiLine = csvManager.ToolItem()[req.prop.tid];
                    if(!tiLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    if(tiLine.USELEVEL > player.character.level) {
                        callback(retCode.LACK_OF_LEVEL);
                        return;
                    }

                    var type = tiLine.ITEM_GROUP_TYPE;
                    var groupId = tiLine.ITEM_GROUP_ID;
                    if(2 == type) { /* 随机获取一个 */
                        var item = cLottery.openWithHiddenRule(petPkg, petFrgPkg, lotteryCnt, groupId);
                        callback(null, [item]);
                    } else if(1 == type) { /* 全部获取 */
                        callback(null, csvExtend.GroupIDConfigAllByGroupID(groupId));
                    } else { /* 不是宝物箱 诸如体力丹之类的*/
                        csvExtend.GroupIDConfig_DropId(groupId, req.prop.itemNum, callback);
                    }
                },

                /* 物品放入背包，同时扣除宝箱数量 */
                function(itemArr, callback) {
                    if(itemArr[0].tid == 1000013) { /* 公会经验特殊处理 */
                        guildCommon.addGuildExp(req.zid, req.zuid, itemArr[0].itemNum, callback);
                        itemArr.splice(0, 1);
                    }

                    var costArr = [req.prop];
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr, itemArr, req.channel, req.acc, logsWater.USEPROP_LOGS, req.prop.tid, function(err, retAdd) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.items = retAdd;
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
    return CS_UseProp;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开宝箱玩家自选物品
 */
var CS_OpenBoxSelect = (function() {

    /**
     * 构造函数
     */
    function CS_OpenBoxSelect() {
        this.reqProtocolName = packets.pCSOpenBoxSelect;
        this.resProtocolName = packets.pSCOpenBoxSelect;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_OpenBoxSelect.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_OpenBoxSelect();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.prop
                || null == req.selectItem) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.prop.itemId
                || null == req.prop.tid
                || null == req.prop.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.prop.itemId = parseInt(req.prop.itemId);
            req.prop.tid = parseInt(req.prop.tid);
            req.prop.itemNum = parseInt(req.prop.itemNum);

            if(isNaN(req.prop.itemId) || isNaN(req.prop.tid) || isNaN(req.prop.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.selectItem.itemId
                || null == req.selectItem.tid
                || null == req.selectItem.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.selectItem.itemId = parseInt(req.selectItem.itemId);
            req.selectItem.tid = parseInt(req.selectItem.tid);
            req.selectItem.itemNum = parseInt(req.selectItem.itemNum);

            if(isNaN(req.selectItem.itemId) || isNaN(req.selectItem.tid) || isNaN(req.selectItem.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 检查请求参数  */
                function(callback) {
                    var tiLine = csvManager.ToolItem()[req.prop.tid];
                    if(!tiLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    if(tiLine.ITEM_GROUP_TYPE != 3) {
                        callback(retCode.WRONG_ITEM_TYPE);
                        return;
                    }

                    var tidFound = false;
                    var giLines = csvExtend.GroupIDConfigRecordsByGroupID(tiLine.ITEM_GROUP_ID);
                    for(var i = 0; i < giLines.length; ++i) {
                        if(giLines[i].ITEM_ID == req.selectItem.tid) {
                            tidFound = true;
                            req.selectItem.itemNum = giLines[i].ITEM_COUNT * giLines[i].LOOT_TIME * req.prop.itemNum;
                            break;
                        }
                    }

                    if(!tidFound) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    callback(null);
                },

                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },
                /* 物品放入背包，同时扣除宝箱数量 */
                function( player, callback) {
                    var costArr = [];
                    var itemArr = [];
                    costArr.push( req.prop);
                    itemArr.push(req.selectItem);

                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, costArr, itemArr, req.channel, req.acc, logsWater.OPENBOXSELECT_LOGS, req.prop.tid, function(err, retAdd) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        res.items = retAdd;
                        /* 更新玩家走马灯信息 */
                        if(itemType.MAIN_TYPE_PET == itemType.getMainType( req.selectItem.tid)) {
                            wallPaper.updateRollingWallPaper(req.zid, req.zuid, player,  req.prop.tid, 2, retAdd);
                        }
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
    return CS_OpenBoxSelect;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_UseProp());
    exportProtocol.push(new CS_OpenBoxSelect());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
