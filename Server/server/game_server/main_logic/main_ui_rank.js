/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：主界面排行，包括角色战斗力，等级排行。
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/main_ui_rank');
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
var robotCommon = require('../../common/robot');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 战斗力排行
 */
var CS_MainUIPowerRanklist = (function() {

    /**
     * 构造函数
     */
    function CS_MainUIPowerRanklist() {
        this.reqProtocolName = packets.pCSMainUIPowerRanklist;
        this.resProtocolName = packets.pSCMainUIPowerRanklist;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MainUIPowerRanklist.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MainUIPowerRanklist();
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

                /* 获取自己的名次 */
                function(callback) {
                    mainUiDb.getPowerRanklistIndex(req.zid, req.zuid, function(err, index) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.myRanking = index;
                        if(index > 50 || -1 == index) {
                            res.myRanking = 0; /* 未上榜 */
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    mainUiDb.getPowerRanklist(req.zid, 50,  callback);
                },
                /* 获取前n名的信息 */
                function(result, callback) {
                    if(0 == result.length) {
                        callback(null);
                        return;
                    }
                    async.map(result, function(zuid, cb) {
                        if(robotCommon.checkIfRobot(zuid)) {
                            arenaDb.getArenaRobot(zuid, function(err, robot) {
                                if(err) {
                                    cb(err);
                                }
                                else {
                                    var rankObj = new protocolObject.MainUIRanklistObject();
                                    rankObj.nickname = robot.name; /* 昵称 */
                                    rankObj.power = robot.power; /* 战斗力 */
                                    rankObj.headIconId = robot.petFDs[0].tid; /* 头像Id */
                                    rankObj.ranking =  result.indexOf(zuid) + 1; /* 排名 */
                                    rankObj.vipLv = 1; /* VIP等级 */
                                    rankObj.level = robot.level; /* 用户等级 */
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
    return CS_MainUIPowerRanklist;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 等级排行
 */
var CS_MainUILevelRanklist = (function() {

    /**
     * 构造函数
     */
    function CS_MainUILevelRanklist() {
        this.reqProtocolName = packets.pCSMainUILevelRanklist;
        this.resProtocolName = packets.pSCMainUILevelRanklist;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MainUILevelRanklist.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_MainUILevelRanklist();
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
                /* 获取自己的名次 */
                function(callback) {
                    mainUiDb.getLevelRanklistIndex(req.zid, req.zuid, function(err, index) {
                        if(err) {
                            callback(err);
                            return
                        }
                        res.myRanking = index;
                        if(index > 50 || -1 == index) {
                            res.myRanking = 0; /* 未上榜 */
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    mainUiDb.getLevelRanklist(req.zid, callback);
                },
                /* 获取前n名的信息 */
                function(result, callback) {
                    async.map(result, function(zuid, cb) {
                        if(robotCommon.checkIfRobot(zuid)) {
                            arenaDb.getArenaRobot(zuid, function(err, robot) {
                                if(err) {
                                    cb(err);
                                }
                                else {
                                    var rankObj = new protocolObject.MainUIRanklistObject();
                                    rankObj.nickname = robot.name; /* 昵称 */
                                    rankObj.power = robot.power; /* 战斗力 */
                                    rankObj.headIconId = robot.petFDs[0].tid; /* 头像Id */
                                    rankObj.ranking =  result.indexOf(zuid) + 1; /* 排名 */
                                    rankObj.vipLv = 1; /* VIP等级 */
                                    rankObj.level = robot.level; /* 用户等级 */
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
    return CS_MainUILevelRanklist;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_MainUIPowerRanklist());
    exportProtocol.push(new CS_MainUILevelRanklist());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
