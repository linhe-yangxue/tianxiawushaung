var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();
var protocolObject = require('../../common/protocol_object');


/**
 * 设置夺宝免战时间(秒)
 * @param zid [int] 区Id
 * @param zuid [int] zuid
 * @param time [int] 免战结束时间
 */
var setTruceTime = function(zid, zuid, time, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringTruceTimeByZuid, zuid);

    redisDB.SET(key, time, cb);
};

/**
 * 获取夺宝免战时间(秒)
 * @param zid [int] 区Id
 * @param zuid [int] zuid
 * @param callback [func] 返回错误码[int]和免战结束时间[int]
 */
var getTruceTime = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringTruceTimeByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if (err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, parseInt(result));
        }
        else {
            callback(null, 0);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 更新法器所有者列表
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param tid [int] 物品类型
 * @param itemNum [int] 物品数量
 * @param level [int] 主角等级
 */
var updateMagicOwnerList = function(zid, zuid, tid, itemNum, level) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetMagicOwnerUidbyZid, zid, tid);

    if (itemNum >= 2) {
        redisDB.ZADD(key, level, zuid);
    }
    else {
        redisDB.ZREM(key, zuid);
    }
};

/**
 * 获取法器所有者列表
 * @param zid [int] 区Id
 * @param tid [int] 物品Id
 * @param level [int] 主角等级
 * @param callback [func] 返回错误码[int]和目标列表[array]
 */
var getMagicOwnerList = function(zid, tid, level, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetMagicOwnerUidbyZid, zid, tid);

    redisDB.ZRANGEBYSCORE(key, level - 6, level + 10, 'LIMIT', 0, 100, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 更新被抢夺历史
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param obj [object] 被抢历史(HistoryOfRobbed)
 * @param callback  [func] 返回错误码[int]
 */
var updateRobbedHistoryList = function(zid, zuid, obj, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListRobbedHistoryByZuid, zuid);
    var client = redisDB.MULTI();

    client.LPUSH(key, JSON.stringify(obj));
    client.LLEN(key);
    client.EXEC(function (err, result) {
        if (err) {
            callback(retCode.DB_ERR);
        }
        else {
            if (result[1] > 20) {
                redisDB.RPOP(key);
            }
            callback(null);
        }
    });
};

/**
 * 获取被抢夺历史
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param callback [func] 返回错误码[int]和被抢历史列表[array](HistoryOfRobbed)
 */
var getRobbedHistoryList = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListRobbedHistoryByZuid, zuid);

    redisDB.LRANGE(key, 0, 19, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            for(var i = 0; i < result.length; ++i) {
                result[i] = JSON.parse(result[i]);
            }
            callback(null, result);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 保存夺宝目标列表
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param tid [int] 法器碎片tid
 * @param aimList [array] 夺宝目标列表(RobAim)
 * @param callback [func] 返回错误码
 */
var setRobAimList = function(zid, zuid, tid, aimList, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringRobAimListByZuidTid, zuid, tid);

    redisDB.SET(key, JSON.stringify(aimList), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 获取夺宝目标列表
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param tid [int] 法器碎片tid
 * @param callback [func] 返回错误码[int]和夺宝目标列表[array](RobAim)
 */
var getRobAimList = function(zid, zuid, tid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringRobAimListByZuidTid, zuid, tid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(retCode.NO_ROB_MAGIC_LIST);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 保存开始夺宝记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param obj [object] 开始夺宝记录(StartRobRecord)
 */
var setStartRobRecord = function(zid, zuid, obj) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringStartRobRecordByZuid, zuid);

    redisDB.SET(key, JSON.stringify(obj));
};

/**
 * 获取开始夺宝记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param callback [func] 返回错误码[int]和开始夺宝记录[object]
 */
var getStartRobRecord = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringStartRobRecordByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            redisDB.DEL(key);
            callback(null, JSON.parse(result));
        }
        else {
            callback(retCode.NO_START_ROB_RECORD);
        }
    });
};

/**
 * 是否是第一次夺宝
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param callback [func] 返回错误码和是否第一次夺宝
 */
var isFirstRob = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFirstRobByZuid, zuid);

    redisDB.EXISTS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            result = 1 - result;
            callback(null, result);
        }
    });
};

/**
 * 设置已夺宝标记
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 */
var setRobbed = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFirstRobByZuid, zuid);

    redisDB.SET(key, 1);
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 设置夺宝免战时间
 * @param zid [int] 区Id
 * @param zuid [int] zuid
 * @param time [int] 免战结束时间
 */
exports.setTruceTime = setTruceTime;

/**
 * 获取夺宝免战时间
 * @param zid [int] 区Id
 * @param zuid [int] zuid
 * @param callback [func] 返回错误码[int]和免战结束时间[int]
 */
exports.getTruceTime = getTruceTime;

/**
 * 更新法器所有者列表
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param tid [int] 物品类型
 * @param itemNum [int] 物品数量
 * @param level [int] 主角等级
 */
exports.updateMagicOwnerList = updateMagicOwnerList;

/**
 * 获取法器所有者列表
 * @param zid [int] 区Id
 * @param tid [int] 物品Id
 * @param level [int] 主角等级
 * @param callback [func] 返回错误码[int]和目标列表[array]
 */
exports.getMagicOwnerList = getMagicOwnerList;

/**
 * 更新被抢夺历史
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param obj [object] 被抢历史(HistoryOfRobbed)
 * @param callback  [func] 返回错误码[int]
 */
exports.updateRobbedHistoryList = updateRobbedHistoryList;

/**
 * 获取被抢夺历史
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param callback [func] 返回错误码[int]和被抢历史列表[array](HistoryOfRobbed)
 */
exports.getRobbedHistoryList = getRobbedHistoryList;

/**
 * 保存夺宝目标列表
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param tid [int] 法器碎片tid
 * @param aimList [array] 夺宝目标列表(RobAim)
 * @param callback [func] 返回错误码
 */
exports.setRobAimList = setRobAimList;

/**
 * 获取夺宝目标列表
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param tid [int] 法器碎片tid
 * @param callback [func] 返回错误码[int]和夺宝目标列表[array](RobAim)
 */
exports.getRobAimList = getRobAimList;

/**
 * 保存开始夺宝记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param obj [object] 开始夺宝记录 {'zuid':int, 'chplayer':PlayerFightDetail}
 */
exports.setStartRobRecord = setStartRobRecord;

/**
 * 获取开始夺宝记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param callback [func] 返回错误码[int]和开始夺宝记录[object]
 */
exports.getStartRobRecord = getStartRobRecord;

/**
 * 是否是第一次夺宝
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 * @param callback [func] 返回错误码和是否第一次夺宝
 */
exports.isFirstRob = isFirstRob;

/**
 * 设置已夺宝标记
 * @param zid [int] 区Id
 * @param zuid [int] 角色ID
 */
exports.setRobbed = setRobbed;
