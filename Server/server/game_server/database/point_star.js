/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：点星相关功能
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


/**
 * 得到点星中保存当前到达的index
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）， 第二个参数data（当前到达的index）
 */
var getPointStarIndex = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPointStarIndexByZuid, zuid);

    redisDB.GET(key, function(err, data) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        if (null == data) {
            cb(null, 1);
            return;
        }
        cb(null, parseInt(data));
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 保存点星中保存当前到达的index到数据库中
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param index [int] 前到达的index
 */
var savePointStarIndex = function(zid, zuid, index) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPointStarIndexByZuid, zuid);

    redisDB.SET(key, index);
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 得到点星中保存当前到达的index
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）， 第二个参数data（当前到达的index）
 */
exports.getPointStarIndex = getPointStarIndex;

/**
 * 保存点星中保存当前到达的index到数据库中
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param index [int] 前到达的index
 */
exports.savePointStarIndex = savePointStarIndex;



