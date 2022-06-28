/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：巅峰挑战，竞技场排行，战斗力排行。
 * 开发者：余金堂
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
/**
 * 包含的头文件
 */
var packets = require('../packets/ranking_activity');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var mainUiDb = require('../database/main_ui_rank');
var playerDb = require('../database/player');
var protocolObject = require('../../common/protocol_object');
var guildDb = require('../database/guild');
var logsWater = require('../../common/logs_water');
var redisKey = require('../../common/redis_key');
var dbManager = require('../../manager/redis_manager').Instance();
var arenaDb = require('../database/arena');
var timeUtil = require('../../tools/system/time_util');
var robotCommon = require('../../common/robot');
var rankingActivityDb = require('../database/ranking_activity');


/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取竞技场排行榜
 */
var CS_PvpList = (function() {

    /**
     * 构造函数
     */
    function CS_PvpList() {
        this.reqProtocolName = packets.pCSPvpList;
        this.resProtocolName = packets.pSCPvpList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PvpList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PvpList();
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
                function (callback) {
                    accountDb.getZoneInfo(req.zid, callback);
                },
                function(zoneInfo, callback){
                    res.endTime = parseInt(timeUtil.getDetailTime(zoneInfo.openDate, 0)) + 7 * 24 * 3600;

                    var date = (new Date()).toDateString();
                    rankingActivityDb.setRankingActivityRedPointDate(req.zid, req.zuid, date);
                    callback(null);
                },

                /* 获取自己排名 */
                function(callback) {
                    arenaDb.getArenaWarrior(req.zid, req.zuid, false, function(err, arenaRankInfo) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        res.myRanking = arenaRankInfo.curRank;
                        callback(null);
                    });
                },

                /* 获取前n名的信息*/
                function(callback) {
                    var tmp = [];
                    for(var i = 1; i <= 10; ++i) {
                        tmp.push(i);
                    }

                    async.map(tmp, function(rk, cb) {
                        arenaDb.getArenaWarriorRank(req.zid, rk - 1, function(err, tUid) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            if(robotCommon.checkIfRobot(tUid)) { /* 机器人 */
                                arenaDb.getArenaRobot(tUid, function(err, playerFD) {
                                    if (err) {
                                        cb(err);
                                        return;
                                    }
                                    var rankObj = new protocolObject.ArenaRankObject();
                                    rankObj.nickname = playerFD.name; /* 昵称 */
                                    rankObj.playerId = tUid; /* 用户ID */
                                    rankObj.power = playerFD.power; /* 战斗力 */
                                    rankObj.headIconId = playerFD.petFDs[0].tid; /* 头像Id */
                                    rankObj.ranking = rk; /* 排名 */
                                    rankObj.level = playerFD.level; /* 用户等级 */
                                    rankObj.guildName = ''; /* 公会名 */
                                    cb(null, rankObj);
                                });
                            }
                            else { /* 玩家 */
                                playerDb.getPlayerData(req.zid, tUid, false, function(err, player) {
                                    if (err) {
                                        cb(err);
                                        return;
                                    }
                                    var rankObj = new protocolObject.ArenaRankObject();
                                    rankObj.nickname = player.name; /* 昵称 */
                                    rankObj.playerId = tUid; /* 用户ID */
                                    rankObj.power = player.power; /* 战斗力 */
                                    rankObj.headIconId = player.character.tid; /* 头像Id */
                                    rankObj.ranking = rk; /* 排名 */
                                    rankObj.level = player.character.level; /* 用户等级 */
                                    /* 获取公会名 */
                                    if(player.guildId.length > 0 && parseInt(player.guildId.split(':')[1]) > 0) {
                                        guildDb.getGuildInfoByGid(req.zid, player.guildId, false, function (err, guildInfo) {
                                            if (err) {
                                                cb(err);
                                                return;
                                            }
                                            rankObj.guildName = guildInfo.name; /* 公会名 */
                                        });
                                    }
                                    else {
                                        rankObj.guildName = ''; /* 公会名 */
                                    }
                                    cb(null, rankObj);
                                });
                            }
                        });

                    }, function(err, result) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.ranklist = result;
                            callback(null);
                        }
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
    return CS_PvpList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 战斗力排行
 */
var CS_FightingList = (function() {

    /**
     * 构造函数
     */
    function CS_FightingList() {
        this.reqProtocolName = packets.pCSFightingList;
        this.resProtocolName = packets.pSCFightingList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FightingList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FightingList();
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
                function (callback) {
                    accountDb.getZoneInfo(req.zid, callback);
                },
                function(zoneInfo, callback){
                    var endTime = parseInt(timeUtil.getDetailTime(zoneInfo.openDate, 0)) + 7 * 24 * 3600;
                    res.endTime = endTime;
                    callback(null);
                },

                /* 获取自己的名次 */
                function(callback) {
                    mainUiDb.getPowerRanklistIndex(req.zid, req.zuid, function(err, index) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.myRanking = index;
                        if(index > 100 || -1 == index) {
                            res.myRanking = 0; /* 未上榜 */
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    mainUiDb.getPowerRanklist(req.zid, 10,  callback);
                },
                /* 获取前n名的信息 */
                function(result, callback) {
                    if(0 == result.length) {
                        callback(null);
                        return;
                    }
                    async.map(result, function(zuid, cb) {
                        if(robotCommon.checkIfRobot(zuid)) {
                            arenaDb.getArenaRobot(zuid, function(err, playerFD) {
                                if(err) {
                                    cb(err);
                                }
                                else {
                                    var rankObj = new protocolObject.MainUIRanklistObject();
                                    rankObj.nickname = playerFD.name; /* 昵称 */
                                    rankObj.power = playerFD.power; /* 战斗力 */
                                    rankObj.headIconId = playerFD.petFDs[0].tid; /* 头像Id */
                                    rankObj.ranking =  result.indexOf(zuid) + 1; /* 排名 */
                                    rankObj.vipLv = 1; /* VIP等级 */
                                    rankObj.level = playerFD.level; /* 用户等级 */
                                    rankObj.guildName = ''; /* 公会名 */
                                    cb(null, rankObj);
                                }
                            });
                        }
                        else {
                            playerDb.getPlayerData(req.zid, zuid, false, function(err, player) {
                                if (err) {
                                    cb(err);
                                    return;
                                }
                                /* 获取公会名 */
                                if(player.guildId.length > 0 && parseInt(player.guildId.split(':')[1]) > 0) {
                                    guildDb.getGuildInfoByGid(req.zid, player.guildId, false, function (err, guildInfo) {
                                        if (err) {
                                            cb(err);
                                            return;
                                        }
                                        var rankObj = new protocolObject.MainUIRanklistObject();
                                        rankObj.nickname = player.name; /* 昵称 */
                                        rankObj.power = player.power; /* 战斗力 */
                                        rankObj.headIconId = player.character.tid; /* 头像Id */
                                        rankObj.ranking =  result.indexOf(zuid) + 1; /* 排名 */
                                        rankObj.vipLv = player.vipLevel; /* VIP等级 */
                                        rankObj.level = player.character.level; /* 用户等级 */
                                        rankObj.guildName = guildInfo.name; /* 公会名 */
                                        cb(null, rankObj);
                                    });
                                }
                                else{
                                    var rankObj = new protocolObject.MainUIRanklistObject();
                                    rankObj.nickname = player.name; /* 昵称 */
                                    rankObj.power = player.power; /* 战斗力 */
                                    rankObj.headIconId = player.character.tid; /* 头像Id */
                                    rankObj.ranking =  result.indexOf(zuid) + 1; /* 排名 */
                                    rankObj.vipLv = player.vipLevel; /* VIP等级 */
                                    rankObj.level = player.character.level; /* 用户等级 */
                                    rankObj.guildName = ''; /* 公会名 */
                                    cb(null, rankObj);
                                }
                            });
                        }

                    }, function(err, result) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.ranklist = result;
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
    return CS_FightingList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_PvpList());
    exportProtocol.push(new CS_FightingList());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;