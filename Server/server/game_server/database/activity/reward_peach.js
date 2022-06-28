/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取玩家领仙桃信息, 保存玩家领仙桃信息
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
var dbManager = require('../../../manager/redis_manager').Instance();
var retCode = require('../../../common/ret_code');
var globalObject = require('../../../common/global_object');

/**
 *获取玩家领仙桃信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳 用于保存初次领取仙桃时间
 * @param cb [func] 返回状态码和数据(PeachInfo类对象)
 * @returns []
 */
var getPeachInfo = function(zid, zuid, time, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringRewardPowerByZuid, zuid);

    redisDB.GET(key,function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(null == data) {
            var peachInfo = new globalObject.PeachInfo();
            peachInfo.freshTime = time;
            cb(null, peachInfo);
            return;
        }
        cb(null, JSON.parse(data));
    });
};

/**
 *保存玩家领仙桃信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param info [PeachInfo] 领仙桃状态信息
 * @returns []
 */
var savePeachInfo = function(zid, zuid, info) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringRewardPowerByZuid, zuid);

    redisDB.SET(key, JSON.stringify(info));
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *获取玩家领仙桃信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳 用于保存初次领取仙桃时间
 * @param cb [func] 返回状态码和数据(PowerInfo类对象)
 * @returns []
 */
exports.getPeachInfo = getPeachInfo;

/**
 *保存玩家领仙桃信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param info [PeachInfo] 领仙桃状态信息
 * @param cb [func] 返回状态码
 * @returns []
 */
exports.savePeachInfo = savePeachInfo;