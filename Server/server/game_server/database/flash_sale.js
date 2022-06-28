/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：竞技场
 * 开发者：应琪瑜
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
var retCode = require('../../common/ret_code');
var csvManager = require('../../manager/csv_manager').Instance();
var dbManager = require("../../manager/redis_manager").Instance();
var globalObject = require('../../common/global_object');
var rand = require('../../tools/system/math').rand;
var accountDb = require('./account');
var redisClient = require('../../tools/redis/redis_client');

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取限时抢购商品记录
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb 返回错误码[int] (retCode)
 */
var getFlashSaleItems = function(zid, zuid, cb) {
    var dbConnArrGlobal = dbManager.getZoneRedisClient();
    var key = redisClient.joinKey(redisKey.keyStringFlashSaleItemsByZuid, zuid);
    var redisDB = dbConnArrGlobal.getDB(zid);

    redisDB.GET(key, function (err, results) {
        if(!!err) {
            cb(err);
            return;
        }
        if(null === results) {
            cb(null, []);
            return;
        }
        cb(null, JSON.parse(results));
    });
};
exports.getFlashSaleItems = getFlashSaleItems;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取限时抢购商品记录
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param flashSaleItems [array] 限时抢购商品
 * @param cb 返回错误码[int] (retCode)
 */
var setFlashSaleItems = function (zid, zuid, flashSaleItems, cb) {
    var dbConnArrGlobal = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGlobal.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFlashSaleItemsByZuid, zuid);
    redisDB.SET(key, JSON.stringify(flashSaleItems), cb);
}
exports.setFlashSaleItems = setFlashSaleItems;