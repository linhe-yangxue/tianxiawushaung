/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：主界面排行机器人
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
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
var csvManager = require('../../manager/csv_manager').Instance();
var dbManager = require("../../manager/redis_manager").Instance();
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var rand = require('../../tools/system/math').rand;
var accountDb = require('./account');


/**
 * 创建等级机器人排行榜
 * @param callback [function] 回调是否创建成功
 */
var createMainUIRobotLevelRank = function(callback) {
    async.waterfall([
        function(cb) {
            accountDb.getAllZoneInfo(cb);
        },

        function(zoneInfos, cb) {
            var zidList = [];
            for(var i = 0; i < zoneInfos.length; ++i) {
                if(zidList.indexOf(zoneInfos[i].areaId) == -1) {
                    zidList.push(zoneInfos[i].areaId);
                }
            }

            async.each(zidList, function (zid, ecb) {
                var redisDB = dbManager.getZoneRedisClient().getDB(zid);
                var key = redisClient.joinKey(redisKey.keySortedSetZuidInLevelByZid, zid);

                var i = 1;
                var j = 50;
                async.whilst(
                    function () {
                        return i <= j;
                    },
                    function (wcb) {
                        var newTime = parseInt(Date.now() / 1000);
                        var level = parseInt(csvManager.RobotConfig()[i].ROLE_LEVEL);
                        redisDB.ZADD(key, parseInt((1000 - level) * Math.pow(10, 10) + newTime), -i, function (err) {
                            if (err) {
                                wcb(retCode.DB_ERR);
                                return;
                            }
                            ++i;
                            wcb(null);
                        });
                    },
                    function (err) {
                        ecb(err);
                    }
                );
            }, cb);
        }
    ], function (err) {
        callback(err);
    });
};

/**
 * 创建战力机器人排行榜
 * @param callback [function] 回调是否创建成功
 */
var createMainUIRobotPowerRank = function(callback) {
    async.waterfall([
        function(cb) {
            accountDb.getAllZoneInfo(cb);
        },

        function(zoneInfos, cb) {
            var zidList = [];
            for(var i = 0; i < zoneInfos.length; ++i) {
                if(zidList.indexOf(zoneInfos[i].areaId) == -1) {
                    zidList.push(zoneInfos[i].areaId);
                }
            }

            async.each(zidList, function(zid, ecb) {
                var redisDB = dbManager.getZoneRedisClient().getDB(zid);
                var key = redisClient.joinKey(redisKey.keySortedSetZuidInPowerByZid, zid);

                var i = 1;
                var j = 50;
                async.whilst(
                    function() {
                        return i <= j;
                    },
                    function(wcb) {
                        var newTime = parseInt(Date.now() / 1000);
                        var power = parseInt(csvManager.RobotConfig()[i].COMBAT);
                        redisDB.ZADD(key, (power*(-1) + (-1)*power / newTime), -i, function(err) {
                            if(err) {
                                wcb(retCode.DB_ERR);
                                return;
                            }
                            ++i;
                            wcb(null);
                        });
                    },
                    function(err) {
                        ecb(err);
                    }
                );
            },cb);
        }
    ],function(err) {
        callback(err);
    });
};

/**
 * 创建等级机器人排行榜
 * @param callback [function] 回调是否创建成功
 */
exports.createMainUIRobotLevelRank = createMainUIRobotLevelRank;
/**
 * 创建战力机器人排行榜
 * @param callback [function] 回调是否创建成功
 */
exports.createMainUIRobotPowerRank = createMainUIRobotPowerRank;
