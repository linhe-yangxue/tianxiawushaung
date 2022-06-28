
/**
 * 包含的头文件
 */
var packets = require('../packets/gm');
var http = require('../../tools/net/http_server/gm_http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var logger = require('../../manager/log4_manager');
var gmCommon = require('../common/gm_common');
var gmCode = require('../../common/gm_code');
var gmCmd = require('../../common/gm_cmd');
var protocolObject = require('../../common/protocol_object');
var mainUiDb = require('../database/main_ui_rank');
var playerDb = require('../database/player');
var guildDb = require('../database/guild');
var demonBossDb = require('../database/demon_boss');
var climbTowerDb = require('../database/climb_tower');
var arenaDb = require('../database/arena');
var friendDb = require('../database/friend');
var accountDb = require('../database/account');
var robotCommon = require('../../common/robot');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询战斗力排行
 */
var CS_QueryPowerRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPowerRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPowerRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var zid;
        async.waterfall([
            /* 获取合区后区Id */
            function(callback) {
                accountDb.getZoneInfo(request.req.zid, function(err, result) {
                    zid = result.areaId;
                    callback(err);
                });
            },

            function(callback) {
                mainUiDb.getPowerRanklist(zid, 50, callback);
            },

            function(result, callback) {
                async.map(result, function(zuid, cb) {
                    if(!robotCommon.checkIfRobot(zuid)) {/*不显示机器人*/
                        playerDb.getPlayerData(zid, zuid, false, function(err, player) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            /* 获取公会名 */
                            if(player.guildId.length > 0) {
                                guildDb.getGuildInfoByGid(zid, player.guildId, false, function (err, guildInfo) {
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
                    else{
                        cb(null);
                    }
                }, function(err, results) {
                    if(err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    var arrCorrect = [];/*去掉是null的*/
                    for(var j=0; j<results.length; j++){
                        if(results[j]){
                            arrCorrect.push(results[j]);
                        }
                    }
                    res.res.list = arrCorrect;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPowerRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询等级排行
 */
var CS_QueryLevelRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryLevelRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryLevelRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var zid;
        async.waterfall([
            /* 获取合区后区Id */
            function(callback) {
                accountDb.getZoneInfo(request.req.zid, function(err, result) {
                    zid = result.areaId;
                    callback(err);
                });
            },

            function(callback) {
                mainUiDb.getLevelRanklist(zid, callback);
            },

            function(result, callback) {
                async.map(result, function(zuid, cb) {
                    if(!robotCommon.checkIfRobot(zuid)) {/*不显示机器人*/
                        playerDb.getPlayerData(zid, zuid, false, function(err, player) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            /* 获取公会名 */
                            if (player.guildId.length > 0) {
                                guildDb.getGuildInfoByGid(zid, player.guildId, false, function (err, guildInfo) {
                                    if (err) {
                                        cb(err);
                                        return;
                                    }
                                    var rankObj = new protocolObject.MainUIRanklistObject();
                                    rankObj.nickname = player.name;/* 昵称 */
                                    rankObj.power = player.power;/* 战斗力 */
                                    rankObj.headIconId = player.character.tid;/* 头像Id */
                                    rankObj.ranking = result.indexOf(zuid) + 1;/* 排名 */
                                    rankObj.vipLv = player.vipLevel;/* VIP等级 */
                                    rankObj.level = player.character.level;/* 用户等级 */
                                    rankObj.guildName = guildInfo.name;/* 公会名 */
                                    cb(null, rankObj);
                                });
                            }
                            else {
                                var rankObj = new protocolObject.MainUIRanklistObject();
                                rankObj.nickname = player.name;/* 昵称 */
                                rankObj.power = player.power;/* 战斗力 */
                                rankObj.headIconId = player.character.tid;/* 头像Id */
                                rankObj.ranking = result.indexOf(zuid) + 1;/* 排名 */
                                rankObj.vipLv = player.vipLevel;/* VIP等级 */
                                rankObj.level = player.character.level;/* 用户等级 */
                                rankObj.guildName = '';/* 公会名 */
                                cb(null, rankObj);
                            }
                        });
                    }
                    else{
                        cb(null);
                    }
                }, function(err, results) {
                    if(err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    var arrCorrect = [];/*去掉是null的*/
                    for(var j=0; j<results.length; j++){
                        if(results[j]){
                            arrCorrect.push(results[j]);
                        }
                    }
                    res.res.list = arrCorrect;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryLevelRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询宗门排行
 */
var CS_QueryGuildRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryGuildRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryGuildRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var zid;
        async.waterfall([
            /* 获取合区后区Id */
            function(callback) {
                accountDb.getZoneInfo(request.req.zid, function(err, result) {
                    zid = result.areaId;
                    callback(err);
                });
            },

            function(callback) {
                guildDb.getGuildRankList(zid, callback);
            },

            function(ranklist, callback) {
                async.map(ranklist, function(gid, cb) {
                    guildDb.getGuildInfoByGid(zid, gid, false, function (err, guildInfo) {
                        if(err) {
                            cb(err);
                            return;
                        }
                        var memberArr = guildInfo.member;
                        var uid = null;
                        for(var i = 0; i < memberArr.length; ++i) {
                            if(2 != memberArr[i].title) {
                                continue;
                            }
                            uid = memberArr[i].zuid;
                        }
                        /* 找会长名 */
                        playerDb.getPlayerData(zid, uid, false, function (err, player) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            var rankObj = new protocolObject.GuildRanklistObject();
                            rankObj.guildName = guildInfo.name;
                            rankObj.currMemberCount = guildInfo.member.length;
                            rankObj.ranking = ranklist.indexOf(gid) + 1;
                            rankObj.guildLv = guildInfo.level;
                            rankObj.hierarchName = player.name;
                            cb(null, rankObj);
                        });
                    });
                }, function(err, result) {
                    if(err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.list = result;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryGuildRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询天魔乱入伤害排行
 */
var CS_QueryDamageRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryDamageRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryDamageRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([
            /*获取前5名的player的id*/
            function(callback) {
                demonBossDb.getDamageOutputRank(request.req.zid, 0, 4, callback);
            },

            /* 赋值排行榜 */
            function(rankList, callback) {
                if(rankList == null) {
                    callback(null);
                }

                var i = 0;
                var len = rankList.length;
                res.res.list = [];
                async.whilst(
                    function() {return i < len; },
                    function(cb) {
                        playerDb.getPlayerData(request.req.zid, rankList[i], false, function(err, player) {
                            if(err) {
                                res.msg = gmCode.GMERR_QUERYREDISFAIL;
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

                            res.res.list.push(rankObj);
                            cb(null);
                        });
                    },
                    function(err) {
                        callback(err);
                    }
                );
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryDamageRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询天魔乱入功勋排行
 */
var CS_QueryFeatsRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryFeatsRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryFeatsRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        if(isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([
            /*获取前5名的player的id*/
            function(callback) {
                demonBossDb.getMeritRank(request.req.zid, 0, 4, callback);
            },

            /* 赋值排行榜 */
            function(rankList, callback) {
                if(rankList == null) {
                    callback(null);
                }

                var i = 0;
                var len = rankList.length;
                res.res.list = [];
                async.whilst(
                    function() {return i < len; },
                    function(cb) {
                        playerDb.getPlayerData(request.req.zid, rankList[i], false, function(err, player) {
                            if(err) {
                                res.msg = gmCode.GMERR_QUERYREDISFAIL;
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
                            rankObj.feats = rankList[i+1]*(-1); /* 功勋值 */
                            i+=2;

                            res.res.list.push(rankObj);
                            cb(null);
                        });
                    },
                    function(err) {
                        callback(err);
                    }
                );
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryFeatsRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询爬塔排行
 */
var CS_QueryClimbTowerStarsRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryClimbTowerStarsRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryClimbTowerStarsRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([
            function(callback) {
                climbTowerDb.getStarsRanklist(request.req.zid, function(err, ranklist) {
                    if(err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }

                    var i = 0;
                    var len = ranklist.length;
                    res.res.list = [];
                    async.whilst(
                        function() {return i < len; },
                        function(cb) {
                            playerDb.getPlayerData(request.req.zid, ranklist[i], false, function(err, player) {
                                if(err) {
                                    res.msg = gmCode.GMERR_QUERYREDISFAIL;
                                    cb(err);
                                    return;
                                }
                                var rankObj = new protocolObject.ClimbTowerStarsRankObject();
                                rankObj.nickname = player.name; /* 昵称 */
                                rankObj.power = player.power; /* 战斗力 */
                                rankObj.headIconId = player.character.tid; /* 头像Id */
                                rankObj.ranking = i/2+1; /* 排名 */
                                rankObj.vipLv = player.vipLevel; /* VIP等级 */
                                rankObj.starCount = ranklist[i+1]*(-1); /* 星星数量 */

                                i+=2;
                                res.res.list.push(rankObj);
                                cb(null);
                            });
                        },
                        function(err) {
                            callback(err);
                        }
                    );
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd,  '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd,  '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryClimbTowerStarsRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询竞技场排行
 */
var CS_QueryArenaRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryArenaRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryArenaRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([
            function(callback) {
                var tmp = [];
                for (var i = 1; i <= 50; ++i) {
                    tmp.push(i);
                }

                async.map(tmp, function (rk, cb) {
                    arenaDb.getArenaWarriorRank(request.req.zid, rk - 1, function (err, tUid) {
                        if (err) {
                            cb(err);
                            return;
                        }

                        if (!robotCommon.checkIfRobot(tUid)) {
                            playerDb.getPlayerData(request.req.zid, tUid, false, function (err, player) {
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
                                cb(null, rankObj);
                            });
                        }
                        else {
                            cb(null, null);
                        }
                    });
                }, function (err, result) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                    }
                    else {
                        var arrCorrect = [];
                        /*去掉是null的*/
                        for (var j = 0; j < result.length; j++) {
                            if (result[j]) {
                                arrCorrect.push(result[j]);
                            }
                        }
                        res.res.list = arrCorrect;
                        callback(null);
                    }
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd,  '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd,  '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryArenaRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改排行榜名次
 */
var CS_AlterRank = (function() {

    /**
     * 构造函数
     */
    function CS_AlterRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AlterRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid
            || null == request.req.name
            || null == request.req.rankId) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.rankId = parseInt(request.req.rankId);

        if(isNaN(request.req.zid) || isNaN(request.req.rankId)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var zuidOrGuildInfo;/*uid或者公会信息*/
        var zid;
        async.waterfall([
            /* 获取合区后区Id */
            function(callback) {
                accountDb.getZoneInfo(request.req.zid, function(err, result) {
                    zid = result.areaId;
                    callback(err);
                });
            },

            function(callback) {
                if(request.req.rankId != 2){
                    playerDb.getZuidByPreZidName(request.req.zid, request.req.name, function(err, zuid){
                        if(err){
                            if(err == retCode.ACCOUNT_NOT_EXIST){
                                res.msg = gmCode.GMERR_GETUIDFAIL;
                            }
                            else{
                                res.msg = gmCode.GMERR_QUERYREDISFAIL;
                            }
                            callback(err);
                        }
                        else{
                            zuidOrGuildInfo = zuid;
                            callback(null);
                        }
                    });
                }
                else{
                    guildDb.getAGuildInfoByName(request.req.zid, request.req.name, function(err, guildInfo){
                        if(err){
                            if(err == retCode.GUILD_NOT_EXIST){
                                res.msg = gmCode.GMERR_NOTGUILD;
                            }
                            else{
                                res.msg = gmCode.GMERR_QUERYREDISFAIL;
                            }
                            callback(err);
                        }
                        else{
                            zuidOrGuildInfo = guildInfo;
                            callback(null);
                        }
                    });
                }
            },

            function(callback) {
                switch(request.req.rankId){
                    case 1:/*等级排行*/
                        AlterLevelRank(request.req.zid, zuidOrGuildInfo, callback);
                        break;
                    case 2:/*宗门排行*/
                        AlterGuildRank(zid, zuidOrGuildInfo, callback);
                        break;
                    case 3:/*伤害排行*/
                        AlterDamageRank(request.req.zid, zuidOrGuildInfo, callback);
                        break;
                    case 4:/*功勋排行*/
                        AlterFeatsRank(request.req.zid, zuidOrGuildInfo, callback);
                        break;
                    case 5:/*爬塔排行*/
                        climbTowerDb.delStarsRank(request.req.zid, zuidOrGuildInfo, callback);
                        break;
                    default :
                        callback(gmCode.GM_PARAM_ERR);
                }
            },
            /*踢他下线*/
            function(callback){
                if(request.req.rankId != 2){
                    accountDb.delGameTokenInZone(request.req.zid, zuidOrGuildInfo);
                }
                callback(null);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AlterRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push([gmCmd.GM_QUERYPOWERRANK, new CS_QueryPowerRank()]);
    exportProtocol.push([gmCmd.GM_QUERYLEVELRANK, new CS_QueryLevelRank()]);
    exportProtocol.push([gmCmd.GM_QUERYGUILDRANK, new CS_QueryGuildRank()]);
    exportProtocol.push([gmCmd.GM_QUERYDAMAGERANK, new CS_QueryDamageRank()]);
    exportProtocol.push([gmCmd.GM_QUERYFEATSRANK, new CS_QueryFeatsRank()]);
    exportProtocol.push([gmCmd.GM_QUERYCLIMBTOWERSTARSRANK, new CS_QueryClimbTowerStarsRank()]);
    exportProtocol.push([gmCmd.GM_QUERYARENARANK, new CS_QueryArenaRank()]);
    exportProtocol.push([gmCmd.GM_ALTERRANK, new CS_AlterRank()]);

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

/**------------------------------------修改排行榜名次，详细逻辑-------------------------------------------------------*/

var AlterLevelRank = function(zid, zuid, callback) {
    /* 更新主界面等级排行榜 */
    mainUiDb.updateLevelRanklist(zid, zuid, 1, parseInt(Date.now()/1000));
    /*更新角色等级*/
    playerDb.getPlayerData(zid, zuid, true, function(err, player){
        if(err){
            callback(err);
        }
        else{
            player.character.level = 1;
            player.character.exp = 0;
            playerDb.savePlayerData(zid, zuid, player, true, callback);
        }
    });
};

var AlterGuildRank= function(zid, guildInfo, callback) {
    async.waterfall([
        /*修改公会等级*/
        function(callback) {
            guildInfo.level = 1;
            guildInfo.exp = 0;
            guildDb.updateGuildInfo(zid, guildInfo, true, callback);
        },
        /*修改公会排行*/
        function(callback) {
            guildDb.updateGuildRankList(zid, guildInfo.gid, guildInfo.level, parseInt(Date.now() / 1000), callback);
        }
    ], callback);
};

var AlterDamageRank = function(zid, zuid, callback) {
    demonBossDb.clearDamageOutputAndMerit(zid, zuid);
    demonBossDb.delADamageOutputRank(zid, zuid, callback);
};

var AlterFeatsRank = function(zid, zuid, callback) {
    demonBossDb.clearDamageOutputAndMerit(zid, zuid);
    demonBossDb.delAMeritRank(zid, zuid, callback);
};
