
/**
 * 包含的头文件
 */
var async = require('async');
var dbManager = require("../../manager/redis_manager").Instance();
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var globalObject = require('../../common/global_object');

/**
 * 获取战斗力排行
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数result为角色ID
 */
var getPowerRanklist = function(zid, rk,  callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetZuidInPowerByZid, zid);

    redisDB.ZRANGE(key, 0, (rk - 1), function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**
 * 根据排名获取战斗力排名ID
 * @param zid [int] 区ID
 * @param rk [int] 排名
 * @param callback 返回错误码[int] (retCode) 和用户Id [int]
 */
var getPowerRankId = function(zid, rk, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetZuidInPowerByZid, zid);

    redisDB.ZRANGE(key, (rk - 1), rk, function(err, uid) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else
        {
            callback(null, uid);
        }
    });
};

/**
 * 更新战斗力排行
 * @param zid [int] 区ID
 * @param uid [int] 角色ID
 * @param power [int] 战斗力
 * @param newTime [int] 更新的时间
 */
var updatePowerRanklist = function(zid, uid, power, newTime) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetZuidInPowerByZid, zid);

    redisDB.ZADD(key, (power*(-1) + (-1)*power / newTime), uid);
};

/**
 * 获取战斗力排行的名次
 * @param zid [int] 区ID
 * @param uid [int] 角色ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数名次[int]
 */
var getPowerRanklistIndex = function(zid, uid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetZuidInPowerByZid, zid);

    redisDB.ZRANK(key, uid, function(err, index) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(index != null) {
            callback(null, index+1);
        }
        else {
            callback(null, -1);
        }
    });
};

/**
 * 获取角色等级排行
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数result为角色ID
 */
var getLevelRanklist = function(zid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetZuidInLevelByZid, zid);

    redisDB.ZRANGE(key, 0, 49, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**
 * 更新角色等级排行
 * @param zid [int] 区ID
 * @param zuid [int] 公会ID
 * @param level [int] 角色等级
 * @param newTime [int] 升级的时间
 */
var updateLevelRanklist = function(zid, zuid, level, newTime) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetZuidInLevelByZid, zid);

    redisDB.ZADD(key, parseInt((1000 - level) * Math.pow(10, 10) + newTime), zuid);
};

/**
 * 获取角色等级的名次
 * @param zid [int] 区ID
 * @param uid [int] 角色ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数名次[int]
 */
var getLevelRanklistIndex = function(zid, uid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetZuidInLevelByZid, zid);

    redisDB.ZRANK(key, uid, function(err, index) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(index != null) {
            callback(null, index+1);
        }
        else {
            callback(null, -1);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取战斗力排行
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数result为角色ID
 */
exports.getPowerRanklist = getPowerRanklist;

/**
 * 更新战斗力排行
 * @param zid [int] 区ID
 * @param uid [int] 角色ID
 * @param power [int] 战斗力
 * @param newTime [int] 更新的时间
 */
exports.updatePowerRanklist = updatePowerRanklist;

/**
 * 获取战斗力排行的名次
 * @param zid [int] 区ID
 * @param uid [int] 角色ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数名次[int]
 */
exports.getPowerRanklistIndex = getPowerRanklistIndex;

/**
 * 获取角色等级排行
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数result为角色ID
 */
exports.getLevelRanklist = getLevelRanklist;

/**
 * 更新角色等级排行
 * @param zid [int] 区ID
 * @param uid [int] 公会ID
 * @param level [int] 角色等级
 * @param newTime [int] 升级的时间
 */
exports.updateLevelRanklist = updateLevelRanklist;

/**
 * 获取角色等级的名次
 * @param zid [int] 区ID
 * @param uid [int] 角色ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数名次[int]
 */
exports.getLevelRanklistIndex = getLevelRanklistIndex;

/**
 * 根据排名获取战斗力排名ID
 * @param zid[int] 区ID
 * @param rk [int] 排名
 * @param callback 返回错误码[int] (retCode) 和用户Id [int]
 */
exports.getPowerRankId = getPowerRankId;