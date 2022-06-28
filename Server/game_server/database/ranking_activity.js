var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require('../../manager/redis_manager').Instance();
var csvManager = require('../../manager/csv_manager').Instance();
var protocolObject = require('../../common/protocol_object');


/**
 * 设置排名活动红点日期
 * @param zid 区Id
 * @param zuid 角色Id
 * @param date 日期
 */
var setRankingActivityRedPointDate = function(zid, zuid, date) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringRankActRdPtDateByZuid, zuid);

    redisDB.SET(key, date);
};
exports.setRankingActivityRedPointDate = setRankingActivityRedPointDate;


/**
 * 获取排名活动红点日期
 * @param zid 区Id
 * @param zuid 角色Id
 * @param callback 返回错误码和日期
 */
var getRankingActivityRedPointDate = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringRankActRdPtDateByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, result);
        }
    });
};
exports.getRankingActivityRedPointDate = getRankingActivityRedPointDate;
