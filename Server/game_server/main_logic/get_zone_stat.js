
/**
 * 包含的头文件
 */
var packets = require('../packets/zone');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var whiteListDb = require('../database/white_list');
var protocolObject = require('../../common/protocol_object');
var cZuid = require('../common/zuid');
var playerDb = require('../database/player');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 更新某个区的状态
 */
var CS_GetZoneState = (function() {

    /**
     * 构造函数
     */
    function CS_GetZoneState() {
        this.reqProtocolName = packets.pCSGetZoneState;
        this.resProtocolName = packets.pSCGetZoneState;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetZoneState.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetZoneState();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var uid = null;
            var zoneInfo = null;
            async.waterfall([
                /* 获取uid */
                function(callback) {
                    accountDb.getUidByLoginToken(req.tk, callback);
                },
                /* 获取区信息 */
                function(tmpUid, callback) {
                    uid = tmpUid;
                    accountDb.getZoneInfo(req.zid, callback);
                },
                function(tmpZoneInfo, callback) {
                    zoneInfo = tmpZoneInfo;
                    if(null == zoneInfo) {
                        callback(retCode.ZONE_NOT_EXIST);
                        return;
                    }
                    res.state = zoneInfo.state;
                    if(zoneInfo.state != 4) {
                        callback(null);
                        return;
                    }
                    if(null == req.mac) {
                        callback(retCode.LOGIN_TIMEOUT);
                        return;
                    }
                    whiteListDb.isInWhiteList(req.zid,  req.mac, function(err, result) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(result) {
                            res.state = 1;
                        }
                        callback(null);
                    });
                },
                /* 获取登录历史 */
                function(callback) {
                    if(res.state != 5 && res.state != 4 && zoneInfo.playerCnt >= zoneInfo.maxRegister) { /* 已达最大注册人数 状态改为爆满 */
                        res.state = 6;
                    }
                    var zid = zoneInfo.areaId;
                    var zuid = cZuid.zidUidJoin(req.zid, uid);
                    playerDb.isPlayerCreated(zid, zuid, callback);
                },
                function(flag, callback) {
                    if(flag &&  res.state == 6) {  /* 若是老账号 则为火爆 */
                        res.state = 2;
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
    return CS_GetZoneState;
})();

/**
 * 分页获取区列表
 */
var CS_PageZoneList = (function() {

    /**
     * 构造函数
     */
    function CS_PageZoneList() {
        this.reqProtocolName = packets.pCSPageZoneList;
        this.resProtocolName = packets.pSCPageZoneList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PageZoneList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PageZoneList();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.mac
                || null == req.page
                || null == req.cnt) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.page = parseInt(req.page);
            req.cnt = parseInt(req.cnt);

            if(false || isNaN(req.page) || isNaN(req.cnt)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var uid = null;
            async.waterfall([
                /* 登陆网络令牌验证 */
                function(callback) {
                    accountDb.getUidByLoginToken(req.tk, callback);
                },

                /* 获取所有区 */
                function(userId, callback) {
                    uid = userId;
                    accountDb.getPageZoneInfos(req.page, req.cnt, callback);
                },

                /* 获取登陆历史 */
                function(zones, callback) {
                    for(var i = 0, len = zones.length; i < len; ++i) {
                        var infoOfZone = new protocolObject.InfoOfZone();
                        infoOfZone.zid = zones[i].zid;
                        infoOfZone.zname = zones[i].name;
                        infoOfZone.zstate = zones[i].state;
                        if(zones[i].playerCnt >= zones[i].maxRegister && zones[i].state != 4 && zones[i].state != 5) {
                            infoOfZone.zstate = 6;
                        }
                        res.zoneInfos.push(infoOfZone);
                    }

                    accountDb.getLoginHistoryList(uid, callback);
                },

                /* 根据白名单改变返回区状态 */
                function (loginInfos, callback) {
                    for(var i = 0, len = res.zoneInfos.length; i < len; ++i) {
                        for(var j = 0, length = loginInfos.length; j < length; ++j) {
                            if(null == loginInfos[j]) {
                                continue;
                            }
                            if(res.zoneInfos[i].zid == loginInfos[j].zid) {
                                if(6 == res.zoneInfos[i].zstate) { /* 老玩家为火爆状态 */
                                    res.zoneInfos[i].zstate = 2;
                                }
                                res.zoneInfos[i].pname = loginInfos[j].name;
                                res.zoneInfos[i].plevel = loginInfos[j].level;
                                res.zoneInfos[i].lastTime = loginInfos[j].lastTime;
                            }
                        }
                    }

                    async.each(res.zoneInfos, function(zoneInfo, eachCb) {
                        if(zoneInfo.zstate != 4) {
                            eachCb(null);
                            return;
                        }
                        whiteListDb.isInWhiteList(zoneInfo.zid, req.mac, function(err, result) {
                            if(err) {
                                eachCb(err);
                            }
                            else {
                                if (result) {
                                    zoneInfo.zstate = 3;
                                }
                                eachCb(null);
                            }
                        });
                    }, callback);
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
    return CS_PageZoneList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetZoneState());
    exportProtocol.push(new CS_PageZoneList());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
