/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：天魔乱入：获取伤害输出和功勋，保存伤害输出和功勋，清空伤害输出和功勋，获取触发天魔的记录，
 *     保存触发天魔的记录，获取攻击天魔的记录，保存攻击天魔的记录，获取伤害输出排行榜，获取玩家伤害输出名次，
 *     更新伤害输出排行榜，获取功勋排行榜，获取玩家功勋名次，更新功勋排行榜，获取玩家功勋领取记录，
 *     更新领取功勋奖励记录
 * 开发者：卢凯鹏
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
var globalObject = require('../../common/global_object');
var dbManager = require("../../manager/redis_manager").Instance();

/**
 * 获取伤害输出和功勋
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和数据[DamageOutputAndMerit]
 */
var getDamageOutputAndMerit = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringMOAMByZuidDate, zuid, (new Date()).toDateString());

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(null, new globalObject.DamageOutputAndMerit());
        }
    });
};

/**
 * 保存伤害输出和功勋
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param damageOutputAndMerit [object] 伤害输出和功勋
 * @param callback [func] 返回错误码[int](retCode)
 */
var setDamageOutputAndMerit = function(zid, zuid, damageOutputAndMerit, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringMOAMByZuidDate, zuid, (new Date()).toDateString());
    var value = JSON.stringify(damageOutputAndMerit);

    redisDB.SET(key, value, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 清空伤害输出和功勋
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
var clearDamageOutputAndMerit = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key1 = redisClient.joinKey(redisKey.keyStringMOAMByZuidDate, zuid, (new Date()).toDateString());
    var key2 = redisClient.joinKey(redisKey.keySetMeritAwardListByZuidDate, zuid, (new Date()).toDateString());

    redisDB.DEL(key1);
    redisDB.DEL(key2);
};

/**
 * 获取触发天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和数据[DemonBossRcd]
 */
var getDemonBossRcd = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringDemonBossRcdByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(null, new globalObject.DemonBossRcd());
        }
    });
};

/**
 * 保存触发天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param demonBossRcd [object] 触发天魔的记录
 * @param callback [func] 返回错误码[int](retCode)
 */
var setDemonBossRcd = function(zid, zuid, demonBossRcd, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringDemonBossRcdByZuid, zuid);
    var value = JSON.stringify(demonBossRcd);

    redisDB.SET(key, value, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 获取攻击天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和数据[FightDemonBossInfo]
 */
var getFightDemonBossInfo = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFDBIByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(retCode.FIGHT_DEMON_BOSS_INFO_NOT_EXIST);
        }
    });
};


/**
 * 保存攻击天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param fightDemonBossInfo [object] 攻击天魔的记录
 * @param callback [func] 返回错误码[int](retCode)
 */
var setFightDemonBossInfo = function(zid, zuid, fightDemonBossInfo, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFDBIByZuid, zuid);
    var value = JSON.stringify(fightDemonBossInfo);

    redisDB.SET(key, value, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};


/**
 * 删除攻击天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
var delFightDemonBossInfo = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFDBIByZuid, zuid);

    redisDB.DEL(key);
};


/**
 * 获取玩家伤害输出名次
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和名次[int]
 */
var getDamageOutputRankIndex = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetDamageOutputByZid, zid);

    redisDB.ZRANK(key, zuid, function(err, index) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(index != null) {
            callback(null, index+1);
        }
        else {
            callback(null, -1);
        }
    });
};

/**
 * 更新伤害输出排行榜
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param damageOutput [int] 伤害输出
 * @param callback [func] 返回错误码[int](retCode)
 */
var updateDamageOutputRank = function(zid, zuid, damageOutput, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetDamageOutputByZid, zid);
    var client = redisDB.MULTI();

    client.ZADD(key, damageOutput*(-1), zuid);
    client.ZREMRANGEBYRANK(key, 200, -1);
    client.EXEC(function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 获取伤害输出排行榜
 * @param zid [int] 区Id
 * @param callback [func] 返回错误码[int](retCode)和排行榜
 */
var getDamageOutputRank = function(zid, beginIndex, endIndex, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetDamageOutputByZid, zid);

    redisDB.ZRANGE(key, beginIndex, endIndex, 'WITHSCORES', function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**
 * 获取玩家功勋名次
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和名次[int]
 */
var getMeritRankIndex = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetMeritByZid, zid);

    redisDB.ZRANK(key, zuid, function(err, index) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(index != null) {
            callback(null, index+1);
        }
        else {
            callback(null, -1);
        }
    });
};

