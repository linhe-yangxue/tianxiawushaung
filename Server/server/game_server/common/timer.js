var async = require('async');
var schedule = require('node-schedule');
var logger = require('../../manager/log4_manager');
var globalObject = require('../../common/global_object');
var dbManager = require("../../manager/redis_manager").Instance();
var csvManager = require('../../manager/csv_manager').Instance();
var demonBossDb = require('../database/demon_boss');
var arenaDb = require('../database/arena');
var accountDb = require('../database/account');
var sendMail = require('../common/send_mail');
var guildBossDatabase = require('../database/guild_boss');
var timeUtil = require('../../tools/system/time_util');
var mainUiRank = require('../database/main_ui_rank');
var retCode = require('../../common/ret_code');
var robotCommon = require('../../common/robot');

var setTimersInGame = function() {
    /* 22点竞技场排名奖励 */
    var rule = new schedule.RecurrenceRule();
    rule.hour = 22;
    rule.minute = 0;
    schedule.scheduleJob(rule, function() {
        var pvpReward = csvManager.PvpRankAwardConfig();
        var len = Object.keys(pvpReward).length; /* PvpRankAwardConfig配表的长度 */
        var rankNum = parseInt(pvpReward[len].RANK_MAX);
        async.waterfall([
            function(callback) {
                accountDb.getAllZoneId(callback);
            },
            
            function(zidList, callback) {
                async.eachSeries(zidList, function(zid, eachCb) {
                    var i = 1;
                    async.whilst(
                        function () { return i <= rankNum; },
                        function (cb) {
                            arenaDb.getArenaWarriorRank(zid, i - 1, function (err, uid) {
                                if(!robotCommon.checkIfRobot(uid)) {
                                    var mailInfo = {};
                                    mailInfo.zid = zid;
                                    mailInfo.uid = uid;
                                    mailInfo.mailTitle = csvManager.MailString()[11].MAIL_TITLE;
                                    mailInfo.mailContent = csvManager.MailString()[11].MAIL_WORD;
                                    mailInfo.items = getReward(i, pvpReward);
                                    if(mailInfo.items.length > 0) {
                                        sendMail.sendMail(mailInfo);
                                    }
                                }
                                ++i;
                                cb(null);
                            })
                        }, eachCb);
                }, callback);
            }
        ]);
    });

    /* 每周日零点天魔等级重置 */
    rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;
    rule.dayOfWeek = 0;
    schedule.scheduleJob(rule, function() {
        var uidCnt = 0;
        async.waterfall([
            /* 获取用户总数 */
            function(callback) {
                accountDb.getUidCnt(function(err, result) {
                    if(err) {
                        callback(err);
                    }
                    else {
                        uidCnt = result;
                        callback(null);
                    }
                });
            },

            /* 获取区列表 */
            function(callback) {
                accountDb.getAllZoneId(callback);
            },

            /* 设置天魔等级重置标志 */
            function(zidList, callback) {
                for(var i = 0; i < zidList.length; ++i) {
                    for(var j = 1; j <= uidCnt; ++j) {
                        demonBossDb.setDemonBossResetFlag(zidList[i], j);
                    }
                }
                callback(null);
            }
        ]);
    });

    /* 24点天魔奖励，更新天魔乱入的伤害、功勋、排行 */
    rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;
    schedule.scheduleJob(rule, function() {
        var uidCnt = 0;
        var zidList = [];
        var facTable = csvManager.FeatAwardConfig();

        async.waterfall([
            /* 获取用户总数 */
            function(callback) {
                accountDb.getUidCnt(function(err, result) {
                    if(err) {
                        callback(err);
                    }
                    else {
                        uidCnt = result;
                        callback(null);
                    }
                });
            },

            /* 获取区列表 */
            function(callback) {
                accountDb.getAllZoneId(function(err, result) {
                    if(err) {
                        callback(err);
                    }
                    else {
                        zidList = result;
                        callback(null);
                    }
                });
            },

            /* 伤害奖励 */
            function(callback) {
                async.each(zidList, function(zid, eachCb) {
                    demonBossDb.getDamageOutputRank(zid, 0, -1, function(err, result) {
                        if(err) {
                            eachCb(err);
                            return;
                        }

                        for(var i in facTable) {
                            if(facTable[i].AWARD_TYPE == 2) {
                                for(var j = facTable[i].DAMAGE_RANK_MIN;
                                    j <= facTable[i].DAMAGE_RANK_MAX; ++j) {
                                    var uid = result[(j - 1) * 2];
                                    if(uid) {
                                        var mailInfo = {};
                                        mailInfo.zid = zid;
                                        mailInfo.uid = uid;
                                        mailInfo.mailTitle = csvManager.MailString()[3].MAIL_TITLE;
                                        mailInfo.mailContent = csvManager.MailString()[3].MAIL_WORD;
                                        var item = new globalObject.ItemBase();
                                        item.tid = facTable[i].AWARD_ID;
                                        item.itemNum = facTable[i].AWARD_NUM;
                                        mailInfo.items = [item];
                                        sendMail.sendMail(mailInfo);
                                    }
                                }
                            }
                        }
                        eachCb(null);
                    });
                }, callback);
            },

            /* 功勋奖励 */
            function(callback) {
                async.each(zidList, function(zid, eachCb) {
                    demonBossDb.getMeritRank(zid, 0, -1, function(err, result) {
                        if(err) {
                            eachCb(err);
                            return;
                        }

                        for(var i in facTable) {
                            if(facTable[i].AWARD_TYPE == 3) {
                                for(var j = facTable[i].FEAT_RANK_MIN;
                                    j <= facTable[i].FEAT_RANK_MAX; ++j) {
                                    var uid = result[(j - 1) * 2];
                                    if(uid) {
                                        var mailInfo = {};
                                        mailInfo.zid = zid;
                                        mailInfo.uid = uid;
                                        mailInfo.mailTitle = csvManager.MailString()[2].MAIL_TITLE;
                                        mailInfo.mailContent = csvManager.MailString()[2].MAIL_WORD;
                                        var item = new globalObject.ItemBase();
                                        item.tid = facTable[i].AWARD_ID;
                                        item.itemNum = facTable[i].AWARD_NUM;
                                        mailInfo.items = [item];
                                        sendMail.sendMail(mailInfo);
                                    }
                                }
                            }
                        }
                        eachCb(null);
                    });
                }, callback);
            },

            /* 重置数值 */
            function(callback) {
                for (var i  = 0; i < zidList.length; ++i) {
                    demonBossDb.updateTimerDamageOutputRank(zidList[i]);
                    demonBossDb.updateTimerMeritRank(zidList[i]);
                }
                callback(null);
            }
        ]);
    });

    /* 0点公会BOSS刷新 */
    rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;
    schedule.scheduleJob(rule, function() {
        var csvManager = require('../../manager/csv_manager').Instance();
        var zidList = [];
        var timeNow = timeUtil.now();
        var now = timeNow.getTime();
        async.series({
            getAllZoneIdList: function (cb) {
                accountDb.getAllZoneId(function(err, data) {
                    if(!!err) {
                        cb(err);
                        return;
                    }
                    zidList = data;
                    cb(null);
                });
            },

            refreshGuildBoss: function(cb) {
                async.eachSeries(zidList, function (zid, cb) {
                    var zoneGuildBoss = [];
                    //
                    async.series({
                        getZoneGuildBoss: function (cb) {
                            guildBossDatabase.getZoneGuildBoss(zid, function (err, data) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                zoneGuildBoss = data;
                                cb(null);
                            });
                        },

                        refreshZoneGuildBoss: function (cb) {
                            async.eachSeries(zoneGuildBoss, function (guildBoss, cb) {
                                if(guildBoss.nextMid > 0) {
                                    guildBoss.mid =  guildBoss.nextMid;
                                }
                                var guildBossConfig = csvManager.GuildBoss()[guildBoss.mid];
                                if(undefined === guildBossConfig || null === guildBossConfig) {
                                    cb(retCode.GUILD_BOSS_NOT_EXIST);
                                    return;
                                }
                                var stageConfig = csvManager.StageConfig()[guildBossConfig.STAGE_ID];
                                if(undefined === stageConfig || null === stageConfig) {
                                    cb(retCode.GUILD_BOSS_STAGE_NOT_EXIST);
                                    return;
                                }
                                var monsterObjectConfig = csvManager.MonsterObject()[stageConfig.HEADICON];
                                if(undefined === monsterObjectConfig || null === monsterObjectConfig) {
                                    cb(retCode.GUILD_BOSS_MONSTER_OBJECT_NOT_EXIST);
                                    return;
                                }

                                guildBoss.monsterHealth = monsterObjectConfig.BASE_HP;
                                guildBoss.criticalStrikeUID = 0;
                                guildBoss.criticalStrikeTime = 0;
                                guildBoss.nextMid = 0;
                                //
                                async.series({
                                    refreshGuildBoss: function (cb) {
                                        guildBossDatabase.setGuildBoss(zid, guildBoss.gid, false, guildBoss, cb);
                                    },
                                    refreshGuildWarriors: function (cb) {
                                        guildBossDatabase.setGuildBossAllWarrior(zid, guildBoss.gid, {}, cb);
                                    }
                                }, function(err) {
                                    cb(err);
                                });
                            }, function (err) {
                                cb(err);
                            });
                        }
                    }, function(err) {
                        cb(err);
                    });
                }, function (err) {
                    cb(err);
                });
            }
        }, function(err) {
            if(!!err) {
                logger.LoggerGame.error("refresh guild boss error: " + err);
            }
            logger.LoggerGame.info("refresh guild boss success");
        });
    });

    /* 排名活动-（巅峰对决、战力比拼） */
    var rule = new schedule.RecurrenceRule();
    rule.hour = 23;
    rule.minute = 59;
    rule.second = 59;
    schedule.scheduleJob(rule, function () {
        var rankActivity = csvManager.RankActivity();
        var pvpLen = 0;
        /* 巅峰对决配表长度 */
        var fightingLen = 0;
        /* 战力比拼配表长度 */
        var len = Object.keys(rankActivity).length;
        for (var i = 1; i <= len; i++) {
            if (rankActivity[i].TYPE == 1) {
                pvpLen = i;
            }
            else if (rankActivity[i].TYPE == 2) {
                fightingLen = i;
            }
        }
        var pvpNum = parseInt(rankActivity[pvpLen].RANK_MAX);
        var fightingNum = parseInt(rankActivity[fightingLen].RANK_MAX);

        async.waterfall([
            function (callback) {
                accountDb.getAllZoneInfo(callback);
            },

            function (infoList, callback) {
                async.eachSeries(infoList, function (info, eachCb) {
                    var nowTime = parseInt(new Date().getTime() / 1000);
                    var endTime = parseInt(timeUtil.getDetailTime(info.openDate, 0)) + 7 * 24 * 3600;
                    if (Math.abs(endTime - nowTime) <= 10 ) {
                     /* 是否为开服第七天23：59:59  10秒延迟*/
                        /* 巅峰挑战发放奖励 */
                        var k1 = 1;
                        async.whilst(
                            function () {
                                return k1 <= pvpNum;
                            },
                            function (cb) {
                                arenaDb.getArenaWarriorRank(info.zid, k1 - 1, function (err, uid) {
                                    if (uid && !robotCommon.checkIfRobot(uid)) {
                                        var mailInfo = {};
                                        mailInfo.zid = info.zid;
                                        mailInfo.uid = uid;
                                        mailInfo.mailTitle = csvManager.MailString()[6].MAIL_TITLE;
                                        mailInfo.mailContent = csvManager.MailString()[6].MAIL_WORD.format(k1);
                                        mailInfo.items = pvpReward(k1, rankActivity);
                                        sendMail.sendMail(mailInfo);
                                    }
                                    ++k1;
                                    cb(null);
                                })
                            },function() {}
                        );

                        /* 战力比拼发放奖励 */
                        var k2 = 1;
                        async.whilst(
                            function () {
                                return k2 <= fightingNum;
                            },
                            function (cb) {
                                mainUiRank.getPowerRankId(info.zid, k2, function (err, uid) {
                                    if (uid[0] && !robotCommon.checkIfRobot(uid[0])) {
                                        var mailInfo = {};
                                        mailInfo.zid = info.zid;
                                        mailInfo.uid = uid[0];
                                        mailInfo.mailTitle = csvManager.MailString()[7].MAIL_TITLE;
                                        mailInfo.mailContent = csvManager.MailString()[7].MAIL_WORD.format(k2);
                                        mailInfo.items = fightingReward(k2, rankActivity);
                                        sendMail.sendMail(mailInfo);
                                    }
                                    ++k2;
                                    cb(null);
                                })
                            }, function() {}
                            );
                    }/* 判断是否为开服第7天 */
                    eachCb(null);
                }, callback);
            }
        ]);
    });
};
exports.setTimersInGame = setTimersInGame;

