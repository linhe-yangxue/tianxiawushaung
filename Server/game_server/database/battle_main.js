
/**
 * 包含的头文件
 */
var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取主线关卡地图
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数arr（地图信息数组中保存Battle对象）
 * @returns []
 */
var getBattleMainMap = function(zid, uid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashBattleMainByZuid, uid);

    redisDB.HVALS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
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
 * 队列尾部添加Battle对象
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param object [object] Battle对象
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var updateBattleMainMap = function(zid, uid, object, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashBattleMainByZuid, uid);
    var value = JSON.stringify(object);

    redisDB.HSET(key, object.battleId, value, function(err, data) {
        callback(err);
    });
};

/**
 * 通过关卡ID获取主线关卡
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param battleId [int] 主线关卡的ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）第二个参数object（成功返回Battle对象，失败返回null）
 * @returns []
 */
var getBattleMainByBattleId = function(zid, uid, battleId, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashBattleMainByZuid, uid);

    redisDB.HGET(key, battleId, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, JSON.parse(result));
        }
    });
};

/**
 * 获取已领取的关卡宝箱Id数组
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param callback [func] 返回错误码[int]和宝箱Id数组
 */
var getBattleBoxList = function(zid, uid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetBattleTaskBoxByZuid, uid);

    redisDB.SMEMBERS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**
 * 添加领取关卡宝箱Id
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param boxId [int] 宝箱Id
 * @param callback [func] 返回错误码[int]和操作是否成功[int]
 */
var addBattleBox = function(zid, uid, boxId, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetBattleTaskBoxByZuid, uid);

    redisDB.SADD(key, boxId, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取主线关卡地图
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数arr（地图信息数组中保存Battle对象）
 * @returns []
 */
exports.getBattleMainMap = getBattleMainMap;

/**
 * 队列尾部添加Battle对象
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param object [object] Battle对象
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.updateBattleMainMap = updateBattleMainMap;

/**
 * 通过关卡ID获取主线关卡
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param battleId [int] 主线关卡的ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）第二个参数object（成功返回Battle对象，失败返回null）
 * @returns []
 */
exports.getBattleMainByBattleId = getBattleMainByBattleId;

/**
 * 获取已领取的关卡宝箱Id数组
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param callback [func] 返回错误码[int]和宝箱Id数组
 */
exports.getBattleBoxList = getBattleBoxList;

/**
 * 添加领取关卡宝箱Id
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param boxId [int] 宝箱Id
 * @param callback [func] 返回错误码[int]和操作是否成功[int]
 */
exports.addBattleBox = addBattleBox;
