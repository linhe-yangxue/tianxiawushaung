/**
 * 任务类型枚举
 */
const TASK_TYPE_1 = 1; /* 通关副本（类型、ID、数量）*/
const TASK_TYPE_2 = 2; /* 竞技场（数量）*/
const TASK_TYPE_3 = 3; /* 好友赠送精力数量（数量）*/
const TASK_TYPE_4 = 4; /* 对宠物进行升级（数量）*/
const TASK_TYPE_5 = 5; /* 装备强化（数量）*/
const TASK_TYPE_6 = 6; /* 装备精炼（数量）*/
const TASK_TYPE_7 = 7; /* 法器强化（数量） */
const TASK_TYPE_8 = 8; /* 上阵符灵达到指定等级（等级、数量） */
const TASK_TYPE_9 = 9; /* 上阵符灵天命达到指定等级（天命等级、数量） */
const TASK_TYPE_10 = 10; /* 主角升级到指定等级（等级） */
const TASK_TYPE_11 = 11; /* 副本星数到达指定星数（数量） */
const TASK_TYPE_12 = 12; /* 战斗力达到指定数值（数量） */
const TASK_TYPE_13 = 13; /* VIP等级到达指定数值（vip等级） */
const TASK_TYPE_14 = 14; /* 帮助好友镇压指定次数（数量） */
const TASK_TYPE_15 = 15; /* 累计寻宝指定小时（数量） */
const TASK_TYPE_16 = 16; /* 累计终结天魔BOSS指定数量（数量） */
const TASK_TYPE_17 = 17; /* 封灵塔战斗次数（数量） */
const TASK_TYPE_18 = 18; /* 法器合成（数量） */
const TASK_TYPE_19 = 19; /* 技能升级（数量） */
const TASK_TYPE_20 = 20; /* 商店普通抽卡（数量） */
const TASK_TYPE_21 = 21; /* 商店高级抽卡（数量） */
const TASK_TYPE_22 = 22; /* 攻打天魔次数（数量） */
const TASK_TYPE_23 = 23; /* 触发天魔次数（数量） */
const TASK_TYPE_24 = 24; /* 购买体力丹（数量） */
const TASK_TYPE_25 = 25; /* 购买精力丹（数量） */
const TASK_TYPE_26 = 26; /* 封灵塔星星数量（数量） */
const TASK_TYPE_27 = 27; /* 上阵符灵穿装备数（符灵数、数量） */
const TASK_TYPE_28 = 28; /* 上阵符灵穿法器数（符灵数、数量） */
const TASK_TYPE_29 = 29;	/* 抢夺法器次数（数量）*/

const TASK_TYPE_31 = 31;	/* 普通月卡 */
const TASK_TYPE_32 = 32;	/* 至尊月卡 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 任务类型枚举
 */
