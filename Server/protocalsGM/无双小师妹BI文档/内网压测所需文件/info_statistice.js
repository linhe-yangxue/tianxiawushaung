
/**
 * 包含的头文件
 */
var packets = require('../packets/info_statistice');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');
var rand = require('../../tools/system/math').rand;
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * App首次启动
 */
var CS_AppLaunch = (function() {

    /**
     * 构造函数
     */
    function CS_AppLaunch() {
        this.reqProtocolName = packets.pCSAppLaunch;
        this.resProtocolName = packets.pSCAppLaunch;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AppLaunch.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_AppLaunch();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.deviceId
            || null == req.channel
            || null == req.ip
            || null == req.clientVersion
            || null == req.systemSoftware
            || null == req.systemHardware
            || null == req.mac) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress;
            /* 写BI */
            var all = rand(6000,10000);
            for(var i=0; i<all; i++){
                logger.logBI(0, biCode.logs_app_launch, req.deviceId, req.channel, ip, req.clientVersion, req.systemSoftware, req.systemHardware, req.mac);
                logger.logBI(0, biCode.logs_app_load_step, req.deviceId, req.channel, req.clientVersion, req.systemSoftware, req.systemHardware, 1, 1);
                logger.logBI(0, biCode.logs_app_update, req.deviceId, req.channel, req.clientVersion, req.systemSoftware, req.systemHardware, '0.0.0.0', '0.0.0.1', 30);
                logger.logBI(0, biCode.logs_character_step, '', 0, req.channel, req.zuid, req.zuid, req.clientVersion, req.systemSoftware, req.systemHardware, 1, 2, 'test');
                logger.logBI(0, biCode.logs_user_create, req.deviceId, 1, 0, req.channel, 5, req.clientVersion, req.systemSoftware, req.systemHardware, '127.0.0.1', 'aaa');
                logger.logBI(0, biCode.logs_character_create, 0, req.channel, req.zuid, req.zuid, req.playerName, req.chaModelIndex, 1, req.systemSoftware, req.systemHardware);
                logger.logBI(0, biCode.logs_character_level_up, 0, req.channel,'0:5','0:5', 0, 10, 0, 0);
                logger.logBIHaveTime(0, biCode.logs_online_users, '2016-03-17 10:59:59', 0, 0, 0, 100);
                logger.logBI(0, biCode.logs_user_login, req.deviceId, 0, req.channel, '0:5', '127.0.0.1', 'aaa', 0, req.clientVersion, req.systemSoftware, req.systemHardware, 1);
                logger.logBI(0, biCode.logs_user_money_change, 0, req.channel,'0:5','0:5', 1, 1, 'test', '', 0, 10, 1, 2, 1);
                logger.logBI(0, biCode.logs_battleachv, 0, req.channel,'0:5','0:5', 1, 1, '', '', 0, 10, 1, 2, 1);
                logger.logBI(0, biCode.logs_user_yuanbao_change, 0, req.channel,'0:5','0:5', 1, 1, '', '', 0, 10, 1, 2, 1);

            }
            http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
        });
    };
    return CS_AppLaunch;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * App首次加载步骤
 */
var CS_AppLoadStep = (function() {

    /**
     * 构造函数
     */
    function CS_AppLoadStep() {
        this.reqProtocolName = packets.pCSAppLoadStep;
        this.resProtocolName = packets.pSCAppLoadStep;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AppLoadStep.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_AppLoadStep();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.deviceId
            || null == req.channel
            || null == req.clientVersion
            || null == req.systemSoftware
            || null == req.systemHardware
            || null == req.step
            || null == req.interval) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.step = parseInt(req.step);
            req.interval = parseInt(req.interval);

            if(isNaN(req.step) || isNaN(req.interval)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            /* 写BI */
            logger.logBI(0, biCode.logs_app_load_step, req.deviceId, req.channel, req.clientVersion, req.systemSoftware, req.systemHardware, req.step, req.interval);
            http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
        });
    };
    return CS_AppLoadStep;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * App热更新
 */
var CS_AppUpdate = (function() {

    /**
     * 构造函数
     */
    function CS_AppUpdate() {
        this.reqProtocolName = packets.pCSAppUpdate;
        this.resProtocolName = packets.pSCAppUpdate;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AppUpdate.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_AppUpdate();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.deviceId
            || null == req.channel
            || null == req.clientVersion
            || null == req.systemSoftware
            || null == req.systemHardware
            || null == req.gameVersion1
            || null == req.gameVersion2
            || null == req.updateTime) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.updateTime = parseInt(req.updateTime);

            if(isNaN(req.updateTime)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            /* 写BI */
            logger.logBI(0, biCode.logs_app_update, req.deviceId, req.channel, req.clientVersion, req.systemSoftware, req.systemHardware, req.gameVersion1, req.gameVersion2, req.updateTime);
            http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
        });
    };
    return CS_AppUpdate;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_AppLaunch());
    exportProtocol.push(new CS_AppLoadStep());
    exportProtocol.push(new CS_AppUpdate());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
