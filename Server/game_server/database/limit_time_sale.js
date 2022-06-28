/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取保存限时购买剩余次数，购买时间戳，
 * 开发者：邱峰
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var dbManager = require('../../manager/redis_manager').Instance();
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var async = require('async');
var globalObject = require('../../common/global_object');

/**
 * 获取玩家限时购买，购买时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback [func] 返回 购买时间
 * @returns []
 */
var getGoodsBuyTime = function(zid, zuid, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringActGoodsBuyTimeByZuid, zuid);

    redisDB.GET(key, function(err, lastTime){
       if(err){
           callback(retCode.DB_ERR);
       }
       else{
           callback(null, lastTime);
       }
    });
};
/**
 * 获取玩家限时购买，购买次数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param goodsState [int] 物品编号
 * @param callback [func] 返回 购买次数
 * @returns []
 */
var getGoodsBuyNum = function(zid, zuid, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashGoodsHaveBuyNumByZuid, zuid);

    redisDB.HVALS(key, function(err, array){
       if(err){
           callback(retCode.DB_ERR);
       }
       else{
           var arr = [];
           for (var i = 0; i < array.length; ++i) {
               arr[i] = JSON.parse(array[i]);
           }
           callback(null, arr);
       }
    });
};
/**
 *保存玩家限时购买，购买时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [int] 购买时间
 * @param callback [func] 返回 购买时间
 * @returns []
 */
var saveGoodsBuyTime = function(zid, zuid, time, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringActGoodsBuyTimeByZuid, zuid);

    redisDB.SET(key, time, function(err){
       if(err){
           callback(retCode.DB_ERR);
           return;
       }
        callback(null);
    });
};
/**
 *保存玩家限时购买，购买次数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param index[int] 物品编号
 * @param goodsState [obj] 物品状态 GoodsState对象
 * @returns []
 */
var saveGoodsBuyNum = function(zid, zuid, index, goodsState) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashGoodsHaveBuyNumByZuid, zuid);

    redisDB.HSET(key, index, JSON.stringify(goodsState));
};

var delGoodsBuyNum = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashGoodsHaveBuyNumByZuid, zuid);

    redisDB.DEL(key);
};

var getAGoodsBuyNum = function(zid, zuid, index, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashGoodsHaveBuyNumByZuid, zuid);

    redisDB.HGET(key, index, function(err, array){
        if(err){
            callback(retCode.DB_ERR);
        }
        else if(null == array) {
            callback(null);
        }
        else{
            callback(null, JSON.parse(array));
        }
    });
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取玩家限时购买，购买时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback [func] 返回 购买时间
 * @returns []
 */
exports.getGoodsBuyTime = getGoodsBuyTime;
/**
 * 获取玩家限时购买，剩余次数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback [func] 返回 剩余次数
 * @returns []
 */
exports.getGoodsBuyNum = getGoodsBuyNum;
/**
 *保存玩家限时购买，购买时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param goodsBuyTime [int] 购买时间
 * @param callback [func] 返回 购买时间
 * @returns []
 */
exports.saveGoodsBuyTime = saveGoodsBuyTime;
/**
 *保存玩家限时购买，剩余次数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param haveBuyNum [int]
 * @param callback [func] 返回 剩余次数
 * @returns []
 */
exports.saveGoodsBuyNum = saveGoodsBuyNum;

exports.delGoodsBuyNum = delGoodsBuyNum;

exports.getAGoodsBuyNum = getAGoodsBuyNum;