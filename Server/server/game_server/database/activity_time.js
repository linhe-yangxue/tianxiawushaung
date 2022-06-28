/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：GM工具，设置活动时间
 * 开发者：高骏
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
var async = require('async');
var dbManager = require('../../manager/redis_manager').Instance();

/**
 * 获取活动时间
 * @param zid [int] 区id
 * @param preZid [int] 原区id
 * @param aid [int] 活动id(累冲送礼=1,消费返利=2)
 * @param callback [func] 返回错误码和ActivityTimeInfo对象
 */
var getActivityTime= function(zid, preZid, aid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashActivityTimeByZid, preZid);

    redisDB.HGET(key, aid, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, JSON.parse(data));
    });
};

/**
 * 设置活动时间
 * @param zid [int] 区id
 * @param preZid [int] 原区id
 * @param aid [int] 活动id(累冲送礼=1,消费返利=2)
 * @param obj [object] ActivityTimeInfo对象
 * @param callback [func] 返回错误码
 */
var setActivityTime= function(zid, preZid, aid, obj, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashActivityTimeByZid, preZid);

    redisDB.HSET(key, aid, JSON.stringify(obj), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 获取累充和消费返利活动时间
 * @param zid [int] 区id
 * @param preZid [int] 原区id
 * @param callback [func] 返回错误码和ActivityTimeInfo对象
 */
var getAllActivityTime= function(zid, preZid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashActivityTimeByZid, preZid);

    redisDB.HMGET(key, 1, 2, function(err, array) { /* 累冲送礼=1,消费返利=2 */
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        for(var i = 0; i < array.length; ++i) {
            array[i] = JSON.parse(array[i])
        }
        callback(null, array);
    });
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取一个渠道的渠道返利
 * @param channelId [id] 渠道id
 * @param callback [func] 返回错误码和ChannelRateInfo对象
 */
var getChannelRate = function(channelId, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashChannelRateByChannel;
    redisDB.HGET(key, channelId, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else{
            callback(null, JSON.parse(data));
        }
    });
};

/**
 * 获取所有渠道的渠道返利
 * @param callback [func] 返回错误码和ChannelRateInfo对象
 */
var getAllChannelRate = function(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashChannelRateByChannel;
    redisDB.HVALS(key, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(null == data) {
            callback(null, []);
        }
        else{
            var arr = [];
            for (var i=0; i<data.length; i++) {
                arr[arr.length] = JSON.parse(data[i]);
            }
            callback(null, arr);
        }
    });
};

/**
 * 设置所有渠道的渠道返利
 * @param channelRate [obj] ChannelRateInfo对象
 * @param callback [func] 返回错误码
 */
var setChannelRate = function(channelRate, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashChannelRateByChannel;
    redisDB.HSET(key, channelRate.channelId, JSON.stringify(channelRate), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取活动时间
 * @param zid [int] 区id
 * @param preZid [int] 原区id
 * @param aid [int] 活动id(累冲送礼=1,消费返利=2)
 * @param callback [func] 返回错误码和ActivityTimeInfo对象
 */
exports.getActivityTime = getActivityTime;

/**
 * 设置活动时间
 * @param zid [int] 区id
 * @param preZid [int] 原区id
 * @param aid [int] 活动id(累冲送礼=1,消费返利=2)
 * @param obj [object] ActivityTimeInfo对象
 * @param callback [func] 返回错误码
 */
exports.setActivityTime= setActivityTime;

/**
 * 获取累充和消费返利活动时间
 * @param zid [int] 区id
 * @param preZid [int] 原区id
 * @param callback [func] 返回错误码和ActivityTimeInfo对象
 */
exports.getAllActivityTime = getAllActivityTime;

/**
 * 获取一个渠道的渠道返利
 * @param channelId [id] 渠道id
 * @param callback [func] 返回错误码和ChannelRateInfo对象
 */
exports.getChannelRate = getChannelRate;

/**
 * 获取所有渠道的渠道返利
 * @param callback [func] 返回错误码和ChannelRateInfo对象
 */
exports.getAllChannelRate = getAllChannelRate;

/**
 * 设置所有渠道的渠道返利
 * @param channelRate [obj] ChannelRateInfo对象
 * @param callback [func] 返回错误码
 */
exports.setChannelRate = setChannelRate;