/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：账号登录功能
 * 开发者：许林
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
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();
var cZuid = require('../common/zuid');

/**
 *  uid不存在生成uid 并返回uid
 * @param channelId [int] SDK渠道id
 * @param id [int] SDK用户唯一ID
 * @param callback [func] 返回错误码或uid
 * @returns {void}
 */
var generateUid = function(channelId, id, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashUidByChannelIdGuid);
    var field = redisClient.joinKey(channelId, id);

    var userId = 0;
    async.waterfall([
        /* 获取新的用户Id */
        function(cb) {
            redisDB.INCR(redisKey.keyStringUidSerial, function(err, uid) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                cb(null, uid);
            });
        },
        /*  保存账号 */
        function(uid, cb) {
            redisDB.HSET(key, field, uid);
            userId = uid;
            cb(null);
        }
    ], function(err) {
        if(err) {
            callback(err);
            return;
        }
        callback(null, userId);
    });
};

/**
 * 检查uid是否存在 存在返回uid
 * @param id [int] SDK用户唯一ID
 * @param channelId [int] SDK渠道id
 * @param callback [func] 返回错误码或uid
 * @returns {void}
 */
var checkAccExist = function(channelId, id, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashUidByChannelIdGuid);
    var field = redisClient.joinKey(channelId, id);

    redisDB.HGET(key, field, function (err, uid) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, uid);
    });
};


/**
 * 通过游戏uid保存渠道id和渠道用户唯一id
 * @param field [int] uid作为域
 * @param value [string] channelInfo作为值
 * @param callback [function] 回调函数
 * @returns {void}
 */
var bindChannelInfoWithUid = function(field, value, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashChannelInfoByUid);

    redisDB.HSET(key, field, JSON.stringify(value), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null);
    });
};

/**
 * 通过游戏uid寻找渠道id
 * @param zuid [int] uid
 * @param callback [function] 回调函数
 * @returns {void}
 */
var getChannelInfoByUid = function(zuid, callback){
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashChannelInfoByUid);
    var uid = cZuid.zuidSplit(zuid)[1];
    var channelInfo = null;

    redisDB.HGET(key, uid, function(err, data){
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        if(null == data){
            channelInfo = {};
            channelInfo.channel = -1;
            channelInfo.id = 0;
            callback(null,channelInfo);
        }
        else{
            channelInfo = JSON.parse(data);
            callback(null, channelInfo);
        }
    });
};

/**
 * 将uid和mac地址绑定
 * @param uid [int] 用户id
 * @param mac [string] mac地址
 * @param callback [function] 回调绑定是否成功
 */
function bindMacWithUid(uid, mac , callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyStringMacByUid, uid);

    redisDB.SET(key, mac.toLowerCase(), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null);
    });
}

/**
 * 获取mac地址
 * @param uid [int] 用户id
 * @param callback [function] 回调mac地址
 */
function getMacByUid(uid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyStringMacByUid, uid);

    redisDB.GET(key, function(err, macAddr) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, macAddr);
    });
}
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 *  uid不存在生成uid 并返回uid
 * @param field [string] SDK唯一ID
 * @param callback [func] 返回错误码或uid
 * @returns {void}
 */
exports.generateUid = generateUid;

/**
 * 检查uid是否存在 存在返回uid
 * @param field [string] SDK唯一ID
 * @param callback [func] 返回错误码或uid
 * @returns {void}
 */
exports.checkAccExist = checkAccExist;

/**
 * 通过游戏uid保存渠道id和渠道用户唯一id
 * @param field [int] uid作为域
 * @param value [string] channelInfo作为值
 * @param cb [function] 回调函数
 * @returns {void}
 */
exports.bindChannelInfoWithUid = bindChannelInfoWithUid;

/**
 * 通过游戏uid寻找渠道id
 * @param uid [int] uid
 * @param callback [function] 回调函数
 * @returns {void}
 */
exports.getChannelInfoByUid = getChannelInfoByUid;
/**
 * 将uid和mac地址绑定
 * @param uid [int] 用户id
 * @param mac [string] mac地址
 * @param callback [function] 回调绑定是否成功
 */
exports.bindMacWithUid = bindMacWithUid;
/**
 * 获取mac地址
 * @param uid [int] 用户id
 * @param callback [function] 回调mac地址
 */
exports.getMacByUid = getMacByUid;