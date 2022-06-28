/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：竞技场
 * 开发者：应琪瑜
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
var retCode = require('../../common/ret_code');
var csvManager = require('../../manager/csv_manager').Instance();
var dbManager = require("../../manager/redis_manager").Instance();
var globalObject = require('../../common/global_object');
var rand = require('../../tools/system/math').rand;
var accountDb = require('./account');
var redisClient = require('../../tools/redis/redis_client');
var robotCommon = require('../../common/robot');
var arenaRobots = require('./arena.json');

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 随机生成名字
 * @returns {string}
 */
var getRandomName = function() {
    var table = csvManager.FirstName();
    var a = table[rand(1000, 1558)].FIRSTNAME;
    var b = table[rand(1000, 1558)].MIDDLENAME;
    var c = table[rand(1000, 1558)].LASTNAME;

    return a + b + c;
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 创建竞技场排行榜
 * @param cb 返回错误码[int] (retCode)
 */
var createArenaRank  = function(cb) {
    async.waterfall([
        function(cb) {
            accountDb.getAllZoneInfo(cb);
        },

        function(zoneInfos, cb) {
            var zidList = [];
            for(var i = 0; i < zoneInfos.length; ++i) {
                if(zidList.indexOf(zoneInfos[i].areaId) == -1) {
                    zidList.push(zoneInfos[i].areaId);
                }
            }

            async.each(zidList, function (zid, cb) {
                var dbConnArrGlobal = dbManager.getZoneRedisClient();
                var key = redisClient.joinKey(redisKey.keyListArenaRankListByZid, zid);
                var redisDB = dbConnArrGlobal.getDB(zid);

                redisDB.EXISTS(key, function (err, result) {
                    if (!!err) {
                        cb(retCode.DB_ERR);
                        return;
                    }
                    if (1 === result) {
                        cb(null);
                        return;
                    }
                    var i = 1;
                    var j = Object.keys(csvManager.RobotConfig()).length;

                    async.whilst(function () {
                            return i <= j;
                        },
                        function (cb) {
                            redisDB.RPUSH(key, -i, function (err) {
                                if (!!err) {
                                    cb(retCode.DB_ERR);
                                    return;
                                }
                                i += 1;
                                cb(null);
                            });
                        }, cb);
                });
            }, cb);
        }
    ], cb);
};

/**
 *  初始化新的竞技场战斗人员信息(包括排行榜)
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)
 */
var initDefaultArenaWarrior = function (zid, uid, cb) {
    var arenaWarrior = new (globalObject.ArenaWarrior)();
    arenaWarrior.zid = zid;
    arenaWarrior.uid = uid;
    async.series({
        setArenaWarriorRank: function (cb) {
            addArenaWarriorRank(zid, uid, function (err, curRank) {
                if(!!err) {
                    cb(err);
                    return;
                }
                arenaWarrior.bestRank = curRank;
                arenaWarrior.curRank = curRank;
                cb(null);
            });
        },

        setArenaWarrior: function (cb) {
            setArenaWarrior(zid, uid, false, arenaWarrior, cb);
        }
    }, function (err) {
        if(!!err) {
            cb(err);
            return;
        }
        cb(null, arenaWarrior);
    });
}

/**
 *  获取竞技场战斗人员信息,如果没有,则进行初始化
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param ifLock [bool] 是否上锁
 * @param cb [func] 返回错误码[int](retCode)和数据(竞技场战斗人员信息)
 */
var getArenaWarrior = function (zid, uid, ifLock, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var client = redisDB.MULTI();
    var key = redisClient.joinKey(redisKey.keyHashArenaWarriorByZid, zid);
    var field = uid;
    if(ifLock) {
        var lockKeyBattle =  redisClient.joinLockKey(redisClient.joinKey(redisKey.keyStringArenaBattleLockByZidZuid, zid, uid));
        client.HGET(key, field);
        client.SETNX(lockKeyBattle, 1);
        client.EXEC(function(err, result) {
            if (!!err) {
                cb(retCode.DB_ERR);
                return;
            }
            /* 锁校验 */
            if(0 == result[1]) {
                cb(retCode.PLAYER_LOCKED);
                return;
            }
            /* 初始化竞技场信息 */
            if (undefined === result[0] || null === result[0]) {
                var client = redisDB.MULTI();
                var lockKey =  redisClient.joinLockKey(redisClient.joinKey(redisKey.keyStringArenaWarriorInitLockByZidZuid, zid, uid));
                client.HGET(key, field); /* get and lock operation guarantee the arena info is initialized only once */
                client.SETNX(lockKey, 1);
                client.EXEC(function(err, result) {
                    if(!!err) {
                        redisDB.DEL(lockKeyBattle);
                        cb(retCode.DB_ERR);
                        return;
                    }
                    /* 锁校验 */
                    if(0 == result[1]) {
                        redisDB.DEL(lockKeyBattle);
                        cb(retCode.PLAYER_LOCKED);
                        return;
                    }
                    if(undefined === result[0] || null === result[0]) {
                        initDefaultArenaWarrior(zid, uid, function (err, warrior) {
                            redisDB.DEL(lockKey);
                            if(!!err) {
                                redisDB.DEL(lockKeyBattle); /* init failed, delete battle key*/
                                cb(err);
                                return;
                            }
                            redisDB.EXPIRE(lockKeyBattle, 5);
                            cb(null, warrior);
                        });
                        return;
                    }
                    redisDB.DEL(lockKey);
                    redisDB.EXPIRE(lockKeyBattle, 5); /* arena battle lock will automatically be deleted after 5 seconds */
                    cb(null, JSON.parse(result[0]));
                });
                return;
            }
            redisDB.EXPIRE(lockKeyBattle, 5); /* arena battle lock will automatically be deleted after 5 seconds */
            cb(null, JSON.parse(result[0]));
        });
    }
    else {
        redisDB.HGET(key, field, function(err, result) {
            if (!!err) {
                cb(retCode.DB_ERR);
                return;
            }
            if (undefined === result || null === result) {
                var lockKey =  redisClient.joinLockKey(redisClient.joinKey(redisKey.keyStringArenaWarriorInitLockByZidZuid, zid, uid));
                client.HGET(key, field); /* get and lock operation guarantee the arena info is initialized only once */
                client.SETNX(lockKey, 1);
                client.EXEC(function(err, result) {
                    if(!!err) {
                        cb(retCode.DB_ERR);
                        return;
                    }
                    /* 锁校验 */
                    if(0 == result[1]) {
                        cb(retCode.PLAYER_LOCKED);
                        return;
                    }
                    if(undefined === result[0] || null === result[0]) {
                        initDefaultArenaWarrior(zid, uid, function (err, warrior) {
                            redisDB.DEL(lockKey);
                            if(!!err) {
                                cb(err);
                                return;
                            }
                            cb(null, warrior);
                        });
                        return;
                    }
                    redisDB.DEL(lockKey);
                    cb(null, JSON.parse(result[0]));
                });
                return;
            }
            cb(null, JSON.parse(result));
        });
    }
}

/**
 *  设置玩家的竞技场信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param ifLock [bool] 是否加锁
 * @param warrior {ArenaWarrior} 战斗人员信息
 * @param cb [func] 返回错误码[int](retCode)
 */
var setArenaWarrior = function (zid, uid, ifLock, warrior, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashArenaWarriorByZid, zid);
    var field = uid;

    redisDB.HSET(key, field, JSON.stringify(warrior), function (err) {
        if(ifLock) {
            var lockKey = redisClient.joinLockKey(redisClient.joinKey(redisKey.keyStringArenaBattleLockByZidZuid, zid, uid));
            redisDB.DEL(lockKey);
        }
        if(!!err) {
            cb(err);
            return;
        }
        cb(null);
    });
}

