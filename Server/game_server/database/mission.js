/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：任务相关功能:(日常，成就)
 * 开发者：王强
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
var dbManager = require("../../manager/redis_manager").Instance();
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var playerDb = require('../database/player');

/**
 * 获取任务积分奖励箱
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param date [string] 日期
 * @param callback [func] 返回错误码[int]和积分奖励箱[object](TaskScoreAwardBox)
 */
var getTaskScoreAwardBox = function(zid, uid, date, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringTreasureBoxByZuid, uid, date);

    redisDB.GET(key, function(err, result) {
        if (err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            result = JSON.parse(result);
            callback(null, result);
        }
        else {
            result = new globalObject.TaskScoreAwardBox();
            callback(null, result);
        }
    });
};

/**
 * 设置任务积分奖励箱
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param date [string] 日期
 * @param obj [object] 积分奖励箱(TaskScoreAwardBox)
 */
var setTaskScoreAwardBox = function(zid, uid, date, obj) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringTreasureBoxByZuid, uid, date);

    redisDB.SETEX(key, 24 * 3600, JSON.stringify(obj));
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取所有的每日任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param date [string] 日期
 * @param callback [func] 返回错误码[int]和每日任务数组[arr](TaskObject)
 */
var getAllDailyTasks = function(zid, uid, date, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyTaskByZuid, uid, date);

    redisDB.HVALS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result.length) {
            for (var i = 0; i < result.length; ++i) {
                result[i] = JSON.parse(result[i]);
            }
            callback(null, result);
        }
        else { /* 新建日常任务 */
            async.waterfall([
                function (wcb) {
                    playerDb.getPlayerData(zid, uid, false, wcb);
                },

                function(player, wcb) {
                    var dailyTasks = [];
                    var taskTable = csvManager.TaskConfig();
                    for(var index in taskTable) {
                        var level = player.character.level;
                        if (level >= taskTable[index].TASK_SHOW_LVMIN && level <= taskTable[index].TASK_SHOW_LVMAX) {
                            var task = new globalObject.TaskObject();
                            task.taskId = taskTable[index].INDX;
                            task.progress = 0;
                            task.accepted = -1;
                            dailyTasks.push(task);
                        }
                    }

                    if(dailyTasks.length > 0) {
                        var client = redisDB.MULTI();
                        for(var i = 0; i < dailyTasks.length; ++i) {
                            client.HSET(key, dailyTasks[i].taskId, JSON.stringify(dailyTasks[i]));
                        }
                        client.EXEC();
                        redisDB.EXPIRE(key, 24 * 3600);
                    }
                    wcb(null, dailyTasks);
                }
            ], callback);
        }
    });
};

/**
 * 获取特定每日任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param taskId [int] 任务Id
 * @param date [string] 日期
 * @param callback [func]  返回错误码[int]和每日任务[object](TaskObject)
 */
var getDailyTask = function(zid, uid, taskId, date, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyTaskByZuid, uid, date);

    redisDB.HGET(key, taskId, function(err, result) {
        if (err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(retCode.MISSION_NOT_EXISTS);
        }
    });
};

/**
 * 更新每日任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param date [string] 日期
 * @param object [object] 每日任务对象(TaskObject)
 */
var setDailyTask = function(zid, uid, date, object) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashDailyTaskByZuid, uid, date);
    var client = redisDB.MULTI();

    client.HSET(key, object.taskId, JSON.stringify(object));
    client.EXPIRE(key, 24 * 3600);
    client.EXEC();
};

/**
 * 更新每日任务，删除和增加任务对象组
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param arrSub [array] 删除对象数组(TaskObject)
 * @param arrAdd [object] 更新对象数组(TaskObject)
 * @param callback [func] 返回错误码[int]
 */
