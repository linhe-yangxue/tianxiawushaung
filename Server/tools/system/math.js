var assert = require('assert');

/**
 * 随机函数
 * @param min [int] 最小随机数
 * @param max [int] 最大随机数
 * @returns [int] 返回随机数字
 */
var rand = function(min, max) {
    if(min > max) {
        var tmp = min;
        min = max;
        max = tmp;
    }

    return min + parseInt(Math.random() * (max + 1 - min));
};

/**
 * 根据数组中的权重随机取下标
 * @param weightArray [array] 权重数组
 * @returns [int] 返回权重数组下标
 */
var getArrayIndexByWeigth = function (weightArray) {
    assert.ok(weightArray && weightArray.length > 0, 'weightArray must be an array');
    var random =  Math.random();
    var totalWeight = 0;
    for(var i = 0; i < weightArray.length; i++) {
        totalWeight += weightArray[i];
    }
    var weightIncrease = weightArray[0];
    for(var i = 0; i < weightArray.length; i++) {
        if(random <= weightIncrease / totalWeight) {
            return i;
        }
        weightIncrease += weightArray[i + 1];
    }
}

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 随机函数
 * @param min [int] 最小随机数
 * @param max [int] 最大随机数
 * @returns [int] 返回随机数字
 */
exports.rand = rand;

/**
 * 根据数组中的权重随机取下标
 * @param weightArray [array] 权重数组
 * @returns [int] 返回权重数组下标
 */
exports.getArrayIndexByWeigth = getArrayIndexByWeigth;