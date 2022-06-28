
/**
 * 包含的头文件
 */
var async = require('async');
var globalObject = require('../../common/global_object');
var retCode = require('../../common/ret_code');
var packageDb = require('../database/package');
var playerDb = require('../database/player');
var robMagic = require('../database/rob_magic');
var attrType = require('../common/attribute_type');
var itemType = require('../common/item_type');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var protocolObject = require('../../common/protocol_object');
var cMission = require('../common/mission');
var cRevelry = require('../common/revelry');
var mainUiRankDb = require('../database/main_ui_rank');
var atlasDb = require('../database/atlas');
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');
var costEventDb = require('../database/cost_event');
var cZuid = require('../common/zuid');
var wallPaperDb = require('../database/wallPaper');
var flashSaleComm = require('../common/flash_sale');

const PACKAGE_MAX_OVER_LAY = 999999; /* 背包物品叠加上限 */

const goldLimit = 999999999; /* 硬币上限 */
const diamondLimit = 999999999; /* 元宝上限 */
const staminaLimit = 9999999; /* 体力上限 */
const soulPointLimit = 9999999; /* 符魂上限 */
const spiritLimit = 9999999; /* 精力上限 */
const reputationLimit = 9999999; /* 声望上限 */
const prestigeLimit = 9999999; /* 威名上限 */
const battleAchvLimit = 9999999; /* 战功上限 */
const unionContrLimit = 9999999; /* 公会贡献上限 */
const beatDemonCardLimit = 9999999; /* 降魔令上限 */
const characterLevelLimit = 120; /* 主角等级上限 */
const expLimit = 999999999; /* 经验上限 */

const staminaUp = 100; /* 体力自然恢复上限 */
const spiritUp = 30; /* 精力自然恢复上限 */
const beatDemonCardUp = 10; /* 降魔令自然恢复上限 */

/**------------------------------------------以下代码脚本生成，请勿修改-----------------------------------------------*/
function addGold(player, n) {
    if(player && n > 0 && n <= goldLimit) {
        player.gold += n;
        if(player.gold > goldLimit) player.gold = goldLimit;
    }
}

function enoughGold(player, n) {
    return (player && player.gold >= n);
}

function subtractGold(player, n) {
    if(player && n > 0 && player.gold >= n) {
        player.gold -= n;

        return true;
    }
    return false;
}


function addDiamond(player, n) {
    if(player && n > 0 && n <= diamondLimit) {
        player.diamond += n;
        if(player.diamond > diamondLimit) player.diamond = diamondLimit;
    }
}

function enoughDiamond(player, n) {
    return (player && player.diamond >= n);
}

function subtractDiamond(player, n) {
    if(player && n > 0 && player.diamond >= n) {
        player.diamond -= n;
        return true;
    }
    return false;
}


function addStamina(player, n) {
    if(player && n > 0 && n <= staminaLimit) {
        player.stamina += n;
        if(player.stamina > staminaLimit) player.stamina = staminaLimit;
    }
}

function enoughStamina(player, n) {
    return (player && player.stamina >= n);
}

function subtractStamina(player, n) {
    if(player && n > 0 && player.stamina >= n) {
        if(player.stamina >= staminaUp && player.stamina - n < staminaUp) {
            player.staminaStamp = parseInt(Date.now() / 1000);
        }
        player.stamina -= n;
        return true;
    }
    return false;
}


function addSoulPoint(player, n) {
    if(player && n > 0 && n <= soulPointLimit) {
        player.soulPoint += n;
        if(player.soulPoint > soulPointLimit) player.soulPoint = soulPointLimit;
    }
}

function enoughSoulPoint(player, n) {
    return (player && player.soulPoint >= n);
}

function subtractSoulPoint(player, n) {
    if(player && n > 0 && player.soulPoint >= n) {
        player.soulPoint -= n;
        return true;
    }
    return false;
}


function addSpirit(player, n) {
    if(player && n > 0 && n <= spiritLimit) {
        player.spirit += n;
        if(player.spirit > spiritLimit) player.spirit = spiritLimit;
    }
}

function enoughSpirit(player, n) {
    return (player && player.spirit >= n);
}

function subtractSpirit(player, n) {
    if(player && n > 0 && player.spirit >= n) {
        if(player.spirit >= spiritUp && player.spirit - n < spiritUp) {
            player.spiritStamp = parseInt(Date.now() / 1000);
        }
        player.spirit -= n;
        return true;
    }
    return false;
}


function addReputation(player, n) {
    if(player && n > 0 && n <= reputationLimit) {
        player.reputation += n;
        if(player.reputation > reputationLimit) player.reputation = reputationLimit;
    }
}

function enoughReputation(player, n) {
    return (player && player.reputation >= n);
}

function subtractReputation(player, n) {
    if(player && n > 0 && player.reputation >= n) {
        player.reputation -= n;
        return true;
    }
    return false;
}


function addPrestige(player, n) {
    if(player && n > 0 && n <= prestigeLimit) {
        player.prestige += n;
        if(player.prestige > prestigeLimit) player.prestige = prestigeLimit;
    }
}

function enoughPrestige(player, n) {
    return (player && player.prestige >= n);
}

function subtractPrestige(player, n) {
    if(player && n > 0 && player.prestige >= n) {
        player.prestige -= n;
        return true;
    }
    return false;
}


function addBattleAchv(player, n) {
    if(player && n > 0 && n <= battleAchvLimit) {
        player.battleAchv += n;
        if(player.battleAchv > battleAchvLimit) player.battleAchv = battleAchvLimit;
    }
}

function enoughBattleAchv(player, n) {
    return (player && player.battleAchv >= n);
}

function subtractBattleAchv(player, n) {
    if(player && n > 0 && player.battleAchv >= n) {
        player.battleAchv -= n;
        return true;
    }
    return false;
}


function addUnionContr(player, n) {
    if(player && n > 0 && n <= unionContrLimit) {
        player.unionContr += n;
        if(player.unionContr > unionContrLimit) player.unionContr = unionContrLimit;
    }
}

function enoughUnionContr(player, n) {
    return (player && player.unionContr >= n);
}

function subtractUnionContr(player, n) {
    if(player && n > 0 && player.unionContr >= n) {
        player.unionContr -= n;
        return true;
    }
    return false;
}


function addBeatDemonCard(player, n) {
    if(player && n > 0 && n <= beatDemonCardLimit) {
        player.beatDemonCard += n;
        if(player.beatDemonCard > beatDemonCardLimit) player.beatDemonCard = beatDemonCardLimit;
    }
}

function enoughBeatDemonCard(player, n) {
    return (player && player.beatDemonCard >= n);
}

function subtractBeatDemonCard(player, n) {
    if(player && n > 0 && player.beatDemonCard >= n) {
        if(player.beatDemonCard >= beatDemonCardUp && player.beatDemonCard - n < beatDemonCardUp) {
            player.beatDemonCardStamp = parseInt(Date.now() / 1000);
        }
        player.beatDemonCard -= n;
        return true;
    }
    return false;
}
/**------------------------------------------以上代码脚本生成，请勿修改-----------------------------------------------*/


function addExp(zid, zuid, player, n) {
    if(player && player.character && n > 0 && n <= expLimit) {
        player.character.exp += n;
        if(player.character.exp > expLimit) player.character.exp = expLimit;
    }

    updateLevel(zid, zuid, player);
}

function updateLevel(zid, zuid, player) {

    var levelList = csvManager.CharacterLevelExp();
    var isLevelUp = false;
    if(player && player.character) {
        while(player.character.level >= 1 &&  player.character.level < characterLevelLimit
        && player.character.exp >= levelList[player.character.level].LEVEL_EXP) {

            /* 升级回复体力和经验 */
            player.stamina += levelList[player.character.level].LABOR;
            player.spirit += levelList[player.character.level].ENERGY;

            player.character.exp -= levelList[player.character.level].LEVEL_EXP;
            ++ player.character.level;
            isLevelUp = true;
        }
    }
    if(isLevelUp) {
        var lvl = player.character.level;
        /* 更新主界面等级排行榜 */
        mainUiRankDb.updateLevelRanklist(zid, zuid, lvl, parseInt(Date.now()/1000));
        /* 更新任务 */
        cMission.onCharacterLevelUp(zid, zuid, lvl, function() {
            cMission.updateDailyTask(zid, zuid, cMission.TASK_TYPE_10, 0, lvl);
            cMission.updateAchieveTask(zid, zuid, cMission.TASK_TYPE_10, 0, 0, lvl);
        });
        /* 更新七日狂欢 */
        cRevelry.updateRevelryProgress(zid, zuid, 3, lvl);
        /* 更新限时抢购 */
        flashSaleComm.updateFlashSale(zid, zuid, 0);
    }
}
/**
 * 根据背包id和vip等级获取对应背包的上限
 * @param id
 * @param configData
 * @param level
 * @returns {number}
 */
