/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：白名单
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
/**
 * 包含的头文件
 */
var dbManager = require('../../manager/redis_manager').Instance();
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var globalObject = require('../../common/global_object');

/**
 *获取全服白名单信息
 * @param zid [int] 区ID
 * @param callback [func] 返回多个WhiteListInfo对象
 */
var getAllWhiteList = function(zid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashWhiteListByZid, zid);

    redisDB.HVALS(key, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            var whiteArr = [];
            for (var i in data) {
                whiteArr[whiteArr.length] = JSON.parse(data[i]);
            }
            callback(null, whiteArr);
        }
    });
};

/**
 * 添加白名单信息
 * @param zid [int] 区ID
 * @param macList [Object] GM发来的所有mac
 * @param callback [func] 返回错误码[int]
 */
var addWhiteList = function(zid, macList, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashWhiteListByZid, zid);
    var client = redisDB.MULTI();

    var whiteListInfo = new globalObject.WhiteListInfo();
    whiteListInfo.time = parseInt(new Date().getTime()/1000);

    for(var i = 0; i < macList.length; i++) {
        whiteListInfo.mac = macList[i].toLowerCase();
        client.HSET(key, whiteListInfo.mac, JSON.stringify(whiteListInfo));
    }
    client.EXEC(function(err) {
        callback(err);
    })
};

/**
 * 删除白名单信息
 * @param zid [int] 区ID
 * @param macList [Object] GM发来的所有mac
 * @param callback [func] 返回错误码[int]
 */
var delWhiteList = function(zid, macList, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashWhiteListByZid, zid);
    var client = redisDB.MULTI();

    for(var i = 0; i < macList.length; i++) {
        client.HDEL(key, macList[i].toLowerCase());
    }
    client.EXEC(function(err) {
        callback(err);
    })
};

/**
 * 检查是否在白名单中
 * @param zid [int]
 * @param mac [string]
 * @param callback [func] 返回错误码[int]和是否在白名单[int]
 */
var isInWhiteList = function(zid, mac, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashWhiteListByZid, zid);

    redisDB.HEXISTS(key, mac.toLowerCase(), function(err, result) {
        if(err) {
            callback(err);
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
 *获取全服白名单信息
 * @param zid [int] 区ID
 * @param callback [func] 返回多个WhiteListInfo对象
 */
exports.getAllWhiteList = getAllWhiteList;

/**
 * 添加白名单信息
 * @param zid [int] 区ID
 * @param macList [Object] GM发来的所有mac
 * @param callback [func] 返回错误码[int]
 */
exports.addWhiteList = addWhiteList;

/**
 * 删除白名单信息
 * @param zid [int] 区ID
 * @param macList [Object] GM发来的所有mac
 * @param callback [func] 返回错误码[int]
 */
exports.delWhiteList = delWhiteList;

/**
 * 检查是否在白名单中
 * @param zid [int]
 * @param mac [string]
 * @param callback [func] 返回错误码[int]和是否在白名单[int]
 */
exports.isInWhiteList = isInWhiteList;
