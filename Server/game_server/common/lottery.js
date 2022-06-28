var async = require('async');
var retCode = require('../../common/ret_code');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var rand = require('../../tools/system/math').rand;

/**
 * 将global_object中的Lottery类转为protocol中的LotteryObject类
 * @param iLottery Lottery对象
 * @param chaLvl 主角等级
 * @param isNormal 是否是普通抽卡
 * @returns {LotteryObject} 返回LotteryObject对象
 */
function lotteryFromDbToRes(iLottery, chaLvl, isNormal) {
    var typeInt; /* 表格中的抽奖类型 */
    if(isNormal) {
        typeInt = 3;
    }
    else {
        typeInt = 1;
    }

    var pcTable = csvManager.PumpingConfig();
    var pcLine;
    for(var i in pcTable) {
        pcLine = pcTable[i];
        if(pcLine.TYPE === typeInt && chaLvl >= pcLine.LEVEL_MIN && chaLvl <= pcLine.LEVEL_MAX) {
            break;
        }
    }

    var oLottery = new protocolObject.LotteryObject();
    if(isNormal) {
        var lastDate = (new Date(iLottery.lastTime * 1000)).toDateString();
        var curDate = (new Date()).toDateString();
        if (lastDate != curDate) {
            oLottery.leftTime = 0;
            oLottery.leftNum = pcLine.FREE_NUMBER;
            iLottery.todayCnt = 0;
            oLottery.isFree = 1;
        }
        else {
            oLottery.leftTime = Math.max(iLottery.lastTime + 60 * pcLine.FREE_INT - parseInt(Date.now() / 1000), 0);
            oLottery.leftNum = Math.max(pcLine.FREE_NUMBER - iLottery.todayCnt, 0);
            if (oLottery.leftTime == 0 && oLottery.leftNum > 0) {
                oLottery.isFree = 1;
            }
            else {
                oLottery.isFree = 0;
            }
        }
    }
    else {
        oLottery.leftTime = Math.max(iLottery.lastTime + 60 * pcLine.RESTORE_TIME - parseInt(Date.now() / 1000), 0);

        if(oLottery.leftTime == 0) {
            iLottery.todayCnt = 0;
        }
        oLottery.leftNum = Math.max(pcLine.FREE_NUMBER - iLottery.todayCnt, 0);
        if (oLottery.leftTime == 0 && oLottery.leftNum > 0) {
            oLottery.isFree = 1;
        }
        else {
            oLottery.isFree = 0;
        }
    }

    return oLottery;
}
exports.lotteryFromDbToRes = lotteryFromDbToRes;


/**
 * 获取数组中某tid的数量
 * @param items 物品数组
 * @param tid
 * @returns {number} 返回数量
 */
function getItemCnt (items, tid) {
    var cnt = 0;
    for(var i = 0; i < items.length; ++i) {
        if(items[i].tid == tid) {
            cnt += items[i].itemNum;
        }
    }
    return cnt;
}

/**
 * 检查是否符合条件
 * @param cons
 * @param paramA
 * @param lotteryIndex
 */
function checkCons(cons, paramA, lotteryIndex) {
    if(isNaN(paramA) || isNaN(lotteryIndex)) {
        return 0;
    }

    for(var i = 1; i < cons.length; ++i) {
        switch (cons[i][0]) {
            case 'min':
                if(paramA < cons[i][1]) {
                    return 0;
                }
                break;
            case 'max':
                if(paramA > cons[i][1]) {
                    return 0;
                }
                break;
            case 'min_draw_time':
                if(lotteryIndex < cons[i][1]) {
                    return 0;
                }
                break;
            case 'max_draw_time':
                if(lotteryIndex > cons[i][1]) {
                    return 0;
                }
                break;
            default :
                break;
        }
    }
    return 1;
}

/**
 * 获取激活的规则数组
 * @param petPkg 符灵背包
 * @param petFrgPkg 符灵碎片背包
 * @param lotteryIndex 累计抽奖次数
 */
function getApplyRules(petPkg, petFrgPkg, lotteryIndex) {
    var pets = petPkg.content;
    var frgs = petFrgPkg.content;

    /* 获取各个品质的符灵数量 */
    var acTable = csvManager.ActiveObject();
    var petQuality = [0, 0, 0, 0, 0, 0, 0, 0];
    for(var i = 0; i < pets.length; ++i) {
        petQuality[acTable[pets[i].tid].STAR_LEVEL] += 1;
    }

    var activeRules = [];
    var hrTable = csvManager.HiddenRule();
    for(var index in hrTable) {
        var hrLine = hrTable[index];
        var cons = hrLine.CONDITION.split('|');
        var apply = 1;
        for(var k = 0; k < cons.length; ++k) {
            var con = cons[k].split('#');

            for(var i = 0; i < con.length; ++i) {
                con[i] = con[i].split('=');
                con[i][1] = parseInt(con[i][1]);
            }

            var paramA = 0;
            switch (con[0][0]) {
                case 'pet_quality':
                    paramA = petQuality[con[0][1]];
                    break;

                case 'pet_id':
                    paramA = getItemCnt(pets, con[0][1]);
                    break;

                case 'petfragment_id':
                    paramA = getItemCnt(frgs, con[0][1]);
                    break;

                default :
                    apply *= 0;
                    break;
            }

            if(!apply) {
                break;
            }

            apply *= checkCons(con, paramA, lotteryIndex);
        }

        if(apply) {
            activeRules.push(hrLine);
        }
    }

    return activeRules;
}
exports.getApplyRules = getApplyRules;

