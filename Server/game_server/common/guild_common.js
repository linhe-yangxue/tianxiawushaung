/**
 * 公会功能的公共方法
 */

var async = require('async');
var retCode = require('../../common/ret_code');
var guildDb = require('../database/guild');
var playerDb = require('../database/player');
var guildShopDb = require('../database/guild_shop');
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var dbManager = require("../../manager/redis_manager").Instance();
var redisClient = require('../../tools/redis/redis_client');
var redisKey = require('../../common/redis_key');
var cNotice = require('./notification');
var shopDb =  require('../database/shop');
var shopCommon = require('./shop_common');

/**
 * 添加公会动态信息
 * @param zid [int] 区Id
 * @param gid [int] 公会Id
 * @param uid [int] 被记录的角色Id
 * @param name [int] 被操作角色名
 * @param infoType [int] 信息类型
 * @param cb [err]
 */
var addGuildDynamicInfo = function(zid, gid, uid, name, infoType, cb) {

    async.waterfall([

        function (callback) {
            guildDb.getGuildDynamicInfoLen(zid, gid, callback);
        },
        function (len, callback) {
            if (len >= 50) {
                guildDb.delGuildDynamicInfo(zid, gid);
            }
            callback(null);
        },
        function(callback) {
            var obj = new globalObject.GuildDynamicInfo();

            obj.zuid = uid;
            obj.nickname = name;
            obj.infoType = infoType;
            guildDb.insertGuildDynamicInfo(zid, gid, obj);
            callback(null);
        }
    ], function (err) {
        cb(err);
    });
};

/**
 * 加公会经验
 * @param zid [int] 合区后的区id
 * @param zuid [string] 合区前的区id拼接uid
 * @param exp [int] 公会经验
 * @param callback [function] 回调是否成功
 */
var addGuildExp = function(zid, zuid, exp, callback) {
    var guildId = '';
    var upgrade = 0;
    var guild = null;
    async.waterfall([
        function(callback) {
            playerDb.getPlayerData(zid, zuid, false, function(err, player) {
                if(err) {
                    callback(err);
                    return;
                }
                if(player.guildId.length <= 0) {
                    callback(retCode.GUILD_ID_NOT_EXIST);
                    return;
                }
                guildId = player.guildId;
                callback(null);
            });
        },
        function(callback) {
            /* 获取公会对象 */
            guildDb.getGuildInfoByGid(zid, guildId, true, callback);
        },
        function(guildInfo, callback) {
            guild = guildInfo;
            var guildCreation = csvManager.GuildCreated();
            var length = Object.keys(guildCreation).length;
            guild.exp +=  exp;
            var index = guild.level >= length ? length:guild.level +1; /*这里+1表示当前等级升到下一等级所需要的经验值的索引 */
            var expNeed = guildCreation[index].EXP;
            while (guild.exp >= expNeed && guild.level < length) {
                upgrade = 1;
                guild.exp -= expNeed;
                guild.level += 1;
                index = guild.level >= length ? length:guild.level +1;
                expNeed = parseInt(guildCreation[index].EXP);
                if(index == length) {/* 达到顶级时公会经验值设置为不变 */
                    guild.exp = guildCreation[index].EXP;
                    break;
                }
            }
            guildDb.updateGuildInfo(zid, guild, true, callback);
        },
        function(callback) {
            if (upgrade == 1) { /* 更新公会排行 */
                guildDb.updateGuildRankList(zid, guildId, guild.level, parseInt(Date.now() / 1000), callback);
                return;
            }
            callback(null);
        }
    ],function(err) {
            callback(err);
    });
};

/**
 *获取公会红点通知
 * @param zid [int] 区id
 * @param zuid [string]
 * @param zgid [string]
 * @param callback [function] 回调是否成功
 */
