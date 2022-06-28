/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：账号相关功能：注册、登陆、获取登陆历史、游戏服登陆
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：floven [审阅完成]
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
var cZuid = require('../common/zuid');
var dbManager = require("../../manager/redis_manager").Instance();

/**
 * 获取用户总数
 * @param callback {function} 返回错误码和用户总数
 */
function getUidCnt(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyStringUidSerial;

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, parseInt(result));
        }
    });
}
exports.getUidCnt = getUidCnt;

/**
 *  用渠道和账号获取账号对象
 * @param channel [string] 渠道
 * @param acc [string] 账号
 * @param callback [func] 返回错误码[int](retCode)
 */
function getUserAccountByChannelAcc(channel, acc, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashUidByChannelAcc);
    var field = redisClient.joinKey(channel, acc);

    async.waterfall([
        /*  获取uid  */
        function(cb) {
            redisDB.HGET(key, field, function (err, uid) {
                if(err) {
                    cb(retCode.DB_ERR);
                }
                else if(!uid) {
                    cb(retCode.ACCOUNT_NOT_EXIST);
                }
                else {
                    cb(null, uid);
                }
            });
        },

        /* 获取账号对象 */
        function(uid, cb) {
            var key2 = redisClient.joinKey(redisKey.keyStringUserAccountByUid, uid);
            redisDB.GET(key2, cb);
        }
    ], function(err, userAccount) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, JSON.parse(userAccount));
        }
    });
}
exports.getUserAccountByChannelAcc = getUserAccountByChannelAcc;
/**-------------------------------------------------------------------------------------------------------------------*/


/**
 * 注册账号(保存userAccount对象)
 * @param userAccount [obj] 账号对象
 * @param callback [func] 返回错误码[int]  (retCode)
 */
function registerAccount(userAccount , callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashUidByChannelAcc);
    var field = redisClient.joinKey(userAccount.channel, userAccount.acc);

    async.waterfall([
        /*  检查账号是否存在  */
        function(cb) {
            redisDB.HEXISTS(key, field, function (err, isExists) {
                if(err) {
                    cb(retCode.DB_ERR);
                }
                else if(isExists) {
                    cb(retCode.ACCOUNT_EXIST);
                }
                else {
                   cb(null);
                }
            });
        },

        /* 获取新的用户Id */
        function(cb) {
            redisDB.INCR(redisKey.keyStringUidSerial, function(err, uid) {
                if(err) {
                    cb(retCode.DB_ERR);
                }
                else {
                    cb(null, uid)
                }
            })
        },

        /*  保存账号 */
        function(uid, cb) {
            userAccount.uid = uid;

            redisDB.HSETNX(key, field, uid, function(err, success) {
                if(err) {
                    cb(retCode.DB_ERR);
                }
                else if (!success) {
                    cb(retCode.ACCOUNT_EXIST);
                }
                else {
                    var key2 = redisClient.joinKey(redisKey.keyStringUserAccountByUid, uid);
                    var value2 = JSON.stringify(userAccount);
                    redisDB.SET(key2, value2);
                    cb(null);
                }
            })
        }

    ], function(err) {
        callback(err, userAccount.uid);
    });
}
exports.registerAccount = registerAccount;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定用户Id和登陆Token
 * @param loginToken [string] 登陆token
 * @param uid [int] 用户Id
 * @param seconds [int] 登陆token有效时间
 */
function bindUidWithLoginToken(loginToken, uid,  seconds) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyStringUidByLoginToken, loginToken);

    redisDB.SETEX(key, seconds, uid);
}
exports.bindUidWithLoginToken = bindUidWithLoginToken;

/**
 * 根据登陆token获取用户Id
 * @param loginToken [string] 登陆token
 * @param callback 返回错误码[int](retCode)和用户Id[int]
 */
function getUidByLoginToken( loginToken, callback ) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyStringUidByLoginToken, loginToken);

    redisDB.GET(key,function(err, uid) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if (!uid) {
            callback(retCode.LOGIN_TIMEOUT);
        }
        else {
            callback(null, uid);
        }
    });
}
exports.getUidByLoginToken = getUidByLoginToken;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定注册Token和账号对象
 * @param userAccount [object] 账号对象
 * @param callback 返回错误码[int] (retCode)
 */
function bindUserAccountWithRegToken(userAccount, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyStringUserAccountByRegToken, userAccount.regtoken);
    var value = JSON.stringify(userAccount);

    redisDB.SETNX(key, value, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
}
exports.bindUserAccountWithRegToken = bindUserAccountWithRegToken;

