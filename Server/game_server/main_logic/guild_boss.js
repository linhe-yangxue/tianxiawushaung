'user strict';
/**
 * 包含的头文件
 */
var packets = require('../packets/guild_boss');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var redisKey = require('../../common/redis_key');
var globalObject = require('../../common/global_object');
var guildDb = require('../database/guild');
var guildBossDatabase = require('../database/guild_boss');
var logger = require('../../manager/log4_manager');
var timeUtil = require('../../tools/system/time_util');
var itemType = require('../common/item_type');
var protocolObject = require('../../common/protocol_object');
var logsWater = require('../../common/logs_water');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var playerDb = require('../database/player');
var cMission = require('../common/mission');
var redisClient = require('../../tools/redis/redis_client');
var battleCheckManager = require('../common/battle_check/index');
var guildCommon = require('../common/guild_common');
var guildBossCommon = require('../common/guild_boss');

const GUILD_BOSS_INIT_START_TIME = {hours: 22, minutes: 0}; /* 公会BOSS初始化的开始时间 */
const GUILD_BOSS_INIT_END_TIME = {hours: 15, minutes: 30}; /* 公会BOSS初始化的结束时间 */
const GUILD_BOSS_BATTLE_LIMIT_TIMES = 5; /* 公会BOSS挑战次数限制 */
const GUILD_PRESIDENT_TITLE = 2; /* 公会会长 */

process.env.GUILD_BOSS_GOD_MODE = 'false';
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS请求 
 */
