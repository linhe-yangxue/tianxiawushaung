/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取玩家摇钱的状态, 保存玩家摇钱的状态
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var dbManager = require('../../../manager/redis_manager').Instance();
var redisKey = require('../../../common/redis_key');
var redisClient = require('../../../tools/redis/redis_client');
var retCode = require('../../../common/ret_code');
var globalObject = require('../../../common/global_object');

/**
 *获取玩家摇钱的状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳 用于保存初次获取摇钱状态时间
 * @param cb [func] 返回状态码和数据(摇钱状态，TreeState类对象)
 * @returns []
 */
var getShakeState = function(zid, zuid, time, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringShakeTreeByZuid, zuid);

    redisDB.GET(key,function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(null == data) {
            var treeState = new globalObject.TreeState();
            treeState.shakeTime = 0;
            treeState.refreshTime = time;
            cb(null, treeState);
            return;
        }
        cb(null, JSON.parse(data));
    });
};


/**
 *保存玩家摇钱的状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param state [TreeState] 摇钱状态
 * @returns []
 */
var saveShakeState = function(zid, zuid, state) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringShakeTreeByZuid, zuid);

    redisDB.SET(key, JSON.stringify(state));
};


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 *获取玩家摇钱的状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳 用于保存初次获取摇钱状态时间
 * @param cb [func] 返回状态码和数据(摇钱状态，TreeState类对象)
 * @returns []
 */
exports.getShakeState = getShakeState;

/**
 *保存玩家摇钱的状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param state [TreeState] 摇钱状态
 * @param cb [func] 返回状态码
 * @returns []
 */
exports.saveShakeState = saveShakeState;

