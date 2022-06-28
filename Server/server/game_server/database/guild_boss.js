'user strict';
/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：记录公会BOSS和公会BOSS战斗人员信息
 * 完成最后击杀玩家ID
 * 开发者：应琪瑜
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var dbManager = require('../../manager/redis_manager').Instance();
var retCode = require('../../common/ret_code');
var logger = require('../../manager/log4_manager').LoggerGame;
var async = require('async');
var playerDb = require('./player');

/**
 *  获取公会BOSS信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param ifLock [int] 锁
 * @param cb [func] 返回错误码[int](retCode)和数据(公会BOSS信息)
 */
var getGuildBoss = function(zid, gid, ifLock, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var client = redisDB.MULTI();
    var key =  redisClient.joinKey(redisKey.keyHashGuildBossByZid, zid);
    var field = gid;
    if(ifLock) {
        var lockKey = redisClient.joinLockKey(redisClient.joinKey(redisKey.keyStringGuildBossLockByZidZgid, zid, gid));
        client.HGET(key, field);
        client.SETNX(lockKey, 1);
        client.EXEC(function(err, result) {
            if(!!err) {
                cb(retCode.DB_ERR);
                return;
            }
            /* 锁校验 */
            if(0 == result[1]) {
                cb(retCode.GUILD_BOSS_LOCKED);
                return;
            }
            if(result.length <= 0 || null === result[0]) {
                redisDB.DEL(lockKey);
                cb(retCode.GUILD_BOSS_NOT_EXIST);
                return;
            }
            redisDB.EXPIRE(lockKey, 5); /* guild boss lock will automatically be deleted after 5 seconds */
            cb(null, JSON.parse(result[0]));
        });
    } else {
        client.HGET(key, field);
        client.EXEC(function(err, result) {
            if(!!err) {
                cb(retCode.DB_ERR);
                return;
            }
            if(result.length <= 0 || null === result[0]) {
                cb(retCode.GUILD_BOSS_NOT_EXIST);
                return;
            }
            cb(null, JSON.parse(result[0]));
        });
    }
};

/**
 *  设置公会BOSS信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param ifLock [int] 锁
 * @param guildBoss [object] 公会BOSS信息
 * @param cb [func] 返回错误码[int](retCode)
 */
var setGuildBoss = function(zid, gid, ifLock, guildBoss, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashGuildBossByZid, zid);
    var field = gid;
    var client = redisDB.MULTI();
    
    client.HSET(key, field, JSON.stringify(guildBoss));
    client.EXEC(function(err) {
        if(ifLock) {
            var lockKey = redisClient.joinLockKey(redisClient.joinKey(redisKey.keyStringGuildBossLockByZidZgid, zid, gid));
            redisDB.DEL(lockKey);
        }
        if(!!err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null);
    });
};

/**
 *  获取公会BOSS战斗人员信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)和数据(公会BOSS战斗人员信息)
 */
var getGuildBossWarrior = function (zid, gid, uid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashGuildBossWarriorByZidZgid, zid, gid);
    var field = uid;
    var client = redisDB.MULTI();
    
    client.HGET(key, field);
    client.EXEC(function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(data.length <= 0 || null === data[0]) {
            cb(retCode.GUILD_BOSS_WARRIOR_NOT_EXIST);
            return;
        }
        cb(null, JSON.parse(data[0]));
    });
};

/**
 *  设置公会BOSS战斗人员信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)
 */
var setGuildBossWarrior = function(zid, gid, uid, guildBossWarrior, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashGuildBossWarriorByZidZgid, zid, gid);
    var field = uid;
    var client = redisDB.MULTI();
    
    client.HSET(key, field, JSON.stringify(guildBossWarrior));
    client.EXEC(function(err) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null);
    });
};

/**
 *  获取公会BOSS所有战斗人员信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)和数据(公会BOSS所有战斗人员信息)
 */
