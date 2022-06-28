/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取非限时物品的购买状态 获取所有限时物品在整个公会的购买状态,获取单个限时物品在整个工会的购买状态,保存单个
 *           限时物品的购买状态,到刷新时间段进行刷新操作
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var dbManager = require('../../manager/redis_manager').Instance();
var csvManager = require('../../manager/csv_manager').Instance();
var retCode = require('../../common/ret_code');
var math = require('../../tools/system/math');
var globalObject = require('../../common/global_object');


/**
 *获取非限时物品的购买状态
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)和数据(非限时商品的购买状态和公会个人的非限时物品的购买状态)
 */
var getGuildShopItemsInfo = function(zid, zgid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyOtherBuyNum = redisClient.joinKey(redisKey.keyHashGuildOtherBuyByZgidZuid, zgid, zuid );

    redisDB.HVALS(keyOtherBuyNum, function(err, array) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        for(var i = array.length-1; i >= 0; i--) {
            array[i] = JSON.parse(array[i]);
        }
        cb(null, array);
    });

};

/**
 *  获取所有限时物品在整个公会的购买状态
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 角色id
 * @param cb [func]
 */
var getGuildLimitShopItemsInfo = function(zid, zgid, zuid, level, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashPublicLimNumByZgid, zgid);
    var keyPrivateLimNum = redisClient.joinKey(redisKey.keyHashGuildPrivateLimBuyByZgidZuid, zgid, zuid);
    var client = redisDB.MULTI();

    client.HVALS(key);
    client.HVALS(keyPrivateLimNum);
    client.EXEC(function(err, results) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }

        var pubArr = []; /* 存储公会商店所有物品的购买状态 DealInfo 类对象数组 */
        var priArr = results[1];

        if(0 == results[0].length) {
            var dropItem = getRandItem(level);
            for(var index in dropItem) {
                if(dropItem.hasOwnProperty(index)) {
                    pubArr.push(JSON.parse(dropItem[index]));
                }
            }
            redisDB.HMSET(key, dropItem, function(err) {});
        } else {
            pubArr = results[0];
            for(var j = pubArr.length - 1; j >= 0; j--) {
                pubArr[j] = JSON.parse(pubArr[j]);
            }
        }

        for(var i = priArr.length - 1; i >= 0; i--) {
            priArr[i] = JSON.parse(priArr[i]);
        }

        cb(null, priArr, pubArr);
    });
};

/**
 *  获取单个限时物品在整个工会的购买状态
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 *  @param field [string] 商城表GuildShopConfig的tid
 * @param cb [func] 返回错误码[int](retCode)和数据(单个限时商品的购买状态)
 */
var getSingleLimBuy = function(zid, zgid, field, ifLock, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashPublicLimNumByZgid, zgid);
    var keyLock = redisClient.joinLockKey(key);
    if(ifLock) {
        var client = redisDB.MULTI();

        client.SETNX(keyLock, 1);
        client.HGET(key, field);
        client.EXEC(function(err, data) {
            if(err) {
                cb(retCode.DB_ERR);
                return;
            }
            if(0 == data[0]) {
                cb(retCode.BUY_DATA_LOCK);
                return;
            }
            if(!data[1]) {
                var buyObject = new globalObject.DealInfo();
                buyObject.index = field;
                cb(null, buyObject);
            } else {
                cb(null, JSON.parse(data[1]));
            }
            redisDB.SETEX(keyLock, 1, 1);
        });
    } else {
        redisDB.HGET(key, field, function(err, data) {
            if(err) {
                cb(retCode.DB_ERR);
                return;
            }
            if(!data) {
                var buyObject = new globalObject.DealInfo();
                buyObject.index = field;
                cb(null, buyObject);
            } else {
                cb(null, JSON.parse(data));
            }
        });
    }


};


/**
 *  保存单个限时物品在整个工会的购买状态
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param field [string] 商城表GuildShopConfig的tid
 * @param value [Buy对象] 单个限时物品的购买状态
 * @param cb [func] 返回错误码[int](retCode)
 */
var saveSingleLimBuy = function(zid, zgid, field, value, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashPublicLimNumByZgid, zgid);
    var keyLock = redisClient.joinLockKey(key);
    var client = redisDB.MULTI();

    client.DEL(keyLock);
    client.HSET(key, field, JSON.stringify(value));
    client.EXEC(function(err) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null);
    });
};

