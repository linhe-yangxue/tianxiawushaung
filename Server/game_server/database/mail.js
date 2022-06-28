/**
* ---------------------------------------------------------------------------------------------------------------------
* 文件描述：获取整个邮箱里面的所有邮件,删除单个邮件,删除所有邮件,自增邮件ID，保存邮件
* 开发者：许林
* 开发者备注：
* 审阅者：floven [审阅完成]
* 优化建议：
* ---------------------------------------------------------------------------------------------------------------------
*/

/**
 * 包含的头文件
 */
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require('../../manager/redis_manager').Instance();

const MAIL_NUM = 199;

/**
 *获取整个邮件数据
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回邮件数组
 */
var getMails = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortSetMailByZuid, zuid);

    redisDB.ZREVRANGE(key, 0, MAIL_NUM, function(err, mails) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        var len = mails.length;
        for (var i = 0; i< len; ++i) {
            mails[i] = JSON.parse(mails[i]);
        }
        cb(null, mails);
    });
};

/**
 *获取单个邮件数据
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 *  @param mailId [Mail] 要获取的邮件的邮件ID
 * @param cb [func] 返回邮件数组
 */
var getMail = function(zid, zuid, mailId,cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortSetMailByZuid, zuid);

    redisDB.ZRANGEBYSCORE(key, mailId, mailId, function(err, data) {
        if (err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(0 == data.length) {
            cb(null, null);
        }
        else {
            cb(null, JSON.parse(data[0]));
        }
    });
};

/**
 * 删除单个邮件
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param mailId [Mail] 要删除的邮件的邮件ID
 * @param cb [func] 返回错误码或null
 */
var delMail = function(zid, zuid, mailId)
{
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortSetMailByZuid, zuid);

    redisDB.ZREMRANGEBYSCORE(key, mailId, mailId);
};

/**
 * 过期邮件删除
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param mails 过期的邮件数组
 */
var delOverDueMail = function(zid, zuid, mails) {
    if (0 == mails.length) {
        return;
    }
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortSetMailByZuid, zuid);

    var client = redisDB.MULTI();
    var len = mails.length;
    for (var i = 0; i < len; ++i) {
        client.ZREMRANGEBYSCORE(key, mails[i].mailId, mails[i].mailId);
    }
    client.EXEC(function (err) {
    });
};

/**
 *删除所有邮件
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回错误码或null
 */
var delAllMail = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortSetMailByZuid, zuid);

    redisDB.ZREMRANGEBYRANK(key, 0, 199);
};

/**
 *邮件ID自增
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param number [int] 增量
 * @param cb [func] 返回邮件自增ID
 */
var incrMailId = function(zid, zuid, number, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringMailIdByZuid, zuid);

    redisDB.INCRBY(key, number, function(err, id) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, id);
    })
};

/**
 * 插入单封邮件
 * @param zid [int] 区ID
 * @param zuid 用户ID
 * @param mail 需要保存的邮件
 */
var insertMail = function(zid, zuid, mail) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortSetMailByZuid, zuid);

    redisDB.ZADD(key, mail.mailId, JSON.stringify(mail));
};

/**
 * 获取玩家邮箱中的邮件数量
 * @param zid [int] 区ID
 * @param zuid 用户ID
 * @param cb 回调邮件数量
 */
var getMailNumber = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortSetMailByZuid, zuid);

    redisDB.ZCARD(key, function(err, number) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        cb(null, number);
    });
};

/**
 * 插入多封邮件
 * @param zid [int] 区ID
 * @param zuid 用户ID
 * @param mails 需要保存的邮件数组
 */
var insertMails = function(zid, zuid, mails) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortSetMailByZuid, zuid);

    if(0 == mails.length) {
        return;
    }
    var client = redisDB.MULTI();
    var len = mails.length;
    for(var i = 0; i < len; ++i ) {
        client.ZADD(key, mails[i].mailId, JSON.stringify(mails[i]));
    }
    client.EXEC(function() {
    });
};

/**
 * 获取全服邮件
 * @param zid [int] 区ID
 * @param cb [func] 返回获取的全服邮件
 */
var getRewardMail = function(zid,  cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashAllServerMailByZid, zid);

    redisDB.HVALS(key, function(err, mails) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var len = mails.length;
       for(var i = 0; i< len; ++i) {
           mails[i] = JSON.parse(mails[i]);
       }
       cb(null, mails);
    });
};

/**
 * 获取上次领取全服邮件的ID
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回获取的全服邮件
 */
