/**
 * 包含的头文件
 */
var packets = require('../packets/equip');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var cPackage = require('../common/package');
var cMission = require('../common/mission');
var cRevelry = require('../common/revelry');
var csvManager = require('../../manager/csv_manager').Instance();
var attributeType = require('../common/attribute_type');
var itemType = require('../common/item_type');
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 身上装备的装配和卸载功能
 */
var CS_BodyEquipChange = (function() {

    /**
     * 构造函数
     */
    function CS_BodyEquipChange() {
        this.reqProtocolName = packets.pCSBodyEquipChange;
        this.resProtocolName = packets.pSCBodyEquipChange;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BodyEquipChange.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BodyEquipChange();
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
                /* 操作装备变化 */
                function(callback) {
                    cPackage.changeTeamPos(req.zid, req.zuid, req.downTid, req.downItemId, req.upTid,
                        req.upItemId, req.teamPos, callback);
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
    return CS_BodyEquipChange;
})();
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 强化装备的功能
 */
var CS_StrengthenEquip = (function() {

    /**
     * 构造函数
     */
    function CS_StrengthenEquip() {
        this.reqProtocolName = packets.pCSStrengthenEquip;
        this.resProtocolName = packets.pSCStrengthenEquip;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_StrengthenEquip.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_StrengthenEquip();
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
                || null == req.strenTimes) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.itemId = parseInt(req.itemId);
            req.tid = parseInt(req.tid);
            req.strenTimes = parseInt(req.strenTimes);

            if(isNaN(req.zid) || isNaN(req.itemId) || isNaN(req.tid) || isNaN(req.strenTimes)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var nowLevel = 0; /* 当前装备强化等级 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取装备当前强化等级 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid,
                        attributeType.EQUIP_STREN, function(roleLevel, A, B, cb) {
                            nowLevel = A;
                            cb(null, A, B);
                    }, callback);
                },

                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, true, callback);
                },

                /* 计算升级数和消耗 */
                function(player, callback) {
                    var recLine = csvManager.RoleEquipConfig()[req.tid];
                    if(!recLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    var quality = recLine.QUALITY;
                    var maxLevel = player.character.level * 2;
                    var luckyRate = csvManager.Viplist()[player.vipLevel].STR_CRI_RATE;
                    var criLevel = csvManager.Viplist()[player.vipLevel].STR_CRI_LV;
                    res.succTimes = 0;
                    res.upgradeLevel = 0;

                    /* 循环总次数strenTimes */
                    for(var i = 0; i < req.strenTimes; ++i) {
                        /* 强化后的等级不能超过主角等级的两倍 */
                        if(nowLevel + res.upgradeLevel >= maxLevel) {
                            break;
                        }

                        var addGold = csvManager.EquipStrengthCostConfig()[nowLevel + res.upgradeLevel]['COST_MONEY_' + quality];
                        /* 强化到钱没有 */
                        if(res.costGold + addGold <= player.gold) {
                            res.costGold += addGold;

                            /* 暴击判断 */
                            if(Math.random() * 100 <= luckyRate) {
                                res.upgradeLevel += criLevel;
                            }
                            else {
                                res.upgradeLevel += 1;
                            }

                            /* 强化上限 */
                            if(nowLevel + res.upgradeLevel > 240) {
                                res.upgradeLevel = 240 - nowLevel;
                            }

                            res.succTimes += 1;
                        }
                    }

                    player.gold -= res.costGold;
                    playerDb.savePlayerData(req.zid, req.zuid, player, true, callback);
                },

                /* 更新装备属性 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid,
                        attributeType.EQUIP_STREN, function(roleLevel, A, B, cb) {
                            cb(null, A + res.upgradeLevel, B + res.costGold);
                        }, callback);
                },

                /* 更新任务进度 */
                function (callback) {
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_5, 0, res.succTimes);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_5, 0, 0, res.succTimes);
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
                    logger.logBI(preZid, biCode.logs_strengthen_equip, preZid, req.channel, req.zuid, req.zuid, 1, req.itemId, req.tid, res.upgradeLevel, res.succTimes, res.costGold);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_StrengthenEquip;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 精炼装备的功能
 */
var CS_RefineEquip = (function() {

    /**
     * 构造函数
     */
    function CS_RefineEquip() {
        this.reqProtocolName = packets.pCSRefineEquip;
        this.resProtocolName = packets.pSCRefineEquip;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RefineEquip.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RefineEquip();
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

            var changedLevel = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 扣除道具 */
                function(callback) {
                    cPackage.updateItemWithLog(req.zid, req.zuid, req.arr, [], req.channel, req.acc, logsWater.REFINEEQUIP_LOGS, req.itemId, function(err) {
                        callback(err);
                    });
                },
                /* 改变道具属性 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, attributeType.EQUIP_REFINE, function(roleLevel, level, exp, cb) {
                        /* 定义变更过的值 */
                        changedLevel = level;
                        var changedExp = exp;
                        /* 获取装备信息 */
                        var equipInfo = csvManager.RoleEquipConfig()[req.tid];
                        if(!equipInfo) {
                            cb(retCode.TID_NOT_EXIST, level, exp);
                            return;
                        }

                        /* 增加精炼经验 */
                        for(var i = 0; i < req.arr.length; ++i) {
                            var expInfo = csvManager.EquipRefineStoneConfig()[req.arr[i].tid];
                            if (!expInfo) {
                                cb(retCode.TID_NOT_EXIST, level, exp);
                                return;
                            }
                            changedExp += expInfo.REFINE_STONE_EXP * req.arr[i].itemNum;
                        }

                        /* 获取装备当前等级所需要的经验值，并且精炼装备升级 */
                        while(true) {
                            if(changedLevel >= equipInfo.MAX_REFINE_LEVEL) {
                                changedLevel = equipInfo.MAX_REFINE_LEVEL;
                                changedExp = 0;
                                break;
                            }

                            var levelInfo = csvManager.EquipRefineLvConfig()[changedLevel];
                            if(!levelInfo) {
                                break;
                            }

                            var upgradeExp = levelInfo['LEVEL_UP_EXP_' + equipInfo.QUALITY];
                            if(null == upgradeExp) {
                                cb(retCode.TID_NOT_EXIST, level, exp);
                                return;
                            }

                            if(changedExp < upgradeExp) {
                                break;
                            }

                            changedExp -= upgradeExp;
                            changedLevel += 1;
                        }

                        cb(null, changedLevel, changedExp);
                    }, callback);
                },

                /* 更新任务进度 */
                function (callback) {
                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 12, changedLevel);
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_6, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_6, 0, 0, 1);
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
                    logger.logBI(preZid, biCode.logs_strengthen_equip, preZid, req.channel, req.zuid, req.zuid, 2, req.itemId, req.tid, changedLevel, 1, JSON.stringify(req.arr));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_RefineEquip;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 强化法器的功能
 */
var CS_StrengthenMagic = (function() {

    /**
     * 构造函数
     */
    function CS_StrengthenMagic() {
        this.reqProtocolName = packets.pCSStrengthenMagic;
        this.resProtocolName = packets.pSCStrengthenMagic;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_StrengthenMagic.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_StrengthenMagic();
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

            var changedLevel = 0;
            var itemExp = 0; /* 消耗道具的经验 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 验证消耗道具 */
                function(callback) {
                    /* 验证道具tid */
                    for(var i = 0; i != req.arr.length; ++i) {
                        if(itemType.getMainType(req.arr[i].tid) != itemType.MAIN_TYPE_MAGIC) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                    }
                    callback(null);
                },
                /* 获取消耗道具的经验 */
                function(callback) {
                    async.mapSeries(req.arr, function(obj, mapCallback) {
                            cPackage.updateItemAttr(req.zid, req.zuid, obj.itemId, obj.tid, attributeType.MAGIC_STREN, function(roleLevel, level, exp, cb) {
                                /* 获取法器信息 */
                                var equipInfo = csvManager.RoleEquipConfig()[obj.tid];
                                if(!equipInfo) {
                                    cb(retCode.TID_NOT_EXIST, level, exp);
                                    return;
                                }

                                /* 获取法器等级对应的经验 */
                                var levelInfo = csvManager.MagicEquipLvConfig()[level];
                                if (!levelInfo) {
                                    cb(retCode.TID_NOT_EXIST, level, exp);
                                    return;
                                }

                                var upgradeExp = levelInfo['TOTAL_EXP_' + equipInfo.QUALITY];
                                if (isNaN(upgradeExp)) {
                                    cb(retCode.TID_NOT_EXIST, level, exp);
                                    return;
                                }

                                itemExp += upgradeExp + equipInfo.SUPPLY_EXP;
                                cb(null, level, exp);
                            },mapCallback);
                        }, function (err) {
                            callback(err);
                        });
                },
                /* 扣道具 */
                function( callback) {
                    /* 计算需要消耗的钱 */
                    var item = new protocolObject.ItemObject();
                    item.itemId = -1;
                    item.tid = itemType.ITEM_TYPE_GOLD;
                    item.itemNum = itemExp; /* 消耗金币等于消耗道具的总经验 */
                    req.arr.push(item);
                    /* 扣消耗道具 */
                    cPackage.updateItemWithLog(req.zid, req.zuid, req.arr, [], req.channel, req.acc, logsWater.STRENGTHENMAGIC_LOGS, item.tid, function(err) {
                        callback(err);
                    });
                },
                /* 修改法器的等级属性 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, attributeType.MAGIC_STREN, function(roleLevel, level, exp, cb) {
                        /* 定义变更过的值 */
                        changedLevel = level;
                        var changedExp = exp;
                        /* 获取法器信息 */
                        var equipInfo = csvManager.RoleEquipConfig()[req.tid];
                        if(!equipInfo) {
                            cb(retCode.TID_NOT_EXIST, level, exp);
                            return;
                        }
                        var sumExp = itemExp;
                        /* 获取法器当前等级所需要的经验值，并且强化法器升级 */
                        while(true) {
                            var levelInfo = csvManager.MagicEquipLvConfig()[changedLevel];
                            if(!levelInfo) {
                                cb(retCode.TID_NOT_EXIST, level, exp);
                                return;
                            }

                            var upgradeExp = levelInfo['LEVEL_UP_EXP_' + equipInfo.QUALITY];
                            if (isNaN(upgradeExp)) {
                                cb(retCode.TID_NOT_EXIST, level, exp);
                                return;
                            }

                            /* 强化法器等级升级 */
                            if(upgradeExp > sumExp + changedExp) {
                                changedExp += sumExp;
                                break;
                            }
                            else {
                                var tmpLevel = changedLevel + 1;
                                if (tmpLevel > equipInfo.MAX_GROW_LEVEL) {
                                    changedLevel = equipInfo.MAX_GROW_LEVEL;
                                    changedExp = 0;
                                    break;
                                }
                                ++changedLevel;
                                sumExp -= upgradeExp - changedExp;
                                changedExp = 0;
                            }
                        }
                        cb(null, changedLevel, changedExp);
                    }, callback);
                },
                /* 更新任务进度 */
                function (callback) {
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_7, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_7, 0, 0, 1);
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
                    logger.logBI(preZid, biCode.logs_strengthen_equip, preZid, req.channel, req.zuid, req.zuid, 3, req.itemId, req.tid, changedLevel, 1, JSON.stringify(req.arr));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_StrengthenMagic;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 精炼法器的功能
 */
var CS_RefineMagic = (function() {

    /**
     * 构造函数
     */
    function CS_RefineMagic() {
        this.reqProtocolName = packets.pCSRefineMagic;
        this.resProtocolName = packets.pSCRefineMagic;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RefineMagic.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RefineMagic();
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

            var changedLevel = 0;
            var curLevel = -1;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取当前道具的精炼等级 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, attributeType.MAGIC_REFINE, function(roleLevel, level, cb) {
                        curLevel = level;
                        cb(null, level);
                    }, callback);
                },
                /* 扣除道具 */
                function(callback) {
                    /* 获取精炼法器需要的信息数据 */
                    var magicInfo = csvManager.MagicEquipRefineConfig()[curLevel];
                    if(!magicInfo) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    /* 验证消耗 */
                    var magicCostItemId = {};
                    var magicCostNum = 0;
                    var refineStoneNum = 0;
                    for(var i = 0; i < req.arr.length; ++i) {
                        if (req.arr[i].tid == req.tid) {
                            if (!magicCostItemId.hasOwnProperty(req.arr[i].itemId)) {
                                req.arr[i].itemNum = 1;
                                magicCostItemId[req.arr[i].itemId] = 1;
                                magicCostNum += 1;
                            }
                        }

                        if(req.arr[i].tid == itemType.STONE_TYPE_MAGIC_REFINE) {
                            refineStoneNum = req.arr[i].itemNum;
                        }
                    }

                    if(magicCostNum != magicInfo.REFINE_EQUIP_NUM
                        || refineStoneNum != magicInfo.REFINESTONE_NUM) {
                        callback(retCode.MAGIC_REFINE_LACK_MATERIALS);
                        return;
                    }

                    /* 扣银币 */
                    var item = new protocolObject.ItemObject();
                    item.tid = itemType.ITEM_TYPE_GOLD;
                    item.itemNum = magicInfo.REFINE_EQUIP_MONEY;
                    req.arr.push(item);
                    /* 扣消耗道具 */
                    cPackage.updateItemWithLog(req.zid, req.zuid, req.arr, [], req.channel, req.acc, logsWater.REFINEMAGIC_LOGS, item.tid, function(err, subArr, addArr) {
                        callback(err);
                    });
                },
                /* 改变道具属性 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.itemId, req.tid, attributeType.MAGIC_REFINE, function(roleLevel, level, cb) {
                        /* 定义变更过的值 */
                        changedLevel = level;
                        /* 获取装备信息 */
                        var equipInfo = csvManager.RoleEquipConfig()[req.tid];
                        if(!equipInfo) {
                            cb(retCode.TID_NOT_EXIST, level);
                            return;
                        }
                        /* 验证精炼法宝升级 */
                        ++changedLevel;
                        if (changedLevel > equipInfo.MAX_REFINE_LEVEL) {
                            cb(retCode.MAGIC_REFINE_LEVEL_BOUNDS, level);
                            return;
                        }
                        cb(null, changedLevel, 0);
                        cRevelry.updateRevelryProgress(req.zid, req.zuid, 18, changedLevel);
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
                    logger.logBI(preZid, biCode.logs_strengthen_equip, preZid, req.channel, req.zuid, req.zuid, 4, req.itemId, req.tid, changedLevel, 1, JSON.stringify(req.arr));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_RefineMagic;
})();
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_BodyEquipChange());
    exportProtocol.push(new CS_StrengthenEquip());
    exportProtocol.push(new CS_RefineEquip());
    exportProtocol.push(new CS_StrengthenMagic());
    exportProtocol.push(new CS_RefineMagic());
    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;