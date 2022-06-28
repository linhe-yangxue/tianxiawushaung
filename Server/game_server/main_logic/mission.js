
/**
 * 包含的头文件
 */
var packets = require('../packets/mission');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var missionDb = require('../database/mission');
var cMission = require('../common/mission');
var protocolObject = require('../../common/protocol_object');
var globalObject = require('../../common/global_object');
var playerDb = require('../database/player');
var battleMainDb = require('../database/battle_main');
var cPlayer = require('../common/player');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cMonthCard = require('../common/month_card');
var cZuid = require('../common/zuid');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获得日常任务信息
 */
var CS_GetDailyTaskData = (function() {

    /**
     * 构造函数
     */
    function CS_GetDailyTaskData() {
        this.reqProtocolName = packets.pCSGetDailyTaskData;
        this.resProtocolName = packets.pSCGetDailyTaskData;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetDailyTaskData.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetDailyTaskData();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var date = (new Date()).toDateString();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取奖励箱信息 */
                function(callback) {
                    missionDb.getTaskScoreAwardBox(req.zid, req.zuid, date, callback);
                },

                /* 获取日常任务信息 */
                function(awardBox, callback) {
                    res.curScore = awardBox.curScore;
                    res.scoreAwards = awardBox.awardsRcvd;
                    missionDb.getAllDailyTasks(req.zid, req.zuid, date, callback);
                },

                /* 月卡任务类型31、32 */
                function(dailyTasks, callback) {
                    res.arr = dailyTasks;

                    cMonthCard.monthCardCheck(req.zid, req.zuid, function(err, cheapCard, expensiveCard) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        var taskTable = csvManager.TaskConfig();
                        for(var i = 0; i < dailyTasks.length; ++i) {
                            var tcLine = taskTable[dailyTasks[i].taskId];
                            if(!tcLine) {
                                continue;
                            }

                            if(tcLine.TYPE == 31) {
                                if(cheapCard == 1) {
                                    dailyTasks[i].progress = 1;
                                }
                                else if(cheapCard == 2) {
                                    dailyTasks[i].progress = 1;
                                    dailyTasks[i].accepted = 1;
                                }
                            }
                            else if(tcLine.TYPE == 32) {
                                if(expensiveCard == 1) {
                                    dailyTasks[i].progress = 1;
                                }
                                else if(expensiveCard == 2) {
                                    dailyTasks[i].progress = 1;
                                    dailyTasks[i].accepted = 1;
                                }
                            }
                        }

                        callback(null);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetDailyTaskData;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获得成就任务信息
 */
var CS_GetAchievementData = (function() {

    /**
     * 构造函数
     */
    function CS_GetAchievementData() {
        this.reqProtocolName = packets.pCSGetAchievementData;
        this.resProtocolName = packets.pSCGetAchievementData;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetAchievementData.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetAchievementData();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取成就任务信息 */
                function (callback) {
                    missionDb.getAllAchvTasks(req.zid, req.zuid, callback);
                },

                /* 设置返回值 */
                function(achvTasks, callback) {
                    res.arr = achvTasks;
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetAchievementData;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取日常任务奖励
 */
var CS_GetDailyTaskAward = (function() {

    /**
     * 构造函数
     */
    function CS_GetDailyTaskAward() {
        this.reqProtocolName = packets.pCSGetDailyTaskAward;
        this.resProtocolName = packets.pSCGetDailyTaskAward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetDailyTaskAward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetDailyTaskAward();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid
                || null == req.taskId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.taskId = parseInt(req.taskId);

            if(isNaN(req.zid) || isNaN(req.taskId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var date = (new Date()).toDateString();
            var taskName = '';
            var arrAdd = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /*  获取日常任务 */
                function(callback) {
                    missionDb.getDailyTask(req.zid, req.zuid, req.taskId, date, callback);
                },

                /* 校验、更新日常任务 */
                function(task, callback) {
                    var tcLine = csvManager.TaskConfig()[req.taskId];
                    if (!tcLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    /*月卡任务类型31,32 */
                    if(tcLine.TYPE == 31 || tcLine.TYPE == 32) {
                        cMonthCard.getMonthCard(req.zid, req.zuid, tcLine.TYPE - 30, callback);
                        return;
                    }


                    taskName = tcLine.TASK_NAME;
                    var endProgress = tcLine.NUM ? tcLine.NUM : tcLine.LEVEL;
                    if (task.accepted < 1 && task.progress >= endProgress) {
                        task.accepted = 1;
                        missionDb.setDailyTask(req.zid, req.zuid, date, task);
                        callback(null);
                    }
                    else {
                        callback(retCode.MISSION_NOT_COMPLETE);
                    }
                },

                /* 获取宝箱信息 */
                function(callback) {
                    missionDb.getTaskScoreAwardBox(req.zid, req.zuid, date, callback);
                },

                /* 增加宝箱积分, 并写入数据库 */
                function(awardBox, callback) {
                    var tcLine = csvManager.TaskConfig()[req.taskId];
                    var oldScore = awardBox.curScore;/*增加积分前的值*/
                    awardBox.curScore +=  tcLine.SCORE_NUM;
                    missionDb.setTaskScoreAwardBox(req.zid, req.zuid, date, awardBox);
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_integral, preZid, req.channel, req.zuid, req.zuid, 0, 0,
                        logsWater.GETDAILYTASKAWARD_LOGS, req.taskId, 0, tcLine.SCORE_NUM, oldScore, awardBox.curScore, 0);
                    callback(null);
                },

                /* 获取奖励物品以及数量 */
                function(callback) {
                    var tcLine = csvManager.TaskConfig()[req.taskId];
                    var itemStrArr = tcLine.AWARD_ITEM.split('|');

                    for(var i = 0; i < itemStrArr.length; ++i) {
                        var item = new globalObject.ItemBase();
                        item.tid = parseInt(itemStrArr[i].split('#')[0]);
                        item.itemNum = parseInt(itemStrArr[i].split('#')[1]);
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.GETDAILYTASKAWARD_LOGS, req.taskId, function (err, retSub, retAdd) {
                        res.arr = retAdd;
                        callback(err);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_mission_reward, preZid, req.channel, req.zuid, req.zuid, 0, 2, 4, req.taskId, taskName, 0, JSON.stringify(arrAdd));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetDailyTaskAward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取成就任务奖励
 */
var CS_GetAchievementAward = (function() {

    /**
     * 构造函数
     */
    function CS_GetAchievementAward() {
        this.reqProtocolName = packets.pCSGetAchievementAward;
        this.resProtocolName = packets.pSCGetAchievementAward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetAchievementAward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetAchievementAward();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid
                || null == req.taskId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.taskId = parseInt(req.taskId);

            if(isNaN(req.zid) || isNaN(req.taskId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var task; /* 成就任务 */
            var taskName = '';
            var arrAdd = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 读取成就任务 */
                function(callback) {
                    missionDb.getAchvTask(req.zid, req.zuid,  req.taskId,  callback);
                },

                /* 验证进度 */
                function(achvTask, callback) {
                    task = achvTask;
                    var acLine = csvManager.AchieveConfig()[req.taskId];
                    taskName = acLine.TASK_NAME;
                    var endProgress = acLine.NUM ? acLine.NUM : acLine.LEVEL;
                    if (achvTask.accepted < 1 && achvTask.progress >= endProgress) {
                        callback(null);
                    }
                    else {
                        callback(retCode.MISSION_NOT_COMPLETE);
                    }
                },

                /* 更新成就任务 */
                function(callback) {
                    var arrSub = [];
                    var arrAdd = [];
                    var exFollowTask = false;
                    /* 是否有后续的任务 */

                    var achvTable = csvManager.AchieveConfig();
                    for (var i in achvTable) {
                        if (achvTable[i].EX_TASK == req.taskId) {
                            var newTask = new globalObject.TaskObject();
                            newTask.taskId = achvTable[i].INDX;
                            newTask.progress = task.progress;
                            /* 把当前完成任务的进度复制给后续的任务 */
                            newTask.accepted = -1;
                            arrSub.push(task);
                            arrAdd.push(newTask);
                            exFollowTask = true;

                            /* 类型8和类型9的任务特殊处理 */
                            if (achvTable[i].TYPE == cMission.TASK_TYPE_8 || achvTable[i] == cMission.TASK_TYPE_9) {
                                cPlayer.getPetsInBattle(req.zid, req.zuid, function(err, pets) {
                                    if(err) {
                                        callback(err);
                                        return;
                                    }

                                    newTask.progress = 0;
                                    if(achvTable[i].TYPE == cMission.TASK_TYPE_8) {
                                        for(var j = 0; j < pets.length; ++j) {
                                            if(pets[j].level >= achvTable[i].LEVEL) {
                                                ++ newTask.progress;
                                            }
                                        }
                                    }
                                    else {
                                        for(var j = 0; j < pets.length; ++j) {
                                            if(pets[j].fateLevel >= achvTable[i].LEVEL) {
                                                ++ newTask.progress;
                                            }
                                        }
                                    }

                                    callback(null, arrSub, arrAdd);
                                });
                                return;
                            }
                            break;
                        }
                    }

                    if (!exFollowTask) {
                        task.accepted = 1;
                        arrAdd.push(task);
                    }
                    callback(null, arrSub, arrAdd);
                },

                function(arrSub, arrAdd, callback) {
                    missionDb.changeAchvTask(req.zid, req.zuid, arrSub, arrAdd, callback);
                },

                /* 发奖励 */
                function(callback) {
                    var acLine = csvManager.AchieveConfig()[req.taskId];
                    var itemStrArr = acLine.AWARD_ITEM.split('|');

                    for(var i = 0; i < itemStrArr.length; ++i) {
                        var item = new globalObject.ItemBase();
                        item.tid = parseInt(itemStrArr[i].split('#')[0]);
                        item.itemNum = parseInt(itemStrArr[i].split('#')[1]);
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.GETACHIEVEMENTAWARD_LOGS, req.taskId, function (err, retSub, retAdd) {
                        res.arr = retAdd;
                        callback(err);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_mission_reward, preZid, req.channel, req.zuid, req.zuid, 0, 2, 5, req.taskId, taskName, 0, JSON.stringify(arrAdd));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetAchievementAward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取积分宝箱奖励
 */
var CS_GetTaskScoreAward = (function() {

    /**
     * 构造函数
     */
    function CS_GetTaskScoreAward() {
        this.reqProtocolName = packets.pCSGetTaskScoreAward;
        this.resProtocolName = packets.pSCGetTaskScoreAward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetTaskScoreAward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetTaskScoreAward();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid
                || null == req.awardId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.awardId = parseInt(req.awardId);

            if(isNaN(req.zid) || isNaN(req.awardId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var date = (new Date()).toDateString();
            var arrAdd = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取积分奖励箱 */
                function(callback) {
                    missionDb.getTaskScoreAwardBox(req.zid, req.zuid, date, callback);
                },

                /* 更新积分奖励箱 */
                function(awardBox, callback) {
                    var scLine = csvManager.ScoreConfig()[req.awardId];
                    if (!scLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    if (awardBox.curScore >= scLine.NUM && awardBox.awardsRcvd.indexOf(req.awardId) == -1) {
                        awardBox.awardsRcvd.push(req.awardId);
                        missionDb.setTaskScoreAwardBox(req.zid, req.zuid, date, awardBox);
                        callback(null);
                    }
                    else {
                        callback(retCode.MISSION_NOT_COMPLETE);
                    }
                },

                /* 发奖励 */
                function(callback) {
                    var strItems = csvManager.ScoreConfig()[req.awardId].AWARD_ITEM;
                    var itemsStr = strItems.split('|');  /* 1000001#20|1000002#100|1000005#10 */

                    for (var i = 0; i < itemsStr.length; ++i) {
                        var item = new globalObject.ItemBase();
                        item.tid = parseInt(itemsStr[i].split('#')[0]);
                        item.itemNum = parseInt(itemsStr[i].split('#')[1]);
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.GETTASKSCOREAWARD_LOGS, req.awardId, function (err, retSub, retAdd) {
                        res.arr = retAdd;
                        callback(err);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_mission_reward, preZid, req.channel, req.zuid, req.zuid, 0, 2, 6, req.awardId, '', 0, JSON.stringify(arrAdd));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetTaskScoreAward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取主线任务信息
 */
var CS_GetBattleTask = (function() {

    /**
     * 构造函数
     */
    function CS_GetBattleTask() {
        this.reqProtocolName = packets.pCSGetBattleTask;
        this.resProtocolName = packets.pSCGetBattleTask;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetBattleTask.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetBattleTask();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    missionDb.getBattleTaskIdArr(req.zid, req.zuid, callback);
                },

                function(Ids, callback) {
                    for(var i = 0; i < Ids.length; ++i) {
                        var battleTask = new protocolObject.BattleTask();
                        battleTask.taskId = Ids[i];
                        res.taskArr.push(battleTask);
                    }

                    var stTable = csvManager.StageTask();
                    async.each(res.taskArr, function(task, cb) {
                        var stLine = stTable[task.taskId];
                        if(!stLine) { /* 表中的任务已经全部完成 */
                            task.taskId = 0;
                            cb(null);
                            return;
                        }

                        var spLine = csvManager.StagePoint()[stLine.POINTID];
                        if(!spLine) {
                            cb(retCode.TID_NOT_EXIST);
                            return;
                        }

                        battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, spLine.STAGEID, function(err, battle) {
                            if(null == err && battle && battle.successCount > 0) {
                                task.finished = 1;
                            }
                            cb(err);
                        });
                    }, callback);
                }

            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetBattleTask;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取主线任务奖励
 */
var CS_GetBattleTaskAward = (function() {

    /**
     * 构造函数
     */
    function CS_GetBattleTaskAward() {
        this.reqProtocolName = packets.pCSGetBattleTaskAward;
        this.resProtocolName = packets.pSCGetBattleTaskAward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetBattleTaskAward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetBattleTaskAward();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid
                || null == req.taskId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.taskId = parseInt(req.taskId);

            if(isNaN(req.zid) || isNaN(req.taskId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var IdArr;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取当前任务Id数组 */
                function(callback) {
                    missionDb.getBattleTaskIdArr(req.zid, req.zuid, callback);
                },

                /* 获取请求的任务的关卡信息 */
                function(Ids, callback) {
                    IdArr = Ids;
                    if(Ids.indexOf(req.taskId) == -1) {
                        callback(retCode.BATTLE_TASK_ID_ILLEGAL);
                        return;
                    }

                    var stLine = csvManager.StageTask()[req.taskId];
                    if(!stLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    var spLine = csvManager.StagePoint()[stLine.POINTID];
                    if(!spLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, spLine.STAGEID, callback);
                },

                function(battle, callback) {
                    if(null == battle || battle.successCount <= 0) {
                        callback(retCode.MISSION_NOT_COMPLETE);
                        return;
                    }

                    var stLine = csvManager.StageTask()[req.taskId];
                    var itemStrArr = stLine.REWARD.split('|');
                    var arrAdd = [];
                    for(var i = 0; i < itemStrArr.length; ++i) {
                        var item = new globalObject.ItemBase();
                        item.tid = parseInt(itemStrArr[i].split('#')[0]);
                        item.itemNum = parseInt(itemStrArr[i].split('#')[1]);
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc,
                        logsWater.GET_BATTLETASK_AWARD, req.taskId, function(err, retSub, retAdd) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            var arrEx = []; /* 不是背包中的物品 */
                            for(var i = 0 ; i < arrAdd.length; ++i) {
                                var inPackage = false;
                                for(var j = 0; j < retAdd.length; ++j) {
                                    if(arrAdd[i].tid == retAdd[j].tid) {
                                        inPackage = true;
                                        break;
                                    }
                                }
                                if(!inPackage) {
                                    arrEx.push(arrAdd[i]);
                                }
                            }
                            res.awards = retAdd.concat(arrEx);
                            callback(null);
                        }
                    });
                },

                /* 设置新任务 */
                function(callback) {
                    var stTable = csvManager.StageTask();
                    res.nextTask = new protocolObject.BattleTask();
                    res.nextTask.taskId = stTable[req.taskId].AFTER_INDEX;

                    /* 更新任务Id数组 */
                    for(var i = 0; i < IdArr.length; ++i) {
                        if(IdArr[i] == req.taskId) {
                            IdArr[i] = res.nextTask.taskId;
                            break;
                        }
                    }
                    missionDb.setBattleTaskIdArr(req.zid, req.zuid, IdArr);

                    /* 返回新任务 */
                    if(stTable[res.nextTask.taskId]) {
                        var stLine = csvManager.StageTask()[res.nextTask.taskId];
                        if(!stLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        var spLine = csvManager.StagePoint()[stLine.POINTID];
                        if(!spLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }

                        battleMainDb.getBattleMainByBattleId(req.zid, req.zuid, spLine.STAGEID, function(err, battle) {
                            if(null == err && battle && battle.successCount > 0) {
                                res.nextTask.finished = 1;
                            }
                            callback(err);
                        });
                    }
                    else { /* 没有后续任务 */
                        res.nextTask.taskId = 0;
                        callback(null);
                    }
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetBattleTaskAward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetDailyTaskData());
    exportProtocol.push(new CS_GetAchievementData());
    exportProtocol.push(new CS_GetDailyTaskAward());
    exportProtocol.push(new CS_GetAchievementAward());
    exportProtocol.push(new CS_GetTaskScoreAward());
    exportProtocol.push(new CS_GetBattleTask());
    exportProtocol.push(new CS_GetBattleTaskAward());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