var CS_GuildBossInfo = (function() {

    /**
     * 构造函数
     */
    function CS_GuildBossInfo() {
        this.reqProtocolName = packets.pCSGuildBossInfo;
        this.resProtocolName = packets.pSCGuildBossInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildBossInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildBossInfo();
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

            var zid = req.zid;
            var uid = req.zuid;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    guildBossCommon.checkGuildId(zid, uid, res, callback);
                },

                function(guildId, callback) {
                    var gid = guildId;
                    async.parallel({
                        getGuildBossInfo: function (cb) {
                            guildBossDatabase.getGuildBoss(zid, gid, false, function (err, guildBoss) {
                                if (!!err) {
                                    cb(err);
                                    return;
                                }
                                cb(null, guildBoss);
                            })
                        },
                        getGuildBossWarriors: function (cb) {
                            guildBossDatabase.getGuildBossAllWarrior(zid, gid, function (err, guildBossWarriors) {
                                if (!!err) {
                                    cb(err);
                                    return;
                                }
                                cb(null, guildBossWarriors);
                            });
                        }
                    }, function (err, results) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.guildBoss = results.getGuildBossInfo;
                        res.guildBoss.warriors = results.getGuildBossWarriors;
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
    return CS_GuildBossInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS战斗开始
 */
var CS_GuildBossBattleStart = (function() {

    /**
     * 构造函数
     */
    function CS_GuildBossBattleStart() {
        this.reqProtocolName = packets.pCSGuildBossBattleStart;
        this.resProtocolName = packets.pSCGuildBossBattleStart;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildBossBattleStart.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildBossBattleStart();
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

            var zid = req.zid;
            var uid = req.zuid;

            var timeNow = timeUtil.now();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    guildBossCommon.checkGuildId(zid, uid, res, callback);
                },

                function(guildId, callback) {
                    var gid = guildId;
                    async.waterfall([
                        function (cb) {
                            guildBossCommon.checkBattleStart(zid, uid, gid, cb);
                        },

                        function (guildBossWarrior, cb) {
                            guildBossWarrior.battleStartTime = parseInt(timeNow.getTime() / 1000);
                            guildBossDatabase.setGuildBossWarrior(zid, gid, uid, guildBossWarrior, cb);
                        }
                    ], function(err) {
                        callback(err);
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
    return CS_GuildBossBattleStart;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS战斗结束
 */
var CS_GuildBossBattleEnd = (function() {

    /**
     * 构造函数
     */
    function CS_GuildBossBattleEnd() {
        this.reqProtocolName = packets.pCSGuildBossBattleEnd;
        this.resProtocolName = packets.pSCGuildBossBattleEnd;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildBossBattleEnd.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildBossBattleEnd();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.damage) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.damage = parseInt(req.damage);

            if(false || isNaN(req.zid) || isNaN(req.damage)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var zid = req.zid;
            var uid = req.zuid;
            var damage = req.damage;

            var guildBoss = null;
            var guildBossWarrior = null;
            var guildBossConfig = null;
            var stageInfoConfig = null;
            var rewards = [];
            var consumes = [];
            var addUnionContr = 0;
            var timeNow = timeUtil.now();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    guildBossCommon.checkGuildId(zid, uid, res, callback);
                },

                function(guildId, callback) {
                    var gid = guildId;
                    async.series({
                        checkPlug: function (cb) {
                            guildBossDatabase.getGuildBossWarrior(zid, gid, uid, function(err, warrior) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                guildBossWarrior = warrior;
                                if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                                    cb(null);
                                    return;
                                }
                                var battleStartTime = guildBossWarrior.battleStartTime;
                                /* check plug */
                                battleCheckManager.checkPlug('battle_check_guild_boss', zid, uid, '', battleStartTime, 3, damage, cb);
                            })
                        },

                        handleGuildBoss: function(cb) {
                                async.series({
                                    getGuildBossInfo: function (cb) {
                                        guildBossDatabase.getGuildBoss(zid, gid, true, function (err, data) {
                                            if (err) {
                                                cb(err);
                                                return;
                                            }
                                            guildBoss = data;
                                            cb(null);
                                        });
                                    },

                                    getGuildBossConfig: function (cb) {
                                        guildBossConfig = csvManager.GuildBoss()[guildBoss.mid];
                                        if(null === guildBossConfig || undefined === guildBossConfig) {
                                            cb(retCode.GUILD_BOSS_NOT_EXIST);
                                            return;
                                        }
                                        cb(null);
                                    },

                                    getStageConfig: function(cb) {
                                        stageInfoConfig = csvManager.StageConfig()[guildBossConfig.STAGE_ID];
                                        if(null === stageInfoConfig || undefined === stageInfoConfig) {
                                            cb(retCode.GUILD_BOSS_STAGE_NOT_EXIST);
                                            return;
                                        }
                                        cb(null);
                                    },

                                    substractBossHealth: function (cb) {
                                        var originMonsterHealth = guildBoss.monsterHealth;
                                        guildBoss.monsterHealth -= damage;
                                        if(guildBoss.monsterHealth < 0) {
                                            addUnionContr += guildBossConfig.LASTHIT_CONTRIBUTE;
                                        }
                                        if (originMonsterHealth > 0 && guildBoss.monsterHealth <= 0) {
                                            guildBoss.criticalStrikeUID = uid;
                                            guildBoss.criticalStrikeTime = Date.now();
                                            async.parallel({
                                                /* 击杀增加公会经验值 */
                                                addGuildExp: function (cb) {
                                                    guildCommon.addGuildExp(zid, uid, guildBossConfig.GUILD_EXP, cb);
                                                },
                                                /* 记录击杀的公会BOSS */
                                                addKilledGuildBoss: function (cb) {
                                                    for(var i = 0; i < guildBoss.killedGuildBossIndex.length; i++) {
                                                        if(guildBoss.killedGuildBossIndex[i] === guildBoss.mid) {
                                                            cb(null);
                                                            return;
                                                        }
                                                    }
                                                    guildBoss.killedGuildBossIndex.push(guildBoss.mid);
                                                    cb(null);
                                                }
                                            }, function (err) {
                                                cb(err);
                                            });
                                            return;
                                        }
                                        cb(null);
                                    },

                                    updateGuildBoss: function (cb) {
                                        guildBossDatabase.setGuildBoss(zid, gid, true, guildBoss, cb);
                                    }
                                }, cb);
                        },

                        computeReward: function(cb) {
                            /* 挑战公会贡献 */
                            var unionContr = guildBossConfig.ATTACK_CONTRIBUTE;
                            addUnionContr += unionContr;
                            /* 金币掉落 */
                            var itemGold = new protocolObject.ItemObject();
                            itemGold.itemId = -1;
                            itemGold.tid = itemType.ITEM_TYPE_GOLD;
                            itemGold.itemNum = stageInfoConfig.BOSS_MONEY;
                            rewards.push(itemGold);
                            /* 经验增加 */
                            var energyCostConfig = csvManager.EnergyCost()[stageInfoConfig.TYPE];
                            var staminaNum = energyCostConfig === undefined ? 0 : energyCostConfig.ENERGY_COST;
                            var itemExp = new protocolObject.ItemObject();
                            itemExp.itemId = -1;
                            itemExp.tid = itemType.ITEM_TYPE_EXP;
                            itemExp.itemNum = staminaNum * 10; /* 体力消耗乘以10 */
                            rewards.push(itemExp);
                            /* 挑战掉落 */
                            var groupId = guildBossConfig.ATTACK_GROUP_ID;
                            csvExtendManager.GroupIDConfig_DropId(groupId, 1, function(err, items) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                rewards = rewards.concat(items);
                                cb(null);
                            });
                        },

                        update: function (cb) {
                            async.series({
                                updateItems: function(cb) {
                                    cPackage.updateItemWithLog(zid, uid, consumes, rewards, null, null, logsWater.BATTLEGUILDBOSSRESULT_LOGS, guildBossConfig.STAGE_ID, function(err, subArr, addArr) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        rewards = addArr;
                                        cb(null);
                                    });
                                },

                                update: function (cb) {
                                    async.parallel({
                                        updateGuildBossWarrior: function(cb) {
                                            guildBossWarrior.damage += damage;
                                            if(damage > guildBossWarrior.maxDamage) {
                                                guildBossWarrior.maxDamage = damage;
                                            }
                                            guildBossWarrior.totalChallengeTimes += 1;
                                            guildBossWarrior.leftBattleTimes -= 1;
                                            guildBossWarrior.battleEndTime = parseInt(timeNow.getTime() / 1000);
                                            guildBossDatabase.setGuildBossWarrior(zid, gid, uid, guildBossWarrior, cb);
                                        },

                                        updatePlayerData: function (cb) {
                                            playerDb.getPlayerData(zid, uid, true, function(err, player) {
                                                if(!!err) {
                                                    cb(err);
                                                    return;
                                                }
                                                player.unionContr += addUnionContr;
                                                playerDb.savePlayerData(zid, uid, player, true, cb);
                                            });
                                        },

                                        updateTask: function (cb) {
                                            cMission.updateDailyTask(zid, uid, cMission.TASK_TYPE_1, stageInfoConfig.TYPE, 1);
                                            cb(null);

                                        },

                                        updateAchieve: function(cb) {
                                            cMission.updateAchieveTask(zid, uid, cMission.TASK_TYPE_1, stageInfoConfig.TYPE, guildBossConfig.STAGE_ID, 1);
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
                                    cb(err);
                                    return;
                                }
                                cb(null);
                            });
                        }
                    }, function(err) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.guildBoss = guildBoss;
                        res.attr = rewards;
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
    return CS_GuildBossBattleEnd;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS领取奖励 
 */
var CS_GuildBossGetReward = (function() {

    /**
     * 构造函数
     */
    function CS_GuildBossGetReward() {
        this.reqProtocolName = packets.pCSGuildBossGetReward;
        this.resProtocolName = packets.pSCGuildBossGetReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildBossGetReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildBossGetReward();
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

            var zid = req.zid;
            var uid = req.zuid;

            var guildBossWarrior;
            var guildBossConfig;
            var rewards = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    guildBossCommon.checkGuildId(zid, uid, res, callback);
                },

                function(guildId, callback) {
                    var gid = guildId;
                    async.waterfall([
                        function (cb) {
                            guildBossCommon.checkGetReward(zid, uid, gid, cb);
                        },

                        function (guildBoss, guildBossWarriorCb, cb) {
                            guildBossWarrior = guildBossWarriorCb;
                            guildBossConfig = csvManager.GuildBoss()[guildBoss.mid];
                            if(undefined === guildBossConfig || null === guildBossConfig) {
                                cb(retCode.GUILD_BOSS_NOT_EXIST);
                                return;
                            }
                            var groupId = guildBossConfig.DEAD_GROUP_ID;
                            csvExtendManager.GroupIDConfig_DropId(groupId, 1, function(err, items) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                rewards = items;
                                cb(null);
                            });
                        },
                        
                        function (cb) {
                            async.parallel({
                                updateItems: function(cb) {
                                    cPackage.smartUpdateItemWithLog(zid, uid, [], rewards, null, null, logsWater.BATTLEGUILDBOSSGETBOSSDEADREWARD_LOGS, guildBossConfig.STAGE_ID, function(err, addArr) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        rewards = addArr;
                                        cb(null);
                                    });
                                },

                                updateWarriorGetRewardState: function(cb) {
                                    guildBossWarrior.rewardState = guildBossCommon.GUILD_BOSS_REWARD_STATE_HASE_GET;
                                    guildBossDatabase.setGuildBossWarrior(zid, gid, uid, guildBossWarrior, cb);
                                }
                            }, function (err) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                cb(null);
                            });
                        }
                    ], function (err) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.attr = rewards;
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
    return CS_GuildBossGetReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS初始化
 */
var CS_GuildBossInit = (function() {

    /**
     * 构造函数
     */
    function CS_GuildBossInit() {
        this.reqProtocolName = packets.pCSGuildBossInit;
        this.resProtocolName = packets.pSCGuildBossInit;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildBossInit.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildBossInit();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.mid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.mid = parseInt(req.mid);

            if(false || isNaN(req.zid) || isNaN(req.mid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var zid = req.zid;
            var uid = req.zuid;
            var mid = req.mid;

            var timeNow = timeUtil.now();
            var guildBossConfig = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    guildBossCommon.checkGuildId(zid, uid, res, callback);
                },

                function(guildId, callback) {
                    var gid = guildId;
                    async.series({
                        getGuildBossConfig: function (cb) {
                            guildBossConfig = csvManager.GuildBoss()[mid];
                            if(undefined === guildBossConfig || null === guildBossConfig) {
                                cb(retCode.GUILD_BOSS_NOT_EXIST);
                                return;
                            }
                            cb(null);
                        },

                        initGuildBoss: function(cb) {
                            var guildInfo = null;
                            var guildBoss = null;
                            async.series({
                                checkTime: function(cb) {
                                    guildBossDatabase.getGuildBoss(zid, gid, true, function (err, data) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        guildBoss = data;
                                        checkInitBossTime(function (err) {
                                            if(!!err) {
                                                /* check boss health */
                                                if(guildBoss.monsterHealth > 0) {
                                                    cb(retCode.GUILD_BOSS_NOT_DEAD);
                                                    return;
                                                }
                                            }
                                            cb(null);
                                        });
                                    });
                                },

                                checkPreGuildBossIndex: function (cb) {
                                    if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                                        cb(null);
                                        return;
                                    }
                                    var preGuildBossIndexNeed = guildBossConfig.EX_BOSS_ID;
                                    if(0 === preGuildBossIndexNeed) {
                                        cb(null);
                                        return;
                                    }
                                    var killedGuildBossIndex = guildBoss.killedGuildBossIndex;
                                    for(var i = 0; i < killedGuildBossIndex.length; i++) {
                                        if(killedGuildBossIndex[i] === preGuildBossIndexNeed) {
                                            cb(null);
                                            return;
                                        }
                                    }
                                    cb(retCode.GUILD_BOSS_PRE_GUILD_BOSS_NOT_KILLED_EVER);
                                },

                                checkPermission: function(cb) {
                                    guildDb.getGuildInfoByGid(zid, gid, false, function (err, guild) {
                                        if (err) {
                                            cb(err);
                                            return;
                                        }
                                        guildInfo = guild;
                                        if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                                            cb(null);
                                            return;
                                        }
                                        for (var i = 0; i < guild.member.length; ++i) {
                                            if (guild.member[i].title === GUILD_PRESIDENT_TITLE) {
                                                var presidentUid = guild.member[i].zuid;
                                                if(presidentUid !== uid) {
                                                    cb(retCode.GUILD_BOSS_INIT_NO_PERMISSION);
                                                    return;
                                                }
                                                break;
                                            }
                                        }
                                        cb(null);
                                    });
                                },

                                checkGuildLevel: function (cb) {
                                    if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                                        cb(null);
                                        return;
                                    }
                                    var guildLevel = guildInfo.level;
                                    var openGuildLevel = guildBossConfig.OPEN_GUILD_LEVEL;
                                    if(guildLevel < openGuildLevel) {
                                        cb(retCode.GUILD_BOSS_GUILD_LEVEL_REQUIRE_NOT_MEET);
                                        return;
                                    }
                                    cb(null);
                                },

                                initGuildBoss: function (cb) {
                                    if(timeNow.getHours() < guildBossCommon.GUILD_BOSS_BATTLE_START_TIME.hours) {
                                        guildBoss.gid = gid;
                                        guildBoss.mid = mid;
                                        guildBossCommon.getGuildBossHealth(mid, function (err, health) {
                                            if(!!err) {
                                                cb(err);
                                                return;
                                            }
                                            guildBoss.monsterHealth = health;
                                            guildBoss.criticalStrikeUID = 0;
                                            guildBoss.criticalStrikeTime = 0;
                                        });

                                    } else {
                                        guildBoss.nextMid = mid;
                                    }
                                    //
                                    guildBossDatabase.setGuildBoss(zid, gid, true, guildBoss, cb);
                                }
                            }, cb);
                        },

                        refreshGuildBossWarrior: function (cb) {
                            if(timeNow.getHours() < guildBossCommon.GUILD_BOSS_BATTLE_START_TIME.hours) {
                                guildBossDatabase.setGuildBossAllWarrior(zid, gid, {}, cb);
                                return;
                            }
                            cb(null);
                        }
                    }, function(err) {
                        callback(err);
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
    return CS_GuildBossInit;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS购买挑战次数
 */
var CS_GuildBossBuyBattleTimes = (function() {

    /**
     * 构造函数
     */
    function CS_GuildBossBuyBattleTimes() {
        this.reqProtocolName = packets.pCSGuildBossBuyBattleTimes;
        this.resProtocolName = packets.pSCGuildBossBuyBattleTimes;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildBossBuyBattleTimes.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildBossBuyBattleTimes();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.times) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.times = parseInt(req.times);

            if(false || isNaN(req.zid) || isNaN(req.times)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var zid = req.zid;
            var uid = req.zuid;
            var times = req.times;

            var player = null;
            var guildBoss = null;
            var guildBossWarrior = null;
            var guildBossConfig = null;
            var stageInfoConfig = null;
            var consumes = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    guildBossCommon.checkGuildId(zid, uid, res, callback);
                },

                function(guildId, callback) {
                    var gid = guildId;
                    async.series({
                        getGuildBossInfo: function (cb) {
                            guildBossDatabase.getGuildBoss(zid, gid, false, function (err, data) {
                                if (!!err) {
                                    cb(err);
                                    return;
                                }
                                guildBoss = data;
                                cb(null);
                            });
                        },

                        getGuildBossConfig: function (cb) {
                            guildBossConfig = csvManager.GuildBoss()[guildBoss.mid];
                            if(undefined === guildBossConfig || null === guildBossConfig) {
                                cb(retCode.GUILD_BOSS_NOT_EXIST);
                                return;
                            }
                            cb(null);
                        },

                        getStageConfig: function(cb) {
                            stageInfoConfig = csvManager.StageConfig()[guildBossConfig.STAGE_ID];
                            if(undefined === stageInfoConfig || null === stageInfoConfig) {
                                cb(retCode.GUILD_BOSS_STAGE_NOT_EXIST);
                                return;
                            }
                            cb(null);
                        },

                        getPlayer: function(cb) {
                            playerDb.getPlayerData(zid, uid, false, function (err, data) {
                                if (!!err) {
                                    cb(err);
                                    return;
                                }
                                player = data;
                                cb(null);
                            });
                        },

                        checkDiamond: function(cb) {
                            guildBossDatabase.getGuildBossWarrior(zid, gid, uid, function(err, data) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                guildBossWarrior = data;
                                if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                                    cb(null);
                                    return;
                                }
                                var guildBossPriceConfig = csvManager.GuildBossPrice()[guildBossWarrior.totalBuyChanllengeTimes + 1];
                                if(undefined === guildBossPriceConfig || null === guildBossPriceConfig) {
                                    cb(retCode.GUILD_BOSS_BUY_CHALLENGE_CHANCE_PRICE_NOT_EXIST);
                                    return;
                                }
                                var price = guildBossPriceConfig.PRICE;
                                var diamondConsume = price * times;
                                if(player.diamond < diamondConsume) {
                                    cb(retCode.LACK_OF_DIAMOND);
                                    return;
                                }
                                cb(null);
                            });
                        },

                        checkBuyChanceLimit: function (cb) {
                            if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
                                cb(null);
                                return;
                            }
                            var vipLevel = player.vipLevel;
                            var vipListConfig = csvManager.Viplist()[vipLevel];
                            if(undefined === vipListConfig || null ===  vipListConfig) {
                                cb(retCode.GUILD_BOSS_BUY_CHALLENGE_LIMIT_VIP_LIST_NOT_EXIST);
                                return;
                            }
                            var buyChanceLimit = vipListConfig.GUILD_BOSS_BUY_TIME;
                            if(guildBossWarrior.totalBuyChanllengeTimes > buyChanceLimit) {
                                cb(retCode.GUILD_BOSS_BUY_CHALLENGE_CHANCE_RUNOUT);
                                return;
                            }
                            cb(null);
                        },

                        computeConsume: function(cb) {
                            var guildBossPriceConfig = csvManager.GuildBossPrice()[guildBossWarrior.totalBuyChanllengeTimes + 1];
                            if(undefined === guildBossPriceConfig || null ===guildBossPriceConfig) {
                                cb(retCode.GUILD_BOSS_BUY_CHALLENGE_CHANCE_PRICE_NOT_EXIST);
                                return;
                            }
                            var price = guildBossPriceConfig.PRICE;
                            /* 钻石消耗 */
                            var itemDiamond = new protocolObject.ItemObject();
                            itemDiamond.itemId = -1;
                            itemDiamond.tid = itemType.ITEM_TYPE_DIAMOND;
                            itemDiamond.itemNum = price * times;
                            consumes.push(itemDiamond);
                            cb(null);
                        },

                        update: function (cb) {
                            async.parallel({
                                updateItems: function (cb) {
                                    cPackage.updateItemWithLog(zid, uid, consumes, [], null, null, logsWater.BATTLEGUILDBOSSBUYCHALLENGECHANCE_LOGS, guildBossConfig.STAGE_ID, function(err) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        cb(null);
                                    });
                                },

                                updateGuildBossWarrior: function (cb) {
                                    guildBossWarrior.totalBuyChanllengeTimes += 1;
                                    guildBossWarrior.leftBattleTimes += times;
                                    guildBossDatabase.setGuildBossWarrior(zid, gid, uid, guildBossWarrior, cb);
                                }
                            }, function(err) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                cb(null);
                            });
                        }
                    }, function(err) {
                        callback(err);
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
    return CS_GuildBossBuyBattleTimes;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取指定的公会BOSS的INDEX
 */
var SC_GuildBossInfoSimple = (function() {

    /**
     * 构造函数
     */
    function SC_GuildBossInfoSimple() {
        this.reqProtocolName = packets.pCSGuildBossInfoSimple;
        this.resProtocolName = packets.pSCGuildBossInfoSimple;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    SC_GuildBossInfoSimple.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildBossInfoSimple();
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

            var zid = req.zid;
            var uid = req.zuid;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    guildBossCommon.checkGuildId(zid, uid, res, callback);
                },

                function(guildId, callback) {
                    var gid = guildId;
                    async.parallel({
                        getGuildBoss: function(cb) {
                            guildBossDatabase.getGuildBoss(zid, gid, false, function(err, guildBoss) {
                                if(!!err) {
                                    if(retCode.GUILD_BOSS_NOT_EXIST !== err) {
                                        cb(err);
                                        return;
                                    }
                                    initDefaultGuildBoss(zid, gid, function (err, guildBoss) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        cb(null, guildBoss);
                                    });
                                    return;
                                }
                                cb(null, guildBoss);
                            });
                        },

                        getGuildBossWarrior: function(cb) {
                            guildBossDatabase.getGuildBossWarrior(zid, gid, uid, function(err, guildBossWarrior) {
                                if(!!err) {
                                    if(err !== retCode.GUILD_BOSS_WARRIOR_NOT_EXIST) {
                                        cb(err);
                                        return;
                                    }
                                    initDefaultGuildBossWarrior(zid, gid, uid, function(err, guildBossWarrior) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        cb(null, guildBossWarrior);
                                    });
                                    return;
                                }
                                cb(null, guildBossWarrior);
                            });
                        }
                    }, function (err, results) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.guildBossSimple = results.getGuildBoss;
                        res.guildBossWarrior = results.getGuildBossWarrior;
                        res.guildBossWarrior.name = '';
                        res.guildBossWarrior.pets = [];
                        res.guildBossWarrior.tid = -1;
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
    return SC_GuildBossInfoSimple;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GuildBossInfo());
    exportProtocol.push(new CS_GuildBossBattleStart());
    exportProtocol.push(new CS_GuildBossBattleEnd());
    exportProtocol.push(new CS_GuildBossGetReward());
    exportProtocol.push(new CS_GuildBossInit());
    exportProtocol.push(new CS_GuildBossBuyBattleTimes());
    exportProtocol.push(new SC_GuildBossInfoSimple());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 函数区
 */

/**
 * 检查是否到了指定BOSS的时间
 * cb [Func] : 回调函数
 */
var checkInitBossTime = function(cb)
{
    if(process.env.GUILD_BOSS_GOD_MODE === 'true') {
        cb(null);
        return;
    }
    var timeNow = timeUtil.now();
    if(!(timeNow > new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), GUILD_BOSS_INIT_START_TIME.hours, GUILD_BOSS_INIT_START_TIME.minutes) ||
        timeNow < new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), GUILD_BOSS_INIT_END_TIME.hours, GUILD_BOSS_INIT_END_TIME.minutes))) {
        cb(retCode.GUILD_BOSS_INIT_ERROR_TIME);
        return;
    }
    cb(null);
};


/**
 *  初始化默认的公会BOSS
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param cb [func] 返回错误码[int](retCode)和数据(公会BOSS信息)
 */
var initDefaultGuildBoss = function (zid, gid, cb) {
    var guildBoss =  new (globalObject.GuildBoss)();
    guildBoss.gid= gid;
    var guildBossAllConfig = csvManager.GuildBoss();
    for(var midKey in guildBossAllConfig) {
        guildBoss.mid = parseInt(midKey);
        break;
    }
    guildBossCommon.getGuildBossHealth(guildBoss.mid, function (err, health) {
        if(!!err) {
            cb(err);
            return;
        }
        guildBoss.monsterHealth = health;
        guildBossDatabase.setGuildBoss(zid, gid, false, guildBoss, function (err) {
            if(!!err) {
                cb(err);
                return;
            }
            cb(null, guildBoss);
        });
    });
}

/**
 *  初始化默认的公会BOSS战斗人员
 * @param zid [int] 区ID
 * @param gid [int] 公会ID
 * @param uid [int] 玩家ID
 * @param cb [func] 返回错误码[int](retCode)和数据(公会BOSS信息)
 */
var initDefaultGuildBossWarrior = function (zid, gid, uid, cb) {
    var guildBossWarrior = new (globalObject.GuildBossWarrior)();
    guildBossWarrior.gid = gid;
    guildBossWarrior.uid = uid;
    guildBossWarrior.leftBattleTimes = GUILD_BOSS_BATTLE_LIMIT_TIMES;
    guildBossDatabase.setGuildBossWarrior(zid, gid, uid, guildBossWarrior, function (err) {
        if(!!err) {
            cb(err);
            return;
        }
        cb(null, guildBossWarrior);
    });
}