function getGuildNotice(zid, zuid, zgid, callback) {
    var array = [];
    var guildLevel = 0;
    async.waterfall([
        function (cb) {
            getNotice(zid, zuid, cb);
        },
        function(arr, cb) { /* 公会会长判断是否申请者红点 */
            array = arr;
            guildDb.getGuildInfoByGid(zid, zgid, false, function(err, guildInfo) {
                if(err == retCode.GUILD_NOT_EXIST) {
                    cb(null, 0);
                    return;
                }
                guildLevel = guildInfo.level;
                var flag = guildInfo.member.some(function(elem) {
                    return (elem.zuid == zuid && elem.title != 0);
                });
                if(flag && guildInfo.applyMember.length > 0) {
                    array.push(cNotice.NOTIF_GUILD_APPLY);
                }
                var worshipSchedule = csvManager.WorshipSchedule()[guildInfo.level];
                if(null == worshipSchedule) {
                    cb(null, 0);
                    return;
                }
                for(var i = 1; i <= 5; ++i) {
                    if(guildInfo.liveness >= worshipSchedule['SCHEDULE_'+i]) {
                        continue;
                    }
                    cb(null, i-1);
                    return;
                }
            });
        },
        /* 公会祭天奖励进度 */
        function(schedule, cb) {
            if(schedule <= 0) {
                cb(null);
                return;
            }
            guildDb.getRewardInfo(zid, zgid, zuid, function(err, array) {
                if(err) {
                    cb(err);
                    return;
                }
                if(schedule > array.length) {
                    array.push(cNotice.NOTIF_GUILD_REWARD);
                }
                cb(null);
            });
        },
        function(cb) { /* 公会商店限时购买红点 */
            var nowTime = parseInt(Date.now() / 1000);
            shopDb.getRefreshTime(zid, zgid, zuid, nowTime, 'guild_other' , function(err, time) {
                if(err) {
                    cb(err);
                    return;
                }
                var fresh = shopCommon.isFresh(time, nowTime);
                if(fresh) {
                    array.push(cNotice.NOTIF_GUILD_SHOP);
                }
                cb(null);
            });
        }
    ], function(err) {
        if(err) {
            callback(err);
            return;
        }
        callback(null, array);
    });
}

/**
 *增加公会红点通知
 * @param zid [int] 区id
 * @param array [array] 成員數組
 * @param zuid [string] 角色id
 *  @param type [int] 红点类型
 */
function addGuildNotice(zid, zuid, array, type) {
    var key = null;
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    if (type < 55) {
        key = redisClient.joinKey(redisKey.keyHashGuildNoticeByZuid, zuid);
        redisDB.HSET(key, type, type);
    } else {
        var len = array.length;
        var mClient = redisDB.MULTI();
        for(var i = 0; i < len; ++i) {
            key = redisClient.joinKey(redisKey.keyHashGuildNoticeByZuid, array[i].zuid);
            mClient.HSET(key, type, type);
        }
        mClient.EXEC(function(err) {});
    }
}

/**
 *删除公会红点通知
 * @param zid [int] 区id
 * @param zuid [string] 角色id
 *  @param type [int] 红点类型
 */
function delGuildNotice(zid, zuid, type) {

    var key = redisClient.joinKey(redisKey.keyHashGuildNoticeByZuid, zuid);
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    redisDB.HDEL(key, type);
}

/**
 *获取公会触发类型红点
 * @param zid [int] 区id
 * @param zuid [string] 角色id
 *  @param callback [function]
 */
function getNotice(zid, zuid, callback) {
    var key = redisClient.joinKey(redisKey.keyHashGuildNoticeByZuid, zuid);
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    redisDB.HVALS(key,function (err, result) {
        if (err) {
            callback(retCode.DB_ERR);
            return;
        }
        var len = result.length;
        for (var i = 0; i < len; ++i) {
            if (null == result[i]) {
                continue;
            }
            result[i] = parseInt(result[i]);
        }
        callback(null, result);
    });
}
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 添加公会动态信息
 * @param zid [int] 区Id
 * @param gid [int] 公会Id
 * @param uid [int] 自己角色Id
 * @param playerData [int] 被操作角色名
 * @param infoType [int] 信息类型
 * @param callback [err]
 */
exports.addGuildDynamicInfo = addGuildDynamicInfo;
/**
 * 加公会经验
 * @param zid [int] 合区后的区id
 * @param zuid [string] 合区前的区id拼接uid
 * @param exp [int] 公会经验
 * @param callback [function] 回调是否成功
 */
exports.addGuildExp = addGuildExp;
/**
 *获取公会红点通知
 * @param zid [int] 区id
 * @param zuid [string]
 * @param callback [function] 回调是否成功
 */
exports.getGuildNotice = getGuildNotice;
/**
 *增加公会红点通知
 * @param zid [int] 区id
 * @param zgid [string] 公会id
 * @param zuid [string] 角色id
 *  @param type [int] 红点类型
 */
exports.addGuildNotice = addGuildNotice;
/**
 *删除公会红点通知
 * @param zid [int] 区id
 * @param zgid [string] 公会id
 * @param zuid [string] 角色id
 *  @param type [int] 红点类型
 */
exports.delGuildNotice = delGuildNotice;





















