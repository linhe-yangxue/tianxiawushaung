/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：首冲礼包数据库操作
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var redisKey = require('../../../common/redis_key');
var redisClient = require('../../../tools/redis/redis_client');
var retCode = require('../../../common/ret_code');
var dbManager = require('../../../manager/redis_manager').Instance();



/**
 *首冲礼包是否已领取
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回状态码和数组数据
 * @returns {void}
 */
var acceptAwardBefore = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFirstChargeReceiveByZuid, zuid);

    redisDB.GET(key, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, data);
    });
};

/**
 *首冲礼包领取
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 */
var acceptFirstChargeAward = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFirstChargeReceiveByZuid, zuid);

    redisDB.SET(key,  1, function(err) {});
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

exports.acceptAwardBefore = acceptAwardBefore;
exports.acceptFirstChargeAward = acceptFirstChargeAward;