var getAllMailId = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringAllMailIdByZuid, zuid);

    redisDB.GET(key, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(null == data) {
            cb(null, 1);
        }
        else {
            cb(null, parseInt(data));
        }
    });
};

/**
 * 保存下次领取全服邮件的起始ID
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param id [int] 记录下次应获取到的全服邮件id
 */
var saveAllMailId = function(zid, zuid, id) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringAllMailIdByZuid, zuid);

    redisDB.SET(key, id);
};

/**
 * 获取上次领取定制邮件的开始时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回获取的全服邮件
 */
var getLastMailBeginTime = function(zid, zuid, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringMailBeginTimeByZuid, zuid);

    redisDB.GET(key, function(err, data) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        if(null == data) {
            cb(null, 0);
        }
        else {
            cb(null, parseInt(data));
        }
    });
};

/**
 * 保存下次领取定制邮件的开始时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 下次领取定制邮件的开始时间
 */
var saveMailBeginTime = function(zid, zuid, time) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringMailBeginTimeByZuid, zuid);

    redisDB.SET(key, time);
};

/**
 * 获取在可领取时间段内的定制邮件
 * @param zid [int] 区ID
 * @param time [long] 时间戳 上次领取的邮件的开始时间
 * @param cb [func] 返回获取的全服邮件
 */
var getRelevantMails = function(zid,  time, cb) {
    var nowTime = parseInt(Date.now() / 1000);
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keySortedCustomMadeMailByZid, zid);

    redisDB.ZRANGEBYSCORE(key, '( '+ time, nowTime, function(err, mails) {
        if(err) {
            cb(retCode.DB_ERR);
            return;
        }
        var len = mails.length;
        for(var i = 0; i< len; ++i) {
            mails[i] = JSON.parse(mails[i]);
        }
        cb(null, mails);
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *获取整个邮件数据
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回邮件数组
 */
exports.getMails = getMails;

/**
 *获取单个邮件数据
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 *  @param mailId [Mail] 要获取的邮件的邮件ID
 * @param cb [func] 返回邮件数组
 */
exports.getMail = getMail;

/**
 * 删除单个邮件
 * @param zid [int] 区ID
 * @param zuid 用户ID
 * @param array 删除单个邮件后的邮件数组
 * @param changeLock changeLock [bool] 锁
 * @param cb [func] 返回错误码或者邮件数组
 */
exports.delMail = delMail;
/**
 *删除整个邮件
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param changeLock [bool] 锁
 * @param cb [func] 返回错误码或null
 */
exports.delAllMail = delAllMail;
/**
 *邮件ID自增
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回邮件自增ID
 */
exports.incrMailId = incrMailId;
/**
 * 保存邮件
 * @param zid [int] 区ID
 * @param zuid 用户ID
 * @param allMail 需要保存的邮件数组
 * @param cb [func] 返回错误码或null
 */
exports.insertMail = insertMail;
/**
* 过期邮件删除
* @param zid [int] 区ID
* @param zuid 用户ID
* @param mails 过期的邮件数组
* @param cb [func] 返回错误码或者null
*/
exports.delOverDueMail = delOverDueMail;
/**
 * 获取玩家邮箱中的邮件数量
 * @param zid [int] 区ID
 * @param zuid 用户ID
 * @param cb 回调邮件数量
 */
exports.getMailNumber = getMailNumber;
/**
 * 插入多封邮件
 * @param zid [int] 区ID
 * @param zuid 用户ID
 * @param mails 需要保存的邮件数组
 */
exports.insertMails = insertMails;
/**
 * 获取上次领取全服邮件的ID
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回获取的全服邮件
 */
exports.getAllMailId = getAllMailId;
/**
 * 保存下次领取全服邮件的起始ID
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param id [int] 记录下次应获取到的全服邮件id
 */
exports.saveAllMailId = saveAllMailId;
/**
 * 获取全服邮件
 * @param zid [int] 区ID
 * @param cb [func] 返回获取的全服邮件
 */
exports.getRewardMail = getRewardMail;
/**
 * 获取上次领取定制邮件的开始时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param cb [func] 返回获取的全服邮件
 */
exports.getLastMailBeginTime = getLastMailBeginTime;
/**
 * 保存下次领取定制邮件的开始时间
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param time [long] 下次领取全服邮件的开始时间
 */
exports.saveMailBeginTime = saveMailBeginTime;
/**
 * 获取在可领取时间段内的定制邮件
 * @param zid [int] 区ID
 * @param cb [func] 返回获取的全服邮件
 */
exports.getRelevantMails = getRelevantMails;