/**
 *公会商店限时解锁
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 */
var openGuildShopLock = function(zid, zgid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashPublicLimNumByZgid, zgid);
    var keyLock = redisClient.joinLockKey(key);

    redisDB.DEL(keyLock);
};

/**
 *到刷新时间段进行刷新操作，刷新整个公会商店商品的购买状态
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param level [int] 玩家等级
 * @param cb [func] 返回错误码[int](retCode)和数据(刷新后的限时商品的购买状态)
 */
var refreshLimBuyState = function(zid, zgid, zuid, level, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashPublicLimNumByZgid, zgid);
    var keyPrivateLimNum = redisClient.joinKey(redisKey.keyHashGuildPrivateLimBuyByZgidZuid, zgid, zuid);

    var dropItem = getRandItem(level);
    var limitArr = [];
    for(var index in dropItem) {
        if(dropItem.hasOwnProperty(index)) {
            limitArr.push(JSON.parse(dropItem[index]));
        }
    }
    cb(null, [], limitArr);

    var client = redisDB.MULTI();
    client.DEL(key);
    client.DEL(keyPrivateLimNum);
    client.HMSET(key, dropItem);
    client.EXEC(function(err) {
    });
};

/**
 *只刷新公会商店限时购买的个人购买次数
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 角色id
 * @param cb [func] 返回公会商店限时购买的个人购买信息和整个公会的物品购买信息
 */
var refreshMyDealItemsInfo = function(zid, zgid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashPublicLimNumByZgid, zgid);
    var keyPrivateLimNum = redisClient.joinKey(redisKey.keyHashGuildPrivateLimBuyByZgidZuid, zgid, zuid);

    var client = redisDB.MULTI();

    client.HVALS(key);
    client.DEL(keyPrivateLimNum);
    client.EXEC(function(err, results) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }

        var pubArr = results[0];
        for(var j = pubArr.length - 1; j >= 0; j--) {
            pubArr[j] = JSON.parse(pubArr[j]);
        }

        cb(null, [], pubArr);
    });
};

/**
 *获取和设置公会商店请求时间
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 角色id
 * @param cb [func] 返回公会商店限时购买的个人购买信息和整个公会的物品购买信息
 */
var getGuildShopFreshTime = function(zid, zgid, zuid, value, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var  key = redisClient.joinKey(redisKey.keyStringGuildOtherTimeByZgidZuid, zgid, zuid);
    var keyTime = redisClient.joinKey(redisClient.keyStringPubBuyTimeByZgid, zgid);
    var client = redisDB.MULTI();

    client.GETSET(key, value);
    client.GETSET(keyTime, value);
    client.EXEC(function(err, timeArr) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var freshTime = timeArr[0] ? Number(timeArr[0]) : value;
        var limitFreshTime = timeArr[1] ? Number(timeArr[1]) : value;
        cb(null, freshTime, limitFreshTime);
    });
};

/**
 * 获取掉落物品
 * @param level [int]玩家等级
 * @returns {object} 掉落的物品数组
 */
var getRandItem = function(level) {
    const DROP_NUM = 4;
    var dropMap = {};
    var first = 0;
    var last = 0;
    var guildShopData = csvManager.GuildShopConfig();

    for(var i in guildShopData ) {
        if(!first && 3 == guildShopData[i].TAB_ID) {
            first = parseInt(guildShopData[i].INDEX);
        }
       else if(3 == guildShopData[i].TAB_ID) {
            last = parseInt(guildShopData[i].INDEX);
       }
    }

    for(i = 0; i < 100; ++i) {
        if(Object.keys(dropMap).length == DROP_NUM) break;
        var index = math.rand(first,last);
        if(guildShopData[index].OPEN_GUILD_LEVEL <= level) {
            var object = {};
            object.index = index;
            object.buyNum = 0;
            dropMap[index] = JSON.stringify(object);
        }
    }
    return dropMap;
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

exports.getGuildShopItemsInfo = getGuildShopItemsInfo;
exports.getGuildLimitShopItemsInfo = getGuildLimitShopItemsInfo;
exports.getSingleLimBuy = getSingleLimBuy;
exports.saveSingleLimBuy = saveSingleLimBuy;
exports.refreshLimBuyState = refreshLimBuyState;
exports.refreshMyDealItemsInfo = refreshMyDealItemsInfo;
exports.openGuildShopLock = openGuildShopLock;
exports.getGuildShopFreshTime = getGuildShopFreshTime;


