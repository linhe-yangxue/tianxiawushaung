/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取游戏：加入新通知，获取通知
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();


/**
 * 加入新通知
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param notif [int] 通知类型
 * @return []
 */
var addNotification = function(zid, uid, notif) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetNotificationByZuid, uid);

    redisDB.SADD(key, notif);
};

/**
 * 获取通知
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param callback [func] 返回错误码[int](retCode)和通知数组[arr]
 */
var getNotification = function(zid, uid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetNotificationByZuid, uid);

    redisDB.SMEMBERS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            redisDB.DEL(key);
            for(var i = 0; i < result.length; ++i) {
                result[i] = parseInt(result[i]);
            }
            callback(null, result);
        }
        else {
            callback([]);
        }
    });
};



/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 加入新通知
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param notif [int] 通知类型
 * @return []
 */
exports.addNotification = addNotification;

/**
 * 获取通知
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param callback [func] 返回错误码[int](retCode)和通知数组[arr]
 */
exports.getNotification = getNotification;
