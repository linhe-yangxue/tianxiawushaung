/**
 * 包含的头文件
 */
var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();
const RECORD_LENGTH = 200; /* 聊天记录长度 */
const MAX_RCDS_ONCE = 50; /* 每次获取记录的最大数量 */

/**
 * 获取聊天记录通用接口
 * @param redisDB [object] 数据库连接对象
 * @param keyRcd [string] 聊天记录的redis key
 * @param keyTail [string] 聊天记录的结尾序号的redis key
 * @param head [int] 请求的聊天纪录序号
 * @param callback [func] 返回错误码[int]、聊天记录数组[array]、下次请求序号[int]
 */
function getChatRecord(redisDB, keyRcd, keyTail, head, callback) {
    if(head <= 0 || head > RECORD_LENGTH) {
        callback(retCode.CHAT_REQ_OUT_RANGE);
        return;
    }

    var len = 0;
    var tail = 1;
    async.waterfall([
        /* 获取聊天记录总长度 */
        function(wcb) {
            redisDB.HLEN(keyRcd, function(err, result) {
                if(err) {
                    wcb(retCode.DB_ERR);
                }
                else {
                    len = result;
                    wcb(null);
                }
            });
        },

        /* 获取最后记录的序号 */
        function(wcb) {
            redisDB.GET(keyTail, function(err, result) {
                if(err) {
                    wcb(retCode.DB_ERR);
                }
                else {
                    if(result) {
                        tail = parseInt(result);
                    }
                    wcb(null);
                }
            });
        },

        function(wcb) {
            var idx = []; /* 获取的聊天记录序号列表 */
            var step = 0; /* 获取的聊天记录长度 */

            if(tail <= len) { /* 聊天记录已达上限 */
                step = tail - head;
                if(step < 0) {
                    step += RECORD_LENGTH;
                }
            }
            else { /* 聊天记录未到上限 */
                if (head > tail) {
                    head = tail;
                }
                step = tail - head;
            }

            if(step > MAX_RCDS_ONCE) {
                step = MAX_RCDS_ONCE;
            }

            for (var i = tail - step; i < tail; ++i) {
                if (i > 0) {
                    idx.push(i);
                }
                else {
                    idx.push(i + RECORD_LENGTH);
                }
            }

            if(idx.length == 0) {
                wcb(null, []);
            }
            else {
                redisDB.HMGET(keyRcd, idx, function(err, result) {
                    if(err) {
                        wcb(retCode.DB_ERR);
                    }
                    else {
                        for(var i = 0; i < result.length; ++i) {
                            result[i] = JSON.parse(result[i]);
                        }
                        wcb(null, result);
                    }
                });
            }
        }
    ], function(err, result) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, result, tail);
        }
    });
}

/**
 * 添加聊天记录通用接口
 * @param redisDB [object] 数据库连接对象
 * @param keyRcd [string] 聊天记录的redis key
 * @param keyTail [string] 聊天记录的结尾序号的redis key
 * @param chatRecord [object] 聊天记录对象
 * @param callback [func] 返回错误码[int]
 */
function addChatRecord(redisDB, keyRcd, keyTail, chatRecord, callback) {
    var tail = 1;
    async.waterfall([
        /* 获取最后记录的序号 */
        function(wcb) {
            redisDB.GET(keyTail, function(err, result) {
                if(err) {
                    wcb(retCode.DB_ERR);
                }
                else {
                    if(result) {
                        tail = result;
                    }
                    wcb(null);
                }
            });
        },

        function(wcb) {
            var client = redisDB.MULTI();
            client.HSET(keyRcd, tail, JSON.stringify(chatRecord));
            ++tail;
            if (tail > RECORD_LENGTH) {
                tail = 1;
            }
            client.SET(keyTail, tail);
            client.EXEC();
            wcb(null);
        }
    ],callback);
}

/**
 * 获取私聊记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param head [int] 请求的聊天纪录序号
 * @param callback [func] 返回错误码[int]、聊天记录数组[array]、下次请求序号[int]
 */
var getPrivateChatRecord = function(zid, zuid, head, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyRcd = redisClient.joinKey(redisKey.keyHashPrivateChatRcdByZuid, zuid);
    var keyTail = redisClient.joinKey(redisKey.keyStringPrivateChatTailByZuid, zuid);

    getChatRecord(redisDB, keyRcd, keyTail, head, function(err, arrRcd, nr) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, arrRcd, nr);
        }
    });
};

/**
 * 获取公会聊天记录
 * @param zid [int] 区Id
 * @param guildId [int] 公会Id
 * @param head [int] 请求的聊天纪录序号
 * @param callback [func] 返回错误码[int]、聊天记录数组[array]、下次请求序号[int]
 */
var getGuildChatRecord = function (zid, guildId, head, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyRcd = redisClient.joinKey(redisKey.keyHashGuildChatRcdByZgid, guildId);
    var keyTail = redisClient.joinKey(redisKey.keyStringGuildChatTailByZgid, guildId);

    getChatRecord(redisDB, keyRcd, keyTail, head, function(err, arrRcd, nr) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, arrRcd, nr);
        }
    });
};

/**
 * 获取世界聊天记录
 * @param zid [int] 区Id
 * @param head [int] 请求的聊天纪录序号
 * @param callback [func] 返回错误码[int]、聊天记录数组[array]、下次请求序号[int]
 */
var getWorldChatRecord = function (zid, head, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyRcd = redisClient.joinKey(redisKey.keyHashWorldChatRcdByZid, zid);
    var keyTail = redisClient.joinKey(redisKey.keyStringWorldChatTailByZid, zid);

    getChatRecord(redisDB, keyRcd, keyTail, head, function(err, arrRcd, nr) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, arrRcd, nr);
        }
    });
};

