
/**
 * 包含的头文件
 */
var packets = require('../packets/rob_magic');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var packageDb = require('../database/package');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var playerDb = require('../database/player');
var cPlayer = require('../common/player');
var robMagicDb = require('../database/rob_magic');
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var rand = require('../../tools/system/math').rand;
var cMission = require('../common/mission');
var cRevelry = require('../common/revelry');
var arenaDb = require('../database/arena');
var itemType = require('../common/item_type');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var robotCommon = require('../../common/robot');
var redisClient = require('../../tools/redis/redis_client');
var redisKey = require('../../common/redis_key');
var battleSettlementManager = require('../common/battle_settlement/index');
var cZuid = require('../common/zuid');
var cLevelCheck = require('../common/level_check');

var ROB_ONE_TIME_SPIRIT_CONSUME = 2;
var EQUIP_BASE_SHOW = 1;

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取机器人信息
 * @param chalevel 主角等级
 * @returns  GrabRobotConfig的某一行
 */
function getRobotInfo(chalevel) {
    var grbTable = csvManager.GrabRobotConfig();
    var a = [];
    for(var i in grbTable) {
        if(grbTable[i].LEVEL_MIN <= chalevel && grbTable[i].LEVEL_MAX >= chalevel) {
            a.push(i);
        }
    }

    var s = 0; /* 总权重 */
    for(var i = 0; i < a.length; ++i) {
        s += grbTable[a[i]].WEIGHT;
    }

    var r = rand(1, s); /* 随机权重 */
    var robotInfo;
    for(var i = 0; i < a.length; ++i) {
        r -= grbTable[a[i]].WEIGHT;
        if(r <= 0) {
            robotInfo = grbTable[a[i]];
            break;
        }
    }

    return robotInfo;
}



/**
 * 夺宝目标列表
 */