var getReward = function(rank, table) {
    var items = [];
    for(var i in table) {
        if(table[i].RANK_MIN <= rank && rank <= table[i].RANK_MAX) {
            items = getItems(table[i].AWARD_GROUPID);
        }
    }
    return items;
};

var getItems = function(groupStr) {
    if('0' === groupStr) {
        return [];
    }
    var groupStrArr = groupStr.split('|');
    var items = [];
    for(var i in groupStrArr) {
        var arr = groupStrArr[i].split('#');
        var item = new globalObject.ItemBase();
        item.tid = parseInt(arr[0]);
        item.itemNum = parseInt(arr[1]);
        items.push(item);
    }
    return items;
};
var pvpReward = function(rank,table) {
    var items = [];
    for (var i in table) {
        if(table[i].TYPE == 1){
            if(table[i].RANK_MIN <= rank && rank <= table[i].RANK_MAX) {
                items = getItems(table[i].AWARD_GROUPID);
            }
        }
    }
    return items;
};

var fightingReward = function(rank, table) {
    var items = [];
    for (var i in table) {
        if(table[i].TYPE == 2){
            if(table[i].RANK_MIN <= rank && rank <= table[i].RANK_MAX) {
                items = getItems(table[i].AWARD_GROUPID);
            }
        }
    }
    return items;
};
