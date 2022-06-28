

/**
 *包含的头文件
 */

var redis = require('redis');
var fs = require('fs');
var async = require('async');
var redisKey = require('../common/redis_key');
var mainUiDb = require('../game_server/database/main_ui_rank');
var sdkDb = require('../game_server/database/sdk_account');
var robotCommon = require('../common/robot');
var dbManager = require("../manager/redis_manager").Instance();
var cfgRedis = require('../../server_config/redis.json');
var redisClient = require('../tools/redis/redis_client');

var export_pvp_power_rank = function() {
    var pvpRank = {};
    var powerRank = {};
    var zidArr = [];

    async.waterfall([
        /* 获取redis配置 */
        function(callback) {
            dbManager.loadLogicDB(cfgRedis, false);
            callback(null);
        },

        function(callback) {
            var redisDB = dbManager.getGlobalRedisClient().getDB(0);
            redisDB.HKEYS(redisKey.keyHashZoneInfo, function(err, array) {
                if(err) {
                    callback('Err happened when reading!');
                    return;
                }
                zidArr = array;
                callback(null);
            });
        },

        function(callback) {
            async.each(zidArr, function(zid, eachCb) {
                mainUiDb.getPowerRanklist(zid,  500,  function(err, list) { /* 导出战力前500名的玩家信息 */
                    if(err) {
                        eachCb(err);
                        return;
                    }

                    async.each(list, function(zuid, cb) {
                        if(!robotCommon.checkIfRobot(zuid)) {
                            sdkDb.getChannelInfoByUid(zuid,  function(err,  channelInfo) {
                                if(err || null == channelInfo) {
                                    cb(err);
                                    return;
                                }
                                var key = channelInfo.channel + ':' + channelInfo.id;
                                var rankObject = {};
                                rankObject.channelId = channelInfo.channel;
                                rankObject.channelUid = channelInfo.id;
                                rankObject.rank = list.indexOf(zuid) + 1;
                                powerRank[key] = JSON.stringify(rankObject);
                                cb(null);
                            });
                        } else {
                            cb(null);
                        }
                    }, eachCb);
                });
            }, function(err) {
                fs.writeFile('power_rank.json',  JSON.stringify(powerRank),  function(err) { /*战力前500名的玩家信息写入文件 */
                    if(err) {
                        callback('Err happened when writing file!');
                        return;
                    }
                    callback(null);
                });
            });
        },
        function(callback) {
            async.each(zidArr, function(zid, eachCb) {
                var dbConnArrGS = dbManager.getZoneRedisClient();
                var redisDB = dbConnArrGS.getDB(zid);
                var key = redisClient.joinKey(redisKey.keyListArenaRankListByZid, zid);

                redisDB.LRANGE(key, 0, 49, function(err, list) { /* 导出竞技场前50名玩家信息*/
                    if(err) {
                        eachCb(err);
                        return;
                    }

                    async.each(list, function(zuid, cb) {
                        if(!robotCommon.checkIfRobot(zuid)) {
                            sdkDb.getChannelInfoByUid(zuid,  function(err, channelInfo) {
                                if(err || null == channelInfo) {
                                    cb(err);
                                    return;
                                }
                                var key = channelInfo.channel + ':' + channelInfo.id;
                                var rankObject = {};
                                rankObject.channelId = channelInfo.channel;
                                rankObject.channelUid = channelInfo.id;
                                rankObject.rank = list.indexOf(zuid) + 1;
                                pvpRank[key] = JSON.stringify(rankObject);
                                cb(null);
                            });
                        } else {
                            cb(null);
                        }
                    }, eachCb);
                });
            }, function(err) {
                fs.writeFile('pvp_rank.json',  JSON.stringify(pvpRank) ,  function(err) {
                    if(err) {
                        callback('Err happened when writing file!!');
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
        console.log('exporting successfully!!');
    });
};

export_pvp_power_rank();