exports.TASK_TYPE_1 = TASK_TYPE_1; /* 通关副本（类型、ID、数量） */
exports.TASK_TYPE_2 = TASK_TYPE_2; /* 竞技场（数量）*/
exports.TASK_TYPE_3 = TASK_TYPE_3; /* 好友赠送精力数量（数量）*/
exports.TASK_TYPE_4 = TASK_TYPE_4; /* 对宠物进行升级（数量）*/
exports.TASK_TYPE_5 = TASK_TYPE_5; /* 装备强化（数量）*/
exports.TASK_TYPE_6 = TASK_TYPE_6; /* 装备精炼（数量）*/
exports.TASK_TYPE_7 = TASK_TYPE_7; /* 法器强化（数量） */
exports.TASK_TYPE_8 = TASK_TYPE_8; /* 上阵符灵达到指定等级（等级、数量） */
exports.TASK_TYPE_9 = TASK_TYPE_9; /* 上阵符灵天命达到指定等级（天命等级、数量） */
exports.TASK_TYPE_10 = TASK_TYPE_10;  /* 主角升级到指定等级（等级） */
exports.TASK_TYPE_11 = TASK_TYPE_11;  /* 副本星数到达指定星数（数量） */
exports.TASK_TYPE_12 = TASK_TYPE_12; /* 战斗力达到指定数值（数量） */
exports.TASK_TYPE_13 = TASK_TYPE_13; /* VIP等级到达指定数值（vip等级） */
exports.TASK_TYPE_14 = TASK_TYPE_14; /* 帮助好友镇压指定次数（数量） */
exports.TASK_TYPE_15 = TASK_TYPE_15; /* 累计寻宝指定小时（数量） */
exports.TASK_TYPE_16 = TASK_TYPE_16; /* 累计终结天魔BOSS指定数量（数量） */
exports.TASK_TYPE_17 = TASK_TYPE_17; /* 封灵塔战斗次数（数量） */
exports.TASK_TYPE_18 = TASK_TYPE_18; /* 法器合成（数量） */
exports.TASK_TYPE_19 = TASK_TYPE_19; /* 技能升级（数量） */
exports.TASK_TYPE_20 = TASK_TYPE_20; /* 商店普通抽卡（数量） */
exports.TASK_TYPE_21 = TASK_TYPE_21; /* 商店高级抽卡（数量） */
exports.TASK_TYPE_22 = TASK_TYPE_22; /* 攻打天魔次数（数量） */
exports.TASK_TYPE_23 = TASK_TYPE_23; /* 触发天魔次数（数量） */
exports.TASK_TYPE_24 = TASK_TYPE_24; /* 购买体力丹（数量） */
exports.TASK_TYPE_25 = TASK_TYPE_25; /* 购买精力丹（数量） */
exports.TASK_TYPE_26 = TASK_TYPE_26; /* 封灵塔星星数量（数量） */
exports.TASK_TYPE_27 = TASK_TYPE_27; /* 上阵符灵穿装备数（符灵数、数量） */
exports.TASK_TYPE_28 = TASK_TYPE_28; /* 上阵符灵穿法器数（符灵数、数量） */
exports.TASK_TYPE_29 = TASK_TYPE_29;	/* 抢夺法器次数（数量）*/

exports.TASK_TYPE_31 = TASK_TYPE_31;	/* 普通月卡 */
exports.TASK_TYPE_32 = TASK_TYPE_32;	/* 至尊月卡 */

var csvManager = require('../../manager/csv_manager').Instance();
var retCode = require('../../common/ret_code');
var missionDb = require('../database/mission');
var protocolObject = require('../../common/protocol_object');
var logger = require('../../manager/log4_manager');
var async = require('async');
var playerDb = require('../database/player');
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var globalObject = require('../../common/global_object');
var notification = require('../common/notification');
var notice = require('../database/notification');


/**
 * 判断任务类型是否是数量覆盖更新方式
 * @param taskType [int] 任务类型
 * @returns {boolean}
 */
var isCoverTaskType = function(taskType) {
    switch (taskType) {
        case TASK_TYPE_8:
        case TASK_TYPE_9:
        case TASK_TYPE_10:
        case TASK_TYPE_12:
        case TASK_TYPE_13:
        case TASK_TYPE_26:
        case TASK_TYPE_27:
        case TASK_TYPE_28:
            return true;
        default :
            return false;
    }
};

/**
 * 主角升级事件
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param level [int] 主角等级
 * @param callback [func] 事件处理完后回调通知
 */