/**
 * 添加私聊记录
 * @param zid [int] 区Id
 * @param zuid [int]角色Id
 * @param chatRecord [object] 聊天记录对象
 * @param callback [func] 返回错误码[int]
 */
var addPrivateChatRecord = function(zid, zuid, chatRecord, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyRcd = redisClient.joinKey(redisKey.keyHashPrivateChatRcdByZuid, zuid);
    var keyTail = redisClient.joinKey(redisKey.keyStringPrivateChatTailByZuid, zuid);

    addChatRecord(redisDB, keyRcd, keyTail, chatRecord, callback);
};

/**
 * 添加公会聊天记录
 * @param zid [int] 区Id
 * @param guildId 公会 Id
 * @param chatRecord [object] 聊天记录对象
 * @param callback [func] 返回错误码[int]
 */
var addGuildChatRecord = function(zid, guildId, chatRecord, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyRcd = redisClient.joinKey(redisKey.keyHashGuildChatRcdByZgid, guildId);
    var keyTail = redisClient.joinKey(redisKey.keyStringGuildChatTailByZgid, guildId);

    addChatRecord(redisDB, keyRcd, keyTail, chatRecord, callback);
};

/**
 * 添加世界聊天记录
 * @param zid [int] 区Id
 * @param chatRecord [object] 聊天记录对象
 * @param callback [func] 返回错误码[int]
 */
var addWorldChatRecord = function(zid, chatRecord, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyRcd = redisClient.joinKey(redisKey.keyHashWorldChatRcdByZid, zid);
    var keyTail = redisClient.joinKey(redisKey.keyStringWorldChatTailByZid, zid);

    addChatRecord(redisDB, keyRcd, keyTail, chatRecord, callback);
};

/**
 * 获取聊天记录尾标
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param guildId [int] 公会Id
 * @param callback [func] 返回错误码[int]和尾标数组[array]
 */
var getChatTails = function(zid, zuid, guildId, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var client = redisDB.MULTI();

    var keyWorldTail = redisClient.joinKey(redisKey.keyStringWorldChatTailByZid, zid);
    client.GET(keyWorldTail);
    var keyGuildTail = redisClient.joinKey(redisKey.keyStringGuildChatTailByZgid, guildId);
    client.GET(keyGuildTail);
    var keyPrivateTail = redisClient.joinKey(redisKey.keyStringPrivateChatTailByZuid, zuid);
    client.GET(keyPrivateTail);

    client.EXEC(function(err, result) {
        if (err) {
            callback(err);
        }
        else {
            for(var i = 0; i < result.length; ++i) {
                result[i] = result[i]? parseInt(result[i]) : 1;
            }
            callback(null, result);
        }
    });
};

/**
 * 世界聊天次数+1
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
var incrWorldChatCnt = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var date = (new Date()).toDateString();
    var key = redisClient.joinKey(redisKey.keyStringWorldChatCntByZuidDate, zuid, date);
    redisDB.INCR(key);
    redisDB.EXPIRE(key, 24*3600);
};

/**
 * 获取世界聊天次数
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码和聊天次数
 */
var getWorldChatCnt = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var date = (new Date()).toDateString();
    var key = redisClient.joinKey(redisKey.keyStringWorldChatCntByZuidDate, zuid, date);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            if(null == result) {
                result = 0;
                redisDB.SETEX(key, 24 * 3600,  0);
            }
            callback(null, result);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取私聊记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param head [int] 请求的聊天纪录序号
 * @param callback [func] 返回错误码[int]、聊天记录数组[array]、下次请求序号[int]
 */
exports.getPrivateChatRecord = getPrivateChatRecord;

/**
 * 获取公会聊天记录
 * @param zid [int] 区Id
 * @param guildId [int] 公会Id
 * @param head [int] 请求的聊天纪录序号
 * @param callback [func] 返回错误码[int]、聊天记录数组[array]、下次请求序号[int]
 */
exports.getGuildChatRecord = getGuildChatRecord;

/**
 * 获取世界聊天记录
 * @param zid [int] 区Id
 * @param head [int] 请求的聊天纪录序号
 * @param callback [func] 返回错误码[int]、聊天记录数组[array]、下次请求序号[int]
 */
exports.getWorldChatRecord = getWorldChatRecord;

/**
 * 添加私聊记录
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param chatRecord [object] 聊天记录对象
 * @param callback [func] 返回错误码[int]
 */
exports.addPrivateChatRecord = addPrivateChatRecord;

/**
 * 添加公会聊天记录
 * @param zid [int] 区Id
 * @param guildId [int] 公会 Id
 * @param chatRecord [object] 聊天记录对象
 * @param callback [func] 返回错误码[int]
 */
exports.addGuildChatRecord = addGuildChatRecord;

/**
 * 添加世界聊天记录
 * @param zid [int] 区Id
 * @param chatRecord [object] 聊天记录对象
 * @param callback [func] 返回错误码[int]
 */
exports.addWorldChatRecord = addWorldChatRecord;

/**
 * 获取聊天记录尾标
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param guildId [int] 公会Id
 * @param callback [func] 返回错误码[int]和尾标数组[array]
 */
exports.getChatTails = getChatTails;

/**
 * 世界聊天次数+1
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
exports.incrWorldChatCnt = incrWorldChatCnt;

/**
 * 获取世界聊天次数
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码和聊天次数
 */
exports.getWorldChatCnt = getWorldChatCnt;


