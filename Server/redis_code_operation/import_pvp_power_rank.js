/**
 *包含的头文件
 */
var redis = require('redis');
var fs = require('fs');
var async = require('async');
var redisKey = require('../common/redis_key');
var dbManager = require("../manager/redis_manager").Instance();
var cfgRedis = require('../../server_config/redis.json');

(function import_pvp_power_rank () {
    async.waterfall([
        /* 获取redis配置 */
        function(callback) {
            dbManager.loadLogicDB(cfgRedis, false);
            callback(null);
        },

        function(callback) { /* 战力排行玩家信息写入Redis */
            var key = redisKey.keyHashPowerRank;
            fs.exists('power_rank.json',  function(isExist) {
                if(!isExist) {
                    callback('There is no such file!');
                    return;
                }
                var data = fs.readFileSync('power_rank.json', 'utf-8');
                if(data.length <= 0) {
                    callback('File is empty!');
                    return;
                }
                data = JSON.parse(data);
                /* 将数据写入Redis */
                var redisDB = dbManager.getGlobalRedisClient().getDB(0);
                redisDB.HMSET(key,  data,  function(err) {
                    if(err) {
                        callback('Err happened when writing !');
                        return;
                    }
                    callback(null);
                });
            });
        },
        function(callback) { /* 竞技场排行玩家信息写入Redis */
            var key = redisKey.keyHashPvpRank;
            fs.exists('pvp_rank.json',  function(isExist) {
                if(!isExist) {
                    callback('There is no such file!!');
                    return;
                }
                var data = fs.readFileSync('pvp_rank.json', 'utf-8');
                if(data.length <= 0) {
                    callback('File is empty!!');
                    return;
                }
                data = JSON.parse(data);
                /* 将数据写入Redis */
                var redisDB = dbManager.getGlobalRedisClient().getDB(0);
                redisDB.HMSET(key,  data,  function(err) {
                    if(err) {
                        callback('Err happened when writing !!');
                        return;
                    }
                    callback(null);
                });
            });
        }
    ], function(err) {
        if(err) {
            console.log(err);
            return;
        }
        console.log("importing successfully!");
    });
})();

