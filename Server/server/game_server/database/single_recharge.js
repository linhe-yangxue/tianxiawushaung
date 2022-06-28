/**
 * 包含的头文件
 */
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var dbManager = require('../../manager/redis_manager').Instance();
var retCode = require('../../common/ret_code');
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');

/**
 * 获取最后充值时间
 * @param zid 区Id
 * @param zuid 角色Id
 * @param callback 返回错误码和最后充值时间
 */
exports.getLastRechargeTime = function (zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLastRechargeTimeByZuid, zuid);
    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, parseInt(result));
        }
    });
};

/**
 * 更新最后充值时间
 * @param zid 区Id
 * @param zuid 角色Id
 * @param time 最后充值时间
 */
exports.setLastRechargeTime = function (zid, zuid, time) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLastRechargeTimeByZuid, zuid);
    redisDB.SET(key, time);
};

/**
 * 获取所有单冲活动信息
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 * @param callback 返回单冲活动信息数组
 */
exports.getAllSingleRecharges = function (zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashSingleRechargeByZuid, zuid);

    redisDB.HVALS(key, function(err, result) {
        if(err) {
            callback(err);
        }
        else {
            for(var i = 0; i < result.length; ++i) {
                result[i] = JSON.parse(result[i]);
            }
            callback(null, result);
        }
    });
};

/**
 * 删除所有单冲活动信息
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 * @param callback [func] 返回错误码
 */
exports.delAllSingleRecharges = function (zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashSingleRechargeByZuid, zuid);

    redisDB.DEL(key, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 获取指定单冲活动信息
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 * @param index [int] 单冲活动序号
 * @param callback 返回单冲活动信息对象
 */
exports.getSingleRecharge = function (zid, zuid, index, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashSingleRechargeByZuid, zuid);

    redisDB.HGET(key, index, function(err, result) {
        if(err) {
            callback(err);
        }
        else {
            if(result) {
                callback(null, JSON.parse(result));
            }
            else {
                var sr = new protocolObject.SingleRecharge();
                sr.index = index;
                callback(null, sr);
            }
        }
    });
};

/**
 * 更新指定单冲活动信息
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 * @param sr [object] 单冲活动对象
 */
exports.setSingleRecharge = function (zid, zuid, sr) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashSingleRechargeByZuid, zuid);

    redisDB.HSET(key, sr.index, JSON.stringify(sr));
};

