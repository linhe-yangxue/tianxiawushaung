'user strict';
var timeUtil = require('../tools/system/time_util');
var retCode = require('./ret_code');
var logger = require('../manager/log4_manager').LoggerGame;
var async = require('async');
var dbManager = require('../manager/redis_manager').Instance();

const TIMEOUT_SECONDS = 1000;
const TRY_TIMES = 5;
const SLEEP_MILLIONSECONDS = 10;

/**
 *  同步锁,保护共享内存
 * @param redisDB [object] redis connection client
 * @param lockKey [string] key
 */
var redisLock = function(redisDB, lockKey) {
    var lock = function(redisDB, lockKey) {
        this.redisDB = redisDB;
        this.lockKey = lockKey;
        this.timeoutMillionseconds = TIMEOUT_SECONDS; /* 超时时间,单位为毫秒 */
        this.tryTimes = TRY_TIMES; /* 最大尝试次数 */
        this.sleepMillionseconds = SLEEP_MILLIONSECONDS; /* 尝试间隔,单位为毫秒 */
        this.timeStamp = 0;
        this.err = retCode.DB_ERR;
    }
    lock.prototype.lock = function(cb) {
        var self = this;
        //
        var tryLock = function(cb) {
            var now = Date.now();
            /* */
            async.series({
                tryGetLock: function(cb) {
                    var timestamp = now + self.timeoutMillionseconds;
                    var client = self.redisDB.MULTI();
                    client.SETNX(self.lockKey, timestamp);
                    client.GET(self.lockKey);
                    client.EXEC(function(err, data) {
                        if (err) {
                            cb(retCode.DB_ERR);
                            return;
                        }
                        // lock not available
                        if (0 == data[0]) {
                            if(data[1] > now) {
                                cb(retCode.REDIS_LOCK_LOCKED);
                                return;
                            }
                            cb(retCode.REDIS_LOCK_EXPIRED);
                            return;
                        }
                        self.timeStamp = timestamp;
                        cb(null);
                    });
                }
            }, function (err) {
                if(err === retCode.REDIS_LOCK_EXPIRED) {
                    var timestamp = Date.now() + self.timeoutMillionseconds;
                    var client = self.redisDB.MULTI();
                    client.GETSET(self.lockKey, timestamp);
                    client.EXEC(function(err, data) {
                        if (err) {
                            cb(retCode.DB_ERR);
                            return;
                        }
                        var expiredTime = data[0];
                        /* lock not available  */
                        if(expiredTime > now) {
                            cb(retCode.REDIS_LOCK_LOCKED);
                            return;
                        }
                        self.timeStamp = timestamp;
                        cb(null);
                    });
                    return;
                }
                cb(err);
            });
        }
        /*  */
        var hasTryTimes = 1;
        var tryLockCallback = function(err) {
            hasTryTimes ++;
            /* try again if locked  */
            if(err === retCode.REDIS_LOCK_LOCKED) {
                if(hasTryTimes <= self.tryTimes) {
                    setTimeout(function() {
                        tryLock(tryLockCallback);
                    }, self.sleepMillionseconds);
                    return;
                }
                self.err = retCode.REDIS_LOCK_LOCKED;
                cb(retCode.REDIS_LOCK_LOCKED);
                return;
            }
            self.err = err;
            cb(err);
        }
        /*  */
        tryLock(tryLockCallback);
    }

    lock.prototype.unlock = function (cb) {
        var self = this;
        if(null !== self.err) {
            return;
        }
        var unlockByLuaScript = "local lockExpiredTime = redis.call('get', KEYS[1]) " +
            "if(lockExpiredTime <= ARGV[1]) then redis.call('del', KEYS[1]) end ";
        self.redisDB.EVAL(unlockByLuaScript, 1, self.lockKey, self.timeStamp, function(err) {
            if(!!err) {
                logger.error("redis lock error: " + self.lockKey + ", " + err);
            }
            if(cb) {
                cb(err);
            }
        });
    }

    return new lock(redisDB, lockKey);
}

var redisSmartLock = function (zid, lockKey) {
    var smartLock = function (zid, lockKey) {
        var dbConnArrGlobal = dbManager.getGlobalRedisClient();
        var redisDB = dbConnArrGlobal.getDB(zid);
        this.redisLock = redisLock(redisDB, lockKey);
    }

    smartLock.prototype.lock = function (cb) {
        var self = this;
        self.redisLock.lock(cb);
    }

    smartLock.prototype.unlock = function (cb) {
        var self = this;
        self.redisLock.unlock(cb);
    }

    return new smartLock(zid, lockKey);
}

exports.redisLock = redisLock;
exports.redisSmartLock = redisSmartLock;