/**
 * 用注册Token获取账号对象
 * @param regToken [string] 注册Token
 * @param callback 返回错误码[int] (retCode)和账号对象
 */
function getUserAccountByRegToken( regToken, callback ) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyStringUserAccountByRegToken, regToken);

    redisDB.GET(key,function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(!data) {
            callback(retCode.REGTOKEN_NOT_EXIST);
        }
        else {
            callback(null, JSON.parse(data));
        }
    });
}
exports.getUserAccountByRegToken = getUserAccountByRegToken;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 增加登陆历史
 * @param uid [int] 用户Id
 * @param userLoginInfo [obj] 登陆历史对象
 */
function addLoginInfo(uid, userLoginInfo) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashUserLoginInfoByUid, uid);

    redisDB.HSET(key, userLoginInfo.zid, JSON.stringify(userLoginInfo));
}
exports.addLoginInfo = addLoginInfo;

/**
 * 获取登陆历史
 * @param uid [int] 用户Id
 * @param callback [func] 返回错误码[int](retCode) 和登陆历史列表
 */
function getLoginHistoryList(uid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashUserLoginInfoByUid, uid);

    redisDB.HVALS(key, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            var result = [];
            for(var i = 0; i< data.length; i++){
                result.push(JSON.parse(data[i]));
            }
            callback(null, result);
        }
    });
}
exports.getLoginHistoryList = getLoginHistoryList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 设置game token
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param gtk [string] game token
 * @param liveTime [int] 生存时间 (秒)
 * @param mac [string] mac地址
 * @param callback [func] 返回错误码[int]
 */
function setGameToken(zid, zuid, gtk, liveTime, mac, callback) {
    var preZid = cZuid.zuidSplit(zuid)[0];
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key1 = redisClient.joinKey(redisKey.keyHashGameTokenByZid, preZid);
    var outTime = liveTime * 1000 + Date.now();
    var value1 = gtk + '#' + outTime;
   // var key2 = redisClient.joinKey(redisKey.keyHashMacByZid, preZid);

    var client = redisDB.MULTI();
    client.HSET(key1, zuid, value1);
    //client.HSET(key2, zuid, mac);
    client.EXEC(function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
}
exports.setGameToken = setGameToken;

/**
 * 检查游戏token
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param gtk [string] 游戏token
 * @param mac [string] mac地址
 * @param callback [func] 返回错误码[int](retCode)
 */
function checkGameToken( zid, zuid, gtk, mac, callback ) {
    var preZid = cZuid.zuidSplit(zuid)[0];
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key1 = redisClient.joinKey(redisKey.keyHashGameTokenByZid, preZid);
    //var key2 = redisClient.joinKey(redisKey.keyHashMacByZid, preZid);

    var client = redisDB.MULTI();
    client.HGET(key1, zuid);
    //client.HGET(key2, zuid);
    client.EXEC(function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }

        //if(result[1] != mac) {
        //    callback(retCode.ACCOUNT_LOGINED_BY_ANOTHER);
        //    return;
        //}

        var data = result[0];
        if(data && data.split('#')[0] == gtk && parseInt(data.split('#')[1]) > Date.now()) {
            callback(null);
            return;
        }

        callback(retCode.GTOKEN_TIME_OUT);
    });
}
exports.checkGameToken = checkGameToken;

/**
 * 删除指定区所有game token
 * @param preZid [int] 原区Id
 * @param callback [func] 返回错误码[int]
 */
function delAllGameTokenInZone(preZid, callback) {
    async.waterfall([
        /* 获取区信息 */
        function(cb) {
            getZoneInfo(preZid, cb);
        },

        /* 删除全部token */
        function(zoneInfo, cb) {
            var redisDB = dbManager.getZoneRedisClient().getDB(zoneInfo.areaId);
            var key = redisClient.joinKey(redisKey.keyHashGameTokenByZid, preZid);
            redisDB.DEL(key);
            cb(null);
        }
    ], callback);
}
exports.delAllGameTokenInZone = delAllGameTokenInZone;

/**
 * 删除指定区指定game token
 * @param preZid [int] 原区Id
 * @param zuid [int] 角色Id
 */