/**
 * 更新功勋排行榜
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param merit [int] 功勋
 * @param callback [func] 返回错误码[int](retCode)
 */
var updateMeritRank = function(zid, zuid, merit, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetMeritByZid, zid);
    var client = redisDB.MULTI();

    client.ZADD(key, merit*(-1), zuid);
    client.ZREMRANGEBYRANK(key, 200, -1);
    client.EXEC(function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 更新功勋排行榜
 * @param zid [int] 区Id
 * @param callback [func] 返回错误码[int](retCode)和排行榜
 */
var getMeritRank = function(zid, beginIndex, endIndex, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetMeritByZid, zid);

    redisDB.ZRANGE(key, beginIndex, endIndex, 'WITHSCORES', function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**
 * 获取玩家功勋领取记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和领取奖励记录[arr]
 */
var getMeritAwardList = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetMeritAwardListByZuidDate, zuid, (new Date()).toDateString());

    redisDB.SMEMBERS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**
 * 更新领取功勋奖励记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param index [int] 奖励序号
 * @param callback [func] 返回错误码[int](retCode)和领取数量
 */
var updateMeritAwardList = function(zid, zuid, index, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySetMeritAwardListByZuidDate, zuid, (new Date()).toDateString());

    redisDB.SADD(key, index, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};

/**
 * 更新定时刷新的伤害输出排行榜(每日24时更新，记得更新后记下更新的时间，防止24时未开服，未更新该榜)
 * @param zid [int] 区Id
 */
var updateTimerDamageOutputRank = function(zid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var fromKey = redisClient.joinKey(redisKey.keySortedSetDamageOutputByZid, zid);
    var toKey = redisClient.joinKey(redisKey.keyTimerSortedSetDamageOutputByZid, zid);

    redisDB.EXISTS(fromKey, function(err, result) {
        if(result) {
            redisDB.RENAME(fromKey, toKey);
        }
        else {
            redisDB.DEL(toKey);
        }
    });
};

/**
 * 更新定时刷新的功勋排行榜(每日24时更新，记得更新后记下更新的时间，防止24时未开服，未更新该榜)
 * @param zid [int] 区Id
 */
var updateTimerMeritRank = function(zid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var fromKey = redisClient.joinKey(redisKey.keySortedSetMeritByZid, zid);
    var toKey = redisClient.joinKey(redisKey.keyTimerSortedSetMeritByZid, zid);

    redisDB.EXISTS(fromKey, function(err, result) {
        if(result) {
            redisDB.RENAME(fromKey, toKey);
        }
        else {
            redisDB.DEL(toKey);
        }
    });
};

/**
 * 删除一个
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int]
 */
var delADamageOutputRank = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyTimer = redisClient.joinKey(redisKey.keyTimerSortedSetDamageOutputByZid, zid);
    var key = redisClient.joinKey(redisKey.keySortedSetDamageOutputByZid, zid);

    var client = redisDB.MULTI();
    client.ZREM(keyTimer, zuid);
    client.ZREM(key, zuid);
    client.EXEC(function(err){
        callback(err);
    });
};

/**
 * 删除一个
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int]
 */
var delAMeritRank = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyTimer = redisClient.joinKey(redisKey.keyTimerSortedSetMeritByZid, zid);
    var key = redisClient.joinKey(redisKey.keySortedSetMeritByZid, zid);

    var client = redisDB.MULTI();
    client.ZREM(keyTimer, zuid);
    client.ZREM(key, zuid);
    client.EXEC(function(err){
        callback(err);
    });
};

/**
 * 天魔等级重置标志
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
var setDemonBossResetFlag = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringDemonBossResetFlagByZuid, zuid);

    redisDB.set(key,1);
};


/**
 * 获取天魔等级重置标志
 * @param zid [int]
 * @param zuid [int]
 * @param callback [func] 返回错误码[int]和重置标志[int]
 */
