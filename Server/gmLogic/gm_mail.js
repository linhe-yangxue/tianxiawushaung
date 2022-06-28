
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

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送邮件
 */
var CS_SendMail = (function() {

    /**
     * 构造函数
     */
    function CS_SendMail() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SendMail.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.title
            || null == request.req.content
            || null == request.req.items) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(false || isNaN(request.req.zid)) {
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

            if(false || isNaN(request.req.items[i].tid) || isNaN(request.req.items[i].itemNum)) {
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

            function(callback) {
                callback(null);
            },

            function(callback) {
                callback(null);
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
    return CS_SendMail;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 定制邮件
 */
var CS_CustomMadeMail = (function() {

    /**
     * 构造函数
     */
    function CS_CustomMadeMail() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_CustomMadeMail.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.beginTime
            || null == request.req.endTime
            || null == request.req.title
            || null == request.req.content
            || null == request.req.items
            || null == request.req.minUserLev
            || null == request.req.maxUserLev
            || null == request.req.minVipLev
            || null == request.req.maxVipLev
            || null == request.req.gid
            || null == request.req.minGuildLev
            || null == request.req.maxGuildLev) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.beginTime = parseInt(request.req.beginTime);
        request.req.endTime = parseInt(request.req.endTime);
        request.req.minUserLev = parseInt(request.req.minUserLev);
        request.req.maxUserLev = parseInt(request.req.maxUserLev);
        request.req.minVipLev = parseInt(request.req.minVipLev);
        request.req.maxVipLev = parseInt(request.req.maxVipLev);
        request.req.minGuildLev = parseInt(request.req.minGuildLev);
        request.req.maxGuildLev = parseInt(request.req.maxGuildLev);

        if(false || isNaN(request.req.zid) || isNaN(request.req.beginTime) || isNaN(request.req.endTime) || isNaN(request.req.minUserLev) || isNaN(request.req.maxUserLev) || isNaN(request.req.minVipLev) || isNaN(request.req.maxVipLev) || isNaN(request.req.minGuildLev) || isNaN(request.req.maxGuildLev)) {
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

            if(false || isNaN(request.req.items[i].tid) || isNaN(request.req.items[i].itemNum)) {
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

            function(callback) {
                callback(null);
            },

            function(callback) {
                callback(null);
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
    return CS_CustomMadeMail;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_SendMail()]);
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_CustomMadeMail()]);

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
