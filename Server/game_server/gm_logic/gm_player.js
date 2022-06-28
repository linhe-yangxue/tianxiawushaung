
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
var playerDb = require('../database/player');
var globalObject = require('../../common/global_object');
var packageDb = require('../database/package');
var accountDb = require('../database/account');
var guideDb = require('../database/newbie_guide');
var sdkAccountDb = require('../database/sdk_account');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 禁言查询
 */
var CS_QueryDontChat = (function() {

    /**
     * 构造函数
     */
    function CS_QueryDontChat() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryDontChat.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.name) {
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
            /* 获取uid */
            function(callback) {
                playerDb.getZuidByPreZidName(request.req.zid, request.req.name, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                });
            },

            /* 获取player对象 */
            function(zuid, callback) {
                playerDb.getPlayerData(request.req.zid, zuid, false, function(err, player){
                    if(err){
                        res.msg = gmCode.GMERR_GETPLAYERFAIL;
                        callback(err);
                        return;
                    }
                    /* 返回结果 */
                    res.res.beginTime = player.dontChatInfo.beginTime;
                    res.res.endTime = player.dontChatInfo.endTime;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryDontChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加禁言
 */
var CS_AddDontChat = (function() {

    /**
     * 构造函数
     */
    function CS_AddDontChat() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AddDontChat.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.beginTime
            || null == request.req.endTime
            || null == request.req.reason) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.beginTime = parseInt(request.req.beginTime);
        request.req.endTime = parseInt(request.req.endTime);

        if(isNaN(request.req.zid) || isNaN(request.req.beginTime) || isNaN(request.req.endTime)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var successName = [];/*成功的角色名集合*/
        async.waterfall([
            function(callback){
                async.each(request.req.name, function (aName, eachCb) {
                    /* 获取uid */
                    playerDb.getZuidByPreZidName(request.req.zid, aName, function (err, zuid){
                        if (!err) {
                            /* 获取player对象 */
                            playerDb.getPlayerData(request.req.zid, zuid, true, function (err, player) {
                                if (!err) {
                                    /* 覆盖之前数据 */
                                    player.dontChatInfo.beginTime = request.req.beginTime;
                                    player.dontChatInfo.endTime = request.req.endTime;
                                    player.dontChatInfo.reason = request.req.reason;

                                    playerDb.savePlayerData(request.req.zid, zuid, player, true, function(err) {
                                        if (!err) {
                                            successName.push(aName);
                                        }
                                        eachCb(null);
                                    });
                                }
                                else{
                                    eachCb(null);
                                }
                            });
                        }
                        else{
                            eachCb(null);
                        }
                    });
                }, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                res.msg = successName;
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AddDontChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 删除禁言
 */
var CS_DelDontChat = (function() {

    /**
     * 构造函数
     */
    function CS_DelDontChat() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DelDontChat.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.name) {
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
            /* 获取uid */
            function(callback) {
                playerDb.getZuidByPreZidName(request.req.zid, request.req.name, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                });
            },

            /* 获取player对象 */
            function(zuid, callback) {
                playerDb.getPlayerData(request.req.zid, zuid, true, function(err, player){
                    if(err){
                        res.msg = gmCode.GMERR_GETPLAYERFAIL;
                        callback(err);
                        return;
                    }
                    /* 修改禁言信息 */
                    player.dontChatInfo.beginTime = 0;
                    player.dontChatInfo.endTime = 0;
                    player.dontChatInfo.reason = '';

                    playerDb.savePlayerData(request.req.zid, zuid, player, true, function(err) {
                        if (err) {
                            res.msg = gmCode.GMERR_SAVEPLAYERFAIL;
                            callback(err);
                            return;
                        }
                        callback(null);
                    });
                });
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
    return CS_DelDontChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 封号查询
 */
var CS_QuerySealAccount = (function() {

    /**
     * 构造函数
     */
    function CS_QuerySealAccount() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QuerySealAccount.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.name) {
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
            /* 获取uid */
            function(callback) {
                playerDb.getZuidByPreZidName(request.req.zid, request.req.name, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    accountDb.getSealAccountInfo(request.req.zid, zuid, function(err, sealAccountInfo){
                        if(err){
                            res.msg = gmCode.GMERR_QUERYREDISFAIL;
                            callback(err);
                            return;
                        }
                        if(sealAccountInfo){
                            res.res.beginTime = sealAccountInfo.beginTime;
                            res.res.endTime = sealAccountInfo.endTime;
                        }
                        else{
                            res.res.beginTime = 0;
                            res.res.endTime = 0;
                        }
                        callback(null);
                    })
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QuerySealAccount;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加封号
 */
var CS_AddSealAccount = (function() {

    /**
     * 构造函数
     */
    function CS_AddSealAccount() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AddSealAccount.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.beginTime
            || null == request.req.endTime
            || null == request.req.reason) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.beginTime = parseInt(request.req.beginTime);
        request.req.endTime = parseInt(request.req.endTime);

        if(isNaN(request.req.zid) || isNaN(request.req.beginTime) || isNaN(request.req.endTime)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var successName = [];/*成功的角色名集合*/
        var mapSealAccountInfo = {};/* map<uid, sealAccountObj>*/
        async.waterfall([
            function(callback){
                async.each(request.req.name, function (aName, eachCb) {
                    /* 获取uid */
                    playerDb.getZuidByPreZidName(request.req.zid, aName, function (err, zuid){
                        if (!err) {
                            successName.push(aName);
                            var info = new globalObject.SealAccountInfo();
                            info.beginTime = request.req.beginTime;
                            info.endTime = request.req.endTime;
                            info.reason = request.req.reason;
                            mapSealAccountInfo[zuid] = info;
                        }
                        eachCb(null);
                    });
                }, callback);
            },

            function(callback) {
                accountDb.addSealAccountInfo(request.req.zid, mapSealAccountInfo);
                for(var i in mapSealAccountInfo) {
                    accountDb.delGameTokenInZone(request.req.zid, i);
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
                res.msg = successName;
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AddSealAccount;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 删除封号
 */
var CS_DelSealAccount = (function() {

    /**
     * 构造函数
     */
    function CS_DelSealAccount() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DelSealAccount.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.name) {
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
            /* 获取uid */
            function(callback) {
                playerDb.getZuidByPreZidName(request.req.zid, request.req.name, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    accountDb.delSealAccountInfo(request.req.zid, zuid);
                    callback(null);
                });
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
    return CS_DelSealAccount;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家信息查询(用acc查时，channel和zid必填；用name查时，zid必填)
 */
var CS_QueryPlayer = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPlayer() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPlayer.prototype.handleProtocol = function (request, response) {
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
        if(null == request.req || null == request.req.name || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var zuid = 0;
        async.waterfall([
            /*获取uid*/
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, playerid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    zuid = playerid;
                    callback(null);
                })
            },

            /*获取渠道id*/
            function(callback){
                sdkAccountDb.getChannelInfoByUid(zuid, function(err, channelInfo){
                    if(err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.channel = channelInfo.channel; /* 渠道id */
                    callback(null);
                })
            },

            /* 获取新手引导进度 */
            function(callback) {
                guideDb.getGuideProgress(request.req.zid, zuid, callback);
            },

            /* 获取最后心跳时间 */
            function(progress, callback) {
                res.res.BGS = progress; /* 新手任务 */
                playerDb.getLastHBTime(request.req.zid, zuid, callback);
            },

            /* 获取player数据 */
            function(LastHBTime, callback) {
                res.res.lastLogoutTime = LastHBTime + 60; /* 最后登出时间 */
                playerDb.getPlayerData(request.req.zid, zuid, true,  function(err, player) {
                    if(err) {
                        res.msg = gmCode.GMERR_GETPLAYERFAIL;
                        callback(err);
                        return;
                    }

                    res.res.name= player.name; /* 名字 */
                    res.res.gold = player.gold; /* 银币 */
                    res.res.diamond = player.diamond; /* 元宝 */
                    res.res.soulPoint = player.soulPoint;     /* 符魂 */
                    res.res.reputation = player.reputation; /* 声望 */
                    res.res.prestige = player.prestige; /* 威名 */
                    res.res.battleAchv = player.battleAchv; /* 战功 */
                    res.res.unionContr = player.unionContr; /* 公会贡献 */
                    res.res.vipLevel = player.vipLevel; /* vip等级 */
                    res.res.power = player.power; /* 战斗力 */
                    res.res.skin = player.skin; /* 皮肤 */
                    res.res.lastLoginTime = player.lastLoginTime; /* 最后登陆时间 */
                    res.res.todayWorship = player.todayWorship; /* 当天贡献 */
                    res.res.guildId = player.guildId; /* 公会Id */
                    res.res.headId = player.character.tid;
                    res.res.level = player.character.level;
                    res.res.exp = player.character.exp;
                    res.res.breakLevel = player.character.breakLevel;
                    res.res.fateLevel = player.character.fateLevel;
                    res.res.fateExp = player.character.fateExp;
                    res.res.skillLevel = player.character.skillLevel;
                    res.res.stamina = player.stamina; /* 体力 */
                    res.res.spirit = player.spirit; /* 精力 */
                    res.res.beatDemonCard = player.beatDemonCard; /* 降魔令 */
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPlayer;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家宠物查询(用acc查时，channel和zid必填；用name查时，zid必填)
 */
var CS_QueryPlayerPet = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPlayerPet() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPlayerPet.prototype.handleProtocol = function (request, response) {
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
            || (null == request.req.acc && null == request.req.name)
            || (null != request.req.acc && null == request.req.channel)
            || (null != request.req.acc && null == request.req.zid)
            || (null != request.req.name && null == request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            /*获取uid*/
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                })
            },

            function(zuid, callback) {
                packageDb.getPackage(request.req.zid, zuid, globalObject.PACKAGE_TYPE_PET, false, function(err, pets) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = pets.content;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPlayerPet;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家宠物碎片查询(用acc查时，channel和zid必填；用name查时，zid必填)
 */
var CS_QueryPlayerPetFragment = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPlayerPetFragment() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPlayerPetFragment.prototype.handleProtocol = function (request, response) {
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
            || (null == request.req.acc && null == request.req.name)
            || (null != request.req.acc && null == request.req.channel)
            || (null != request.req.acc && null == request.req.zid)
            || (null != request.req.name && null == request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            /*获取uid*/
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                })
            },

            function(zuid, callback) {
                packageDb.getPackage(request.req.zid, zuid, globalObject.PACKAGE_TYPE_PET_FRAGMENT, false, function(err, petFrag) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = petFrag.content;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPlayerPetFragment;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家装备查询(用acc查时，channel和zid必填；用name查时，zid必填)
 */
var CS_QueryPlayerEquip = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPlayerEquip() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPlayerEquip.prototype.handleProtocol = function (request, response) {
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
            || (null == request.req.acc && null == request.req.name)
            || (null != request.req.acc && null == request.req.channel)
            || (null != request.req.acc && null == request.req.zid)
            || (null != request.req.name && null == request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            /*获取uid*/
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                })
            },

            function(zuid, callback) {
                packageDb.getPackage(request.req.zid, zuid, globalObject.PACKAGE_TYPE_EQUIP, false, function(err, equips) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = equips.content;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPlayerEquip;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家装备碎片查询(用acc查时，channel和zid必填；用name查时，zid必填)
 */
var CS_QueryPlayerEquipFragment = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPlayerEquipFragment() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPlayerEquipFragment.prototype.handleProtocol = function (request, response) {
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
            || (null == request.req.acc && null == request.req.name)
            || (null != request.req.acc && null == request.req.channel)
            || (null != request.req.acc && null == request.req.zid)
            || (null != request.req.name && null == request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            /*获取uid*/
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                })
            },

            function(zuid, callback) {
                packageDb.getPackage(request.req.zid, zuid, globalObject.PACKAGE_TYPE_EQUIP_FRAGMENT, false, function(err, equipFrag) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = equipFrag.content;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPlayerEquipFragment;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家法器查询(用acc查时，channel和zid必填；用name查时，zid必填)
 */
var CS_QueryPlayerMagic = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPlayerMagic() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPlayerMagic.prototype.handleProtocol = function (request, response) {
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
            || (null == request.req.acc && null == request.req.name)
            || (null != request.req.acc && null == request.req.channel)
            || (null != request.req.acc && null == request.req.zid)
            || (null != request.req.name && null == request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            /*获取uid*/
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                })
            },

            function(zuid, callback) {
                packageDb.getPackage(request.req.zid, zuid, globalObject.PACKAGE_TYPE_MAGIC, false, function(err, magic) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = magic.content;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPlayerMagic;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家法器碎片查询(用acc查时，channel和zid必填；用name查时，zid必填)
 */
var CS_QueryPlayerMagicFragment = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPlayerMagicFragment() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPlayerMagicFragment.prototype.handleProtocol = function (request, response) {
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
            || (null == request.req.acc && null == request.req.name)
            || (null != request.req.acc && null == request.req.channel)
            || (null != request.req.acc && null == request.req.zid)
            || (null != request.req.name && null == request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            /*获取uid*/
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                })
            },

            function(zuid, callback) {
                packageDb.getPackage(request.req.zid, zuid, globalObject.PACKAGE_TYPE_MAGIC_FRAGMENT, false, function(err, magicFrag) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = magicFrag.content;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPlayerMagicFragment;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家消耗品查询(用acc查时，channel和zid必填；用name查时，zid必填)
 */
var CS_QueryPlayerItems = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPlayerItems() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPlayerItems.prototype.handleProtocol = function (request, response) {
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
            || (null == request.req.acc && null == request.req.name)
            || (null != request.req.acc && null == request.req.channel)
            || (null != request.req.acc && null == request.req.zid)
            || (null != request.req.name && null == request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            /*获取uid*/
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                })
            },

            function(zuid, callback) {
                packageDb.getPackage(request.req.zid, zuid, globalObject.PACKAGE_TYPE_CONSUME_ITEM, false, function(err, items) {
                    if (err) {
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = items.content;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryPlayerItems;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改vip等级
 */
var CS_AlterVipLevel = (function() {

    /**
     * 构造函数
     */
    function CS_AlterVipLevel() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AlterVipLevel.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.vipLevel) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.vipLevel = parseInt(request.req.vipLevel);

        if(isNaN(request.req.zid) || isNaN(request.req.vipLevel)) {
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

            /* 获取uid */
            function(callback) {
                playerDb.getZuidByPreZidName(request.req.zid, request.req.name, function(err, zuid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    callback(null, zuid);
                });
            },

            /* 获取player对象 */
            function(zuid, callback) {
                playerDb.getPlayerData(zid, zuid, true, function(err, player){
                    if(err){
                        res.msg = gmCode.GMERR_GETPLAYERFAIL;
                        callback(err);
                        return;
                    }
                    /* 返回结果 */
                    player.vipLevel = request.req.vipLevel;
                    player.vipExp = 0;
                    playerDb.savePlayerData( zid, zuid, player, true, callback);
                });
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
    return CS_AlterVipLevel;
})();
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_QueryDontChat()]);
    exportProtocol.push([gmCmd.GM_ADDDONTCHAT, new CS_AddDontChat()]);
    exportProtocol.push([gmCmd.GM_DELDONTCHAT, new CS_DelDontChat()]);
    exportProtocol.push([gmCmd.GM_QUERYSEALACCOUNT, new CS_QuerySealAccount()]);
    exportProtocol.push([gmCmd.GM_ADDSEALACCOUN, new CS_AddSealAccount()]);
    exportProtocol.push([gmCmd.GM_DELSEALACCOUN, new CS_DelSealAccount()]);
    exportProtocol.push([gmCmd.GM_QUERYPLAYER, new CS_QueryPlayer()]);
    exportProtocol.push([gmCmd.GM_QUERYPLAYERPET, new CS_QueryPlayerPet()]);
    exportProtocol.push([gmCmd.GM_QUERYPLAYERPETFRAGMENT, new CS_QueryPlayerPetFragment()]);
    exportProtocol.push([gmCmd.GM_QUERYPLAYEREQUIP, new CS_QueryPlayerEquip()]);
    exportProtocol.push([gmCmd.GM_QUERYPLAYEREQUIPFRAGMENT, new CS_QueryPlayerEquipFragment()]);
    exportProtocol.push([gmCmd.GM_QUERYPLAYERMAGIC, new CS_QueryPlayerMagic()]);
    exportProtocol.push([gmCmd.GM_QUERYPLAYERMAGICFRAGMENT, new CS_QueryPlayerMagicFragment()]);
    exportProtocol.push([gmCmd.GM_QUERYPLAYERITEMS, new CS_QueryPlayerItems()]);
    exportProtocol.push([gmCmd.GM_ALTERVIPLEVEL, new CS_AlterVipLevel()]);

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
