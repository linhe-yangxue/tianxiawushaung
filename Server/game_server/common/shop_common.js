/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：商店通用的接口
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 *包含的头文件
 *
 */
var protocol_object = require('../../common/protocol_object');
var tool = require('../../tools/system/time_util');
var async = require('async');
var type = require('./notification');
var csvManager = require('../../manager/csv_manager').Instance();
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');

/**
 * 计算购买物品所需消耗资源
 * @param shopData [object] 相应的配表
 * @param itemIdArr [array] itemId 数组
 * @param index [int] 物品tid
 * @param num [int] 购买次数
 * @returns {Array} 消耗资源数组
 */
var computeCost = function(shopData, itemIdArr, index, num) {
    var arr = [];
    var cost1 = new protocol_object.ItemObject();
    cost1.itemId = -1;
    cost1.tid = shopData[index].COST_TYPE_1;
    cost1.itemNum = num * shopData[index].COST_NUM_1;
    arr.push(cost1);
    if(undefined != shopData[index].COST_TYPE_2 && 0 != shopData[index].COST_NUM_2 ) {
        var cost2 = new protocol_object.ItemObject();
        cost2.itemId = -1;
        if(0 != itemIdArr.length) {
            cost2.itemId = itemIdArr[0];
        }
        cost2.tid = shopData[index].COST_TYPE_2;
        cost2.itemNum = num * shopData[index].COST_NUM_2;
        arr.push(cost2);
    }
    return arr;
};


/**
 * 计算购买物品所需消耗资源
 * @param shopData [object] 相应的配表
 * @param index [int] 物品tid
 * @param num [int] 购买次数
 * @returns {Array} 消耗资源数组
 */
var countCost = function(shopData, index, num) {
    var arr = [];
    var cost = new protocol_object.ItemObject();
    cost.itemId = -1;
    cost.tid = shopData[index].COST_TYPE_1;
    cost.itemNum = num * shopData[index].COST_NUM_1;
    arr[arr.length] = cost;
    return arr;
};


/**
 *计算购买物品所需消耗资源
 * @param shopData  [object] 相应的配表
 * @param priceArr [array] 价格阶梯字符串
 * @param label [int]  该物品的已购买次数
 * @param index [int] 购买物品的tid
 * @param num [int] 购买次数
 * @returns {Array} 消耗资源数组
 */
var getCost =function(shopData, priceArr, label, index, num) {
    var arr = [];
    var len =  priceArr.length;
    var cost = new protocol_object.ItemObject();
    cost.tid = shopData[index].COST_TYPE_1;
    if(label >= len) {
        cost.itemNum = num * parseInt(priceArr[len -1]);
        arr.push(cost);
        return arr;
    }
    var allNum = num + label;
    if(allNum <= len) {
        --allNum;
        for(var i = label; i<= allNum ; ++i) {
            cost.itemNum += parseInt(priceArr[i]);
        }
        arr.push(cost);
        return arr;
    }
    for(var j = label; j < len; ++j ) {
        cost.itemNum += parseInt(priceArr[j]);
    }
    cost.itemNum += (allNum - len) * parseInt(priceArr[len -1]);
    arr.push(cost);
    return arr;
};

/**
 *获取购买的物品
 * @param shopData [object] 相应的配表
 * @param index [int] 购买物品的tid
 * @param num [int] 购买次数
 * @returns {Array} 消耗资源数组
 */
var getAddItem = function(shopData, index, num) {
    var arr = [];
    var add = new protocol_object.ItemObject();
    add.itemId = -1;
    add.tid = shopData[index].ITEM_ID;
    add.itemNum = num*shopData[index].ITEM_NUM;
    arr[arr.length] = add;
    return arr;
};


/**
 *判断是否刷新
 * @param time_1 [long] 上次请求的时间戳
 * @param time_2 [long] 现在的时间戳
 * @returns {boolean} 是否刷新 true:刷新 false:不刷新
 */
var isFresh = function(time_1, time_2) {
    var date = new Date().toDateString();
    var nineTime = tool.getDetailTime(date, 9);
    var twelveTime = tool.getDetailTime(date, 12);
    var eighteenTime = tool.getDetailTime(date, 18);
    var twentyOneIime = tool.getDetailTime(date, 21);
    if(nineTime <= time_2 && time_2 <= twelveTime && time_1 < nineTime) { /* 9-12 */
        return true;
    }
    if(twelveTime <= time_2 && time_2 <= eighteenTime && time_1 < twelveTime) {  /* 12-18 */
        return true;
    }
    if(eighteenTime <= time_2 && time_2 <= twentyOneIime && time_1 < eighteenTime) {  /* 18-21 */
        return true;
    }
    if(twentyOneIime <= time_2 && time_2 <= (nineTime + 24 * 3600) && time_1 < twentyOneIime) {  /* 21-次日9 */
        return true;
    }

    return false;
};


/**
 *获取距离下次刷新的剩余时间戳
 * @param time [long] 当前时间戳
 * @returns {number} 剩余时间戳
 */
