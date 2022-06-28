/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：日常副本相关功能
 * 开发者：王强
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
/**
 * 包含的头文件
 */
var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();

/**
 * 获取每日副本的信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param type [int] 每日副本的TYPE
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）， 第二个参数data（每日副本的信息）
 */
var getDailyStage = function (zid, uid, type, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyStageByZuid, uid);
    var field = type;

    redisDB.HGET(key, field, function(err, data) {
        if(!!err) {
            cb(err);
            return;
        }
        if(undefined === data || null === data) {
            cb(retCode.DAILY_STAGE_NOT_EXIST);
            return;
        }
        cb(err, JSON.parse(data));
    });
};

/**
 * 设置每日副本的信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param dailyStage [Object] 每日副本的信息
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var setDailyStage = function (zid, uid, dailyStage, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyStageByZuid, uid);
    var field = dailyStage.type;

    redisDB.HSET(key, field, JSON.stringify(dailyStage), function(err) {
        cb(err);
    });
};

/**
 * 获取每日副本的所有信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）， 第二个参数data（每日副本的所有信息）
 */
var getAllDailyStage = function (zid, uid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyStageByZuid, uid);

    redisDB.HVALS(key, function(err, data) {
        if(!!err) {
            cb(err);
            return;
        }
        for(var i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        cb(err, data);
    });
};

/**
 * 获取每日副本的详细信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param mid [int] 每日副本的INDEX
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）， 第二个参数data（每日副本的详细信息）
 */
var getDailyStageDetail = function (zid, uid, mid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyStageDetailByZuid, uid);
    var field = mid;

    redisDB.HGET(key, field, function(err, data) {
        if(!!err) {
            cb(err);
            return;
        }
        if(undefined === data || null === data) {
            cb(retCode.DAILY_STAGE_DETAIL_NOT_EXIST);
            return;
        }
        cb(err, JSON.parse(data));
    });
};

/**
 * 设置每日副本的详细信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param dailyStageDetail [Object] 每日副本的详细信息
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var setDailyStageDetail = function (zid, uid, dailyStageDetail, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyStageDetailByZuid, uid);
    var field = dailyStageDetail.mid;

    redisDB.HSET(key, field, JSON.stringify(dailyStageDetail), function(err) {
        cb(err)
    });
};

/**
 * 获取所有每日副本的详细信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）， 第二个参数data（所有每日副本的详细信息）
 */
var getAllDailyStageDetail = function (zid, uid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyStageDetailByZuid, uid);

    redisDB.HVALS(key, function(err, data) {
        if(!!err) {
            cb(err);
            return;
        }
        for(var i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        cb(err, data);
    });
};

exports.getDailyStage = getDailyStage;
exports.setDailyStage = setDailyStage;
exports.getAllDailyStage = getAllDailyStage;
exports.getDailyStageDetail = getDailyStageDetail;
exports.setDailyStageDetail = setDailyStageDetail;
exports.getAllDailyStageDetail = getAllDailyStageDetail;