/**
 *  根据竞技场排名获取用户ID
 * @param zid [int] 区ID
 * @param rank [int] 竞技场排名
 * @param cb [func] 返回错误码[int](retCode)和数据(用户ID)
 */
var getArenaWarriorRank = function (zid, rank, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListArenaRankListByZid, zid);
    var index = rank;

    redisDB.LINDEX(key, index, function (err, warriorUid) {
        if(!!err) {
            cb(err);
            return;
        }
        if(undefined === warriorUid || null === warriorUid) {
            cb(retCode.ARENA_NO_RANK);
            return;
        }
        cb(null, warriorUid);
    });
}

/**
 *  设置竞技场排行榜
 * @param zid [int] 区ID
 * @param rank [int] 排名
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)
 */
var setArenaWarriorRank = function (zid, rank, uid, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListArenaRankListByZid, zid);
    var index = rank;
    redisDB.LSET(key, index, uid, cb);
}

/**
 *  获取竞技场战斗记录
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param beginIndex [int] 开始下标
 * @param endIndex [int] 结束下标
 * @param cb [func] 返回错误码[int](retCode)和数据(竞技场战斗记录)
 */
var getArenaWarriorBattleRecordBatch = function (zid, uid, beginIndex, endIndex, cb) {
    var dbConnArrGlobal = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGlobal.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListArenaBattleRecordByZidZuid, zid, uid);

    redisDB.LRANGE(key, beginIndex, endIndex, function (err, battleRecords) {
        if(!!err) {
            cb(err);
            return;
        }
        for(var i = 0; i < battleRecords.length; i++) {
            battleRecords[i] = JSON.parse(battleRecords[i]);
        }
        cb(null, battleRecords);
    });
}

