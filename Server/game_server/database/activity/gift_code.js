/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取礼品码的兑换次数， 保存礼品码的兑换次数
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
 * 获取礼品码是否兑换
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param giftType [int] 礼品码类型
 * @param cb [func] 返回状态码和已兑换次数
 */
var giftCodeExchange = function(zid, zuid, giftType, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetGiftCodeByZuid, zuid);

    redisDB.SISMEMBER(key, giftType, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, data);
    });
};
exports.giftCodeExchange = giftCodeExchange;

/**
 * 保存礼品码的礼品类型
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param value [int] 礼品码的礼品类型
 */
var saveGiftCodeExchange = function(zid, zuid, value) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetGiftCodeByZuid, zuid);

    redisDB.SADD(key, value);
};
exports.saveGiftCodeExchange = saveGiftCodeExchange;
