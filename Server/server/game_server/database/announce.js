/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：公告
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
/**
 * 包含的头文件
 */
var dbManager = require('../../manager/redis_manager').Instance();
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var async = require('async');

/**
 *是否存在这个公告id
 * @param channelId [int] 渠道id
 * @param annid [int] 公告id
 * @param callback [func] 返回全部公告信息
 */
var isExistAnnid = function(channelId, annid, callback){
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashAnnounceByChannel, channelId);
    redisDB.HEXISTS(key, annid, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, data);
        }
    });
};

/**
 *获取自增公告id
 * @param channelId [int] 渠道id
 * @param callback [func] 返回一个公告id
 */
var getIncrAnnid = function(channelId, callback){
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashIncrAnnounceId;
    redisDB.HINCRBY(key, channelId, 1, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, parseInt(data));
        }
    });
};

/**
 *获取该渠道的公告信息
 * @param channelId [int] 渠道id
 * @param callback [func] 返回全部公告信息
 */
var getAnnounceList = function(channelId, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashAnnounceByChannel, channelId);

    redisDB.HVALS(key, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            var annArr = [];
            for (var i in data) {
                annArr[annArr.length] = JSON.parse(data[i]);
            }
            callback(null, annArr);
        }
    });
};

/**
 * 添加公告信息
 * @param channelId [int] 渠道id
 * @param annInfo [Object] AnnounceInfo对象
 * @param callback [func] 返回错误码[int]
 */
var addAnnounceList = function(channelId, annInfo, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashAnnounceByChannel, channelId);

    redisDB.HSET(key, annInfo.annid, JSON.stringify(annInfo), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 删除公告信息
 * @param channelId [int] 渠道id
 * @param annid [int] 公告id
 * @param callback [func] 返回错误码[int]
 */
var delAnnounceList = function(channelId, annid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashAnnounceByChannel, channelId);

    redisDB.HDEL(key, annid, function(err) {
        if (err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null);
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 *是否存在这个公告id
 * @param channelId [int] 渠道id
 * @param annid [int] 公告id
 * @param callback [func] 返回全部公告信息
 */
exports.isExistAnnid = isExistAnnid;

/**
 *获取自增公告id
 * @param channelId [int] 渠道id
 * @param callback [func] 返回一个公告id
 */
exports.getIncrAnnid = getIncrAnnid;

/**
 *获取该渠道的公告信息
 * @param channelId [int] 渠道id
 * @param callback [func] 返回全部公告信息
 */
exports.getAnnounceList = getAnnounceList;

/**
 * 添加公告信息
 * @param channelId [int] 渠道id
 * @param annInfo [Object] AnnounceInfo对象
 * @param callback [func] 返回错误码[int]
 */
exports.addAnnounceList = addAnnounceList;

/**
 * 删除公告信息
 * @param channelId [int] 渠道id
 * @param annid [int] 公告id
 * @param callback [func] 返回错误码[int]
 */
exports.delAnnounceList = delAnnounceList;
