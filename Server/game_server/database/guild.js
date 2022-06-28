/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：公会数据模块
 * 开发者：杨磊
 * 开发者备注：公会相关数据的增删改查功能实现
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var dbManager = require("../../manager/redis_manager").Instance();
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var async = require('async');
var globalObject = require('../../common/global_object');
var itemType= require('../../game_server/common/item_type');
var accountDb = require('./account');
var cZuid = require('../common/zuid');

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 创建公会对象
 * @param guildInfo [object] guild对象
 * @param zid [int] 区id
 * @param zuid [string] 用户Id
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var createGuildInfo = function(guildInfo, zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var globalRedisDB = dbManager.getGlobalRedisClient().getDB(0);
    var preZid = cZuid.zuidSplit(zuid)[0];
    var key = redisClient.joinKey(redisKey.keyStringGidByPreZidName, preZid + '#' + guildInfo.name);
    var key1 =  redisClient.joinKey(redisKey.keyStringGidSerial);

    var zgid = '';
    async.waterfall([
        function(cb) {
            redisDB.GET(key, function(err, data) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                if(data) {
                    cb(retCode.GUILD_EXIST);
                    return;
                }
                cb(null);
            });
        },
        function(cb) {
            globalRedisDB.INCR(key1, function(err, gid) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                cb(null, gid);
            });
        },
        function(gid, cb) {
            zgid = redisClient.joinKey(preZid, gid);
            redisDB.SETNX(key, zgid, function(err, success) {
                if (err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                if (!success) {
                    cb(retCode.GUILD_EXIST);
                    return;
                }

                guildInfo.gid = zgid;
                var key2 = redisClient.joinKey(redisKey.keyHashGuildInfoByPreZid, preZid);

                var value2 = JSON.stringify(guildInfo);
                redisDB.HSET(key2, zgid, value2, function(err) {
                    if(err) {
                        cb(retCode.DB_ERR);
                        return;
                    }
                    cb(null);
                });
            });
        }
    ], function(err) {
        callback(err);
    });
};

/**
 * 删除公会对象
 * @param zid [int] 区id
 * @param zgid [int] 公会id
 * @param name [string] 公会名称
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var deleteGuildInfo = function(zid, zgid, name, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(zgid)[0];
    var key = redisClient.joinKey(redisKey.keyHashGuildInfoByPreZid, preZid);
    var key2 = redisClient.joinKey(redisKey.keyStringGidByPreZidName, preZid + '#' + name);
    var key3 = redisClient.joinKey(redisKey.keySortedSetGuildByZid, zid);

    var client = redisDB.MULTI();
    client.HDEL(key, zgid);
    client.DEL(key2);
    client.ZREM(key3, zgid);
    client.EXEC(function(err) {
       if(err) {
           callback(retCode.DB_ERR);
           return;
       }
        callback(null);
    });
};

/**
 * 获取公会对象
 * @param zid [int] 区ID
 * @param zgid [int] guildId
 * @param changeLock [bool] 是否上锁
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数guildInfo对象
 */
var getGuildInfoByGid = function(zid, zgid, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(zgid)[0];
    var key = redisClient.joinKey(redisKey.keyHashGuildInfoByPreZid, preZid);
    var lockKey = redisClient.joinLockKey(key);


    if(changeLock) {
        var client = redisDB.MULTI();
        client.HGET(key, zgid);
        client.SETNX(lockKey, 1);
        client.EXEC(function(err, result) {
            if(err) {
                redisDB.DEL(lockKey);
                callback(retCode.DB_ERR);
                return;
            }
            /* 锁校验 */
            if(0 == result[1]) {
                callback(retCode.GUILD_LOCKED);
                return;
            }
            /* 数据存在性校验 */
            if(result[0]) {
                redisDB.EXPIRE(lockKey, 2);
                callback(null, JSON.parse(result[0]));
            }
            else {
                redisDB.DEL(lockKey);
                callback(retCode.GUILD_NOT_EXIST);
            }
        });
    }
    else {
        redisDB.HGET(key, zgid, function(err, result) {
            if (err) {
                callback(retCode.DB_ERR);
                return;
            }
            if(result) {
                callback(null, JSON.parse(result));
            }
            else{
                callback(retCode.GUILD_NOT_EXIST);
            }
        });
    }
};