function delGameTokenInZone(preZid, zuid) {
    async.waterfall([
        /* 获取区信息 */
        function(cb) {
            getZoneInfo(preZid, cb);
        },

        /* 删除token */
        function(zoneInfo, cb) {
            var redisDB = dbManager.getZoneRedisClient().getDB(zoneInfo.areaId);
            var key = redisClient.joinKey(redisKey.keyHashGameTokenByZid, preZid);
            redisDB.HDEL(key, zuid);
            cb(null);
        }
    ]);
}
exports.delGameTokenInZone = delGameTokenInZone;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取封号信息
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [obj] 返回错误码和SealAccountInfo对象
 */
function getSealAccountInfo(zid, zuid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashSealAccountByZid, zid);

    redisDB.HGET(key, zuid, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, JSON.parse(data));
        }
    });
}
exports.getSealAccountInfo = getSealAccountInfo;

/**
 * 添加封号
 * @param zid [int] 区Id
 * @param mapSealAccountInfo [map<uid, sealAccountObj>] 封号对象
 */
function addSealAccountInfo(zid, mapSealAccountInfo) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashSealAccountByZid, zid);

    var client = redisDB.MULTI();
    for(var zuid in mapSealAccountInfo) {
        client.HSET(key, zuid, JSON.stringify(mapSealAccountInfo[zuid]));
    }
    client.EXEC();
}
exports.addSealAccountInfo = addSealAccountInfo;

/**
 * 删除封号
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
function delSealAccountInfo(zid, zuid) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyHashSealAccountByZid, zid);

    redisDB.HDEL(key, zuid);
}
exports.delSealAccountInfo = delSealAccountInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 增加区人数
 * @param zid [int] 区Id
 */
function addZoneMemCnt(zid) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneMemCnt;
    var key2 = redisKey.keyHashZoneInfo;

    async.waterfall([
        function(cb) {
            redisDB.HINCRBY(key, zid, 1, cb);
        },
        function(memCnt, cb) {
            redisDB.HGET(key2, zid, function(err, data) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                var zoneInfo = data;
                if(!zoneInfo) {
                    cb(retCode.ZONE_NOT_EXIST);
                    return;
                }
                zoneInfo = JSON.parse(zoneInfo);
                zoneInfo.playerCnt = memCnt;
                redisDB.HSET(key2, zid, JSON.stringify(zoneInfo));
                cb(null);
            });
        }
    ]);
}
exports.addZoneMemCnt = addZoneMemCnt;

/**
 * 删除区人数
 * @param zid [int] 区Id
 */
function delZoneMemCnt(zid){
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneMemCnt;
    redisDB.HDEL(key, zid);
}
exports.delZoneMemCnt = delZoneMemCnt;

/**
 * 获取区信息
 * @param zid [int] 区Id
 * @param callback [func] 返回错误码[int]和区信息[object](ZoneInfo)
 */
function getZoneInfo(zid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneInfo;

    redisDB.HGET(key, zid, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(retCode.ZONE_NOT_EXIST);
        }
    });
}
exports.getZoneInfo = getZoneInfo;

/**
 * 设置区信息
 * @param zoneInfo [object] 区信息
 * @param callback [func] 返回错误码[int]
 */
function setZoneInfo(zoneInfo, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneInfo;

    redisDB.HSET(key, zoneInfo.zid, JSON.stringify(zoneInfo), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null);
    });
}
exports.setZoneInfo = setZoneInfo;

/**
 * 获取所有的区Id
 * @param callback [func] 返回错误码和区Id数组
 */
function getAllZoneId(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneInfo;

    redisDB.HKEYS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
}
exports.getAllZoneId = getAllZoneId;

/**
 * 获取所有的区信息
 * @param callback [func] 返回错误码和区信息数组
 */
function getAllZoneInfo(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneInfo;

    redisDB.HVALS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            var len = result.length;
            for(var i = 0; i < len; ++i) {
                result[i] = JSON.parse(result[i]);
            }
            callback(null, result);
        }
    });
}
exports.getAllZoneInfo = getAllZoneInfo;

/**
 * 分页获取所有的区信息
 * @param page [int] 页数
 * @param cnt [int] 每页现实的区数
 * @param callback [func] 返回错误码和区信息数组
 */
