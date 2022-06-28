/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：保存区Id名字对应的用户Id，用区Id玩家名字查找用户Id，保存玩家对象，获取玩家对象，解锁玩家对象
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
var dbManager = require('../../manager/redis_manager').Instance();
var accountDb = require('./account');
var rand = require('../../tools/system/math').rand;
var cZuid= require('../common/zuid');

/**
 * 保存区Id名字对应的角色Id
 * @param zid [int] 区Id
 * @param name [string] 玩家名字
 * @param zuid [int] 用户Id
 * @param callback [func] 返回错误码[int] (retCode)
 */
var bindNameWithZuid = function(zid, name, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(zuid)[0];
    var key = redisClient.joinKey(redisKey.keyStringZuidByName, preZid + '#' + name);

    redisDB.SETNX(key, zuid, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(data) {
            callback(null);
        }
        else {
            callback(retCode.NAME_EXISTS);
        }
    });
};
exports.bindNameWithZuid = bindNameWithZuid;


/**
 * 用原区Id玩家名字查找角色Id
 * @param preZid [int] 原区Id
 * @param name [string] 玩家名字
 * @param callback [func] 返回错误码[int](retCode)和角色Id
 */
var getZuidByPreZidName = function(preZid, name, callback) {
    async.waterfall([
        /* 获取区信息 */
        function(cb) {
            accountDb.getZoneInfo(preZid, cb);
        },

        /* 查找角色Id */
        function(zoneInfo, cb) {
            var zid = zoneInfo.areaId;
            var redisDB = dbManager.getZoneRedisClient().getDB(zid);
            var key = redisClient.joinKey(redisKey.keyStringZuidByName, preZid + '#' + name);

            redisDB.GET(key, function(err, data) {
                if(err) {
                    cb(retCode.DB_ERR);
                }
                else if (data) {
                    cb(null, data);
                }
                else {
                    cb(retCode.ACCOUNT_NOT_EXIST);
                }
            });
        }
    ], callback);
};
exports.getZuidByPreZidName = getZuidByPreZidName;


/**
 * 根据区Id和名字查找所有zuid
 * @param zid [int] 区Id
 * @param name [string] 玩家名字
 * @param callback [func] 返回错误码[int](retCode)和角色Id数组
 */
var getAllzuidByZidName = function(zid, name, callback) {
    async.waterfall([
        /* 获取区信息 */
        function(cb) {
            accountDb.getAllZoneInfo(cb);
        },

        /* 查找角色Id */
        function(zoneInfos, cb) {
            var redisDB = dbManager.getZoneRedisClient().getDB(zid);
            var client = redisDB.MULTI();

            for(var i = 0; i < zoneInfos.length; ++i) {
                if(zoneInfos[i].areaId == zid) {
                    var key = redisClient.joinKey(redisKey.keyStringZuidByName, zoneInfos[i].areaId + '#' + name);
                    client.GET(key);
                }
            }

            client.EXEC(function(err, result) {
                if (err) {
                    cb(retCode.DB_ERR);
                    return;
                }

                var ret = [];
                for (var i = 0; i < result.length; ++i) {
                    if (result[i]) {
                        ret.push(result[i]);
                    }
                }
                cb(null, ret);
            });
        }
    ], callback);
};
exports.getAllzuidByZidName = getAllzuidByZidName;

/**
 * 保存玩家对象
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param player [obj] 玩家对象
 * @param changeLock [bool] 是否解锁
 * @param callback [func] 返回错误码[int] (retCode)
 */
var savePlayerData = function( zid, zuid, player, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPlayerByZuid, zuid);
    var lockKey = redisClient.joinLockKey(key);
    var value = JSON.stringify(player);

    redisDB.SET(key, value, function(err, result) {
        if(changeLock) redisDB.DEL(lockKey);

        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};
exports.savePlayerData = savePlayerData;


/**
 * 获取玩家对象
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param changeLock [bool] 是否上锁
 * @param callback [func] 返回错误码[int] (retCode)
 */
var getPlayerData = function(zid, zuid, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPlayerByZuid, zuid);
    var lockKey = redisClient.joinLockKey(key);
    var client = redisDB.MULTI();

    if(changeLock) {
        client.GET(key);
        client.SETNX(lockKey, 1);
        client.EXEC(function(err, result) {
            if(err) {
                callback(retCode.DB_ERR);
                return;
            }

            /* 锁校验 */
            if(0 == result[1]) {
                callback(retCode.PLAYER_LOCKED);
                return;
            }

            /* 数据存在性校验 */
            if(result[0]) {
                redisDB.EXPIRE(lockKey, 5);
                callback(null, JSON.parse(result[0]));
            }
            else {
                redisDB.DEL(lockKey);
                callback(retCode.PLAYER_NOT_EXIST);
            }
        });
    }
    else {
        redisDB.GET(key, function(err, result) {
            if(err) {
                callback(retCode.DB_ERR);
                return;
            }

            /* 数据存在性校验 */
            if(result) {
                callback(null, JSON.parse(result));
            }
            else {
                callback(retCode.PLAYER_NOT_EXIST);
            }
        });
    }
};
exports.getPlayerData = getPlayerData;

/**
 *判断玩家是否创角
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 * @param callback [func] 返回是否创角
 */
var isPlayerCreated = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPlayerByZuid, zuid);

    redisDB.EXISTS(key, function(err, result) {
        if(err) {
            callback(ret.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
};
exports.isPlayerCreated = isPlayerCreated;

/**
 * 解锁玩家对象
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 */
var openLockPlayerData = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPlayerByZuid, zuid);
    var lockKey = redisClient.joinLockKey(key);

    redisDB.DEL(lockKey);
};
exports.openLockPlayerData = openLockPlayerData;


/**
 * 获取玩家最后心跳时间
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param callback [func] 返回错误码和玩家最后登出时间
 */
var getLastHBTime = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetLastHBTimeByZid, zid);

    redisDB.ZSCORE(key, zuid, function(err, result) {
        if(err) {
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
exports.getLastHBTime = getLastHBTime;

/**
 * 更新玩家最后心跳时间
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 */
var updateLastHBTime = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetLastHBTimeByZid, zid);
    var now = parseInt(Date.now() / 1000);

    redisDB.ZADD(key, now, zuid);
};
exports.updateLastHBTime = updateLastHBTime;

/**
 * 在区中添加创角的zuid
 * @param zid [int] 区Id
 * @param zuid [string] 角色Id
 */
var addZuidInZone = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashZuidInZone, zid);

    async.waterfall([
        function(cb) {
            redisDB.HLEN(key, cb);
        },

        function(len, cb) {
            redisDB.HSET(key, len + 1, zuid);
            cb(null);
        }
    ]);
};
exports.addZuidInZone = addZuidInZone;

/**
 *随机获取区中的zuid
 * @param zid [int] 区Id
 * @param callback [func] 返回错误码和zuid数组
 */
var randomZuidsInZone = function(zid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashZuidInZone, zid);

    async.waterfall([
        function(cb) {
            redisDB.HLEN(key, cb);
        },

        function(len, cb) {
            var cnt = Math.max(len, 80);

            var idx = [];
            for(var i = 0; i < cnt; ++i) {
                var k = rand(1, cnt);
                if(idx.indexOf(k) == -1) {
                    idx.push(k);
                }
            }

            redisDB.HMGET(key, idx, function(err, result) {
                if(err) {
                    cb(retCode.DB_ERR);
                }
                else {
                    cb(null, result);
                }
            });
        }
    ], callback);
};
exports.randomZuidsInZone = randomZuidsInZone;
