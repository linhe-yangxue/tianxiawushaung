
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
var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var rollPlayingDb = require('../database/roll_playing');
var announceDb = require('../database/announce');
var activationGiftDb = require('../database/activation_gift');
var accountDb = require('../database/account');
var biCode = require('../../common/bi_code');
var activityTimeDb = require('../database/activity_time');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询走马灯
 */
var CS_QueryRollPlaying = (function() {

    /**
     * 构造函数
     */
    function CS_QueryRollPlaying() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryRollPlaying.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
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
                rollPlayingDb.getRollPlayingList(function(err, rollArr){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = rollArr;
                    callback(null);
                })
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryRollPlaying;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加走马灯
 */
var CS_AddRollPlaying = (function() {

    /**
     * 构造函数
     */
    function CS_AddRollPlaying() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AddRollPlaying.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.rollid
            || null == request.req.content
            || null == request.req.playInterval
            || null == request.req.playCount
            || null == request.req.beginTime) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.rollid = parseInt(request.req.rollid);
        request.req.playInterval = parseInt(request.req.playInterval);
        request.req.playCount = parseInt(request.req.playCount);
        request.req.beginTime = parseInt(request.req.beginTime);

        if(isNaN(request.req.rollid) || isNaN(request.req.playInterval) || isNaN(request.req.playCount) || isNaN(request.req.beginTime)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var rollPlayingInfo = new globalObject.RollPlayingInfo();
        async.waterfall([
            /* 检查rollid是否重复 */
            function(callback) {
                rollPlayingDb.getRollPlaying(request.req.rollid, function(err, aRollPlaying){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    if(aRollPlaying){
                        res.msg = gmCode.GMERR_ROLLIDREPEAT;
                        callback(gmCode.GM_PARAM_ERR);
                        return;
                    }
                    callback(null);
                });
            },

            /* 加走马灯信息 */
            function(callback) {
                rollPlayingInfo.rollid = request.req.rollid;
                rollPlayingInfo.content = request.req.content;
                rollPlayingInfo.playInterval = request.req.playInterval;
                rollPlayingInfo.playCount = request.req.playCount > 99 ? 99 : request.req.playCount;
                rollPlayingInfo.beginTime = request.req.beginTime;
                rollPlayingInfo.endTime = rollPlayingInfo.beginTime + (rollPlayingInfo.playInterval * rollPlayingInfo.playCount);

                rollPlayingDb.addRollPlayingList(rollPlayingInfo, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AddRollPlaying;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 删除走马灯
 */
var CS_DelRollPlaying = (function() {

    /**
     * 构造函数
     */
    function CS_DelRollPlaying() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DelRollPlaying.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.rollid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.rollid = parseInt(request.req.rollid);

        if(isNaN(request.req.rollid)) {
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
                rollPlayingDb.getRollPlaying(request.req.rollid, callback);
            },

            function(rollInfo, callback) {
                if(null == rollInfo){
                    res.msg = gmCode.GMERR_NOTROLLID;
                    callback(gmCode.GM_PARAM_ERR);
                }
                else{
                    callback(null);
                }
            },

            /* 删除走马灯信息 */
            function(callback) {
                rollPlayingDb.delRollPlayingList(request.req.rollid, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_DelRollPlaying;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公告查询
 */
var CS_QueryAnnounce = (function() {

    /**
     * 构造函数
     */
    function CS_QueryAnnounce() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryAnnounce.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.channelId) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.channelId = parseInt(request.req.channelId);

        if(isNaN(request.req.channelId)) {
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
                announceDb.getAnnounceList(request.req.channelId, function(err, annArr){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = annArr;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryAnnounce;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加公告
 */
var CS_AddAnnounce = (function() {

    /**
     * 构造函数
     */
    function CS_AddAnnounce() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AddAnnounce.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.channelId
            || null == request.req.arr) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.channelId = parseInt(request.req.channelId);

        if(isNaN(request.req.channelId)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        for(var i = 0; i < request.req.arr.length; ++i) {
            if(null == request.req.arr[i]
                || null == request.req.arr[i].content
                || null == request.req.arr[i].title) {
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([
            function(callback){
                if(request.req.arr.length != 1){/*只处理一个对象*/
                    callback(gmCode.GM_PARAM_ERR);
                    return;
                }
                announceDb.getIncrAnnid(request.req.channelId, callback);
            },

            function(annid, callback) {
                var annInfo = new globalObject.AnnounceInfo();
                annInfo.annid = annid;
                annInfo.content = request.req.arr[0].content;
                annInfo.title = request.req.arr[0].title;
                announceDb.addAnnounceList(request.req.channelId, annInfo, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AddAnnounce;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 删除公告
 */
var CS_DelAnnounce = (function() {

    /**
     * 构造函数
     */
    function CS_DelAnnounce() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DelAnnounce.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.channelId
            || null == request.req.annid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.channelId = parseInt(request.req.channelId);
        request.req.annid = parseInt(request.req.annid);

        if(isNaN(request.req.channelId) || isNaN(request.req.annid)) {
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
                announceDb.isExistAnnid(request.req.channelId, request.req.annid, callback);
            },

            function(isExist, callback) {
                if(isExist <= 0){
                    res.msg = gmCode.GMERR_ANNIDNOTEXIST;
                    callback(gmCode.GM_PARAM_ERR);
                }
                else{
                    announceDb.delAnnounceList(request.req.channelId, request.req.annid, callback);
                }
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_DelAnnounce;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加礼包码礼包
 */
var CS_AddActivationGift = (function() {

    /**
     * 构造函数
     */
    function CS_AddActivationGift() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AddActivationGift.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.giftType
            || null == request.req.useMax
            || null == request.req.name
            || null == request.req.codeNum
            || null == request.req.media
            || null == request.req.beginTime
            || null == request.req.endTime
            || null == request.req.items
            || null == request.req.description
            || null == request.req.channelId) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.giftType = parseInt(request.req.giftType);
        request.req.useMax = parseInt(request.req.useMax);
        request.req.codeNum = parseInt(request.req.codeNum);
        request.req.beginTime = parseInt(request.req.beginTime);
        request.req.endTime = parseInt(request.req.endTime);
        request.req.channelId = parseInt(request.req.channelId);

        if(isNaN(request.req.giftType) || isNaN(request.req.useMax) || isNaN(request.req.codeNum) ||
            isNaN(request.req.beginTime) || isNaN(request.req.endTime) || isNaN(request.req.channelId)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        for(var i = 0; i < request.req.items.length; ++i) {
            if(null == request.req.items[i]
                || null == request.req.items[i].tid
                || null == request.req.items[i].name
                || null == request.req.items[i].itemNum) {
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }

            request.req.items[i].tid = parseInt(request.req.items[i].tid);
            request.req.items[i].itemNum = parseInt(request.req.items[i].itemNum);

            if(isNaN(request.req.items[i].tid) || isNaN(request.req.items[i].itemNum)) {
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var activationGiftInfo = new globalObject.ActivationGiftInfo();
        async.waterfall([
            /* 获取礼包码礼包自增id */
            function(callback) {
                activationGiftDb.incrAddActivationGiftId(callback);
            },

            /* 添加礼包码礼包对象 */
            function(agId, callback) {
                activationGiftInfo.agId = agId; /*自增id*/
                activationGiftInfo.giftType = request.req.giftType; /*礼包类型*/
                activationGiftInfo.useMax = request.req.useMax;  /*使用上限*/
                activationGiftInfo.name = request.req.name;  /*礼包名称*/
                activationGiftInfo.codeNum = request.req.codeNum > 2500 ? 2500 : request.req.codeNum;  /*生成数量*/
                activationGiftInfo.media = request.req.media;  /*媒体*/
                activationGiftInfo.beginTime = request.req.beginTime;  /*开始时间（utc时间）*/
                activationGiftInfo.endTime = request.req.endTime;  /*结束时间（utc时间）*/
                for(var i=0; i<request.req.items.length; i++){
                    var itemObj = new globalObject.ItemBase();
                    itemObj.tid = request.req.items[i].tid;
                    itemObj.itemNum = request.req.items[i].itemNum;
                    activationGiftInfo.items.push(itemObj);/*附件物品*/
                }
                activationGiftInfo.description = request.req.description;  /*礼包描述*/
                activationGiftInfo.channelId = request.req.channelId; /*渠道id*/
                activationGiftDb.addActivationGift(activationGiftInfo, callback);
            },

            /* 生成礼包码，并保存到数据库 */
            function(callback){
                activationGiftDb.addActivationCode(activationGiftInfo, function(err, codeArr, result){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    var failNum = 0; /*码生成失败的数量*/
                    for(var i=0; i<result.length; i++){
                        if(result[i] == 0){
                            codeArr[i] = '';
                            failNum ++;
                        }
                    }
                    /* 写BI */
                    logger.logBI(0, biCode.logs_gm_code, 0, '', '', '', activationGiftInfo.agId, activationGiftInfo.giftType, activationGiftInfo.useMax,
                        activationGiftInfo.name, JSON.stringify(request.req.items), activationGiftInfo.codeNum, activationGiftInfo.media,
                        activationGiftInfo.beginTime, activationGiftInfo.endTime, (codeArr.length - failNum), codeArr);
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AddActivationGift;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 热更新csv文件
 */
var CS_HotUpdateCSV = (function() {

    /**
     * 构造函数
     */
    function CS_HotUpdateCSV() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_HotUpdateCSV.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.fileName) {
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
                callback(null);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_HotUpdateCSV;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 删除礼包码礼包
 */
var CS_DelActivationGift = (function() {

    /**
     * 构造函数
     */
    function CS_DelActivationGift() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DelActivationGift.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.agid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.agid = parseInt(request.req.agid);

        if(isNaN(request.req.agid)) {
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
                activationGiftDb.delActivationGift(request.req.agid, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_DelActivationGift;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询服务器信息
 */
var CS_QueryServerInfo = (function() {

    /**
     * 构造函数
     */
    function CS_QueryServerInfo() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryServerInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
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
                accountDb.getAllZoneInfo(function(err, zoneList){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                        return;
                    }
                    res.res.arr = zoneList;
                    callback(null);
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryServerInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 注册状态查询
 */
var CS_QueryRegister = (function() {

    /**
     * 构造函数
     */
    function CS_QueryRegister() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryRegister.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
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
                accountDb.getRegisterInfo(function(err, state){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                    }
                    else{
                        res.res.state = state;
                        callback(null);
                    }
                });
            },

            function(callback) {
                accountDb.getAllRegisterNum(function(err, num){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                    }
                    else{
                        res.res.totalmembers = num;
                        callback(null);
                    }
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryRegister;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改注册状态
 */
var CS_AlterRegister = (function() {

    /**
     * 构造函数
     */
    function CS_AlterRegister() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AlterRegister.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.state) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.state = parseInt(request.req.state);

        if(isNaN(request.req.state)) {
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
                accountDb.getRegisterInfo(function(err, state){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                    }
                    else{
                        if(request.req.state == state){
                            res.msg = gmCode.GMERR_REGISTERSTATE;
                            callback(gmCode.GM_PARAM_ERR);
                        }
                        else{
                            callback(null);
                        }
                    }
                });
            },

            function(callback) {
                accountDb.setRegisterInfo(request.req.state, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AlterRegister;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取所有道具列表
 */
var CS_GetAllItemList = (function() {

    /**
     * 构造函数
     */
    function CS_GetAllItemList() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetAllItemList.prototype.handleProtocol = function (request, response) {
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

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            function(callback) {
                var itemList = csvManager.ItemId();
                var arrItemList = [];
                for(var key in itemList){
                    arrItemList.push(itemList[key]);
                }
                res.res.arr = arrItemList;
                callback(null);
            },
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_GetAllItemList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询渠道返利
 */
var CS_QueryChannelRate = (function() {

    /**
     * 构造函数
     */
    function CS_QueryChannelRate() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryChannelRate.prototype.handleProtocol = function (request, response) {
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

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            function(callback) {
                activityTimeDb.getAllChannelRate(function(err, data){
                    if(err){
                        res.msg = gmCode.GMERR_QUERYREDISFAIL;
                        callback(err);
                    }
                    else{
                        res.res = data;
                        callback(null);
                    }
                });
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_QueryChannelRate;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改渠道返利
 */
var CS_AlterChannelRate = (function() {

    /**
     * 构造函数
     */
    function CS_AlterChannelRate() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AlterChannelRate.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.channelId
            || null == request.req.rate) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.channelId = parseInt(request.req.channelId);

        if(isNaN(request.req.channelId) || isNaN(request.req.rate)) {
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
                var channelRate = new globalObject.ChannelRateInfo;
                channelRate.channelId = request.req.channelId;
                channelRate.rate = request.req.rate;
                activityTimeDb.setChannelRate(channelRate, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AlterChannelRate;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改公告
 */
var CS_AlterAnnounce = (function() {

    /**
     * 构造函数
     */
    function CS_AlterAnnounce() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AlterAnnounce.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.channelId
            || null == request.req.arr) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.channelId = parseInt(request.req.channelId);

        if(isNaN(request.req.channelId)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        for(var i = 0; i < request.req.arr.length; ++i) {
            if(null == request.req.arr[i]
                || null == request.req.arr[i].annid
                || null == request.req.arr[i].content
                || null == request.req.arr[i].title) {
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }

            request.req.arr[i].annid = parseInt(request.req.arr[i].annid);

            if(isNaN(request.req.arr[i].annid)) {
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        async.waterfall([
            function(callback){
                if(request.req.arr.length != 1){/*只处理一个对象*/
                    callback(gmCode.GM_PARAM_ERR);
                    return;
                }
                announceDb.isExistAnnid(request.req.channelId, request.req.arr[0].annid, callback);
            },

            function(isExist, callback) {
                if(isExist <= 0){
                    res.msg = gmCode.GMERR_ANNIDNOTEXIST;
                    callback(gmCode.GM_PARAM_ERR);
                }
                else{
                    var annInfo = new globalObject.AnnounceInfo();
                    annInfo.annid = request.req.arr[0].annid;
                    annInfo.content = request.req.arr[0].content;
                    annInfo.title = request.req.arr[0].title;
                    announceDb.addAnnounceList(request.req.channelId, annInfo, callback);
                }
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, '', '', request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, '', '', request, true);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_AlterAnnounce;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push([gmCmd.GM_QUERYROLLPLAYING, new CS_QueryRollPlaying()]);
    exportProtocol.push([gmCmd.GM_ADDROLLPLAYING, new CS_AddRollPlaying()]);
    exportProtocol.push([gmCmd.GM_DELROLLPLAYING, new CS_DelRollPlaying()]);
    exportProtocol.push([gmCmd.GM_QUERYANNOUNCE, new CS_QueryAnnounce()]);
    exportProtocol.push([gmCmd.GM_ADDANNOUNCE, new CS_AddAnnounce()]);
    exportProtocol.push([gmCmd.GM_DELANNOUNCE, new CS_DelAnnounce()]);
    exportProtocol.push([gmCmd.GM_ADDACTIVATIONGIFT, new CS_AddActivationGift()]);
    exportProtocol.push([gmCmd.GM_HOTUPDATECSV, new CS_HotUpdateCSV()]);
    exportProtocol.push([gmCmd.GM_DELACTIVATIONGIFT, new CS_DelActivationGift()]);
    exportProtocol.push([gmCmd.GM_QUERYSERVERINFO, new CS_QueryServerInfo()]);
    exportProtocol.push([gmCmd.GM_QUERYREGISTER, new CS_QueryRegister()]);
    exportProtocol.push([gmCmd.GM_ALTERREGISTER, new CS_AlterRegister()]);
    exportProtocol.push([gmCmd.GM_GETALLITEMLIST, new CS_GetAllItemList()]);
    exportProtocol.push([gmCmd.GM_QUERYCHANNELRATE, new CS_QueryChannelRate()]);
    exportProtocol.push([gmCmd.GM_ALTERCHANNELRATE, new CS_AlterChannelRate()]);
    exportProtocol.push([gmCmd.GM_ALTERANNOUNCE, new CS_AlterAnnounce()]);

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