var getPackageLimit = function(id,configData,level) {
    var maxNum = 0;
    switch(id) {
        case globalObject.PACKAGE_TYPE_PET:
            maxNum = configData[level].PET_BAG_NUM;
            break;
        case globalObject.PACKAGE_TYPE_EQUIP:
            maxNum = configData[level].EQUIP_BAG_NUM;
            break;
        case globalObject.PACKAGE_TYPE_MAGIC:
            maxNum = configData[level].MAGIC_BAG_NUM;
            break;
        default:
            maxNum = 500;
            break;
    }
    return maxNum;
};
/**
 *根据物品tid获取它的背包Id
 */
var getPkgId = function (tid) {
    if(tid >= 2000001 && tid < 3000000) {
        return globalObject.PACKAGE_TYPE_CONSUME_ITEM;
    }

    if(tid >= 14001 && tid < 15000) {
        return globalObject.PACKAGE_TYPE_EQUIP;
    }

    if(tid >= 15001 && tid < 16000) {
        return globalObject.PACKAGE_TYPE_MAGIC;
    }

    if(tid >= 16001 && tid < 17000) {
        return globalObject.PACKAGE_TYPE_EQUIP_FRAGMENT;
    }

    if(tid >= 17001 && tid < 18000) {
        return globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT;
    }

    if(tid >= 30001 && tid < 40000) {
        return globalObject.PACKAGE_TYPE_PET;
    }

    if(tid >= 40001 && tid < 50000) {
        return globalObject.PACKAGE_TYPE_PET_FRAGMENT;
    }

    return globalObject.PACKAGE_TYPE_ERR;
};
exports.getPkgId = getPkgId;

/**
 * 根据物品tid获取它的槽Id
 */
var getSlotId = function(tid) {
    switch(parseInt(tid / 100)) {
        case 140:
            return globalObject.SLOT_TYPE_WEAPON;
        case 141:
            return globalObject.SLOT_TYPE_JEWELRY;
        case 142:
            return globalObject.SLOT_TYPE_ARMOR_ONE;
        case 143:
            return globalObject.SLOT_TYPE_ARMOR_TWO;
        case 150:
            return globalObject.SLOT_TYPE_MAGIC_ONE;
        case 151:
            return globalObject.SLOT_TYPE_MAGIC_TWO;
        default:
            if(tid >= 30001 && tid < 40000) {
                return globalObject.SLOT_TYPE_PET;
            }
            else {
                return globalObject.SLOT_TYPE_ERR;
            }
    }
};
exports.getSlotId = getSlotId;


/**
 * 新建物品，并放入背包
 */
var AddNewItem = function(pkg, tid, itemNum) {
    var pkgId = getPkgId(tid);
    var item = null;
    switch (pkgId) {
        case globalObject.PACKAGE_TYPE_PET:
            item = new globalObject.ItemPet();
            break;

        case globalObject.PACKAGE_TYPE_PET_FRAGMENT:
            item = new globalObject.FragmentPet();
            break;

        case globalObject.PACKAGE_TYPE_EQUIP:
            item = new globalObject.ItemEquip();
            break;

        case globalObject.PACKAGE_TYPE_EQUIP_FRAGMENT:
            item = new globalObject.FragmentEquip();
            break;

        case globalObject.PACKAGE_TYPE_MAGIC:
            item = new globalObject.ItemMagic();
            break;

        case globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT:
            item = new globalObject.FragmentMagic();
            break;

        case globalObject.PACKAGE_TYPE_CONSUME_ITEM:
            item = new globalObject.ItemConsume();
            break;
    }

    item.itemId = pkg.itemIdSerial;
    item.itemNum = itemNum;
    item.tid = tid;
    pkg.content.push(item);
    pkg.itemIdSerial += 1;

    var itemBase = new globalObject.ItemBase;
    itemBase.itemId = item.itemId;
    itemBase.itemNum = item.itemNum;
    itemBase.tid = item.tid;

    return itemBase;
};
exports.AddNewItem = AddNewItem;

/**
 * 获取背包叠加性质
 */
var getOverLay = function(pkgId) {
    switch(pkgId) {
        case globalObject.PACKAGE_TYPE_CONSUME_ITEM:
        case globalObject.PACKAGE_TYPE_EQUIP_FRAGMENT:
        case globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT:
        case globalObject.PACKAGE_TYPE_PET_FRAGMENT:
            return true;
        default:
            return false;
    }
};
exports.getOverLay = getOverLay;

/**
 *
 * @param pkg 背包对象
 * @param itemId 物品ID
 * @returns 物品对象
 */
var getItemByItemId = function(pkg, itemId) {
    for(var i = 0; i < pkg.content.length; ++i) {
        if(pkg.content[i].itemId == itemId) {
            return pkg.content[i];
        }
    }
    return null;
};
exports.getItemByItemId = getItemByItemId;

/**
 *
 * @param pkg 背包对象
 * @param teamPos 队伍位置
 * @param slotId  槽Id
 * @returns 物品对象
 */
var getItemByTeamPosAndSlotId = function(pkg, teamPos, slotId) {
    for(var i = 0; i < pkg.content.length; ++i) {
        if(pkg.content[i].teamPos == teamPos && getSlotId(pkg.content[i].tid) == slotId) {
            return pkg.content[i];
        }
    }
    return null;
};
exports.getItemByTeamPosAndSlotId = getItemByTeamPosAndSlotId;

/**
 * 更新物品函数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param itemArr [arr] 参数代表准备查询道具的 ItemObject 数组
 * @param callback [int] 错误码(retCode)
 * @returns []
 */
