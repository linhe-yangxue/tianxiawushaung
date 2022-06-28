/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：爬塔（群魔乱舞）：获取爬塔数据，保存爬塔数据
 * 开发者：卢凯鹏
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
var globalObject = require('../../common/global_object');
var dbManager = require("../../manager/redis_manager").Instance();

/**
 * 获取爬塔数据
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和数据[TowerClimbingInfo]
 * @returns []
 */
var getTowerClimbingInfo = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringTowerClimbingInfoByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(null, new globalObject.TowerClimbingInfo());
        }
    });
};

/**
 * 保存爬塔数据
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param towerClimbingInfo [object] 爬塔信息
 * @param callback [func] 返回错误码[int](retCode)
 * @returns []
 */
var setTowerClimbingInfo = function(zid, zuid, towerClimbingInfo, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringTowerClimbingInfoByZuid, zuid);
    var value = JSON.stringify(towerClimbingInfo);

    redisDB.SET(key, value, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 获取星数排行
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数result为角色ID的集合
 */
var getStarsRanklist = function(zid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedTowerClimbStarsRankByZid, zid);

    redisDB.ZRANGE(key, 0, 19, 'WITHSCORES', function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**
 * 更新星数排行
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param stars [int] 历史所获得最高星星数量
 */
var updateStarsRanklist = function(zid, zuid, stars, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedTowerClimbStarsRankByZid, zid);

    redisDB.ZADD(key, stars*(-1), zuid, function (err) {
        if(cb) {
            cb(err);
        }
    });
};

/**
 * 获取星数排行的名次
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数名次[int]
 */
var getStarsRanklistIndex = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedTowerClimbStarsRankByZid, zid);

    redisDB.ZRANK(key, zuid, function(err, index) {
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
 * 删除某角色的爬天梯信息及排行
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var delStarsRank = function(zid, zuid, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    var keyRank = redisClient.joinKey(redisKey.keySortedTowerClimbStarsRankByZid, zid);
    redisDB.ZREM(keyRank, zuid);
    var key = redisClient.joinKey(redisKey.keyStringTowerClimbingInfoByZuid, zuid);
    redisDB.DEL(key);
    callback(null);
};


/**
 * 保存爬塔失败后推荐道具价格
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param  price [int] 现价
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var setGroupPrice = function (zid, zuid, price, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    var key = redisClient.joinKey(redisKey.keyStringTowerClimbinggroupPriceByZuid, zuid);
    redisDB.SET(key, JSON.stringify(price));
    callback(null);
};

/**
 * 取出爬塔失败后推荐道具价格
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param callback [func] 回调函数
 */
var getGroupPrice = function (zid, zuid,callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    var key = redisClient.joinKey(redisKey.keyStringTowerClimbinggroupPriceByZuid, zuid);
    redisDB.GET(key, function (err, price) {
            if(err){
                callback(retCode.DB_ERR);
            }
            else if(null == price){
                callback(null, [0,0]);
            }
            else{
                callback(null, JSON.parse(price));
            }
        }
    );
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取爬塔数据
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和数据[TowerClimbingInfo]
 * @returns []
 */
exports.getTowerClimbingInfo = getTowerClimbingInfo;

/**
 * 保存爬塔数据
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param towerClimbingInfo [object] 爬塔信息
 * @param callback [func] 返回错误码[int](retCode)
 * @returns []
 */
exports.setTowerClimbingInfo = setTowerClimbingInfo;

/**
 * 获取星数排行
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数result为角色ID的集合
 */
exports.getStarsRanklist = getStarsRanklist;

/**
 * 更新星数排行
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param stars [int] 历史所获得最高星星数量
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.updateStarsRanklist = updateStarsRanklist;

/**
 * 获取星数排行的名次
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数名次[int]
 */
exports.getStarsRanklistIndex = getStarsRanklistIndex;

/**
 * 删除某角色的爬天梯信息及排行
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.delStarsRank = delStarsRank;

/**
 * 保存爬塔失败后推荐道具价格
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param  price [int] 现价
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.setGroupPrice = setGroupPrice;

/**
 * 取出爬塔失败后推荐道具价格
 * @param zid [int] 区ID
 * @param zuid [int] 角色Id
 * @param callback [func] 回调函数
 */
exports.getGroupPrice = getGroupPrice;