var getLeftTime = function(time) {
    var leftTime = 0;
    var date = new Date().toDateString();
    var nineTime = tool.getDetailTime(date, 9);
    var twelveTime = tool.getDetailTime(date, 12);
    var eighteenTime = tool.getDetailTime(date, 18);
    var twentyOneTime = tool.getDetailTime(date, 21);
    var nextNineTime = nineTime + 24*3600;
    if(time < nineTime ) {
        leftTime = nineTime - time;
    }
    else if(nineTime <= time && time < twelveTime ) {
        leftTime = twelveTime - time;
    }
    else if(twelveTime <= time && time < eighteenTime ) {
        leftTime = eighteenTime - time;
    }
    else if(eighteenTime <= time && time < twentyOneTime ) {
        leftTime = twentyOneTime - time;
    }
    else if(twentyOneTime <= time) {
        leftTime = nextNineTime - time;
    }
    return parseInt(leftTime);
};


/**
 *获取购买的物品的最大购买数
 * @param shopData [object] 相应的配表
 * @param index [int] 购买物品的tid
 * @param level [int] 玩家vip等级
 * @returns {int} 物品的最大购买数
 */
var getMaxNum = function(level, index, shopData) {
    var number = 0;
    var buyNumArr = [];
    var len = 0;
    switch (index) {
        case 601001:
            buyNumArr = (shopData[index].BUY_NUM).split("|");
            len = buyNumArr.length;
            level = level < len ? level:len -1;
            number = parseInt(buyNumArr[level]);
            break;
        case 601002:
            buyNumArr = (shopData[index].BUY_NUM).split("|");
            len = buyNumArr.length;
            level = level < len ? level:len -1;
            number = parseInt(buyNumArr[level]);
            break;
        case 601003:
            buyNumArr = (shopData[index].BUY_NUM).split("|");
            len = buyNumArr.length;
            level = level < len ? level:len -1;
            number = parseInt(buyNumArr[level]);
            break;
        case 601004:
            buyNumArr = (shopData[index].BUY_NUM).split("|");
            len = buyNumArr.length;
            level = level < len ? level:len -1;
            number = parseInt(buyNumArr[level]);
            break;
        case 601005:
            buyNumArr = (shopData[index].BUY_NUM).split("|");
            len = buyNumArr.length;
            level = level < len ? level:len -1;
            number = parseInt(buyNumArr[level]);
            break;
        case 601006:
            buyNumArr = (shopData[index].BUY_NUM).split("|");
            len = buyNumArr.length;
            level = level < len ? level:len -1;
            number = parseInt(buyNumArr[level]);
            break;
        case 601007:
            buyNumArr = (shopData[index].BUY_NUM).split("|");
            len = buyNumArr.length;
            level = level < len ? level:len -1;
            number = parseInt(buyNumArr[level]);
            break;
        default :
            number = parseInt(shopData[index].BUY_NUM);
            break;
    }
    return number;
};
/**
 * 各种商店的key
 * @param type [string]
 * @param zgid [string]
 * @param zuid [string]
 * @returns {*}
 */
function getShopKeyByType( zgid, zuid, type) {
    var key = null;
    switch(type) {
        case 'cloth':
            key = redisClient.joinKey(redisKey.keyHashClothBuyByZuid, zuid);
            break;
        case 'demon':
            key = redisClient.joinKey(redisKey.keyHashDemonBuyByZuid, zuid);
            break;
        case 'prestige':
            key = redisClient.joinKey(redisKey.keyHashPrestigeBuyByZuid, zuid);
            break;
        case 'guild_other':
            key = redisClient.joinKey(redisKey.keyHashGuildOtherBuyByZgidZuid, zgid, zuid);
            break;
        case 'guild_limit':
            key = redisClient.joinKey(redisKey.keyHashGuildPrivateLimBuyByZgidZuid, zgid, zuid);
            break;
        default:
            key = redisClient.joinKey(redisKey.keyHashMarketBuyByZuid, zuid);
            break;
    }
    return key;
}


/**
 * 各种商店的保存请求时间的key
 * @param type [string]
 * @param zgid [string]
 * @param zuid [string]
 * @returns {*}
 */
function getShopReqTimeKeyByType(zgid, zuid, type) {
    var key = null;
    switch(type) {
        case 'cloth':
            key = redisClient.joinKey(redisKey.keyStringClothTimeByZuid, zuid);
            break;
        case 'demon':
            key = redisClient.joinKey(redisKey.keyStringDemonTimeByZuid, zuid);
            break;
        case 'prestige':
            key = redisClient.joinKey(redisKey.keyStringPrestigeTimeByZuid, zuid);
            break;
        case 'guild_other':
            key = redisClient.joinKey(redisKey.keyStringGuildOtherTimeByZgidZuid, zgid, zuid);
            break;
        default:
            key = redisClient.joinKey(redisKey.keyStringMarketTimeByZuid, zuid);
            break;
    }
    return key;
}

function isMaxBuyNum(shopItem, addNum, maxNum,  cb) {
    if(!shopItem)  {
        cb(null);
        return;
    }
    shopItem.buyNum += addNum;
    if(shopItem.buyNum > maxNum) {
        cb(retCode.MAX_BUY_NUM_IS);
        return;
    }
    cb(null);
}
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

exports.computeCost = computeCost;
exports.countCost = countCost;
exports.getCost = getCost;
exports.getAddItem = getAddItem;
exports.isFresh = isFresh;
exports.getLeftTime = getLeftTime;
exports.getMaxNum = getMaxNum;
exports.getShopKeyByType = getShopKeyByType;
exports.getShopReqTimeKeyByType = getShopReqTimeKeyByType;
exports.isMaxBuyNum = isMaxBuyNum;