/**
 * 保存公会对象
 * @param zid [int] 区ID
 * @param object [object] guild对象
 * @param changeLock [bool] 是否上锁
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var updateGuildInfo = function(zid, object, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(object.gid)[0];
    var key = redisClient.joinKey(redisKey.keyHashGuildInfoByPreZid, preZid);
    var lockKey = redisClient.joinLockKey(key);
    var value = JSON.stringify(object);

    redisDB.HSET(key, object.gid, value, function(err) {
        if(changeLock) redisDB.DEL(lockKey);
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null);
    });
};

/**
 * 解锁公会对象
 * @param zid [int] 区Id
 * @param zgid [int] 公会Id
 */
var openLockGuildInfo = function(zid, zgid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(zgid)[0];
    var key = redisClient.joinKey(redisKey.keyHashGuildInfoByPreZid, preZid);
    var lockKey = redisClient.joinLockKey(key);

    redisDB.DEL(lockKey);
};

/**
 *
 * 获取公会信息列表
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数arr（公会信息数组中保存GuildInfo对象）
 * @returns []
 */
var getGuildInfoArr = function(zid, callback) {
    async.waterfall([
        function(cb) {
            accountDb.getAllZoneInfo(cb);
        },

        function(zoneInfos, cb) {
            var redisDB = dbManager.getZoneRedisClient().getDB(zid);
            var client = redisDB.MULTI();
            var len = zoneInfos.length;
            for(var i = 0; i < len; ++i) {
                if(zoneInfos[i].areaId == zid) {
                    var key = redisClient.joinKey(redisKey.keyHashGuildInfoByPreZid, zoneInfos[i].zid);
                    client.HVALS(key);
                }
            }

            client.EXEC(function(err, array) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }

                var ret = [];
                var len = array.length;
                for(var i = 0; i < len; ++i) {
                    for(var j = 0; j < array[i].length; ++j) {
                        ret.push(JSON.parse( array[i][j]));
                    }
                }
                cb(null, ret);
            });
        }
    ], callback);
};

/**
 * 搜索公会对象
 * @param zid [int] 区ID
 * @param name [string] guild名称
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数guildInfo对象
 */
var getGuildInfoByName = function(zid, name, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    async.waterfall([
        function(cb) {
            accountDb.getAllZoneInfo(cb);
        },

        function(zoneInfos, cb) {
            var len = zoneInfos.length;
            var client = redisDB.MULTI();
            for(var i = 0; i < len; ++i) {
                if(zoneInfos[i].areaId == zid) {
                    var key = redisClient.joinKey(redisKey.keyStringGidByPreZidName, zoneInfos[i].zid + '#' + name);
                    client.GET(key);
                }
            }

            client.EXEC(function(err, zgidArr) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }

                var ret = [];
                var len = zgidArr.length;
                for(var i = 0; i < len; ++i) {
                    if(zgidArr[i]) {
                        ret.push(zgidArr[i]);
                    }
                }
                cb(null, ret);
            });
        },

        /* 获取GuildInfo对象数组 */
        function(zgids, cb) {
            var len = zgids.length;
            var client = redisDB.MULTI();
            for(var i = 0; i < len; ++i) {
                if(null == zgids[i]) {
                    continue;
                }
                var preZid = cZuid.zuidSplit(zgids[i])[0];
                var key1 = redisClient.joinKey(redisKey.keyHashGuildInfoByPreZid, preZid);
                client.HGET(key1, zgids[i]);
            }
            client.EXEC(function(err, guildsInfo) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }

                var len = guildsInfo.length;
                for(var i = 0; i < len; ++i) {
                    guildsInfo[i] = JSON.parse(guildsInfo[i]);
                }
                cb(null, guildsInfo);
            });
        }
    ], callback);
};

/**
 * 搜索一个区的公会对象
 * @param preZid [int] 原区ID
 * @param name [string] guild名称
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数guildInfo对象
 */
var getAGuildInfoByName = function(preZid, name, callback) {
    var redisDB;
    async.waterfall([
        function(cb) {
            accountDb.getZoneInfo(preZid, function(err, result) {
                if(err) {
                    cb(err);
                }
                else {
                    redisDB = dbManager.getZoneRedisClient().getDB(result.areaId);
                    cb(null);
                }
            });
        },

        function(cb) {
            var key = redisClient.joinKey(redisKey.keyStringGidByPreZidName, preZid + '#' + name);
            redisDB.GET(key, function(err, zgidArr) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                if(null == zgidArr){
                    cb(retCode.GUILD_NOT_EXIST);
                }
                else{
                    cb(null, zgidArr);
                }
            });
        },

        /* 获取GuildInfo对象数组 */
        function(zgids, cb) {
            var key1 = redisClient.joinKey(redisKey.keyHashGuildInfoByPreZid, preZid);
            redisDB.HGET(key1, zgids, function(err, guildsInfo) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                if(null == guildsInfo){
                    cb(retCode.GUILD_NOT_EXIST);
                }
                else{
                    cb(null, JSON.parse(guildsInfo));
                }
            });
        }
    ], callback);
};

