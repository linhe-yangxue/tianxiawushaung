/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取神秘商店中保存的数据,保存神秘商店中的数据
 * 开发者：许林(卢凯鹏重写)
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
var dbManager = require('../../manager/redis_manager').Instance();
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var retCode = require('../../common/ret_code');

/**
 *获取神秘商店的数据
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param callback [func] 回调函数，返回MysteryShop类对象
 */
var getMysteryShop = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringMysteryShopByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(null, new globalObject.MysteryShop());
        }
    });
};
exports.getMysteryShop = getMysteryShop;

/**
 * 保存神秘商店的数据
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param mysteryShop [object] MysteryShop类对象
 */
var setMysteryShop = function(zid, zuid, mysteryShop) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringMysteryShopByZuid, zuid);

    redisDB.SET(key, JSON.stringify(mysteryShop));
};
exports.setMysteryShop = setMysteryShop;