var onCharacterLevelUp = function(zid, zuid, level, callback) {
    var date = (new Date()).toDateString();
    async.waterfall([
        /* 获取所有日常任务 */
        function (callback) {
            missionDb.getAllDailyTasks(zid, zuid, date, callback);
        },

        /* 更新日常任务 */
        function(dailyTasks, callback) {
            var arrSub = [];
            var arrAdd = [];
            var taskTable = csvManager.TaskConfig();

            for(var index in taskTable) {
                /* 删除失效任务 */
                if(level < taskTable[index].TASK_SHOW_LVMIN || level > taskTable[index].TASK_SHOW_LVMAX) {
                    var task = new globalObject.TaskObject();
                    task.taskId = index;
                    arrSub.push(task);
                }
                else { /* 添加新任务 */
                    var taskExist = false; /* 任务已存在 */
                    for(var i = 0; i < dailyTasks.length; ++i) {
                        if(index == dailyTasks[i].taskId) {
                            taskExist = true;
                            break;
                        }
                    }
                    if(!taskExist) {
                        task = new globalObject.TaskObject();
                        task.taskId = index;
                        task.progress = 0;
                        task.accepted = -1;
                        arrAdd.push(task);
                    }
                }
            }
            missionDb.changeDailyTask(zid, zuid, date, arrSub, arrAdd, callback);
        },

        /* 获取所有成就任务 */
        function (callback) {
            missionDb.getAllAchvTasks(zid, zuid, callback);
        },

        /* 更新成就任务 */
        function(achvTasks, callback) {
            var arrSub = [];
            var arrAdd = [];
            var taskTable = csvManager.AchieveConfig();

            for(var index in taskTable) {
                /* 删除失效任务 */
                if(level < taskTable[index].TASK_SHOW_LVMIN || level > taskTable[index].TASK_SHOW_LVMAX) {
                    var task = new globalObject.TaskObject();
                    task.taskId = index;
                    arrSub.push(task);
                }
                else { /* 添加新任务 */
                    var sameSourceTaskEx = false; /* 存在同源任务 */
                    for(var i = 0; i < achvTasks.length; ++i) {
                        if(taskTable[index].HEAD_TASK == taskTable[achvTasks[i].taskId].HEAD_TASK) {
                            sameSourceTaskEx = true;
                            break;
                        }
                    }
                    if(!sameSourceTaskEx && taskTable[index].EX_TASK == 0) {
                        task = new globalObject.TaskObject();
                        task.taskId = index;
                        task.progress = 0;
                        task.accepted = -1;
                        arrAdd.push(task);
                    }
                }
            }
            missionDb.changeAchvTask(zid, zuid, arrSub, arrAdd, callback);
        }
    ], function() {
        callback();
    });
};

/**
 * 更新日常任务信息(除任务89)
 * @param zid [int] 区ID
 * @param zuid [int] 玩家ID
 * @param taskType [int] 日常任务类型
 * @param battleType [int] 副本类型
 * @param num [int] 完成数量
 */
var updateDailyTask = function(zid, zuid, taskType, battleType, num)  {
    var date = (new Date()).toDateString();
    var arrAdd = []; /* 更新任务集合 */
    async.waterfall([
        /* 获取所有每日任务 */
        function (callback) {
            missionDb.getAllDailyTasks(zid, zuid, date, callback);
        },

        /* 更新任务进度 */
        function(dailyTasks, callback) {
            for (var i = 0; i < dailyTasks.length; ++i) {
                var tcLine = csvManager.TaskConfig()[dailyTasks[i].taskId];
                if (!tcLine || tcLine.TYPE != taskType
                    || (tcLine.GATES_TYPE != battleType && tcLine.GATES_TYPE != 0)
                    || dailyTasks[i].accepted > 0
                    || dailyTasks[i].progress >= tcLine.NUM + tcLine.LEVEL) {
                    continue;
                }

                if (isCoverTaskType(taskType)) {
                    if(dailyTasks[i].progress < num) {
                        dailyTasks[i].progress = num;
                    }
                }
                else {
                    dailyTasks[i].progress += num;
                }
                arrAdd.push(dailyTasks[i]);

                /* 更新通知 */
                var endProgress = tcLine.NUM ? tcLine.NUM : tcLine.LEVEL;
                if (dailyTasks[i].progress >= endProgress) {
                    notice.addNotification(zid, zuid, notification.NOTIF_TASK_FINISH);
                }
                notice.addNotification(zid, zuid, notification.NOTIF_TASK_REFRESH);
            }
            callback(null);
        },

        /* 保存任务进度 */
        function(callback) {
            missionDb.changeDailyTask(zid, zuid, date, [], arrAdd, callback);
        }
    ], function() {});
};

