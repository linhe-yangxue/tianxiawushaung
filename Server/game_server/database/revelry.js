var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require('../../manager/redis_manager').Instance();
var csvManager = require('../../manager/csv_manager').Instance();
var protocolObject = require('../../common/protocol_object');


/**
 * 是否是排序类型
 * @param {number} n
 * @returns {boolean}
 */
function isRankType(n) {
    if(n == 6 || n == 21) {
        return true;
    }
    return false;
}
exports.isRankType = isRankType;

/**
 * 获取所有狂欢对象
 * @param zid {number} 区Id
 * @param zuid {number} 角色Id
 * @param callback {function} 返回错误码和狂欢对象数组
 */
function getAllRevelriesObjects(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashRevelryAwardRcdByZuid, zuid);

    redisDB.HGETALL(key, function(err, result) {
        var revelry;
        var revelries = [];

        if(err) {
            callback(err);
        }
        else {
            if(null == result) {
                result = {};
            }

            var revelryTable = csvManager.HDrevelry();
            for(var index in revelryTable) {
                revelry = new protocolObject.RevelryObject();
                revelry.revelryId = parseInt(index);

                if(result[index]) {
                    revelry.accepted = 1;
                }
                else {
                    revelry.accepted = 0;
                }
                revelries.push(revelry);
            }
            callback(null, revelries);
        }
    });
}
exports.getAllRevelriesObjects = getAllRevelriesObjects;

/**
 * 领取狂欢奖励
 * @param zid {number} 区Id
 * @param zuid {number} 角色Id
 * @param revelryId {number} 狂欢Id
 * @param callback {function} 返回错误码和领取状态
 */
function AcceptedRevelryAward(zid, zuid, revelryId, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashRevelryAwardRcdByZuid, zuid);

    redisDB.HSETNX(key, revelryId, 1, function(err, result) {
        if(err) {
            callback(err);
        }
        else if(result) {
            callback(null);
        }
        else {
            callback(retCode.REVELRY_ACCEPTED);
        }
    });
}
exports.AcceptedRevelryAward = AcceptedRevelryAward;

/**
 * 获取所有狂欢进度
 * @param zid {number} 区Id
 * @param zuid {number} 角色Id
 * @param callback {function} 返回错误码和狂欢进度数组
 */
function getAllRevelriesTypeProgress(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashRevelryProgressByZuid, zuid);

    redisDB.HGETALL(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            var progress = {};
            if(result) {
                progress = result;
            }

            for(var i = 0; i <= 40; ++i) {
                if(!progress.hasOwnProperty(i)) {
                    if(isRankType(i)) {
                        progress[i] = 5001;
                    }
                    else {
                        progress[i] = 0;

                    }
                }
            }
            callback(null, progress);
        }
    });
}
exports.getAllRevelriesTypeProgress = getAllRevelriesTypeProgress;

/**
 * 获取特定狂欢进度
 * @param zid {number} 区Id
 * @param zuid {number} 角色Id
 * @param revelryType {number} 狂欢类型
 * @param callback {function} 返回错误码和狂欢进度
 */
function getRevelryProgress(zid, zuid, revelryType, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashRevelryProgressByZuid, zuid);

    redisDB.HGET(key, revelryType, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, result);
        }
        else {
            if(isRankType(revelryType)) {
                callback(null, 5001);
            }
            else {
                callback(null, 0);
            }
        }
    });
}
exports.getRevelryProgress = getRevelryProgress;

/**
 * 设置狂欢进度
 * @param zid {number} 区Id
 * @param zuid {number} 角色Id
 * @param revelryType {number} 狂欢类型
 * @param value {number} 狂欢进度
 */
function setRevelryProgress(zid, zuid, revelryType, value) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashRevelryProgressByZuid, zuid);

    redisDB.HSET(key, revelryType, value);
}
exports.setRevelryProgress = setRevelryProgress;

/**
 * 增加狂欢进度
 * @param zid {number} 区Id
 * @param zuid {number} 角色Id
 * @param revelryType {number} 狂欢类型
 * @param value {number} 狂欢进度增量
 */
function IncrRevelryProgress(zid, zuid, revelryType, value) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashRevelryProgressByZuid, zuid);

    redisDB.HINCRBY(key, revelryType, value);
}
exports.IncrRevelryProgress = IncrRevelryProgress;
