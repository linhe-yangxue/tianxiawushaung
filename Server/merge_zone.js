var redis = require('redis');
var async = require('async');
var readline = require('readline');
var dbManager = require('./manager/redis_manager').Instance();
var redisKey = require('./common/redis_key');
var redisClient = require('./tools/redis/redis_client');
var accountDb = require('./game_server/database/account');
var parseKey = require('./tools/parse/key');
var cfgRedis = require('../server_config/redis.json');

/**
 * 把fromDB中所有的key移动到toDB中，如果toDB中已存在相同的key，
 * 则只删除fromDB中该key。操作将清空fromDB，请做好数据备份。
 * @param fromDB 源数据库
 * @param toDB 目标数据库
 * @param callback 返回操作结果
 */
function dateTrans(fromDB, toDB, callback) {
    var done = false;
    async.whilst(function() { return !done; },
        function(whlCb) {
            var key;

            async.waterfall([
                function (wtrCb) {
                    fromDB.RANDOMKEY(wtrCb);
                },

                function (k, wtrCb) {
                    key = k;
                    if(null == key) {
                        done = true;
                        wtrCb(1);
                        return;
                    }

                    toDB.EXISTS(key, wtrCb);
                },

                function (est, wtrCb) {
                    if(est) {
                        fromDB.DEL(key);
                        wtrCb(1);
                        return;
                    }

                    fromDB.DUMP(key, wtrCb);
                },

                function (dump, wtrCb) {
                    toDB.RESTORE(key, 0, dump, wtrCb);
                },

                function(ok, wtrCb) {
                    fromDB.DEL(key, wtrCb);
                }
            ], function(err) {
                if(err && err != 1) {
                    whlCb(-1);
                }
                else {
                    whlCb(null);
                }
            });
        }, callback);
}

/**
 * 结束进程
 * @param err 错误码，0表示正常退出
 */
function exit (err) {
    setTimeout(
        function() {
            process.exit(err);
        },
        1000
    );
}

/**
 * 合区主函数把a区合并到b区
 * @param a
 * @param b
 */
function main(a, b) {
    var fromDB, toDB, keys;
    async.waterfall([
        /* 获取redis配置 */
        function(callback) {
            dbManager.loadLogicDB(cfgRedis, true);
            callback(null);
        },

        /* 数据迁移 */
        function(callback) {
            fromDB = dbManager.getZoneRedisClient().getDB(a);
            toDB = dbManager.getZoneRedisClient().getDB(b);
            dateTrans(fromDB, toDB, callback);
        },

        /* 获取要处理的keys */
        function(callback) {
            keys = parseKey.parseXmlNode('./common/redis_key.js');
            callback(null);
        },

        /* 删除key */
        function(callback) {
            if (!keys.hasOwnProperty('KeyNeedDelete')) {
                callback(null);
                return;
            }
            async.each(keys['KeyNeedDelete'], function (k, cb) {
                k += '*';
                toDB.KEYS(k, function (err, result) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    if (result.length > 0) {
                        toDB.DEL(result);
                    }
                    cb(null);
                });
            }, callback);
        },

        /* 有序集合合并 */
        function(callback) {
            if (!keys.hasOwnProperty('SortedSetNeedMerge')) {
                callback(null);
                return;
            }
            async.each(keys['SortedSetNeedMerge'], function (k, eachCb) {
                var src = redisClient.joinKey(k, a);
                var tgt = redisClient.joinKey(k, b);

                /* 判断有序集合是否存在 */
                toDB.EXISTS(src, function(err, exist) {
                    if(err) {
                        eachCb(err);
                        return;
                    }

                    if(exist == 0) {
                        eachCb(null);
                        return;
                    }

                    /* 取出来源集合数据 */
                    toDB.ZRANGE(src, 0, -1, 'WITHSCORES', function(err, keyScores) {
                        if(err) {
                            eachCb(err);
                            return;
                        }

                        if(keyScores.length == 0) {
                            eachCb(null);
                            return;
                        }

                        keyScores.reverse();

                        /* 数据加目标集合 */
                        toDB.ZADD(tgt, keyScores, function(err) {
                            if(err) {
                                eachCb(err);
                            }
                            else {
                                /*  删除来源集合 */
                                toDB.DEL(src);
                                eachCb(null);
                            }
                        });
                    });
                });
            }, callback);
        },

        /* 修改配置信息 */
        function(callback) {
            accountDb.getAllZoneInfo(callback);
        },

        function(zoneInfos, callback) {
            var i = 0;
            async.whilst(
                function() { return i < zoneInfos.length; },
                function(cb) {
                    ++ i;
                    var j = i - 1;
                    if(zoneInfos[j].areaId == a) {
                        zoneInfos[j].areaId = b;
                        accountDb.setZoneInfo(zoneInfos[j], cb);
                        return;
                    }
                    cb(null);
                },
                callback
            );
        }
    ], function(err) {
        if (err) {
            console.error('----------------- Merge Zone Failed!!!-----------------');
            exit(-1);
        }
        else {
            console.info('----------------- Merge Zone Success. -----------------');
            exit(0);
        }
    });
}


/**-------------------------               提示                 -------------------------**/
var rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});


rl.question("This script will merge Zone A to Zone B.\nDo you known what you are doing now?\n(Input 'YES' to continue.)\n", function(answer1) {
    if(answer1 !== 'YES') {
        process.exit(1);
    }

    rl.question("Please Input 'A>B', where A and B is the Zone numbers\n", function(answer2) {
        var a = parseInt(answer2.split('>')[0]);
        var b = parseInt(answer2.split('>')[1]);

        if(isNaN(a) || isNaN(b)) {
            process.exit(1);
        }

        rl.question("Are you sure about MERGING ZONE " + a + " TO ZONE " + b + "?\n(Input 'I AM SURE.' to continue.)\n", function(answer3) {
            if(answer3 !== "I AM SURE.") {
                process.exit(1);
            }

            main(a, b);
        });
    });
});
