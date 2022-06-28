/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取普通抽奖和高级抽奖的状态以及抽奖免费次数刷新时间,保留普通抽奖和高级抽奖的状态和该次请求的时间以便下次刷新
 *           比较,获取普通抽奖和高级抽奖的GroupID,获取普通抽奖和高级抽奖的GroupID,获取用于刷新抽奖状态信息的时间
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var redisKey = require("../../common/redis_key");
var redisClient = require('../../tools/redis/redis_client');
var dbManager = require('../../manager/redis_manager').Instance();
var retCode = require("../../common/ret_code");
var logger = require('../../manager/log4_manager');
var globalObject = require('../../common/global_object');

/**
 * 获取抽奖信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param isNormal [boolean] 是否为普通抽奖
 * @param cb [func] 回调函数 返回玩家的普通或高级抽奖信息
 */
var getLottery = function(zid, zuid, isNormal, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    var key;
    if(isNormal) {
        key = redisClient.joinKey(redisKey.keyStringNormalLotteryByZuid, zuid);
    }
    else {
        key = redisClient.joinKey(redisKey.keyStringPreciousLotteryByZuid, zuid);
    }

    redisDB.GET(key, function(err, result) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }

        if(null == result) {
            var lottery = new globalObject.Lottery();
            cb(null, lottery);
        }
        else {
            cb(null, JSON.parse(result));
        }
    });
};
exports.getLottery = getLottery;

/**
 * 保存抽奖信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param isNormal [boolean] 是否为普通抽奖
 * @param lottery [NormalLottery] 存储抽奖信息类
 */
var setLottery = function(zid, zuid, isNormal, lottery) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key;

    if(isNormal) {
        key = redisClient.joinKey(redisKey.keyStringNormalLotteryByZuid, zuid);
    }
    else {
        key = redisClient.joinKey(redisKey.keyStringPreciousLotteryByZuid, zuid);
    }

    redisDB.SET(key, JSON.stringify(lottery));
};
exports.setLottery = setLottery;


/**
 * 获取抽奖的次数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param isNormal [boolean] 是否为普通抽奖
 * @param cb [func] 回调函数 返回玩家的普通和高级抽奖所需的掉落ID
 */
var getLotteryCnt = function(zid, zuid, isNormal, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key;
    if(isNormal) {
        key = redisClient.joinKey(redisKey.keyStringNormalIdByZuid, zuid);
    }
    else {
        key = redisClient.joinKey(redisKey.keyStringPreciousIdByZuid, zuid);
    }

    redisDB.GET(key, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }

        if(null == data) {
            cb(null, 0);
        }
        else {
            cb(null, parseInt(data));
        }
    });
};
exports.getLotteryCnt = getLotteryCnt;

/**
 *保存抽奖的次数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param isNormal [boolean] 是否为普通抽奖
 * @param cnt [int] 抽奖的掉落ID
 */
var setLotteryCnt = function(zid, zuid, isNormal, cnt) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key;
    if(isNormal) {
        key = redisClient.joinKey(redisKey.keyStringNormalIdByZuid, zuid);
    }
    else {
        key = redisClient.joinKey(redisKey.keyStringPreciousIdByZuid, zuid);
    }

    redisDB.SET(key, cnt);
};
exports.setLotteryCnt = setLotteryCnt;
