/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取玩家翻牌的状态，保存玩家翻牌的状态
 * 开发者：邱峰
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
 *获取玩家翻牌的状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳 用于保存 翻牌时间
 * @param callback [func] 返回 剩余次数 翻牌时间
 * @returns []
 */
var getCardState = function(zid, zuid, time, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLuckyCardByZuid, zuid);

    redisDB.GET(key, function(err,data){
        if(err){
            callback(retCode.DB_ERR);
            return;
        }
        if(null == data){
            var cardState = new globalObject.CardState();
            cardState.residueNum = 3;
            cardState.theLastTime = time;
            callback(null, cardState);
        }
        else{
            callback(null, JSON.parse(data));
        }
    });
};

/**
 *保存玩家翻牌的状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳 用于保存 当前翻牌时间
 * @param cardState [func] 返回 剩余次数 翻牌时间
 * @returns []
 */
var saveCardState = function(zid, zuid, cardState){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringLuckyCardByZuid, zuid);

    redisDB.SET(key, JSON.stringify(cardState));
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 *获取玩家翻牌的状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳 用于保存 翻牌时间
 * @param residueNum [func] 返回 剩余次数 翻牌时间
 * @returns []
 */
exports.getCardState = getCardState;
/**
 *保存玩家翻牌的状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳 用于保存 当前翻牌时间
 * @param residueNum [func] 返回 剩余次数 翻牌时间
 * @returns []
 */
exports.saveCardState = saveCardState;