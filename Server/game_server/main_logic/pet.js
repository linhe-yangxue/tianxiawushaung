
/**
 * 包含的头文件
 */
var packets = require('../packets/pet');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var packageDb = require('../database/package');
var csvManager = require('../../manager/csv_manager').Instance();
var attributeType = require('../common/attribute_type');
var itemType = require('../common/item_type');
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var logger = require('../../manager/log4_manager');
var mission = require('../common/mission');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');
var cRevelry = require('../common/revelry');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 宠物阵型变化的功能
 */
var CS_PetLineupChange = (function() {

    /**
     * 构造函数
     */
    function CS_PetLineupChange() {
        this.reqProtocolName = packets.pCSPetLineupChange;
        this.resProtocolName = packets.pSCPetLineupChange;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PetLineupChange.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PetLineupChange();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.teamPos
                || null == req.upItemId
                || null == req.upTid
                || null == req.downItemId
                || null == req.downTid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.teamPos = parseInt(req.teamPos);
            req.upItemId = parseInt(req.upItemId);
            req.upTid = parseInt(req.upTid);
            req.downItemId = parseInt(req.downItemId);
            req.downTid = parseInt(req.downTid);

            if(isNaN(req.zid) || isNaN(req.teamPos) || isNaN(req.upItemId)
                || isNaN(req.upTid) || isNaN(req.downItemId) || isNaN(req.downTid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 操作宠物阵型变化 */
                function(callback) {
                    cPackage.changeTeamPos(req.zid, req.zuid, req.downTid, req.downItemId, req.upTid, req.upItemId,
                        req.teamPos, callback);
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
    return CS_PetLineupChange;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 宠物升级的功能
 */
var CS_PetUpgrade = (function() {

    /**
     * 构造函数
     */
    function CS_PetUpgrade() {
        this.reqProtocolName = packets.pCSPetUpgrade;
        this.resProtocolName = packets.pSCPetUpgrade;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PetUpgrade.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PetUpgrade();
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
                || null == req.arr) {
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

            for(var i = 0; i < req.arr.length; ++i) {
                if(null == req.arr[i]
                    || null == req.arr[i].itemId
                    || null == req.arr[i].tid
                    || null == req.arr[i].itemNum) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }

                req.arr[i].itemId = parseInt(req.arr[i].itemId);
                req.arr[i].tid = parseInt(req.arr[i].tid);
                req.arr[i].itemNum = parseInt(req.arr[i].itemNum);

                if(isNaN(req.arr[i].itemId) || isNaN(req.arr[i].tid) || isNaN(req.arr[i].itemNum)) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }
            }

            var preLevel;
            var nextLevel;
            var preExp;
            var nextExp;

            var pets = []; /* 消耗的符灵 */
            var totExp = 0; /* 获得的总经验 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取符灵背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, false, callback);
                },

                /* 检查符灵 */
                function(petPkg, callback) {
                    for(var i = 0; i < req.arr.length; ++i) {
                        var petOut = req.arr[i];
                        petOut.itemNum = 1;
                        var outPetFind = false;

                        for(var k = 0; k < petPkg.content.length; ++k) {
                            var petIn = petPkg.content[k];

                            if(petIn.tid == petOut.tid && petIn.itemId == petOut.itemId) {
                                outPetFind = true;
                                pets.push(petIn);
                                break;
                            }
                        }

                        if(!outPetFind) {
                            callback(retCode.LACK_OF_ITEM);
                            return;
                        }
                    }
                    callback(null);
                },

                /* 扣除消耗 */
                function(callback) {
                    for(var i = 0; i < pets.length; ++i) {
                        var aoLine = csvManager.ActiveObject()[pets[i].tid];
                        var pleLine = csvManager.PetLevelExp()[pets[i].level];

                        if(!aoLine || !pleLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }

                        if(aoLine.STAR_LEVEL < 1 || aoLine.STAR_LEVEL > 7) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }

                        totExp += pleLine['TOTAL_EXP_' + aoLine.STAR_LEVEL] + aoLine.DROP_EXP;
                    }

                    /* 计算需要消耗的钱 */
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_GOLD;
                    item.itemNum = totExp; /* 消耗金币等于消耗道具的总经验 */
                    req.arr.push(item);

                    /* 扣除符灵和银币 */
                    cPackage.updateItemWithLog(req.zid, req.zuid, req.arr, [], req.channel, req.acc, logsWater.PETUPGRADE_LOGS, req.tid, function(err) {
                        callback(err);
                    });
                },

                /* 修改宠物的等级属性 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, attributeType.PET_LEVEL, function(roleLevel, level, exp, cb) {

                        var aoLine = csvManager.ActiveObject()[req.tid];
                        if(!aoLine || aoLine.STAR_LEVEL < 1 || aoLine.STAR_LEVEL > 7) {
                            cb(retCode.TID_NOT_EXIST);
                            return;
                        }

                        /* log使用 */
                        preLevel = level;
                        preExp = exp;

                        exp += totExp;

                        /* 获取当前等级所升级需要的经验，判断是否升级 */
                        while(true) {
                            var pleLine = csvManager.PetLevelExp()[level];
                            if(!pleLine) {
                                cb(retCode.TID_NOT_EXIST);
                                return;
                            }

                            var upgradeExp = pleLine['NEED_EXP_QUALITY_' + aoLine.STAR_LEVEL];

                            if(exp < upgradeExp) {
                                break;
                            }
                            else {
                                exp -= upgradeExp;
                                ++ level;

                                if (level >= roleLevel + 1) {
                                    level = roleLevel;
                                    exp = csvManager.PetLevelExp()[level]['NEED_EXP_QUALITY_' + aoLine.STAR_LEVEL] - 1;
                                    break;
                                }
                            }
                        }

                        /* log使用 */
                        nextLevel = level;
                        nextExp = exp;

                        cb(null, level, exp);
                    }, callback);
                },

                /* 更新任务进度 */
                function (callback) {
                    mission.updateDailyTask(req.zid, req.zuid, mission.TASK_TYPE_4, 0, 1);
                    mission.updateAchieveTask(req.zid, req.zuid, mission.TASK_TYPE_4, 0,  0, 1);
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
                    logger.logBI(preZid, biCode.logs_pet_upgrade, preZid, req.channel, req.zuid, req.zuid, req.itemId, req.tid, JSON.stringify(req.arr), preExp, nextExp, preLevel, nextLevel);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_PetUpgrade;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_PetLineupChange());
    exportProtocol.push(new CS_PetUpgrade());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
