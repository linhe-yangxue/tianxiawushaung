
/**
 * 包含的头文件
 */
var packets = require('../packets/revelry');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var revelryDb = require('../database/revelry');
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var logsWater = require('../../common/logs_water');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获得开服狂欢列表
 */
var CS_GetRevelryList = (function() {

    /**
     * 构造函数
     */
    function CS_GetRevelryList() {
        this.reqProtocolName = packets.pCSGetRevelryList;
        this.resProtocolName = packets.pSCGetRevelryList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetRevelryList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetRevelryList();
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

                /* 获取区信息 */
                function(callback) {
                    accountDb.getZoneInfo(req.zid, callback);
                },

                /*  10天后清空狂欢 */
                function(zoneInfo, callback) {
                    var tenDaysAfter = (new Date(zoneInfo.openDate)).setHours(0).valueOf() + 10 * 24 * 3600 * 1000;
                    var endTime = (new Date((new Date(tenDaysAfter)).toDateString())).valueOf();

                    if(Date.now() > endTime) {
                        callback(retCode.SUCCESS);
                    }
                    else {
                        callback(null);
                    }
                },

                /* 获取狂欢领取状态 */
                function(callback) {
                    revelryDb.getAllRevelriesObjects(req.zid, req.zuid, callback);
                },

                /* 获取狂欢进度 */
                function(revelries, callback) {
                    res.revelryArr = revelries;
                    revelryDb.getAllRevelriesTypeProgress(req.zid, req.zuid, callback);
                },

                /* 狂欢对象填充进度 */
                function(progs, callback) {
                    for(var i = 0; i < res.revelryArr.length; ++i) {
                        var hrLine = csvManager.HDrevelry()[res.revelryArr[i].revelryId];
                        if(!hrLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }

                        /* 进度 */
                        var value = parseInt(progs[hrLine.TYPE]);
                        res.revelryArr[i].progress = value;
                    }
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
    return CS_GetRevelryList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取开服狂欢奖励
 */
var CS_TakeRevelryAward = (function() {

    /**
     * 构造函数
     */
    function CS_TakeRevelryAward() {
        this.reqProtocolName = packets.pCSTakeRevelryAward;
        this.resProtocolName = packets.pSCTakeRevelryAward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_TakeRevelryAward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_TakeRevelryAward();
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
                || null == req.revelryId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.revelryId = parseInt(req.revelryId);

            if(isNaN(req.zid) || isNaN(req.revelryId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            /* 回传给客户端用 */
            res.revelryId = req.revelryId;

            var openTime; /* 开服时间 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取区信息 */
                function(callback) {
                    accountDb.getZoneInfo(req.zid, callback);
                },

                /*  10天后清空狂欢 */
                function(zoneInfo, callback) {
                    openTime = (new Date(zoneInfo.openDate)).setHours(0, 0, 0, 0).valueOf();
                    var tenDaysAfter = openTime + 10 * 24 * 3600 * 1000;

                    if(Date.now() > tenDaysAfter) {
                        callback(retCode.REVELRY_END);
                    }
                    else {
                        var rvLine = csvManager.HDrevelry()[req.revelryId];
                        if (!rvLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        revelryDb.getRevelryProgress(req.zid, req.zuid, rvLine.TYPE, callback);
                    }
                },

                /* 检查狂欢进度 */
                function(progress, callback) {
                    var rvLine = csvManager.HDrevelry()[req.revelryId];
                    if(Date.now() < openTime + (rvLine.DAY - 1) * 24 * 3600 * 1000) {
                        callback(retCode.REVELRY_NOT_BEGIN);
                        return;
                    }

                    if (revelryDb.isRankType(rvLine.TYPE)) {
                        if (progress > rvLine.NUMBER) {
                            callback(retCode.REVELRY_NOT_COMPLETE);
                            return;
                        }
                    }
                    else { /* 其他狂欢 */
                        if (progress < rvLine.NUMBER) {
                            callback(retCode.REVELRY_NOT_COMPLETE);
                            return;
                        }
                    }

                    revelryDb.AcceptedRevelryAward(req.zid, req.zuid, req.revelryId, callback);
                },

                /* 发送奖励 */
                function(callback) {
                    var rvLine = csvManager.HDrevelry()[req.revelryId];
                    var itemStrArr = rvLine.REWARD.split('|');
                    var arrAdd = [];
                    for(var i = 0; i < itemStrArr.length; ++i) {
                        var item = new globalObject.ItemBase();
                        item.tid = parseInt(itemStrArr[i].split('#')[0]);
                        item.itemNum = parseInt(itemStrArr[i].split('#')[1]);
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc,
                        logsWater.TASEREVELRY_AWARD, req.revelryId, function(err, retSub, retAdd) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            var arrEx = []; /* 不是背包中的物品 */
                            for(var i = 0 ; i < arrAdd.length; ++i) {
                                var inPackage = false;
                                for(var j = 0; j < retAdd.length; ++j) {
                                    if(arrAdd[i].tid == retAdd[j].tid) {
                                        inPackage = true;
                                        break;
                                    }
                                }
                                if(!inPackage) {
                                    arrEx.push(arrAdd[i]);
                                }
                            }
                            res.awards = retAdd.concat(arrEx);
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
    return CS_TakeRevelryAward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetRevelryList());
    exportProtocol.push(new CS_TakeRevelryAward());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
