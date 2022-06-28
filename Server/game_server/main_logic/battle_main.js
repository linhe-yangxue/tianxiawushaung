
/**
 * 包含的头文件
 */
var packets = require('../packets/battle_main');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var itemType = require('../common/item_type');
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var logger = require('../../manager/log4_manager');
var battleType = require('../common/battle_type');
var math = require('../../tools/system/math');
var playerDb = require('../database/player');
var battleMainDb = require('../database/battle_main');
var cDemonBoss = require('../common/demon_boss');
var cMission = require('../common/mission');
var cRevelry = require('../common/revelry');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var battleSettlementManager = require('../common/battle_settlement/index');
var cZuid = require('../common/zuid');
var filterCommon = require('../common/filter_common');
var packageDb = require('../database/package');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取主线副本的功能
 */
var CS_BattleMainMap = (function() {

    /**
     * 构造函数
     */
    function CS_BattleMainMap() {
        this.reqProtocolName = packets.pCSBattleMainMap;
        this.resProtocolName = packets.pSCBattleMainMap;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BattleMainMap.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BattleMainMap();
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

            /* 今天日期 */
            var today = (new Date()).toDateString();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取主线副本地图 */
                function(callback) {
                    battleMainDb.getBattleMainMap(req.zid, req.zuid, callback);
                },

                /* 设置返回值 */
                function(maps, callback) {
                    for(var i = 0; i < maps.length; ++i) {
                        var obj = new protocolObject.BattleObject();
                        obj.battleId = maps[i].battleId; /* 关卡ID */
                        obj.successCount = maps[i].successCount; /* 通关次数 */
                        obj.fightCount = maps[i].fightCount; /* 战斗次数 */
                        obj.bestRate = maps[i].bestRate; /* 最高评级 */

                        /* 如果最近一次通关不是今天，那么重置关卡通关限制 */
                        if(today != maps[i].lastDay) {
                            obj.todaySuccess = 0; /* 今日通关次数 */
                            obj.todayReset = 0; /* 今日重置次数 */
                        }
                        else {
                            obj.todaySuccess = maps[i].todaySuccess; /* 今日通关次数 */
                            obj.todayReset = maps[i].todayReset; /* 今日重置次数 */
                        }
                        res.arr.push(obj);
                    }
                    callback(null);
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
    return CS_BattleMainMap;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 进入主线副本
 */
var CS_BattleMainStart = (function() {

    /**
     * 构造函数
     */
    function CS_BattleMainStart() {
        this.reqProtocolName = packets.pCSBattleMainStart;
        this.resProtocolName = packets.pSCBattleMainStart;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BattleMainStart.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BattleMainStart();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.battleId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.battleId = parseInt(req.battleId);

            if(isNaN(req.zid) || isNaN(req.battleId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player;
            var battleInfo; /* 副本配置信息 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 验证前置关卡和关卡类型 */
                function(callback) {
                    /* 验证主线副本TID */
                    battleInfo = csvManager.StageConfig()[req.battleId];
                    if(!battleInfo) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    /* 验证主线副本类型 */
                    if(battleInfo.TYPE != battleType.BATTLE_MAIN_1
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_2
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_3) {
                        callback(retCode.BATTLE_MAIN_TYPE_ERR);
                        return;
                    }
                    callback(null);
                },
                /* 验证前置关卡ID */
                function(callback) {
                    if(0 == battleInfo.FRONT_INDEX) {
                        callback(null);
                        return;
                    }
                    battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, battleInfo.FRONT_INDEX, function(err, obj) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(null == obj) {
                            callback(retCode.BATTLE_MAIN_PRE_ERR);
                            return;
                        }
                        if(obj.successCount < 1) {
                            callback(retCode.BATTLE_MAIN_PRE_BATTLE_NOT_PASS);
                            return;
                        }
                        callback(null);
                    })
                },

                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 验证体力 */
                function(result, callback) {
                    player = result;
                    if(player.stamina < csvManager.EnergyCost()[battleInfo.TYPE].ENERGY_COST) {
                        callback(retCode.LACK_OF_STAMINA);
                    }
                    else {
                        callback(null);
                    }
                },

                /* 获取当前关卡信息, 验证通关限制 */
                function(callback) {
                    battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, req.battleId, function(err, battle) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        if(null == battle) {
                            battle = new globalObject.Battle();
                            battle.battleId = req.battleId; /* 关卡ID */
                        }
                        battle.startTime = parseInt(Date.now()/1000); /* 获取当前时间秒 */
                        battle.fightCount += 1; /* 战斗次数 */
                        battle.battleStarted = 1; /* 已开始主线副本 */

                        var today = (new Date()).toDateString();
                        if(battle.lastDay == today) { /* 最近通关是今天 */
                            if(battle.todaySuccess >= battleInfo.CHALLENGE_NUM) {
                                callback(retCode.BATTLE_MAIN_NO_PASS);
                                return;
                            }
                        }
                        else { /* 重置通关限制 */
                            battle.lastDay = today;
                            battle.todaySuccess = 0;
                            battle.todayReset = 0;
                        }

                        battleMainDb.updateBattleMainMap(req.zid, req.zuid, battle, callback);
                    })
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
    return CS_BattleMainStart;
})();
/**-------------------------------------------------------------------------------------------------------------------*/


/**
 * 获取主线通关掉落物品
 * @param stageId 关卡Id
 * @param battle 关卡记录
 */
function getDropItems(stageId, battle) {
    var scLine = csvManager.StageConfig()[stageId];
    if(!scLine) {
        return [];
    }

    var plots = scLine.GROUP_PLOT.split('|');
    var sgpLine = csvManager.StageGroupPlot()[plots[battle.dropIndex]];
    battle.dropIndex = (battle.dropIndex + 1) % plots.length;
    if(!sgpLine) {
        return [];
    }

    var ret = [];
    var groupIds = sgpLine.DROP_GROUP.split('|');
    for(var i = 0; i < groupIds.length; ++i) {
        csvExtendManager.StageLootGroupIDConfig_DropId(groupIds[i], 1, function (err, result) {
            if(!err) {
                ret = ret.concat(result);
            }
        });
    }

    return ret;
}

/**
 * 退出主线副本
 */
var CS_BattleMainResult = (function() {

    /**
     * 构造函数
     */
    function CS_BattleMainResult() {
        this.reqProtocolName = packets.pCSBattleMainResult;
        this.resProtocolName = packets.pSCBattleMainResult;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BattleMainResult.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BattleMainResult();
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
                || null == req.battleId
                || null == req.isWin
                || null == req.starRate
                || null == req.isAuto) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.battleId = parseInt(req.battleId);
            req.isWin = parseInt(req.isWin);
            req.starRate = parseInt(req.starRate);
            req.isAuto = parseInt(req.isAuto);

            if(isNaN(req.zid) || isNaN(req.battleId) || isNaN(req.isWin) || isNaN(req.starRate) || isNaN(req.isAuto)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var battleInfo; /* 副本配置信息 */
            var dropArr = []; /* 掉落队列 */
            var expendArr = []; /* 消耗队列 */
            var player; /* 玩家对象 */
            var battle; /* 关卡数据库信息对象 */
            var newStars = 0; /* 此次战斗新得星星 */
            var isFirst = 0; /* 是否首次挑战关卡 */
            var petIds = []; /* 携带符灵tid */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 输了直接返回 */
                function(calllback) {
                    if(req.isWin) {
                        calllback(null);
                    }
                    else {
                        calllback(retCode.SUCCESS);
                    }
                },

                /* 验证关卡类型 */
                function(callback) {
                    /* 验证主线副本TID */
                    battleInfo = csvManager.StageConfig()[req.battleId];
                    if(!battleInfo) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    /* 验证主线副本类型 */
                    if(battleInfo.TYPE != battleType.BATTLE_MAIN_1
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_2
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_3) {
                        callback(retCode.BATTLE_MAIN_TYPE_ERR);
                        return;
                    }
                    callback(null);
                },

                /* 验证前置关卡ID */
                function(callback) {
                    if(0 == battleInfo.FRONT_INDEX) {
                        callback(null);
                        return;
                    }
                    battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, battleInfo.FRONT_INDEX, function(err, obj) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(null == obj) {
                            callback(retCode.BATTLE_MAIN_PRE_ERR);
                            return;
                        }
                        if(obj.successCount < 1) {
                            callback(retCode.BATTLE_MAIN_PRE_BATTLE_NOT_PASS);
                            return;
                        }
                        callback(null);
                    })
                },

                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取当前关卡信息 */
                function(p, callback) {
                    player = p;
                    battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, req.battleId, callback);
                },

                /* 检查通关条件 */
                function(b, callback) {
                    battle = b;
                    /* 检查关卡信息和战斗开始记录 */
                    if (!battle || !battle.battleStarted) {
                        callback(retCode.BATTLE_MAIN_NO_RECORD);
                        return;
                    }

                    /* 检查战斗时间和战斗力 */
                    if (parseInt(Date.now() / 1000) - battle.startTime < battleInfo.CHECK_TIME
                        || player.power < battleInfo.CHECK_BATTLE) {
                        callback(retCode.USING_PLUG);
                        return;
                    }

                    /* 检查通关次数限制 */
                    if(battle.todaySuccess >= battleInfo.CHALLENGE_NUM) { /* 每天通关10次 */
                        callback(retCode.BATTLE_MAIN_NO_PASS);
                        return;
                    }

                    /*设置是否首次打该关卡*/
                    isFirst = battle.firstChallenge;
                    if(isFirst == 1){
                        battle.firstChallenge = 0;
                    }

                    battle.todaySuccess += 1; /* 当天通关次数 */
                    battle.battleStarted = 0; /* 清空战斗开始记录*/
                    battle.successCount += 1; /* 通关次数 */
                    if (battle.bestRate < req.starRate) {
                        newStars = req.starRate - battle.bestRate; /* 新增星数 */
                        battle.bestRate = req.starRate; /* 更新最高评级 */
                    }
                    callback(null);
                },

                /* 获取掉落队列 */
                function(callback) {

                    /* 首次通关掉落物品 */
                    if(battle.successCount == 1) {
                        var firstReward = filterCommon.splitItemStr(battleInfo.DROP_FRIST, '|', '#');
                        dropArr = dropArr.concat(firstReward);
                    }

                    dropArr = dropArr.concat(getDropItems(req.battleId, battle));
                    callback(null);
                },

                /* 返回客户端掉落队列 */
                function(callback) {
                    var staminaNum = csvManager.EnergyCost()[battleInfo.TYPE].ENERGY_COST;

                    /* 扣除体力 */
                    var item = new protocolObject.ItemObject();
                    item.itemId = -1;
                    item.tid = itemType.ITEM_TYPE_STAMINA;
                    item.itemNum = staminaNum;
                    expendArr.push(item);
                    /* 添加金币 */
                    var itemGold = new protocolObject.ItemObject();
                    itemGold.itemId = -1;
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = battleSettlementManager.coinSettlement('battle_settlement_stage', player.character.level, staminaNum);
                    dropArr.push(itemGold);
                    /* 添加经验*/
                    var itemExp = new protocolObject.ItemObject();
                    itemExp.itemId = -1;
                    itemExp.tid = itemType.ITEM_TYPE_EXP;
                    itemExp.itemNum = battleSettlementManager.expSettlement('battle_settlement_stage', player.character.level, staminaNum);
                    dropArr.push(itemExp);

                    cPackage.updateItemWithLog(req.zid, req.zuid, expendArr, dropArr, req.channel, req.acc, logsWater.BATTLEMAINRESULT_LOGS, req.battleId, function (err, subArr, addArr) {
                        res.arr = addArr;
                        callback(err);
                    });
                },

                /* 更新关卡信息 */
                function(callback) {
                    battleMainDb.updateBattleMainMap(req.zid, req.zuid, battle, callback);
                },

                /* 更新任务进度 */
                function (callback) {
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_1, battleInfo.TYPE, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_1, battleInfo.TYPE, req.battleId, 1);
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_11, battleInfo.TYPE, newStars);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_11, battleInfo.TYPE, req.battleId, newStars);
                    /* 开服狂欢 */
                    if(req.battleId >= 20001 && req.battleId < 21000) {
                        cRevelry.updateRevelryProgress(req.zid, req.zuid, 2, req.battleId);
                    }
                    if(req.battleId >= 21001 && req.battleId < 22000) {
                        cRevelry.updateRevelryProgress(req.zid, req.zuid, 20, req.battleId);
                    }

                    callback(null);
                },

                /* 触发天魔副本 */
                function (callback) {
                    cDemonBoss.demonBossTrigger(req.zid, req.zuid, req.battleId, player, res, callback);
                },

                /* 查携带的符灵tid写日志 */
                function(callback){
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, false, function(err, petPkg){
                        var pet = null;
                        for(var m = 0, len = petPkg.content.length; m < len; ++m) {
                            pet = petPkg.content[m];
                            if(pet && pet.teamPos > 0 && pet.teamPos < 4) {
                                petIds.push(pet.tid);
                            }
                        }
                        callback(err);
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
                    logger.logBI(preZid, biCode.logs_instance, preZid, req.channel, req.zuid, req.zuid, player.character.level, battleInfo.TYPE, 0, req.battleId, battleInfo.DIFFICULTY, battle.startTime, (parseInt(Date.now() / 1000) - battle.startTime), req.starRate, 0, req.isAuto, isFirst , JSON.stringify(res.arr), res.tid, res.bossIndex, 0, 0, player.power, JSON.stringify(petIds));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_BattleMainResult;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 扫荡主线副本
 */
var CS_BattleMainSweep = (function() {

    /**
     * 构造函数
     */
    function CS_BattleMainSweep() {
        this.reqProtocolName = packets.pCSBattleMainSweep;
        this.resProtocolName = packets.pSCBattleMainSweep;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BattleMainSweep.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BattleMainSweep();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.battleId
                || null == req.sweepObj) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.battleId = parseInt(req.battleId);

            if(isNaN(req.zid) || isNaN(req.battleId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.sweepObj.itemId
                || null == req.sweepObj.tid
                || null == req.sweepObj.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.sweepObj.itemId = parseInt(req.sweepObj.itemId);
            req.sweepObj.tid = parseInt(req.sweepObj.tid);
            req.sweepObj.itemNum = parseInt(req.sweepObj.itemNum);

            if(isNaN(req.sweepObj.itemId) || isNaN(req.sweepObj.tid) || isNaN(req.sweepObj.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var battleInfo; /* 副本配置信息 */
            var dropArr = []; /* 掉落队列 */
            var expendArr = []; /* 消耗队列 */
            var player; /* 玩家对象 */
            var battle;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 验证关卡类型 */
                function(callback) {
                    /* 验证主线副本TID */
                    battleInfo = csvManager.StageConfig()[req.battleId];
                    if(!battleInfo) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    /* 验证主线副本类型 */
                    if(battleInfo.TYPE != battleType.BATTLE_MAIN_1
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_2
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_3) {
                        callback(retCode.BATTLE_MAIN_TYPE_ERR);
                        return;
                    }
                    callback(null);
                },

                /* 获取用户信息 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取当前关卡信息 */
                function(p, callback) {
                    player = p;
                    battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, req.battleId, callback);
                },

                /* 检查扫荡条件 */
                function(b, callback) {
                    battle = b;
                    /* 验证三星评级 */
                    if (null == battle || battle.bestRate < 3) {
                        callback(retCode.BATTLE_MAIN_NOT_SWEEP);
                        return;
                    }

                    /* 检查通关次数 */
                    var today = (new Date()).toDateString();
                    if(battle.lastDay == today) { /* 最近通关是今天 */
                        if(battle.todaySuccess >= battleInfo.CHALLENGE_NUM) {
                            callback(retCode.BATTLE_MAIN_NO_PASS);
                            return;
                        }
                    }
                    else { /* 重置通关限制 */
                        battle.lastDay = today;
                        battle.todaySuccess = 0;
                        battle.todayReset = 0;
                    }

                    battle.fightCount += 1;
                    battle.todaySuccess += 1;
                    battle.successCount += 1;
                    callback(null);
                },

                /* 获取掉落队列 */
                function(callback) {
                    dropArr = dropArr.concat(getDropItems(req.battleId, battle));
                    callback(null);
                },

                /* 返回客户端掉落队列 */
                function(callback) {
                    var staminaNum = csvManager.EnergyCost()[battleInfo.TYPE].ENERGY_COST;

                    /* 扣除体力 */
                    var item = new protocolObject.ItemObject();
                    item.itemId = -1;
                    item.tid = itemType.ITEM_TYPE_STAMINA;
                    item.itemNum = staminaNum;
                    expendArr.push(item);
                    /* 添加金币 */
                    var itemGold = new protocolObject.ItemObject();
                    itemGold.itemId = -1;
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = battleSettlementManager.coinSettlement('battle_settlement_stage', player.character.level, staminaNum);
                    dropArr.push(itemGold);
                    /* 添加经验*/
                    var itemExp = new protocolObject.ItemObject();
                    itemExp.itemId = -1;
                    itemExp.tid = itemType.ITEM_TYPE_EXP;
                    itemExp.itemNum = battleSettlementManager.expSettlement('battle_settlement_stage', player.character.level, staminaNum);
                    dropArr.push(itemExp);

                    cPackage.updateItemWithLog(req.zid, req.zuid, expendArr, dropArr, req.channel, req.acc, logsWater.BATTLEMAINSWEEP_LOGS, req.battleId,function(err, subArr, addArr) {
                        res.arr = addArr;
                        callback(err);
                    });
                },

                /* 更新关卡信息 */
                function(callback) {
                    battleMainDb.updateBattleMainMap(req.zid, req.zuid, battle, callback);
                },

                /* 触发天魔副本 */
                function (callback) {
                    cDemonBoss.demonBossTrigger(req.zid, req.zuid, req.battleId, player, res, callback);
                },

                /* 更新任务进度 */
                function (callback) {
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_1, battleInfo.TYPE, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_1, battleInfo.TYPE, req.battleId, 1);
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
                    logger.logBI(preZid, biCode.logs_instance, preZid, req.channel, req.zuid, req.zuid, player.character.level, battleInfo.TYPE, 0, req.battleId, battleInfo.DIFFICULTY, 0, 0, 3, 0, 0, 0, JSON.stringify(res.arr), res.tid, res.bossIndex, 0, 1, 0, '[]');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_BattleMainSweep;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 点击退出按钮退出主线副本
 */
var CS_ExitBattleMain = (function() {

    /**
     * 构造函数
     */
    function CS_ExitBattleMain() {
        this.reqProtocolName = packets.pCSExitBattleMain;
        this.resProtocolName = packets.pSCExitBattleMain;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ExitBattleMain.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ExitBattleMain();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.battleId
                || null == req.isAuto) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.battleId = parseInt(req.battleId);
            req.isAuto = parseInt(req.isAuto);

            if(isNaN(req.zid) || isNaN(req.battleId) || isNaN(req.isAuto)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var battleInfo; /* 副本配置信息 */
            var battle = null; /* 关卡数据库信息对象 */
            var isFirst = 0; /* 是否首次挑战关卡 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 验证前置关卡和关卡类型 */
                function(callback) {
                    /* 验证主线副本TID */
                    battleInfo = csvManager.StageConfig()[req.battleId];
                    if(!battleInfo) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    /* 验证主线副本类型 */
                    if(battleInfo.TYPE != battleType.BATTLE_MAIN_1
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_2
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_3) {
                        callback(retCode.BATTLE_MAIN_TYPE_ERR);
                        return;
                    }
                    callback(null);
                },

                /* 获取当前关卡信息 */
                function(callback) {
                    battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, req.battleId, callback);
                },

                /* 填充关卡信息 */
                function(obj, callback) {
                    battle = obj;
                    /* 检查关卡信息和战斗开始记录 */
                    if(!battle || !battle.battleStarted) {
                        callback(retCode.BATTLE_MAIN_NO_RECORD);
                        return;
                    }
                    /* 清空战斗开始记录*/
                    battle.battleStarted = 0;
                    /*设置是否首次打该关卡*/
                    isFirst = battle.firstChallenge;
                    if(isFirst == 1){
                        battle.firstChallenge = 0;
                    }
                    battleMainDb.updateBattleMainMap(req.zid, req.zuid, battle, callback);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */

                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_instance, preZid, req.channel, req.zuid, req.zuid, 0, battleInfo.TYPE, 0, req.battleId, battleInfo.DIFFICULTY, battle.startTime, (parseInt(Date.now() / 1000) - battle.startTime), 0, 0, req.isAuto, isFirst , '', -1, -1, 1, 0, 0, '[]');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ExitBattleMain;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取关卡宝箱列表
 */
var CS_GetBattleBoxList = (function() {

    /**
     * 构造函数
     */
    function CS_GetBattleBoxList() {
        this.reqProtocolName = packets.pCSGetBattleBoxList;
        this.resProtocolName = packets.pSCGetBattleBoxList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetBattleBoxList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetBattleBoxList();
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

                function(callback) {
                    battleMainDb.getBattleBoxList(req.zid, req.zuid, callback);
                },

                function(IdArr, callback) {
                    res.boxIdArr = IdArr;
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
    return CS_GetBattleBoxList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取关卡宝箱奖励
 */
var CS_RcvBattleBoxAward = (function() {

    /**
     * 构造函数
     */
    function CS_RcvBattleBoxAward() {
        this.reqProtocolName = packets.pCSRcvBattleBoxAward;
        this.resProtocolName = packets.pSCRcvBattleBoxAward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RcvBattleBoxAward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RcvBattleBoxAward();
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
                || null == req.boxId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.boxId = parseInt(req.boxId);

            if(isNaN(req.zid) || isNaN(req.boxId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 验证总星数 */
                function(callback) {
                    var awardIndex = req.boxId % 10;
                    if(awardIndex < 1 || awardIndex > 3) {
                        callback(retCode.ERR);
                        return;
                    }

                    var boxIndex = parseInt(req.boxId / 10);
                    var srLine = csvManager.StarReward()[boxIndex];
                    if(!srLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    /**/
                    var stageIdBegin = 1000000000; /* 关卡开始ID */
                    var stageIdEnd = 0; /* 关卡结束ID */
                    var preChapterNum = boxIndex % 100; /* 当前章节前面所有章节的数量 */
                    var chapterDifficult = parseInt(boxIndex / 100); /* 当前章节对应的难度(1,2,3) */
                    var stagePointConfig = csvManager.StagePoint();
                    for(var stagePointConfigKey in stagePointConfig) {
                        /* not same difficult */
                        if((stagePointConfigKey % 10) !== chapterDifficult) { /* 章节难度 */
                            continue;
                        }
                        if(parseInt((stagePointConfigKey - 1000000) / 1000) === preChapterNum) { /* 章节序号,从0开始计数, 找了的当前章节的信息*/
                            if(stageIdBegin > stagePointConfig[stagePointConfigKey].STAGEID) { /* 当前章节最小关卡ID */
                                stageIdBegin = stagePointConfig[stagePointConfigKey].STAGEID;
                            }
                            if(stageIdEnd < stagePointConfig[stagePointConfigKey].STAGEID) {/* 当前章节最大关卡 */
                                stageIdEnd = stagePointConfig[stagePointConfigKey].STAGEID;
                            }
                            continue;
                        }
                    }
                    var i = 0;
                    var stars = 0;
                    async.whilst(function() { return stageIdBegin + i <= stageIdEnd; },
                        function(cb) {
                            battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, stageIdBegin + i, function(err, battle) {
                                if (null == err && battle && battle.bestRate > 0) {
                                    stars += battle.bestRate;
                                }
                                ++i;
                                cb(err);
                            });
                        },
                    function(err) {
                        if(err) {
                            callback(err);
                        }
                        else if(stars < srLine['STARNUMBER_' + awardIndex]) {
                            callback(retCode.BATTLE_STARS_NO_ENOUGHT);
                        }
                        else {
                            callback(null);
                        }
                    });
                },

                /* 添加领奖记录 */
                function(callback) {
                    battleMainDb.addBattleBox(req.zid, req.zuid, req.boxId, callback);
                },

                /* 获取奖励 */
                function(succeed, callback) {
                    if(!succeed) {
                        callback(retCode.BATTLE_BOX_AWARD_RCVED);
                        return;
                    }

                    var awardIndex = req.boxId % 10;
                    var boxIndex = parseInt(req.boxId / 10);
                    var srLine = csvManager.StarReward()[boxIndex];

                    var itemStrArr = srLine['REWARD_' + awardIndex].split('|');
                    var arrAdd = [];
                    for(var i = 0; i < itemStrArr.length; ++i) {
                        var item = new globalObject.ItemBase();
                        item.tid = parseInt(itemStrArr[i].split('#')[0]);
                        item.itemNum = parseInt(itemStrArr[i].split('#')[1]);
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc,
                        logsWater.RCV_BATTLEBOX_AWARD, req.boxId, function(err, retSub, retAdd) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            var arrEx = []; /* 不是背包中的物品 */
                            for(var i = 0 ; i < arrAdd.length; ++i) {
                                var inPackage = false;
                                for(var j = 0; j < retAdd.length; ++j) {
                                    if(arrAdd[i].tid == retAdd[j].tid) {
                                        inPackage = true;
                                        break;
                                    }
                                }
                                if(!inPackage) {
                                    arrEx.push(arrAdd[i]);
                                }
                            }
                            res.awards = retAdd.concat(arrEx);
                            callback(null);
                        }
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
    return CS_RcvBattleBoxAward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 重置关卡通关次数
 */
var CS_ResetBattleMain = (function() {

    /**
     * 构造函数
     */
    function CS_ResetBattleMain() {
        this.reqProtocolName = packets.pCSResetBattleMain;
        this.resProtocolName = packets.pSCResetBattleMain;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ResetBattleMain.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ResetBattleMain();
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
                || null == req.battleId
                || null == req.resetCnt) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.battleId = parseInt(req.battleId);
            req.resetCnt = parseInt(req.resetCnt);

            if(isNaN(req.zid) || isNaN(req.battleId) || isNaN(req.resetCnt)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var battleInfo;
            var battle;
            var player;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 验证关卡类型 */
                function(callback) {
                    /* 验证主线副本TID */
                    battleInfo = csvManager.StageConfig()[req.battleId];
                    if(!battleInfo) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    /* 验证主线副本类型 */
                    if(battleInfo.TYPE != battleType.BATTLE_MAIN_1
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_2
                        && battleInfo.TYPE != battleType.BATTLE_MAIN_3) {
                        callback(retCode.BATTLE_MAIN_TYPE_ERR);
                        return;
                    }
                    callback(null);
                },

                /* 获取用户信息 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取当前关卡信息 */
                function(p, callback) {
                    player = p;
                    battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, req.battleId, callback);
                },

                /* 检查重置关卡条件 */
                function(b, callback) {
                    battle = b;
                    var today = (new Date()).toDateString();
                    if (null == battle || battle.lastDay != today || battle.todaySuccess < battleInfo.CHALLENGE_NUM) {
                        callback(retCode.BATTLE_MAIN_NO_NEED_RESET);
                        return;
                    }

                    var vipLine = csvManager.Viplist()[player.vipLevel];
                    if(!vipLine) {
                        callback(retCode.SUCCESS);
                        return;
                    }
                    var resetLimit = vipLine.COPYRESET_NUM;

                    if(battle.lastDay != today) {
                        /* 重置通关限制 */
                        battle.lastDay = today;
                        battle.todaySuccess = 0;
                        battle.todayReset = 0;
                    }

                    if(battle.todayReset + 1 != req.resetCnt) {
                        callback(retCode.BATTLE_MAIN_RESET_CNT_WRONG);
                        return;
                    }

                    if(battle.todayReset >= resetLimit) {
                        callback(retCode.BATTLE_MAIN_CANNOT_RESET);
                        return;
                    }

                    battle.todaySuccess = 0;
                    battle.todayReset += 1;
                    callback(null);
                },

                /* 扣元宝 */
                function(callback) {
                    var rcLine = csvManager.ResetCost()[req.resetCnt];
                    if(!rcLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    var itemDmd = new globalObject.ItemBase();
                    itemDmd.tid = itemType.ITEM_TYPE_DIAMOND;
                    itemDmd.itemNum = rcLine.COST_NUM;
                    var arrSub = [];
                    arrSub.push(itemDmd);

                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, [],  req.channel, req.acc,
                        logsWater.RESET_BATTLEMAIN, req.battleId, function(err) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            callback(null);
                        }
                    });
                },

                /* 更新关卡 */
                function(callback) {
                    battleMainDb.updateBattleMainMap(req.zid, req.zuid, battle, callback);
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
    return CS_ResetBattleMain;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_BattleMainMap());
    exportProtocol.push(new CS_BattleMainStart());
    exportProtocol.push(new CS_BattleMainResult());
    exportProtocol.push(new CS_BattleMainSweep());
    exportProtocol.push(new CS_ExitBattleMain());
    exportProtocol.push(new CS_GetBattleBoxList());
    exportProtocol.push(new CS_RcvBattleBoxAward());
    exportProtocol.push(new CS_ResetBattleMain());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;