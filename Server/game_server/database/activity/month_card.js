/**
* ---------------------------------------------------------------------------------------------------------------------
* 文件描述：月卡
* 开发者：许林
* 开发者备注：
* 审阅者：
* 优化建议：
* ---------------------------------------------------------------------------------------------------------------------
*/
var redisKey = require('../../../common/redis_key');
var redisClient = require('../../../tools/redis/redis_client');
var dbManager = require('../../../manager/redis_manager').Instance();
var retCode = require('../../../common/ret_code');
var dateFormat = require('dateformat');


/**
 *月卡奖励是否已领取
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param index [int] 配表索引
 * @param cb [func] 返回状态码 1：未领取 0：已领取
 * @returns {void}
 */
var receiveBefore = function(zid, zuid, index, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashMonthCardByZuid, zuid);

    redisDB.HSETNX(key, index, index, function(err, flag) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, flag);
    });
};

/**
 *获取上次请求的时间并保存这次请求的时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳
 * @param cb [func] 返回上次请求时间
 * @returns {void}
 */
var getSetFreshTime = function(zid, zuid, time, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringCardTimeByZuid, zuid);

    redisDB.GETSET(key, time, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(null == data) {
            data = time;
        }
        cb(null, parseInt(data));
    });
};

/**
 *获取所有月卡领取信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param lastTime [int] 上次请求时间戳
 * @param zeroTime [int] 当天零点时间戳
 * @param cb [func] 回调所有月卡领取信息
 */
var getCardInfo = function(zid, zuid, lastTime, zeroTime, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashMonthCardByZuid, zuid);

    if(lastTime < zeroTime) {
        redisDB.DEL(key);
        cb(null, []);
        return;
    }
    redisDB.HVALS(key, function(err, array) {
        if(err) {
            cb(err);
        }
        else {
            for(var i = 0; i < array.length; ++i) {
                array[i] = parseInt(array[i]);
            }
            cb(null, array);
        }
    });
};

/**
 *保存所购月卡的结束期限
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfId [int] 商品在配表中的索引
 * @param cb [function] 回调出是否成功
 */
var saveMonthCardDate = function(zid, zuid, shelfId, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashCporderDateByZuid, zuid);

    redisDB.HGET(key, shelfId, function(err, date) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var todayDate = dateFormat(new Date().toDateString(), 'yyyy-mm-dd');
        todayDate = new Date(todayDate);
        date = new Date(date);
        date = todayDate > date ? todayDate:date;
        date.setDate(date.getDate() + 30);
        date = dateFormat(date.toDateString(), 'yyyy-mm-dd');
        redisDB.HSET(key, shelfId, date);
        cb(null);
    });
};

/**
 *获取大或小月卡的結束期限
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfId [int] 商品在配表中的索引
 * @param cb [function] 回调出订单号数组
 */
var getMonthCardDate = function(zid, zuid, shelfId, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashCporderDateByZuid, zuid);

    redisDB.HGET(key, shelfId, function(err, dateStr) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, dateStr);
    });
};

/**
 *获取大和小月卡的結束期限
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfIdX [int] 商品在配表中的索引
 * @param shelfIdY [int] 商品在配表中的索引
 * @param cb [function] 回调出订单号数组
 */
var getMonthCardsDates = function(zid, zuid, shelfIdX, shelfIdY, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashCporderDateByZuid, zuid);

    redisDB.HMGET(key, shelfIdX, shelfIdY, function(err, array) {
        if(err) {
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
 *月卡奖励是否已领取
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param index [int] 配表索引
 * @param cb [func] 返回状态码 1：未领取 0：已领取
 * @returns {void}
 */
exports.receiveBefore = receiveBefore;
/**
 *获取上次请求的时间并保存这次请求的时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳
 * @param cb [func] 返回上次请求时间
 * @returns {void}
 */
exports.getSetFreshTime = getSetFreshTime;
/**
 *获取所有月卡领取信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 回调所有月卡领取信息
 */
exports.getCardInfo = getCardInfo;
/**
 *保存所购月卡的结束期限
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfId [int] 商品在配表中的索引
 * @param cb [function] 回调出是否成功
 */
exports.saveMonthCardDate = saveMonthCardDate;
/**
 *获取大或小月卡的結束期限
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfId [int] 商品在配表中的索引
 * @param cb [function] 回调出订单号数组
 */
exports.getMonthCardDate = getMonthCardDate;
/**
 *获取大和小月卡的結束期限
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfIdX [int] 商品在配表中的索引
 * @param shelfIdY [int] 商品在配表中的索引
 * @param cb [function] 回调出订单号数组
 */
exports.getMonthCardsDates = getMonthCardsDates;




