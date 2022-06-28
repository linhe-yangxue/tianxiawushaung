
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
var protocolObject = require('../../common/protocol_object');
var allServerMailDb = require('../database/all_server_mail');
var playerDb = require('../database/player');
var sendMailCommon = require('../common/send_mail');
var customMadeMailDb = require('../database/custom_made_mail');

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
            || null == request.req.title
            || null == request.req.content
            || null == request.req.items) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(isNaN(request.req.zid)) {
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

        var items = [];
        var successName = [];/*成功的角色名集合*/
        async.waterfall([
            /* GM消息中附件信息转换为protocolObject.ItemObject结构 */
            function(callback){
                for(var i=0; i < request.req.items.length; i++){
                    if(request.req.items[i].itemNum <= 0){
                        continue;
                    }
                    var itemObject = new protocolObject.ItemObject();
                    itemObject.tid = request.req.items[i].tid;
                    itemObject.itemNum = request.req.items[i].itemNum;
                    items.push(itemObject);
                }
                callback(null);
            },

            function(callback) {
                if(null == request.req.name || request.req.name.length <= 0){
                    /* 全服发 */
                    var allServerMail = new globalObject.AllServerMailInfo();
                    allServerMail.mailTitle = request.req.title;  /*邮件标题*/
                    allServerMail.mailContent = request.req.content;  /*邮件内容*/
                    allServerMail.mailTime = parseInt(new Date().getTime() / 1000);  /*邮件生成时间*/
                    allServerMail.items = items; /*附件物品，ItemObject对象数组*/
                    allServerMailDb.insertAllServerMail(request.req.zid, allServerMail, callback);
                }
                else{
                    async.each(request.req.name, function (aName, eachCb) {
                        /* 获取uid */
                        playerDb.getZuidByPreZidName(request.req.zid, aName, function (err, uid){
                            if (!err) {
                                var mailInfo = new sendMailCommon.MailInfo();
                                mailInfo.zid = request.req.zid;
                                mailInfo.uid = uid;
                                mailInfo.mailTitle = request.req.title;  /*邮件标题*/
                                mailInfo.mailContent = request.req.content;  /*邮件内容*/
                                mailInfo.items = items;
                                sendMailCommon.sendMail(mailInfo);
                                successName.push(aName);
                            }
                            eachCb(null);
                        });
                    }, callback);
                }
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

        if(isNaN(request.req.zid) || isNaN(request.req.beginTime) || isNaN(request.req.endTime) || isNaN(request.req.minUserLev)
            || isNaN(request.req.maxUserLev) || isNaN(request.req.minVipLev) || isNaN(request.req.maxVipLev)
            || isNaN(request.req.minGuildLev) || isNaN(request.req.maxGuildLev)) {
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

        var items = [];
        async.waterfall([
            /* GM消息中附件信息转换为protocolObject.ItemObject结构 */
            function(callback){
                for(var i=0; i < request.req.items.length; i++){
                    if(request.req.items[i].itemNum <= 0){
                        continue;
                    }
                    var itemObject = new protocolObject.ItemObject();
                    itemObject.tid = request.req.items[i].tid;
                    itemObject.itemNum = request.req.items[i].itemNum;
                    items.push(itemObject);
                }
                callback(null);
            },

            function(callback) {
                var customMadeMail = new globalObject.CustomMadeMailInfo();
                customMadeMail.beginTime = request.req.beginTime;/*开始时间 utc时间*/
                customMadeMail.endTime = request.req.endTime;/*结束时间 utc时间*/
                customMadeMail.title = request.req.title;/*邮件标题*/
                customMadeMail.content = request.req.content;/*邮件内容*/
                customMadeMail.items = items; /*附件物品，ItemObject对象数组 */
                customMadeMail.minUserLev = request.req.minUserLev;/*最小的角色等级(不限制填0)*/
                customMadeMail.maxUserLev = request.req.maxUserLev;/*最大的角色等级(不限制填0)*/
                customMadeMail.minVipLev = request.req.minVipLev;/*最小的vip等级(不限制填0)*/
                customMadeMail.maxVipLev = request.req.maxVipLev;/*最大的vip等级(不限制填0)*/
                customMadeMail.gid = request.req.gid;/*公会id(不限制填'')*/
                customMadeMail.minGuildLev = request.req.minGuildLev;/*最小的公会等级(不限制填0)*/
                customMadeMail.maxGuildLev = request.req.maxGuildLev;/*最大的公会等级(不限制填0)*/
                customMadeMailDb.insertCustomMadeMail(request.req.zid, customMadeMail, callback);
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
    return CS_CustomMadeMail;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push([gmCmd.GM_SENDMAIL, new CS_SendMail()]);
    exportProtocol.push([gmCmd.GM_CUSTOMMADEMAIL, new CS_CustomMadeMail()]);

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