var getGuildBossAllWarrior = function (zid, gid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashGuildBossWarriorByZidZgid, zid, gid);
    var client = redisDB.MULTI();
    
    client.HVALS(key);
    client.EXEC(function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var allWarrior = data[0];
        for(var i = 0; i < allWarrior.length; i++) {
            allWarrior[i] = JSON.parse(allWarrior[i]);
        }
        /* */
        async.waterfall([
            function(cb) {
                async.filter(allWarrior,
                    function (warrior ,cb) {
                        cb(warrior.maxDamage > 0);
                    },
                    function (allWarrior) {
                        cb(null, allWarrior);
                    });
            },
            
            function(allWarrior, cb) {
                /* sort */
                var sortKey = 'maxDamage';
                async.sortBy(allWarrior,
                    function (warrior ,cb) {
                        cb(null, -warrior[sortKey]);
                    },
                    function (err, allWarrior) {
                        if (!!err) {
                            cb(err);
                            return;
                        }
                        cb(null, allWarrior);
                    });
            },

            function (allWarrior, cb) {
                /* get extend player data */
                var playerCommon = require('../common/player');
                async.forEach(allWarrior, function(warrior, cb) {
                    warrior.pets = [];
                    async.parallel({
                        getPlayerData: function(cb) {
                            playerDb.getPlayerData(zid, warrior.uid, false, function(err, player) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                warrior.name = player.name;
                                warrior.tid = player.character.tid;
                                warrior.vipLevel = player.vipLevel;
                                cb(null);
                            });
                        },

                        getPetsInBattle: function(cb) {
                            playerCommon.getPetsInBattle(zid, warrior.uid, function(err, pets) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                for(var i = 0; i < pets.length; i++) {
                                    warrior.pets.push(pets[i].tid);
                                }
                                cb(null);
                            });
                        }
                    }, function (err) {
                        cb(err);
                    });
                }, function(err) {
                    cb(err, allWarrior);
                });
            }
        ], function(err, allWarrior) {
            cb(err, allWarrior);
        });
    });
};

/**
 *  设置公会BOSS战斗人员信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param uid [int] 用户ID
 * @param guildBossAllWarrior[map] 战斗人员信息
 * @param cb [func] 返回错误码[int](retCode)
 */
var setGuildBossAllWarrior = function(zid, gid, guildBossAllWarrior, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashGuildBossWarriorByZidZgid, zid, gid);
    
    async.series({
        clearGuildWarriors: function (cb) {
            var client = redisDB.MULTI();
            client.DEL(key);
            client.EXEC(function(err) {
                if (err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                cb(null);
            });
        },

        setGuildWarriorrs: function (cb) {
            async.map(guildBossAllWarrior, function (warrior, cb) {
                var client = redisDB.MULTI();
                var field = warrior.uid;
                client.HSET(key, field, JSON.stringify(warrior));
                client.EXEC(function(err) {
                    if (err) {
                        cb(retCode.DB_ERR);
                        return;
                    }
                    cb(null);
                });
            }, function (err) {
                cb(err);
            });
        }
    }, function(err) {
        cb(err);
    });
};

/**
 *  获取zid内所有公会BOSS信息
 * @param zid [int] 区ID
 * @param cb [func] 返回错误码[int](retCode)和(zid内所有公会BOSS信息)
 */
var getZoneGuildBoss = function(zid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key =  redisClient.joinKey(redisKey.keyHashGuildBossByZid, zid);
    var client = redisDB.MULTI();

    client.HVALS(key);
    client.EXEC(function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var guildBosses = data[0];
        for(var i = 0; i < guildBosses.length; i++) {
            guildBosses[i] = JSON.parse(guildBosses[i]);
        }
        cb(null, guildBosses);
    });
};

exports.getGuildBoss = getGuildBoss;
exports.setGuildBoss = setGuildBoss;
exports.getGuildBossWarrior = getGuildBossWarrior;
exports.setGuildBossWarrior = setGuildBossWarrior;
exports.getGuildBossAllWarrior = getGuildBossAllWarrior;
exports.setGuildBossAllWarrior = setGuildBossAllWarrior;
exports.getZoneGuildBoss = getZoneGuildBoss;