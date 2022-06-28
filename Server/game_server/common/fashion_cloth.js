/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：计算时装强化所需资源, 计算时装重铸所返还的物品
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 *包含的头文件
 */
var protocolObject = require('../../common/protocol_object');
var type = require('./item_type');

/**
 * 计算时装强化所需资源
 * @param configData [object] 时装配表数据
 * @param clothID [int] 时装索引
 * @param consume [object] 时装强化所消耗的时装精华
 * @param level [int] 时装强化等级
 * @returns {Array} 时装强化所需资源数组
 */
var computeCost = function(configData,clothID,consume,level) {
    var arr = [];
    var item = new protocolObject.ItemObject();
    item.itemId = -1;
    switch (level) {
        case 0: /* 表示0级升1级消耗的资源 */
            item.itemNum = configData[clothID].AVATAR_MONEY_1;
            break;
        case 1:
            item.itemNum = configData[clothID].AVATAR_MONEY_2;
            break;
        case 2:
            item.itemNum = configData[clothID].AVATAR_MONEY_3;
            break;
        case 3:
            item.itemNum = configData[clothID].AVATAR_MONEY_4;
            break;
        case 4:
            item.itemNum = configData[clothID].AVATAR_MONEY_5;
            break;
        case 5:
            item.itemNum = configData[clothID].AVATAR_MONEY_6;
            break;
        case 6:
            item.itemNum = configData[clothID].AVATAR_MONEY_7;
            break;
    }
    item.tid  = type.ITEM_TYPE_GOLD;
    arr.push(item);
    arr.push(consume);
    return arr;
};


/**
 * 计算时装重铸所返还的物品
 * @param configData [object] 时装配表数据
 * @param clothID [int] 时装索引
 * @param level [int] 时装强化等级
 * @returns {Array} 时装重铸返还物品数组
 */
var getRestitution = function(configData,clothID,level) {
    var arr = [];
    var item_1 = new protocolObject.ItemObject();
    var item_2 = new protocolObject.ItemObject();
    item_1.itemId = -1;
    item_2.itemId = -1;
    switch (level) {
        case 1:
            item_1.itemNum = configData[clothID].TOTAL_AVATAR_EXP_1;
            item_2.itemNum = configData[clothID].TOTAL_AVATAR_MONEY_1;
            break;
        case 2:
            item_1.itemNum = configData[clothID].TOTAL_AVATAR_EXP_2;
            item_2.itemNum = configData[clothID].TOTAL_AVATAR_MONEY_2;
            break;
        case 3:
            item_1.itemNum = configData[clothID].TOTAL_AVATAR_EXP_3;
            item_2.itemNum = configData[clothID].TOTAL_AVATAR_MONEY_3;
            break;
        case 4:
            item_1.itemNum = configData[clothID].TOTAL_AVATAR_EXP_4;
            item_2.itemNum = configData[clothID].TOTAL_AVATAR_MONEY_4;
            break;
        case 5:
            item_1.itemNum = configData[clothID].TOTAL_AVATAR_EXP_5;
            item_2.itemNum = configData[clothID].TOTAL_AVATAR_MONEY_5;
            break;
        case 6:
            item_1.itemNum = configData[clothID].TOTAL_AVATAR_EXP_6;
            item_2.itemNum = configData[clothID].TOTAL_AVATAR_MONEY_6;
            break;
        case 7:
            item_1.itemNum = configData[clothID].TOTAL_AVATAR_EXP_7;
            item_2.itemNum = configData[clothID].TOTAL_AVATAR_MONEY_7;
            break;
    }
    item_1.tid  = type.ITEM_TYPE_CLOTH_ESSENCE;
    item_2.tid  = type.ITEM_TYPE_GOLD;
    arr.push(item_1);
    arr.push(item_2);
    return arr;
};


/**
 * 计算时装强化所需资源
 * @param configData [object] 时装配表数据
 * @param clothID [int] 时装索引
 * @param consume [object] 时装强化所消耗的时装精华
 * @param level [int] 时装强化等级
 * @returns {Array} 时装强化所需资源数组
 */
exports.computeCost = computeCost;

/**
* 计算时装重铸所返还的物品
* @param configData [object] 时装配表数据
* @param clothID [int] 时装索引
* @param level [int] 时装强化等级
* @returns {Array} 时装重铸返还物品数组
*/
exports.getRestitution = getRestitution;