var getDemonBossResetFlag = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringDemonBossResetFlagByZuid, zuid);
    var client = redisDB.MULTI();

    client.GET(key);
    client.DEL(key);
    client.EXEC(function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result[0]) {
            callback(null, 1);
        }
        else {
            callback(null, 0);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取伤害输出和功勋
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和数据[DamageOutputAndMerit]
 */
exports.getDamageOutputAndMerit = getDamageOutputAndMerit;

/**
 * 保存伤害输出和功勋
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param damageOutputAndMerit [object] 伤害输出和功勋
 * @param callback [func] 返回错误码[int](retCode)
 */
exports.setDamageOutputAndMerit = setDamageOutputAndMerit;

/**
 * 清空伤害输出和功勋
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
exports.clearDamageOutputAndMerit = clearDamageOutputAndMerit;

/**
 * 获取触发天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和数据[DemonBossRcd]
 */
exports.getDemonBossRcd = getDemonBossRcd;


/**
 * 保存触发天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param demonBossRcd [object] 触发天魔的记录
 * @param callback [func] 返回错误码[int](retCode)
 */
exports.setDemonBossRcd = setDemonBossRcd;

/**
 * 获取攻击天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和数据[FightDemonBossInfo]
 */
exports.getFightDemonBossInfo = getFightDemonBossInfo;

/**
 * 保存攻击天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param fightDemonBossInfo [object] 攻击天魔的记录
 * @param callback [func] 返回错误码[int](retCode)
 */
exports.setFightDemonBossInfo = setFightDemonBossInfo;

/**
 * 删除攻击天魔的记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
exports.delFightDemonBossInfo = delFightDemonBossInfo;

/**
 * 获取玩家伤害输出名次
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和名次[int]
 */
exports.getDamageOutputRankIndex = getDamageOutputRankIndex;

/**
 * 更新伤害输出排行榜
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param damageOutput [int] 伤害输出
 * @param callback [func] 返回错误码[int](retCode)
 */
exports.updateDamageOutputRank = updateDamageOutputRank;

/**
 * 获取伤害输出排行榜
 * @param zid [int] 区Id
 * @param callback [func] 返回错误码[int](retCode)和排行榜
 */
exports.getDamageOutputRank = getDamageOutputRank;

/**
 * 更新功勋排行榜
 * @param zid [int] 区Id
 * @param callback [func] 返回错误码[int](retCode)和排行榜
 */
exports.getMeritRank = getMeritRank;

/**
 * 获取玩家功勋名次
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和名次[int]
 */
exports.getMeritRankIndex = getMeritRankIndex;


/**
 * 更新功勋排行榜
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param merit [int] 功勋
 * @param callback [func] 返回错误码[int](retCode)
 */
exports.updateMeritRank = updateMeritRank;

/**
 * 获取玩家功勋领取记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和领取奖励记录[arr]
 */
exports.getMeritAwardList = getMeritAwardList;

/**
 * 更新领取功勋奖励记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param index [int] 奖励序号
 * @param callback [func] 返回错误码[int](retCode)和领取数量
 */
exports.updateMeritAwardList = updateMeritAwardList;

/**
 * 更新定时刷新的伤害输出排行榜
 * @param zid [int] 区Id
 */
exports.updateTimerDamageOutputRank = updateTimerDamageOutputRank;

/**
 * 更新定时刷新的功勋排行榜
 * @param zid [int] 区Id
 */
exports.updateTimerMeritRank = updateTimerMeritRank;

/**
 * 删除一个
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int]
 */
exports.delADamageOutputRank = delADamageOutputRank;

/**
 * 删除一个
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int]
 */
exports.delAMeritRank = delAMeritRank;

/**
 * 天魔等级重置标志
 */
exports.setDemonBossResetFlag = setDemonBossResetFlag;

/**
 * 获取天魔等级重置标志
 * @param zid [int]
 * @param zuid [int]
 * @param [func] 返回错误码[int]和重置标志[int]
 */
exports.getDemonBossResetFlag = getDemonBossResetFlag;
