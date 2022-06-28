var async = require('async');
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var rand = require('../../tools/system/math').rand;
var cLottery = require('../common/lottery');

/* 每日免费刷新次数 */
const freeRefreshLimit = 10;
exports.freeRefreshLimit = freeRefreshLimit;

/* 免费刷新恢复间隔（秒） */
const freeRefreshCoolDown = 7200;
exports.freeRefreshCoolDown = freeRefreshCoolDown;

/**
 * 更新符灵商店状态
 * @param mysteryShop
 */
function updateMysteryShop(mysteryShop) {
    var today = (new Date()).toDateString();
    if(mysteryShop.lastRefreshDate != today) {
        mysteryShop.lastRefreshDate = today;
        mysteryShop.refreshCnt = 0;
    }

    var curStamp = parseInt(Date.now() / 1000);
    var recoverCnt = parseInt((curStamp - mysteryShop.freeRefreshTimeStamp) / freeRefreshCoolDown);

    if(mysteryShop.freeRefreshCnt > recoverCnt) {
        mysteryShop.freeRefreshCnt -= recoverCnt;
        mysteryShop.freeRefreshTimeStamp += freeRefreshCoolDown * recoverCnt;
    }
    else {
        mysteryShop.freeRefreshCnt = 0;
        mysteryShop.freeRefreshTimeStamp = curStamp;
    }

    return mysteryShop;
}
exports.updateMysteryShop = updateMysteryShop;


/**
 *神秘商店刷新出的物品tid数组
 * @param player [object] 玩家对象
 * @param petPkg [object] 符灵背包
 * @param petFrgPkg [object] 符灵碎片背包
 * @param lotteryIndex [int] 累计抽奖次数
 * @returns {Array}
 */
function refreshItemsIndex(player, petPkg, petFrgPkg, lotteryIndex) {
    /* 原始概率 */
    var mycTable = csvManager.MysteryShopConfig();
    var level = player.character.level;
    var dropArray = [];

    for(var i in mycTable) {
        var mycLine = mycTable[i];
        var obj = {};
        if(level >= mycLine.LEVEL_MIN && level <= mycLine.LEVEL_MAX) {
            obj.INDEX = mycLine.INDEX;
            obj.REFRESH_RATE = mycLine.REFRESH_RATE;
            dropArray.push(obj);
        }
    }

    /* 潜规则 */
    var activeRules = cLottery.getApplyRules(petPkg, petFrgPkg, lotteryIndex);
    for(var index = 0; index < activeRules.length; ++index) {
        var chgs = activeRules[index].REFRESH_WEIGHT_CHANGE.split('|');

        for(var i = 0; i < chgs.length; ++i) {
            var chg = chgs[i].split('#');
            for (var j = 0; j < chg.length; ++j) {
                chg[j] = chg[j].split('=');
                chg[j][1] = parseInt(chg[j][1]);
            }

            for (var j = 0; j < dropArray.length; ++j) {
                var drop = dropArray[j];
                if (drop.INDEX == chg[0][1]) {
                    drop.REFRESH_RATE = Math.max(drop.REFRESH_RATE + chg[1][1], 0);
                }
            }
        }
    }

    var indexSet = {};

    /* 一共抽六次 */
    for(var tot = 0; tot < 6; ++tot) {
        var weightSum = 0;
        for (var i = 0; i < dropArray.length; ++i) {
            weightSum += dropArray[i].REFRESH_RATE;
        }

        var s = 0;
        var t = rand(0, weightSum);
        for (var i = 0; i < dropArray.length; ++i) {
            var drop = dropArray[i];
            s += drop.REFRESH_RATE;
            if (s >= t) {
                indexSet[drop.INDEX] = 0;
                break;
            }
        }

        dropArray.splice(i, 1);
    }

    return indexSet;
}
exports.refreshItemsIndex= refreshItemsIndex;

