/**
 * 文件描述：包序号验证
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 */

/**
 * 包含的头文件
 */
var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require("../../manager/redis_manager").Instance();
var logger = require('../../manager/log4_manager');

/**
 * 验证包序号
 * @param jsonResult [object] 消息内容
 * @return isVerify [bool] 是否合法,true为合法
 */
var checkPackageIndex = function(jsonResult, callback){
    var pi = 0;
    var zid = 0;
    var uid = 0;
    async.waterfall([
        /* 验证参数 */
        function(callback){
            if(null == jsonResult.pi){
                callback(retCode.ERR);
            }
            else if(null == jsonResult.zid || null == jsonResult.uid){
                callback(retCode.SUCCESS);
            }
            else{
                pi = parseInt(jsonResult.pi);
                zid = parseInt(jsonResult.zid);
                uid = parseInt(jsonResult.uid);
                if(isNaN(pi) || isNaN(zid) || isNaN(uid)){
                    callback(retCode.ERR);
                }
                else{
                    callback(null);
                }
            }
        },

        /* 验证是否重复发包 */
        function(callback){
            getPackageIndex(zid, uid, function(err, data){
                if(err){
                    callback(retCode.DB_ERR);
                }
                else{
                    for(var i=0; i<data.length; i++){
                        if(pi == data[i]){
                            logger.LoggerGame.info(retCode.PACKAGE_VERIFY_ERR, JSON.stringify(jsonResult));
                            callback(retCode.PACKAGE_VERIFY_ERR);
                            return;
                        }
                    }
                    /* 保存包序号 */
                    setPackageIndex(zid, uid, pi, callback);
                }
            });
        }
    ],function(err) {
        callback(err);
    });
};
exports.checkPackageIndex = checkPackageIndex;

/**
 * 获取包序号
 */
var getPackageIndex = function(zid, uid, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListPackageIndexByZuid, uid);

    redisDB.LRANGE(key, 0, -1, callback);
};

/**
 * 保存包序号
 */
var setPackageIndex = function(zid, uid, pi, callback){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListPackageIndexByZuid, uid);

    var client = redisDB.MULTI();

    client.LPUSH(key, pi);
    client.LTRIM(key, 0, 9);
    client.EXEC(callback);
};

/**
 * 删除所有包序号，因每次上线客户端都是从0开始自增发
 */
var delPackageIndex = function(zid, uid){
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyListPackageIndexByZuid, uid);

    redisDB.DEL(key);
};
exports.delPackageIndex = delPackageIndex;
