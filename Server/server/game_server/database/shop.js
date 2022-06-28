/**
* ---------------------------------------------------------------------------------------------------------------------
* 文件描述：获取商店中所有物品的购买状态以及在商店请求所有物品状态时的时间，获取单个物品的购买状态，保存单个物品的购买状态
 *          到刷新时间清空所有物品的购买状态为初始状态
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
var globalObject = require('../../common/global_object');
var shopCommon = require('../common/shop_common');
var async = require('async');


/**
 * 根据type获取相应类型商店所有物品购买信息
 *@param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param type [string] 标志不同商店key
 * @param cb [func] 返回所有商品的购买状态
 */
var getShopItemsInfo = function(zid, zuid,  type, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = shopCommon.getShopKeyByType(-1, zuid, type);

    redisDB.HVALS(key, function(err, array) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var len = array.length;
        if(len > 0) {
            for(var i = 0; i < len; ++i) {
                array[i] = JSON.parse(array[i]);
            }
        }
        cb(null, array);
    });
};

/**
 *根据type获取相应类型商店单个物品购买信息
 * @param zid [int] 区ID
 * @param zuid [int] 角色ID
 * @param zgid [int] 公会ID
 * @param field [int] 商品配表里的索引作为域
 * @param type [string] 标志不同商店key
 * @param cb [func] 返回单个商品的购买状态
 */
var getShopItemInfo = function(zid, zgid, zuid, field, type, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key  = shopCommon.getShopKeyByType(zgid, zuid, type);

    redisDB.HGET(key, field, function(err, itemInfo) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }

        if(null == itemInfo) {
            var buyObject = new globalObject.DealInfo();
            buyObject.index = field;
            cb(null, buyObject);
        }
        else {
            cb(null, JSON.parse(itemInfo));
        }
    });
};

/**
 *根据type保存相应类型商店单个物品购买信息
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 角色ID
 * @param field [int] 商品配表里的索引作为域
 * @param value [DealInfo] DealInfo 类对象
 * @param type [string] 标志不同商店key
 */
var saveShopItemInfo = function(zid, zgid, zuid, field, value, type) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = shopCommon.getShopKeyByType(zgid, zuid, type);

    redisDB.HSET(key, field, JSON.stringify(value));
};

/**
 *限购物品数量零点清零
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 角色ID
 * @param shopData [object] csv配表对象
 * @param type [string] 标志不同商店key
 * @param cb [func] 返回清空所有商品的购买状态是否成功
 */
var refreshShopItemsInfo =function(zid, zgid, zuid, shopData, type, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = shopCommon.getShopKeyByType(zgid, zuid, type);
    var map =null;

    async.waterfall([
        function(callback) {
            redisDB.HVALS(key, callback);
        },
        function(array, callback) {
            for(var i = array.length -1; i >= 0; i--) {
                array[i] = JSON.parse(array[i]);
                map = map ? map : {};
                if(1 == shopData[array[i].index].REFRESH_BYDAY) {
                    var object = new globalObject.DealInfo();
                    object.index = array[i].index;
                    array[i].buyNum = 0;
                    map[array[i].index] = JSON.stringify(object);
                }
            }

            if(map) {
                redisDB.HMSET(key, map, function(err) {});
            }
            callback(null, array);
        }
    ],cb);
};

/**
 * 根据type获取对应商店的请求时间
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 用户ID
 * @param value [long] 时间戳
 * @param type [string] 标志不同商店key
 */
var getRefreshTime = function(zid, zgid, zuid, value, type, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = shopCommon.getShopReqTimeKeyByType(zgid, zuid, type);

    redisDB.GET(key, function (err, time) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }

        time = time ? Number(time) : value;
        cb(null, time);
    });
};

/**
 * 根据type获取并设置对应商店的请求时间
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 用户ID
 * @param value [long] 时间戳
 * @param type [string] 标志不同商店key
 */
var getSetRefreshTime = function(zid, zgid, zuid, value, type, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = shopCommon.getShopReqTimeKeyByType(zgid, zuid, type);

    redisDB.GETSET(key, value, function(err, time) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        time = time ? Number(time) : value;
        cb(null, time);
    });
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

exports.getShopItemsInfo = getShopItemsInfo;
exports.getShopItemInfo = getShopItemInfo;
exports.saveShopItemInfo = saveShopItemInfo;
exports.refreshShopItemsInfo = refreshShopItemsInfo;
exports.getRefreshTime = getRefreshTime;
exports.getSetRefreshTime = getSetRefreshTime;