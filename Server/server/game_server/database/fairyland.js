/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：秘境探险：
 * 开发者：卢凯鹏
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
var globalObject = require('../../common/global_object');
var dbManager = require("../../manager/redis_manager").Instance();
var csvManager = require('../../manager/csv_manager').Instance();


/**
 * 获取仙境列表
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param changeLock [bool] 是否上锁
 * @param callback [func] 返回错误码[int](retCode)和仙境数组[arr] (Fairyland)
 */
var getFairylands = function(zid, zuid,  changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFairylandsByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else { /* 数据不存在时创建 */
            var fairylands = [];
            for(var i = 0; i < 6; ++i) {
                var fland = new globalObject.Fairyland();
                fairylands.push(fland);
            }

            var value = JSON.stringify(fairylands);
            redisDB.SET(key, value, function(err) {
                if(err) {
                    callback(retCode.DB_ERR);
                }
                else {
                    callback(null, fairylands);
                }
            });
        }
    });
};
exports.getFairylands = getFairylands;


/**
 *  保存仙境数组
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param fairylands [arr] 仙境数组
 * @param changeLock [bool] 是否解锁
 * @param callback [func] 返回错误码[int](retCode)
 */
var setFairylands = function(zid, zuid,  fairylands, changeLock, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFairylandsByZuid, zuid);
    var value = JSON.stringify(fairylands);

    redisDB.SET(key, value, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};
exports.setFairylands = setFairylands;


/**
 *  获取开始战斗时间
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和开始战斗时间
 */
var getFairylandFightBegin = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFDFightBeginByZuid, zuid);

    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, result);
        }
        else {
            callback(retCode.FD_FIGHT_TIME_ERR);
        }
    });
};
exports.getFairylandFightBegin = getFairylandFightBegin;


/**
 * 保存开始战斗时间
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param fightBegin [int] 开始战斗时间
 * @param callback [func] 返回错误码[int](retCode)
 */
var setFairylandFightBegin = function(zid, zuid, fid, fightBegin, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFDFightBeginByZuid, zuid);
    var value =  redisClient.joinKey(fid, fightBegin);

    redisDB.SET(key, value, function(err) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};
exports.setFairylandFightBegin = setFairylandFightBegin;


/**
 * 删除开始战斗时间
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
var delFairylandFightBegin = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringFDFightBeginByZuid, zuid);

    redisDB.DEL(key);
};
exports.delFairylandFightBegin = delFairylandFightBegin;


/**
 * 获取仙境已镇压次数
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param callback [func] 返回错误码[int](retCode)和已镇压次数[int]
 */
var getRepressCnt = function(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var date = (new Date()).toDateString();
    var key = redisClient.joinKey(redisKey.keyStringFDRepressCntByZuidDate, zuid, date);
    
    redisDB.GET(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, parseInt(result));
        }
        else {
            callback(null, 0);
        }
    });
};
exports.getRepressCnt = getRepressCnt;

/**
 * 仙境镇压次数加一
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 */
var incrRepressCnt = function(zid, zuid) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var date = (new Date()).toDateString();
    var key = redisClient.joinKey(redisKey.keyStringFDRepressCntByZuidDate, zuid, date);

    redisDB.INCR(key);
    redisDB.EXPIRE(key, 24 * 3600);
};
exports.incrRepressCnt = incrRepressCnt;

