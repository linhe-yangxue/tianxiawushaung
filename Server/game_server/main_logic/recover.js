
/**
 * 包含的头文件
 */
var packets = require('../packets/recover');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var attributeType = require('../common/attribute_type');
var itemType = require('../common/item_type');
var protocolObject = require('../../common/protocol_object');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var globalObject = require('../../common/global_object');
var packageDb = require('../database/package');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 宠物分解
 */
var CS_PetDisenchant = (function() {

    /**
     * 构造函数
     */
    function CS_PetDisenchant() {
        this.reqProtocolName = packets.pCSPetDisenchant;
        this.resProtocolName = packets.pSCPetDisenchant;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PetDisenchant.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PetDisenchant();
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
                || null == req.arr) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
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

            var addArr = []; /* 添加道具的队列 */
            var expSum = 0; /* 经验经验总和 */
            var petDisen = []; /* 待分解的符灵 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 分解宠物的数据检查 */
                function(callback) {
                    /* 类型验证 */
                    for(var i = 0; i < req.arr.length; ++i) {
                        if(itemType.MAIN_TYPE_PET != itemType.getMainType(req.arr[i].tid)) {
                            callback(retCode.RECOVER_ITEM_TYPE_ERR);
                            return;
                        }
                    }

                    /* 每个宠物的数量设为1 */
                    for(var i = 0; i < req.arr.length; ++i) {
                        req.arr[i].itemNum = 1;
                    }
                    callback(null);
                },

                /* 获取符灵背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, false, callback);
                },

                /* 获取背包中的符灵对象 */
                function(petPkg, callback) {
                    var petsInPkg = petPkg.content;
                    for (var i = 0; i < req.arr.length; ++i) {
                        var petExist = false;
                        for (var j = 0; j < petsInPkg.length; ++j) {
                            if (req.arr[i].itemId == petsInPkg[j].itemId && req.arr[i].tid == petsInPkg[j].tid) {
                                petExist = true;
                                break;
                            }
                        }
                        if (!petExist) {
                            callback(retCode.ITEM_NOT_EXIST);
                            return;
                        }
                        petDisen.push(petsInPkg[j]);
                    }
                    callback(null);
                },

                /* 返还天命石 */
                function(callback) {
                    /* 天命石 */
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.STONE_TYPE_FATE;
                    item.itemNum = 0;

                    for(var i = 0; i < petDisen.length; ++i) {
                        item.itemNum += petDisen[i].fateStoneCost;
                    }

                    addArr.push(item);
                    callback(null);
                },

                /* 返回技能升级消耗的技能书和银币 */
                function(callback) {
                    /* 技能书 */
                    var itemBook = new globalObject.ItemBase();
                    itemBook.tid = itemType.SKILL_BOOK;
                    itemBook.itemNum = 0;
                    /* 银币 */
                    var itemGold = new globalObject.ItemBase();
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = 0;

                    for(var i = 0; i < petDisen.length; ++i) {
                        for(var j = 0; j < 4; ++j) {
                            var skLv = petDisen[i].skillLevel[j];
                            var scLine = csvManager.SkillCost()[skLv];
                            if(!scLine) {
                                callback(retCode.TID_NOT_EXIST);
                                return;
                            }
                            itemBook.itemNum += scLine.TOTAL_SKILL_BOOK_COST;
                            itemGold.itemNum += scLine.TOTAL_MONEY_COST;
                        }
                    }

                    addArr.push(itemBook);
                    addArr.push(itemGold);
                    callback(null);
                },

                /* 通过宠物突破等级，计算精炼总经验 */
                function(callback) {
                    for(var i = 0; i < petDisen.length; ++i) {
                        var pet = petDisen[i];

                        /* 通过突破等级查找宠物消耗的数量 */
                        var petBackInfo = csvManager.BreakLevelConfig()[pet.breakLevel];
                        if (!petBackInfo) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        /* 通过道具TID查找宠物表 */
                        var aoLine = csvManager.ActiveObject()[pet.tid];
                        if (!aoLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        /* 通过品质查找消耗表 */
                        var recoverInfo = csvManager.PetRecoverConfig()[aoLine.STAR_LEVEL];
                        if (!recoverInfo) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        /* 加符魂 */
                        var item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.ITEM_TYPE_SOULPOINT;
                        item.itemNum = recoverInfo.PET_GHOST * (petBackInfo.TOTAL_ACTIVE_NUM + 1);
                        addArr.push(item);
                        /* 加银币 */
                        item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.ITEM_TYPE_GOLD;
                        item.itemNum = recoverInfo.MONEY * (petBackInfo.TOTAL_ACTIVE_NUM + 1) + petBackInfo.TOTAL_NEED_COIN_NUM;
                        addArr.push(item);
                        /* 加突破石 */
                        item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.STONE_TYPE_BREAK_STONE;
                        item.itemNum = petBackInfo.TOTAL_NEED_GEM_NUM;
                        addArr.push(item);
                    }
                    callback(null);
                },
                /* 分解宠物获取的经验 */
                function(callback) {
                    for(var i = 0; i < petDisen.length; ++i) {
                        var pet = petDisen[i];

                        /* 通过道具TID查找宠物表 */
                        var aoLine = csvManager.ActiveObject()[pet.tid];
                        if (!aoLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        /* 通过宠物等级查找 */
                        var levelInfo = csvManager.PetLevelExp()[pet.level];
                        if (!levelInfo) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        var upgradeExp = levelInfo['TOTAL_EXP_' + aoLine.STAR_LEVEL];
                        if (null == upgradeExp) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        expSum += upgradeExp + pet.exp;
                    }
                    /* 加银币 */
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_GOLD;
                    item.itemNum = expSum;
                    addArr.push(item);
                    callback(null);
                },
                /* 折算成经验蛋 */
                function(callback) {
                    var tids = [];
                    tids.push(itemType.MAIN_TYPE_PET_HIGH);
                    tids.push(itemType.MAIN_TYPE_PET_MID);
                    tids.push(itemType.MAIN_TYPE_PET_LOW);

                    for(var i = 0; i < tids.length; ++i) {
                        var aoLine = csvManager.ActiveObject()[tids[i]];
                        if(!aoLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }

                        if(0 == aoLine.DROP_EXP) {
                            callback(retCode.OPERATION_VAL_ERR);
                            return;
                        }

                        if(expSum) {
                            var itemEgg = new globalObject.ItemBase();
                            itemEgg.tid = tids[i];
                            itemEgg.itemNum = parseInt(expSum / aoLine.DROP_EXP);
                            expSum %= aoLine.DROP_EXP;
                            addArr.push(itemEgg);
                        }
                    }
                    callback(null);
                },
                /* 更新背包 */
                function(callback) {
                    cPackage.updateItemWithLog(req.zid, req.zuid, req.arr, addArr, req.channel, req.acc, logsWater.PETDISENCHANT_LOGS, '', function(err, subArr, addArr) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.arr = addArr;
                            callback(null);
                        }
                    });
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_recover, preZid, req.channel, req.zuid, req.zuid, 1, JSON.stringify(req.arr), JSON.stringify(res.arr));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_PetDisenchant;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 宠物重生
 */
var CS_PetRebirth = (function() {

    /**
     * 构造函数
     */
    function CS_PetRebirth() {
        this.reqProtocolName = packets.pCSPetRebirth;
        this.resProtocolName = packets.pSCPetRebirth;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PetRebirth.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PetRebirth();
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
                || null == req.item) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.item.itemId
                || null == req.item.tid
                || null == req.item.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.item.itemId = parseInt(req.item.itemId);
            req.item.tid = parseInt(req.item.tid);
            req.item.itemNum = parseInt(req.item.itemNum);

            if(isNaN(req.item.itemId) || isNaN(req.item.tid) || isNaN(req.item.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var addArr = []; /* 添加道具的队列 */
            var expSum = 0; /* 经验经验总和 */
            var subArr = []; /* 扣除道具的队列 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取符灵背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, false, callback);
                },

                function(petPkg, callback) {
                    /* 获取符灵 */
                    var pet = null;
                    for(var i = 0; i < petPkg.content.length; ++i) {
                        if(petPkg.content[i].itemId == req.item.itemId && petPkg.content[i].tid == req.item.tid) {
                            pet = petPkg.content[i];
                            break;
                        }
                    }
                    if(null == pet) {
                        callback(retCode.ITEM_NOT_EXIST);
                        return;
                    }

                    /* 返回天命石 */
                    var item = new globalObject.ItemBase();
                    item.tid =  itemType.STONE_TYPE_FATE;
                    item.itemNum = pet.fateStoneCost;
                    addArr.push(item);

                    callback(null);
                },
                /* 获取宠物之前技能升级，技能书和银币的消耗数量 */
                function(callback) {
                    var isErr = null;
                    var arrSkillID = [];
                    arrSkillID.push(attributeType.PET_SKILL_ONE);
                    arrSkillID.push(attributeType.PET_SKILL_TWO);
                    arrSkillID.push(attributeType.PET_SKILL_THREE);
                    arrSkillID.push(attributeType.PET_SKILL_FOUR);
                    var i = 0;
                    async.whilst(
                        function () {
                            return i != arrSkillID.length;
                        },
                        function (whilstCallback) {
                            cPackage.updateItemAttr(req.zid, req.zuid, req.item.itemId, req.item.tid, arrSkillID[i], function (roleLevel, skilllevel, cb) {
                                    /* 通过技能等级查找技能书和银币的消耗数量 */
                                    var skillInfo = csvManager.SkillCost()[skilllevel];
                                    if (!skillInfo) {
                                        cb(retCode.TID_NOT_EXIST, skilllevel);
                                        return;
                                    }
                                    /* 加技能书 */
                                    var item = new protocolObject.ItemObject();
                                    item.itemId = -1;
                                    item.tid = itemType.SKILL_BOOK;
                                    item.itemNum = skillInfo.TOTAL_SKILL_BOOK_COST;
                                    addArr.push(item);
                                    /* 加银币 */
                                    item = new protocolObject.ItemObject();
                                    item.itemId = -1;
                                    item.tid = itemType.ITEM_TYPE_GOLD;
                                    item.itemNum = skillInfo.TOTAL_MONEY_COST;
                                    addArr.push(item);
                                    cb(null, skilllevel);
                                },
                                function (err) {
                                    ++i;
                                    whilstCallback(err);
                                });
                        },
                        function (whilstErr) {
                            callback(whilstErr);
                        });
                },
                /* 通过宠物突破等级，计算精炼总经验 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.item.itemId, req.item.tid, attributeType.PET_BREAK, function (petLevel, level, cb) {
                        /* 通过突破等级查找宠物消耗的数量 */
                        var petBackInfo = csvManager.BreakLevelConfig()[level];
                        if (!petBackInfo) {
                            cb(retCode.TID_NOT_EXIST, level);
                            return;
                        }
                        /* 通过道具TID查找宠物表 */
                        var petInfo = csvManager.ActiveObject()[req.item.tid];
                        if (!petInfo) {
                            cb(retCode.TID_NOT_EXIST, level);
                            return;
                        }
                        /* 通过品质查找消耗表 */
                        var recoverInfo = csvManager.PetRecoverConfig()[petInfo.STAR_LEVEL];
                        if (!recoverInfo) {
                            cb(retCode.TID_NOT_EXIST, level);
                            return;
                        }

                        /* 加银币 */
                        var item = new globalObject.ItemBase();
                        item.tid = itemType.ITEM_TYPE_GOLD;
                        item.itemNum = petBackInfo.TOTAL_NEED_COIN_NUM;
                        addArr.push(item);

                        /* 加同TID的宠物 */
                        var item = new globalObject.ItemBase();
                        item.tid = req.item.tid;
                        item.itemNum = petBackInfo.TOTAL_ACTIVE_NUM + 1;
                        addArr.push(item);

                        /* 加突破石 */
                        var item = new globalObject.ItemBase();
                        item.tid = itemType.STONE_TYPE_BREAK_STONE;
                        item.itemNum = petBackInfo.TOTAL_NEED_GEM_NUM;
                        addArr.push(item);
                        cb(null, level);
                    }, callback);
                },
                /* 分解宠物获取的经验 */
                function(callback) {
                    cPackage.updateItemAttr(req.zid, req.zuid, req.item.itemId, req.item.tid, attributeType.PET_LEVEL, function (roleLevel, petLevel, exp, cb) {
                        /* 通过道具TID查找宠物表 */
                        var petInfo = csvManager.ActiveObject()[req.item.tid];
                        if (!petInfo) {
                            cb(retCode.TID_NOT_EXIST, petLevel, exp);
                            return;
                        }
                        /* 通过宠物等级查找 */
                        var levelInfo = csvManager.PetLevelExp()[petLevel];
                        if (!levelInfo) {
                            cb(retCode.TID_NOT_EXIST, petLevel, exp);
                            return;
                        }
                        /* 通过宠物品质查找消耗的总经验 */
                        var upgradeExp = -1;
                        switch (petInfo.STAR_LEVEL) {
                            case 1 :
                                upgradeExp = levelInfo.TOTAL_EXP_1;
                                break;
                            case 2 :
                                upgradeExp = levelInfo.TOTAL_EXP_2;
                                break;
                            case 3 :
                                upgradeExp = levelInfo.TOTAL_EXP_3;
                                break;
                            case 4 :
                                upgradeExp = levelInfo.TOTAL_EXP_4;
                                break;
                            case 5 :
                                upgradeExp = levelInfo.TOTAL_EXP_5;
                                break;
                            case 6 :
                                upgradeExp = levelInfo.TOTAL_EXP_6;
                                break;
                            case 7 :
                                upgradeExp = levelInfo.TOTAL_EXP_7;
                                break;
                        }
                        if (-1 == upgradeExp) {
                            cb(retCode.TID_NOT_EXIST, petLevel, exp);
                            return;
                        }
                        expSum += upgradeExp;
                        expSum += exp;
                        /* 加银币 */
                        var item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.ITEM_TYPE_GOLD;
                        item.itemNum = upgradeExp + exp;
                        addArr.push(item);
                        cb(null, petLevel, exp);
                    }, callback);
                },
                /* 折算成经验蛋 */
                function(callback) {
                    var stone1 = csvManager.ActiveObject()[itemType.MAIN_TYPE_PET_LOW];
                    var stone2 = csvManager.ActiveObject()[itemType.MAIN_TYPE_PET_MID];
                    var stone3 = csvManager.ActiveObject()[itemType.MAIN_TYPE_PET_HIGH];
                    if(!stone1 || !stone2 || !stone3) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    /* 获取3个品级可以兑换的数量 */
                    var expSumSurplus = 0;
                    var stoneNum3 = 0;
                    var stoneNum2 = 0;
                    var stoneNum1 = 0;
                    if(0 == stone1.DROP_EXP || 0 == stone2.DROP_EXP || 0 == stone3.DROP_EXP) {
                        callback(retCode.OPERATION_VAL_ERR);
                        return;
                    }
                    if(0 != expSum) {
                        expSumSurplus = expSum % stone3.DROP_EXP;
                        stoneNum3 = (expSum - expSumSurplus) / stone3.DROP_EXP;
                    }
                    expSum = expSumSurplus;
                    if(0 != expSum) {
                        expSumSurplus = expSumSurplus % stone2.DROP_EXP;
                        stoneNum2 = (expSum - expSumSurplus) / stone2.DROP_EXP;
                    }
                    expSum = expSumSurplus;
                    if(0 != expSum) {
                        expSumSurplus = expSumSurplus % stone1.DROP_EXP;
                        stoneNum1 = (expSum - expSumSurplus) / stone1.DROP_EXP;
                    }

                    /* 如果可以兑换对应品质的精炼石，就添加到添加数组中 */
                    var item = null;
                    if(stoneNum3 > 0) {
                        item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.MAIN_TYPE_PET_HIGH;
                        item.itemNum = stoneNum3;
                        addArr.push(item);
                    }
                    if(stoneNum2 > 0) {
                        item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.MAIN_TYPE_PET_MID;
                        item.itemNum = stoneNum2;
                        addArr.push(item);
                    }
                    if(stoneNum1 > 0) {
                        item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.MAIN_TYPE_PET_LOW;
                        item.itemNum = stoneNum1;
                        addArr.push(item);
                    }
                    callback(null);
                },
                /* 从背包添加、减少道具 */
                function(callback) {
                    /* 扣除50元宝 */
                    var item = new protocolObject.ItemObject();
                    item.itemId = -1;
                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                    item.itemNum = 50;
                    subArr.push(item);
                    /* 扣除道具 */
                    subArr.push(req.item);

                    cPackage.updateItemWithLog(req.zid, req.zuid, subArr, addArr, req.channel, req.acc, logsWater.PETREBIRTH_LOGS, req.item.tid, function(err, retSub, retAdd) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.arr = retAdd;
                            callback(null);
                        }
                    });
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_recover, preZid, req.channel, req.zuid, req.zuid, 2, JSON.stringify(req.item), JSON.stringify(res.arr));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_PetRebirth;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 装备分解
 */
