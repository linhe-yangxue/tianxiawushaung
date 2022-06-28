
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
var whiteListDb = require('../database/white_list');
var accountDb = require('../database/account');
var globalObject = require('../../common/global_object');
var arenaDb = require('../database/arena');
var mainUiRobDb = require('../database/main_ui_robot');
var guildDb = require('../database/guild');
var playerDb = require('../database/player');
var activityTimeDb = require('../database/activity_time');
var protocolObject = require('../../common/protocol_object');
var dbManager = require('../../manager/redis_manager').Instance();
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询白名单
 */
var CS_QueryWhiteList = (function() {

    /**
     * 构造函数
     */
    function CS_QueryWhiteList() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryWhiteList.prototype.handleProtocol = function (request, response) {
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
                whiteListDb.getAllWhiteList(request.req.zid, function(err, whiteListInfo){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.list = whiteListInfo;
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
    return CS_QueryWhiteList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加白名单
 */
var CS_AddWhiteList = (function() {

    /**
     * 构造函数
     */
    function CS_AddWhiteList() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AddWhiteList.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.list) {
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
                whiteListDb.addWhiteList(request.req.zid, request.req.list, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AddWhiteList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 删除白名单
 */
var CS_DelWhiteList = (function() {

    /**
     * 构造函数
     */
    function CS_DelWhiteList() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DelWhiteList.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.list) {
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
                whiteListDb.delWhiteList(request.req.zid, request.req.list, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_DelWhiteList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 服务器管理
 */
var CS_AlterServer = (function() {

    /**
     * 构造函数
     */
    function CS_AlterServer() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AlterServer.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.newName
            || null == request.req.newState
            || null == request.req.maxRegister
            || null == request.req.openDate) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.newState = parseInt(request.req.newState);
        request.req.maxRegister = parseInt(request.req.maxRegister);

        if(isNaN(request.req.zid) || isNaN(request.req.newState) || isNaN(request.req.maxRegister)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var change = false;
        var isCloceServer = false; /* 是否关服 */
        var isChangeOpenDate = false; /*是否改变开服时间*/
        async.waterfall([
            /* 获取该区信息 */
            function(callback) {
                accountDb.getZoneInfo(request.req.zid, callback);
            },

            function(zoneInfo, callback) {
                if(null == zoneInfo){
                    res.msg = gmCode.GMERR_NOTZONE;
                    callback(gmCode.GM_PARAM_ERR);
                }
                else{
                    if(request.req.newName.length > 0){
                        zoneInfo.name = request.req.newName;
                        change = true;
                    }
                    if(request.req.newState > 0 && request.req.newState <= 5){
                        zoneInfo.state = request.req.newState;
                        change = true;
                        if(request.req.newState == 5 || request.req.newState == 4){
                            isCloceServer = true;
                        }
                    }
                    if( request.req.maxRegister > 0){
                        zoneInfo.maxRegister = request.req.maxRegister;
                        change = true;
                    }
                    if(request.req.openDate.length > 0){
                        zoneInfo.openDate = request.req.openDate;
                        zoneInfo.playerCnt = 0;/* 清空该区的玩家数量 */
                        change = true;
                        isChangeOpenDate = true;
                    }
                    if(change){
                        accountDb.setZoneInfo(zoneInfo, callback);
                    }
                    else{
                        callback(gmCode.GM_PARAM_ERR);
                    }
                }
            },

            function(callback){
                if(isCloceServer){
                    accountDb.delAllGameTokenInZone(request.req.zid, callback);
                }
                else{
                    callback(null);
                }
            },

            function(callback){
                if(isChangeOpenDate){
                    accountDb.delZoneMemCnt(request.req.zid);/*删除区自增人数*/
                    var redisDb = dbManager.getZoneRedisClient().getDB(request.req.zid);
                    redisDb.FLUSHDB();/*删除整个db数据*/
                }
                callback(null);
            },

            function(callback){
                if(isChangeOpenDate){
                    arenaDb.createArenaRank(callback);
                }
                else{
                    callback(null);
                }
            },

            function(callback){
                if(isChangeOpenDate){
                    mainUiRobDb.createMainUIRobotLevelRank(callback);
                }
                else{
                    callback(null);
                }
            },

            function(callback){
                if(isChangeOpenDate){
                    mainUiRobDb.createMainUIRobotPowerRank(callback);
                }
                else{
                    callback(null);
                }
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AlterServer;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加或删除服务器
 */
var CS_AddOrDelServer = (function() {

    /**
     * 构造函数
     */
    function CS_AddOrDelServer() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AddOrDelServer.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.newName
            || null == request.req.newState
            || null == request.req.type
            || null == request.req.openDate
            || null == request.req.maxRegister) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.newState = parseInt(request.req.newState);
        request.req.type = parseInt(request.req.type);
        request.req.maxRegister = parseInt(request.req.maxRegister);

        if(isNaN(request.req.zid) || isNaN(request.req.newState) || isNaN(request.req.type) || isNaN(request.req.maxRegister)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            /* 验证type字段值是否正确 */
            function(callback){
                if(request.req.type !== 0 && request.req.type !== 1){
                    callback(gmCode.GM_PARAM_ERR);
                }
                else{
                    callback(null);
                }
            },

            function(callback) {
                if (request.req.type != 0) {
                    callback(null);
                    return;
                }
                /* 删除服务器 */
                accountDb.getZoneInfo(request.req.zid, function (err, zoneInfo) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    if (!zoneInfo) {
                        res.msg = gmCode.GMERR_NOTDELSERVER;
                        callback(gmCode.GM_PARAM_ERR);
                    }
                    else {
                        accountDb.delZoneInfo(request.req.zid, callback);
                    }
                });
            },

            /*获取自增zid*/
            function(callback){
                accountDb.getIncrZid(callback);
            },

            function(zid, callback){
                /* 添加服务器 */
                var newZone = new globalObject.ZoneInfo;
                newZone.zid = zid;
                newZone.name = request.req.newName;
                newZone.state = request.req.newState;
                newZone.openDate = request.req.openDate;
                newZone.maxRegister = request.req.maxRegister;
                newZone.areaId = zid;
                accountDb.isExistZoneInfo(newZone, function(err, isExist){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    if(isExist == 0){
                        res.msg = gmCode.GMERR_NOTADDSERVER;
                        callback(gmCode.GM_PARAM_ERR);
                    }
                    else{
                        callback(null);
                    }
                });
            },

            function(callback){
                arenaDb.createArenaRank(callback);
            },

            function(callback){
                mainUiRobDb.createMainUIRobotLevelRank(callback);
            },

            function(callback){
                mainUiRobDb.createMainUIRobotPowerRank(callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AddOrDelServer;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会查询
 */
var CS_QueryGuild = (function() {

    /**
     * 构造函数
     */
    function CS_QueryGuild() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryGuild.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.gid
            || null == request.req.guildName) {
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

        var uid, zid;
        async.waterfall([
            /* 获取合区后区Id */
            function(callback) {
                accountDb.getZoneInfo(request.req.zid, function(err, result) {
                    zid = result.areaId;
                    callback(err);
                });
            },

            /*查询出公会基础信息*/
            function(callback) {
                if(request.req.gid.length > 0) {
                    guildDb.getGuildInfoByGid(zid, request.req.gid, false, function (err, guildInfo) {
                        if (err) {
                            if(err == retCode.GUILD_NOT_EXIST){
                                res.msg = gmCode.GMERR_NOTGUILD;
                            }
                            else{
                                res.msg = gmCode.GMERR_QUERYREDISFAIL;
                            }
                            callback(err);
                            return;
                        }
                        callback(null, guildInfo);
                    });
                }
                else if(request.req.guildName.length > 0){
                    guildDb.getAGuildInfoByName(zid, request.req.guildName, function(err, guildInfo) {
                        if (err) {
                            if(err == retCode.GUILD_NOT_EXIST){
                                res.msg = gmCode.GMERR_NOTGUILD;
                            }
                            else{
                                res.msg = gmCode.GMERR_QUERYREDISFAIL;
                            }
                            callback(err);
                            return;
                        }
                        callback(null, guildInfo);
                    });
                }
                else{
                    callback(gmCode.GM_PARAM_ERR);
                }
            },

            function(guildInfo, callback) {
                res.res.guildId = guildInfo.gid;
                res.res.name = guildInfo.name;
                res.res.memberCount = guildInfo.member.length;
                res.res.level = guildInfo.level;
                res.res.exp = guildInfo.exp;
                res.res.createTime = guildInfo.foundingTime;
                /*找会长的uid*/
                for(var i = 0; i < guildInfo.member.length; ++i) {
                    if(2 != guildInfo.member[i].title) {
                        continue;
                    }
                    uid = guildInfo.member[i].zuid;
                    break;
                }
                callback(null);
            },

            /*查询会长名*/
            function(callback){
                playerDb.getPlayerData(zid, uid, false, function (err, player) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.userName = player.name;
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
    return CS_QueryGuild;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询运营活动
 */
var CS_QueryActivity = (function() {

    /**
     * 构造函数
     */
    function CS_QueryActivity() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryActivity.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.aid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.aid = parseInt(request.req.aid);

        if(isNaN(request.req.zid) || isNaN(request.req.aid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            function(callback){
                if((request.req.aid < 1) || (request.req.aid > 2)){
                    res.msg = gmCode.GMERR_NOTAID;
                    callback(gmCode.GM_PARAM_ERR);
                }
                else{
                    callback(null);
                }
            },

            /* 获取合区后区Id */
            function(callback) {
                accountDb.getZoneInfo(request.req.zid, function(err, result) {
                    callback(err, result.areaId);
                });
            },

            function(zid, callback) {
                activityTimeDb.getActivityTime(zid, request.req.zid, request.req.aid, function(err, data){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                    }
                    else if(null == data){
                        res.res = new globalObject.ActivityTimeInfo;
                    }
                    else{
                        res.res = data;
                    }
                    callback(err);
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
    return CS_QueryActivity;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改运营活动
 */
var CS_AlterActivity = (function() {

    /**
     * 构造函数
     */
    function CS_AlterActivity() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AlterActivity.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.aid
            || null == request.req.beginTime
            || null == request.req.endTime
            || null == request.req.endAwardTime
            || null == request.req.chargeAward) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.aid = parseInt(request.req.aid);
        request.req.beginTime = parseInt(request.req.beginTime);
        request.req.endTime = parseInt(request.req.endTime);
        request.req.endAwardTime = parseInt(request.req.endAwardTime);

        if(isNaN(request.req.zid) || isNaN(request.req.aid) || isNaN(request.req.beginTime) || isNaN(request.req.endTime) || isNaN(request.req.endAwardTime)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        for(var i = 0; i < request.req.chargeAward.length; ++i) {
            if(null == request.req.chargeAward[i]
                || null == request.req.chargeAward[i].rmbNum
                || null == request.req.chargeAward[i].items) {
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }

            request.req.chargeAward[i].rmbNum = parseFloat(request.req.chargeAward[i].rmbNum);

            if(isNaN(request.req.chargeAward[i].rmbNum)) {
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }

            var items = request.req.chargeAward[i].items;
            for(var j = 0; j < items.length; ++j){
                if(null == items[j]
                    || null == items[j].tid
                    || null == items[j].itemNum) {
                    http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                    return;
                }

                items[j].tid = parseInt(items[j].tid);
                items[j].itemNum = parseInt(items[j].itemNum);

                if(isNaN(items[j].tid) || isNaN(items[j].itemNum)) {
                    http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                    return;
                }
            }
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            function(callback){
                if((request.req.aid < 1) || (request.req.aid > 2)){
                    res.msg = gmCode.GMERR_NOTAID;
                    callback(gmCode.GM_PARAM_ERR);
                }
                else if(request.req.beginTime >= request.req.endTime ||
                    request.req.beginTime >= request.req.endAwardTime){
                    callback(gmCode.GM_PARAM_ERR);
                }
                else{
                    callback(null);
                }
            },

            /* 获取合区后区Id */
            function(callback) {
                accountDb.getZoneInfo(request.req.zid, function(err, result) {
                    callback(err, result.areaId);
                });
            },

            function(zid, callback) {
                var activityInfo = new globalObject.ActivityTimeInfo;
                activityInfo.beginTime = request.req.beginTime;
                activityInfo.endTime = request.req.endTime;
                activityInfo.endAwardTime = request.req.endAwardTime;
                for(var i = 0; i < request.req.chargeAward.length; ++i) {
                    if(request.req.chargeAward[i].rmbNum <= 0){
                        continue;
                    }
                    var award = new globalObject.GMChargeAward;
                    award.rmbNum = request.req.aid==1?request.req.chargeAward[i].rmbNum * 100:request.req.chargeAward[i].rmbNum;/*累充元转成分*/

                    var items = request.req.chargeAward[i].items;
                    for(var j = 0; j < items.length; ++j){
                        if(items[j].itemNum <= 0){
                            continue;
                        }
                        var item = new protocolObject.ItemObject;
                        item.tid = parseInt(items[j].tid);
                        item.itemNum = parseInt(items[j].itemNum);
                        award.items.push(item);
                    }
                    activityInfo.chargeAward.push(award);
                }

                activityTimeDb.setActivityTime(zid, request.req.zid, request.req.aid, activityInfo, function(err){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                    }
                    else{
                        callback(null);
                    }
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', request.req.zid, request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AlterActivity;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push([gmCmd.GM_QUERYWHITELIST, new CS_QueryWhiteList()]);
    exportProtocol.push([gmCmd.GM_ADDWHITELIS, new CS_AddWhiteList()]);
    exportProtocol.push([gmCmd.GM_DELWHITELIS, new CS_DelWhiteList()]);
    exportProtocol.push([gmCmd.GM_ALTERSERVER, new CS_AlterServer()]);
    exportProtocol.push([gmCmd.GM_ADDORDELSERVER, new CS_AddOrDelServer()]);
    exportProtocol.push([gmCmd.GM_QUERYGUILD, new CS_QueryGuild()]);
    exportProtocol.push([gmCmd.GM_QUERYACTIVITY, new CS_QueryActivity()]);
    exportProtocol.push([gmCmd.GM_ALTERACTIVITY, new CS_AlterActivity()]);

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
