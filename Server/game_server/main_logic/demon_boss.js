/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：天魔乱入：获取伤害输出和功勋、获取天魔列表、进入天魔副本、退出天魔副本、获取伤害排行
 * 　　获取功勋排行、领取功勋奖励、领取功勋奖励记录
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/demon_boss');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var cDemonBoss = require('../common/demon_boss');
var logger = require('../../manager/log4_manager');
var demonBossDb = require('../database/demon_boss');
var friendDb = require('../database/friend');
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var itemType= require('../common/item_type');
var playerDb = require('../database/player');
var cMission = require('../common/mission');
var protocolObject = require('../../common/protocol_object');
var sendMail = require('../common/send_mail');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cRevelry = require('../common/revelry');
var cZuid = require('../common/zuid');
var battleCheckManager = require('../common/battle_check/index');
var notifDb = require('../database/notification');
var cNotif = require('../common/notification');
var cPlayer = require('../common/player');
var packageDb = require('../database/package');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取伤害输出和功勋
 */
var CS_GetDamageAndMerit = (function() {

    /**
     * 构造函数
     */
    function CS_GetDamageAndMerit() {
        this.reqProtocolName = packets.pCSGetDamageAndMerit;
        this.resProtocolName = packets.pSCGetDamageAndMerit;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetDamageAndMerit.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetDamageAndMerit();
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
                    demonBossDb.getDamageOutputAndMerit(req.zid, req.zuid, callback);
                },

                function(data, callback) {
                    res.damageOutput = data.damageOutput;
                    res.merit = data.merit;
                    demonBossDb.getDamageOutputRankIndex(req.zid, req.zuid, callback);
                },

                function(damageRank, callback) {
                    res.selfDamageRank = damageRank;
                    demonBossDb.getMeritRankIndex(req.zid, req.zuid, callback);
                },

                function(meritRank, callback) {
                    res.selfMeritRank = meritRank;
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetDamageAndMerit;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取天魔列表
 */
var CS_GetDemonBossList = (function() {

    /**
     * 构造函数
     */
    function CS_GetDemonBossList() {
        this.reqProtocolName = packets.pCSGetDemonBossList;
        this.resProtocolName = packets.pSCGetDemonBossList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetDemonBossList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetDemonBossList();
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

                /* 获取好友列表 */
                function(callback) {
                    friendDb.getFriendList(req.zid, req.zuid, callback);
                },

                /* 获取天魔列表 */
                function(friendList, callback) {
                    friendList.unshift(req.zuid);
                    async.map(friendList, function(uid, cb) {
                        demonBossDb.getDemonBossRcd(req.zid, uid, function(err, demonBossRcd) {
                            if(err) {
                                cb(err);
                                return;
                            }
                            var demonBoss = cDemonBoss.getCurrentDemonBoss(demonBossRcd);
                            if(demonBoss) {
                                demonBoss.bossLevel = demonBossRcd.bossLevel;
                                demonBoss.hpBase = csvManager.BossConfig()[80000 + demonBoss.quality * 1000 + demonBossRcd.bossLevel].BASE_HP;
                            }
                            /* 是本人的天魔BOSS */
                            if(uid === req.zuid) {
                                cb(null, demonBoss);
                                return;
                            }
                            /* 好友分享了自己的天魔BOSS */
                            if(demonBoss && demonBoss.ifShareWithFriend) {
                                cb(null, demonBoss);
                                return;
                            }
                            cb(null);
                        });
                    },function (err, data) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            for(var i = 0; i < data.length; ++i) {
                                if(data[i]) {
                                    res.arr.push(data[i]);
                                }
                            }
                            callback(null);
                        }
                    });
                },

                /* 在天魔数组中加入发现者名字 */
                function(callback) {
                    async.map(res.arr, function(obj, cb) {
                        playerDb.getPlayerData(req.zid, obj.finderId, false, function(err, player) {
                            if(err) {
                                cb(err);
                            }
                            else {
                                obj.finderName = player.name;
                                obj.finderTid = player.character.tid;
                                cb(null);
                            }
                        });
                    },callback);
                }

            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetDemonBossList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 进入天魔副本
 */
var CS_DemonBossStart = (function() {

    /**
     * 构造函数
     */
    function CS_DemonBossStart() {
        this.reqProtocolName = packets.pCSDemonBossStart;
        this.resProtocolName = packets.pSCDemonBossStart;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DemonBossStart.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DemonBossStart();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.finderId
                || null == req.buttonIndex
                || null == req.eventIndex) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.buttonIndex = parseInt(req.buttonIndex);
            req.eventIndex = parseInt(req.eventIndex);

            if(isNaN(req.zid)
                || isNaN(req.buttonIndex) || isNaN(req.eventIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(req.buttonIndex < 0 || req.buttonIndex > 2) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var info = new globalObject.FightDemonBossInfo();
            var rcd;
            var demonBoss;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取天魔对象 */
                function(callback) {
                    demonBossDb.getDemonBossRcd(req.zid, req.finderId, callback);
                },

                function(rcdCb, callback) {
                    rcd = rcdCb;
                    demonBoss = cDemonBoss.getCurrentDemonBoss(rcd);
                    if(!demonBoss) {
                        res.bossDead = 1;
                        callback(retCode.SUCCESS);
                        return;
                    }
                    /* 天魔BOSS没有被分享 */
                    if(req.zuid !== req.finderId && demonBoss && 0 === demonBoss.ifShareWithFriend) {
                        callback(retCode.DEMON_BOSS_NOT_BE_SHARED);
                        return;
                    }
                    info.finderId = req.finderId;
                    info.bossIndex = rcd.bossIndex;
                    info.hpLeft = demonBoss.hpLeft;
                    res.quality = demonBoss.quality;
                    callback(null);
                },


                /* 检查活动 */
                function(callback) {
                    /* 不参加活动 */
                    if(req.eventIndex  == -1) {
                        callback(null);
                        return;
                    }

                    var line = csvManager.FeatEventConfig()[req.eventIndex];
                    if(!line) { /* 活动不存在 */
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    var date = new Date();
                    var nowTime = date.getHours() * 60 + date.getMinutes();
                    var openActivity = line.OPEN_HOUR * 60 + line.OPEN_MINUTE;
                    var closeActivity = line.CLOSE_HOUR * 60 + line.CLOSE_MINUTE;

                    if( nowTime >= openActivity && nowTime <= closeActivity) {
                        callback(null);
                    }
                    else { /* 不在活动时间 */
                        callback(retCode.NOT_EVENT_TIME);
                    }
                },
                function (callback) {
                    cPlayer.getPlayerFightDetail(req.zid, req.zuid, callback);
                },

                function (playerFightDetail, callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, false, function (err, pkg) {
                        callback(err, playerFightDetail, pkg);
                    })
                },

                function (playerFightDetail, pkg, callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                       callback(err, playerFightDetail, pkg, player);
                    });
                },

                function (playerFightDetail, pkg, player, callback) {
                    var damageOutPut = 0;
                    for(var i = 0; i < playerFightDetail.petFDs.length; i++){
                        var pet = playerFightDetail.petFDs[i];
                        if(0 === i) {
                            pet.breakLevel = player.character.breakLevel;
                            damageOutPut += computeLeaderDamage(req.buttonIndex, demonBoss, playerFightDetail.petFDs);
                            continue;
                        }
                        for(var j = 0; j < pkg.content.length; j++) {
                            if(pkg.content[j].teamPos > 0 && pkg.content[j].tid === pet.tid) {
                                pet.breakLevel = pkg.content[j].breakLevel;
                                damageOutPut += computePetDamage(req.buttonIndex, demonBoss, pet);
                                break;
                            }
                        }
                    }
                    /**/
                    info.damageOutput = (demonBoss.hpLeft - damageOutPut > 0 ? damageOutPut : demonBoss.hpLeft);
                    info.hpLeft = demonBoss.hpLeft - info.damageOutput;
                    res.hpLeft = info.hpLeft;
                    res.duration = csvManager.BossBirth()[demonBoss.bossBirthIndex].BOSS_BATTLE_TIME;
                    callback(null);
                },

                /* 消耗降魔令, 增加战功 */
                function(callback) {
                    var arrSub = [];
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_BEATDEMONCARD;
                    item.itemNum = req.buttonIndex;
                    arrSub.push(item);

                    var arrAdd = [];
                    item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_BATTLEACHV;
                    item.itemNum = req.buttonIndex * 50;
                    arrAdd.push(item);

                    var line = csvManager.FeatEventConfig()[req.eventIndex];
                    if(line) {
                        if(req.buttonIndex == 2) { /* 第一个按钮永远消耗一个降魔令 */
                            arrSub[0].itemNum = line.COST_MONSTER_TOKEN;
                            arrAdd[0].itemNum = arrSub[0].itemNum * 50;
                        }
                        info.meritTimes = line.FEAT_TIMES;
                    }
                    info.battleAchv = arrAdd[0].itemNum;

                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.DEMONBOSSSTART_LOGS, item.tid, function(err) {
                        callback(err);
                    });
                },

                function(callback) {
                    demonBossDb.setFightDemonBossInfo(req.zid, req.zuid, info, callback);
                },

                function (callback) {
                    /* 更新天魔血量  */
                    rcd.demonBoss[rcd.bossIndex].hpLeft = info.hpLeft;
                    demonBossDb.setDemonBossRcd(req.zid, info.finderId, rcd, callback);
                },

                /* 更新任务进度 */
                function (callback) {
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_22, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_22, 0, 0, 1);

                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 19, 1);
                    
                    callback(null);
                }
            ],function(err) {
                if(err && err != retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_DemonBossStart;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 退出天魔副本
 */
var CS_DemonBossResult = (function() {

    /**
     * 构造函数
     */
    function CS_DemonBossResult() {
        this.reqProtocolName = packets.pCSDemonBossResult;
        this.resProtocolName = packets.pSCDemonBossResult;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DemonBossResult.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DemonBossResult();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
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

            var info = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取当前攻击的天魔信息 */
                function(callback) {
                    demonBossDb.getFightDemonBossInfo(req.zid, req.zuid, callback);
                },

                /* 获取发现者的tid */
                function (fightDemonBossInfo, callback) {
                    playerDb.getPlayerData(req.zid, fightDemonBossInfo.finderId, false, function (err, player) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.finderTid = player.character.tid;
                        callback(null, fightDemonBossInfo);
                    });
                },

                /* 删除攻击天魔记录 */
                function(fightDemonBossInfo, callback) {
                    info = fightDemonBossInfo;
                    demonBossDb.delFightDemonBossInfo(req.zid, req.zuid);
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 检查伤害输出 */
                function (player, callback) {
                    battleCheckManager.checkPlug('battle_check_demon_boss', req.zid, req.zuid, '', 0, 2, info.damageOutput, callback);
                },

                /* 获取伤害输出和功勋 */
                function (callback) {
                    demonBossDb.getDamageOutputAndMerit(req.zid, req.zuid, callback);
                },

                /* 更新伤害输出和功勋 */
                function(doam, callback) {
                    if(info.damageOutput > doam.damageOutput) {
                        doam.damageOutput = info.damageOutput;
                    }
                    var meritAdd = parseInt(info.damageOutput / 1000) * info.meritTimes;
                    doam.merit += meritAdd;

                    /* 设置返回值 */
                    res.merit = meritAdd;
                    res.battleAchv = info.battleAchv;
                    
                    demonBossDb.updateDamageOutputRank(req.zid, req.zuid, doam.damageOutput, function() {});
                    demonBossDb.updateMeritRank(req.zid, req.zuid, doam.merit, function() {});
                    demonBossDb.setDamageOutputAndMerit(req.zid, req.zuid, doam, callback);
                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 27, doam.merit);
                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 28, doam.damageOutput);
                },

                /* 发放奖励，更新任务进度 */
                function(callback) {
                    /* 五个元宝 */
                    var item = new globalObject.ItemBase();
                    item.itemId = -1;
                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                    item.itemNum = 5;

                    /* 击杀者获得元宝 */
                    if(info.hpLeft <= 0) {
                        /* 创建击杀者奖励邮件 */
                        var mailInfoKiller = new sendMail.MailInfo();
                        mailInfoKiller.zid = req.zid;
                        mailInfoKiller.uid = req.zuid;
                        mailInfoKiller.mailTitle = csvManager.MailString()[4].MAIL_TITLE;
                        mailInfoKiller.mailContent = csvManager.MailString()[4].MAIL_WORD;
                        mailInfoKiller.items.push(item);
                        sendMail.sendMail(mailInfoKiller);

                        var mailInfoFinder = new sendMail.MailInfo();
                        mailInfoFinder.zid = req.zid;
                        mailInfoFinder.uid = info.finderId;
                        mailInfoFinder.mailTitle = csvManager.MailString()[5].MAIL_TITLE;
                        mailInfoFinder.mailContent = csvManager.MailString()[5].MAIL_WORD;
                        mailInfoFinder.items.push(item);
                        sendMail.sendMail(mailInfoFinder);
                        /* 更新任务进度 */
                        cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_16, 0, 1);
                        cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_16, 0, 0, 1);
                    }
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_demon_boss, preZid, req.channel, req.zuid, req.zuid, info.finderId, info.bossIndex,0, 0, info.hpLeft <= 0 ? 1 : 0, info.damageOutput);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_DemonBossResult;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取伤害排行
 */
var CS_BossBattleDamageRanklist = (function() {

    /**
     * 构造函数
     */
    function CS_BossBattleDamageRanklist() {
        this.reqProtocolName = packets.pCSBossBattleDamageRanklist;
        this.resProtocolName = packets.pSCBossBattleDamageRanklist;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BossBattleDamageRanklist.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BossBattleDamageRanklist();
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

                /* 获取自己的排名 */
                function(callback) {
                    demonBossDb.getDamageOutputRankIndex(req.zid, req.zuid, callback);
                },

                /* 赋值自己的名次 */
                function(index, callback) {
                    res.myRanking = index;
                    callback(null);
                },

                /*获取前5名的player的id*/
                function(callback) {
                    demonBossDb.getDamageOutputRank(req.zid, 0, 4, callback);
                },

                /* 赋值排行榜 */
                function(rankList, callback) {
                    if(rankList == null) {
                        callback(null);
                    }

                    var i = 0;
                    var len = rankList.length;
                    async.whilst(
                        function() {return i < len; },
                        function(cb) {
                            playerDb.getPlayerData(req.zid, rankList[i], false, function(err, player) {
                                if(err) {
                                    cb(err);
                                    return;
                                }
                                var rankObj = new protocolObject.DamageRanklistObject();
                                rankObj.nickname = player.name; /* 昵称 */
                                rankObj.playerId = rankList[i]; /* 用户ID */
                                rankObj.power = player.power; /* 战斗力 */
                                rankObj.headIconId = player.character.tid; /* 头像Id */
                                rankObj.ranking = i/2+1; /* 排名 */
                                rankObj.vipLv = player.vipLevel; /* VIP等级 */
                                rankObj.damage = rankList[i+1]*(-1); /* 伤害值 */
                                i+=2;

                                res.ranklist.push(rankObj);
                                cb(null);
                            });
                        },
                        function(err) {
                            callback(err);
                        }
                    );
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
    return CS_BossBattleDamageRanklist;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取功勋排行
 */
var CS_BossBattleFeatsRanklist = (function() {

    /**
     * 构造函数
     */
    function CS_BossBattleFeatsRanklist() {
        this.reqProtocolName = packets.pCSBossBattleFeatsRanklist;
        this.resProtocolName = packets.pSCBossBattleFeatsRanklist;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_BossBattleFeatsRanklist.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_BossBattleFeatsRanklist();
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

                /* 获取自己的排名 */
                function(callback) {
                    demonBossDb.getMeritRankIndex(req.zid, req.zuid, callback);
                },

                /* 赋值自己的名次 */
                function(index, callback) {
                    res.myRanking = index;
                    callback(null);
                },

                /*获取前5名的player的id*/
                function(callback) {
                    demonBossDb.getMeritRank(req.zid, 0, 4, callback);
                },

                /* 赋值排行榜 */
                function(rankList, callback) {
                    if(rankList == null) {
                        callback(null);
                    }

                    var i = 0;
                    var len = rankList.length;
                    async.whilst(
                        function() {return i < len; },
                        function(cb) {
                            playerDb.getPlayerData(req.zid, rankList[i], false, function(err, player) {
                                if(err) {
                                    cb(err);
                                    return;
                                }
                                var rankObj = new protocolObject.FeatsRanklistObject();
                                rankObj.nickname = player.name; /* 昵称 */
                                rankObj.playerId = rankList[i]; /* 用户ID */
                                rankObj.power = player.power; /* 战斗力 */
                                rankObj.headIconId = player.character.tid; /* 头像Id */
                                rankObj.ranking = i/2+1; /* 排名 */
                                rankObj.vipLv = player.vipLevel; /* VIP等级 */
                                rankObj.feats = rankList[i+1]*(-1); /* 伤害值 */
                                i+=2;

                                res.ranklist.push(rankObj);
                                cb(null);
                            });
                        },
                        function(err) {
                            callback(err);
                        }
                    );
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
    return CS_BossBattleFeatsRanklist;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取功勋奖励
 */
var CS_ReceiveMeritAward = (function() {

    /**
     * 构造函数
     */
    function CS_ReceiveMeritAward() {
        this.reqProtocolName = packets.pCSReceiveMeritAward;
        this.resProtocolName = packets.pSCReceiveMeritAward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ReceiveMeritAward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ReceiveMeritAward();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.awardIndex) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.awardIndex = parseInt(req.awardIndex);

            if(isNaN(req.zid) || isNaN(req.awardIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var characterLevel = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function (callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);

                },
                /* 获取功勋 */
                function(player, callback) {
                    characterLevel = player.character.level;
                    demonBossDb.getDamageOutputAndMerit(req.zid, req.zuid, callback);
                },

                /* 检查功勋 */
                function(doam, callback) {
                    var line = csvManager.FeatAwardConfig()[req.awardIndex];
                    if(!line || line.AWARD_TYPE != 1) {
                        callback(retCode.ERR);
                        return;
                    }

                    if(doam.merit < line.FEAT_NEED) {
                        callback(retCode.MERIT_NOT_ENOUGH);
                        return;
                    }

                    /*  检查等级 */
                    if(line.LEVEL_MIN > characterLevel || line.LEVEL_MAX < characterLevel) {
                        callback(retCode.MERIT_LEVEL_ERROR);
                        return;
                    }

                    demonBossDb.updateMeritAwardList(req.zid, req.zuid, req.awardIndex, callback);
                },

                /* 检查领取列表 */
                function(receiveCnt, callback) {
                    if(receiveCnt == 0) { /* 奖励已领取 */
                        callback(retCode.ERR);
                        return;
                    }

                    var line = csvManager.FeatAwardConfig()[req.awardIndex];
                    var item = new globalObject.ItemBase();
                    item.itemId = -1;
                    item.tid = line.AWARD_ID;
                    item.itemNum = line.AWARD_NUM;
                    var arrAdd = [];
                    arrAdd.push(item);
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.RECEIVEMERITAWARD_LOGS, item.tid, function(err, retAdd) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.featAddArr = retAdd;
                        callback(null);
                    });
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ReceiveMeritAward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取功勋奖励记录
 */
var CS_GetMeritAwardList = (function() {

    /**
     * 构造函数
     */
    function CS_GetMeritAwardList() {
        this.reqProtocolName = packets.pCSGetMeritAwardList;
        this.resProtocolName = packets.pSCGetMeritAwardList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetMeritAwardList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetMeritAwardList();
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
                    demonBossDb.getMeritAwardList(req.zid, req.zuid, callback);
                },

                function(arr, callback) {
                    res.arr = arr;
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetMeritAwardList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 改变天魔BOSS分享状态
 */
var CS_ChangeDemonBossShareState = (function() {

    /**
     * 构造函数
     */
    function CS_ChangeDemonBossShareState() {
        this.reqProtocolName = packets.pCSChangeDemonBossShareState;
        this.resProtocolName = packets.pSCChangeDemonBossShareState;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChangeDemonBossShareState.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChangeDemonBossShareState();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.state) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.state = parseInt(req.state);

            if(isNaN(req.zid) || isNaN(req.state)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(0 != req.state && 1 != req.state) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    var zid = req.zid;
                    var zuid = req.zuid;
                    var state = req.state;
                    async.waterfall([
                        /* 获取天魔对象 */
                        function(cb) {
                            demonBossDb.getDemonBossRcd(zid, zuid, cb);
                        },

                        /* change demonBoss share state */
                        function(rcd, cb) {
                            var demonBoss = cDemonBoss.getCurrentDemonBoss(rcd);
                            if(!demonBoss) {
                                cb(retCode.DEMON_NOT_EXISTS);
                                return;
                            }
                            demonBoss.ifShareWithFriend = state;
                            rcd.demonBoss[rcd.bossIndex] = demonBoss;
                            demonBossDb.setDemonBossRcd(zid, zuid, rcd, cb);
                        },

                        /* 更新通知 */
                        function (cb) {
                            if(state === 0) {
                                cb(null);
                                return;
                            }
                            friendDb.getFriendList(zid, zuid, function(err, friendList) {
                                if(err) {
                                    cb(null);
                                    return;
                                }
                                notifDb.addNotification(zid, zuid, cNotif.NOTIF_BOSS);
                                for(var i = 0; i < friendList.length; ++i) {
                                    notifDb.addNotification(zid, friendList[i], cNotif.NOTIF_BOSS);
                                }
                                cb(null);
                            });
                        }
                    ], callback);
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
    return CS_ChangeDemonBossShareState;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetDamageAndMerit());
    exportProtocol.push(new CS_GetDemonBossList());
    exportProtocol.push(new CS_DemonBossStart());
    exportProtocol.push(new CS_DemonBossResult());
    exportProtocol.push(new CS_BossBattleDamageRanklist());
    exportProtocol.push(new CS_BossBattleFeatsRanklist());
    exportProtocol.push(new CS_ReceiveMeritAward());
    exportProtocol.push(new CS_GetMeritAwardList());
    exportProtocol.push(new CS_ChangeDemonBossShareState());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

const COEFFICIENT_BASE = 10000;
/*
 * 返回技能伤害
 * @param [int] duration 战斗时长度
 * @param [int] petSkillCD 技能CD
 * @param [int] petSkillCoefficient 技能系数
 * return 伤害值
 */
var computePetActiveSkillDamage = function (pet, demonBoss, skillIndex) {
    var bossBirthConfig = csvManager.BossBirth()[demonBoss.bossBirthIndex];
    var duration = bossBirthConfig.BOSS_BATTLE_TIME;
    /**/
    var aoLine = csvManager.ActiveObject()[pet.tid];
    var skillId = aoLine['PET_SKILL_' + skillIndex];
    var skLine = null;
    if (skillId < 300000 || skillId >= 400000) { // 非BUFF类的技能
        skLine = csvManager.Skill()[skillId];
        return parseInt((duration / skLine.CD_TIME + 1)) * skLine.DAMAGE / COEFFICIENT_BASE;
    }
    return 0;
}

/*
 * 返回主角伤害值
 * @param {object} cirticalStrike 全力一击加成系数
 * @param {object} demonBoss 天魔信息
 * @param [object] pets 符灵战斗信息,下标为0的元素是主角
 * return 伤害值
 */
var computeLeaderDamage = function(cirticalStrike, demonBoss, pets) {
    var damage = 0;
    for(var i = 1; i < pets.length; i++) {
        var pet = pets[i];
        damage += computePetActiveSkillDamage(pet, demonBoss, 1);
    }
    /**/
    damage = computeDamage(pets[0], demonBoss, damage, cirticalStrike);
    // console.log('computeLeaderDamage: ' + damage);
    return damage;
}

/*
 * 返回符灵伤害值
 * @param {object} cirticalStrike 全力一击加成系数
 * @param {object} demonBoss 天魔信息
 * @param {object} pet 符灵战斗信息
 * return 伤害值
 */
var computePetDamage = function (cirticalStrike, demonBoss, pet) {
    var damage = computeDamage(pet, demonBoss, computePetActiveSkillDamage(pet, demonBoss, 2), cirticalStrike);
    // console.log('computePetDamage: ' + damage);
    return damage;
}

/*
 * 返回通用伤害计算公式所得伤害值
 * @param {object} leader 符灵或者主角
 * @param {object} demonBoss 天魔信息
 * @param {object} damageArg 符灵战斗信息
 * @param [int] damageActiveSkill 符灵主动技能伤害
 * return 伤害值
 */
var computeDamage = function (leader, demonBoss, damageActiveSkill, cirticalStrike) {
    var bossBirthConfig = csvManager.BossBirth()[demonBoss.bossBirthIndex];

    // console.log('attack: ' + leader.attack + ', bossBirthConfig.N_ATT_RATE: ' + bossBirthConfig.N_ATT_RATE + ', leader.criRt: ' + leader.criRt + ', leader.hitRt: ' + leader.hitRt + ', bossBirthConfig.BREAK_RATE: ' + bossBirthConfig.BREAK_RATE + ', bossBirthConfig.DOUBLE_RATE: ' + bossBirthConfig.DOUBLE_RATE);
    return parseInt(leader.attack * (bossBirthConfig.N_ATT_RATE / COEFFICIENT_BASE + damageActiveSkill) * (1 + Math.min(leader.criRt, bossBirthConfig.CRI_RATE_MAX) / COEFFICIENT_BASE + leader.hitRt / COEFFICIENT_BASE +
    ((leader.breakLevel + 1) * bossBirthConfig.BREAK_RATE / COEFFICIENT_BASE * (cirticalStrike === 2 ? bossBirthConfig.DOUBLE_RATE / COEFFICIENT_BASE : 1))));
}
