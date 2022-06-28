/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取vip商店所有礼包购买状态信息  获取vip商店礼包购买状态信息  保存vip商店礼包购买状态信息
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var dbManager = require('../../manager/redis_manager').Instance();
var globalObject = require('../../common/global_object');
var retCode = require('../../common/ret_code');


/**
 *获取vip商店所有礼包购买状态信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回状态码和数据()
 * @returns []
 */
var getAllVIPBuyInfo =function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashVipShopByZuid, zuid);

    redisDB.HVALS(key, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var len = data.length;
        for(var i = 0; i< len; ++i) {
            data[i] = JSON.parse(data[i]);
        }
        cb(null, data);
    });
};


/**
 *获取vip商店礼包购买状态信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param field [int] VIP等级作为域
 * @param cb [func] 返回状态码和数据()
 * @returns []
 */
var getVIPBuyInfo =function(zid, zuid, field, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashVipShopByZuid, zuid);

    redisDB.HGET(key, field, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(null == data) {
            var buyInfo = new globalObject.DealInfo();
            buyInfo.index = parseInt(field);
            cb(null, buyInfo);
            return;
        }
        cb(null, JSON.parse(data));
    })
};


/**
 *保存vip商店礼包购买状态信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param field [string] vip等级作为域
 * @param value [int] 存储该vip等级下礼包是否已购买
 * @returns []
 */
var saveVIPBuyInfo = function(zid, zuid, field, value) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashVipShopByZuid, zuid);

    redisDB.HSET(key, field, JSON.stringify(value));
};


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 *获取vip商店所有礼包购买状态信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回状态码和数据()
 * @returns []
 */
exports.getAllVIPBuyInfo = getAllVIPBuyInfo;
/**
 *获取vip商店礼包购买状态信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param field [int] VIP等级作为域
 * @param cb [func] 返回状态码和数据()
 * @returns []
 */
exports.getVIPBuyInfo = getVIPBuyInfo;
/**
 *保存vip商店礼包购买状态信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param field [string] vip等级作为域
 * @param value [int] 存储该vip等级下礼包是否已购买
 * @param cb [func] 返回状态码
 * @returns []
 */
exports.saveVIPBuyInfo = saveVIPBuyInfo;