/**
 * 保存申请公会对象列表
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param arr [Array] 公会ID数组
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var updateApplyGidArr = function(zid, zuid, arr, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(zuid)[0];
    var key = redisClient.joinKey(redisKey.keyHashGidArrByZid, preZid);
    var value = JSON.stringify(arr);

    redisDB.HSET(key, zuid, value, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null);
    });
};

/**
 * 获取申请公会对象列表
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数公会ID数组
 */
var getApplyGidArr = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(zuid)[0];
    var key = redisClient.joinKey(redisKey.keyHashGidArrByZid, preZid);

    redisDB.HGET(key, zuid, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        if(null == result) {
            callback(null, []);
            return;
        }
        callback(null, JSON.parse(result));
    });
};

/**
 * 保存公会动态信息
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param obj [GuildDynamicInfo] 公会动态信息
 */
var insertGuildDynamicInfo = function(zid, zgid, obj) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListGuildDynamicByZgid, zgid);
    var value = JSON.stringify(obj);

    redisDB.LPUSH(key, value);
};

/**
 * 删除公会动态信息
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 */
var delGuildDynamicInfo = function(zid, zgid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListGuildDynamicByZgid, zgid);
    /* 保留最新的49条公会动态,稍后又会添加一条 */
    redisDB.LTRIM(key, 0, 48);
};

/**
 * 获取公会动态信息列表
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数[GuildDynamicInfo] 动态信息列表
 */
var getGuildDynamicInfo = function(zid, zgid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListGuildDynamicByZgid, zgid);

    redisDB.LRANGE(key, 0, 49, function(err, arr) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, arr);
    });
};

/**
 * 获取公会动态信息列表长度
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数len 动态信息列表长度
 */
var getGuildDynamicInfoLen = function(zid, zgid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListGuildDynamicByZgid, zgid);

    redisDB.LLEN(key, function(err, len) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, len);
    });
};

/**
 * 获取公会排行
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数result为公会ID
 */
var getGuildRankList = function(zid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetGuildByZid, zid);

    redisDB.ZRANGE(key, 0, 19, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, result);
    });
};

/**
 * 更新公会排行
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param lv [int] 公会等级
 * @param lvTime [int] 公会升级的utc时间
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
var updateGuildRankList = function(zid, zgid, lv, lvTime, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
   // var preZid = zgid.split(':')[0];
   // var preKey = redisClient.joinKey(redisKey.keySortedSetGuildByPreZid, preZid);
    var key = redisClient.joinKey(redisKey.keySortedSetGuildByZid, zid);
    var score = (1000 - lv) * Math.pow(10, 10) + lvTime;/*由宗门等级排序，相同等级将优先排时间较早到达该等级的宗门*/

    redisDB.ZADD(key, score, zgid, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null);
    });
};

/**
 * 获取公会的名次
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数名次[int]
 */
var getGuildRankListIndex = function(zid, zgid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedSetGuildByZid, zid);

    redisDB.ZRANK(key, zgid, function(err, index) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        if(index != null) {
            callback(null, index+1);
            return;
        }
        callback(null, -1);
    });
};


/**
 * 获取奖励领取状态信息
 * @param zid [int] 区ID
 * @param zgid [int] 公会ID
 * @param zuid [int] 用户ID
 * @param guildLevel [int] 用户ID
 * @param rewardType [int] 奖励进度类型
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数 已领取的进度奖励[null 或者 int]
 */
var getRewardBefore = function(zid, zgid, zuid, guildLevel, rewardType, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashGuildRewardByZgidZuid, zgid, zuid);
    var field = guildLevel + '_' + rewardType;

    redisDB.HSETNX(key, field, rewardType, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, parseInt(data));
    });
};
exports.getRewardBefore = getRewardBefore;

/**
 * 获取所有奖励的领取状态信息
 * @param zid [int] 区ID
 *  @param zgid [int] 公会ID
 * @param zuid [int] 用户ID
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数已领取的进度奖励数组
 */
var getRewardInfo = function(zid, zgid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashGuildRewardByZgidZuid, zgid, zuid);

    redisDB.HVALS(key, function(err, arr) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var len = arr.length;
       for(var i = 0; i < len; ++i) {
           arr[i] = parseInt(arr[i]);
       }
       cb(null, arr);
    });
};

