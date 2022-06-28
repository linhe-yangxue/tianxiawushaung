/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取每日福利状态信息
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
var timeUtil = require('../../tools/system/time_util');

/**
 *获取每日福利状态信息
 * @param zid [int] 区ID
 * @param zuid [string] 角色ID
 * @param vipLevel [int] VIP等级
 * @param callback [func] 返回状态码和数据
 */
function getVipDailyGiftInfo(zid, zuid, vipLevel, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringVipDailyGiftByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }

        if(null == result) {
            result = new globalObject.Welfare();
        }
        else {
            result = JSON.parse(result);
        }

        var date = (new Date()).toDateString();
        if(date != result.preVipLvDate) {
            result.preVipLvDate = date;
            result.preVipLevel = vipLevel;
            result.array = [];
            redisDB.SET(key, JSON.stringify(result));
        }

        callback(null, result);
    });
}
exports.getVipDailyGiftInfo = getVipDailyGiftInfo;

/**
 *保存每日福利状态信息
 * @param zid [int] 区ID
 * @param zuid [string] 角色ID
 * @param info [Welfare] 每日福利状态信息
 */
function setVipDailyGiftInfo(zid, zuid, info) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringVipDailyGiftByZuid, zuid);

    redisDB.SET(key, JSON.stringify(info));
}
exports.setVipDailyGiftInfo = setVipDailyGiftInfo;

/**
 *获取每周福利状态信息
 * @param zid [int] 区ID
 * @param zuid [string] 角色ID
 * @param index [int] 礼包表格序号
 * @param callback [func] 返回状态码和数据()
 */
function getVipWeeklyGiftInfo(zid, zuid, index, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key1 = redisClient.joinKey(redisKey.keyHashVipWeeklyGiftByZuid, zuid);
    var key2 = redisClient.joinKey(redisKey.keyStringVipWeeklyGiftTimeByZuid, zuid);
    var client = redisDB.MULTI();

    client.HGET(key1, index);
    client.GET(key2);
    client.EXEC(function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }

        var monday = timeUtil.getMondayTime();
        if(parseInt(result[1]) != monday) {
            redisDB.DEL(key1);
            redisDB.SET(key2, monday);
            result[0] = null;
        }

        if(result[0]) {
            result[0] = JSON.parse(result[0]);
        }
        else {
            result[0] = new globalObject.DealInfo();
            result[0].index = index;
        }

        callback(null, result[0]);
    });
}
exports.getVipWeeklyGiftInfo = getVipWeeklyGiftInfo;

/**
 *获取每周福利状态信息
 * @param zid [int] 区ID
 * @param zuid [string] 角色ID
 * @param callback [func] 返回状态码和数据
 */
function getAllVipWeeklyGiftInfo(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key1 = redisClient.joinKey(redisKey.keyHashVipWeeklyGiftByZuid, zuid);
    var key2 = redisClient.joinKey(redisKey.keyStringVipWeeklyGiftTimeByZuid, zuid);
    var client = redisDB.MULTI();

    client.HVALS(key1);
    client.GET(key2);
    client.EXEC(function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }

        var monday = timeUtil.getMondayTime();
        if(parseInt(result[1]) != monday) {
            redisDB.DEL(key1);
            redisDB.SET(key2, monday);
            callback(null, []);
            return;
        }

        var weeklyGifts = result[0];
        for(var i = 0; i < weeklyGifts.length; ++i) {
            weeklyGifts[i] = JSON.parse(weeklyGifts[i]);
        }
        callback(null, weeklyGifts);
    });
}
exports.getAllVipWeeklyGiftInfo = getAllVipWeeklyGiftInfo;

/**
 *保存每周福利状态信息
 * @param zid [int] 区ID
 * @param zuid [string] 角色ID
 * @param vipWeeklyGift [object] 每周福利对象
 */
function setVipWeeklyGiftInfo(zid, zuid, vipWeeklyGift) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashVipWeeklyGiftByZuid, zuid);

    redisDB.HSET(key, vipWeeklyGift.index, JSON.stringify(vipWeeklyGift));
}
exports.setVipWeeklyGiftInfo = setVipWeeklyGiftInfo;


/**
 * 获取周礼包红点时间戳
 * @param zid 区Id
 * @param zuid 角色Id
 * @param callback 返回错误码和结果
 */
function getVipWeeklyGiftTimeStamp(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringVipWeeklyGiftRedPointTimeStamp, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, parseInt(result));
        }
    });
}
exports.getVipWeeklyGiftTimeStamp = getVipWeeklyGiftTimeStamp;


/**
 * 设置周礼包红点时间戳
 * @param zid 区Id
 * @param zuid 角色Id
 * @param timeStamp 时间戳
 */
function setVipWeeklyGiftTimeStamp(zid, zuid, timeStamp) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringVipWeeklyGiftRedPointTimeStamp, zuid);

    redisDB.SET(key, timeStamp);
}
exports.setVipWeeklyGiftTimeStamp = setVipWeeklyGiftTimeStamp;

