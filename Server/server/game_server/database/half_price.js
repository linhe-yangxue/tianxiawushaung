/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取半价物品数量，设置、获取玩家购买状态
 * 开发者：余金堂
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();

/**
 * 获取半价物品领取数量
 * @param zid [int] 区ID
 * @param callback [function] 返回错误码[int](retCode)和数据数组(半价物品已购买数量)
 */
var getAllHalfPriceNum = function(zid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashHalfPriceNumByZid, zid);

    redisDB.HMGET(key, [1, 2, 3, 4, 5, 6, 7], function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        for(var i = 0; i < 7; ++i) {
            if(result[i] == null) {
                result[i] = 0;
            }
            else {
                result[i] = parseInt(result[i]);
            }
        }
        callback(null, result);
    });
};
exports.getAllHalfPriceNum = getAllHalfPriceNum;

/**
 * 购买半价物品区购买数量加1
 * @param zid [int] 区ID
 * @param whichDay [int] hash域 用来判断购买哪天的物品
 * @param callback [func] 返回错误码和加一后的物品数量
 */
var incrHalfPrice = function(zid, whichDay, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashHalfPriceNumByZid, zid);

    redisDB.HINCRBY(key, whichDay, 1, function(err, buyNum) { /* 购买，则物品数量+1 */
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, buyNum);
    });
};
exports.incrHalfPrice = incrHalfPrice;

/**
 * 获取七天购买状态列表
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param callback [function] 返回错误码[int](retCode)和数据数组(七天的购买状态数组)
 */
var getBuyArrHalfPrice = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringBuyArrHalfPriceByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }

        if (null == result) {
            callback(null,[]);
            return;
        }

        callback(null,JSON.parse(result));
    });
};
exports.getBuyArrHalfPrice = getBuyArrHalfPrice;

/**
 * 修改某天购买状态
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param states [array] 购买物品数组
 */
var setIsBuyHalfPrice = function(zid, zuid, states) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringBuyArrHalfPriceByZuid, zuid);

    redisDB.SET(key, JSON.stringify(states));
};
exports.setIsBuyHalfPrice = setIsBuyHalfPrice;