var checkItemNum = function(zid, zuid, itemArr, callback) {

    async.waterfall([
        /* 从redis读取player和背包 */
        function(wcb) {
            packageDb.getPlayerAndPackages(zid, zuid, false, wcb);
        },

        /* 主要逻辑 */
        function(playerAndPackages, wcb) {

            var player = playerAndPackages[0];
            recoverAttr(player);

            /* 检查物品是否足够 */
            for (var i = 0; i < itemArr.length; ++i) {
/**------------------------------------------以下代码脚本生成，请勿修改-----------------------------------------------*/
                if (itemArr[i].tid == itemType.ITEM_TYPE_GOLD) {
                    if (!enoughGold(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_GOLD);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_DIAMOND) {
                    if (!enoughDiamond(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_DIAMOND);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_STAMINA) {
                    if (!enoughStamina(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_STAMINA);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_SOULPOINT) {
                    if (!enoughSoulPoint(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_SOULPOINT);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_SPIRIT) {
                    if (!enoughSpirit(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_SPIRIT);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_REPUTATION) {
                    if (!enoughReputation(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_REPUTATION);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_PRESTIGE) {
                    if (!enoughPrestige(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_PRESTIGE);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_BATTLEACHV) {
                    if (!enoughBattleAchv(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_BATTLEACHV);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_UNIONCONTR) {
                    if (!enoughUnionContr(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_UNIONCONTR);
                        return;
                    }
                    continue;
                }

                if (itemArr[i].tid == itemType.ITEM_TYPE_BEATDEMONCARD) {
                    if (!enoughBeatDemonCard(player, itemArr[i].itemNum)) {
                        wcb(retCode.LACK_OF_BEATDEMONCARD);
                        return;
                    }
                    continue;
                }
/**------------------------------------------以上代码脚本生成，请勿修改-----------------------------------------------*/

                /* 物品 */
                var pkgId = getPkgId(itemArr[i].tid);
                if (pkgId == globalObject.PACKAGE_TYPE_ERR) {
                    wcb(retCode.NO_MATCH_PACKAGE);
                    return;
                }

                var flag = false;
                /* 物品是否充足的标志位 */
                var pkg = playerAndPackages[pkgId];
                for (var j = 0; j < pkg.content.length; ++j) {
                    if (pkg.content[j].tid == itemArr[i].tid
                        && pkg.content[j].itemId == itemArr[i].itemId) {
                        if (pkg.content[j].itemNum >= itemArr[i].itemNum) {
                            flag = true;
                            break;
                        }
                    }
                }

                if (!flag) {
                    wcb(retCode.LACK_OF_ITEM);
                    return;
                }
            }

            wcb(null);
        }
    ], callback);
};

/**
 * 合并相同的物品(已优化)
 * @param items [array] 物品数组
 * @returns [array]
 */
var mergeItems = function(items) {
    var mp = {};
    for(var i = 0; i < items.length; ++i) {
        var key = items[i].itemId + ':' + items[i].tid;
        var value = items[i].itemNum;

        if(undefined == mp[key]) {
            mp[key] = parseInt(value);
        }
        else {
            mp[key] += parseInt(value);
        }
    }

    items = [];
    for(key in mp) {
        var item = new globalObject.ItemBase();
        item.itemId = parseInt(key.split(':')[0]);
        item.tid = parseInt(key.split(':')[1]);
        item.itemNum = mp[key];

        if(item.tid === 0) {
            continue;
        }

        if(item.itemNum > 0) {
            items.push(item);
        }
    }

    return items;
};
exports.mergeItems = mergeItems;

/**
 * 恢复属性
 * @param player
 */
var recoverAttr = function(player) {
    var now = parseInt(Date.now() / 1000);

    /* 体力6分钟恢复一点 */
    const STAMINA_RECOVER = 360;
    var rcvStamina = parseInt((now - player.staminaStamp) / STAMINA_RECOVER);
    if(player.stamina < staminaUp) {
        if(player.stamina + rcvStamina >= staminaUp) {
            player.stamina = staminaUp;
        }
        else {
            player.stamina += rcvStamina;
        }
    }
    player.staminaStamp += rcvStamina * STAMINA_RECOVER;

    /* 精力30分钟恢复一点 */
    const SPIRIT_RECOVER = 1800;
    var rcvSpirit = parseInt((now - player.spiritStamp) / SPIRIT_RECOVER);
    if(player.spirit < spiritUp) {
        if(player.spirit + rcvSpirit >= spiritUp) {
            player.spirit = spiritUp;
        }
        else {
            player.spirit += rcvSpirit;
        }
    }
    player.spiritStamp += rcvSpirit * SPIRIT_RECOVER;

    /* 降魔令60分钟恢复一点 */
    const BEATDEMONCARD_RECOVER = 3600;
    var rcvBeatDemonCard = parseInt((now - player.beatDemonCardStamp) / BEATDEMONCARD_RECOVER);
    if(player.beatDemonCard < beatDemonCardUp) {
        if(player.beatDemonCard + rcvBeatDemonCard >= beatDemonCardUp) {
            player.beatDemonCard = beatDemonCardUp;
        }
        else {
            player.beatDemonCard += rcvBeatDemonCard;
        }
    }
    player.beatDemonCardStamp += rcvBeatDemonCard * BEATDEMONCARD_RECOVER;
};
exports.recoverAttr = recoverAttr;

/**
 * 更新物品函数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param arrSub [arr] 准备删除物品的 ItemBase 数组
 * @param arrAdd [arr] 准备添加物品的 ItemBase 数组
 * @param callback [function] 返回错误码[int]、删除物品删除前的ItemBase数组、
 * 添加物品添加后的ItemBase数组、主角等级[int]、玩家vip等级、物品变化ItemLog数组
 */
var updateItem = function(zid, zuid, arrSub, arrAdd, callback) {
    var retAdd = [];
    var retSub = [];
    var addPets = [];
    var itemLogArr = [];
    var vipList = csvManager.Viplist();
    arrSub = mergeItems(arrSub);
    arrAdd = mergeItems(arrAdd);

    async.waterfall([
        /* 从redis读取player和背包 */
        function(wcb) {
            packageDb.getPlayerAndPackages(zid, zuid, true, wcb);
        },

        /* 主要逻辑 */
        function(playerAndPackages, wcb) {
            var i, j;
            var player = playerAndPackages[0];
            recoverAttr(player);

            /* 检查需要扣除的物品是否足够 */
            for(i = 0; i < arrSub.length; ++i) {

/**------------------------------------------以下代码脚本生成，请勿修改-----------------------------------------------*/
                if(arrSub[i].tid == itemType.ITEM_TYPE_GOLD) {
                    if(!enoughGold(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_GOLD);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_DIAMOND) {
                    if(!enoughDiamond(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_DIAMOND);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_STAMINA) {
                    if(!enoughStamina(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_STAMINA);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_SOULPOINT) {
                    if(!enoughSoulPoint(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_SOULPOINT);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_SPIRIT) {
                    if(!enoughSpirit(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_SPIRIT);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_REPUTATION) {
                    if(!enoughReputation(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_REPUTATION);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_PRESTIGE) {
                    if(!enoughPrestige(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_PRESTIGE);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_BATTLEACHV) {
                    if(!enoughBattleAchv(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_BATTLEACHV);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_UNIONCONTR) {
                    if(!enoughUnionContr(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_UNIONCONTR);
                        return;
                    }
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_BEATDEMONCARD) {
                    if(!enoughBeatDemonCard(player, arrSub[i].itemNum)) {
                        wcb(retCode.LACK_OF_BEATDEMONCARD);
                        return;
                    }
                    continue;
                }
/**------------------------------------------以上代码脚本生成，请勿修改-----------------------------------------------*/

                /* 物品 */
                var pkgId = getPkgId(arrSub[i].tid);
                if(pkgId == globalObject.PACKAGE_TYPE_ERR) {
                    wcb(retCode.NO_MATCH_PACKAGE);
                    return;
                }

                var itemInPackage = null;
                var pkg = playerAndPackages[pkgId];
                for(j = 0; j < pkg.content.length; ++j) {
                    if(pkg.content[j].tid == arrSub[i].tid
                        && pkg.content[j].itemId == arrSub[i].itemId) {
                        itemInPackage = pkg.content[j];
                        break;
                    }
                }

                if(null == itemInPackage) {
                    wcb(retCode.LACK_OF_ITEM);
                    return;
                }

                /* 物品数量检查 */
                if(!(itemInPackage.itemNum >= arrSub[i].itemNum)) {
                    wcb(retCode.LACK_OF_ITEM);
                    return;
                }

                /* 寻仙中符灵不能扣除 */
                if(pkgId == globalObject.PACKAGE_TYPE_PET
                    && itemInPackage.inFairyland) {
                    wcb(retCode.PET_IN_FAIRYLAND);
                    return;
                }
            }

            /* 检查需要添加的物品是否在配表中, 检查背包是否已满 */
            for(i = 0; i < arrAdd.length; ++i) {
                /* 检查物品tid */
                if(arrAdd[i].tid >= itemType.ITEM_TYPE_DIAMOND && arrAdd[i].tid <= itemType.ITEM_TYPE_EXP) {
                    continue;
                }

                if(!csvExtendManager.CheckTidForPackage(arrAdd[i].tid)) {
                    wcb(retCode.ILLEGAL_TID_FOR_PACKAGE);
                    return;
                }

                if(globalObject.PACKAGE_TYPE_ERR == getPkgId(arrAdd[i].tid)) {
                    wcb(retCode.ILLEGAL_TID_FOR_PACKAGE);
                    return;
                }

                /* 检查背包上限 */
                var pkgId = getPkgId(arrAdd[i].tid);
                var packageMaxNum = getPackageLimit(pkgId, vipList, player.vipLevel);
                if(playerAndPackages[pkgId].content.length < packageMaxNum) {
                    continue;
                }

                /* 可堆叠物品检查 */
                var exSameTid = false;
                if(getOverLay(pkgId)) {
                    var items = playerAndPackages[pkgId].content;
                    for(j = 0; j < items.length; ++j) {
                        if(items[j].tid == arrAdd[i].tid) {
                            exSameTid = true;
                            break;
                        }
                    }
                }

                if(!exSameTid) {
                    wcb(retCode.PACKAGE_FULL);
                    return;
                }
            }

            /* 扣除arrSubtract中的物品 */
            for(i = 0; i < arrSub.length; ++i) {

/**------------------------------------------以下代码脚本生成，请勿修改-----------------------------------------------*/
                if(arrSub[i].tid == itemType.ITEM_TYPE_GOLD) {
                    /** 硬币改变前数量  player.gold */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_GOLD;
                    itemLog.beforeNum = player.gold;

                    /* 扣除硬币 */
                    subtractGold(player, arrSub[i].itemNum);

                    /** 硬币改变前数量  player.gold */
                    itemLog.afterNum = player.gold;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_DIAMOND) {
                    /** 元宝改变前数量  player.diamond */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_DIAMOND;
                    itemLog.beforeNum = player.diamond;

                    /* 扣除元宝 */
                    subtractDiamond(player, arrSub[i].itemNum);

                    /** 元宝改变前数量  player.diamond */
                    itemLog.afterNum = player.diamond;
                    itemLogArr.push(itemLog);
                    /* 消费返利 */
                    costEventDb.addCostDimNum(zid, zuid, arrSub[i].itemNum);
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_STAMINA) {
                    subtractStamina(player, arrSub[i].itemNum);
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_SOULPOINT) {
                    /** 符魂改变前数量  player.soulPoint */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_SOULPOINT;
                    itemLog.beforeNum = player.soulPoint;

                    /* 扣除符魂 */
                    subtractSoulPoint(player, arrSub[i].itemNum);

                    /** 符魂改变后数量  player.soulPoint */
                    itemLog.afterNum = player.soulPoint;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_SPIRIT) {
                    subtractSpirit(player, arrSub[i].itemNum);
                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_REPUTATION) {
                    /** 声望改变前数量  player.reputation */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_REPUTATION;
                    itemLog.beforeNum = player.reputation;

                    /* 扣除声望 */
                    subtractReputation(player, arrSub[i].itemNum);

                    /** 声望改变后数量  player.reputation */
                    itemLog.afterNum = player.reputation;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_PRESTIGE) {
                    /** 威名改变前数量  player.prestige */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_PRESTIGE;
                    itemLog.beforeNum = player.prestige;

                    /* 扣除威名 */
                    subtractPrestige(player, arrSub[i].itemNum);

                    /** 威名改变后数量  player.prestige */
                    itemLog.afterNum = player.prestige;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_BATTLEACHV) {
                    /** 战功改变前数量  player.battleAchv */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_BATTLEACHV;
                    itemLog.beforeNum = player.battleAchv;

                    /* 扣除战功 */
                    subtractBattleAchv(player, arrSub[i].itemNum);

                    /** 战功改变后数量  player.battleAchv */
                    itemLog.afterNum = player.battleAchv;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_UNIONCONTR) {
                    /** 公会贡献改变前数量  player.unionContr */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_UNIONCONTR;
                    itemLog.beforeNum = player.unionContr;

                    /* 扣除公会贡献 */
                    subtractUnionContr(player, arrSub[i].itemNum);

                    /** 公会贡献改变后数量  player.unionContr */
                    itemLog.afterNum = player.unionContr;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrSub[i].tid == itemType.ITEM_TYPE_BEATDEMONCARD) {
                    subtractBeatDemonCard(player, arrSub[i].itemNum);
                    continue;
                }
/**------------------------------------------以上代码脚本生成，请勿修改-----------------------------------------------*/

                var pkgId = getPkgId(arrSub[i].tid);
                var pkg = playerAndPackages[pkgId];
                for(j = 0; j < pkg.content.length; ++j) {
                    if(pkg.content[j].tid == arrSub[i].tid
                        && pkg.content[j].itemId == arrSub[i].itemId) {

                        /** 物品pkg.content[j]改变前数量  pkg.content[j].itemNum */
                        var itemLog = new globalObject.ItemLog();
                        itemLog.itemId = pkg.content[j].itemId;
                        itemLog.tid = pkg.content[j].tid;
                        itemLog.beforeNum = pkg.content[j].itemNum;

                        /* 物品扣除 */
                        pkg.content[j].itemNum -= arrSub[i].itemNum;

                        /** 物品pkg.content[j]改变后数量  pkg.content[j].itemNum*/
                        itemLog.afterNum = pkg.content[j].itemNum;
                        itemLogArr.push(itemLog);

                        /* 更新返回数组 */
                        var itemBase = new globalObject.ItemBase();
                        itemBase.itemId = pkg.content[j].itemId;
                        itemBase.tid = pkg.content[j].tid;
                        itemBase.itemNum = pkg.content[j].itemNum;
                        retSub.push(itemBase);

                        /* 物品数量等于零时，删除物品 */
                        if(pkg.content[j].itemNum == 0) {
                            pkg.content.splice(j, 1);
                        }

                        break;
                    }
                }
            }

            /* 添加arrAdd中的物品 */
            for(i = 0; i < arrAdd.length; ++i) {

/**------------------------------------------以下代码脚本生成，请勿修改-----------------------------------------------*/
                if(arrAdd[i].tid == itemType.ITEM_TYPE_GOLD) {
                    /** 硬币改变前数量  player.gold */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_GOLD;
                    itemLog.beforeNum = player.gold;

                    /* 添加硬币 */
                    addGold(player, arrAdd[i].itemNum);

                    /** 硬币改变后数量  player.gold */
                    itemLog.afterNum = player.gold;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_DIAMOND) {
                    /** 元宝改变前数量  player.diamond */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_DIAMOND;
                    itemLog.beforeNum = player.diamond;

                    /* 添加元宝 */
                    addDiamond(player, arrAdd[i].itemNum);

                    /** 元宝改变后数量  player.diamond */
                    itemLog.afterNum = player.diamond;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_STAMINA) {
                    addStamina(player, arrAdd[i].itemNum);
                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_SOULPOINT) {
                    /** 符魂改变前数量  player.soulPoint */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_SOULPOINT;
                    itemLog.beforeNum = player.soulPoint;

                    /* 添加符魂 */
                    addSoulPoint(player, arrAdd[i].itemNum);

                    /** 符魂改变后数量  player.soulPoint */
                    itemLog.afterNum = player.soulPoint;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_SPIRIT) {
                    addSpirit(player, arrAdd[i].itemNum);
                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_REPUTATION) {
                    /** 声望改变前数量  player.reputation */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_REPUTATION;
                    itemLog.beforeNum = player.reputation;

                    /* 添加声望 */
                    addReputation(player, arrAdd[i].itemNum);

                    /** 声望改变后数量  player.reputation */
                    itemLog.afterNum = player.reputation;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_PRESTIGE) {
                    /** 威名改变前数量  player.prestige */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_PRESTIGE;
                    itemLog.beforeNum = player.prestige;

                    /* 添加威名 */
                    addPrestige(player, arrAdd[i].itemNum);

                    /** 威名改变后数量  player.prestige */
                    itemLog.afterNum = player.prestige;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_BATTLEACHV) {
                    /** 战功改变前数量  player.battleAchv */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_BATTLEACHV;
                    itemLog.beforeNum = player.battleAchv;

                    /* 添加战功 */
                    addBattleAchv(player, arrAdd[i].itemNum);

                    /** 战功改变后数量  player.battleAchv */
                    itemLog.afterNum = player.battleAchv;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_UNIONCONTR) {
                    /** 公会贡献改变前数量  player.unionContr */
                    var itemLog = new globalObject.ItemLog();
                    itemLog.tid = itemType.ITEM_TYPE_UNIONCONTR;
                    itemLog.beforeNum = player.unionContr;

                    /* 添加公会贡献 */
                    addUnionContr(player, arrAdd[i].itemNum);

                    /** 公会贡献改变后数量  player.unionContr */
                    itemLog.afterNum = player.unionContr;
                    itemLogArr.push(itemLog);

                    continue;
                }

                if(arrAdd[i].tid == itemType.ITEM_TYPE_BEATDEMONCARD) {
                    addBeatDemonCard(player, arrAdd[i].itemNum);
                    continue;
                }
/**------------------------------------------以上代码脚本生成，请勿修改-----------------------------------------------*/

                /* 加经验 */
                if(arrAdd[i].tid == itemType.ITEM_TYPE_EXP) {
                    /** 经验改变前 */
                    var itemLogExp = new globalObject.ItemLog();
                    itemLogExp.tid = itemType.ITEM_TYPE_EXP;
                    itemLogExp.beforeNum = player.character.exp;
                    var itemLogLv = new globalObject.ItemLog();
                    itemLogLv.beforeNum = player.character.level;

                    addExp(zid, zuid, player, arrAdd[i].itemNum);

                    /** 经验改变后 */
                    itemLogExp.afterNum = player.character.exp;
                    itemLogLv.afterNum = player.character.level;

                    /* 当等级发生改变时加入BI日志 */
                    if(itemLogLv.beforeNum != itemLogLv.afterNum) {
                        itemLogArr.push(itemLogExp);
                        itemLogArr.push(itemLogLv);
                    }

                    continue;
                }

                /* 获取物品所属背包*/
                var pkgId = getPkgId(arrAdd[i].tid);

                /* 添加物品是符灵 */
                if(pkgId == globalObject.PACKAGE_TYPE_PET) {
                    addPets.push(arrAdd[i]);
                }

                var overLay = getOverLay(pkgId);
                var pkg = playerAndPackages[pkgId];
                if(overLay) {
                    var itemExist = false;
                    for(j = 0; j < pkg.content.length; ++j) {
                        if (pkg.content[j].tid == arrAdd[i].tid) {
                            /** 物品pkg.content[j]改变前数量  pkg.content[j].itemNum */
                            var itemLog = new globalObject.ItemLog();
                            itemLog.itemId = pkg.content[j].itemId;
                            itemLog.tid = pkg.content[j].tid;
                            itemLog.beforeNum = pkg.content[j].itemNum;

                            /* 物品添加 */
                            pkg.content[j].itemNum =
                                Math.min(pkg.content[j].itemNum + arrAdd[i].itemNum, PACKAGE_MAX_OVER_LAY);

                            /** 物品pkg.content[j]改变后数量  pkg.content[j].itemNum*/
                            itemLog.afterNum = pkg.content[j].itemNum;
                            itemLogArr.push(itemLog);

                            var addItem = new globalObject.ItemBase();
                            addItem.itemId = pkg.content[j].itemId;
                            addItem.tid = pkg.content[j].tid;
                            addItem.itemNum = pkg.content[j].itemNum;
                            retAdd.push(addItem);

                            itemExist = true;
                            break;
                        }
                    }

                    if(!itemExist) {
                        arrAdd[i].itemNum = Math.min(arrAdd[i].itemNum, PACKAGE_MAX_OVER_LAY);
                        var newItemBase = AddNewItem(pkg, arrAdd[i].tid, arrAdd[i].itemNum);
                        retAdd.push(newItemBase);

                        /** 新物品newItemBase */
                        var itemLog = new globalObject.ItemLog();
                        itemLog.itemId = newItemBase.itemId;
                        itemLog.tid = newItemBase.tid;
                        itemLog.beforeNum = 0;
                        itemLog.afterNum = newItemBase.itemNum;
                        itemLogArr.push(itemLog);
                    }
                }
                else {
                    for(j = 0; j < arrAdd[i].itemNum && j < csvManager.MailMax()[1].MAX_NUM; ++j) {
                        var newItemBase = AddNewItem(pkg, arrAdd[i].tid, 1);
                        retAdd.push(newItemBase);

                        /** 新物品newItemBase */
                        var itemLog = new globalObject.ItemLog();
                        itemLog.itemId = newItemBase.itemId;
                        itemLog.tid = newItemBase.tid;
                        itemLog.beforeNum = 0;
                        itemLog.afterNum = newItemBase.itemNum;
                        itemLogArr.push(itemLog);
                    }
                }
            }

            wcb(null, playerAndPackages);
        }

    ], function(err, result) {
        if(err) { /* 有错解锁 */
            packageDb.openLockPlayerAndPackages(zid, zuid);
            callback(err);
        }
        else { /* 无错保存并解锁 */
            packageDb.savePlayerAndPackages(zid, zuid, result, true, function(err) {
                if(err) {
                    callback(err);
                }
                else {
                    var player = result[0];
                    /* 更新宝物碎片 */
                    for(var index = 0; index < retSub.length; ++index) {
                        if(itemType.MAIN_TYPE_MAGIC_FRAGMENT == itemType.getMainType(retSub[index].tid)) {
                            robMagic.updateMagicOwnerList(zid, zuid, retSub[index].tid, retSub[index].itemNum,  player.character.level) ;
                        }
                    }
                    for(var index = 0; index < retAdd.length; ++index) {
                        if(itemType.MAIN_TYPE_MAGIC_FRAGMENT == itemType.getMainType(retAdd[index].tid)) {
                            robMagic.updateMagicOwnerList(zid, zuid, retAdd[index].tid, retAdd[index].itemNum,  player.character.level) ;
                        }
                    }
                    /* 更新符灵图鉴 */
                    atlasDb.saveAtlas(zid, zuid, addPets);

                    /* 走马灯 */
                    var em = []; /* 新增的法器和装备 */
                    for(var index = 0; index < retAdd.length; ++index) {
                        var iType = itemType.getMainType(retAdd[index].tid);
                        if(itemType.MAIN_TYPE_EQUIP == iType
                        || itemType.MAIN_TYPE_MAGIC == iType) {
                            em.push(retAdd[index]);
                        }
                    }
                    wallPaperDb.updateRollingWallPaper(zid, zuid, player, -1, 4, em);

                    callback(null, retSub, retAdd, player.character.level,  player.vipLevel, itemLogArr);
                }
            });
        }
    });
};

/**
 * 增减背包物品
 * @param zid 区Id
 * @param zuid 角色Id
 * @param arrSub 扣除物品ItemBase数组
 * @param arrAdd 添加物品ItemBase数组
 * @param channel 渠道
 * @param acc 账号
 * @param reasonOne 来源1
 * @param reasonTwo 来源2
 * @param callback 返回错误码和扣除后物品ItemBase数组、添加的物品ItemBase数组
 */
var updateItemWithLog = function(zid, zuid, arrSub, arrAdd, channel, acc, reasonOne, reasonTwo, callback) {
    updateItem(zid, zuid, arrSub, arrAdd, function(err, retSub, retAdd, charLevel, vipLevel, itemLogArr) {
        if(err) {
            callback(err);
        }
        else {
            var preZid = cZuid.zuidSplit(zuid)[0];
            for(var i = 0; i < itemLogArr.length; ++i) {
                var changeNum = itemLogArr[i].afterNum - itemLogArr[i].beforeNum;
                var isAdd = 0;
                if(changeNum >= 0){
                    isAdd = 0;
                }
                else{
                    isAdd = 1;
                    changeNum = (-1)*changeNum;
                }

                if(itemLogArr[i].tid == itemType.ITEM_TYPE_DIAMOND) {  /* 元宝 */
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_user_yuanbao_change, preZid, channel, zuid, zuid, charLevel, vipLevel, reasonOne, reasonTwo, 0, changeNum, itemLogArr[i].beforeNum, itemLogArr[i].afterNum, isAdd);
                }
                else if(itemLogArr[i].tid == itemType.ITEM_TYPE_GOLD) {  /* 硬币 */
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_user_money_change, preZid, channel, zuid, zuid, charLevel, vipLevel, reasonOne, reasonTwo, 0, changeNum, itemLogArr[i].beforeNum, itemLogArr[i].afterNum, isAdd);
                }
                else if(itemLogArr[i].tid == itemType.ITEM_TYPE_BATTLEACHV) {  /* 战功 */
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_battleachv, preZid, channel, zuid, zuid, charLevel, vipLevel, reasonOne, reasonTwo, 0, changeNum, itemLogArr[i].beforeNum, itemLogArr[i].afterNum, isAdd);
                }
                else if(itemLogArr[i].tid == itemType.ITEM_TYPE_SOULPOINT) {  /* 符魂 */
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_soulpoint, preZid, channel, zuid, zuid, charLevel, vipLevel, reasonOne, reasonTwo, 0, changeNum, itemLogArr[i].beforeNum, itemLogArr[i].afterNum, isAdd);
                }
                else if(itemLogArr[i].tid == itemType.ITEM_TYPE_REPUTATION) {  /* 声望 */
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_reputation, preZid, channel, zuid, zuid, charLevel, vipLevel, reasonOne, reasonTwo, 0, changeNum, itemLogArr[i].beforeNum, itemLogArr[i].afterNum, isAdd);
                }
                else if(itemLogArr[i].tid == itemType.ITEM_TYPE_PRESTIGE) {  /* 威名 */
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_prestige, preZid, channel, zuid, zuid, charLevel, vipLevel, reasonOne, reasonTwo, 0, changeNum, itemLogArr[i].beforeNum, itemLogArr[i].afterNum, isAdd);
                }
                else if(itemLogArr[i].tid == itemType.ITEM_TYPE_UNIONCONTR) {  /* 公会贡献 */
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_guild_contr, preZid, channel, zuid, zuid, charLevel, vipLevel, reasonOne, reasonTwo, 0, changeNum, itemLogArr[i].beforeNum, itemLogArr[i].afterNum, isAdd);
                }
                else if(itemLogArr[i].tid == itemType.ITEM_TYPE_EXP) {  /* 主角经验 */
                    var expBefore = itemLogArr[i].beforeNum;
                    var expAfter = itemLogArr[i].afterNum;
                    var levelBefore = itemLogArr[i+1].beforeNum;
                    var levelAfter = itemLogArr[i+1].afterNum;
                    ++i;
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_character_level_up, preZid, channel, zuid, zuid, expBefore, expAfter, levelBefore, levelAfter);
                }
                else {
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_user_item_change, preZid, channel, zuid, zuid, charLevel, vipLevel, itemLogArr[i].tid, itemLogArr[i].itemId, '', changeNum, itemLogArr[i].afterNum, reasonOne, reasonTwo, 0, 0, isAdd);
                }

            }
            callback(null, retSub, retAdd);
        }
    });
};


/**
 * 更换物品
 * @param zid 区ID
 * @param zuid 用户ID
 * @param downTid  卸下物品的表格ID
 * @param downItemId 卸下物品的ID
 * @param upTid 装上物品的表格ID
 * @param upItemId 装上物品的ID
 * @param upTeamPos 物品要装的位置
 * @param callback 回掉函数返回err
 */
var changeTeamPos = function(zid, zuid, downTid, downItemId, upTid, upItemId, upTeamPos, callback) {
    var reqType = 0; /* 操作类型 1只卸、2只装、3交换*/

    /* 只卸 */
    if(downItemId > 0 && upItemId < 0) {
        reqType = 1;
        var downPkgId = getPkgId(downTid);
        if (globalObject.PACKAGE_TYPE_ERR == downPkgId) { /* 不属于背包 */
            callback(retCode.NO_MATCH_PACKAGE);
            return;
        }
    }
    /* 只装 */
    else if(downItemId < 0 && upItemId > 0) {
        reqType = 2;
        var upPkgId = getPkgId(upTid);
        if (upPkgId == globalObject.PACKAGE_TYPE_ERR) { /* 不属于背包 */
            callback(retCode.NO_MATCH_PACKAGE);
            return;
        }

        var upSlotId = getSlotId(upTid);
        if (upSlotId == globalObject.SLOT_TYPE_ERR) { /* 没有对应槽 */
            callback(retCode.NO_MATCH_SLOT);
            return;
        }
    }
    /* 交换 */
    else if(downItemId > 0 && upItemId > 0) {
        reqType = 3;
        /* 背包Id校验 */
        var downPkgId = getPkgId(downTid);
        var upPkgId = getPkgId(upTid);
        if (downPkgId == globalObject.PACKAGE_TYPE_ERR || upPkgId == globalObject.PACKAGE_TYPE_ERR
            || downPkgId != upPkgId) {
            callback(retCode.NO_MATCH_PACKAGE);
            return;
        }
        var pkgId = downPkgId;

        /* 槽Id校验 */
        var downSlotId = getSlotId(downTid);
        var upSlotId = getSlotId(upTid);
        if (downSlotId == globalObject.SLOT_TYPE_ERR || upSlotId == globalObject.SLOT_TYPE_ERR
            || downSlotId != upSlotId) {
            callback(retCode.NO_MATCH_SLOT);
            return;
        }
    }
    else {
        callback(retCode.CHANGE_POS_REQ_ERR);
        return;
    }


    var playerAndPkgs;
    async.waterfall([
        function(wcb) {
            packageDb.getPlayerAndPackages(zid, zuid, true, wcb);
        },

        function(pap, wcb) {
            playerAndPkgs = pap;

            if(reqType == 1) {
                var pkg = playerAndPkgs[downPkgId];

                var downItem = getItemByItemId(pkg, downItemId);

                if(downItem) {
                    if(downItem.tid != downTid) { /* 物品实际tid与请求tid不符 */
                        wcb(retCode.WRONG_TID);
                        return;
                    }
                }
                else { /* 物品不存在 */
                    wcb(retCode.ITEM_NOT_EXIST);
                    return;
                }

                /* 符灵不能下 */
                if(globalObject.PACKAGE_TYPE_PET == downPkgId && downItem.teamPos >= 1
                    && downItem.teamPos <= 3) {
                    wcb(retCode.PET_SEAT_NO_EMPTY);
                    return;
                }

                downItem.teamPos = -1;
                wcb(null);
            }

            if(reqType == 2) {
                var pkg = playerAndPkgs[upPkgId];
                var level = playerAndPkgs[0].character.level;

                /* 位置等级校验 */
                if(upTeamPos >= 0 && upTeamPos <= 3) { /* 普通阵位 */
                    var levelRequire1 = csvManager.PetPostionLevel()[upTeamPos];
                    if (level < levelRequire1) {
                        wcb(retCode.NOT_ENOUGH_LEVEL_FOR_TEAMPOS);
                        return;
                    }
                }
                else if (globalObject.PACKAGE_TYPE_PET == upPkgId && upTeamPos >= 11 && upTeamPos <= 16) { /* 缘分位 */
                    var levelRequire2 = csvManager.PetPostionLevel()[upTeamPos];
                    if (level < levelRequire2) {
                        wcb(retCode.NOT_ENOUGH_LEVEL_FOR_TEAMPOS);
                        return;
                    }
                }
                else {
                    wcb(retCode.ILLEGAL_TEAMPOS);
                    return;
                }

                /* 同种符灵只能上一个 */
                if (globalObject.PACKAGE_TYPE_PET == upPkgId) {
                    for(var i = 0 ; i < pkg.content.length; ++i) {
                        if(pkg.content[i].tid == upTid && pkg.content[i].teamPos > 0) {
                            wcb(retCode.FORBIDDEN_SAME_PET);
                            return;
                        }
                    }
                }

                var upItem = getItemByItemId(pkg, upItemId);
                if(upItem) {
                    if(upItem.tid != upTid) { /* 物品实际tid与请求tid不符 */
                        wcb(retCode.WRONG_TID);
                        return;
                    }
                }
                else { /* 物品不存在 */
                    wcb(retCode.ITEM_NOT_EXIST);
                    return;
                }

                /* 主角位置，不能上符灵 */
                if(upTeamPos == 0 && upSlotId == globalObject.SLOT_TYPE_PET) {
                    wcb(retCode.CHARACTER_SEAT);
                    return;
                }

                var downItem = getItemByTeamPosAndSlotId(pkg, upTeamPos, upSlotId);
                if(downItem) { /* 槽已被占 */
                    wcb(retCode.SLOT_OCCUPIED);
                    return;
                }

                upItem.teamPos = upTeamPos;
                wcb(null);


                /** 更新任务进度 */
                if(upSlotId >= globalObject.SLOT_TYPE_WEAPON && upSlotId <= globalObject.SLOT_TYPE_ARMOR_TWO) {
                    var petsWith4Equip = 4;
                    for(var i = 0; i <= 3; ++i) {
                        for(var j = globalObject.SLOT_TYPE_WEAPON; j <= globalObject.SLOT_TYPE_ARMOR_TWO; ++j) {
                            if(!getItemByTeamPosAndSlotId(pkg, i, j)) {
                                -- petsWith4Equip;
                                break;
                            }
                        }
                    }
                    /* 更新任务进度 穿四件装备的符灵数量 petsWith4Equip */
                    cMission.updateDailyTask(zid, zuid, cMission.TASK_TYPE_27,  0, petsWith4Equip);
                    cMission.updateAchieveTask(zid, zuid, cMission.TASK_TYPE_27, 0,  0, petsWith4Equip);
                }

                if(upSlotId >= globalObject.SLOT_TYPE_MAGIC_ONE && upSlotId <= globalObject.SLOT_TYPE_MAGIC_TWO) {
                    var petsWith2Magic = 4;
                    for(var i = 0; i <= 3; ++i) {
                        for(var j = globalObject.SLOT_TYPE_MAGIC_ONE; j <= globalObject.SLOT_TYPE_MAGIC_TWO; ++j) {
                            if(!getItemByTeamPosAndSlotId(pkg, i, j)) {
                                -- petsWith2Magic;
                                break;
                            }
                        }
                    }
                    /* 更新任务进度 穿二件法器的符灵数量 petsWith2Magic*/
                    cMission.updateDailyTask(zid, zuid, cMission.TASK_TYPE_28,  0, petsWith2Magic);
                    cMission.updateAchieveTask(zid, zuid, cMission.TASK_TYPE_28, 0,  0, petsWith2Magic);
                }

                if(upPkgId == globalObject.PACKAGE_TYPE_PET) {
                    cMission.updateDailyTask89(zid, zuid, cMission.TASK_TYPE_8, pkg);
                    cMission.updateAchieveTask89(zid, zuid, cMission.TASK_TYPE_8, pkg);
                    cMission.updateDailyTask89(zid, zuid, cMission.TASK_TYPE_9, pkg);
                    cMission.updateAchieveTask89(zid, zuid, cMission.TASK_TYPE_9, pkg);
                }
            }


            if(reqType == 3) {
                var pkg = playerAndPkgs[pkgId];

                var downItem = getItemByItemId(pkg, downItemId);
                if(downItem) {
                    if(downItem.tid != downTid) { /* 物品实际tid与请求tid不符 */
                        wcb(retCode.WRONG_TID);
                        return;
                    }
                }
                else { /* 物品不存在 */
                    wcb(retCode.ITEM_NOT_EXIST);
                    return;
                }

                var upItem = getItemByItemId(pkg, upItemId);
                if(upItem) {
                    if(upItem.tid != upTid) { /* 物品实际tid与请求tid不符 */
                        wcb(retCode.WRONG_TID);
                        return;
                    }
                }
                else { /* 物品不存在 */
                    wcb(retCode.ITEM_NOT_EXIST);
                    return;
                }

                /* 队伍位置校验 */
                if(downItem.teamPos != upTeamPos || upItem.teamPos != -1) {
                    wcb(retCode.WRONG_TEAMPOS);
                    return;
                }

                /* 同种符灵只能上一个 */
                if (globalObject.PACKAGE_TYPE_PET == pkgId) {
                    for(var i = 0; i < pkg.content.length; ++i) {
                        if(pkg.content[i].itemId != downItemId && pkg.content[i].tid == upTid
                            && pkg.content[i].teamPos > 0) {
                            wcb(retCode.FORBIDDEN_SAME_PET);
                            return;
                        }
                    }
                }

                downItem.teamPos = -1;
                upItem.teamPos = upTeamPos;
                wcb(null);

                if(pkgId == globalObject.PACKAGE_TYPE_PET) {
                    cMission.updateDailyTask89(zid, zuid, cMission.TASK_TYPE_8, pkg);
                    cMission.updateAchieveTask89(zid, zuid, cMission.TASK_TYPE_8, pkg);
                    cMission.updateDailyTask89(zid, zuid, cMission.TASK_TYPE_9, pkg);
                    cMission.updateAchieveTask89(zid, zuid, cMission.TASK_TYPE_9, pkg);
                }
            }
        }
    ],function(err) {
        if(err) { /* 有错解锁 */
            packageDb.openLockPlayerAndPackages(zid, zuid);
            callback(err);
        }
        else { /* 无错保存并解锁 */
            if(reqType == 2 || reqType == 3) {
                cRevelry.onItemChange(zid, zuid, playerAndPkgs);
            }

            packageDb.savePlayerAndPackages(zid, zuid, playerAndPkgs, true, callback);
        }
    });
};


/**
 * 道具属性更新
 * @param zid [int] 区Id
 * @param zuid   [int] 用户Id
 * @param itemId [int] 物品唯一Id
 * @param tid [int] 表Id
 * @param aid [int] 参数Id
 * @param calculate [func] 计算函数 function(level, A, cb(a)) 或 function(level, A, B, cb(a, b))
 *     level是player的等级，A,B是redis中数据, a,b是计算后的数据
 * @param callback [func] 回调函数，成功返回null，失败返回错误码
 */
var updateItemAttr = function(zid, zuid, itemId, tid, aid, calculate, callback) {
    var playerAndPkgs;

    async.waterfall([
        function(cb) {
            packageDb.getPlayerAndPackages(zid, zuid, true, cb);
        },

        function(pap, cb) {
            playerAndPkgs = pap;

            if (itemId == -1) { /* 主角 */
                var player = playerAndPkgs[0];
                var level = player.character.level;

                switch (aid) {
                    case attrType.CHAR_BREAK: /* 主角突破 */
                        var A = player.character.breakLevel;
                        calculate(level, A, function (err, a) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                player.character.breakLevel = a;
                                cb(null);
                            }
                        });
                        return;

                    case attrType.CHAR_FATE: /* 主角天命 */
                        var A = player.character.fateLevel;
                        var B = player.character.fateExp;
                        var C = 0;
                        calculate(level, A, B, C, function (err, a, b, c) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A && b == B) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                player.character.fateLevel = a;
                                player.character.fateExp = b;
                                cb(null);
                            }
                        });
                        return;

                    case attrType.CHAR_SKILL_ONE: /* 主角技能1 */
                    case attrType.CHAR_SKILL_TWO: /* 主角技能2 */
                    case attrType.CHAR_SKILL_THREE: /* 主角技能3 */
                    case attrType.CHAR_SKILL_FOUR: /* 主角技能4 */
                        var A = player.character.skillLevel[aid - attrType.CHAR_SKILL_ONE];
                        calculate(level, A, function (err, a) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                player.character.skillLevel[aid - attrType.CHAR_SKILL_ONE] = a;
                                cb(null);
                            }
                        });
                        return;

                    default: /* 错误参数 */
                        cb(retCode.AID_NOT_EXIST);
                        return;
                }
            }
            else { /* 物品 */
                var pkgId = getPkgId(tid);
                if (pkgId == globalObject.PACKAGE_TYPE_ERR) {
                    cb(retCode.NO_MATCH_PACKAGE);
                    return;
                }

                var pkg = playerAndPkgs[pkgId];
                var item = getItemByItemId(pkg, itemId);
                if (item == null || item.tid != tid) {
                    cb(retCode.ITEM_NOT_EXIST);
                    return;
                }

                var level = playerAndPkgs[0].character.level;

                switch (aid) {
                    case attrType.PET_LEVEL: /* 符灵等级 */
                        var A = item.level;
                        var B = item.exp;
                        calculate(level, A, B, function (err, a, b) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A && b == B) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                item.level = a;
                                item.exp = b;

                                /* 更新任务进度 */
                                cMission.updateDailyTask89(zid, zuid, cMission.TASK_TYPE_8, pkg);
                                cMission.updateAchieveTask89(zid, zuid, cMission.TASK_TYPE_8, pkg);

                                cb(null);
                            }
                        });
                        return;

                    case attrType.PET_BREAK: /* 符灵突破 */
                        var A = item.breakLevel;
                        calculate(item.level, A, function (err, a) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                item.breakLevel = a;
                                cb(null);
                            }
                        });
                        return;

                    case attrType.PET_FATE: /* 符灵天命 */
                        var A = item.fateLevel;
                        var B = item.fateExp;
                        var C = item.fateStoneCost;
                        calculate(item.level, A, B, C, function (err, a, b, c) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A && b == B && c == C) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                item.fateLevel = a;
                                item.fateExp = b;
                                item.fateStoneCost = c;

                                /* 更新任务进度 */
                                cMission.updateDailyTask89(zid, zuid, cMission.TASK_TYPE_9, pkg);
                                cMission.updateAchieveTask89(zid, zuid, cMission.TASK_TYPE_9, pkg);

                                cb(null);
                            }
                        });
                        return;

                    case attrType.PET_SKILL_ONE: /* 符灵技能1 */
                    case attrType.PET_SKILL_TWO: /* 符灵技能2 */
                    case attrType.PET_SKILL_THREE: /* 符灵技能3 */
                    case attrType.PET_SKILL_FOUR: /* 符灵技能4 */
                        var A = item.skillLevel[aid - attrType.PET_SKILL_ONE];
                        calculate(item.level, A, function (err, a) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                item.skillLevel[aid - attrType.PET_SKILL_ONE] = a;
                                cb(null);
                            }
                        });
                        return;

                    case attrType.EQUIP_STREN: /* 强化装备 */
                        var A = item.strengthenLevel;
                        var B = item.strengCostGold;
                        calculate(level, A, B, function (err, a, b) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A && b == B) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                item.strengthenLevel = a;
                                item.strengCostGold = b;
                                cb(null);
                            }
                        });
                        return;

                    case attrType.EQUIP_REFINE: /* 精炼装备 */
                        var A = item.refineLevel;
                        var B = item.refineExp;
                        calculate(level, A, B, function (err, a, b) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A && b == B) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                item.refineLevel = a;
                                item.refineExp = b;
                                cb(null);
                            }
                        });
                        return;

                    case attrType.MAGIC_STREN: /* 法器强化 */
                        var A = item.strengthenLevel;
                        var B = item.strengthenExp;
                        calculate(level, A, B, function (err, a, b) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A && b == B) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                item.strengthenLevel = a;
                                item.strengthenExp = b;
                                cb(null);
                            }
                        });
                        return;

                    case attrType.MAGIC_REFINE: /* 法器精炼 */
                        var A = item.refineLevel;
                        calculate(level, A, function (err, a) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            if (a == A) {
                                cb(retCode.VALUE_NOT_CHANGE);
                            }
                            else {
                                item.refineLevel = a;
                                cb(null);
                            }
                        });
                        return;

                    default:
                        cb(retCode.AID_NOT_EXIST);
                        return
                }
            }
        }
    ], function(err) {
        if(err) {
            packageDb.openLockPlayerAndPackages(zid, zuid);
            if(retCode.VALUE_NOT_CHANGE == err) {
                callback(null);
            }
            else {
                callback(err);
            }
        }
        else {
            cRevelry.onItemChange(zid, zuid, playerAndPkgs);
            packageDb.savePlayerAndPackages(zid, zuid, playerAndPkgs, true, callback);
        }
    });
};