/**
 * 潜规则抽卡
 * @param petPkg 符灵背包
 * @param petFrgPkg 符灵碎片背包
 * @param lotteryIndex 累计抽奖次数
 * @param groupId 抽卡的组号
 */
function dropWithHiddenRule(petPkg, petFrgPkg, lotteryIndex, groupId) {
    /* 获取物品掉落出事权重 */
    var records = csvExtendManager.StageLootGroupIDConfigRecordsByGroupID(groupId);
    var drops = {};
    for(var i = 0; i < records.length; ++i) {
        drops[records[i].ITEM_ID] = records[i].ITEM_DROP_WEIGHT;
    }

    var activeRules = getApplyRules(petPkg, petFrgPkg, lotteryIndex);
    for(var index = 0; index < activeRules.length; ++index) {
        var chgs = activeRules[index].DRAW_WEIGHT_CHANGE.split('|');

        for(var i = 0; i < chgs.length; ++i) {
            var chg = chgs[i].split('#');
            for(var j = 0; j < chg.length; ++j) {
                chg[j] = chg[j].split('=');
                chg[j][1] = parseInt(chg[j][1]);
            }

            if(chg[0][1] == groupId) {
                if(chg[1][0] == 'drop_quality') {
                    for(var j = 0; j < records.length; ++j) {
                        var record = records[j];
                        if(record.QUALITY == chg[1][1]) {
                            drops[record.ITEM_ID] += chg[2][1];
                        }
                    }
                }
                else if(chg[1][0] == 'drop_id') {
                    for(var j = 0; j < records.length; ++j) {
                        var record = records[j];
                        if(record.ITEM_ID == chg[1][1]) {
                            drops[record.ITEM_ID] += chg[2][1];
                        }
                    }
                }
            }
        }
    }

    /* 计算总权重  */
    var totWeight = 0;
    for(var i in drops) {
        if(drops[i] > 0) {
            totWeight += drops[i];
        }
    }

    /* 抽卡 */
    var item = new globalObject.ItemBase();
    var n = rand(0, totWeight);
    for(var i in drops) {
        if(drops[i] > 0) {
            n -= drops[i];
        }
        if(n <= 0) {
            item.tid = parseInt(i);
            break;
        }
    }

    for(var i = 0; i < records.length; ++i) {
        var record = records[i];
        if(record.ITEM_ID == item.tid) {
            item.itemNum = record.ITEM_COUNT * record.LOOT_TIME;
            break;
        }
    }

    return item;
}
exports.dropWithHiddenRule = dropWithHiddenRule;


/**
 * 潜规则开宝箱
 * @param petPkg 符灵背包
 * @param petFrgPkg 符灵碎片背包
 * @param lotteryIndex 累计抽奖次数
 * @param groupId 抽卡的组号
 */
function openWithHiddenRule(petPkg, petFrgPkg, lotteryIndex, groupId) {
    /* 获取物品掉落出事权重 */
    var records = csvExtendManager.GroupIDConfigRecordsByGroupID(groupId);
    var opens = {};
    for(var i = 0; i < records.length; ++i) {
        opens[records[i].ITEM_ID] = records[i].ITEM_DROP_WEIGHT;
    }

    var activeRules = getApplyRules(petPkg, petFrgPkg, lotteryIndex);
    for(var index = 0; index < activeRules.length; ++index) {
        var chgs = activeRules[index].BOX_WEIGHT_CHANGE.split('|');

        for(var i = 0; i < chgs.length; ++i) {
            var chg = chgs[i].split('#');
            for(var j = 0; j < chg.length; ++j) {
                chg[j] = chg[j].split('=');
                chg[j][1] = parseInt(chg[j][1]);
            }

            if(chg[0][1] == groupId) {
                if(chg[1][0] == 'drop_quality') {
                    for(var j = 0; j < records.length; ++j) {
                        var record = records[j];
                        if(record.QUALITY == chg[1][1]) {
                            opens[record.ITEM_ID] += chg[2][1];
                        }
                    }
                }
                else if(chg[1][0] == 'drop_id') {
                    for(var j = 0; j < records.length; ++j) {
                        var record = records[j];
                        if(record.ITEM_ID == chg[1][1]) {
                            opens[record.ITEM_ID] += chg[2][1];
                        }
                    }
                }
            }
        }
    }

    /* 计算总权重  */
    var totWeight = 0;
    for(var i in opens) {
        if(opens[i] > 0) {
            totWeight += opens[i];
        }
    }

    /* 抽卡 */
    var item = new globalObject.ItemBase();
    var n = rand(0, totWeight);
    for(var i in opens) {
        if(opens[i] > 0) {
            n -= opens[i];
        }
        if(n <= 0) {
            item.tid = parseInt(i);
            break;
        }
    }

    for(var i = 0; i < records.length; ++i) {
        var record = records[i];
        if(record.ITEM_ID == item.tid) {
            item.itemNum = record.ITEM_COUNT * record.LOOT_TIME;
            break;
        }
    }

    return item;
}
exports.openWithHiddenRule = openWithHiddenRule;
