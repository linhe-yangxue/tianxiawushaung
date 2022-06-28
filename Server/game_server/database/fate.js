/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取上次天命值请求的时间, 保存天命值请求时间用于下次天命值清零判断
 * 开发者：许林
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
var dbManager =  require('../../manager/redis_manager').Instance();


/**
 *检查天命值是否需要清空
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param itemId [int] 物品唯一Id(主角-1)
 * @param cb [func] 返回错误码[int](retCode) 和数据(天命值请求时间)
 * @returns []
 */
var isFateExpNeedReset = function(zid, zuid, itemId, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFateExpDateByZuidItemId, zuid, itemId);
    var curDateString = (new Date()).toDateString();

    redisDB.GET(key, function(err, lastDateString) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }

        if(curDateString == lastDateString) {
            cb(null, false);
        }
        else {
            redisDB.SETEX(key, 24 * 3600, curDateString);
            cb(null, true);
        }
    });
};

/**
 *获取当前天命等级消耗的天命石数量
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param itemId [int] 符灵物品Id
 * @param cb [func] 返回总值
 */
var getFateStoneCost = function(zid, zuid, itemId, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFateStoneByZuidItemId, zuid, itemId);

    redisDB.get(key, function(err, result) {
        if (err) {
            cb(retCode.DB_ERR);
        }
        else if(result) {
            cb(null, parseInt(result));
        }
        else {
            cb(null, 0);
        }
    });
};

/**
 *保存当前天命等级消耗的天命石数量
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param itemId [int] 符灵物品Id
 * @param stone [int] 消耗天命石数量
 */
var setFateStoneCost = function(zid, zuid, itemId, stone) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFateStoneByZuidItemId, zuid, itemId);

    redisDB.SETEX(key, 24 * 3600, stone);
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    isFateExpNeedReset:isFateExpNeedReset,
    getFateStoneCost:getFateStoneCost,
    setFateStoneCost:setFateStoneCost
};