/**
 * 根据itemId和tid获取特定物品
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param itemId [int] 物品唯一Id
 * @param tid [int] 物品类型Id
 * @param callback [func] 返回错误码和物品对象[object]
 */
var getItemByItemIdAndTid = function(zid, zuid, itemId, tid, callback) {
    /* 获取背包类型 */
    var pkgId = getPkgId(tid);
    if(globalObject.PACKAGE_TYPE_ERR == pkgId) {
        callback(retCode.NO_MATCH_PACKAGE);
        return;
    }

    async.waterfall([
        /* 获取背包 */
        function(wcb) {
            packageDb.getPackage(zid, zuid, pkgId, false, wcb);
        },

        /* 获取物品 */
        function(pkg, wcb) {
            var items = pkg.content;
            for(var i = 0; i < items.length; ++i) {
                if(items[i].itemId == itemId) {
                    if(items[i].tid == tid) {
                        wcb(null, items[i]);
                        return;
                    }
                    wcb(retCode.WRONG_TID);
                    return;
                }
            }
            wcb(retCode.ITEM_NOT_EXIST);
        }
    ], function(err, item) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, item);
        }
    });
};

/**
 * 增减背包物品
 * @param zid 区Id
 * @param zuid 角色Id
 * @param arrSub 扣除物品ItemBase数组
 * @param arrAdd 添加物品ItemBase数组
 * @param channel 渠道
 * @param acc 账号
 * @param reasonOne 来源1
 * @param reasonTwo 来源2
 * @param callback 返回错误码和添加的物品ItemBase数组
 */
