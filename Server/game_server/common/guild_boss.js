var timeUtil = require('../../tools/system/time_util');
var csvManager = require('../../manager/csv_manager').Instance();
var retCode = require('../../common/ret_code');
var async = require('async');
var guildBossDatabase = require('../database/guild_boss');
var guildDb = require('../database/guild');
var playerDb = require('../database/player');

const GUILD_BOSS_BATTLE_START_TIME = {hours: 16, minutes: 0}; /* 公会BOSS开始的开始时间 */
const GUILD_BOSS_BATTLE_END_TIME = {hours: 22, minutes: 0}; /* 公会BOSS结束的结束时间 */
const GUILD_BOSS_REWARD_STATE_HASE_GET = 1; /* 公会BOSS死亡奖励已经领取 */

/**
 * 检查是否到了领取BOSS死亡奖励的时间
 * cb [Func] : 回调函数
 */
var checkGetRewardTime = function (cb) {
    if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
        cb(null);
        return;
    }
    var timeNow = timeUtil.now();
    if(timeNow < new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), GUILD_BOSS_BATTLE_START_TIME.hours, GUILD_BOSS_BATTLE_START_TIME.minutes)) {
        cb(retCode.GUILD_BOSS_GETREWARD_TIME_NOT_ARRIVE);
        return;
    }
    cb(null);
}

/**
 * 检查是否到了BOSS战斗的时间
 * cb [Func] : 回调函数
 */
var checkBossBattleTime = function (cb) {
    if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
        cb(null);
        return;
    }
    var timeNow = timeUtil.now();
    var guildBossStartTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(),
        GUILD_BOSS_BATTLE_START_TIME.hours, GUILD_BOSS_BATTLE_START_TIME.minutes);
    var guildBossEndTime = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(),
        GUILD_BOSS_BATTLE_END_TIME.hours, GUILD_BOSS_BATTLE_END_TIME.minutes);
    /* guild boss is not available because of the error time */
    if (timeNow < guildBossStartTime || timeNow > guildBossEndTime) {
        cb(retCode.GUILD_BOSS_CAN_NOT_AVAILABLE);
        return;
    }
    cb(null);
}

/**
 *  获取公会BOSS血量
 * @param mid [int] 公会BOSS的INDEX
 * @param cb [func] 返回错误码[int](retCode)和数据(公会BOSS血量)
 */
var getGuildBossHealth = function (mid, cb) {
    var guildBossConfig = csvManager.GuildBoss()[mid];
    if(undefined === guildBossConfig || null === guildBossConfig) {
        cb(retCode.GUILD_BOSS_NOT_EXIST);
        return;
    }
    var stageConfig = csvManager.StageConfig()[guildBossConfig.STAGE_ID];
    if(undefined === stageConfig || null === stageConfig) {
        cb(retCode.GUILD_BOSS_STAGE_NOT_EXIST);
        return;
    }
    var monsterObjectConfig = csvManager.MonsterObject()[stageConfig.HEADICON];
    if(undefined === monsterObjectConfig || null === monsterObjectConfig) {
        cb(retCode.GUILD_BOSS_MONSTER_OBJECT_NOT_EXIST);
        return;
    }
    cb(null, monsterObjectConfig.BASE_HP);
}

/**
 * 检查是否可以开始战斗
 * @param zid [zid] 大区id
 * @param uid [uid] 用户zuid
 * @param gid [gid] 公会zgid
 * @param cb [func] 返回错误码[int](retCode)和数据(guildBossWarrior对象)
 */
var checkBattleStart = function (zid, uid, gid, cb) {
    async.parallel({
        checkBattleTime: function (cb) {
            checkBossBattleTime(cb);
        },

        checkBossHealth: function (cb) {
            guildBossDatabase.getGuildBoss(zid, gid, false, function (err, guildBoss) {
                if (!!err) {
                    cb(err);
                    return;
                }
                if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                    cb(null);
                    return;
                }
                if (guildBoss.monsterHealth <= 0) {
                    cb(retCode.GUILD_BOSS_HAS_DEAD);
                    return;
                }
                cb(null);
            });
        },

        checkBattleChance: function(cb) {
            guildBossDatabase.getGuildBossWarrior(zid, gid, uid, function(err, guildBossWarrior) {
                if(!!err) {
                    cb(err);
                    return;
                }
                if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                    cb(null, guildBossWarrior);
                    return;
                }
                if(guildBossWarrior.leftBattleTimes <= 0) {
                    cb(retCode.GUILD_BOSS_LEFT_BATTLE_TIMES_RUNOUT);
                    return;
                }
                cb(null, guildBossWarrior);
            });
        }
    }, function (err, results) {
        if(!!err) {
            cb(err);
            return;
        }
        cb(null, results.checkBattleChance);
    });
}

