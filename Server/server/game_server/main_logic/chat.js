
/**
 * 包含的头文件
 */
var packets = require('../packets/chat');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var chatDb = require('../database/chat');
var playerDb =require('../database/player');
var protocolObject = require('../../common/protocol_object');
var itemType = require('../common/item_type');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送私聊
 */
var CS_SendPrivateChat = (function() {

    /**
     * 构造函数
     */
    function CS_SendPrivateChat() {
        this.reqProtocolName = packets.pCSSendPrivateChat;
        this.resProtocolName = packets.pSCSendPrivateChat;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SendPrivateChat.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SendPrivateChat();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.msg
            || null == req.targetId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player1 = null;
            var player2 = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取自己的player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, result) {
                        player1 = result;
                        callback(err);
                    });
                },

                /* 获取对方的player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.targetId, false, function(err, result) {
                        player2 = result;
                        callback(err);
                    });
                },

                /* 保存聊天 */
                function(callback) {
                    var chatRecord = new protocolObject.ChatRecord();
                    chatRecord.zuid = req.zuid;
                    chatRecord.name = player1.name;
                    chatRecord.charTid = player1.character.tid;
                    chatRecord.msg = req.msg;
                    chatRecord.targetName = player2.name;
                    chatDb.addPrivateChatRecord(req.zid, req.zuid, chatRecord, callback);
                    chatDb.addPrivateChatRecord(req.zid, req.targetId, chatRecord, callback);
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
    return CS_SendPrivateChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取私聊
 */
var CS_RcvPrivateChat = (function() {

    /**
     * 构造函数
     */
    function CS_RcvPrivateChat() {
        this.reqProtocolName = packets.pCSRcvPrivateChat;
        this.resProtocolName = packets.pSCRcvPrivateChat;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RcvPrivateChat.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RcvPrivateChat();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.rcdIndex) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.rcdIndex = parseInt(req.rcdIndex);

            if(isNaN(req.zid) || isNaN(req.rcdIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取聊天纪录 */
                function(callback) {
                    chatDb.getPrivateChatRecord(req.zid, req.zuid, req.rcdIndex, callback);
                },
                /* 设置返回值 */
                function(arrRcd, nxtIndex, callback) {
                    res.arr = arrRcd;
                    res.rcdIndex = nxtIndex;
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
    return CS_RcvPrivateChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送公会聊天
 */
var CS_SendGuildChat = (function() {

    /**
     * 构造函数
     */
    function CS_SendGuildChat() {
        this.reqProtocolName = packets.pCSSendGuildChat;
        this.resProtocolName = packets.pSCSendGuildChat;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SendGuildChat.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SendGuildChat();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.msg) {
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
                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },
                /* 设置返回值 */
                function(player, callback) {
                    if(player.guildId <= 0) {
                        res.kicked = 1;
                        callback(retCode.SUCCESS);
                        return;
                    }

                    var chatRecord = new protocolObject.ChatRecord();
                    chatRecord.zuid = req.zuid;
                    chatRecord.name = player.name;
                    chatRecord.charTid = player.character.tid;
                    chatRecord.msg = req.msg;
                    chatDb.addGuildChatRecord(req.zid, player.guildId, chatRecord, callback);
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
    return CS_SendGuildChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取公会聊天
 */
var CS_RcvGuildChat = (function() {

    /**
     * 构造函数
     */
    function CS_RcvGuildChat() {
        this.reqProtocolName = packets.pCSRcvGuildChat;
        this.resProtocolName = packets.pSCRcvGuildChat;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RcvGuildChat.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RcvGuildChat();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.rcdIndex) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.rcdIndex = parseInt(req.rcdIndex);

            if(isNaN(req.zid) || isNaN(req.rcdIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },
                /* 获取聊天纪录 */
                function(player, callback) {
                    if(player.guildId <= 0) {
                        res.kicked = 1;
                        callback(retCode.SUCCESS);
                        return;
                    }

                    chatDb.getGuildChatRecord(req.zid, player.guildId, req.rcdIndex, callback);
                },
                /* 设置返回值 */
                function(arrRcd, nxtIndex, callback) {
                    res.arr = arrRcd;
                    res.rcdIndex = nxtIndex;
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
    return CS_RcvGuildChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送世界聊天
 */
var CS_SendWorldChat = (function() {

    /**
     * 构造函数
     */
    function CS_SendWorldChat() {
        this.reqProtocolName = packets.pCSSendWorldChat;
        this.resProtocolName = packets.pSCSendWorldChat;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SendWorldChat.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SendWorldChat();
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
            || null == req.msg) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player = null;
            var time = new Date().getTime()/1000;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, playerData) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        player = playerData;

                        /* 是否禁言 */
                        if(player.dontChatInfo.beginTime > 0) {
                            if(time > player.dontChatInfo.beginTime && time < player.dontChatInfo.endTime) {
                                res.isDontChat = 1;
                                callback(retCode.SUCCESS); /* 不往下执行 */
                                return;
                            }
                        }
                        callback(null);
                    });
                },

                /* 获取世界聊天次数 */
                function(callback) {
                    chatDb.getWorldChatCnt(req.zid, req.zuid, callback);
                },

                /* 检查聊天次数，扣除元宝 */
                function(cnt, callback) {
                    if(cnt >= 10) {
                        var arrSub = [];
                        var item = new protocolObject.ItemObject();
                        item.tid = itemType.ITEM_TYPE_DIAMOND;
                        item.itemNum = 10;
                        arrSub.push(item);
                        cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, [], req.channel, req.acc, logsWater.SENDWORLDCHAT_LOGS, item.tid, function(err) {
                            callback(err);
                        });
                    }
                    else {
                        callback(null);
                    }
                },

                function(callback) {
                    /*加聊天次数*/
                    chatDb.incrWorldChatCnt(req.zid, req.zuid);

                    /* 设置返回值 */
                    var chatRecord = new protocolObject.ChatRecord();
                    chatRecord.zuid = req.zuid;
                    chatRecord.name = player.name;
                    chatRecord.charTid = player.character.tid;
                    chatRecord.msg = req.msg;

                    chatDb.addWorldChatRecord(req.zid, chatRecord, callback);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /*写BT*/
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_world_chat, preZid, req.channel, req.zuid, req.zuid, req.msg);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_SendWorldChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取世界聊天
 */
var CS_RcvWorldChat = (function() {

    /**
     * 构造函数
     */
    function CS_RcvWorldChat() {
        this.reqProtocolName = packets.pCSRcvWorldChat;
        this.resProtocolName = packets.pSCRcvWorldChat;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RcvWorldChat.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RcvWorldChat();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid
            || null == req.rcdIndex) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.rcdIndex = parseInt(req.rcdIndex);

            if(isNaN(req.zid) || isNaN(req.rcdIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取聊天纪录 */
                function(callback) {
                    chatDb.getWorldChatRecord(req.zid, req.rcdIndex, callback);
                },
                /* 设置返回值 */
                function(arrRcd, nxtIndex, callback) {
                    res.arr = arrRcd;
                    res.rcdIndex = nxtIndex;
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
    return CS_RcvWorldChat;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取世界聊天次数
 */
var CS_GetWorldChatCnt = (function() {

    /**
     * 构造函数
     */
    function CS_GetWorldChatCnt() {
        this.reqProtocolName = packets.pCSGetWorldChatCnt;
        this.resProtocolName = packets.pSCGetWorldChatCnt;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetWorldChatCnt.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetWorldChatCnt();
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

                function(callback) {
                    chatDb.getWorldChatCnt(req.zid, req.zuid, function(err, result) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.cnt = result;
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
    return CS_GetWorldChatCnt;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_SendPrivateChat());
    exportProtocol.push(new CS_RcvPrivateChat());
    exportProtocol.push(new CS_SendGuildChat());
    exportProtocol.push(new CS_RcvGuildChat());
    exportProtocol.push(new CS_SendWorldChat());
    exportProtocol.push(new CS_RcvWorldChat());
    exportProtocol.push(new CS_GetWorldChatCnt());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

