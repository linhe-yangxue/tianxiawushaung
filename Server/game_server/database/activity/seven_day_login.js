/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：活动数据库操作
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
var retCode = require('../../../common/ret_code');
var redisClient = require('../../../tools/redis/redis_client');
var dbManager = require('../../../manager/redis_manager').Instance();


/**----------------------------------------------七日登陆活动 [BEGIN]--------------------------------------------------*/
/**
 *获取上次登录的日期记录这次登录的日期
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param date [string] 日期 格式:'yyyy-mm-dd'
 * @param cb [func] 返回上次登录的日期
 */
var updateLastLoginDate = function(zid, zuid, date, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLastDateByZuid, zuid);

    redisDB.GETSET(key, date, function(err, data) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, data);
    });
};

/**
 *递增登录天数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回递增后的登录天数
 */
var incrLoginDay = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLoginDayByZuid, zuid);

    redisDB.INCR(key, function(err, count) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, count);
    });
};

/**
 *获取登录天数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回登录天数
 */
var getLoginDay = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLoginDayByZuid, zuid);

    redisDB.GET(key,  function(err, number) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(null == number) {
            redisDB.SET(key, 1);
            cb(null, 1);
            return;
        }
        cb(null, parseInt(number));
    });
};

/**
 *拦截相同奖励是否领取多次
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param index [int] 配表中的索引值
 * @param cb [func] 返回是否领取多次 1：否 0：是
 */
var getAwardBefore = function(zid, zuid, index, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashAwardIndexByZuid, zuid);

    redisDB.HSETNX(key, index, index, function(err, flag) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, flag);
    });
};

/**
 *获取已领取奖励对应配表中的索引
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回索引数组
 */
var getRewardIndexArr = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashAwardIndexByZuid, zuid);

    redisDB.HVALS(key, function(err, array) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, array);
    });
};


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *获取上次登录的日期
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回上次登录的日期
 */
exports.updateLastLoginDate = updateLastLoginDate;

/**
 *递增登录天数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回递增后的登录天数
 */
exports.incrLoginDay = incrLoginDay;
/**
 *获取登录天数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回登录天数
 */
exports.getLoginDay = getLoginDay;
/**
 *拦截相同奖励是否领取多次
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param index [int] 配表中的索引值
 * @param cb [func] 返回是否领取多次 1：否 0：是
 */
exports.getAwardBefore = getAwardBefore;
/**
 *获取已领取奖励对应配表中的索引
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回索引数组
 */
exports.getRewardIndexArr = getRewardIndexArr;