/**
 * 更新成就任务数据(除任务89)
 * @param zid [int] 区ID
 * @param zuid [int] 玩家uid
 * @param taskType [int] 任务类型
 * @param battleType [int] 副本类型
 * @param battleId [int] 副本id(除了副本类型的任务battleId都是0)
 * @param num [int] 完成数量
 */
var updateAchieveTask = function (zid, zuid, taskType, battleType, battleId, num)  {
    var arrAdd = []; /* 更新任务集合 */
    async.waterfall([
        /* 读取所有任务 */
        function (callback) {
            missionDb.getAllAchvTasks(zid, zuid, callback);
        },

        /* 更新任务进度 */
        function (achvTasks, callback) {
            for (var i = 0; i < achvTasks.length; ++i) {
                var acLine = csvManager.AchieveConfig()[achvTasks[i].taskId];
                if (!acLine || acLine.TYPE != taskType
                    || (acLine.GATES_TYPE != battleType && acLine.GATES_TYPE != 0)
                    || (acLine.GATES_ID != battleId && acLine.GATES_ID != 0)) {
                    continue;
                }

                if (isCoverTaskType(taskType)) {
                    if(achvTasks[i].progress < num) {
                        achvTasks[i].progress = num;
                    }
                }
                else {
                    achvTasks[i].progress += num;
                }
                arrAdd.push(achvTasks[i]);

                /* 更新通知 */
                var endProgress = acLine.NUM ? acLine.NUM : acLine.LEVEL;
                if (achvTasks[i].accepted < 1 && achvTasks[i].progress >= endProgress) {
                    notice.addNotification(zid, zuid, notification.NOTIF_TASK_FINISH);
                }
                notice.addNotification(zid, zuid, notification.NOTIF_TASK_REFRESH);
            }
            callback(null);
        },

        /* 保存任务进度 */
        function(callback) {
            missionDb.changeAchvTask(zid, zuid, [], arrAdd, callback);
        }
    ],function () {});
};

/**
 * 更新89日常任务信息
 * @param zid [int] 区ID
 * @param zuid [int] 玩家ID
 * @param taskType [int] 日常任务类型
 * @param pkg [object] 宠物背包
 */
var updateDailyTask89 = function(zid, zuid, taskType, pkg)  {
    var date = (new Date()).toDateString();
    var arrAdd = []; /* 更新任务集合 */
    async.waterfall([
        /* 获取所有每日任务 */
        function (callback) {
            missionDb.getAllDailyTasks(zid, zuid, date, callback);
        },

        /* 更新任务进度 */
        function(dailyTasks, callback) {
            for (var i = 0; i < dailyTasks.length; ++i) {
                var tcLine = csvManager.TaskConfig()[dailyTasks[i].taskId];
                if (!tcLine || tcLine.TYPE != taskType
                    || dailyTasks[i].accepted > 0
                    || dailyTasks[i].progress >= tcLine.NUM) {
                    continue;
                }

                var num = 0;
                var pets = pkg.content;
                if(taskType == TASK_TYPE_8) {
                    for(var j = 0; j < pets.length; ++j) {
                        if(pets[j].teamPos > 0 && pets[j].teamPos < 4 && pets[j].level >= tcLine.LEVEL) {
                            ++ num;
                        }
                    }
                }
                else if(taskType == TASK_TYPE_9) {
                    for(j = 0; j < pets.length; ++j) {
                        if(pets[j].teamPos > 0 && pets[j].teamPos < 4 && pets[j].fateLevel >= tcLine.LEVEL) {
                            ++ num;
                        }
                    }
                }

                if(dailyTasks[i].progress < num) {
                    dailyTasks[i].progress = num;
                }
                arrAdd.push(dailyTasks[i]);

                /* 更新通知 */
                if (dailyTasks[i].progress >= tcLine.NUM) {
                    notice.addNotification(zid, zuid, notification.NOTIF_TASK_FINISH);
                }
                notice.addNotification(zid, zuid, notification.NOTIF_TASK_REFRESH);
            }
            callback(null);
        },

        /* 保存任务进度 */
        function(callback) {
            missionDb.changeDailyTask(zid, zuid, date, [], arrAdd, callback);
        }
    ], function() {});
};

