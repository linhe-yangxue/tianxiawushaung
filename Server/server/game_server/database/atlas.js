/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取曾经和现在所有宠物tid 保存当前新宠物tid
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
var retCode = require('../../common/ret_code');
var async = require('async');
var type = require('../common/item_type');
var dbManager = require('../../manager/redis_manager').Instance();
var notify = require('./notification');
var notifCode = require('../common/notification');



/**
 *获取曾经和现在所有宠物tid
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回邮件数组
 */
var getAtlas = function(zid, uid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashAtlasByZuid, uid);

    redisDB.HVALS(key, function(err, data) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        var mailArr = [];
        var len = data.length;
        for (var i = 0; i< len; ++i) {
            mailArr.push(parseInt(data[i]));
        }
        cb(null, mailArr);
    });
};

/**
 *保存当前新宠物tid
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param items [array] 用户ID
 */
var saveAtlas = function(zid, uid, items) {

    if(0 == items.length) {
        return;
    }
    var tidArr = [];
    var len = items.length;
    for(var i = 0; i< len; ++i) {
        tidArr[items[i].tid] = items[i].tid;
    }

    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashAtlasByZuid, uid);
    var key2 = redisClient.joinKey(redisKey.keyStringAtlasByZuid, uid);

    var client = redisDB.MULTI();
    for(var j in tidArr) {
        client.HSETNX(key, tidArr[j], tidArr[j]);
    }
    client.EXEC(function(err, array) {
        if(array && -1 != array.indexOf(1)) {
            redisDB.SET(key2, notifCode.NOTIF_ATLAS);
        }
    });
};

/**
 *获取是否有新图鉴
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param callback [function] 回调是否有新图鉴 null:没有
 */
var getAtlasNotice = function(zid, uid, callback) {

    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringAtlasByZuid, uid);
    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, result);
    });
};

/**
 *删除新图鉴通知
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 */
var delAtlasNotice = function(zid, uid) {

    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringAtlasByZuid, uid);
    redisDB.DEL(key);
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *获取曾经和现在所有宠物tid
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回邮件数组
 */
exports.getAtlas = getAtlas;

/**
 *保存当前新宠物tid
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回邮件数组
 */
exports.saveAtlas = saveAtlas;
/**
 *获取是否有新图鉴
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param callback [function] 回调是否有新图鉴 null:没有
 */
exports.getAtlasNotice = getAtlasNotice;
/**
 *删除新图鉴通知
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 */
exports.delAtlasNotice = delAtlasNotice;