
/**
 * 包含的头文件
 */
var packets = require('../packets/daily_stage');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var logsCode = require('../../common/logs_code');
var dailyStageDb = require('../database/daily_stage');
var timeUtil = require('../../tools/system/time_util');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var playerDb = require('../database/player');
var itemType = require('../common/item_type');
var logsWater = require('../../common/logs_water');
var cMission = require('../common/mission');

process.env.DAILY_STAGE_GOD_MODE = 'false';
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日副本信息
 */
var CS_DailyStageInfo = (function() {

    /**
     * 构造函数
     */
    function CS_DailyStageInfo() {
        this.reqProtocolName = packets.pCSDailyStageInfo;
        this.resProtocolName = packets.pSCDailyStageInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DailyStageInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DailyStageInfo();
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

                    var timeNow = timeUtil.now();
                    var now = timeNow.getTime();
                    dailyStageDb.getAllDailyStage(zid ,uid, function (err, dailyStages) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        async.each(dailyStages, function (dailyStage, cb) {
                            if(timeNow.toDateString() !== (new Date(dailyStage.lastBattleTime)).toDateString()) {
                                dailyStage.battleTimes = 0;
                                dailyStage.lastBattleTime = now;
                                dailyStageDb.setDailyStage(zid, uid, dailyStage, cb);
                                return;
                            }
                            cb(null);
                        }, function (err) {
                            if(!!err) {
                                callback(err);
                                return;
                            }
                            res.dailyStage = dailyStages;
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
    return CS_DailyStageInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日副本战斗开始
 */
var CS_DailyStageBattleStart = (function() {

    /**
     * 构造函数
     */
    function CS_DailyStageBattleStart() {
        this.reqProtocolName = packets.pCSDailyStageBattleStart;
        this.resProtocolName = packets.pSCDailyStageBattleStart;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DailyStageBattleStart.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DailyStageBattleStart();
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

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;
                    var mid = req.mid;

                    var timeNow = timeUtil.now();
                    var now = timeNow.getTime();
                    var dailyStageConfig = null;
                    var player = null;
                    var dailyStage = null;
                    var dailyStageDetail = null;
                    async.series({
                        getDailyStageConfig: function(cb) {
                            dailyStageConfig = csvManager.DailyStageConfig()[mid];
                            if(undefined === dailyStageConfig || null === dailyStageConfig) {
                                cb(retCode.DAILY_STAGE_NOT_EXIST);
                                return;
                            }
                            cb(null);
                        },

                        getPlayer: function (cb) {
                            playerDb.getPlayerData(zid, uid, false, function(err, data) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                player = data;
                                cb(null);
                            });
                        },

                        checkConstant: function (cb) {
                            if(process.env.DAILY_STAGE_GOD_MODE === 'true') {
                                cb(null);
                                return;
                            }
                            async.parallel({
                                checkOpenLevel: function(cb) {
                                    if(dailyStageConfig.OPEN_LEVEL > player.character.level) {
                                        cb(retCode.DAILY_STAGE_PLAYER_LEVEL_NOT_ARRIVE);
                                        return;
                                    }
                                    cb(null);
                                },

                                checkStamina: function (cb) {
                                    if(player.stamina < dailyStageConfig.COST) {
                                        cb(retCode.LACK_OF_STAMINA);
                                        return;
                                    }
                                    cb(null);
                                },

                                checkOpenDay: function (cb) {
                                    checkOpenDay(timeNow, dailyStageConfig.OPEN_DAY, cb);
                                }
                            }, function (err) {
                                cb(err);
                            });
                        },

                        getDailyStage: function(cb) {
                            dailyStageDb.getDailyStage(zid, uid, dailyStageConfig.TYPE, function (err, data) {
                                if(!!err) {
                                    if(err === retCode.DAILY_STAGE_NOT_EXIST) {
                                        setDefaultDailyStage(zid, uid, dailyStageConfig.TYPE, now, function (err, data) {
                                            if(!!err) {
                                                cb(err);
                                                return;
                                            }
                                            dailyStage = data;
                                            cb(null);
                                        });
                                        return;
                                    }
                                    cb(err);
                                    return;
                                }
                                dailyStage = data;
                                cb(null);
                            });
                        },

                        getDailyStageDetail: function (cb) {
                            dailyStageDb.getDailyStageDetail(zid, uid, dailyStageConfig.INDEX, function (err, data) {
                                if(!!err) {
                                    if(err === retCode.DAILY_STAGE_DETAIL_NOT_EXIST) {
                                        setDefaultDailyStageDetail(zid, uid, dailyStageConfig.INDEX, now, function (err, data) {
                                            if(!!err) {
                                                cb(err);
                                                return;
                                            }
                                            dailyStageDetail = data;
                                            cb(null);
                                        });
                                        return;
                                    }
                                    cb(err);
                                    return;
                                }
                                dailyStageDetail = data;
                                cb(null);
                            });
                        },

                        checkRefresh: function(cb) {
                            var lastBattleTime = dailyStage.lastBattleTime;
                            if(timeNow.toDateString() !== (new Date(lastBattleTime)).toDateString()) {
                                dailyStage.battleTimes = 0;
                                dailyStage.lastBattleTime = now;
                                dailyStageDb.setDailyStage(zid, uid, dailyStage, cb);
                                return;
                            }
                            if(process.env.DAILY_STAGE_GOD_MODE === 'true') {
                                cb(null);
                                return;
                            }
                            if(dailyStageConfig.DAILY_ATTACK_NUM <= dailyStage.battleTimes) {
                                cb(retCode.DAILY_STAGE_BATTLE_CHANCE_RUNOUT);
                                return;
                            }
                            cb(null);
                        },

                        recordBattleStartTime: function (cb) {
                            dailyStageDetail.battleStartTime = parseInt(now / 1000);
                            dailyStageDb.setDailyStageDetail(zid, uid, dailyStageDetail, cb);
                        }
                    }, function(err) {
                        callback(err);
                    })
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
    return CS_DailyStageBattleStart;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日副本战斗结束
 */
var CS_DailyStageBattleEnd = (function() {

    /**
     * 构造函数
     */
    function CS_DailyStageBattleEnd() {
        this.reqProtocolName = packets.pCSDailyStageBattleEnd;
        this.resProtocolName = packets.pSCDailyStageBattleEnd;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DailyStageBattleEnd.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DailyStageBattleEnd();
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

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;
                    var mid = req.mid;

                    var dailyStageConfig = null;
                    var stageConfig = null;
                    var rewards = [];
                    var consumes = [];
                    var dailyStageDetail = null;
                    var timeNow = timeUtil.now();
                    async.series({
                        getDailyStageConfig: function(cb) {
                            dailyStageConfig = csvManager.DailyStageConfig()[mid];
                            if(undefined === dailyStageConfig || null === dailyStageConfig) {
                                cb(retCode.DAILY_STAGE_NOT_EXIST);
                                return;
                            }
                            cb(null);
                        },

                        getStageConfig: function (cb) {
                            stageConfig = csvManager.StageConfig()[dailyStageConfig.STAGE_ID];
                            if(undefined === stageConfig || null === stageConfig) {
                                cb(retCode.DAILY_STAGE_STAGE_NOT_EXIST);
                                return;
                            }
                            cb(null);
                        },

                        check: function (cb) {
                            async.parallel({
                                checkPlug: function (cb) {
                                    dailyStageDb.getDailyStageDetail(zid, uid, mid, function (err, data) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        dailyStageDetail = data;
                                        if(process.env.DAILY_STAGE_GOD_MODE === 'true') {
                                            cb(null);
                                            return;
                                        }
                                        var startTime = dailyStageDetail.battleStartTime;
                                        /* 外挂检测预留接口 */
                                        cb(null);
                                    });
                                }
                            }, function (err) {
                                cb(err);
                            });
                        },

                        compute: function (cb) {
                            async.parallel({
                                computeDropItemReward: function(cb) {
                                    getDropItem(dailyStageConfig.DROP_ITEM, function (err, items) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        rewards = rewards.concat(items);
                                        cb(null);
                                    });
                                },

                                computeComsume: function (cb) {
                                    /* 体力减少 */
                                    var itemEnergy = new protocolObject.ItemObject();
                                    itemEnergy.itemId = -1;
                                    itemEnergy.tid = itemType.ITEM_TYPE_STAMINA;
                                    itemEnergy.itemNum = dailyStageConfig.COST;
                                    consumes.push(itemEnergy);
                                    cb(null);
                                }
                            }, function (err) {
                                cb(err);
                            });
                        },
                        
                        update: function (cb) {
                            async.parallel({
                                updateRewards: function (cb) {
                                    cPackage.updateItemWithLog(zid, uid, consumes, rewards, null, null, logsWater.BATTLEDAILYSTAGE_LOGS, dailyStageConfig.STAGE_ID, function (err, retSub, retAdd) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        rewards = retAdd;
                                        cb(null);
                                    });
                                },

                                updateTask: function (cb) {
                                    cMission.updateDailyTask(zid, uid, cMission.TASK_TYPE_1, stageConfig.TYPE, 1);
                                    cb(null);

                                },

                                updateAchieve: function(cb) {
                                    cMission.updateAchieveTask(zid, uid, cMission.TASK_TYPE_1, stageConfig.TYPE, dailyStageConfig.STAGE_ID, 1);
                                    cb(null);
                                },

                                updateDailyStage: function (cb) {
                                    dailyStageDb.getDailyStage(zid, uid, dailyStageConfig.TYPE, function (err, dailyStage) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        dailyStage.battleTimes += 1;
                                        dailyStageDb.setDailyStage(zid, uid, dailyStage, cb);
                                    });
                                },

                                updateDailyStageDetail: function (cb) {
                                    dailyStageDetail.battleEndTime = parseInt(timeNow.getTime() / 1000);
                                    dailyStageDb.setDailyStageDetail(zid, uid, dailyStageDetail, cb);
                                }
                            }, function (err) {
                                cb(err);
                            });
                        }
                    }, function (err) {
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
    return CS_DailyStageBattleEnd;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_DailyStageInfo());
    exportProtocol.push(new CS_DailyStageBattleStart());
    exportProtocol.push(new CS_DailyStageBattleEnd());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 函数区
 */

/**
 *  初始化每日副本(按照副本类型初始化)
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param type [int] 每日副本的类型
 * @param now [int] 1970年1月1日至今的毫秒数
 * @param cb [func] 返回错误码[int](retCode)和数据(每日副本的信息)
 */
var setDefaultDailyStage = function(zid, uid, type, now, cb) {
    var dailyStage = new (globalObject.DailyStage)();
    dailyStage.zid = zid;
    dailyStage.uid = uid;
    dailyStage.type = type;
    dailyStage.lastBattleTime = now;
    dailyStageDb.setDailyStage(zid, uid, dailyStage, function (err) {
        if(!!err) {
            cb(err);
            return;
        }
        cb(null, dailyStage);
    });
}

/**
 *  初始化每日副本(按照副本INDEX初始化)
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param mid [int] 每日副本的INDX
 * @param now [int] 1970年1月1日至今的毫秒数
 * @param cb [func] 返回错误码[int](retCode)和数据(每日副本的信息)
 */
var setDefaultDailyStageDetail = function(zid, uid, mid, now, cb) {
    getDailyStageMonsterHealth(mid, function (err, health) {
        if(!!err) {
            cb(err);
            return;
        }
        var dailyStageDetail = new (globalObject.DailyStageDetail)();
        dailyStageDetail.zid = zid;
        dailyStageDetail.uid = uid;
        dailyStageDetail.mid = mid;
        dailyStageDetail.health = health;
        dailyStageDetail.lastBattleTime = now;
        dailyStageDb.setDailyStageDetail(zid, uid, dailyStageDetail, function (err) {
            if(!!err) {
                cb(err);
                return;
            }
            cb(null, dailyStageDetail);
        });
    });
}

/**
 *  检查BOSS开放时间
 * @param timeNow [Date Object] 当前的时间
 * @param openDate [string] 每日副本的开放时间
 * @param cb [func] 返回错误码[int](retCode)
 */
var checkOpenDay = function (timeNow, openDate, cb) {
    var dayNow = timeNow.getDay();
    var separator = '#';
    var dayArray = openDate.split(separator);
    for(var i = 0; i < dayArray.length; i++) {
        if(parseInt(dayArray[i]) === dayNow) {
            cb(null);
            return;
        }
    }
    cb(retCode.DAILY_STAGE_NOT_OPEN);
}

/**
 *  获取掉落物品
 * @param dropItems [string] 掉落物品
 * @param cb [func] 返回错误码[int](retCode)和数据Array(掉落的物品)
 */
var getDropItem = function (dropItems, cb) {
    var items = [];
    var separatorItems = '|';
    var separatorItem = '#';
    var itemsSplit = dropItems.split(separatorItems);
    for(var i = 0; i< itemsSplit.length; i++) {
        var itemSplit =  itemsSplit[i].split(separatorItem);
        /* */
        var item = new protocolObject.ItemObject();
        item.itemId = -1;
        item.tid = itemSplit[0];
        item.itemNum = itemSplit[1];
        /* */
        items.push(item);
    }
    cb(null, items);
}

/**
 *  获取每日副本BOSS血量
 * @param mid [int] 每日副本的INDEX
 * @param cb [func] 返回错误码[int](retCode)和数据(每日副本BOSS血量)
 */
var getDailyStageMonsterHealth = function (mid, cb) {
    var dailyStageConfig = csvManager.DailyStageConfig()[mid];
    if(undefined === dailyStageConfig || null === dailyStageConfig) {
        cb(retCode.DAILY_STAGE_NOT_EXIST);
        return;
    }
    var stageConfig = csvManager.StageConfig()[dailyStageConfig.STAGE_ID];
    if(undefined === stageConfig || null === stageConfig) {
        cb(retCode.DAILY_STAGE_STAGE_NOT_EXIST);
        return;
    }
    var monsterConfig = csvManager.MonsterObject()[stageConfig.HEADICON];
    if(undefined === monsterConfig || null === monsterConfig) {
        cb(retCode.DAILY_STAGE_MONSTER_NOT_EXIST);
        return;
    }
    cb(null, monsterConfig.BASE_HP);
}