/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取指定背包，保存指定背包，解锁指定背包，获取所有背包，保存所有背包，解锁所有背包，
 *     获取player对象和所有背包，保存player对象和背包数组，player对象和所有背包解锁，
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：floven [审阅完成]
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var globalObject = require('../../common/global_object');
var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取指定背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param pkgId 背包Id
 * @param changeLock 是否上锁
 * @param callback 返回对应背包。
 */
var getPackage = function(zid, zuid, pkgId, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, pkgId);
    var lockKey = redisClient.joinLockKey(key);
    var client = redisDB.MULTI();

    client.GET(key);
    client.GET(lockKey);
    client.EXEC(function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }

        /* 锁校验 */
        if(changeLock && result[1]) {
            callback(retCode.PACKAGE_LOCKED);
            return
        }

        /* 数据存在性校验 */
        if(result[0]) {
            callback(null, JSON.parse(result[0]));
        }
        else {
            callback(retCode.PACKAGE_NOT_EXIST);
        }

        /* 上锁 */
        if(changeLock) redisDB.SETEX(lockKey, '5', '1');
    });
};

/**
 * 保存指定背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param pkg 背包
 * @param changeLock 是否上锁
 * @param callback 返回操作结果
 */
var savePackage = function(zid, zuid, pkg, changeLock, callback) {
    var pkgId = pkg.pkgId;
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, pkgId);
    var lockKey = redisClient.joinLockKey(key);
    var value = JSON.stringify(pkg);

    redisDB.SET(key, value, function(err, result) {
        /* 解锁 */
        if(changeLock) redisDB.DEL(lockKey);

        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null);
        }
    });
};

/**
 * 解锁指定背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param pkgId 背包Id
 */
var openLockPackage = function(zid, zuid, pkgId) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, pkgId);
    var lockKey = redisClient.joinLockKey(key);

    redisDB.DEL(lockKey);
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取所有背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param changeLock 是否上锁
 * @param callback 返回所有背包 packages[1-7]，[0] == null
 */
var getPackages = function(zid, zuid, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var client = redisDB.MULTI();
    var key = [];
    var lockKey = [];

    for(var i = 1; i <= 7; ++i) {
        key[i] = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, i);
        lockKey[i] = redisClient.joinLockKey(key);
        client.GET(key[i]);
        client.GET(lockKey[i]);
    }

    client.EXEC(function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }

        /* 锁校验 */
        if (changeLock) {
            for(var i = 1; i <= 7; ++i) {
                if (result[i * 2 - 1]) {
                    callback(retCode.PACKAGE_LOCKED);
                    return;
                }
            }
        }

        /* 数据存在性检验 */
        var packages = [null];
        for(var i = 1; i <= 7; ++i) {
            if(result[i * 2 - 2]) {
                packages[i] = JSON.parse(result[i * 2 - 2]);
            }
            else {
                callback(retCode.PACKAGE_NOT_EXIST);
                return;
            }
        }

        /* 上锁 */
        if(changeLock) {
            for(var i = 1; i <= 7; ++i) {
                redisDB.SETEX(lockKey[i], '5', '1');
            }
        }

        callback(null, packages);
    });
};

/**
 * 保存所有背包 packages[1-7]
 * @param zid 区Id
 * @param zuid 用户Id
 * @param packages 背包数组
 * @param changeLock 是否上锁
 * @param callback 返回结果
 */
var savePackages = function(zid, zuid, packages, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var client = redisDB.MULTI();
    var key = [];
    var lockKey = [];

    for(var i = 1; i <= 7; ++i) {
        key[i] = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, i);
        lockKey[i] = redisClient.joinLockKey(key);
        client.SET(key[i], JSON.stringify(packages[i]));
    }

    client.EXEC(function(err, result) {
        /* 解锁 */
        if(changeLock) {
            for(var i = 1; i <= 7; ++i) {
                redisDB.DEL(lockKey[i]);
            }
        }

        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 解锁所有背包
 * @param zid 区Id
 * @param zuid 用户Id
 */
var openLockPackages = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    for(var i = 1; i <= 7; ++i) {
        var key = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, i);
        var lockKey = redisClient.joinLockKey(key);
        redisDB.DEL(lockKey);
    }
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取player对象和所有背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param changeLock 是否上锁
 * @param callback 由player和packages组成的数组 [0]:player [1-7]:pkg
 */
var getPlayerAndPackages = function(zid, zuid, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var client = redisDB.MULTI();
    var key = [];
    var lockKey = [];

    key[0] = redisClient.joinKey(redisKey.keyStringPlayerByZuid, zuid);
    lockKey[0] = redisClient.joinLockKey(key[0]);
    client.GET(key[0]);
    client.GET(lockKey[0]);

    for(var i = 1; i <= 7; ++i) {
        key[i] = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, i);
        lockKey[i] = redisClient.joinLockKey(key[i]);
        client.GET(key[i]);
        client.GET(lockKey[i]);
    }

    client.EXEC(function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }

        /* 锁校验 */
        if(changeLock) {
            if(result[1]) {
                callback(retCode.PLAYER_LOCKED);
                return;
            }

            for(var i = 1; i <= 7; ++i) {
                if(result[i * 2 + 1]) {
                    callback(retCode.PACKAGE_LOCKED);
                    return;
                }
            }
        }

        /* 数据存在性校验 */
        var playerAndPackages = [];
        for(var i = 0; i <= 7; ++i) {
            if(result[i * 2]) {
                playerAndPackages[i] = JSON.parse(result[i * 2]);
            }
            else {
                callback(retCode.PACKAGE_NOT_EXIST);
                return;
            }
        }

        /* 上锁 */
        if(changeLock) {
            for(var i = 0; i <= 7; ++i) {
                redisDB.SETEX(lockKey[i], '5', '1');
            }
        }

        callback(null, playerAndPackages);
    });
};

