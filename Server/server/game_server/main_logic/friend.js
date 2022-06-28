/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：好友：查找玩家好友信息、申请添加好友、获取好友推荐列表、获取好友申请列表、获取好友列表、
 * 　　同意加为好友、拒绝加为好友、删除好友、获取精力赠送列表、赠送精力
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：floven [已修改] （需要在2015-10-09前完成优化）
 * 优化建议：
 *      1. （位置：warning01）注解符号和开发规范不一致
 *      2. （位置：warning02）注解符号和开发规范不一致
 *      3. （位置：warning03）注解符号和开发规范不一致
 *      4. （位置：warning04）注解符号和开发规范不一致
 *      5.  全部注解符号和开发规范不一致，修改
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/friend');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var friendDb  =  require('../database/friend');
var cPackage = require('../common/package');
var itemType = require('../common/item_type');
var logger = require('../../manager/log4_manager');
var notifDb = require('../database/notification');
var cNotif = require('../common/notification');
var cMission = require('../common/mission');
var biCode = require('../../common/bi_code');
var reasonOne = require('../../common/logs_water');
var robot = require('../../common/robot');
var cZuid = require('../common/zuid');
var csvManager = require('../../manager/csv_manager').Instance();
var guildDb = require('../database/guild');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友信息
 * @param zid 区Id
 * @param zuid 角色Id
 * @param callback 返回错误码和结果
 */
function getFirendInfo(zid, zuid, callback) {
    var player;
    var friendInfo = new protocolObject.FriendInfo();

    async.waterfall([
        function(wcb) {
            playerDb.getPlayerData(zid, zuid, false, wcb);
        },

        function(result, wcb) {
            player = result;

            friendInfo.friendId = zuid;
            friendInfo.name = player.name;
            friendInfo.level = player.character.level;
            friendInfo.lastLoginTime = player.lastLoginTime;
            friendInfo.icon = player.character.tid;
            friendInfo.power = player.power;

            wcb(null);
        },

        /* 获取公会名 */
        function(wcb) {
            guildDb.getGuildInfoByGid(zid, player.guildId, false, function(err, result) {
                if(retCode.GUILD_NOT_EXIST == err) {
                    err = null;
                }
                if(result) {
                    friendInfo.guildName = result.name;
                }
                wcb(err);
            });
        }

    ], function(err) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, friendInfo);
        }
    });
}

/**
 * 查找玩家好友信息
 */
