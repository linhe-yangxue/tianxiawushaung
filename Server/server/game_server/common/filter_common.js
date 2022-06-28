/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：分割和过滤
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 *包含的头文件
 */
var type = require('./item_type');
var protocolObject = require('../../common/protocol_object');

/**
 * 获取array数组中进或不进背包的物品
 * @param array [array] 物品数组
 * @param inPackage [boolean] true:进背包 false:不进背包
 * @returns {Array}
 */
var getItemsInPackageOrNot = function(array, inPackage) {
    var arr = [];
    if(null == array) {
        return arr;
    }
    var len = array.length;
    if(inPackage) {
        for(var j = 0; j < len; ++j) {
            if(array[j] && (array[j].tid > type.ITEM_TYPE_EXP || array[j].tid < type.ITEM_TYPE_DIAMOND)) {
                arr.push(array[j]);
            }
        }
    }
    else {
        for(var i = 0; i < len; ++i) {
            if(array[i] && array[i].tid <= type.ITEM_TYPE_EXP && array[i].tid >= type.ITEM_TYPE_DIAMOND) {
                arr.push(array[i]);
            }
        }
    }
    return arr;
};

/**
 * 分割字符串获取物品数组
 * @param splitStr [string] 待分割字符串
 * @param delimiter [string] 分隔符
 * @param separator [string] 分隔符
 */
var splitItemStr = function(splitStr, delimiter, separator) {
    var itemArr = [];

    if(!splitStr) {
        return itemArr;
    }
    var splitArr = splitStr.split(delimiter);
    var len = splitArr.length;
    for(var i = 0; i < len; ++i) {
        var item = new protocolObject.ItemObject();
        var itemInfo = splitArr[i];
        itemInfo = itemInfo.split(separator);
        if(null == itemInfo[0] || 0 == itemInfo[0] || null == itemInfo[1]) {
            continue;
        }
        item.tid = parseInt(itemInfo[0]);
        item.itemNum = parseInt(itemInfo[1]);
        itemArr.push(item);
    }
    return itemArr;
};

/**
 * 分割配表中的奖励并转换成ItemObject对象数组
 * @param isFirstCharge [int] 是否首冲 1:是 0:否
 * @param configTable [Object] 配表JSON对象
 * @param shelfId [int] 配表索引
 * @returns {Array} 返回奖励数组
 */
var getChargeRewardArr = function(isFirstCharge, configTable, shelfId) {
    var arrX = [];
    var arrY = [];
    var itemArr = [];
    var object = configTable[shelfId];
    if(null == object) {
        return itemArr;
    }
    if(isFirstCharge) {
        arrX = splitItemStr(object.FIRST_CHARGE_REWARD1, '|', '#');
        arrY = splitItemStr(object.REWARD_BUY, '|', '#');
        arrX = arrX.concat(arrY);
    }
    else {
        arrX = splitItemStr(object.REWARD_SEND, '|', '#');
        arrY = splitItemStr(object.REWARD_BUY, '|', '#');
        arrX = arrX.concat(arrY);
    }
    itemArr = itemArr.concat(arrX);
    return itemArr;
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 分割字符串获取物品数组
 * @param splitStr [string] 待分割字符串
 * @param delimiter [string] 分隔符
 * @param separator [string] 分隔符
 */
exports.splitItemStr = splitItemStr;
/**
 * 获取array数组中进或不进背包的物品
 * @param array [array] 物品数组
 * @param inPackage [boolean] true:进背包 false:不进背包
 * @returns {Array}
 */
exports.getItemsInPackageOrNot = getItemsInPackageOrNot;
/**
 * 分割配表中的奖励并转换成ItemObject对象数组
 * @param isFirstCharge [int] 是否首冲 1:是 0:否
 * @param configTable [Object] 配表JSON对象
 * @param shelfId [int] 配表索引
 * @returns {Array} 返回奖励数组
 */
exports.getChargeRewardArr = getChargeRewardArr;