/**
 * 保存player对象和背包数组
 * @param zid 区Id
 * @param zuid 用户Id
 * @param playerAndPackages [0]:player [1-7]:packages
 * @param changeLock 是否上锁
 * @param callback 返回结果
 */
var savePlayerAndPackages = function(zid, zuid, playerAndPackages, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var client = redisDB.MULTI();
    var key = [];
    var lockKey = [];

    key[0] =  redisClient.joinKey(redisKey.keyStringPlayerByZuid, zuid);
    lockKey[0] = redisClient.joinLockKey(key[0]);
    client.SET(key[0], JSON.stringify(playerAndPackages[0]));

    for(var i = 1; i <= 7; ++i) {
        key[i] = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, i);
        lockKey[i] = redisClient.joinLockKey(key[i]);
        client.SET(key[i], JSON.stringify(playerAndPackages[i]));
    }
    /* 解锁 */
    if(changeLock) {
        for(var i = 0; i <= 7; ++i) {
            client.DEL(lockKey[i]);
        }
    }
    client.EXEC(function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * player对象和所有背包解锁
 * @param zid 区Id
 * @param zuid 用户Id
 */
var openLockPlayerAndPackages = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);

    var key =  redisClient.joinKey(redisKey.keyStringPlayerByZuid, zuid);
    var lockKey = redisClient.joinLockKey(key);
    redisDB.DEL(lockKey);

    for(var i = 1; i <= 7; ++i) {
        key = redisClient.joinKey(redisKey.keyStringPackageByZuidPkgId, zuid, i);
        lockKey = redisClient.joinLockKey(key);
        redisDB.DEL(lockKey);
    }
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取指定背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param pkgId 背包Id
 * @param changeLock 是否上锁
 * @param callback 返回对应背包。
 */
exports.getPackage = getPackage;

/**
 * 保存指定背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param pkg 背包
 * @param changeLock 是否上锁
 * @param callback 返回操作结果
 */
exports.savePackage = savePackage;

/**
 * 解锁指定背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param pkgId 背包Id
 */
exports.openLockPackage = openLockPackage;

/**
 * 获取所有背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param changeLock 是否上锁
 * @param callback 返回所有背包 packages[1-7]，[0] == null
 */
exports.getPackages = getPackages;

/**
 * 保存所有背包 packages[1-7]
 * @param zid 区Id
 * @param zuid 用户Id
 * @param packages 背包数组
 * @param changeLock 是否上锁
 * @param callback 返回结果
 */
exports.savePackages = savePackages;


/**
 * 解锁所有背包
 * @param zid 区Id
 * @param zuid 用户Id
 */
exports.openLockPackages = openLockPackages;

/**
 * 获取player对象和所有背包
 * @param zid 区Id
 * @param zuid 用户Id
 * @param changeLock 是否上锁
 * @param callback 由player和packages组成的数组 [0]:player [1-7]:pkg
 */
exports.getPlayerAndPackages = getPlayerAndPackages;

/**
 * 保存player对象和背包数组
 * @param zid 区Id
 * @param zuid 用户Id
 * @param playerAndPackages [0]:player [1-7]:packages
 * @param changeLock 是否上锁
 * @param callback 返回结果
 */
exports.savePlayerAndPackages = savePlayerAndPackages;

/**
 * player对象和所有背包解锁
 * @param zid 区Id
 * @param zuid 用户Id
 */
exports.openLockPlayerAndPackages = openLockPlayerAndPackages;

