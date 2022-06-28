/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：账号相关功能：注册、登陆、获取登陆历史、游戏服登陆
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：floven [审阅完成]
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var md5 = require('MD5');
var packets = require('../packets/account');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var whiteListDb = require('../database/white_list');
var sevenActivityDb = require('../database/activity/seven_day_login');
var cRevelry = require('../common/revelry');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var packageVerifyDb = require('../database/package_verify.js');
var dateFormat = require('dateformat');
var cZuid = require('../common/zuid');
var cfgControl = require('../../../server_config/control.json');
var timeUtil = require('../../tools/system/time_util');
const gameTokenOutTime = 24 * 3600; /* game token超时时间(秒)*/

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 注册
 */
var CS_Register = (function() {

    /**
     * 构造函数
     */
    function CS_Register() {
        this.reqProtocolName = packets.pCSRegister;
        this.resProtocolName = packets.pSCRegister;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_Register.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_Register();
        res.pt = this.resProtocolName;
        var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {

            /* 校验参数 */
            if(null == req
                || null == req.channel
                || null == req.acc
                || null == req.pw
                || null == req.registtype
                || null == req.deviceId
                || null == req.channelUserId
                || null == req.systemSoftware
                || null == req.systemHardware
                || null == req.ip
                || null == req.mac) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.registtype = parseInt(req.registtype);

            if(isNaN(req.registtype)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            res.registtype = req.registtype;
            var userAccount = new globalObject.UserAccount();
            /* 快速登陆注册 */
            if (globalObject.REGIST_TYPE_QUICK == req.registtype) {
                async.waterfall([
                    /* 注册账号 */
                    function (callback) {
                        userAccount.acc = md5(Math.random() + (new Date()).toDateString() + Math.random());
                        userAccount.pw = md5(Math.random());
                        userAccount.channel = req.channel;
                        userAccount.regtoken = md5(req.acc + Math.random());
                        accountDb.registerAccount(userAccount,  function(err, uid) {
                            if(retCode.ACCOUNT_EXIST == err) {
                                res.accExists = 1;
                                callback(retCode.SUCCESS);
                            }
                            else {
                                userAccount.uid = uid;
                                callback(err);
                            }
                        });
                    },

                    /* 账号绑定token */
                    function (callback) {
                        res.regtoken = userAccount.regtoken;
                        accountDb.bindUserAccountWithRegToken(userAccount, function(err) {
                            callback(err);
                        });
                    }

                ], function (err) {
                    if (err && err !== retCode.SUCCESS) {
                        logger.LoggerGame.info(err, JSON.stringify(req));
                        http.sendResponseWithResultCode(response, res, err);
                    }
                    else {
                        /* 写BI */
                        logger.logBI(0, biCode.logs_user_create, req.deviceId, req.channelUserId, 0, req.channel, userAccount.uid, req.clientVersion, req.systemSoftware, req.systemHardware, ip, req.mac);
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                });
            }
            /* 普通注册 */
            else if (globalObject.REGIST_TYPE_CHECK == req.registtype) {
                userAccount.acc = req.acc;
                userAccount.pw = md5(req.pw);
                userAccount.channel = req.channel;
                accountDb.registerAccount(userAccount, function (err, uid) {
                    if(retCode.ACCOUNT_EXIST == err) {
                        err = null;
                        res.accExists = 1;
                    }

                    if (err) {
                        logger.LoggerGame.info(err, JSON.stringify(req));
                        http.sendResponseWithResultCode(response, res, err);
                    }
                    else {
                        /* 写BI */
                        logger.logBI(0, biCode.logs_user_create, req.deviceId, req.channelUserId, 0, req.channel, uid, req.clientVersion, req.systemSoftware, req.systemHardware, ip, req.mac);
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                });
            }
            /* 错误的注册方式 */
            else {
                logger.LoggerGame.info(retCode.RRGISTER_TYPE_ERR, JSON.stringify(req));
                http.sendResponseWithResultCode(response, res, retCode.RRGISTER_TYPE_ERR);
            }
        });
    };
    return CS_Register;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 账号登陆
 */
var CS_Login = (function() {

    /**
     * 构造函数
     */
    function CS_Login() {
        this.reqProtocolName = packets.pCSLogin;
        this.resProtocolName = packets.pSCLogin;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_Login.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_Login();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.registtype
                || null == req.regtoken
                || null == req.channel
                || null == req.acc
                || null == req.pw
                || null == req.ip
                || null == req.mac) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.registtype = parseInt(req.registtype);

            if(isNaN(req.registtype)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* 登陆参数预处理 */
                function(callback) {
                    /* 普通登陆密码md5 */
                    if (req.registtype != globalObject.REGIST_TYPE_QUICK) {
                        req.pw = md5(req.pw);
                        callback(null);
                        return;
                    }
                    /* 快速登陆先取出用户名密码 */
                    accountDb.getUserAccountByRegToken(req.regtoken , function(err, userAccount) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            req.acc = userAccount.acc;
                            req.channel = userAccount.channel;
                            req.pw = userAccount.pw;
                            callback(null);
                        }
                    });
                },
                /* 获取账号对象 */
                function(callback) {
                    accountDb.getUserAccountByChannelAcc(req.channel, req.acc, callback);
                },
                /* 设置返回值 */
                function(userAccount, callback) {
                    if (req.pw != userAccount.pw) {
                        callback(retCode.PASSWORD_EROR);
                        return;
                    }

                    res.uid = '' + userAccount.uid;
                    res.tk = md5((new Date()).toString()) + md5(res.uid) + md5(Math.random());
                    var loginTokenExpire = 24 * 3600; /* 登陆token有效期 */
                    accountDb.bindUidWithLoginToken(res.tk, res.uid, loginTokenExpire);

                    callback(null);
                }

            ],function(err) {
                if(err == retCode.ACCOUNT_NOT_EXIST || err == retCode.REGTOKEN_NOT_EXIST) {
                    res.accNotExists = 1;
                    err = retCode.SUCCESS;
                }

                if(err == retCode.PASSWORD_EROR) {
                    res.wrongPw = 1;
                    err = retCode.SUCCESS;
                }

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
    return CS_Login;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 区列表
 */
var CS_ZoneList = (function() {

    /**
     * 构造函数
     */
    function CS_ZoneList() {
        this.reqProtocolName = packets.pCSZoneList;
        this.resProtocolName = packets.pSCZoneList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ZoneList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ZoneList();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.mac) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var uid;
            async.waterfall([
                /* 登陆网络令牌验证 */
                function(callback) {
                    accountDb.getUidByLoginToken(req.tk, callback);
                },

                /* 获取所有区 */
                function(userId, callback) {
                    uid = userId;
                    accountDb.getAllZoneInfo(callback);
                },

                /* 获取登陆历史 */
                function(zones, callback) {
                    for(var i = 0; i < zones.length; ++i) {
                        if(null == zones[i]) {
                            continue;
                        }
                        var infoOfZone = new protocolObject.InfoOfZone();
                        infoOfZone.zid = zones[i].zid;
                        infoOfZone.zname = zones[i].name;
                        infoOfZone.zstate = zones[i].state;
                        if(zones[i].playerCnt >= zones[i].maxRegister) {
                            infoOfZone.zstate = 6;
                        }
                        res.zoneInfos.push(infoOfZone);
                    }

                    accountDb.getLoginHistoryList(uid, callback);
                },

                /* 根据白名单改变返回区状态 */
                function (loginInfos, callback) {
                    for(var i = 0; i < res.zoneInfos.length; ++i) {
                        for(var j = 0; j < loginInfos.length; ++j) {
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
    return CS_ZoneList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 游戏登陆
 */
var CS_GameServerLogin = (function() {

    /**
     * 构造函数
     */
    function CS_GameServerLogin() {
        this.reqProtocolName = packets.pCSGameServerLogin;
        this.resProtocolName = packets.pSCGameServerLogin;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GameServerLogin.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GameServerLogin();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.zid
                || null == req.zuid
                || null == req.tk
                || null == req.mac
                || null == req.deviceId
                || null == req.clientVersion
                || null == req.systemSoftware
                || null == req.systemHardware
                || null == req.ip
                || null == req.channel
                || null == req.isWifi) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.zuid = parseInt(req.zuid);
            req.isWifi = parseInt(req.isWifi);

            if((isNaN(req.zid) && isNaN(req.zuid)) || isNaN(req.isWifi)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            /* 因为客户端发的字段名无法更改，此处原本应该发uid */
            req.uid = req.zuid;
            var zoneInfo; /* 区信息 */

            async.waterfall([
                /* 获取区状态 */
                function(callback) {
                    accountDb.getZoneInfo(req.zid, callback);
                },

                /* 获取区状态 */
                function(result, callback) {
                    zoneInfo = result;

                    res.openDate = zoneInfo.openDate;
                    res.zid = zoneInfo.areaId;
                    res.zuid = cZuid.zidUidJoin(req.zid, req.uid);
                    callback(null);
                },

                /* 检查注册人数上限 */
                function(callback) {
                    if (zoneInfo.playerCnt >= zoneInfo.maxRegister) {
                        playerDb.isPlayerCreated(res.zid, res.zuid, function (err, created) {
                            if (err) {
                                callback(err);
                            }
                            else if (created) {
                                callback(null);
                            }
                            else {
                                callback(retCode.ZONE_NOT_OPEN);
                            }
                        });
                        return;
                    }
                    callback(null);
                },

                /* 检查区状态 */
                function(callback) {
                    if(zoneInfo.state >= 1 && zoneInfo.state <= 3) {
                        callback(null);
                        return;
                    }

                    if(zoneInfo.state == 4) {
                        whiteListDb.isInWhiteList(req.zid, req.mac, function(err, result) {
                            if (err) {
                                callback(err);
                            }
                            else if(result) {
                                callback(null);
                            }
                            else {
                                callback(retCode.ZONE_ONLY_WHITE_LIST);
                            }
                        });
                        return;
                    }

                    callback(retCode.ZONE_NOT_OPEN);
                },

                /* 登陆token验证 */
                function(callback) {
                    accountDb.getUidByLoginToken(req.tk, callback);
                },

                /* 验证封号 */
                function(uid, callback) {
                    if(uid != req.uid) {
                        callback(retCode.LOGIN_TIMEOUT);
                        return;
                    }

                    accountDb.getSealAccountInfo(req.zid, cZuid.zidUidJoin(req.zid, req.uid), function(err, sealAccountInfo) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        var now = parseInt(Date.now() / 1000);
                        if(sealAccountInfo && (now > sealAccountInfo.beginTime && now < sealAccountInfo.endTime)) {
                            res.isSeal = 1;
                            callback(retCode.SUCCESS); /* 不往下执行 */
                        }
                        else {
                            callback(null);
                        }
                    });
                },

                /* 生成游戏token */
                function(callback) {
                    res.gtk = md5( req.uid + '' + Math.random() + Math.random() + Math.random() );
                    accountDb.setGameToken(res.zid, res.zuid, res.gtk, gameTokenOutTime, req.mac, callback);
                },

                /* 更新数据 */
                function(callback) {
                    /* 增加区的渠道 */
                    accountDb.addChannelInZone(req.zid, req.channel);

                    /* 开服狂欢 */
                    var day = Math.ceil((parseInt(Date.now() / 1000) - timeUtil.getDetailTime(zoneInfo.openDate, 0)) / (24 * 3600));
                    if(day >= 1 && day <= 7) {
                        cRevelry.updateRevelryProgress(res.zid, res.zuid, 1, day);
                    }

                    /* 清空包序号 */
                    if(cfgControl.packageVerify) {
                        packageVerifyDb.delPackageIndex(req.zid, req.uid);
                    }
                    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress;
                    playerDb.getPlayerData(res.zid, res.zuid, true, function(err, player) {
                        if(err == retCode.PLAYER_NOT_EXIST) { /* 首次登陆没有创角 */
                            /* 写BI */
                            logger.logBI(req.zid, biCode.logs_user_login, req.deviceId, req.zid, req.channel, res.zuid, ip, req.mac, 0, req.clientVersion, req.systemSoftware, req.systemHardware, req.isWifi);
                            callback(null);
                            return;
                        }

                        if(err) {
                            callback(err);
                            return;
                        }

                        player.lastLoginTime = parseInt(Date.now() / 1000);
                        playerDb.savePlayerData(res.zid, res.zuid, player, true, callback);

                        /* 写BI */
                        logger.logBI(req.zid, biCode.logs_user_login, req.deviceId, req.zid, req.channel, res.zuid, ip, req.mac, player.character.level, req.clientVersion, req.systemSoftware, req.systemHardware, req.isWifi);
                    });
                },
                function(callback) {
                    var date = new Date().toDateString();
                    date = dateFormat(date, 'yyyy-mm-dd');
                    sevenActivityDb.updateLastLoginDate(res.zid, res.zuid, date, function(err, lastDate) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        var diff = new Date(date) - new Date(lastDate);
                        if(diff) {
                            sevenActivityDb.incrLoginDay(res.zid, res.zuid, function() {}); /* 递增登录天数 */
                        }
                        callback(null);
                    });
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GameServerLogin;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 心跳
 */
var CS_Heartbeat = (function() {

    /**
     * 构造函数
     */
    function CS_Heartbeat() {
        this.reqProtocolName = packets.pCSHeartbeat;
        this.resProtocolName = packets.pSCHeartbeat;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_Heartbeat.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_Heartbeat();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.channel) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var preZid = 0;
            async.waterfall([
                /* 验证game token */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    /* 更新最后心跳时间 */
                    playerDb.updateLastHBTime(req.zid,req.zuid);

                    /* 增加渠道在线人数 */
                    preZid = cZuid.zuidSplit(req.zuid)[0];
                    accountDb.incrZoneOnlinePlayerCnt(preZid, req.channel);

                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    logger.logBI(preZid, biCode.logs_online_info, preZid, req.channel,req.zuid,req.zuid);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_Heartbeat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];

    if(cfgControl.cheatProtocal) {
        exportProtocol.push(new CS_Register());
        exportProtocol.push(new CS_Login());
    }
    exportProtocol.push(new CS_ZoneList());
    exportProtocol.push(new CS_GameServerLogin());
    exportProtocol.push(new CS_Heartbeat());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
