/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取新手引导进度  保存新手引导进度
 * 开发者：许林
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
var dbManager = require('../../manager/redis_manager').Instance();
var retCode = require('../../common/ret_code');

/**
 *获取新手引导进度
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 回调函数，返回新手引导进度
 */
var getGuideProgress = function(zid, uid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringGuideProgressByZuid, uid);

    redisDB.GET(key, function(err, progress) {
        if(err) {
            cb(retCode.DB_ERR);
        }
        if(null == progress) {
            cb(null, 0);
        }
        else {
            cb(null, parseInt(progress));
        }
    });
};

/**
 *保存新手引导进度
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param value [int] 新手引导进度
 */
var saveGuideProgress = function(zid, uid, value) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringGuideProgressByZuid, uid);

    redisDB.SET(key, value);
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *获取新手引导进度
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 回调函数，返回新手引导进度
 */
exports.getGuideProgress = getGuideProgress;
/**
 *保存新手引导进度
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param value [int] 新手引导进度
 * @param cb [func] 回调函数，保存是否成功
 */
exports.saveGuideProgress = saveGuideProgress;