var CS_EquipDisenchant = (function() {

    /**
     * 构造函数
     */
    function CS_EquipDisenchant() {
        this.reqProtocolName = packets.pCSEquipDisenchant;
        this.resProtocolName = packets.pSCEquipDisenchant;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_EquipDisenchant.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_EquipDisenchant();
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
                || null == req.arr) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
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

            var addArr = []; /* 添加道具的队列 */
            var equipsDisen = []; /* 待分解的装备对象数组 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 分解装备数据检查 */
                function(callback) {
                    /* 类型验证 */
                    for(var i = 0; i < req.arr.length; ++i) {
                        if(itemType.MAIN_TYPE_EQUIP != itemType.getMainType(req.arr[i].tid)) {
                            callback(retCode.RECOVER_ITEM_TYPE_ERR);
                            return;
                        }
                    }

                    /* 每件装备数量设置为1 */
                    for(var i = 0; i < req.arr.length; ++i) {
                        req.arr[i].itemNum = 1;
                    }

                    callback(null);
                },

                /* 添加基础道具返回 */
                function(callback) {
                    for(var i = 0; i < req.arr.length; ++i) {
                        /* 通过道具TID查找装备表 */
                        var equipInfo = csvManager.RoleEquipConfig()[req.arr[i].tid];
                        if(!equipInfo) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        /* 通过品质查找消耗表 */
                        var recoverInfo = csvManager.EquipRecoverConfig()[equipInfo.QUALITY];
                        if(!recoverInfo) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        /* 加威名 */
                        var item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.ITEM_TYPE_PRESTIGE;
                        item.itemNum = recoverInfo.EQUIP_TOKEN;
                        addArr.push(item);
                        /* 加银币 */
                        item = new protocolObject.ItemObject();
                        item.itemId = -1;
                        item.tid = itemType.ITEM_TYPE_GOLD;
                        item.itemNum = recoverInfo.MONEY;
                        addArr.push(item);
                    }
                    callback(null);
                },

                /* 获取装备背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_EQUIP, false, callback);
                },

                /* 获取背包中装备对象*/
                function(equipPkg, callback) {
                    var equipsInPkg = equipPkg.content;

                    for (var i = 0; i < req.arr.length; ++i) {
                        var equipExist = false;
                        for (var j = 0; j < equipsInPkg.length; ++j) {
                            if (req.arr[i].itemId == equipsInPkg[j].itemId && req.arr[i].tid == equipsInPkg[j].tid) {
                                equipExist = true;
                                break;
                            }
                        }

                        if (!equipExist) {
                            callback(retCode.ITEM_NOT_EXIST);
                            return;
                        }

                        equipsDisen.push(equipsInPkg[j]);
                    }

                    callback(null);
                },

                /* 返回精炼消耗 */
                function(callback) {
                    /* 精炼经验总和 */
                    var refineExpSum = 0;
                    for(var i = 0; i < equipsDisen.length; ++i) {
                        var equipInfo = csvManager.RoleEquipConfig()[equipsDisen[i].tid];
                        if (!equipInfo) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        var levelInfo = csvManager.EquipRefineLvConfig()[equipsDisen[i].refineLevel];
                        if (!levelInfo) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        var upgradeExp = levelInfo['TOTAL_EXP_' + equipInfo.QUALITY];
                        if (null == upgradeExp) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        refineExpSum += upgradeExp + equipsDisen[i].refineExp;
                    }

                    /* 折算成精炼石 */
                    for(var i = itemType.STONE_TYPE_EQUIP_REFINE_RARE;
                        i >= itemType.STONE_TYPE_EQUIP_REFINE_LOW; --i) {

                        var erscLine = csvManager.EquipRefineStoneConfig()[i];
                        if(!erscLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }

                        var stoneExp = erscLine.REFINE_STONE_EXP;
                        if(0 == stoneExp) {
                            callback(retCode.OPERATION_VAL_ERR);
                            return;
                        }

                        if(refineExpSum) {
                            var itemStone = new globalObject.ItemBase();
                            itemStone.tid = i;
                            itemStone.itemNum = parseInt(refineExpSum / stoneExp);
                            refineExpSum %= stoneExp;
                            addArr.push(itemStone);
                        }
                    }
                    callback(null);
                },

                /* 返回强化消耗 */
                function(callback) {
                    var strengCostSum = 0;
                    for(var i = 0; i < equipsDisen.length; ++i) {
                        strengCostSum += equipsDisen[i].strengCostGold;
                    }

                    var itemGold = new globalObject.ItemBase();
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = strengCostSum;
                    addArr.push(itemGold);

                    callback(null);
                },

                /* 更新背包 */
                function(callback) {
                    cPackage.updateItemWithLog(req.zid, req.zuid, req.arr, addArr, req.channel, req.acc, logsWater.EQUIPDISENCHANT_LOGS, '', function(err, retSub, retAdd) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.arr = retAdd;
                            callback(null);
                        }
                    });
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_recover, preZid, req.channel, req.zuid, req.zuid, 3, JSON.stringify(req.arr), JSON.stringify(res.arr));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_EquipDisenchant;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 法器重生
 */
