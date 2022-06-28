/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：走马灯数据库操作
 * 开发者：高骏
 * 开发者备注：
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
var globalObject = require('../../common/global_object');
var async = require('async');

/**
 *获取一个走马灯信息
 * @param rollid [int] 走马灯ID
 * @param callback [func] 返回一个走马灯信息
 */
var getRollPlaying = function(rollid, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashRollPlaying;

    redisDB.HGET(key, rollid, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null, JSON.parse(data));
        }
    });
};

/**
 *获取全部走马灯信息
 * @return callback [array] 返回走马灯信息
 */
var getRollPlayingList = function(callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashRollPlaying;

    redisDB.HVALS(key, function(err, data) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            var rollArr = [];
            for (var i=0; i<data.length; i++) {
                rollArr[rollArr.length] = JSON.parse(data[i]);
            }
            callback(null, rollArr);
        }
    });
};

/**
 * 添加走马灯信息
 * @param rollPlaying [Object] RollPlayingInfo对象
 * @param callback [func] 返回错误码[int]
 */
var addRollPlayingList = function(rollPlaying, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashRollPlaying;

    redisDB.HSET(key, rollPlaying.rollid, JSON.stringify(rollPlaying), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 删除走马灯信息
 * @param rollId [int] 走马灯ID
 * @param callback [func] 返回错误码[int]
 */
var delRollPlayingList = function(rollId, callback) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key = redisKey.keyHashRollPlaying;

    redisDB.HDEL(key, rollId, function(err) {
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
 * 定时器修改已过期的走马灯信息
 * @param callback [func] 返回错误码[int]
 */
var timerUpdateRollPlayingList = function() {
    var nowTime = parseInt(new Date().getTime()/1000);
    async.waterfall([
        function(callback){
            getRollPlayingList(callback);
        },
        function(rollInfo) {
            async.each(rollInfo, function (rollInfoIndex, eachCb) {
                if(rollInfoIndex && (!rollInfoIndex.overdue) && nowTime >= rollInfoIndex.endTime){
                    rollInfoIndex.overdue = 1;
                    addRollPlayingList(rollInfoIndex, eachCb);
                }
                else{
                    eachCb(null);
                }
            }, function (err) {});
        }
    ], function(err) {});
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *获取一个走马灯信息
 * @param rollid [int] 走马灯ID
 * @param callback [func] 返回一个走马灯信息
 */
exports.getRollPlaying = getRollPlaying;

/**
 *获取全部走马灯信息
 * @return callback [array] 返回走马灯信息
 */
exports.getRollPlayingList = getRollPlayingList;

/**
 * 添加走马灯信息
 * @param rollPlaying [Object] RollPlayingInfo对象
 * @param callback [func] 返回错误码[int]
 */
exports.addRollPlayingList = addRollPlayingList;

/**
 * 删除走马灯信息
 * @param rollId [int] 走马灯ID
 * @param callback [func] 返回错误码[int]
 */
exports.delRollPlayingList = delRollPlayingList;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 定时器修改已过期的走马灯信息
 * @param callback [func] 返回错误码[int]
 */
exports.timerUpdateRollPlayingList = timerUpdateRollPlayingList;
