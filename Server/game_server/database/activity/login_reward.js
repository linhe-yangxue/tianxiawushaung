/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：次日登陆
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
var dbManager = require("../../../manager/redis_manager").Instance();
var async = require('async');

/**
 * 次日登陆判断
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback [func] 返回是否可领取
 */
var loginOtherDay = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLoginOtherByZuid, zuid);
    var key1 = redisClient.joinKey(redisKey.keyStringLoginRewardTimeByZuid, zuid);

    async.waterfall([
        function(cb) {
            redisDB.GET(key1, cb);
        },
        function(time, cb) {
            time = +time;
            var date = new Date();
            var loginDate = new Date(time);
            /* 当符合领取日期时 判断有没有领过  */
            if(date.getDate() >  loginDate.getDate() || date.getMonth() > loginDate.getMonth()
                || date.getFullYear() > loginDate.getFullYear()) {
                    redisDB.EXISTS(key, cb);
            } else { /* 不符合领取日期 */
                cb(null, 1);
            }
        }
    ],callback);
};

/**
 * 获取次日登陆是否已领取
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback [func] 返回保存是否成功
 */
var getLoginRewardInfo = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLoginOtherByZuid, zuid);

    redisDB.GET(key, function(err, flag) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, flag);
        }
    });
};

/**
 *设置次日登陆领奖首次请求时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 */
var setFirstLoginTime = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLoginRewardTimeByZuid, zuid);
    var nowTime = Date.now();
    redisDB.SETNX(key, nowTime);
};

var setLoginRewardInfo = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLoginOtherByZuid, zuid);

    redisDB.SET(key, 1);
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

module.exports = {
    loginOtherDay : loginOtherDay,
    getLoginRewardInfo : getLoginRewardInfo,
    setFirstLoginTime : setFirstLoginTime,
    setLoginRewardInfo : setLoginRewardInfo
};