/**
 * 检查是否可以领取奖励
 * @param zid [zid] 大区id
 * @param uid [uid] 用户zuid
 * @param gid [gid] 公会zgid
 * @param cb [func] 返回错误码[int](retCode)和数据(guildBoss和guildBossWarrior对象)
 */
var checkGetReward = function (zid, uid, gid, cb) {
    var guildBoss;
    var guildBossWarrior;

    async.series({
        checkGuildBossHealth: function (cb) {
            guildBossDatabase.getGuildBoss(zid, gid, false, function (err, data) {
                if (!!err) {
                    cb(err);
                    return;
                }
                guildBoss = data;
                if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                    cb(null);
                    return;
                }
                if(guildBoss.monsterHealth > 0) {
                    cb(retCode.GUILD_BOSS_NOT_DEAD);
                    return;
                }
                cb(null);
            });
        },

        checkGetRewardTime:  function (cb) {
            checkGetRewardTime(cb);
        },

        checkRewardState: function (cb) {
            guildBossDatabase.getGuildBossWarrior(zid, gid, uid, function (err, warrior) {
                if(!!err) {
                    cb(err);
                    return;
                }
                guildBossWarrior = warrior;
                if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                    cb(null);
                    return;
                }
                if(guildBossWarrior.rewardState === GUILD_BOSS_REWARD_STATE_HASE_GET) {
                    cb(retCode.GUILD_BOSS_REWARD_HAS_GET);
                    return;
                }
                cb(null);
            });
        },

        checkJoinGuildTime: function (cb) {
            guildDb.getGuildInfoByGid(zid, gid, false, function (err, guild) {
                if (!!err) {
                    cb(err);
                    return;
                }
                if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                    cb(null);
                    return;
                }
                for (var i = 0; i < guild.member.length; ++i) {
                    if (guild.member[i].zuid == uid) {
                        /* */
                        var guildMemberInfo = guild.member[i];
                        if(guildMemberInfo.joinTime > guildBoss.criticalStrikeTime) {
                            cb(retCode.GUILD_BOSS_JOIN_GUILD_LATE);
                            return;
                        }
                        cb(null);
                        return;
                    }
                }
                cb(retCode.GUILD_BOSS_MEMBER_NOT_EXIST);
            });
        }
    }, function (err) {
        if(!!err) {
            cb(err);
            return;
        }
        cb(null, guildBoss, guildBossWarrior);
    });
}

/**
 * 获取公会ID
 * @param zid [zid] 大区id
 * @param uid [uid] 用户zuid
 * @param gid [gid] 公会zgid
 * @param res [object] 返回对象
 * @param cb [func] 返回错误码[int](retCode)和数据(公会gid)
 */
var checkGuildId = function (zid, uid, res, cb) {
    playerDb.getPlayerData(zid, uid, false, function (err, player) {
        if(!!err) {
            cb(err);
            return;
        }
        if(null === player || undefined === player) {
            cb(retCode.PLAYER_NOT_EXIST);
            return;
        }
        res.guildId = player.guildId;
        if(player.guildId.length <= 0) {
            cb(retCode.SUCCESS); // 公会不存在,直接返回不进行后续处理
            return;
        }
        cb(null, player.guildId); // 返回公会ID
    });
}

exports.GUILD_BOSS_BATTLE_START_TIME = GUILD_BOSS_BATTLE_START_TIME;
exports.GUILD_BOSS_BATTLE_END_TIME = GUILD_BOSS_BATTLE_END_TIME;
exports.GUILD_BOSS_REWARD_STATE_HASE_GET = GUILD_BOSS_REWARD_STATE_HASE_GET;
exports.getGuildBossHealth = getGuildBossHealth;
exports.checkBattleStart = checkBattleStart;
exports.checkGetReward = checkGetReward;
exports.checkGuildId = checkGuildId;