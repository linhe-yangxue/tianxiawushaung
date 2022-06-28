/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取玩家活动时间内花费元宝数，为玩家发放相应奖励
 * 开发者：邱峰
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var dbManager = require('../../manager/redis_manager').Instance();
var redisKey = require('../../common/redis_key');
var retCode = require('../../common/ret_code');
var async = require('async');
var globalObject = require('../../common/global_object');
var redisClient = require('../../tools/redis/redis_client');
var activityTimeDB = require('../database/activity_time');
var zuidCut = require('../common/zuid.js');

/**
 *获取礼包列表状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback 返回状态列表
 */
var getPrizeStatus = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashActDiamondStatusByZuid, zuid);

    redisDB.HVALS(key, function(err, array){
       if(err){
           callback(retCode.DB_ERR);
           return;
       }
        var len = array.length;
       for(var i = 0; i < len; ++i) {
           if(!array[i]) {
               continue;
           }
           array[i] = parseInt(array[i]);
       }
       callback(null, array);
    });
};

/**
 *获取花费元宝数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback 返回元宝数
 */
var getCostNum = function(zid, zuid, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringCostDiamondByZuid, zuid);

    redisDB.GET(key, function(err, data){
       if(err){
           callback(retCode.DB_ERR);
           return;
       }
        if(null == data){
            data = 0;
            redisDB.SET(key, data);
        }
        callback(null, data);
    });
};

/**
 *保存礼包列表状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param clickItemID [] 奖励领取状态列表
 * @param callback 返回元宝数
 */
var savePrizeStatus = function(zid, zuid, clickItemID, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashActDiamondStatusByZuid, zuid);

    redisDB.HSETNX(key, clickItemID, clickItemID, function(err, data){
        if(err){
            callback(retCode.DB_ERR);
        }
        else{
            callback(null, data);
        }
    });
};
/**
 * 增加花费元宝数(接口)
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param addCostNum 增加消费元宝数
 */
var addCostDimNum = function(zid, zuid, addCostNum){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringCostDiamondByZuid, zuid);
    var nowTime = parseInt(Date.now() / 1000);
    var uAndZId = zuidCut.zuidSplit(zuid);
    var oldZid = uAndZId[0];
    var objOpenTime;
    async.waterfall([
        function(callback) {
            activityTimeDB.getActivityTime(zid, oldZid, 2, function(err, data){
                if(null == data){
                    callback(retCode.NOT_IN_ACT_TIME);
                    return;
                }
                objOpenTime = data;
                callback(null);
            });
        },
        function(callback){
            var actOpenTime = objOpenTime.beginTime;
            var actEndTime = objOpenTime.endTime;
            if (nowTime >= actOpenTime && nowTime <= actEndTime) {
                redisDB.INCRBY(key, addCostNum);
            }
            callback(null);
        }
    ],function(err){

    });
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 *获取礼包列表状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback 返回状态列表
 */
exports.getPrizeStatus = getPrizeStatus;
/**
 *获取花费元宝数
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param callback 返回元宝数
 */
exports.getCostNum = getCostNum;
/**
 *保存礼包列表状态
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param clickItemID [] 奖励领取状态列表
 * @param callback 返回元宝数
 */
exports.savePrizeStatus = savePrizeStatus;
/**
 * 增加花费元宝数(接口)
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param addCostNum 增加消费元宝数
 */
exports.addCostDimNum = addCostDimNum;