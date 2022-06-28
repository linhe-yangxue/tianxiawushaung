
/**
 * 包含的头文件
 */
var packets = require('../packets/super_player');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var cfgControl = require('../../../server_config/control.json');
var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var playerDb = require('../database/player');
var packageDb = require('../database/package');
var mainUiRankDb = require('../database/main_ui_rank');
var arenaDb = require('../database/arena');
var cPlayer = require('../common/player');
var biCode = require('../../common/bi_code');
var itemType= require('../common/item_type');
var logsWater = require('../../common/logs_water');
var robot = require('../../common/robot');
var cZuid = require('../common/zuid');
var cRevelry = require('../common/revelry');
var battleType = require('../common/battle_type');
var battleMainDb = require('../database/battle_main');
var atlasDb = require('../database/atlas');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 创建超级玩家
 */
var CS_CreateSuperPlayer = (function() {

    /**
     * 构造函数
     */
    function CS_CreateSuperPlayer() {
        this.reqProtocolName = packets.pCSCreateSuperPlayer;
        this.resProtocolName = packets.pSCCreateSuperPlayer;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_CreateSuperPlayer.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_CreateSuperPlayer();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.superPlayerInfo
            || null == req.superPetInfo
            || null == req.superEquipInfo) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.superPlayerInfo
                || null == req.superPlayerInfo.name
                || null == req.superPlayerInfo.gold
                || null == req.superPlayerInfo.diamond
                || null == req.superPlayerInfo.soulPoint
                || null == req.superPlayerInfo.reputation
                || null == req.superPlayerInfo.prestige
                || null == req.superPlayerInfo.battleAchv
                || null == req.superPlayerInfo.unionContr) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.superPlayerInfo.gold = parseInt(req.superPlayerInfo.gold);
            req.superPlayerInfo.diamond = parseInt(req.superPlayerInfo.diamond);
            req.superPlayerInfo.soulPoint = parseInt(req.superPlayerInfo.soulPoint);
            req.superPlayerInfo.reputation = parseInt(req.superPlayerInfo.reputation);
            req.superPlayerInfo.prestige = parseInt(req.superPlayerInfo.prestige);
            req.superPlayerInfo.battleAchv = parseInt(req.superPlayerInfo.battleAchv);
            req.superPlayerInfo.unionContr = parseInt(req.superPlayerInfo.unionContr);

            if(isNaN(req.superPlayerInfo.gold) || isNaN(req.superPlayerInfo.diamond) || isNaN(req.superPlayerInfo.soulPoint) || isNaN(req.superPlayerInfo.reputation) || isNaN(req.superPlayerInfo.prestige) || isNaN(req.superPlayerInfo.battleAchv) || isNaN(req.superPlayerInfo.unionContr)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            for(var i = 0; i < req.superPetInfo.length; ++i) {
                if(null == req.superPetInfo[i]
                    || null == req.superPetInfo[i].teamPos
                    || null == req.superPetInfo[i].tid
                    || null == req.superPetInfo[i].level
                    || null == req.superPetInfo[i].breakLevel
                    || null == req.superPetInfo[i].skillLevel) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }

                req.superPetInfo[i].teamPos = parseInt(req.superPetInfo[i].teamPos);
                req.superPetInfo[i].tid = parseInt(req.superPetInfo[i].tid);
                req.superPetInfo[i].level = parseInt(req.superPetInfo[i].level);
                req.superPetInfo[i].breakLevel = parseInt(req.superPetInfo[i].breakLevel);

                if(isNaN(req.superPetInfo[i].teamPos) || isNaN(req.superPetInfo[i].tid) || isNaN(req.superPetInfo[i].level) || isNaN(req.superPetInfo[i].breakLevel)) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }
            }

            for(var i = 0; i < req.superEquipInfo.length; ++i) {
                if(null == req.superEquipInfo[i]
                    || null == req.superEquipInfo[i].teamPos
                    || null == req.superEquipInfo[i].tid
                    || null == req.superEquipInfo[i].strengthenLevel
                    || null == req.superEquipInfo[i].refineLevel) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }

                req.superEquipInfo[i].teamPos = parseInt(req.superEquipInfo[i].teamPos);
                req.superEquipInfo[i].tid = parseInt(req.superEquipInfo[i].tid);
                req.superEquipInfo[i].strengthenLevel = parseInt(req.superEquipInfo[i].strengthenLevel);
                req.superEquipInfo[i].refineLevel = parseInt(req.superEquipInfo[i].refineLevel);

                if(isNaN(req.superEquipInfo[i].teamPos) || isNaN(req.superEquipInfo[i].tid) || isNaN(req.superEquipInfo[i].strengthenLevel) || isNaN(req.superEquipInfo[i].refineLevel)) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 名字合法性检测 */
                function(callback) {
                    cPlayer.checkPlayerName(req.superPlayerInfo.name, callback);
                },

                /* 创建背包，添加符灵 */
                function(callback) {
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    var now = new Date();

                    /* 创建player */
                    var player = new globalObject.Player();
                    /* player属性 */
                    player.name =  req.superPlayerInfo.name;
                    player.gold = req.superPlayerInfo.gold;
                    player.diamond = req.superPlayerInfo.diamond;
                    player.soulPoint = req.superPlayerInfo.soulPoint;
                    player.reputation = req.superPlayerInfo.reputation;
                    player.prestige = req.superPlayerInfo.prestige;
                    player.battleAchv = req.superPlayerInfo.battleAchv;
                    player.unionContr = req.superPlayerInfo.unionContr;
                    /* 主角属性 */
                    player.character.tid = req.chaModelIndex;
                    var character = null;
                    for(var i = 0; i < req.superPetInfo.length; ++i) {
                        if(0 == req.superPetInfo[i].teamPos) {
                            character = req.superPetInfo[i];
                            break;
                        }
                    }
                    if(null == character) {
                        callback(retCode.NO_CHARACTER_INFO);
                        return
                    }
                    var aoLine = csvManager.ActiveObject()[character.tid];
                    if(!aoLine || aoLine.CLASS !== "CHAR") {
                        callback(retCode.WRONG_CHARACTER_ID);
                        return
                    }
                    player.character.tid = character.tid;
                    player.character.level = character.level;
                    player.character.breakLevel = character.breakLevel;
                    player.character.skillLevel = character.skillLevel;

                    player.skin.push(player.character.tid);
                    player.createDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

                    /* 创角角色和背包数组 */
                    var playerAndPackages = [];
                    playerAndPackages[0] = player;
                    for (var i = 1; i <= 7; ++i) {
                        playerAndPackages[i] = new globalObject.Package(i);
                    }

                    /* 填充符灵背包 */
                    var petPkg = playerAndPackages[globalObject.PACKAGE_TYPE_PET];
                    var petPos = [];
                    for(var i = 0; i < req.superPetInfo.length; ++i) {
                        var petInfo = req.superPetInfo[i];
                        if(petInfo.teamPos == 0) {
                            continue;
                        }

                        if(petInfo.teamPos >= 1 && petInfo.teamPos <= 3 && petPos.indexOf(petInfo.teamPos) == -1) {
                            petPos.push(petInfo.teamPos);
                            var aoLine = csvManager.ActiveObject()[petInfo.tid];
                            if(!aoLine || aoLine.CLASS !== 'PET') {
                                callback(retCode.WRONG_PET_ID);
                                return
                            }

                            var pet = new globalObject.ItemPet();
                            pet.teamPos = petInfo.teamPos;
                            pet.tid = petInfo.tid;
                            pet.level = petInfo.level;
                            pet.breakLevel = petInfo.breakLevel;
                            pet.skillLevel = petInfo.skillLevel;
                            pet.itemId = petPkg.itemIdSerial;
                            pet.itemNum = 1;
                            petPkg.itemIdSerial += 1;
                            petPkg.content.push(pet);
                        }
                    }

                    /* 符灵图鉴 */
                    atlasDb.saveAtlas(req.zid, req.zuid, petPkg.content);

                    /* 填充装备和法器背包 */
                    var eqpPkg = playerAndPackages[globalObject.PACKAGE_TYPE_EQUIP];
                    var mgcPkg = playerAndPackages[globalObject.PACKAGE_TYPE_MAGIC];
                    var emPos = [[],[],[],[],[],[],[],[]];
                    for(var i = 0; i < req.superEquipInfo.length; ++i) {
                        var emInfo = req.superEquipInfo[i];
                        var recLine = csvManager.RoleEquipConfig()[emInfo.tid];
                        if(!recLine) {
                            callback(retCode.WRONG_EQUIP_ID);
                            return;
                        }
                        
                        var slotId = cPackage.getSlotId(emInfo.tid);
                        var em, emPkg;
                        if(slotId >= globalObject.SLOT_TYPE_WEAPON && slotId <= globalObject.SLOT_TYPE_ARMOR_TWO
                            && emPos[slotId].indexOf(emInfo.teamPos) == -1) {
                            em = new globalObject.ItemEquip();
                            emPkg = eqpPkg;
                        }
                        else if(slotId >= globalObject.SLOT_TYPE_MAGIC_ONE && slotId <= globalObject.SLOT_TYPE_MAGIC_TWO
                            && emPos[slotId].indexOf(emInfo.teamPos) == -1) {
                            em = new globalObject.ItemMagic();
                            emPkg = mgcPkg;
                        }
                        else {
                            continue;
                        }

                        emPos[slotId].push(emInfo.teamPos);
                        em.teamPos = emInfo.teamPos;
                        em.tid= emInfo.tid;
                        em.strengthenLevel = emInfo.strengthenLevel;
                        em.refineLevel = emInfo.refineLevel;
                        em.itemId = emPkg.itemIdSerial;
                        em.itemNum = 1;
                        emPkg.itemIdSerial += 1;
                        emPkg.content.push(em);
                    }

                    packageDb.savePlayerAndPackages(req.zid, req.zuid, playerAndPackages, false, callback);

                    /* 加入主界面等级、战斗力排行榜 */
                    mainUiRankDb.updateLevelRanklist(req.zid, req.zuid, player.character.level, parseInt(now.getTime()/1000));
                    mainUiRankDb.updatePowerRanklist(req.zid, req.zuid, player.power, parseInt(now.getTime()/1000));
                    accountDb.addZoneMemCnt(preZid);
                    playerDb.addZuidInZone(req.zid, req.zuid);
                },

                /* 名字唯一性检测 */
                function(callback) {
                    playerDb.bindNameWithZuid(req.zid, req.superPlayerInfo.name, req.zuid, callback);
                },

                /* 赠送默认物品 */
                function(callback) {
                    var arrAdd = [];
                    var bsTable = csvManager.BeginnerSend();

                    for(var i in bsTable) {
                        var item = new globalObject.ItemBase();
                        var attrs = bsTable[i].PROPS.split('#');
                        item.tid = attrs[0];
                        item.itemNum = attrs[1];
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd,  req.channel, req.acc, logsWater.BEGINNER_SEND, '', function (err) {
                        callback(err);
                    });
                },

                /* 主线通关 */
                function(callback) {
                    var today = (new Date()).toDateString();
                    var scTable = csvManager.StageConfig();
                    for(var index in scTable) {
                        var scLine = scTable[index];
                        if(scLine.TYPE == battleType.BATTLE_MAIN_1 && scLine.INDEX <= req.stageId) {
                            var battle = new globalObject.Battle();
                            battle.battleId = scLine.INDEX;
                            battle.successCount = 1;
                            battle.fightCount = 1;
                            battle.bestRate = 3;
                            battle.firstChallenge = 0;
                            battle.lastDay = today;
                            battleMainDb.updateBattleMainMap(req.zid, req.zuid, battle, function () {
                            });
                        }
                    }

                    setTimeout(function() { callback(null); }, 100);
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
    return CS_CreateSuperPlayer;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    if(cfgControl.cheatProtocal) {
        exportProtocol.push(new CS_CreateSuperPlayer());
    }
    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