function getPageZoneInfos(page, cnt, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneInfo;
    var key1 = redisKey.keyStringZidSerial;
    var len = 0;
    var start = 0;
    var end = 0;
    var ret = [];

    async.waterfall([
        function(cb) {
            redisDB.GET(key1, function(err, data) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                len = data;
                cb(null);
            });
        },
        function(cb) {
            if(null == len) {
                cb(null);
                return;
            }
            end = (len - page * cnt) > 1 ? (len - page * cnt):1;
            start = (end - cnt + 1) > 1 ? (end - cnt + 1):1;
            var zids = [];
            for(var i = end; i >= start; --i) {
                zids.push(i);
            }
            redisDB.HMGET(key, zids, function(err, result) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                var length = result.length;
                for(var i = 0; i < length; ++i) {
                    if(result[i]) {
                        ret.push(JSON.parse(result[i]));
                    }
                }
                cb(null);
            });
        }
    ], function(err) {
        if(err) {
            callback(err);
            return;
        }
        callback(null, ret);
    });
}
exports.getPageZoneInfos = getPageZoneInfos;

/**
 * 删除区信息
 * @param zid [int] 区Id
 * @param callback [func] 返回错误码[int]
 */
function delZoneInfo(zid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneInfo;

    redisDB.HDEL(key, zid, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(retCode.SUCCESS);
        }
    });
}
exports.delZoneInfo = delZoneInfo;

/**
 * 是否存在该区信息
 * @param zoneInfo [object] 区信息
 * @param callback [func] 返回错误码[int]
 */
function isExistZoneInfo(zoneInfo, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashZoneInfo;

    redisDB.HSETNX(key, zoneInfo.zid, JSON.stringify(zoneInfo), function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, result);
    });
}
exports.isExistZoneInfo = isExistZoneInfo;

/**
 * 获取区自增id
 * @param callback [func] 返回错误码[int], Zid[int]
 */
function getIncrZid(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyStringZidSerial;

    redisDB.INCR(key, function(err, zid) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, zid);
    });
}
exports.getIncrZid = getIncrZid;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 注册状态查询
 * @param callback [func] 返回错误码[int]和注册状态
 */
function getRegisterInfo(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyStringRegisterInfo;

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(null == result){
            callback(null, 1);
        }
        else{
            callback(null, result);
        }
    });
}
exports.getRegisterInfo = getRegisterInfo;

/**
 * 修改注册状态
 * @param state [int]注册状态
 * @param callback [func] 返回错误码[int]
 */
function setRegisterInfo(state, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyStringRegisterInfo;

    redisDB.SET(key, state, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
}
exports.setRegisterInfo = setRegisterInfo;


/**
 * 获取已注册数
 * @param callback [func] 返回错误码[int]和已注册数
 */
function getAllRegisterNum(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashUidByChannelAcc;

    redisDB.HLEN(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
}
exports.getAllRegisterNum = getAllRegisterNum;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 添加区中的渠道
 * @param zid [int] 区Id
 * @param channel [string] 渠道
 */
function addChannelInZone(zid, channel) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keySetChannelsByZid, zid);

    redisDB.SADD(key, channel);
}
exports.addChannelInZone = addChannelInZone;

/**
 * 获取区中的所有渠道
 * @param zid [int]
 * @param callback [func] 返回错误码和渠道数组
 */
function getChannelsInZone(zid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keySetChannelsByZid, zid);

    redisDB.SMEMBERS(key, function(err, result) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, result);
        }
    });
}
exports.getChannelsInZone = getChannelsInZone;

/**
 * 增加区中某渠道的在线人数
 * @param zid [int] 区Id
 * @param channel [string] 渠道
 */
function incrZoneOnlinePlayerCnt(zid, channel) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisClient.joinKey(redisKey.keyStringOnlineNumByZidChannel, zid, channel);

    redisDB.INCR(key);
}
exports.incrZoneOnlinePlayerCnt = incrZoneOnlinePlayerCnt;

/**
 * 获取区中某渠道的在线人数，并重置
 * @param arrZidChannelStr [array] '区Id:渠道'结构的数组
 * @param callback [func] 返回错误码和在线人数
 */
function getResetZoneOnlinePlayerCnt(arrZidChannelStr, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var client = redisDB.MULTI();

    var len = arrZidChannelStr.length;
    for(var i = 0; i < len; i++) {
        var key = redisClient.joinKey(redisKey.keyStringOnlineNumByZidChannel, arrZidChannelStr[i]);
        client.GET(key);
        client.SET(key, 0);
    }
    client.EXEC(function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, result);
        }
    });
}
exports.getResetZoneOnlinePlayerCnt = getResetZoneOnlinePlayerCnt;