/**
 * 更新89成就任务数据
 * @param zid [int] 区ID
 * @param zuid [int] 玩家uid
 * @param taskType [int] 任务类型
 * @param pkg [object] 宠物背包
 */
var updateAchieveTask89 = function (zid, zuid, taskType, pkg)  {
    var arrAdd = []; /* 更新任务集合 */
    async.waterfall([
        /* 读取所有任务 */
        function (callback) {
            missionDb.getAllAchvTasks(zid, zuid, callback);
        },

        /* 更新任务进度 */
        function (achvTasks, callback) {
            for (var i = 0; i < achvTasks.length; ++i) {
                var acLine = csvManager.AchieveConfig()[achvTasks[i].taskId];
                if (!acLine || acLine.TYPE != taskType) {
                    continue;
                }

                var num = 0;
                var pets = pkg.content;
                if(taskType == TASK_TYPE_8) {
                    for(var j = 0; j < pets.length; ++j) {
                        if(pets[j].teamPos > 0 && pets[j].teamPos < 4 && pets[j].level >= acLine.LEVEL) {
                            ++ num;
                        }
                    }
                }
                else if(taskType == TASK_TYPE_9) {
                    for(j = 0; j < pets.length; ++j) {
                        if(pets[j].teamPos > 0 && pets[j].teamPos < 4 && pets[j].fateLevel >= acLine.LEVEL) {
                            ++ num;
                        }
                    }
                }

                if(achvTasks[i].progress < num) {
                    achvTasks[i].progress = num;
                }
                arrAdd.push(achvTasks[i]);

                /* 更新通知 */
                if (achvTasks[i].accepted < 1 && achvTasks[i].progress >= acLine.NUM) {
                    notice.addNotification(zid, zuid, notification.NOTIF_TASK_FINISH);
                }
                notice.addNotification(zid, zuid, notification.NOTIF_TASK_REFRESH);
            }
            callback(null);
        },

        /* 保存任务进度 */
        function(callback) {
            missionDb.changeAchvTask(zid, zuid, [], arrAdd, callback);
        }
    ],function () {});
};
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 判断任务类型是否是数量覆盖更新方式
 * @param taskType [int] 任务类型
 * @returns {boolean}
 */
exports.isCoverTaskType = isCoverTaskType;

/**
 * 主角升级事件
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param level [int] 主角等级
 * @param callback [func] 事件处理完后回调通知
 */
exports.onCharacterLevelUp = onCharacterLevelUp;

/**
 * 更新日常任务信息(除任务89)
 * @param zid [int] 区ID
 * @param zuid [int] 玩家ID
 * @param taskType [int] 日常任务类型
 * @param battleType [int] 副本类型
 * @param num [int] 完成数量
 */
exports.updateDailyTask = updateDailyTask;

/**
 * 更新成就任务数据(除任务89)
 * @param zid [int] 区ID
 * @param zuid [int] 玩家uid
 * @param taskType [int] 任务类型
 * @param battleType [int] 副本类型
 * @param battleId [int] 副本id(除了副本类型的任务battleId都是0)
 * @param num [int] 完成数量
 */
exports.updateAchieveTask = updateAchieveTask;

/**
 * 更新89日常任务信息
 * @param zid [int] 区ID
 * @param zuid [int] 玩家ID
 * @param taskType [int] 日常任务类型
 * @param pkg [object] 宠物背包
 */
exports.updateDailyTask89 = updateDailyTask89;

/**
 * 更新89成就任务数据
 * @param zid [int] 区ID
 * @param zuid [int] 玩家uid
 * @param taskType [int] 任务类型
 * @param pkg [object] 宠物背包
 */
exports.updateAchieveTask89 = updateAchieveTask89;