/**
 * 清空所有奖励的领取状态信息
 * @param zid [int] 区ID
 *  @param zgid [int] 公会ID
 * @param zuid [int] 用户ID
 */
var clearRewardInfo = function(zid, zgid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashGuildRewardByZgidZuid, zgid, zuid);

    redisDB.DEL(key);
};

/**
 * 如果是玩家自己退出公会，获取当时的时间戳
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 回调函数，返回玩家当时操作的时间戳
 */
var getRemoveTime = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringRemoveTimeByZuid, zuid);

    redisDB.GET(key, function(err, time) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(null == time) {
            time = 0;
        }
        cb(null, parseInt(time));
    });
};

/**
 * 如果是玩家自己退出公会，记录本次操作时间戳
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳
 */
var saveRemoveTime = function(zid, zuid, time) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringRemoveTimeByZuid, zuid);

    redisDB.SET(key, time)
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 创建公会对象
 * @param guildInfo [object] guild对象
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.createGuildInfo = createGuildInfo;

/**
 * 删除公会对象
 * @param zid [int] 区id
 * @param gid [int] 公会id
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.deleteGuildInfo = deleteGuildInfo;

/**
 * 获取公会对象
 * @param zid [int] 区ID
 * @param gid [int] guildId
 * @param changeLock [bool] 是否上锁
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数guildInfo对象
 */
exports.getGuildInfoByGid = getGuildInfoByGid;

/**
 * 保存公会对象
 * @param zid [int] 区ID
 * @param object [object] guild对象
 * @param changeLock [bool] 是否上锁
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.updateGuildInfo = updateGuildInfo;

/**
 * 解锁公会对象
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 */
exports.openLockGuildInfo = openLockGuildInfo;

/**
 * 获取公会信息列表
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数arr（公会信息数组中保存GuildInfo对象）
 * @returns []
 */
exports.getGuildInfoArr = getGuildInfoArr;

/**
 * 搜索公会对象
 * @param zid [int] 区ID
 * @param name [string] guild名称
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数guildInfo对象
 */
exports.getGuildInfoByName = getGuildInfoByName;

/**
 * 搜索一个区的公会对象
 * @param zid [int] 原区ID
 * @param name [string] guild名称
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数guildInfo对象
 */
exports.getAGuildInfoByName = getAGuildInfoByName;

/**
 * 保存申请公会对象列表
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param arr [Array] 公会ID数组
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.updateApplyGidArr = updateApplyGidArr;

/**
 * 获取申请公会对象列表
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数公会ID数组
 */
exports.getApplyGidArr = getApplyGidArr;

/**
 * 保存公会动态信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param obj [GuildDynamicInfo] 公会动态信息
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.insertGuildDynamicInfo = insertGuildDynamicInfo;

/**
 * 删除公会动态信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.delGuildDynamicInfo = delGuildDynamicInfo;

/**
 * 获取公会动态信息
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数[GuildDynamicInfo] 动态信息列表
 */
exports.getGuildDynamicInfo = getGuildDynamicInfo;

/**
 * 获取公会动态信息列表长度
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数len 动态信息列表长度
 */
exports.getGuildDynamicInfoLen = getGuildDynamicInfoLen;

/**
 * 获取公会排行
 * @param zid [int] 区ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数result为公会ID
 */
exports.getGuildRankList = getGuildRankList;

/**
 * 更新公会排行
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param lv [int] 公会等级
 * @param lvTime [int] 公会升级的utc时间
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码）
 */
exports.updateGuildRankList = updateGuildRankList;

/**
 * 获取公会的名次
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param callback [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数名次[int]
 */
exports.getGuildRankListIndex = getGuildRankListIndex;

/**
 * 获取所有奖励的领取状态信息
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数已领取的进度奖励数组
 */
exports.getRewardInfo = getRewardInfo;

/**
 * 如果是玩家自己退出公会，记录本次操作时间戳
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 时间戳
 * @param cb [func] 回调函数，返回是否保存成功
 */
exports.saveRemoveTime = saveRemoveTime;

/**
 * 如果是玩家自己退出公会，获取当时的时间戳
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 回调函数，返回玩家当时操作的时间戳
 */
exports.getRemoveTime = getRemoveTime;

/**
 * 清空所有奖励的领取状态信息
 * @param zid [int] 区ID
 *  @param gid [int] 公会ID
 * @param zuid [int] 用户ID
 * @param cb [func] 回调函数，第一个参数err（成功返回null，失败返回错误码），第二个参数已领取的进度奖励数组
 */
exports.clearRewardInfo = clearRewardInfo;