/**
 *  记录竞技场战斗
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param battleRecord {ArenaBattleRecord} 竞技场战斗记录
 * @param cb [func] 返回错误码[int](retCode)
 */
var addArenaWarriorBattleRecord = function (zid, uid, battleRecord, battleRecrdsNumLimit, cb) {
    var dbConnArrGlobal = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGlobal.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListArenaBattleRecordByZidZuid, zid, uid);

    async.series({
        push: function (cb) {
            redisDB.LPUSH(key, JSON.stringify(battleRecord), cb);
        },

        trim: function (cb) {
            redisDB.LLEN(key, function (err, length) {
                if(!!err) {
                    cb(err);
                    return;
                }
                if(length > battleRecrdsNumLimit) {
                    redisDB.LTRIM(key, 0, battleRecrdsNumLimit - 1, cb);
                    return;
                }
                cb(null);
            });
        }
    }, cb);
};

/**
 *  将新玩家添加到竞技场排名列表中
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)
 */
var addArenaWarriorRank = function (zid, uid, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListArenaRankListByZid, zid);
    var client = redisDB.MULTI();

    client.LLEN(key);
    client.RPUSH(key, uid);
    client.EXEC(function (err, results) {
        if(!!err) {
            cb(err);
            return;
        }
        var curRank = results[0];
        if(undefined === curRank || null === curRank) {
            cb(retCode.ARENA_DEFAULT_WARRIOR_RANK_NOT_EXIST);
            return;
        }
        cb(null, curRank);
    });
}

/**
 *  获取机器人
 * @param uid [int] 机器人ID
 * @param cb [func] 返回错误码[int](retCode)和数据(机器人信息)
 */
var getArenaRobot =function(uid, cb) {
    uid = Math.abs(uid);

    if(arenaRobots.hasOwnProperty(uid)) {
        cb(null, arenaRobots[uid]);
    }
    else {
        cb(retCode.ARENA_ROBOT_NOT_FOUND);
    }
};

/**
 *  交换竞技场排名
 * @param zid [int] 区ID
 * @param arenaPrincipal {ArenaWarrior} 本人竞技场信息
 * @param arenaRival {ArenaWarrior} 对手竞技场信息
 * @param cb [func] 返回错误码[int](retCode)
 */
