/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：好友：获取好友列表，存储好友列表，获取好友请求列表，存储好友申请列表，解锁好友申请列表，
 *     获取好友推荐列表，更新等级排行，获取特定等级范围的用户Id，获取好友精力赠送表，保存好友精力列表，
 *     清空精力赠送列表，
 * 开发者：卢凯鹏
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
var dbManager = require("../../manager/redis_manager").Instance();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友列表
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param callback [func] 返回错误码(retCode)和好友列表[arr]
 */
var getFriendList = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetFriendsByZuid, zuid);

    redisDB.SMEMBERS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};
exports.getFriendList = getFriendList;

/**
 * 用户1和用户2成为好友
 * @param zid [int] 区Id
 * @param zuid1 [int] 用户1Id
 * @param zuid2 [int] 用户2Id
 */
var becomeFriends = function(zid, zuid1, zuid2) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    /* 在1的好友集合中添加2 */
    var key1 = redisClient.joinKey(redisKey.keySetFriendsByZuid, zuid1);
    redisDB.SADD(key1, zuid2);

    /* 在2的好友集合中添加1 */
    var key2 = redisClient.joinKey(redisKey.keySetFriendsByZuid, zuid2);
    redisDB.SADD(key2, zuid1);
};
exports.becomeFriends = becomeFriends;

/**
 * 用户1和用户2不再是好友
 * @param zid [int] 区Id
 * @param zuid1 [int] 用户1Id
 * @param zuid2 [int] 用户2Id
 */
var noMoreFriends = function(zid, zuid1, zuid2) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    /* 在1的好友集合中添加2 */
    var key1 = redisClient.joinKey(redisKey.keySetFriendsByZuid, zuid1);
    redisDB.SREM(key1, zuid2);

    /* 在2的好友集合中添加1 */
    var key2 = redisClient.joinKey(redisKey.keySetFriendsByZuid, zuid2);
    redisDB.SREM(key2, zuid1);
};
exports.noMoreFriends = noMoreFriends;

/**
 * 判断用户1和用户2 是否是好友
 * @param zid [int] 区Id
 * @param zuid1 [int] 用户1Id
 * @param zuid2 [int] 用户2Id
 * @param callback [func] 返回错误码[int]和判断用户1和用户2是否是好友[int]
 */
var isFriends = function(zid, zuid1, zuid2, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetFriendsByZuid, zuid1);

    redisDB.SISMEMBER(key, zuid2, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};
exports.isFriends = isFriends;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取好友请求列表
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param callback [func] 返回错误码(retCode)和好友请求列表[arr]
 */
var getFriendRequestList = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetFriendRequestsByZuid, zuid);

    redisDB.SMEMBERS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};
exports.getFriendRequestList = getFriendRequestList;

/**
 * 添加好友申请
 * @param zid [int] 区Id
 * @param fromZuid  [int] 申请者Id
 * @param toZuid [int] 被请求者Id
 */
var addFriendReq = function(zid, fromZuid, toZuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetFriendRequestsByZuid, toZuid);

    redisDB.SADD(key,  fromZuid);
};
exports.addFriendReq = addFriendReq;

/**
 * 删除好友请求
 * @param zid [int] 区Id
 * @param opZuid [int] 操作者uid
 * @param delZuid [int] 被删除的uid
 * @param callback [func] 返回错误码[int]和删除是否成功[int]
 */
var  delFriendReq = function(zid, opZuid, delZuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetFriendRequestsByZuid, opZuid);

    redisDB.SREM(key,  delZuid, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};
exports.delFriendReq = delFriendReq;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取好友精力赠送表
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param callback [func] 返回错误码(retCode)和好友精力赠送列表[arr]
 */
var getSpiritSendList = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var date = (new Date()).toDateString();
    var key = redisClient.joinKey(redisKey.keySetSpiritSendRcdsByZuidDate, zuid, date);

    redisDB.SMEMBERS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};
exports.getSpiritSendList = getSpiritSendList;

/**
 * 添加精力赠送记录
 * @param zid [int] 用户Id
 * @param senderZuid [int] 发送者Id
 * @param rcverZuid [int] 接受者Id
 * @param callback [func] 返回错误码[int] 和是否添加成功[int]
 */
var addSpiritSendRcd = function(zid, senderZuid, rcverZuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var date = (new Date()).toDateString();
    var key1 = redisClient.joinKey(redisKey.keySetSpiritSendRcdsByZuidDate, senderZuid, date);
    var key2 = redisClient.joinKey(redisKey.keySetSpiritRcvListByZuid, rcverZuid);

    redisDB.SADD(key1, rcverZuid, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            var client = redisDB.MULTI();
            client.SADD(key2, senderZuid);
            client.EXPIRE(key1, 24*3600);
            client.EXEC();

            callback(null, result);
        }
    });
};
exports.addSpiritSendRcd = addSpiritSendRcd;

/**
 * 获取好友精力可领列表
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param callback [func] 返回错误码(retCode)和好友精力赠送列表[arr]
 */
var getSpiritRevList = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key1 = redisClient.joinKey(redisKey.keySetFriendsByZuid, zuid);
    var key2 = redisClient.joinKey(redisKey.keySetSpiritRcvListByZuid, zuid);

    redisDB.SINTER(key1, key2, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};
exports.getSpiritRevList = getSpiritRevList;

/**
 * 删除精力可领取记录
 * @param zid [int] 用户Id
 * @param toZuid [int] 接受者Id
 * @param fromZuid [int] 发送者Id
 * @param callback [func] 返回错误码[int] 和是否添加成功[int]
 */
var delRcdInSpiritRcvList = function(zid, toZuid, fromZuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetSpiritRcvListByZuid, toZuid);

    redisDB.SREM(key, fromZuid, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};
exports.delRcdInSpiritRcvList = delRcdInSpiritRcvList;

/**
 * 获取精力领取次数
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 * @param callback 返回错误码和次数
 */
var getSpiritRcvCnt = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var date = (new Date()).toDateString();
    var key = redisClient.joinKey(redisKey.keyStringSpiritRcvCntByZuidDate, zuid, date);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(err);
        }
        else if (result) {
            callback(null, parseInt(result));
        }
        else {
            callback(null, 0);
        }
    });
};
exports.getSpiritRcvCnt = getSpiritRcvCnt;

/**
 * 获取精力领取次数
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 * @param cnt [int] 精力领取次数
 */
var setSpiritRcvCnt = function(zid, zuid, cnt) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var date = (new Date()).toDateString();
    var key = redisClient.joinKey(redisKey.keyStringSpiritRcvCntByZuidDate, zuid, date);

    redisDB.SETEX(key, 24 * 3600, cnt);
};
exports.setSpiritRcvCnt = setSpiritRcvCnt;