var CS_SearchFriendInfo = (function() {

    /**
     * 构造函数
     */
    function CS_SearchFriendInfo() {
        this.reqProtocolName = packets.pCSSearchFriendInfo;
        this.resProtocolName = packets.pSCSearchFriendInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SearchFriendInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SearchFriendInfo();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.name) {
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

                /* 获取zuid数组 */
                function(callback) {
                    playerDb.getAllzuidByZidName(req.zid, req.name, callback);
                },

                /* 设置返回值 */
                function(zuids, callback) {
                    async.eachSeries(zuids, function(zuid, cb) {
                        getFirendInfo(req.zid, zuid, function(err, result) {
                            if(err) {
                                cb(err);
                                return;
                            }

                            res.arr.push(result);
                            cb(null);
                        });
                    }, callback);
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
    return CS_SearchFriendInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 申请添加好友
 */
var CS_SendFriendRequest = (function() {

    /**
     * 构造函数
     */
    function CS_SendFriendRequest() {
        this.reqProtocolName = packets.pCSSendFriendRequest;
        this.resProtocolName = packets.pSCSendFriendRequest;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [] 通讯协议的请求对象
     * @param response 通讯协议的响应对象
     */
    CS_SendFriendRequest.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SendFriendRequest();
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
                || null == req.friendId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid) || req.zuid == req.friendId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var friendNum = 0;
            var friendLimit = csvManager.PowerReword()[1].FRIEND_NUM;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 检查自己的好友列表 */
                function(callback) {
                    friendDb.getFriendList(req.zid, req.zuid, callback);
                },
                function(selfFriendList, callback) {
                    /* 双方已经是好友 */
                    if (selfFriendList.indexOf(req.friendId) != -1) {
                        res.friendsAlready = 1;
                        callback(retCode.SUCCESS);
                        return;
                    }

                    friendNum = selfFriendList.length;
                    /* 自己的好友数量已达上限 */
                    if (selfFriendList.length >= friendLimit) {
                        callback(retCode.SELF_FRIEND_FULL);
                        return;
                    }

                    callback(null);
                },

                /* 检查对方的好友申请列表 */
                function(callback) {
                    friendDb.getFriendRequestList(req.zid, req.friendId, callback);
                },

                function(otherSideFriendRequestList, callback) {
                    /* 已经向对方发出过申请 */
                    if (otherSideFriendRequestList.indexOf(req.zuid) != -1) {
                        callback(retCode.SUCCESS);
                        return;
                    }

                    /* 对方好友申请列表已满 */
                    if (otherSideFriendRequestList.length >= friendLimit) {
                        res.friendReqFull = 1;
                        callback(retCode.SUCCESS);
                        return;
                    }

                    /* 更新对方好友申请列表 */
                    friendDb.addFriendReq(req.zid, req.zuid, req.friendId);
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_friends, preZid, req.channel, req.zuid, req.zuid, 0, friendNum, 1, req.friendId);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_SendFriendRequest;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友推荐列表
 */
var CS_GetFriendRcmdList = (function() {

    /**
     * 构造函数
     */
    function CS_GetFriendRcmdList() {
        this.reqProtocolName = packets.pCSGetFriendRcmdList;
        this.resProtocolName = packets.pSCGetFriendRcmdList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetFriendRcmdList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetFriendRcmdList();
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

                /* 获取好友推荐列表 */
                function(callback) {
                    playerDb.randomZuidsInZone(req.zid,  callback);
                },

                /* 从推荐列表中去除好友 */
                function(friendRcmdList, callback) {
                    friendDb.getFriendList(req.zid, req.zuid, function(err, friendList) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        var RcmdList = [];
                        for(var i = 0; i < friendRcmdList.length; ++i) {
                            var friendId = friendRcmdList[i];

                            if(robot.checkIfRobot(friendId)) {
                                continue;
                            }

                            if(friendId == req.zuid) {
                                continue;
                            }

                            if(friendList.indexOf(friendId) != -1) {
                                continue;
                            }

                            RcmdList.push(friendId);
                        }

                        callback(null, RcmdList);
                    });
                },

                /* 从推荐列表中去除好友申请 */
                function(friendRcmdList, callback) {
                    friendDb.getFriendRequestList(req.zid, req.zuid, function(err, requestList) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        var RcmdList = [];
                        for(var i = 0; i < friendRcmdList.length; ++i) {
                            var firendId = friendRcmdList[i];

                            if(RcmdList.length >= 10) {
                                break;
                            }

                            if(requestList.indexOf(firendId) != -1) {
                                continue;
                            }

                            RcmdList.push(firendId);
                        }

                        callback(null, RcmdList);
                    });
                },

                /* 设置返回值 */
                function(RcmdList, callback) {
                    async.map(RcmdList, function(zuid, cb) {
                        getFirendInfo(req.zid, zuid, function(err, result) {
                            if(err) {
                                cb(err);
                                return;
                            }

                            cb(null, result);
                        });
                    }, function (err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.arr = data;
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
    return CS_GetFriendRcmdList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友申请列表
 */
var CS_GetFriendRequestList = (function() {

    /**
     * 构造函数
     */
    function CS_GetFriendRequestList() {
        this.reqProtocolName = packets.pCSGetFriendRequestList;
        this.resProtocolName = packets.pSCGetFriendRequestList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetFriendRequestList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetFriendRequestList();
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

                /* 获取好友申请列表 */
                function(callback) {
                    friendDb.getFriendRequestList(req.zid, req.zuid, callback);
                },
                /* 设置返回值 */
                function(friendRequestList, callback) {
                    async.map(friendRequestList, function(zuid, cb) {
                        getFirendInfo(req.zid, zuid, function(err, result) {
                            if(err) {
                                cb(err);
                                return;
                            }

                            cb(null, result);
                        });
                    }, function (err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.arr = data;
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
    return CS_GetFriendRequestList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友列表
 */
var CS_GetFriendList = (function() {

    /**
     * 构造函数
     */
    function CS_GetFriendList() {
        this.reqProtocolName = packets.pCSGetFriendList;
        this.resProtocolName = packets.pSCGetFriendList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetFriendList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetFriendList();
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

                /* 获取好友申请列表 */
                function(callback) {
                    friendDb.getFriendList(req.zid, req.zuid, callback);
                },
                /* 设置返回值 */
                function(friendList, callback) {
                    async.map(friendList, function(zuid, cb) {
                        getFirendInfo(req.zid, zuid, function(err, result) {
                            if(err) {
                                cb(err);
                                return;
                            }

                            cb(null, result);
                        });
                    }, function (err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.arr = data;
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
    return CS_GetFriendList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 同意加为好友
 */
var CS_AcceptFriendRequest = (function() {

    /**
     * 构造函数
     */
    function CS_AcceptFriendRequest() {
        this.reqProtocolName = packets.pCSAcceptFriendRequest;
        this.resProtocolName = packets.pSCAcceptFriendRequest;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AcceptFriendRequest.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_AcceptFriendRequest();
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
                || null == req.friendId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var friendNum = 0;
            var friendLimit = csvManager.PowerReword()[1].FRIEND_NUM;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 在自己的好友申请列表删除对方 */
                function(callback) {
                    friendDb.delFriendReq(req.zid, req.zuid, req.friendId, callback);
                },

                /* 检查自己的好友列表 */
                function(delSuccess, callback) {
                    if(!delSuccess) {
                        callback(retCode.OTHER_SIDE_NOT_REQED);
                        return;
                    }

                    friendDb.getFriendList(req.zid, req.zuid, callback);
                },
                function(selfFriendList, callback) {
                    /* 双方已经是好友 */
                    if(selfFriendList.indexOf(req.friendId) != -1) {
                        callback(retCode.SUCCESS);
                        return;
                    }

                    friendNum = selfFriendList.length;
                    /* 自己的好友数量已达上限 */
                    if(selfFriendList.length >= friendLimit) {
                        res.friendFull = 2;
                        callback(retCode.SUCCESS);
                        return;
                    }

                    callback(null);
                },

                /* 检查对方的好友列表 */
                function(callback) {
                    friendDb.getFriendList(req.zid, req.friendId, callback);
                },
                function(otherSideFriendList, callback) {
                    /* 对方好友列表已满 */
                    if(otherSideFriendList.length >= friendLimit) {
                        res.friendFull = 1;
                        callback(retCode.SUCCESS);
                        return;
                    }

                    /* 成为好友 */
                    friendDb.becomeFriends(req.zid, req.zuid, req.friendId);
                    /* 更新通知 */
                    notifDb.addNotification(req.zid, req.friendId, cNotif.NOTIF_FRIEND_CHANGE);
                    callback(null);
                }
            ],function(err) {
                if(err && err != retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_friends, preZid, req.channel, req.zuid, req.zuid, 0, friendNum, 2, req.friendId);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_AcceptFriendRequest;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 拒绝加为好友
 */
var CS_RejectFriendRequest = (function() {

    /**
     * 构造函数
     */
    function CS_RejectFriendRequest() {
        this.reqProtocolName = packets.pCSRejectFriendRequest;
        this.resProtocolName = packets.pSCRejectFriendRequest;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RejectFriendRequest.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RejectFriendRequest();
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
                || null == req.friendId) {
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

                /* 删除好友请求 */
                function(callback) {
                    friendDb.delFriendReq(req.zid, req.zuid, req.friendId, callback);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_friends, preZid, req.channel, req.zuid, req.zuid, 0, 0, 4, req.friendId);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_RejectFriendRequest;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 删除好友
 */
var CS_DeleteFriend = (function() {

    /**
     * 构造函数
     */
    function CS_DeleteFriend() {
        this.reqProtocolName = packets.pCSDeleteFriend;
        this.resProtocolName = packets.pSCDeleteFriend;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_DeleteFriend.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_DeleteFriend();
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
                || null == req.friendId) {
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

                /* 解除好友关系 */
                function(callback) {
                    friendDb.noMoreFriends(req.zid, req.zuid, req.friendId);
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_friends, preZid, req.channel, req.zuid, req.zuid, 0, 0, 3, req.friendId);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_DeleteFriend;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取精力赠送列表
 */
var CS_GetSpiritSendList = (function() {

    /**
     * 构造函数
     */
    function CS_GetSpiritSendList() {
        this.reqProtocolName = packets.pCSGetSpiritSendList;
        this.resProtocolName = packets.pSCGetSpiritSendList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetSpiritSendList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetSpiritSendList();
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

                /* 获取精力赠送列表 */
                function(callback) {
                    friendDb.getSpiritSendList(req.zid, req.zuid, callback);
                },

                function(spiritList, callback) {
                    res.arr = spiritList;
                    callback(null);
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
    return CS_GetSpiritSendList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 赠送精力
 */
var CS_SendSpirit = (function() {

    /**
     * 构造函数
     */
    function CS_SendSpirit() {
        this.reqProtocolName = packets.pCSSendSpirit;
        this.resProtocolName = packets.pSCSendSpirit;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SendSpirit.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SendSpirit();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.friendId) {
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

                /* 检查双方是否是好友 */
                function(callback) {
                    friendDb.isFriends(req.zid, req.zuid, req.friendId, callback);
                },

                /* 添加赠送记录 */
                function(isFriends, callback) {
                    if(!isFriends) {
                        callback(retCode.NOT_FRIENDS);
                        return;
                    }

                    friendDb.addSpiritSendRcd(req.zid, req.zuid, req.friendId, callback);
                },

                /* 好友添加精力 */
                function(sendSuccess, callback) {
                    if(!sendSuccess) {
                        callback(retCode.FRIEND_SPIRIT_SENDED);
                        return;
                    }

                    /* 更新任务进度*/
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_3, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_3, 0,  0, 1);
                    callback(null);
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
    return CS_SendSpirit;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取精力领取列表
 */
var CS_GetSpiritRcvList = (function() {

    /**
     * 构造函数
     */
    function CS_GetSpiritRcvList() {
        this.reqProtocolName = packets.pCSGetSpiritRcvList;
        this.resProtocolName = packets.pSCGetSpiritRcvList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetSpiritRcvList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetSpiritRcvList();
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
                    friendDb.getSpiritRevList(req.zid, req.zuid, callback);
                },

                function(rcvList, callback) {
                    res.arr = rcvList;
                    friendDb.getSpiritRcvCnt(req.zid, req.zuid, callback);
                },

                function(rcvCnt, callback) {
                    res.leftCnt = csvManager.PowerReword()[1].REWORD_NUM - rcvCnt;
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
    return CS_GetSpiritRcvList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取精力
 */
var CS_RcvSpirit = (function() {

    /**
     * 构造函数
     */
    function CS_RcvSpirit() {
        this.reqProtocolName = packets.pCSRcvSpirit;
        this.resProtocolName = packets.pSCRcvSpirit;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RcvSpirit.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RcvSpirit();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.friendIds) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var rcvdCnt; /* 精力领取次数 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取领取次数 */
                function (callback) {
                    friendDb.getSpiritRcvCnt(req.zid, req.zuid, callback);
                },

                function(result, callback) {
                    rcvdCnt = result;
                    var leftCnt = csvManager.PowerReword()[1].REWORD_NUM - rcvdCnt;

                    var toRcv = [];
                    for(var i = 0; i < leftCnt && i < req.friendIds.length; ++i) {
                        toRcv.push(req.friendIds[i]);
                    }

                    async.each(toRcv, function(friendId, ecb) {
                        friendDb.delRcdInSpiritRcvList(req.zid, req.zuid, friendId, function(err, result) {
                            if(result) {
                                res.idRcv.push(friendId);
                            }
                            ecb(err);
                        });
                    }, callback);
                },

                function(callback) {
                    friendDb.setSpiritRcvCnt(req.zid, req.zuid, rcvdCnt + res.idRcv.length);

                    var arrAdd = [];
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_SPIRIT;
                    item.itemNum = csvManager.PowerReword()[1].EVERY_TIME_NUM;
                    arrAdd.push(item);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, reasonOne.SENDSPIRIT_LOGS, item.tid, function(err) {
                        callback(err);
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
    return CS_RcvSpirit;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_SearchFriendInfo());
    exportProtocol.push(new CS_SendFriendRequest());
    exportProtocol.push(new CS_GetFriendRcmdList());
    exportProtocol.push(new CS_GetFriendRequestList());
    exportProtocol.push(new CS_GetFriendList());
    exportProtocol.push(new CS_AcceptFriendRequest());
    exportProtocol.push(new CS_RejectFriendRequest());
    exportProtocol.push(new CS_DeleteFriend());
    exportProtocol.push(new CS_GetSpiritSendList());
    exportProtocol.push(new CS_SendSpirit());
    exportProtocol.push(new CS_GetSpiritRcvList());
    exportProtocol.push(new CS_RcvSpirit());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;