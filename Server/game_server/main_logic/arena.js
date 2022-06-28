
/**
 * 包含的头文件
 */
var packets = require('../packets/arena');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var arenaDb = require('../database/arena');
var globalObject = require('../../common/global_object');
var playerDb = require('../database/player');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var itemType = require('../common/item_type');
var cMission = require('../common/mission');
var logsWater = require('../../common/logs_water');
var cPlayer = require('../common/player');
var protocolObject = require('../../common/protocol_object');
var cRevelry = require('../common/revelry');
var redisKey = require('../../common/redis_key');
var timeUtil = require('../../tools/system/time_util');
var redisClient = require('../../tools/redis/redis_client');
var rand = require('../../tools/system/math').rand;
var robotCommon = require('../../common/robot');
var biCode = require('../../common/bi_code');
var battleSettlementManager = require('../common/battle_settlement/index');
var cZuid = require('../common/zuid');
var battleCheckManager = require('../common/battle_check/index');
var clevelCheck = require('../common/level_check');

var ARENA_BATTLE_RECORD_NUM_LIMIT = 50;
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 个人竞技场信息
 */
var CS_ArenaPrincipal = (function() {

    /**
     * 构造函数
     */
    function CS_ArenaPrincipal() {
        this.reqProtocolName = packets.pCSArenaPrincipal;
        this.resProtocolName = packets.pSCArenaPrincipal;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ArenaPrincipal.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ArenaPrincipal();
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

            req.zid  = parseInt(req.zid );

            if(false || isNaN(req.zid )) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;

                    arenaDb.getArenaWarrior(zid, uid, false, function (err, warrior) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        getWarriorNotRobotDetail(zid, warrior, function (err, arenaWarrior) {
                            if(!!err) {
                                callback(err);
                                return;
                            }
                            res.arenaPrincipal = arenaWarrior;
                            callback(null);
                        });
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
    return CS_ArenaPrincipal;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 竞技场挑战玩家列表
 */
var CS_ArenaChallengeList = (function() {

    /**
     * 构造函数
     */
    function CS_ArenaChallengeList() {
        this.reqProtocolName = packets.pCSArenaChallengeList;
        this.resProtocolName = packets.pSCArenaChallengeList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ArenaChallengeList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ArenaChallengeList();
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

            req.zid  = parseInt(req.zid );

            if(false || isNaN(req.zid )) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;

                    async.series({
                        getArenaPrincipal: function (cb) {
                            arenaDb.getArenaWarrior(zid, uid, false, function (err, warrior) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                getWarriorNotRobotDetail(zid, warrior, function (err, arenaPrincipal) {
                                    if(!!err) {
                                        cb(err);
                                        return;
                                    }
                                    res.arenaPrincipal = arenaPrincipal;
                                    cb(null);
                                });
                            });
                        },

                        getArenaChallengeList: function (cb) {
                            getArenaChallengeList(zid, uid, function (err, arenaChallengeList) {
                                if(!!err) {
                                    cb(err)
                                    return;
                                }
                                res.arenaChallengeList = arenaChallengeList;
                                cb(null);
                            });
                        }
                    }, function (err) {
                        if(!!err) {
                            callback(err);
                            return;
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
    return CS_ArenaChallengeList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 竞技场战斗开始
 */
var CS_ArenaBattleStart = (function() {

    /**
     * 构造函数
     */
    function CS_ArenaBattleStart() {
        this.reqProtocolName = packets.pCSArenaBattleStart;
        this.resProtocolName = packets.pSCArenaBattleStart;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ArenaBattleStart.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ArenaBattleStart();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.rivalRank) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.rivalRank = parseInt(req.rivalRank);

            if(false || isNaN(req.zid) || isNaN(req.rivalRank)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var rankPrincipal = 0;
            var rivalUid = 'robot';
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;
                    var rivalRank = req.rivalRank;

                    var warriorPrincipal = null;
                    var warriorRival = null;
                    var firstBattleMark = 0;
                    async.series({
                        getFirstBattleMark: function (cb) {
                            /* 是否是第一次进行竞技场战斗 */
                            arenaDb.getArenaWarriorFirstBattle(zid, uid, function (err, exist) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                firstBattleMark = exist;
                                cb(null);
                            });
                        },

                        check: function (cb) {
                            async.parallel({
                                checkRivalRankExist: function (cb) {
                                    /* 对手排名小于零,表示挑战的是机器人 */
                                    if(rivalRank < 0) {
                                        cb(null);
                                        return;
                                    }
                                    /* 第一次竞技场,挑战新手引导机器人 */
                                    if(!ifPassFirstBattle(firstBattleMark)) {
                                        cb(null);
                                        return;
                                    }
                                    arenaDb.getArenaWarriorRank(zid, rivalRank, function (err, data) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        rivalUid = data;
                                        cb(null);
                                    });
                                },

                                checkSpirit: function (cb) {
                                    playerDb.getPlayerData(zid, uid, false, function (err, player) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        if(player.spirit < csvManager.PvpLoot()[0].ROLE_EXP_AWARD_TIME) {
                                            cb(retCode.ARENA_LACK_OF_SPIRIT);
                                            return;
                                        }
                                        cb(null);
                                    });
                                },

                                checkRivalRankValid: function (cb) {
                                    /* 对手排名小于零,表示挑战的是机器人 */
                                    if(rivalRank < 0) {
                                        cb(null);
                                        return;
                                    }
                                    /* 第一次竞技场,挑战新手引导机器人 */
                                    if(!ifPassFirstBattle(firstBattleMark)) {
                                        cb(null);
                                        return;
                                    }
                                    arenaDb.getArenaWarrior(zid, uid, true, function (err, warrior) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        warriorPrincipal = warrior;
                                        rankPrincipal = warrior.curRank;
                                        if(rankPrincipal === rivalRank) {
                                            cb(retCode.ARENA_CAN_NOT_CHALLENGE_SELF);
                                            return;
                                        }
                                        /* */
                                        var step = 0;
                                        var rankBefore = 10;
                                        /*  */
                                        if(rankPrincipal < 49) {
                                            step = 1;
                                        }
                                        else if(rankPrincipal >= 49 && rankPrincipal < 100) {
                                            step = 2;
                                        }
                                        else {
                                            step = parseInt(0.02 * rankPrincipal);
                                        }
                                        /*  */
                                        if(rivalRank < (rankPrincipal - step * rankBefore)) {
                                            cb(retCode.ARENA_RANK_NOT_MATCH);
                                            return;
                                        }
                                        cb(null);
                                    });
                                }
                            }, cb)
                        },

                        getRivalDetail: function (cb) {
                            /* 对手排名小于零,表示挑战的是机器人 */
                            if(rivalRank < 0) {
                                arenaDb.getArenaCannonFodder(zid, uid, function (err, data) {
                                    if(!!err) {
                                        cb(err);
                                        return;
                                    }
                                    warriorRival = data;
                                    cb(null);
                                });
                                return;
                            }
                            /* 第一次竞技场,挑战新手引导机器人 */
                            if(!ifPassFirstBattle(firstBattleMark)) {
                                getArenaTutorialRival(function (err, data) {
                                    if(!!err) {
                                        cb(err);
                                        return;
                                    }
                                    warriorRival = data;
                                    cb(null);
                                });
                                return;
                            }
                            if(robotCommon.checkIfRobot(rivalUid)) {
                                arenaDb.getArenaRobot(rivalUid, function (err, data) {
                                    if(!!err) {
                                        cb(err);
                                        return;
                                    }
                                    warriorRival = data;
                                    cb(null);
                                });
                                return;
                            }
                            if(!robotCommon.checkIfRobot(rivalUid)) {
                                cPlayer.getPlayerFightDetail(zid, rivalUid, function (err, data) {
                                    if(!!err) {
                                        cb(err);
                                        return;
                                    }
                                    warriorRival = data;
                                    cb(null);
                                });
                                return;
                            }
                            cb(retCode.ARENA_INVALID_UID);
                        },

                        update: function (cb) {
                            async.parallel({
                                updateWarrior: function (cb) {
                                    /* 对手排名小于零,表示挑战的是机器人 */
                                    if(rivalRank < 0) {
                                        cb(null);
                                        return;
                                    }
                                    /* 第一次竞技场,挑战新手引导机器人 */
                                    if(!ifPassFirstBattle(firstBattleMark)) {
                                        cb(null);
                                        return;
                                    }
                                    warriorPrincipal.rivalRank = rivalRank;
                                    arenaDb.setArenaWarrior(zid, uid, true, warriorPrincipal, cb);
                                },

                                updateMission: function (cb) {
                                    cMission.updateDailyTask(zid, uid, cMission.TASK_TYPE_2, 0, 1);
                                    cMission.updateAchieveTask(zid, uid, cMission.TASK_TYPE_2, 0, 0, 1);
                                    cb(null);
                                }
                            }, function (err) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                cb(null);
                            });
                        }
                    }, function (err) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.rival = warriorRival;
                        res.rivalZuid = rivalUid + '';
                        callback(null);
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
                    logger.logBI(preZid, biCode.logs_arena, preZid, req.channel, req.zuid, req.zuid, 1, rankPrincipal, req.rivalRank, rivalUid, 0, '');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ArenaBattleStart;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 竞技场战斗结束
 */
var CS_ArenaBattleEnd = (function() {

    /**
     * 构造函数
     */
    function CS_ArenaBattleEnd() {
        this.reqProtocolName = packets.pCSArenaBattleEnd;
        this.resProtocolName = packets.pSCArenaBattleEnd;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ArenaBattleEnd.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ArenaBattleEnd();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.success
                || null == req.rivalRank) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.success = parseInt(req.success);
            req.rivalRank = parseInt(req.rivalRank);

            if(false || isNaN(req.zid) || isNaN(req.success) || isNaN(req.rivalRank)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var arenaPrincipal = null;
            var arenaRival = null;
            var rewards = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;
                    var success = req.success;
                    var rivalRank = req.rivalRank;

                    var consumes = [];
                    var allRewards = [];
                    var upRank = 0;
                    var rivalUid = 0;
                    var firstBattleMark = 0;
                    async.series({
                        getFirstBattleMark: function (cb) {
                            arenaDb.getArenaWarriorFirstBattle(zid, uid, function (err, exist) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                firstBattleMark = exist;
                                cb(null);
                            });
                        },

                        lockArenaRival: function (cb) {
                            async.series({
                                getArenaPrincipal: function (cb) {
                                    arenaDb.getArenaWarrior(zid, uid, true, function (err, data) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        arenaPrincipal = data;
                                        /* 对手排名小于零,表示挑战的是机器人 */
                                        if(rivalRank < 0) {
                                            cb(null);
                                            return;
                                        }
                                        /* 第一次竞技场,挑战新手引导机器人 */
                                        if(!ifPassFirstBattle(firstBattleMark)) {
                                            cb(null);
                                            return;
                                        }
                                        if(arenaPrincipal.rivalRank < 0) {
                                            cb(retCode.ARENA_NO_RANK);
                                            return;
                                        }
                                        cb(null);
                                    });
                                },

                                getRivalUid: function (cb) {
                                    /* 对手排名小于零,表示挑战的是机器人 */
                                    if(rivalRank < 0) {
                                        cb(null);
                                        return;
                                    }
                                    /* 第一次竞技场,挑战新手引导机器人 */
                                    if(!ifPassFirstBattle(firstBattleMark)) {
                                        cb(null);
                                        return;
                                    }
                                    arenaDb.getArenaWarriorRank(zid, arenaPrincipal.rivalRank, function (err, data) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        rivalUid = data;
                                        cb(null);
                                    });
                                }
                            }, cb);
                        },

                        checkPlug: function (cb) {
                            if(rivalRank < 0) {
                                cb(null);
                                return;
                            }
                            if(!ifPassFirstBattle(firstBattleMark)) {
                                cb(null);
                                return;
                            }
                            if(success === 0) {
                                cb(null);
                                return;
                            }
                            battleCheckManager.checkPlug('battle_check_arena', zid, uid, rivalUid, 0, 1, 0, cb);
                        },

                        compute: function (cb) {
                            async.series({
                                computeNormalReward: function (cb) {
                                    computeRewardsAndConsumes(zid, uid, success, function (err, consumesCb, rewardsCb) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        consumes = consumes.concat(consumesCb);
                                        rewards = rewards.concat(rewardsCb);
                                        cb(null);
                                    });
                                },

                                computeBreakReward: function (cb) {
                                    /* 对手排名小于零,表示挑战的是机器人,或者失败 */
                                    if(rivalRank < 0 || !success) {
                                        cb(null);
                                        return;
                                    }
                                    /* 第一次竞技场,挑战新手引导机器人 */
                                    if(!ifPassFirstBattle(firstBattleMark)) {
                                        cb(null);
                                        return;
                                    }
                                    async.series({
                                        getRivalInfo: function (cb) {
                                            if(!robotCommon.checkIfRobot(rivalUid)) {
                                                arenaDb.getArenaWarrior(zid, rivalUid, true, function (err, data) {
                                                    if(!!err) {
                                                        cb(err);
                                                        return;
                                                    }
                                                    arenaRival = data;
                                                    cb(null);
                                                });
                                                return;
                                            }
                                            if(robotCommon.checkIfRobot(rivalUid)) {
                                                arenaRival = new (globalObject.ArenaWarrior)();
                                                arenaRival.zid = zid;
                                                arenaRival.uid = rivalUid;
                                                arenaRival.bestRank = arenaPrincipal.rivalRank;
                                                arenaRival.curRank = arenaPrincipal.rivalRank;
                                                cb(null);
                                                return;
                                            }
                                            cb(retCode.ARENA_INVALID_UID);
                                        },

                                        computeBreakReward: function (cb) {
                                            if (arenaPrincipal.curRank < arenaRival.curRank) {
                                                cb(null);
                                                return;
                                            }
                                            /* 突破名次 */
                                            upRank = arenaPrincipal.curRank - arenaRival.curRank;
                                            /*  */
                                            if (arenaPrincipal.bestRank > arenaRival.curRank) {
                                                /* 名次突破奖励表 */
                                                var rankAward = csvManager.PvpRankAwardConfig();
                                                /* 突破奖励  */
                                                var awardSingle = 0;
                                                for (var i in rankAward) {
                                                    if (arenaRival.curRank >= rankAward[i].RANK_MIN
                                                        && arenaRival.curRank <= rankAward[i].RANK_MAX) {
                                                        awardSingle = rankAward[i].GOLD_AWARD_BY_RANK;
                                                    }
                                                }
                                                /* 添加突破奖励*/
                                                if (awardSingle) {
                                                    var item = new protocolObject.ItemObject();
                                                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                                                    item.itemNum = awardSingle * upRank;
                                                    rewards.push(item);
                                                }
                                                /* update best rank */
                                                arenaPrincipal.bestRank = arenaRival.curRank;
                                                /* 开服狂欢 */
                                                cRevelry.updateRevelryProgress(req.zid, req.zuid, 6, arenaRival.curRank + 1);
                                            }
                                            /* exchange rank*/
                                            var tmp = arenaPrincipal.curRank;
                                            arenaPrincipal.curRank = arenaRival.curRank;
                                            arenaRival.curRank = tmp;
                                            /* */
                                            cb(null);
                                        }
                                    }, cb);
                                }
                            }, cb);
                        },

                        update: function (cb) {
                            async.series({
                                updateItems: function (cb) {
                                    cPackage.smartUpdateItemWithLog(zid, uid, consumes, rewards, req.channel, req.acc, logsWater.CHALLENGERESULT_LOGS, rivalUid, function (err, retAdd) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        allRewards = retAdd;
                                        cb(null);
                                    });
                                },

                                updateRank: function (cb) {
                                    if(rivalRank < 0) {
                                        cb(null);
                                        return;
                                    }
                                    if(!ifPassFirstBattle(firstBattleMark)) {
                                        cb(null);
                                        return;
                                    }
                                    arenaPrincipal.rivalRank = -1;
                                    if(upRank > 0) {
                                        arenaDb.exchangeArenaRank(zid, arenaPrincipal, arenaRival, cb);
                                        return;
                                    }
                                    arenaDb.setArenaWarrior(zid, uid, true, arenaPrincipal, cb);
                                },
                                
                                updateBattleRecord: function (cb) {
                                    if(rivalRank < 0 || robotCommon.checkIfRobot(rivalUid)) {
                                        cb(null);
                                        return;
                                    }
                                    if(!ifPassFirstBattle(firstBattleMark)) {
                                        cb(null);
                                        return;
                                    }
                                    /* 记录战报 */
                                    var arenaBattleRecord = new (globalObject.ArenaBattleRecord)();
                                    arenaBattleRecord.rivalUid = uid;
                                    arenaBattleRecord.rankChange = - upRank;
                                    arenaBattleRecord.attackTime = parseInt((timeUtil.now()).getTime() / 1000);
                                    arenaDb.addArenaWarriorBattleRecord(zid, rivalUid, arenaBattleRecord, ARENA_BATTLE_RECORD_NUM_LIMIT, cb);
                                },
                                
                                setFirstBattle: function (cb) {
                                    if(ifPassFirstBattle(firstBattleMark)) {
                                        cb(null);
                                        return;
                                    }
                                    /* 玩家第一次战斗标记设置 */
                                    arenaDb.setArenaWarriorFirstBattle(zid, uid, cb);
                                }
                            }, cb);
                        }
                    }, function (err) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.rankChange = upRank;
                        res.rewards = allRewards;
                        res.addItems = rewards;
                        callback(null);
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
                    logger.logBI(preZid, biCode.logs_arena, preZid, req.channel, req.zuid, req.zuid, 2, arenaPrincipal.curRank, req.rivalRank, (arenaRival === null ? '-1' : arenaRival.uid), req.success, JSON.stringify(rewards));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ArenaBattleEnd;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取竞技场排行榜
 */
var CS_ArenaRankList = (function() {

    /**
     * 构造函数
     */
    function CS_ArenaRankList() {
        this.reqProtocolName = packets.pCSArenaRankList;
        this.resProtocolName = packets.pSCArenaRankList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ArenaRankList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ArenaRankList();
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

            if(false || isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;

                    var arenaPrincipal = null;
                    var challengeWarriorList = [];
                    var challengeWarriorListDetail = [];
                    async.series({
                        getarenaPrincipal: function (cb) {
                            arenaDb.getArenaWarrior(zid, uid, false, function (err, warrior) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                getWarriorNotRobotDetail(zid, warrior,  function (err, arenaWarrior) {
                                    if (!!err) {
                                        cb(err);
                                        return;
                                    }
                                    arenaPrincipal = arenaWarrior;
                                    cb(null);
                                });
                            });
                        },

                        getChallengeWarriorList: function (cb) {
                            var rankRange = [];
                            for(var i = 0; i < 50; ++i) {
                                rankRange.push(i);
                            }
                            async.each(rankRange, function(rank, cb) {
                                arenaDb.getArenaWarriorRank(zid, rank, function(err, warriorUid) {
                                    if (!!err) {
                                        cb(err);
                                        return;
                                    }
                                    challengeWarriorList.push({
                                        uid: warriorUid,
                                        curRank: rank
                                    });
                                    cb(null);
                                });
                            }, cb);
                        },

                        getChallengeWarriorListDetail: function (cb) {
                            getArenaWarriorListDetail(zid, challengeWarriorList, function (err, data) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                challengeWarriorListDetail = data;
                                cb(null);
                            });
                        }
                    }, function (err) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.arenaPrincipal = arenaPrincipal;
                        res.arenaRankList = challengeWarriorListDetail;
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
    return CS_ArenaRankList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 返回竞技场战斗记录
 */
var CS_ArenaBattleRecord = (function() {

    /**
     * 构造函数
     */
    function CS_ArenaBattleRecord() {
        this.reqProtocolName = packets.pCSArenaBattleRecord;
        this.resProtocolName = packets.pSCArenaBattleRecord;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ArenaBattleRecord.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ArenaBattleRecord();
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

            if(false || isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;

                    var beginIndex = 0;
                    var endIndex = ARENA_BATTLE_RECORD_NUM_LIMIT - 1;
                    arenaDb.getArenaWarriorBattleRecordBatch(zid, uid, beginIndex, endIndex, function (err, battleRecords) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        async.each(battleRecords, function (battleRecord, cb) {
                            playerDb.getPlayerData(zid, battleRecord.rivalUid, false, function (err, player) {
                                if(err) {
                                    cb(err);
                                    return;
                                }
                                battleRecord.tid = player.character.tid;
                                battleRecord.name = player.name;
                                battleRecord.level = player.character.level;
                                cb(null);
                            });
                        }, function (err) {
                            if(!!err) {
                                callback(err);
                                return;
                            }
                            res.arenaBattleRecord = battleRecords;
                            callback(null);
                        });
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
    return CS_ArenaBattleRecord;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 竞技场扫荡
 */
var CS_ArenaSweep = (function() {

    /**
     * 构造函数
     */
    function CS_ArenaSweep() {
        this.reqProtocolName = packets.pCSArenaSweep;
        this.resProtocolName = packets.pSCArenaSweep;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ArenaSweep.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ArenaSweep();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid ) {
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
                    var zid = req.zid;
                    var uid = req.zuid;

                    var success = 1;
                    async.series({
                        checkSpiritAndVip: function (cb) {
                            playerDb.getPlayerData(zid, uid, false, function (err, player) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                if(player.spirit < csvManager.PvpLoot()[0].ROLE_EXP_AWARD_TIME) {
                                    cb(retCode.ARENA_LACK_OF_SPIRIT);
                                    return;
                                }

                                if(!clevelCheck(player, 'arena')) {
                                    cb(retCode.LACK_OF_LEVEL);
                                    return;
                                }
                                cb(null);
                            });
                        },
                        
                        updateItems: function (cb) {
                            computeRewardsAndConsumes(zid, uid, success, function (err, consumes, rewards) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                res.addItems = rewards;
                                cPackage.smartUpdateItemWithLog(zid, uid, consumes, rewards,  req.channel, req.acc, logsWater.CHALLENGERESULT_LOGS, 0, function (err, retAdd) {
                                    if(!!err) {
                                        cb(err);
                                        return
                                    }
                                    res.rewards = retAdd;
                                    cb(null);
                                });
                            });
                        },

                        updateMission: function (cb) {
                            cMission.updateDailyTask(zid, uid, cMission.TASK_TYPE_2, 0, 1);
                            cMission.updateAchieveTask(zid, uid, cMission.TASK_TYPE_2, 0, 0, 1);
                            cb(null);
                        }
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
    return CS_ArenaSweep;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_ArenaPrincipal());
    exportProtocol.push(new CS_ArenaChallengeList());
    exportProtocol.push(new CS_ArenaBattleStart());
    exportProtocol.push(new CS_ArenaBattleEnd());
    exportProtocol.push(new CS_ArenaRankList());
    exportProtocol.push(new CS_ArenaBattleRecord());
    exportProtocol.push(new CS_ArenaSweep());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 函数区
 */

/**
 *  获取竞技场挑战列表
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [func] 返回错误码[int](retCode)和数据(获取竞技场挑战列表)
 */
var getArenaChallengeList = function (zid, uid, cb) {
    var challengeRankList = [{rank: 0, canBattle: 0}, {rank: 1, canBattle: 0}, {rank: 2, canBattle: 0}, {rank: 3, canBattle: 0}, {rank: 4, canBattle: 0},
        {rank: 5, canBattle: 0}, {rank: 6, canBattle: 0}, {rank: 7, canBattle: 0}, {rank: 8, canBattle: 0}, {rank: 9, canBattle: 0}];
    var challengeWarriorList = [];
    var challengeWarriorDetailList = [];
    var firstBattleMark = 0;
    var uidRank = 0;
    async.series({
        getArenaTutorial: function (cb) {
            arenaDb.getArenaWarriorFirstBattle(zid, uid, function (err, exist) {
                if(!!err) {
                    cb(err);
                    return;
                }
                firstBattleMark = exist;
                cb(null);
            });
        },

        getRivalRanks: function (cb) {
            /* 具体挑战列表规则看策划案 */
            arenaDb.getArenaWarrior(zid, uid, false, function (err, warrior) {
                if(!!err) {
                    cb(err);
                    return;
                }
                var step = 0;
                var rankBefore = 10;
                var rankAfter = 1;
                uidRank = warrior.curRank;
                /*  */
                if(uidRank < 49) {
                    step = 1;
                }
                else if(uidRank >= 49 && uidRank < 100) {
                    step = 2;
                }
                else {
                    step = parseInt(0.02 * uidRank);
                }
                /*  */
                var rankChallengeMin = uidRank - (step * rankBefore);
                if(rankChallengeMin < 0 ) {
                    rankBefore = parseInt(uidRank / step);
                    rankAfter += parseInt(Math.abs(rankChallengeMin) / step);
                }
                var rankMin = uidRank - (step * rankBefore);
                var rankMax = uidRank + (step * rankAfter);
                for(var rank = rankMin; rank <= rankMax; rank += step) {
                    if(rank <= 9 && rank !== uidRank) {
                        challengeRankList[rank].canBattle = 1;
                        continue;
                    }
                    if(rank > 9) {
                        if (rank === uidRank) {
                            challengeRankList.push({rank: rank, canBattle: 0});
                            continue;
                        }
                        challengeRankList.push({rank: rank, canBattle: 1});
                    }
                }
                cb(null);
            });
        },

        getRivalUids: function (cb) {
            async.each(challengeRankList, function (rank, cb) {
                arenaDb.getArenaWarriorRank(zid, rank.rank, function (err, warriorUid) {
                    if(!!err) {
                        if(err === retCode.ARENA_NO_RANK) { /* 玩家的后面一名玩家不存在 */
                            cb(null);
                            return;
                        }
                        cb(err);
                        return;
                    }
                    challengeWarriorList.push({
                        uid: warriorUid,
                        curRank: rank.rank,
                        canBattle: rank.canBattle
                    });
                    cb(null);
                });
            }, function (err) {
                if(!!err) {
                    cb(err);
                    return;
                }
                cb(null);
            });
        },

        getArenaChallengListDetail: function (cb) {
            getArenaWarriorListDetail(zid, challengeWarriorList, function (err, data) {
                if(!!err) {
                    cb(err);
                    return;
                }
                challengeWarriorDetailList = data;
                cb(null);
            });
        },

        changePrincipalRank: function (cb) {
            /* 第一次进行战斗,挑战列表中玩家本人的排名显示要比实际低一位,玩家的排名由一位新手引导机器人占用 */
            if(ifPassFirstBattle(firstBattleMark)) {
                cb(null);
                return;
            }
            for(var i = challengeWarriorDetailList.length - 1; i >= 0; i--) {
                if(challengeWarriorDetailList[i].uid === uid) {
                    challengeWarriorDetailList[i].rank += 1;
                    challengeWarriorDetailList[i].bestRank += 1;
                    cb(null);
                    return;
                }
            }
            cb(null);
        },

        addTurorialArenaRival: function (cb) {
            /* 添加新手引导机器人,如果不是第一次进行竞技场战斗,没有这个机器人 */
            if(ifPassFirstBattle(firstBattleMark)) {
                cb(null);
                return;
            }
            var robotConfig = csvManager.RobotConfig()[5002];
            if(undefined === robotConfig || null === robotConfig) {
                cb(retCode.ARENA_ROBOT_CONFIG_CANNON_FODDER_NOT_EXIST);
                return;
            }
            var arenaRobot = new (protocolObject.ArenaWarrior)();
            var activeObjectConfig = csvManager.ActiveObject()[robotConfig.ROLE_ID];
            if(null === activeObjectConfig || undefined === activeObjectConfig) {
                cb(retCode.TID_NOT_EXIST);
                return;
            }
            arenaRobot.name = activeObjectConfig.NAME;
            arenaRobot.level = robotConfig.ROLE_LEVEL;
            arenaRobot.rank = uidRank;
            arenaRobot.bestRank = uidRank;
            arenaRobot.power = robotConfig.COMBAT;
            arenaRobot.uid = '-10000';
            arenaRobot.vipLevel = 0;
            arenaRobot.tid = robotConfig.ROLE_ID;
            arenaRobot.canBattle = 1;
            for(var i = 1; i <= 3; i++) {
                var petTid = rand(robotConfig['PETID_MIN_' + i],  robotConfig['PETID_MAX_' + i]);
                if(petTid > 0) {
                    arenaRobot.pets.push(petTid);
                }
            }
            challengeWarriorDetailList.push(arenaRobot);
            cb(null);
        },

        sortByRank: function (cb) {
            /* 按照竞技场排名对挑战列表按从高到底的顺序进行排列 */
            async.sortBy(challengeWarriorDetailList, function (warriorDetail, cb) {
                cb(null, warriorDetail.rank);
            }, function (err, data) {
                if(!!err) {
                    cb(err);
                    return;
                }
                challengeWarriorDetailList = data;
                cb(null);
            });
        },

        addCannonFodder: function (cb) {
            /* 在竞技场挑战列表最后添加机器人 */
            /* generate robot fight detail*/
            robotCommon.createRobotFightDetail(5001, function (err, playerFD) {
                if(!!err) {
                    cb(err);
                    return;
                }
                arenaDb.setArenaCannonFodder(zid, uid, playerFD, function (err) {
                    if(!!err) {
                        cb(err);
                        return;
                    }
                    /* generate challenge robot detail */
                    var arenaRobot = new (protocolObject.ArenaWarrior)();
                    arenaRobot.name = playerFD.name;
                    arenaRobot.level = playerFD.level;
                    arenaRobot.rank = -1;
                    arenaRobot.bestRank = -1;
                    arenaRobot.power = playerFD.power;
                    arenaRobot.uid = 0;
                    arenaRobot.vipLevel = 0;
                    arenaRobot.tid = playerFD.petFDs[0].tid + '';
                    for(var i = 1; i < playerFD.petFDs.length; ++i) {
                        var petTid = playerFD.petFDs[i].tid;
                        arenaRobot.pets.push(petTid);
                    }
                    arenaRobot.canBattle = 1;
                    challengeWarriorDetailList.push(arenaRobot);
                    cb(null);
                });
            });
        }
    }, function (err) {
        if(!!err) {
            cb(err);
            return;
        }  
        cb(null, challengeWarriorDetailList);
    });
}

/**
 *  获取竞技场战斗人员详细信息
 * @param zid [int] 区ID
 * @param arenaWarriorList [] 竞技场战斗人员信息(只包含竞技场排名和用户ID)
 * @param cb [func] 返回错误码[int](retCode)和数据(竞技场战斗人员详细信息)
 */
var getArenaWarriorListDetail = function (zid, arenaWarriorList, cb) {
    var arenaWarriorListDetail = [];
    async.series({
        getArenaWarriorListDetail: function (cb) {
            async.each(arenaWarriorList, function(warrior, cb) {
                if(robotCommon.checkIfRobot(warrior.uid)) { /* 表示机器人 */
                    arenaDb.getArenaRobot(warrior.uid,  function(err, robot) {
                        if(!!err) {
                            cb(err);
                            return;
                        }
                        var arenaRobot = new (protocolObject.ArenaWarrior)();
                        arenaRobot.name = robot.name;
                        arenaRobot.level = robot.level;
                        arenaRobot.rank = warrior.curRank;
                        arenaRobot.bestRank = warrior.curRank;
                        arenaRobot.power = robot.power;
                        arenaRobot.uid = warrior.uid;
                        arenaRobot.vipLevel = 0;
                        arenaRobot.tid = robot.petFDs[0].tid + '';
                        for(var i = 1; i < robot.petFDs.length; i++) {
                            arenaRobot.pets.push(robot.petFDs[i].tid);
                        }
                        arenaRobot.canBattle = (warrior.canBattle === undefined ? 0 : warrior.canBattle);
                        arenaWarriorListDetail.push(arenaRobot);
                        cb(null);
                    });
                }
                else if(!robotCommon.checkIfRobot(warrior.uid)) { /* 表示真实玩家*/
                    async.series({
                        getWarrior: function (cb) {
                            arenaDb.getArenaWarrior(zid, warrior.uid, false, function (err, warriorCb) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                warrior.bestRank = warriorCb.bestRank;
                                cb(null);
                            });
                        },

                        getWarriorNotRobotDetail: function (cb) {
                            getWarriorNotRobotDetail(zid, warrior, function (err, arenaWarrior) {
                                if (!!err) {
                                    cb(err);
                                    return;
                                }
                                arenaWarriorListDetail.push(arenaWarrior);
                                cb(null);
                            });
                        }
                    }, cb)
                }
            }, function (err) {
                if(!!err) {
                    cb(err);
                    return;
                }
                cb(null);
            });
        },

        sortByRank: function (cb) {
            async.sortBy(arenaWarriorListDetail, function (warriorDetail, cb) {
                cb(null, warriorDetail.rank);
            }, function (err, data) {
                if(!!err) {
                    cb(err);
                    return;
                }
                arenaWarriorListDetail = data;
                cb(null);
            });
        }
    }, function (err) {
        if(!!err) {
            cb(err);
            return;
        }
        cb(null, arenaWarriorListDetail);
    });
}

/**
 *  获取竞技场战斗人员(非机器人)的详细信息(客户端需要显示的信息)
 * @param zid [int] 区ID
 * @param warrior {ArenaWarrior} 竞技场战斗人员结构体
 * @param cb [func] 返回错误码[int](retCode)和数据(竞技场战斗人员详细信息)
 */
var getWarriorNotRobotDetail = function (zid, warrior, cb) {
    var playerCommon = require('../common/player');
    playerDb.getPlayerData(zid, warrior.uid,  false, function(err, player) {
        if (!!err) {
            cb(err);
            return;
        }
        var arenaWarrior = new (protocolObject.ArenaWarrior)();
        arenaWarrior.name = player.name;
        arenaWarrior.level = player.character.level;
        arenaWarrior.rank = warrior.curRank;
        arenaWarrior.bestRank = warrior.bestRank;
        arenaWarrior.power = player.power;
        arenaWarrior.uid = warrior.uid;
        arenaWarrior.vipLevel = player.vipLevel;
        arenaWarrior.tid = player.character.tid + "";
        arenaWarrior.canBattle = (warrior.canBattle === undefined ? 0 : warrior.canBattle);
        playerCommon.getPetsInBattle(zid, warrior.uid, function(err, pets) {
            if(!!err) {
                cb(err);
                return;
            }
            for(var i = 0; i < pets.length; i++) {
                arenaWarrior.pets.push(pets[i].tid);
            }
            cb(null, arenaWarrior);
        });
    });
}

/**
 *  计算默认的奖励和消耗
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param success [int] 战斗是否胜利
 * @param cb [func] 返回错误码[int](retCode)和数据(消耗和奖励)
 */
var computeRewardsAndConsumes = function (zid, uid, success, cb) {
    var consumes = [];
    var rewards = [];
    playerDb.getPlayerData(zid, uid, false, function (err, player) {
        if (!!err) {
            cb(err);
            return;
        }
        /*  */
        var pvpLoot = null;
        if (success) {
            var successTable = csvManager.PvpLoot();  /* 加入对character等级的判断 */
            for(var i in successTable) {
                if( successTable[i].LEVEL_MIN <= player.character.level && successTable[i].LEVEL_MAX >= player.character.level && successTable[i].VICTORY == success ){
                    pvpLoot = successTable[i];
                    break;
                }
            }
        }
        else {
            pvpLoot = csvManager.PvpLoot()[0];
        }
        if (undefined === pvpLoot || null === pvpLoot) {
            callback(retCode.TID_NOT_EXIST);
            return;
        }
        /* 扣掉精力 */
        var stamina = csvManager.PvpLoot()[0].ROLE_EXP_AWARD_TIME;
        var item = new protocolObject.ItemObject();
        item.tid = itemType.ITEM_TYPE_SPIRIT;
        item.itemNum = stamina;
        consumes.push(item);
        /* 银币*/
        var newItem = new protocolObject.ItemObject();
        newItem.tid = itemType.ITEM_TYPE_GOLD;
        newItem.itemNum = battleSettlementManager.coinSettlement('battle_settlement_arena', player.character.level, stamina);
        rewards.push(newItem);
        /* 声望 */
        newItem = new protocolObject.ItemObject();
        newItem.tid = itemType.ITEM_TYPE_REPUTATION;
        newItem.itemNum = pvpLoot.REPUTATION_AWARD;
        rewards.push(newItem);
        /* 经验 */
        newItem = new protocolObject.ItemObject();
        newItem.tid = itemType.ITEM_TYPE_EXP;
        newItem.itemNum = battleSettlementManager.expSettlement('battle_settlement_arena', player.character.level, stamina);
        rewards.push(newItem);
        /* 宝箱 */
        if (!success) {
            cb(null, consumes, rewards);
            return;
        }
        csvExtendManager.GroupIDConfig_DropId(pvpLoot.GROUP_AWARD, 1, function (err, arr) {
            if (!!err) {
                cb(err);
                return;
            }
            rewards.push(arr[0]);
            cb(null, consumes, rewards);
        });
    });
}

/**
 *  判断是否过了竞技场战斗新手指导
 */
var ifPassFirstBattle = function (exist) {
    if(exist === 1) {
        return true;
    }
    return false;
}

/**
 *  获取竞技场新手引导战斗的机器人战斗信息
 * @param cb [func] 返回错误码[int](retCode)和数据(机器人战斗信息)
 */
var getArenaTutorialRival = function (cb) {
    robotCommon.createRobotFightDetail(5002, function (err, robotFightDetail) {
        if(!!err) {
            cb(err);
            return;
        }
        var robotConfig = csvManager.RobotConfig()[5002];
        if(undefined === robotConfig || null === robotConfig) {
            cb(retCode.ARENA_ROBOT_CONFIG_CANNON_FODDER_NOT_EXIST);
            return;
        }
        var activeObjectConfig = csvManager.ActiveObject()[robotConfig.ROLE_ID];
        if(null === activeObjectConfig || undefined === activeObjectConfig) {
            cb(retCode.TID_NOT_EXIST);
            return;
        }
        robotFightDetail.name = activeObjectConfig.NAME;
        cb(null, robotFightDetail);
    });
}