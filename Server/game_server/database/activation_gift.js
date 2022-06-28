/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：礼包码礼包相关功能，包括礼包码礼包和礼包码对象的数据库操作
 * 开发者：高骏
 * 开发者备注：1、用礼包码查，礼包码礼包信息未查到，说明已被删除
 * 审阅者：
 * 优化建议：礼包码生成方式有待改进。
 * ---------------------------------------------------------------------------------------------------------------------
 */
/**
 * 包含的头文件
 */
var dbManager = require('../../manager/redis_manager').Instance();
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var globalObject = require('../../common/global_object');
var md5 = require('MD5');

/**
 *礼包码礼包ID自增
 * @param callback [func] 返回全服礼包码礼包自增ID
 */
var incrAddActivationGiftId = function(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyStringActivationGiftId;

    redisDB.INCR(key,function(err, id) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, id);
    });
};

/**
 *获取一个礼包码礼包信息
 * @param agid [int] 礼包码礼包ID
 * @param callback [func] 返回一个ActivationGiftInfo对象
 */
var getActivationGift = function(agid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashActivationGift;

    redisDB.HGET(key, agid, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, JSON.parse(data));
        }
    });
};

/**
 * 添加礼包码礼包信息
 * @param activationGift [Object] ActivationGiftInfo对象
 * @param callback [func] 返回错误码[int]
 */
var addActivationGift = function(activationGift, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashActivationGift;

    redisDB.HSET(key, activationGift.agId, JSON.stringify(activationGift), function(err) {
        callback(err);
    });
};

/**
 * 删除礼包码礼包信息
 * @param agId [int] 礼包码礼包ID
 * @param callback [func] 返回错误码[int]
 */
var delActivationGift = function(agId, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashActivationGift;

    redisDB.HDEL(key, agId, function(err) {
        callback(err);
    });
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *获取一个礼包码信息
 * @param agCode [String] 礼包码
 * @param change [boolean] 锁
 * @param callback [func] 返回一个ActivationCodeInfo对象
 */
var getActivationCode = function(agCode, change, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashActivationCode;
    var lockKey = redisClient.joinLockKey(key);

    var client = redisDB.MULTI();
    if(change) {
        client.HGET(key, agCode);
        client.SETNX(lockKey, 1);
        client.EXEC(function(err, data) {
            if(err) {
                callback(retCode.DB_ERR);
                return;
            }
            if(0 == data[1]) {
                callback(retCode.GIFT_LOCKED);
                return;
            }
            if(data[0]) {
                redisDB.EXPIRE(lockKey, 3);
                callback(null, JSON.parse(data[0]));
            }
            else {
                redisDB.DEL(lockKey);
                callback(null, null);
            }
        });
    }
    else {
        redisDB.HGET(key, agCode, function(err, data) {
            if(err) {
                callback(retCode.DB_ERR);
                return;
            }
            callback(null, JSON.parse(data));
        });
    }
};

/**
 * 保存一个礼包码信息
 * @param agCode [string] 礼包码
 * @param giftInfo [ActivationCodeInfo] ActivationCodeInfo类对象
 * @param change [boolean] 锁
 * @param cb [function] 回调是否保存成功
 */
var saveActivationCode = function(agCode, giftInfo, change, cb) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashActivationCode;
    var lockKey = redisClient.joinLockKey(key);
    var client = redisDB.MULTI();

    if(change) {
        client.DEL(lockKey);
        client.HSET(key, agCode, JSON.stringify(giftInfo));
        client.EXEC(function(err){
            if(err) {
                cb(retCode.DB_ERR);
            }
            else {
                cb(null);
            }
        });
    }
    else {
        redisDB.HSET(key, agCode, JSON.stringify(giftInfo), function(err) {
            if(err) {
                cb(retCode.DB_ERR);
            }
            else {
                cb(null);
            }
        });
    }
};

/**
 * 解锁礼品码
 */
var openActivationCodeLock = function() {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashActivationCode;
    var lockKey = redisClient.joinLockKey(key);

    redisDB.DEL(lockKey);
};

/**
 * 添加礼包码信息
 * @param activationGift [Object] ActivationGiftInfo对象
 * @param callback [func] 返回错误码[int]
 */
var addActivationCode = function(activationGift, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashActivationCode;
    var client = redisDB.MULTI();

    var codeArr = [];/*为记BI，返回*/
    var activationCode = new globalObject.ActivationCodeInfo();
    activationCode.agId = activationGift.agId;
    activationCode.useNum = 0;
    var jsonStr = JSON.stringify(activationCode);

    for(var i=0; i<activationGift.codeNum; i++) {
        var code = md5(activationGift.agId.toString() + activationGift.giftType.toString() + i + activationGift.name + activationGift.media +
        activationGift.beginTime.toString() + activationGift.endTime.toString() + activationGift.items);//(new Date()).toDateString() + Math.random()
        /*取16位*/
        code = code.substring(8, 24);
        codeArr.push(code);
        client.HSETNX(key, code, jsonStr);
    }
    client.EXEC(function(err, result){
        callback(err, codeArr, result);
    })
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *礼包码礼包ID自增
 * @param cb [func] 返回全服礼包码礼包自增ID
 */
exports.incrAddActivationGiftId = incrAddActivationGiftId;

/**
 *获取一个礼包码礼包信息
 * @param agid [int] 礼包码礼包ID
 * @param callback [func] 返回一个ActivationGiftInfo对象
 */
exports.getActivationGift = getActivationGift;

/**
 * 添加礼包码礼包信息
 * @param activationGift [Object] ActivationGiftInfo对象
 * @param callback [func] 返回错误码[int]
 */
exports.addActivationGift = addActivationGift;

/**
 * 删除礼包码礼包信息
 * @param agId [int] 礼包码礼包ID
 * @param callback [func] 返回错误码[int]
 */
exports.delActivationGift = delActivationGift;

/**
 *获取一个礼包码信息
 * @param agCode [String] 礼包码
 * @param change [boolean] 锁
 * @param callback [func] 返回一个ActivationCodeInfo对象
 */
exports.getActivationCode = getActivationCode;

/**
 * 保存一个礼包码信息
 * @param agCode [string] 礼包码
 * @param giftInfo [ActivationCodeInfo] ActivationCodeInfo类对象
 * @param change [boolean] 锁
 */
exports.saveActivationCode = saveActivationCode;

/**
 * 解锁礼品码
 */
exports.openActivationCodeLock = openActivationCodeLock;

/**
 * 添加礼包码信息
 * @param activationCode [Object] ActivationGiftInfo对象
 * @param callback [func] 返回错误码[int]
 */
exports.addActivationCode = addActivationCode;