var smartUpdateItemWithLog = function (zid, zuid, arrSub, arrAdd, channel, acc, reasonOne, reasonTwo, callback) {
    var rewards = [];
    updateItemWithLog(zid, zuid, arrSub, arrAdd, channel, acc, reasonOne, reasonTwo, function(err, retSub, retAdd) {
        if(!!err) {
            callback(err);
            return;
        }
        for(var i = 0; i < arrAdd.length; ++i) {
            var found = false;
            for(var j = 0; j < retAdd.length; ++j) {
                if(arrAdd[i].tid == retAdd[j].tid) {
                    found = true;
                    break;
                }
            }

            if(!found) {
                rewards.push(arrAdd[i]);
            }
        }

        for(var i = 0; i < retAdd.length; ++i) {
            rewards.push(retAdd[i]);
        }

        callback(null, rewards);
    });
}
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 更新物品函数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param itemArr [arr] 参数代表准备查询道具的 ItemObject 数组
 * @param callback [int] 错误码(retCode)
 * @returns []
 */
exports.checkItemNum = checkItemNum;

/**
 * 更新物品函数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param arrSub [arr] 准备删除物品的 ItemBase 数组
 * @param arrAdd [arr] 准备添加物品的 ItemBase 数组
 * @param callback [function] 返回错误码[int]、删除物品删除前的ItemBase数组、
 * 添加物品添加后的ItemBase数组、主角等级[int]、玩家vip等级、物品变化ItemLog数组
 */