var exchangeArenaRank = function (zid, arenaPrincipal, arenaRival, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var client = redisDB.MULTI();
    /* */
    var keyWarrior = redisClient.joinKey(redisKey.keyHashArenaWarriorByZid, zid);
    var fieldWarriorPrincipal = arenaPrincipal.uid;
    client.HSET(keyWarrior, fieldWarriorPrincipal, JSON.stringify(arenaPrincipal));
    var lockKeyPrincipal = redisClient.joinLockKey(redisClient.joinKey(redisKey.keyStringArenaBattleLockByZidZuid, zid, arenaPrincipal.uid));
    client.DEL(lockKeyPrincipal);
    if(!robotCommon.checkIfRobot(arenaRival.uid)) {
        var fieldWarriorRival = arenaRival.uid;
        client.HSET(keyWarrior, fieldWarriorRival, JSON.stringify(arenaRival));
        var lockKeyRival = redisClient.joinLockKey(redisClient.joinKey(redisKey.keyStringArenaBattleLockByZidZuid, zid, arenaRival.uid));
        client.DEL(lockKeyRival);
    }
    /* */
    var keyRank = redisClient.joinKey(redisKey.keyListArenaRankListByZid, zid);
    client.LSET(keyRank, arenaPrincipal.curRank, arenaPrincipal.uid);
    client.LSET(keyRank, arenaRival.curRank, arenaRival.uid);
    /* */
    client.EXEC(cb);
}

/**
 *  获取竞技场炮灰信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)和数据(竞技场炮灰详细信息)
 */
var getArenaCannonFodder = function (zid, uid, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringArenaCannonFodderByZidZuid, zid, uid);
    redisDB.GET(key, function (err, cannonFodder) {
        if(!!err) {
            cb(err);
            return;
        }
        cb(null, JSON.parse(cannonFodder));
    });
}

/**
 *  记录竞技场炮灰信息
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param arenaCannonFodder {PlayerFightDetail} 竞技场炮灰详细信息
 * @param cb [func] 返回错误码[int](retCode)
 */
var setArenaCannonFodder = function (zid, uid, arenaCannonFodder, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringArenaCannonFodderByZidZuid, zid, uid);
    redisDB.SET(key, JSON.stringify(arenaCannonFodder), cb);
}

/**
 *  记录竞技场战斗人员首次战斗
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)
 */
var setArenaWarriorFirstBattle = function (zid, uid, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringArenaWarriorFirstBattle, zid, uid);
    redisDB.SET(key, parseInt(Date.now() / 1000), cb);
}

/**
 *  获取竞技场战斗人员首次战斗标记
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)和数据(首次战斗标记)
 */
var getArenaWarriorFirstBattle = function (zid, uid, cb) {
    var dbConnArrGS = dbManager.getZoneRedisClient();
    var redisDB = dbConnArrGS.getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringArenaWarriorFirstBattle, zid, uid);
    redisDB.EXISTS(key, cb);
}

exports.getRandomName = getRandomName;
exports.createArenaRank = createArenaRank;
exports.getArenaWarrior = getArenaWarrior;
exports.setArenaWarrior = setArenaWarrior;
exports.getArenaWarriorBattleRecordBatch = getArenaWarriorBattleRecordBatch;
exports.addArenaWarriorBattleRecord = addArenaWarriorBattleRecord;
exports.getArenaWarriorRank = getArenaWarriorRank;
exports.setArenaWarriorRank = setArenaWarriorRank;
exports.getArenaRobot = getArenaRobot;
exports.exchangeArenaRank = exchangeArenaRank;
exports.getArenaCannonFodder = getArenaCannonFodder;
exports.setArenaCannonFodder = setArenaCannonFodder;
exports.setArenaWarriorFirstBattle = setArenaWarriorFirstBattle;
exports.getArenaWarriorFirstBattle = getArenaWarriorFirstBattle;