var CS_MagicRebirth = (function() {

    /**
     * 构造函数
     */
    function CS_MagicRebirth() {
        this.reqProtocolName = packets.pCSMagicRebirth;
        this.resProtocolName = packets.pSCMagicRebirth;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MagicRebirth.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MagicRebirth();
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
                || null == req.item) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.item.itemId
                || null == req.item.tid
                || null == req.item.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.item.itemId = parseInt(req.item.itemId);
            req.item.tid = parseInt(req.item.tid);
            req.item.itemNum = parseInt(req.item.itemNum);

            if(isNaN(req.item.itemId) || isNaN(req.item.tid) || isNaN(req.item.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取法器背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_MAGIC, false, callback);
                },

                function(magicPkg, callback) {
                    var addArr = [];
                    var subArr = [];

                    /* 获取法器 */
                    var magic = null;
                    for (var i = 0; i < magicPkg.content.length; ++i) {
                        if (magicPkg.content[i].itemId == req.item.itemId && magicPkg.content[i].tid == req.item.tid) {
                            magic = magicPkg.content[i];
                            break;
                        }
                    }

                    if (null == magic) {
                        callback(retCode.ITEM_NOT_EXIST);
                        return;
                    }

                    /** 返回强化消耗 */
                    var recLine = csvManager.RoleEquipConfig()[magic.tid];
                    if (!recLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    var melcLine = csvManager.MagicEquipLvConfig()[magic.strengthenLevel];
                    if (!melcLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    var upgradeExp = melcLine['TOTAL_EXP_' + recLine.QUALITY];
                    if (null == upgradeExp) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    /* 强化总经验 */
                    var strengExpSum = upgradeExp + magic.strengthenExp;

                    /* 加银币 */
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_GOLD;
                    item.itemNum = strengExpSum;
                    addArr.push(item);
                    /* 经验法器 */
                    var tids = [];
                    tids.push(itemType.MAGIC_EXP_HIGH);
                    tids.push(itemType.MAGIC_EXP_MID);
                    tids.push(itemType.MAGIC_EXP_LOW);

                    for (var i = 0; i < tids.length; ++i) {
                        var recLine = csvManager.RoleEquipConfig()[tids[i]];
                        if (!recLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }

                        if (0 == recLine.SUPPLY_EXP) {
                            callback(retCode.OPERATION_VAL_ERR);
                            return;
                        }

                        if (strengExpSum) {
                            var item = new globalObject.ItemBase();
                            item.tid = tids[i];
                            item.itemNum = parseInt(strengExpSum / recLine.SUPPLY_EXP);
                            strengExpSum %= recLine.SUPPLY_EXP;
                            if (item.itemNum > 0) {
                                addArr.push(item);
                            }
                        }
                    }

                    /** 返回精炼消耗 */
                    var mercLine = csvManager.MagicEquipRefineConfig()[magic.refineLevel];
                    if (!mercLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    /* 加精炼石 */
                    item = new globalObject.ItemBase();
                    item.tid = itemType.STONE_TYPE_MAGIC_REFINE;
                    item.itemNum = mercLine.TOTAL_REFINESTONE_NUM;
                    addArr.push(item);
                    /* 加法器 */
                    item = new globalObject.ItemBase();
                    item.tid = magic.tid;
                    item.itemNum = mercLine.TOTAL_REFINE_EQUIP_NUM + 1;
                    addArr.push(item);
                    /* 加银币 */
                    item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_GOLD;
                    item.itemNum = mercLine.TOTAL_REFINE_EQUIP_MONEY;
                    addArr.push(item);

                    /** 扣除50元宝，和分解的法器 */
                    item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                    item.itemNum = 50;
                    subArr.push(item);
                    req.item.itemNum = 1;
                    subArr.push(req.item);

                    cPackage.updateItemWithLog(req.zid, req.zuid, subArr, addArr, req.channel, req.acc, logsWater.MAGICREBIRTH_LOGS, req.item.tid, function(err, retSub, retAdd) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.arr = retAdd;
                            callback(null);
                        }
                    });
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_recover, preZid, req.channel, req.zuid, req.zuid, 4, JSON.stringify(req.item), JSON.stringify(res.arr));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_MagicRebirth;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_PetDisenchant());
    exportProtocol.push(new CS_PetRebirth());
    exportProtocol.push(new CS_EquipDisenchant());
    exportProtocol.push(new CS_MagicRebirth());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