exports.updateItem = updateItem;

/**
 * 更换物品
 * @param zid 区ID
 * @param zuid 用户ID
 * @param downTid  卸下物品的表格ID
 * @param downItemId 卸下物品的ID
 * @param upTid 装上物品的表格ID
 * @param upItemId 装上物品的ID
 * @param upTeamPos 物品要装的位置
 * @param callback 回掉函数返回err
 */
exports.changeTeamPos = changeTeamPos;

/**
 * 道具属性更新
 * @param zid [int] 区Id
 * @param zuid   [int] 用户Id
 * @param itemId [int] 物品唯一Id
 * @param tid [int] 表Id
 * @param aid [int] 参数Id
 * @param calculate [func] 计算函数 function(level, A, cb(a)) 或 function(level, A, B, cb(a, b))
 *     level是player的等级，A,B是redis中数据, a,b是计算后的数据
 * @param callback [func] 回调函数，成功返回null，失败返回错误码
 * @constructor
 */
exports.updateItemAttr = updateItemAttr;

/**
 * 根据itemId和tid获取特定物品
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param itemId [int] 物品唯一Id
 * @param tid [int] 物品类型Id
 * @param callback [func] 返回错误码和物品对象[object]
 */
exports.getItemByItemIdAndTid = getItemByItemIdAndTid;

/*
 主角突破：  主角等级、突破等级
 主角天命：  主角等级、天命等级、天命值、0（占位）
 主角技能：  主角等级、技能等级
 符灵等级：  符灵等级、符灵经验
 符灵突破：  符灵等级、突破等级
 符灵天命：  符灵等级、天命等级、天命值、天命消耗
 符灵技能：  符灵等级、技能等级
 强化装备：  主角等级、强化等级、强化消耗金币
 精炼装备：  主角等级、精炼等级、精炼经验
 法器强化：  主角等级、强化等级、强化经验
 法器精炼：  主角等级、精炼等级
 */
exports.updateItemWithLog = updateItemWithLog;

/**
 * 增减背包物品
 * @param zid 区Id
 * @param zuid 角色Id
 * @param arrSub 扣除物品ItemBase数组
 * @param arrAdd 添加物品ItemBase数组
 * @param channel 渠道
 * @param acc 账号
 * @param reasonOne 来源1
 * @param reasonTwo 来源2
 * @param callback 返回错误码和添加的物品ItemBase数组
 */
exports.smartUpdateItemWithLog = smartUpdateItemWithLog;