
/**
 * 包含的头文件
 */
var packets = require('../packets/roll_playing');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var rollPlayingDb = require('../database/roll_playing');
var announceDb = require('../database/announce');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 请求走马灯
 */
var CS_GetRollPlaying = (function() {

    /**
     * 构造函数
     */
    function CS_GetRollPlaying() {
        this.reqProtocolName = packets.pCSGetRollPlaying;
        this.resProtocolName = packets.pSCGetRollPlaying;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetRollPlaying.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetRollPlaying();
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

                function(callback){
                    var arrResult = [];
                    var nowTime = parseInt(new Date().getTime()/1000);
                    rollPlayingDb.getRollPlayingList(function(err, result){
                        if(err){
                            return callback(err);
                        }
                        for(var i=0; i<result.length; i++){
                            if(result && (result[i].overdue == 0) && nowTime > result[i].beginTime && nowTime < result[i].endTime){
                                arrResult.push(result[i]);
                            }
                        }
                        res.arr = arrResult;
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
    return CS_GetRollPlaying;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 请求公告
 */
var CS_GetAnnounce = (function() {

    /**
     * 构造函数
     */
    function CS_GetAnnounce() {
        this.reqProtocolName = packets.pCSGetAnnounce;
        this.resProtocolName = packets.pSCGetAnnounce;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetAnnounce.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetAnnounce();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.channelId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.channelId = parseInt(req.channelId);

            if(isNaN(req.channelId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* 获取最新公告 */
                function(callback) {
                    announceDb.getAnnounceList(req.channelId, function(err, annInfo){
                        if(err){
                            callback(err);
                        }
                        if(annInfo){
                            res.arr = annInfo;
                            callback(null);
                        }
                        else{
                            callback(null);
                        }
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
    return CS_GetAnnounce;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetRollPlaying());
    exportProtocol.push(new CS_GetAnnounce());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