var changeDailyTask = function(zid, uid, date, arrSub, arrAdd, callback) {
    if(arrSub.length == 0 && arrAdd.length == 0) {
        callback(null);
        return;
    }

    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var client = redisDB.MULTI();
    var key = redisClient.joinKey(redisKey.keyHashDailyTaskByZuid, uid, date);

    for (var i = 0; i < arrSub.length; ++i) {
        client.HDEL(key, arrSub[i].taskId);
    }
    for (var i = 0; i < arrAdd.length; ++i) {
        client.HSET(key, arrAdd[i].taskId, JSON.stringify(arrAdd[i]));
    }
    client.EXPIRE(key, 24 * 3600);

    client.EXEC(function (err) {
        if (err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取所有的成就任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param callback [func] 返回错误码[int]和成就任务数组[array](TaskObject)
 */
var getAllAchvTasks = function(zid, uid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashAchvTaskByZuid, uid);

    redisDB.HVALS(key, function(err, result) {
        if(err) {
            callback(retCode.DB_ERR);
        }
        else if(result.length > 0) {
            for (var i = 0; i < result.length; ++i) {
                result[i] = JSON.parse(result[i]);
            }
            callback(null, result);
        }
        else { /* 新建成就任务 */
            async.waterfall([
                function (wcb) {
                    playerDb.getPlayerData(zid, uid, false, wcb);
                },

                function (player, wcb) {
                    var achvTasks = [];
                    var achvTable = csvManager.AchieveConfig();
                    for (var index in achvTable) {
                        var level = player.character.level;
                        if (level >= achvTable[index].TASK_SHOW_LVMIN
                            && level <= achvTable[index].TASK_SHOW_LVMAX
                            && achvTable[index].EX_TASK == 0) {
                            var task = new globalObject.TaskObject();
                            task.taskId = achvTable[index].INDX;
                            task.progress = 0;
                            task.accepted = -1;
                            achvTasks.push(task);
                        }
                    }

                    if (achvTasks.length > 0) {
                        var client = redisDB.MULTI();
                        for (var i = 0; i < achvTasks.length; ++i) {
                            client.HSET(key, achvTasks[i].taskId, JSON.stringify(achvTasks[i]));
                        }
                        client.EXEC();
                    }
                    wcb(null, achvTasks);
                }
            ], callback);
        }
    });
};

/**
 * 获取单个成就任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param taskId [int] 任务Id
 * @param callback [func] 返回错误码[int]和成就任务对象[object](TaskObject)
 */
var getAchvTask = function(zid, uid, taskId, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyHashAchvTaskByZuid, uid);

    redisDB.HGET(key, taskId, function(err, result) {
        if (err) {
            callback(retCode.DB_ERR);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            callback(retCode.MISSION_NOT_EXISTS);
        }
    });
};

/**
 * 更新成就任务相关信息
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param arrSub [array] 删除成就任务对象数组(TaskObject)
 * @param arrAdd [array] 更新成就任务对象数组(TaskObject)
 * @param callback [func] 返回错误码[int]
 */
var changeAchvTask = function(zid, uid, arrSub, arrAdd, callback) {
    if(arrSub.length == 0 && arrAdd.length == 0) {
        callback(null);
        return;
    }

    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var client = redisDB.MULTI();
    var key = redisClient.joinKey(redisKey.keyHashAchvTaskByZuid, uid);

    for (var i = 0; i < arrSub.length; ++i) {
        client.HDEL(key, arrSub[i].taskId);
    }
    for (var i = 0; i < arrAdd.length; ++i) {
        client.HSET(key, arrAdd[i].taskId, JSON.stringify(arrAdd[i]));
    }

    client.EXEC(function (err) {
        if (err) {
            callback(retCode.DB_ERR);
        }
        else {
            callback(null);
        }
    });
};

/**
 * 获取关卡任务列表
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param callback 返回当前关卡任务Id数组
 */
var getBattleTaskIdArr = function(zid, uid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringBattleTaskIdArrByZuid, uid);

    redisDB.GET(key, function(err, result) {
        if (err) {
            callback(err);
        }
        else if(result) {
            callback(null, JSON.parse(result));
        }
        else {
            var a = [];
            var stTable = csvManager.StageTask();
            for(var i in stTable) {
                if(stTable[i].FRONT_INDEX == 0) {
                    a.push(stTable[i].INDEX);
                }
            }
            callback(null, a);
        }
    });
};

/**
 * 设置关卡任务列表
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param IdArr [array] 当前关卡任务列表数组
 */
var setBattleTaskIdArr = function(zid, uid, IdArr) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var key = redisClient.joinKey(redisKey.keyStringBattleTaskIdArrByZuid, uid);
    var value = JSON.stringify(IdArr);

    redisDB.SET(key, value);
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取任务积分奖励箱
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param date [string] 日期
 * @param callback [func] 返回错误码[int]和积分奖励箱[object](TaskScoreAwardBox)
 */
exports.getTaskScoreAwardBox = getTaskScoreAwardBox;
/**
 * 设置任务积分奖励箱
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param data [string] 日期
 * @param obj [object] 积分奖励箱(TaskScoreAwardBox)
 */
exports.setTaskScoreAwardBox = setTaskScoreAwardBox;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取所有的每日任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param date [string] 日期
 * @param callback [func] 返回错误码[int]和每日任务数组[arr](TaskObject)
 */
exports.getAllDailyTasks = getAllDailyTasks;

/**
 * 获取特定每日任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param taskId [int] 任务Id
 * @param date [string] 日期
 * @param callback [func]  返回错误码[int]和每日任务[object](TaskObject)
 */
exports.getDailyTask = getDailyTask;

/**
 * 更新每日任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param date [string] 日期
 * @param object [object] 每日任务对象(TaskObject)
 */
exports.setDailyTask = setDailyTask;

/**
 * 更新每日任务，删除和增加任务对象组
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param arrSub [array] 删除对象数组(TaskObject)
 * @param arrAdd [object] 更新对象数组(TaskObject)
 * @param callback [func] 返回错误码[int]
 */
exports.changeDailyTask = changeDailyTask;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取所有的成就任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param callback [func] 返回错误码[int]和成就任务数组[array](TaskObject)
 */
exports.getAllAchvTasks = getAllAchvTasks;

/**
 * 获取单个成就任务
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param taskId [int] 任务Id
 * @param callback [func] 返回错误码[int]和成就任务对象[object](TaskObject)
 */
exports.getAchvTask = getAchvTask;

/**
 * 更新成就任务相关信息
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param arrSub [array] 删除成就任务对象数组(TaskObject)
 * @param arrAdd [array] 更新成就任务对象数组(TaskObject)
 * @param callback [func] 返回错误码[int]
 */
exports.changeAchvTask = changeAchvTask;

/**
 * 获取关卡任务列表
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param callback 返回当前关卡任务Id数组
 */
exports.getBattleTaskIdArr =getBattleTaskIdArr;

/**
 * 设置关卡任务列表
 * @param zid [int] 区Id
 * @param uid [int] 用户Id
 * @param IdArr [array] 当前关卡任务列表数组
 */
exports.setBattleTaskIdArr = setBattleTaskIdArr;
