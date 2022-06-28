/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取基金领取状态信息  获取基金购买人数  递增基金购买人数   获取基金以前是否购买过
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var redisKey = require('../../../common/redis_key');
var redisClient = require('../../../tools/redis/redis_client');
var retCode = require('../../../common/ret_code');
var dbManager = require('../../../manager/redis_manager').Instance();

/**
 * 判断基金或者福利是否已领取
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param field [string] 配表中领取物品的索引作为域
 * @param cb [func] 返回领取状态 1:已领取 0:未领取
 */
var isFundReward = function(zid ,zuid, field, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashFundRewardByZuid, zuid);

    redisDB.HEXISTS(key, field,  function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, Number(data));
    });
};

/**
 * 获取所有基金领取状态信息数组
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param cb [func] 返回包含配表相应index的数组 如果index已存在表示已经领取过
 */
var getAllFundRewardInfo = function(zid ,zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashFundRewardByZuid, zuid);

    redisDB.HVALS(key, function(err, array) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, array);
    });
};

/**
 * 获取基金购买人数
 * @param zid [int] 区ID
 * @param cb [func] 返回基金购买人数
 */
var getBuyNum = function(zid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFundRewardByZid, zid);

    redisDB.GET(key,function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        data = data ? Number(data) : 0;
        cb(null, data);
    });
};

/**
 * 设置基金购买人数
 * @param zid [int] 区ID
 * @param num [func] 开服基金购买人数
 */
var setBuyNum = function(zid, num) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFundRewardByZid, zid);

    redisDB.SET(key, num);
};

/**
 * 递增基金购买人数
 * @param zid [int] 区ID
 */
var incrBuyNum = function(zid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFundRewardByZid, zid);

    redisDB.incr(key);
};

/**
 * 购买基金
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param cb [func] 返回购买状态 1:已购买 0:未购买
 */
var buyFund = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFundBuyBeforeByZuid, zuid);

    redisDB.SETNX(key, 1, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, parseInt(data));
    });
};

/**
 * 获取基金以前是否购买过
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param cb [func] 返回购买状态 null:未购买 1:已购买
 */
var isBought = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFundBuyBeforeByZuid, zuid);

    redisDB.EXISTS(key, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, data);
    });
};

/**
 * 设置基金或者福利已领取
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param field [string] 配表中领取物品的索引作为域
 */
var setFundReward = function(zid ,zuid, field) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashFundRewardByZuid, zuid);

    redisDB.HSET(key, field,  field);
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

module.exports = {
    isFundReward : isFundReward,
    getBuyNum : getBuyNum,
    setBuyNum : setBuyNum,
    incrBuyNum : incrBuyNum,
    getAllFundRewardInfo : getAllFundRewardInfo,
    isBought : isBought,
    buyFund : buyFund,
    setFundReward : setFundReward
};