var CS_GetRobAimList = (function() {

    /**
     * 构造函数
     */
    function CS_GetRobAimList() {
        this.reqProtocolName = packets.pCSGetRobAimList;
        this.resProtocolName = packets.pSCGetRobAimList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetRobAimList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetRobAimList();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.tid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.tid = parseInt(req.tid);

            if(isNaN(req.zid) || isNaN(req.tid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var playerLevel = 0; /* 玩家主角等级 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取玩家等级 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        playerLevel = player.character.level;
                        callback(err);
                    });
                },

                /* 第一次夺宝列表都是机器人*/
                function(callback) {
                    robMagicDb.isFirstRob(req.zid, req.zuid, callback);
                },
                function(firstTime, callback) {
                    if(!firstTime) {
                        callback(null);
                        return;
                    }

                    var robotNum = 5;
                    for(var i = 0; i < robotNum; ++i) {
                        var robotInfo = getRobotInfo(playerLevel);
                        var robAim = new protocolObject.RobAim();

                        for(var j = 1; j <= 3; ++j) {
                            var tid = robotInfo['PET_ID' + j];
                            if(0 === tid) {
                                continue;
                            }
                            robAim.petTid.push(tid);
                        }

                        robAim.uid = -10001 - i;
                        robAim.name = arenaDb.getRandomName();
                        robAim.level = robotInfo.ROLE_LEVEL;
                        robAim.charTid = robotInfo.ROLE_ID;
                        res.arr.push(robAim);
                    }
                    robMagicDb.setRobAimList(req.zid, req.zuid, req.tid, res.arr, function(err) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            callback(retCode.SUCCESS);
                        }
                    });
                },

                /* 获取拥有法器的玩家列表 */
                function (callback) {
                    robMagicDb.getMagicOwnerList(req.zid, req.tid, playerLevel, callback);
                },

                /* 去掉自己和免战状态的玩家 */
                function(uidList, callback) {
                    var playerNum = Math.min(uidList.length, rand(0, 2));

                    var i = 0;
                    var j = rand(0, uidList.length);
                    async.whilst(
                        function() { return i < playerNum && j < uidList.length; },
                        function(whCb) {
                            if(uidList[j] == req.zuid) {
                                ++ j;
                                whCb(null);
                            }

                            var player;
                            async.waterfall([
                                function(wfCb) {
                                    robMagicDb.getTruceTime(req.zid, uidList[j], wfCb);
                                },

                                function(truceTime, wfCb) {
                                    if(truceTime > parseInt(Date.now() / 1000)) {
                                        ++ j;
                                        wfCb('isTruce');
                                        return;
                                    }

                                    playerDb.getPlayerData(req.zid, uidList[j], false, wfCb);
                                },

                                function(p, wfCb) {
                                    player = p;
                                    cPlayer.getPetsInBattle(req.zid, uidList[j], wfCb);
                                },

                                function(pets, wfCb) {
                                    var robAim = new protocolObject.RobAim();
                                    robAim.uid = uidList[j];
                                    robAim.name = player.name;
                                    robAim.level = player.character.level;
                                    robAim.charTid = player.character.tid;
                                    for(var k = 0; k < pets.length; ++k) {
                                        robAim.petTid.push(pets[k].tid);
                                    }
                                    res.arr.push(robAim);
                                    ++ i;
                                    ++ j;
                                    wfCb(null);
                                }
                            ], function(err) {
                                if(err == 'isTruce') {
                                    err = null;
                                }
                                whCb(err);
                            });
                        },
                        callback
                    );
                },

                /* 获得掠夺机器人列表 */
                function(callback) {
                    var robotNum = 5 - res.arr.length;
                    for(var i = 0; i < robotNum; ++i) {
                        var robotInfo = getRobotInfo(playerLevel);
                        var robAim = new protocolObject.RobAim();

                        for(var j = 1; j <= 3; ++j) {
                            var tid = robotInfo['PET_ID' + j];
                            if(0 === tid) {
                                continue;
                            }
                            robAim.petTid.push(tid);
                        }

                        robAim.uid = (-10001 - i) + '';
                        robAim.name = arenaDb.getRandomName();
                        robAim.level = robotInfo.ROLE_LEVEL;
                        robAim.charTid = robotInfo.ROLE_ID;
                        res.arr.push(robAim);
                    }
                    callback(null);
                },

                /*  存储夺宝目标列表 */
                function(callback) {
                    robMagicDb.setRobAimList(req.zid, req.zuid, req.tid, res.arr, callback);
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
    return CS_GetRobAimList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开始夺宝
 */
var CS_RobMagicStart = (function() {

    /**
     * 构造函数
     */
    function CS_RobMagicStart() {
        this.reqProtocolName = packets.pCSRobMagicStart;
        this.resProtocolName = packets.pSCRobMagicStart;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RobMagicStart.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RobMagicStart();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.aimUid
            || null == req.tid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.tid = parseInt(req.tid);

            if(isNaN(req.zid) || isNaN(req.tid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var magicTid = 0;
            var mfPkgId = globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT;
            var aim = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 检查tid是否在表EquipCompose中 */
                function(callback) {
                    var ecTable = csvManager.EquipCompose();
                    for(var index in ecTable) {
                        for (var j = 1; j <= ecTable[index].NUM; ++j) {
                            if(ecTable[index]['FRAGMENT_' + j] == req.tid) {
                                magicTid = index;
                                break;
                            }
                        }
                    }

                    if(magicTid) {
                        callback(null);
                    }
                    else {
                        callback(retCode.TID_NOT_IN_EQUIPCOMPOSE);
                    }
                },

                /* 检查精力 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function (err, player) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        if(player.spirit < 2) {
                            callback(retCode.ROB_LACK_OF_SPIRIT);
                            return;
                        }
                        callback(null);
                    });
                },

                /* 获取法器碎片背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, mfPkgId, false, callback);
                },

                /* 检查是否满足夺宝条件*/
                function(pkg, callback) {
                    /* 已拥有同类型的法器碎片 */
                    if(getItemNumInPackage(pkg, req.tid)) {
                        callback(retCode.SAME_FRAGMENT_ALREADY_GOT);
                    }

                    /* 常显类型的法器 */
                    var ecTable = csvManager.EquipCompose();
                    if(ecTable[magicTid].BASE_SHOW) {
                        callback(null);
                        return;
                    }

                    /* 检查是否有合成法器的其他碎片 */
                    var robFlag = false;
                    for(var i = 1; i <= ecTable[magicTid].NUM; ++i) {
                        var t = ecTable[magicTid]['FRAGMENT_' + i];
                        if(t != req.tid) {
                            if(getItemNumInPackage(pkg, t)) {
                                robFlag = true;
                                break;
                            }
                        }
                    }

                    if(robFlag) {
                        callback(null);
                    }
                    else {
                        callback(retCode.NO_OTHER_FRAGMENT_FOR_SAME_MAGIC)
                    }
                },

                /* 获取夺宝目标列表 */
                function(callback) {
                    robMagicDb.getRobAimList(req.zid, req.zuid, req.tid, callback);
                },

                /* 检查目标是否在列表中 */
                function(aimList, callback) {
                    var aimInList = false;
                    for(var i = 0; i < aimList.length; ++i) {
                        if(aimList[i].uid == req.aimUid) {
                            aim = aimList[i];
                            aimInList = true;
                            break;
                        }
                    }

                    if(aimInList) {
                        callback(null);
                    }
                    else {
                        callback(retCode.ROB_AIM_NOT_IN_LIST);
                    }
                },

                /*  检查目标身上是否有碎片 */
                function(callback) {
                    /* 目标是机器人 */
                    if(robotCommon.checkIfRobot(req.aimUid)) {
                        callback(null);
                        return;
                    }

                    packageDb.getPackage(req.zid, req.aimUid, mfPkgId, false, function(err, pkg) {
                        if (err) {
                            callback(err);
                        }
                        else if (getItemNumInPackage(pkg, req.tid) < 2) {
                            res.noEnoughFrag = 1;
                            callback(retCode.SUCCESS);
                        }
                        else {
                            callback(null);
                        }
                    });
                },

                /* 检查目标是否处于免战状态 */
                function(callback) {
                    /* 目标是机器人 */
                    if(robotCommon.checkIfRobot(req.aimUid)) {
                        callback(null);
                        return;
                    }

                    robMagicDb.getTruceTime(req.zid, req.aimUid, function(err, truceTime) {
                        if(err) {
                            callback(err);
                        }
                        else if(truceTime > parseInt(Date.now() / 1000)) {
                            res.InTruce = 1;
                            callback(retCode.SUCCESS);
                        }
                        else {
                            callback(null);
                        }
                    });
                },

                /* 获取战斗对象PlayerFightDetail */
                function(callback) {
                    if(robotCommon.checkIfRobot(req.aimUid)) { /* 目标是机器人 */
                        var playerFD = new globalObject.PlayerFightDetail();
                        playerFD.name = aim.name;
                        playerFD.level = aim.level;
                        playerFD.power = 1000;

                        var petFD = new globalObject.PetFightDetail();
                        petFD.tid = aim.charTid;
                        playerFD.petFDs.push(petFD);
                        for (var i = 0; i < aim.petTid.length; ++i) {
                            petFD = new globalObject.PetFightDetail();
                            petFD.tid = aim.petTid[i];
                            playerFD.petFDs.push(petFD);
                        }

                        for (var i = 0; i < playerFD.petFDs.length; ++i) {
                            petFD = playerFD.petFDs[i];

                            var aoLine = csvManager.ActiveObject()[petFD.tid];
                            var baIndex = aoLine.APTITUDE_LEVEL * 1000;
                            var baLine = csvManager.BreakAttribute()[baIndex];

                            petFD.attack = aoLine.BASE_ATTACK + baLine.BASE_BREAK_ATTACK
                            + baLine.BREAK_ATTACK;
                            petFD.hp = aoLine.BASE_HP + baLine.BASE_BREAK_HP
                            + baLine.BREAK_HP;
                            petFD.phyDef = aoLine.BASE_PHYSICAL_DEFENCE + baLine.BASE_BREAK_PHYSICAL_DEFENCE
                            + baLine.BREAK_PHYSICAL_DEFENCE;
                            petFD.mgcDef = aoLine.BASE_MAGIC_DEFENCE + baLine.BASE_BREAK_MAGIC_DEFENCE
                            + baLine.BREAK_MAGIC_DEFENCE;
                            petFD.criRt = aoLine.CRITICAL_STRIKE;
                            petFD.dfCriRt = 0;
                            petFD.hitTrRt = aoLine.HIT;
                            petFD.gdRt = aoLine.DODGE;
                            petFD.hitRt = 0;
                            petFD.dfHitRt = aoLine.MITIGATIONG;
                        }
                        callback(null, playerFD);
                    }
                    else { /* 目标是玩家 */
                        /* 清空免战时间 */
                        robMagicDb.setTruceTime(req.zid, req.zuid, 0, function (err) {
                            if(!!err) {
                                callback(err);
                                return;
                            }
                            cPlayer.getPlayerFightDetail(req.zid, req.aimUid, callback);
                        });
                    }
                },

                /* 保存开始夺宝记录 */
                function(playerFD, callback) {
                    var rcd = new globalObject.StartRobRecord();
                    rcd.uid = aim.uid;
                    rcd.tid = req.tid;
                    rcd.opponent = playerFD;
                    robMagicDb.setStartRobRecord(req.zid, req.zuid, rcd);

                    res.opponent = playerFD;
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
    return CS_RobMagicStart;
})();

function getItemNumInPackage(pkg, tid) {
    var itemNum = 0;
    var items = pkg.content;
    for(var i = 0; i < items.length; ++i) {
        if(items[i].tid == tid) {
            itemNum += items[i].itemNum;
        }
    }

    return itemNum;
}
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 结束夺宝
 */
var CS_RobMagicResult = (function() {

    /**
     * 构造函数
     */
    function CS_RobMagicResult() {
        this.reqProtocolName = packets.pCSRobMagicResult;
        this.resProtocolName = packets.pSCRobMagicResult;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RobMagicResult.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RobMagicResult();
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
            || null == req.tid
            || null == req.isWin) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.tid = parseInt(req.tid);
            req.isWin = parseInt(req.isWin);

            if(isNaN(req.zid) || isNaN(req.tid) || isNaN(req.isWin)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var magicTid;
            var player;
            var robRecord;
            var arrAdd = [];
            var arrSub = [];
            var mfPkgId = globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT;
            var itemFrag = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取法器品质 */
                function(callback) {
                    var faLine = csvManager.FragmentAdmin()[req.tid];
                    if(!faLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    magicTid = faLine.ROLEEQUIPID;
                    callback(null);
                },

                /* 获取玩家player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取开始夺宝记录 */
                function(p, callback) {
                    player = p;
                    robMagicDb.getStartRobRecord(req.zid, req.zuid, callback);
                },

                /* 检查请求和记录是否一致 */
                function(rcd, callback) {
                    if(rcd.uid != req.aimUid || rcd.tid != req.tid) {
                        callback(retCode.REQ_DISMATCH_WITH_ROB_RECORD);
                        return;
                    }
                    robRecord = rcd;

                    /* 获取法器碎片背包 */
                    packageDb.getPackage(req.zid, req.zuid, mfPkgId, false, callback);
                },

                /* 战斗奖励 */
                function(mgcFrgPkg, callback) {
                    /* 扣掉2点精力 */
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_SPIRIT;
                    item.itemNum = 2;
                    arrSub.push(item);

                    /**/
                    var itemGold = new globalObject.ItemBase();
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = battleSettlementManager.coinSettlement('battle_settlement_grab_treasure', player.character.level, ROB_ONE_TIME_SPIRIT_CONSUME);
                    res.gold = itemGold.itemNum;
                    arrAdd.push(itemGold);

                    var itemExp = new globalObject.ItemBase();
                    itemExp.tid = itemType.ITEM_TYPE_EXP;
                    itemExp.itemNum = battleSettlementManager.expSettlement('battle_settlement_grab_treasure', player.character.level, ROB_ONE_TIME_SPIRIT_CONSUME);
                    res.exp = itemExp.itemNum;
                    arrAdd.push(itemExp);

                    if(!req.isWin) { /* 战斗失败的直接返回 */
                        robMagicUpdateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, res.allAddItems,req.channel, req.acc, logsWater.ROBMAGICRESULT_LOGS, req.tid,  callback);
                    }
                    else { /* 胜利添加宝箱物品 */
                        var grpId = getBoxGroupId(player, mgcFrgPkg, req.tid);
                        csvExtendManager.GroupIDConfig_DropId(grpId, 1, function (err, items) {
                            if (err) {
                                callback(err);
                            }
                            else {
                                res.awardItem = items[0];
                                arrAdd.push(items[0]);
                                callback(null);
                            }
                        });
                    }
                },

                /* 判断是否是第一次夺宝 */
                function(callback) {
                    robMagicDb.isFirstRob(req.zid, req.zuid, callback);
                },

                /* 如果目标是机器人 */
                function(firstTime, callback) {
                    if(firstTime) {
                        robMagicDb.setRobbed(req.zid, req.zuid);
                    }

                    if (!robotCommon.checkIfRobot(req.aimUid)) {
                        callback(null);
                        return;
                    }

                    var rate = robRobotRate(magicTid);
                    if (firstTime || Math.random() < rate) {
                        var item = new globalObject.ItemBase();
                        item.tid = req.tid;
                        item.itemNum = 1;
                        arrAdd.push(item);
                        res.succeed = 1;
                    }
                    robMagicUpdateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, res.allAddItems, req.channel, req.acc, logsWater.ROBMAGICRESULT_LOGS, req.tid, callback);
                },

                /* 目标是玩家,获取法器碎片背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.aimUid, mfPkgId, false, callback);
                },

                /* 检查目标身上的碎片数量 */
                function(pkg, callback) {
                    for (var i = 0; i < pkg.content.length; ++i) {
                        if (pkg.content[i].tid == req.tid) {
                            itemFrag = pkg.content[i];
                            break;
                        }
                    }
                    /* 碎片不足，夺宝失败 */
                    if (null == itemFrag || itemFrag.itemNum < 2) {
                        robMagicUpdateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, res.allAddItems, req.channel, req.acc, logsWater.ROBMAGICRESULT_LOGS, req.tid,  callback);
                        return;
                    }

                    var rate = robPlayerRate(magicTid);
                    if (Math.random() < rate) {
                        var itemNew = new globalObject.ItemBase();
                        itemNew.tid = req.tid;
                        itemNew.itemNum = 1;
                        arrAdd.push(itemNew);
                        res.succeed = 1;

                        /* 受害者添加被夺记录 */
                        var history = new protocolObject.HistoryOfRobbed();
                        history.uid = req.zuid;
                        history.name = player.name;
                        history.tid = req.tid;
                        history.robTime = parseInt(Date.now() / 1000);
                        robMagicDb.updateRobbedHistoryList(req.zid, req.aimUid, history, callback);
                        return;
                    }
                    callback(null);
                },

                function (callback) {
                    async.parallel({
                        principalAddItem: function (cb) {
                            cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.ROBMAGICRESULT_LOGS, req.tid, function(err, retSub, retAdd) {
                                if(!!err) {
                                    cb(err);
                                } else {
                                    for(var i = 0; i < arrAdd.length; ++i) {
                                        var found = false;
                                        for(var j = 0; j < retAdd.length; ++j) {
                                            if(arrAdd[i].tid == retAdd[j].tid) {
                                                found = true;
                                                break;
                                            }
                                        }
                                        if(!found) {
                                            res.allAddItems.push(arrAdd[i]);
                                        }
                                    }
                                    for(var i = 0; i < retAdd.length; ++i) {
                                        res.allAddItems.push(retAdd[i]);
                                    }
                                    cb(null);
                                }
                            });
                        },
                        
                        rivalSubstractItem: function (cb) {
                            if(1 !== res.succeed) {
                                cb(null);
                                return;
                            }
                            var fragmentSub = [];
                            var itemNew = new globalObject.ItemBase();
                            itemNew.itemId = itemFrag.itemId;
                            itemNew.tid = req.tid;
                            itemNew.itemNum = 1;
                            fragmentSub.push(itemNew);
                            cPackage.updateItemWithLog(req.zid, req.aimUid, fragmentSub, [], req.channel, req.acc, logsWater.ROBMAGICRESULT_LOGS, req.tid, cb);
                        }
                    }, callback);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */

                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_indiana_fight, preZid, req.channel, req.zuid, req.zuid, 1, res.succeed, JSON.stringify(res.awardItem));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_RobMagicResult;
})();


/**
 * 抢夺机器人成功率
 * @param magicTid [int] 法器Id
 * @returns {number}
 */
function robRobotRate(magicTid) {
    var recLine = csvManager.RoleEquipConfig()[magicTid];
    if(!recLine) {
        return 0;
    }

    if(itemType.MAGIC_EXP_MID == magicTid) {
        return 0.75;
    }
    else if(itemType.MAGIC_EXP_HIGH == magicTid) {
        return 0.2;
    }

    var quality = recLine.QUALITY;
    switch (quality) {
        case 3:
            return 0.9;
        case 4:
            return 0.17;
        case 5:
            return 0.15;
        case 6:
            return 0.1;
        default:
            return 0;
    }
}

/**
 * 抢夺玩家成功率
 * @param magicTid [int] 法器Id
 * @returns {number}
 */
function robPlayerRate(magicTid) {
    var recLine = csvManager.RoleEquipConfig()[magicTid];
    if(!recLine) {
        return 0;
    }

    if(itemType.MAGIC_EXP_MID == magicTid) {
        return 0.9;
    }
    else if(itemType.MAGIC_EXP_HIGH == magicTid) {
        return 0.4;
    }

    var quality = recLine.QUALITY;
    switch (quality) {
        case 3:
            return 0.95;
        case 4:
            return 0.34;
        case 5:
            return 0.3;
        case 6:
            return 0.2;
        default:
            return 0;
    }
}


function robMagicUpdateItemWithLog(zid, uid, arrSub, arrAdd, arrRes,channel, acc, logsWater, reasonTwo, callback) {
    arrAdd = cPackage.mergeItems(arrAdd);
    cPackage.updateItemWithLog(zid, uid, arrSub, arrAdd, channel, acc, logsWater, reasonTwo, function(err, retSub, retAdd) {
        if(err) {
            callback(err);
        }
        else {
            for(var i = 0; i < arrAdd.length; ++i) {
                var found = false;
                for(var j = 0; j < retAdd.length; ++j) {
                    if(arrAdd[i].tid == retAdd[j].tid) {
                        found = true;
                        break;
                    }
                }

                if(!found) {
                    arrRes.push(arrAdd[i]);
                }
            }

            for(var i = 0; i < retAdd.length; ++i) {
                arrRes.push(retAdd[i]);
            }

            callback(retCode.SUCCESS);
        }
    });
}

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 夺五次
 */
var CS_Rob5Times = (function() {

    /**
     * 构造函数
     */
    function CS_Rob5Times() {
        this.reqProtocolName = packets.pCSRob5Times;
        this.resProtocolName = packets.pSCRob5Times;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_Rob5Times.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_Rob5Times();
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
            || null == req.tid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.tid = parseInt(req.tid);

            if(isNaN(req.zid) || isNaN(req.tid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var mfPkgId = globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT;
            var magicTid = 0; /* 法器tid */
            var aim = null; /* 夺宝目标对象 */
            var arrAdd = []; /* 添加物品对象数组 */
            var robCnt = 0; /* 夺宝次数 */
            var player; /* 主角对象 */
            var mgcFrgPkg; /* 法器碎片背包 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 检查tid是否在表EquipCompose中 */
                function(callback) {
                    var ecTable = csvManager.EquipCompose();
                    for(var index in ecTable) {
                        for (var j = 1; j <= ecTable[index].NUM; ++j) {
                            if(ecTable[index]['FRAGMENT_' + j] == req.tid) {
                                magicTid = index;
                                break;
                            }
                        }
                    }

                    if(magicTid) {
                        callback(null);
                    }
                    else {
                        callback(retCode.TID_NOT_IN_EQUIPCOMPOSE);
                    }
                },

                /* 获取法器碎片背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, mfPkgId, false, callback);
                },

                /* 检查是否满足夺宝条件*/
                function(pkg, callback) {
                    mgcFrgPkg = pkg;

                    /* 已拥有同类型的法器碎片 */
                    if(getItemNumInPackage(pkg, req.tid)) {
                        callback(retCode.SAME_FRAGMENT_ALREADY_GOT);
                    }

                    /* 常显类型的法器 */
                    var ecTable = csvManager.EquipCompose();
                    if(ecTable[magicTid].BASE_SHOW) {
                        callback(null);
                        return;
                    }

                    /* 检查是否有合成法器的其他碎片 */
                    var robFlag = false;
                    for(var i = 1; i <= ecTable[magicTid].NUM; ++i) {
                        var t = ecTable[magicTid]['FRAGMENT_' + i];
                        if(t != req.tid) {
                            if(getItemNumInPackage(pkg, t)) {
                                robFlag = true;
                                break;
                            }
                        }
                    }

                    if(robFlag) {
                        callback(null);
                    }
                    else {
                        callback(retCode.NO_OTHER_FRAGMENT_FOR_SAME_MAGIC);
                    }
                },

                /* 获取夺宝目标列表 */
                function(callback) {
                    robMagicDb.getRobAimList(req.zid, req.zuid, req.tid, callback);
                },

                /* 检查目标是否在列表中 */
                function(aimList, callback) {
                    var aimInList = false;
                    for(var i = 0; i < aimList.length; ++i) {
                        if(aimList[i].uid == req.aimUid) {
                            aim = aimList[i];
                            aimInList = true;
                            break;
                        }
                    }

                    if(aimInList) {
                        callback(null);
                    }
                    else {
                        callback(retCode.ROB_AIM_NOT_IN_LIST);
                    }
                },

                /* 获取法器品质 */
                function(callback) {
                    var recLine = csvManager.RoleEquipConfig()[magicTid];
                    if(!recLine) {
                        callback(retCode.TID_NOT_EXIST);
                    }

                    callback(null);
                },

                /* 获取玩家player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, true, callback);
                },

                /* 开始夺宝 */
                function(p, callback) {
                    player = p;
                    var rate = robRobotRate(magicTid);
                    var robTimes = 0;
                    while (player.spirit >= 2 && robTimes < 5) {
                        player.spirit -= 2;
                        ++robTimes;
                        if (Math.random() < rate) {
                            var item = new globalObject.ItemBase();
                            item.tid = req.tid;
                            item.itemNum = 1;
                            arrAdd.push(item);
                            res.succeed = 1;
                            break;
                        }
                    }
                    robCnt = robTimes;
                    playerDb.savePlayerData(req.zid, req.zuid, player, true, callback);
                },

                /* 获取奖励内容 */
                function(callback) {
                    for (var i = 0; i < robCnt; ++i) {
                        var itemGold = new globalObject.ItemBase();
                        itemGold.tid = itemType.ITEM_TYPE_GOLD;
                        itemGold.itemNum = battleSettlementManager.coinSettlement('battle_settlement_grab_treasure', player.character.level, ROB_ONE_TIME_SPIRIT_CONSUME);
                        res.golds.push(itemGold.itemNum);
                        arrAdd.push(itemGold);

                        var itemExp = new globalObject.ItemBase();
                        itemExp.tid = itemType.ITEM_TYPE_EXP;
                        itemExp.itemNum = battleSettlementManager.expSettlement('battle_settlement_grab_treasure', player.character.level, ROB_ONE_TIME_SPIRIT_CONSUME);
                        res.exps.push(itemExp.itemNum);
                        arrAdd.push(itemExp);
                    }

                    var grpId = getBoxGroupId(player, mgcFrgPkg, req.tid);
                    csvExtendManager.GroupIDConfig_DropId(grpId, robCnt, function (err, items) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            res.awardItems = items;
                            arrAdd = arrAdd.concat(items);
                            callback(null);
                        }
                    });
                },

                /* 添加奖励 */
                function(callback) {
                    robMagicUpdateItemWithLog(req.zid, req.zuid, [], arrAdd, res.allAddItems,req.channel, req.acc, logsWater.ROBMAGICRESULT_LOGS, req.tid,  callback);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */

                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_indiana_fight, preZid, req.channel, req.zuid, req.zuid, 2, res.succeed, JSON.stringify(res.awardItems));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_Rob5Times;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 被抢夺记录
 */
var CS_GetRobbedHistoryList = (function() {

    /**
     * 构造函数
     */
    function CS_GetRobbedHistoryList() {
        this.reqProtocolName = packets.pCSGetRobbedHistoryList;
        this.resProtocolName = packets.pSCGetRobbedHistoryList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetRobbedHistoryList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetRobbedHistoryList();
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
                    robMagicDb.getRobbedHistoryList(req.zid, req.zuid, callback);
                },

                function(result, callback) {
                    res.arr = result;
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
    return CS_GetRobbedHistoryList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 法宝合成
 */
var CS_MagicCompose = (function() {

    /**
     * 构造函数
     */
    function CS_MagicCompose() {
        this.reqProtocolName = packets.pCSMagicCompose;
        this.resProtocolName = packets.pSCMagicCompose;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MagicCompose.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MagicCompose();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.tid
            || null == req.frags) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.tid = parseInt(req.tid);

            if(isNaN(req.zid) || isNaN(req.tid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            for(var i = 0; i < req.frags.length; ++i) {
                if(null == req.frags[i]
                    || null == req.frags[i].itemId
                    || null == req.frags[i].tid
                    || null == req.frags[i].itemNum) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }

                req.frags[i].itemId = parseInt(req.frags[i].itemId);
                req.frags[i].tid = parseInt(req.frags[i].tid);
                req.frags[i].itemNum = parseInt(req.frags[i].itemNum);

                if(isNaN(req.frags[i].itemId) || isNaN(req.frags[i].tid) || isNaN(req.frags[i].itemNum)) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }
            }

            var arrAdd = [];
            var roleEquipConfig = null;
            var magicFragmentsInfo = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 检查碎片tid */
                function(callback) {
                    if(req.frags.length < 1) {
                        callback(retCode.ERR);
                        return;
                    }
                    /* 检查碎片配置表 */
                    var faLine = csvManager.FragmentAdmin()[req.frags[0].tid];
                    if(!faLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    /* 检查法器碎片配置表 */
                    var ecLine = csvManager.EquipCompose()[faLine.ROLEEQUIPID];
                    if(!ecLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    if(ecLine.NUM != req.frags.length) {
                        callback(retCode.FRAGMENT_NUM_NOT_MATCH);
                        return;
                    }
                    var n = 0;
                    for(var i = 0; i < ecLine.NUM; ++i) {
                        for(var j = 0; j < ecLine.NUM; ++j) {
                            if(ecLine['FRAGMENT_' + (i + 1)] == req.frags[j].tid) {
                                ++ n;
                            }
                        }
                    }
                    if(n != ecLine.NUM) {
                        callback(retCode.NO_ENOUGH_FRAGMENT);
                        return;
                    }
                    /* 获取道具具体信息 */
                    roleEquipConfig = csvManager.RoleEquipConfig()[faLine.ROLEEQUIPID];
                    if(!roleEquipConfig) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    callback(null, faLine.ROLEEQUIPID);
                },

                /* 减去碎片，加上法器 */
                function(equipTid, callback) {
                    for(var i = 0; i < req.frags.length; ++i) {
                        req.frags[i].itemNum = 1;
                    }
                    var item = new globalObject.ItemBase();
                    item.tid = equipTid;
                    item.itemNum = 1;
                    arrAdd.push(item);
                    callback(null);
                },

                function (callback) {
                    /* 更新背包 */
                    cPackage.updateItemWithLog(req.zid, req.zuid, req.frags, arrAdd, req.channel, req.acc, logsWater.MAGICCOMPOSE_LOGS, req.tid, function(err, retSub, retAdd) {
                        if(err) {
                            callback(null, err);
                            return;
                        }
                        res.ItemMagic = retAdd[0];
                        callback(null, null);
                    });
                },

                /* 获取法器对应的碎片情况 */
                function (errUpdateItemWithLog, callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT, false, function (err, pkg) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        for(var i = 0; i < req.frags.length; i++) {
                            for(var j = 0; j < pkg.content.length; j++) {
                                if(req.frags[i].tid === pkg.content[j].tid) {
                                    magicFragmentsInfo.push(pkg.content[j]);
                                    break;
                                }
                            }
                            if(j === pkg.content.length) {
                                magicFragmentsInfo.push({
                                    itemId: -1,
                                    itemNum: 0,
                                    tid: req.frags[i].tid
                                });
                            }
                        }
                        res.magicFragmentsInfo = magicFragmentsInfo;
                        callback(null || errUpdateItemWithLog);
                    });
                },

                function(callback) {
                    /* 更新任务进度 */
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_18, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_18, 0, 0, 1);

                    /* 更新狂欢进度 */
                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 16, 1);
                    if (roleEquipConfig.QUALITY == 4) {
                        cRevelry.updateRevelryProgress(req.zid, req.zuid, 22, 1);
                    }
                    else if (roleEquipConfig.QUALITY == 5) {
                        cRevelry.updateRevelryProgress(req.zid, req.zuid, 23, 1);
                    }
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
    return CS_MagicCompose;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 使用免战令牌
 */
var CS_UseTruceCard = (function() {

    /**
     * 构造函数
     */
    function CS_UseTruceCard() {
        this.reqProtocolName = packets.pCSUseTruceCard;
        this.resProtocolName = packets.pSCUseTruceCard;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_UseTruceCard.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_UseTruceCard();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.truceCard) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.truceCard.itemId
                || null == req.truceCard.tid
                || null == req.truceCard.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.truceCard.itemId = parseInt(req.truceCard.itemId);
            req.truceCard.tid = parseInt(req.truceCard.tid);
            req.truceCard.itemNum = parseInt(req.truceCard.itemNum);

            if(isNaN(req.truceCard.itemId) || isNaN(req.truceCard.tid) || isNaN(req.truceCard.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    var zid = req.zid;
                    var uid = req.zuid;
                    var tid = req.truceCard.tid;
                    var itemId = req.truceCard.itemId;

                    var arrSub = [];
                    var truceTimeNew = null;
                    async.series({
                        checkItemTid: function (cb) {
                            if (tid != itemType.ITEM_TYPE_TRUCE_TOKEN_BIG
                                && tid != itemType.ITEM_TYPE_TRUCE_TOKEN_SMALL) {
                                cb(retCode.WRONG_TID_FOR_TRUCE);
                            }
                            cb(null);
                        },

                        compute: function (cb) {
                            async.parallel({
                                substractTruceCard: function (cb) {
                                    var truceCard = new protocolObject.ItemObject();
                                    truceCard.itemId = itemId;
                                    truceCard.tid = tid;
                                    truceCard.itemNum = 1;
                                    arrSub.push(truceCard);
                                    cb(null);
                                },

                                addTruceTime: function (cb) {
                                    robMagicDb.getTruceTime(zid, uid, function (err, truceTime) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        var now = parseInt(Date.now() / 1000);
                                        truceTimeNew = now > truceTime ? now : truceTime;
                                        if (tid == itemType.ITEM_TYPE_TRUCE_TOKEN_BIG) {
                                            truceTimeNew += 8 * 3600;
                                        }
                                        else {
                                            truceTimeNew += 3600;
                                        }
                                        cb(null);
                                    });
                                }
                            }, cb)
                        },
                        
                        update: function (cb) {
                            async.series({
                                updateItems: function (cb) {
                                    cPackage.updateItemWithLog(zid, uid, arrSub, [], req.channel, req.acc, logsWater.USETRUCECARD_LOGS, tid, cb);
                                },
                                
                                updateTruceTime: function (cb) {
                                    robMagicDb.setTruceTime(zid, uid, truceTimeNew, cb);
                                }
                            }, cb)
                        }
                    }, function (err) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.time = truceTimeNew;
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
    return CS_UseTruceCard;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取免战时间
 */
var CS_GetTruceTime = (function() {

    /**
     * 构造函数
     */
    function CS_GetTruceTime() {
        this.reqProtocolName = packets.pCSGetTruceTime;
        this.resProtocolName = packets.pSCGetTruceTime;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetTruceTime.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetTruceTime();
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
                    var zid = req.zid;
                    var uid = req.zuid;

                    robMagicDb.getTruceTime(zid, uid, function(err, truceTime) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.time = truceTime;
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
    return CS_GetTruceTime;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 一键夺宝
 */
var CS_RobOneKey = (function() {

    /**
     * 构造函数
     */
    function CS_RobOneKey() {
        this.reqProtocolName = packets.pCSRobOneKey;
        this.resProtocolName = packets.pSCRobOneKey;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RobOneKey.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RobOneKey();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.equipTid
                || null == req.fragmentTid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.equipTid = parseInt(req.equipTid);
            req.fragmentTid = parseInt(req.fragmentTid);

            if( isNaN(req.zid) || isNaN(req.equipTid) || isNaN(req.fragmentTid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;
                    var equipTid = req.equipTid;
                    var fragmentTid = req.fragmentTid;

                    var player = null;
                    var rewards = [];
                    var consumes = [];
                    var magicFragmentPackage = null;
                    async.series({
                        getPlayer: function (cb) {
                            playerDb.getPlayerData(zid, uid, false, function (err, data) {
                                if (!!err) {
                                    cb(err);
                                    return;
                                }
                                player = data;
                                cb(null);
                            });
                        },

                        check: function (cb) {
                            async.parallel({
                                checkVipOrLevel: function (cb) {
                                    if(!cLevelCheck(player, 'robOneKey')) {
                                        cb(retCode.LACK_OF_LEVEL);
                                        return;
                                    }
                                    cb(null);
                                },

                                checkSpirit: function (cb) {
                                    if(player.spirit < ROB_ONE_TIME_SPIRIT_CONSUME) {
                                        cb(retCode.ROB_SPIRI_RUN_OUT);
                                        return;
                                    }
                                    cb(null);
                                },

                                checkEquitAndFragment: function (cb) {
                                    var equipComposeConfig = csvManager.EquipCompose()[equipTid];
                                    if(undefined === equipComposeConfig || null === equipComposeConfig) {
                                        cb(retCode.ROB_EQUIP_COMPOSE_CONFIG_NOT_EXIST);
                                        return;
                                    }
                                    var fragmentAdminConfig = csvManager.FragmentAdmin()[fragmentTid];
                                    if(undefined === fragmentAdminConfig || null === fragmentAdminConfig) {
                                        cb(retCode.ROB_FRAGMENT_CONFIG_NOT_EXIST);
                                        return;
                                    }
                                    /**/
                                    var fragmentTidsNeed = [];
                                    for(var i = 1; i <= equipComposeConfig.NUM; i++) {
                                        fragmentTidsNeed.push(equipComposeConfig['FRAGMENT_' + i]);
                                    }
                                    packageDb.getPackage(zid, uid, globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT, false, function (err, data) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        magicFragmentPackage = data;
                                        /**/
                                        var fragmentHaveNum = 0;
                                        var items = magicFragmentPackage.content;
                                        for(var i = 0; i < items.length; i++) {
                                            if(items[i].tid === fragmentTid) {
                                                cb(retCode.SAME_FRAGMENT_ALREADY_GOT);
                                                return;
                                            }
                                            if(fragmentTidsNeed.indexOf(items[i].tid) != -1) {
                                                fragmentHaveNum ++;
                                            }
                                        }
                                        /**/
                                        if(EQUIP_BASE_SHOW !== equipComposeConfig.BASE_SHOW && fragmentHaveNum <= 0) {
                                            cb(retCode.ROB_EQUIP_COMPOSE_HAVE_NO_FRAGMENT);
                                            return;
                                        }
                                        cb(null);
                                    });
                                }
                            }, function (err) {
                                cb(err);
                            });
                        },

                        compute: function (cb) {
                            async.parallel({
                                computeConsume: function (cb) {
                                    var item = new globalObject.ItemBase();
                                    item.tid = itemType.ITEM_TYPE_SPIRIT;
                                    item.itemNum = 2;
                                    consumes.push(item);
                                    cb(null);
                                },

                                computeReward: function (cb) {
                                    var itemGold = new globalObject.ItemBase();
                                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                                    itemGold.itemNum = battleSettlementManager.coinSettlement('battle_settlement_grab_treasure', player.character.level, ROB_ONE_TIME_SPIRIT_CONSUME);
                                    rewards.push(itemGold);
                                    res.gold = itemGold.itemNum;

                                    /* 获得经验*/
                                    var itemExp = new globalObject.ItemBase();
                                    itemExp.tid = itemType.ITEM_TYPE_EXP;
                                    itemExp.itemNum = battleSettlementManager.expSettlement('battle_settlement_grab_treasure', player.character.level, ROB_ONE_TIME_SPIRIT_CONSUME);
                                    rewards.push(itemExp);
                                    res.exp = itemExp.itemNum;

                                    var grpId = getBoxGroupId(player, magicFragmentPackage, fragmentTid);
                                    csvExtendManager.GroupIDConfig_DropId(grpId, 1, function (err, items) {
                                        if (err) {
                                            cb(err);
                                            return;
                                        }
                                        rewards.push(items[0]);
                                        res.awardItem = items[0];
                                        cb(null);
                                    });
                                },

                                computeFragment: function (cb) {
                                    var roleEquipConfig = csvManager.RoleEquipConfig()[equipTid];
                                    if(!roleEquipConfig) {
                                        cb(retCode.ROB_ROLE_EQUIP_CONFIG_NOT_EXIST);
                                        return;
                                    }

                                    var rate = robRobotRate(equipTid);
                                    if (Math.random() < rate) {
                                        var item = new globalObject.ItemBase();
                                        item.tid = fragmentTid;
                                        item.itemNum = 1;
                                        rewards.push(item);
                                        res.succeed = 1;
                                    }
                                    cb(null);
                                }
                            }, function (err) {
                                cb(err);
                            });
                        },

                        updateItems: function (cb) {
                            cPackage.smartUpdateItemWithLog(zid, uid, consumes, rewards, req.channel, req.acc, logsWater.ROBONEKEY_LOGS, fragmentTid, function(err, retAdd) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                res.allAddItems = retAdd;
                                cb(null);
                            });
                        }
                    }, function (err) {
                        callback(err);
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
    return CS_RobOneKey;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 夺宝成功时开宝箱的groupId
 * @param player 玩家对象
 * @param mgcFrgPkg 法器碎片背包
 * @param frgTid 法器碎片tid
 */
function getBoxGroupId(player, mgcFrgPkg, frgTid) {
    var faLine = csvManager.FragmentAdmin()[frgTid];
    if(!faLine) {
        return 0;
    }
    var mgcTid = faLine.ROLEEQUIPID; /* 法器tid */
    var recLine = csvManager.RoleEquipConfig()[mgcTid];
    if(!recLine) {
        return 0;
    }
    var quality = recLine.QUALITY; /* 法器品质 */

    var ecLine = csvManager.EquipCompose()[mgcTid];
    if(!ecLine) {
        return 0;
    }

    var frgTypeCnt = 0; /* 合成同法器的碎片类型种类数 */
    for(var i = 1; i <= 6; ++i) {
        for(var j = 0; j < mgcFrgPkg.content.length; ++j) {
            var mgcFrg = mgcFrgPkg.content[j];
            if(mgcFrg.tid == ecLine['FRAGMENT_' + i]) {
                ++ frgTypeCnt;
                break;
            }
        }
    }

    var indrTable = csvManager.IndianaDraw();
    var grpId = 0;

    for(var i in indrTable) {
        var indrLine = indrTable[i];
        if(indrLine.LEVEL_MIN <= player.character.level && indrLine.LEVEL_MAX >= player.character.level) {
            grpId = indrLine.DRAW_GROUP_ID;
            break;
        }
    }

    if(!indrLine) {
        return grpId;
    }

    var cons = indrLine.CONDITION_GROUP_ID.split('|');
    for(var i = 0; i < cons.length; ++i) {
        var con = cons[i]; /* 条件字符串  A#B#C */
        con = con.split('#');
        if(con.length != 3) {
            continue;
        }

        var ilg = true; /* 条件是否符合规范 */
        for(var j = 0; j < con.length; ++j) {
            con[j] = parseInt(con[j]);
            if(isNaN(con[j])) {
                ilg = false;
                break;
            }
        }
        if(ilg) {
            continue;
        }

        /* 目前只有A=1的一种条件 */
        if(con[0] == 1) {
            /* 紫色法器品质为5*/
            if(quality == 5 && con[1] == frgTypeCnt) {
                grpId = con[2];
                break;
            }
        }
    }
    return grpId;
}

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetRobAimList());
    exportProtocol.push(new CS_RobMagicStart());
    exportProtocol.push(new CS_RobMagicResult());
    exportProtocol.push(new CS_Rob5Times());
    exportProtocol.push(new CS_GetRobbedHistoryList());
    exportProtocol.push(new CS_MagicCompose());
    exportProtocol.push(new CS_UseTruceCard());
    exportProtocol.push(new CS_GetTruceTime());
    exportProtocol.push(new CS_RobOneKey());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
