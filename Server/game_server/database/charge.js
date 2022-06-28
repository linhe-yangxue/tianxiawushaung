/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：充值数据库操作
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var async = require('async');
var dbManager = require('../../manager/redis_manager').Instance();
var globalObject = require('../../common/global_object');
var retCode = require('../../common/ret_code');
var dateFormat = require('dateformat');


/**var redisClient = require('../../tools/redis/redis_client');
 *根据订单号获取zid和uid
 * @param order [string] 订单号
 * @param callback [function] 回调函数 回调出包含zid和uid的idInfo对象信息
 */
var getOrderDetailByOrderNum = function(order, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashOrderDetailByOrderNum);

    redisDB.HGET(key, order, function(err, idInfo) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, JSON.parse(idInfo));
    });
};

/**
 *保存订单号
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param order [string] 订单号
 * @param callback [func] 返回err(错误码)
 */
var saveOrderDetailByOrderNum = function(order, orderDetail, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashOrderDetailByOrderNum);

    redisDB.HSET(key, order, JSON.stringify(orderDetail), callback);
};

/**
 *保存累计充值金额
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param amount [int] 单笔充值金额
 * @param callback [function] 回调是否增加成功 null:成功 err:失败
 */
var addTotalCharge = function(zid, zuid, amount, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringChargeTotalByZuid, zuid);

    redisDB.INCRBY(key, amount, function(err, number) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        if(null == number) {
            number = 0;
        }
        callback(null, parseInt(number));
    });
};

/**
 *获取累计充值金额
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [function] 回调函数 回调累计充值金额
 */
var getTotalCharge = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringChargeTotalByZuid, zuid);

    redisDB.GET(key, function(err, money) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, money);
    });
};

/**
 *记录单笔充值金额
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param amount [int] 单笔充值金额
 * @param cb [function] 回调函数
 */
var addSingleCharge = function(zid, zuid, amount, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringChargeSingleByZuid, zuid);

    var singleChargeInfo = {};
    var date = new Date().toDateString();
    singleChargeInfo.amount = amount;
    singleChargeInfo.date = dateFormat(date,'yyyy-mm-dd');
    redisDB.GETSET(key, JSON.stringify(singleChargeInfo), function(err, info) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, JSON.parse(info));
    });
};

/**
 *获取单笔充值金额
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 */
var getSingleCharge = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringChargeSingleByZuid, zuid);

    redisDB.GET(key, function(err, info) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, JSON.parse(info));
    });
};

/**
 *获取累充送礼信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param rmbNum [int] 人民币金额
 * @param cb [function] value [object] awardInfo
 */
var getChargeReward = function(zid, zuid, rmbNum,cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashChargeRewardByZuid, zuid);

    redisDB.HGET(key, rmbNum,  function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, data);
    });
};

/**
 *更新累充送礼信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param rmbNum [int] 人民币金额
 */
var updateChargeReward = function(zid, zuid, rmbNum, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashChargeRewardByZuid, zuid);

    redisDB.HSETNX(key, rmbNum, rmbNum, function(err, flag) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, flag);
    });
};

/**
 *获取已领取的index索引 值为数组
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [function] 回调出index索引数组
 */
var getChargeAwards = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashChargeRewardByZuid, zuid);

    redisDB.HVALS(key,function(err, array) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var len = array.length;
        for(var i = 0; i < len; ++i) {
            array[i] = parseInt(array[i]);
        }
        cb(null, array);
    });
};

/**
 *根据传入的arr数组获取key中的值 值为rmbNum
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param arr [array] field數組 rmbNum作為域
 * @param cb [function]
 */
var getPayAwardArr = function(zid, zuid, arr, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashChargeRewardByZuid, zuid);

    if(0 == arr.length) {
        cb(null, []);
        return;
    }
    redisDB.HMGET(key, arr, function(err, array) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, array);
    });
};

/**
 *记录每种充值第一次充值的shelfId[商品在配表中的索引]
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfId [int] 商品在配表中的索引
 * @param cb [function] 回调出是否成功
 */
var addFirstChargeShelfId = function(zid, zuid, shelfId, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetShelfIdByZuid, zuid);

    redisDB.SADD(key, shelfId, function(err, num) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, parseInt(num));
    });
};

/**
 *获取每种充值第一次充值的shelfId数组
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [function] 回调出数组
 */
var getFirstChargeShelfIdArr = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetShelfIdByZuid, zuid);

    redisDB.SMEMBERS(key, function(err, array) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, array);
    });
};

/**
 *获取所有用户的充值总金额，单位为分
 * @param cb [function] 回调出数组
 */
var getAllUserChargeAmount = function(cb) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashRechargeAmount;

    redisDB.HVALS(key,function(err, chargeInfoArr) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var len = chargeInfoArr.length;
        for(var i = 0; i < len; ++i) {
            chargeInfoArr[i] = JSON.parse(chargeInfoArr[i]);
        }
        cb(null, chargeInfoArr);
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 *根据订单号获取zid和zuid
 * @param order [string] 订单号
 * @param callback [function] 回调函数 回调出包含zid和zuid的idInfo对象信息
 */
exports.getOrderDetailByOrderNum = getOrderDetailByOrderNum;
/**
 *保存订单号
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param order [string] 订单号
 */
exports.saveOrderDetailByOrderNum = saveOrderDetailByOrderNum;
/**
 *保存累计充值金额
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param amount [int] 单笔充值金额
 */
exports.addTotalCharge = addTotalCharge;
/**
 *获取累计充值金额
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [function] 回调函数 回调累计充值金额
 */
exports.getTotalCharge = getTotalCharge;
/**
 *记录单笔充值金额
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param amount [int] 单笔充值金额
 */
exports.addSingleCharge = addSingleCharge;
/**
 *获取累充送礼信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param rmbNum [int] 人民币金额
 * @param cb [function] value [object] awardInfo
 */
exports.getChargeReward = getChargeReward;
/**
 *更新累充送礼信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param index [int] 配表中的index索引
 * @param value [object] awardInfo
 */
exports.updateChargeReward = updateChargeReward;
/**
 *获取已领取的index索引 值为数组
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [function] 回调出index索引数组
 */
exports.getChargeAwards = getChargeAwards;
/**
 *根据传入的arr数组获取key中的值 值为rmbNum
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param arr [array] field數組 rmbNum作為域
 * @param cb [function]
 */
exports.getPayAwardArr = getPayAwardArr;
/**
 *记录每种充值第一次充值的shelfId[商品在配表中的索引]
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfId [int] 商品在配表中的索引
 * @param cb [function] 回调出是否成功
 */
exports.addFirstChargeShelfId = addFirstChargeShelfId;
/**
 *获取每种充值第一次充值的shelfId数组
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [function] 回调出数组
 */
exports.getFirstChargeShelfIdArr = getFirstChargeShelfIdArr;
/**
 *根据shelfId[商品在配表中的索引]获取相应的订单号
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param shelfId [int] 商品在配表中的索引
 * @param cb [function] 回调出订单号数组
 */
exports.getSingleCharge = getSingleCharge;
/**
 *获取所有用户的充值总金额，单位为分
 * @param cb [function] 回调出数组
 */
exports.getAllUserChargeAmount = getAllUserChargeAmount;
/**
 *获取所有累充送礼信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [function] value [object] awardInfo
 */
exports.getAllUserChargeAmount = getAllUserChargeAmount;