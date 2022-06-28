/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：账号登录功能
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var md5 = require('MD5');
var request = require('request');
var packets = require('../packets/login_sdk');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var sdkAccountDb = require('../database/sdk_account');
var accountDb = require('../database/account');
var simplePost = require('../../tools/net/http_request').simplePost;
var cfgSdk = require('../../../server_config/sdk.json');
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');

const apiKey = 'v8nqcwj7pzwr8uxr';

var CS_SDKLogin = (function() {

    /**
     * 构造函数
     */
    function CS_SDKLogin() {
        this.reqProtocolName = packets.pCSSDKLogin;
        this.resProtocolName = packets.pSCSDKLogin;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SDKLogin.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SDKLogin();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.token
                || null == req.id
                || null == req.data
                || null == req.channelId
                || null == req.deviceId
                || null == req.channel
                || null == req.systemSoftware
                || null == req.systemHardware
                || null == req.ip
                || null == req.mac) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            req.channelId = parseInt(req.channelId);

            if(isNaN(req.channelId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var answer = null;
            async.waterfall([
                function(callback) {
                    var sdkReqBody = {};
                    sdkReqBody.id = req.id;
                    sdkReqBody.token = req.token;
                    sdkReqBody.data =  req.data;
                    sdkReqBody.sign = md5(req.id + '|' + req.token + '|' + req.data + '|'+ apiKey);
                    var urlSite = cfgSdk.sdkServer +  req.channelId + cfgSdk.sdkLogin;
                    simplePost(urlSite, sdkReqBody, callback);
                },
                function(header, body, callback) {
                    try{
                        answer = JSON.parse(body);
                    }catch (e) {
                        if(e) {
                            callback(retCode.SDK_BODY_ERR);
                            return;
                        }
                    }
                    if(!answer) {
                        callback(retCode.SDK_BODY_NULL);
                        return;
                    }
                    if(0 != answer.code) {
                        res.sdkErr = answer.code;
                        callback(retCode.SDK_LOGIN_FAILED);
                        return;
                    }
                    res.channelUid = answer.id;

                    if(typeof (answer.token) == "string") {
                        res.channelToken = answer.token;
                    }
                    sdkAccountDb.checkAccExist(req.channelId, answer.id, callback);
                },
                function(uid, callback) {
                    if(null != uid) {
                        res.uid = '' + uid;
                        callback(null);
                        return;
                    }
                    sdkAccountDb.generateUid(req.channelId, answer.id, function(err, uid) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.uid = '' + uid;
                        var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress;
                        /* 写BI */
                        logger.logBI(0, biCode.logs_user_create, req.deviceId, answer.id, 0, req.channel, uid, req.vs, req.systemSoftware, req.systemHardware, ip, req.mac);
                        callback(null);
                    });
                },
                function(callback) {
                    var loginTokenExpire = 24 * 3600; /* 登陆token有效期 */
                    var channelInfo = {};
                    res.token = md5((new Date()).toString()) + md5(res.uid) + md5(Math.random());
                    channelInfo.channel = req.channelId;
                    channelInfo.id = answer.id;
                    accountDb.bindUidWithLoginToken(res.token, res.uid, loginTokenExpire);
                    sdkAccountDb.bindChannelInfoWithUid( res.uid, channelInfo, callback);
                }
                /*
                function(callback) {
                    sdkAccountDb.bindMacWithUid(res.uid, req.mac ,callback);
                }
                */
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    logger.LoggerGame.info(err, JSON.stringify(answer));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_SDKLogin;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */

function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_SDKLogin());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
