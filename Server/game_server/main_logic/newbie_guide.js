/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：新手引导
 * 开发者：王强
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/newbie_guide');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var guideDb = require('../database/newbie_guide');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 保存新手引导
 */
var CS_SaveGuideProgress = (function() {

    /**
     * 构造函数
     */
    function CS_SaveGuideProgress() {
        this.reqProtocolName = packets.pCSSaveGuideProgress;
        this.resProtocolName = packets.pSCSaveGuideProgress;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SaveGuideProgress.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SaveGuideProgress();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid
                || null == req.guideProgress
                || null == req.guideIndex
                || null == req.deviceId
                || null == req.clientVersion
                || null == req.systemSoftware
                || null == req.systemHardware
                || null == req.name) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.guideProgress = parseInt(req.guideProgress);
            req.guideIndex = parseInt(req.guideIndex);

            if(isNaN(req.zid) || isNaN(req.guideProgress) || isNaN(req.guideIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    /* 获取上次新手引导进度 */
                    guideDb.getGuideProgress(req.zid, req.zuid, callback);
                },
                function(progress, callback) {
                    /* 保存新手引导 */
                    if(progress == 10000) {
                        guideDb.saveGuideProgress(req.zid, req.zuid, req.guideProgress);
                    } else if(req.guideProgress > progress) {
                        guideDb.saveGuideProgress(req.zid, req.zuid, req.guideProgress);
                    }
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_character_step, '', preZid, req.channel, req.zuid, req.zuid,
                        req.clientVersion, req.systemSoftware, req.systemHardware, req.guideProgress, req.guideIndex, req.name);
                    callback(null);
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
    return CS_SaveGuideProgress;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 请求新手引导
 */
var CS_QueryGuideProgress = (function() {

    /**
     * 构造函数
     */
    function CS_QueryGuideProgress() {
        this.reqProtocolName = packets.pCSQueryGuideProgress;
        this.resProtocolName = packets.pSCQueryGuideProgress;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryGuideProgress.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_QueryGuideProgress();
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
                /* 获取上次新手引导进度 */
                function(callback) {
                    guideDb.getGuideProgress(req.zid, req.zuid, callback);
                },
                function(progress, callback) {
                    res.resGuideProgress = progress;
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_QueryGuideProgress;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_SaveGuideProgress());
    exportProtocol.push(new CS_QueryGuideProgress());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

