/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取玩家射手乐园信息, 保存玩家射手乐园信息
 * 开发者：余金堂
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
var dbManager = require("../../../manager/redis_manager").Instance();
var globalObject = require('../../../common/global_object');

/**
 * 获取射手乐园射击次数和时间
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param callback [function] 返回错误码[int](retCode)和数据(累计金额和已射击次数)
 */

var getShoot = function(zid, uid, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringShootStateByZuid, uid);

    redisDB.GET(key, function(err, shoot){
        if(err){
            callback(retCode.DB_ERR);
        }
        else if(null === shoot){
            var firstShoot = new globalObject.Shoot();
            callback(null, firstShoot);
        }
        else{
            callback(null, JSON.parse(shoot));
        }
    });
};

/**
 *保存射手乐园信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param shoot [Shoot] 射手乐园对象
 */
var saveShoot = function(zid, uid, shoot){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringShootStateByZuid, uid);

    redisDB.SET(key, JSON.stringify(shoot));
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 /**
 * 获取射手乐园射击次数和时间
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param callback[function] 返回错误码[int](retCode)和数据(累计金额和已射击次数)
 */
exports.getShoot = getShoot;
/**
 *保存射手乐园信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param shoot [Shoot] 射手乐园对象
 */
exports.saveShoot = saveShoot;