/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：秘境探险：
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/fairyland');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var fairylandDb = require('../database/fairyland');
var playerDb = require('../database/player');
var packageDb = require('../database/package');
var friendDb = require('../database/friend');
var globalObject = require('../../common/global_object');
var protocolObject = require('../../common/protocol_object');
var itemType = require('../common/item_type');
var cMission = require('../common/mission');
var cFairyland = require('../common/fairyland');
var biCode = require('../../common/bi_code');
var battleType = require('../common/battle_type');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取仙境状态列表
 */
var CS_GetFairylandStates = (function() {

    /**
     * 构造函数
     */
    function CS_GetFairylandStates() {
        this.reqProtocolName = packets.pCSGetFairylandStates;
        this.resProtocolName = packets.pSCGetFairylandStates;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetFairylandStates.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetFairylandStates();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.ownerId) {
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

                /* 获取仙境数组 */
                function(callback) {
                    fairylandDb.getFairylands(req.zid, req.ownerId, true, callback);
                },

                /* 设置返回值 */
                function(fairylands, callback) {
                    cFairyland.updateFairylandsEvents(fairylands);
                    fairylandDb.setFairylands(req.zid, req.ownerId, fairylands, true, function () {});

                    for(var i = 0; i < 6; ++i) {
                        res.fairylandState.push(fairylands[i].state);
                        res.endTime.push(fairylands[i].endTime);
                    }
                    callback(null);
                },

                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 设置已镇压次数 */
                function(player, callback) {
                    fairylandDb.getRepressCnt(req.zid, req.zuid, function(err, cnt) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.repressCnt = cnt;
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
    return CS_GetFairylandStates;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开始征服仙境
 */
var CS_ConquerFairylandStart = (function() {

    /**
     * 构造函数
     */
    function CS_ConquerFairylandStart() {
        this.reqProtocolName = packets.pCSConquerFairylandStart;
        this.resProtocolName = packets.pSCConquerFairylandStart;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ConquerFairylandStart.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ConquerFairylandStart();
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
                || null == req.fairylandId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.fairylandId = parseInt(req.fairylandId);

            if(isNaN(req.zid) || isNaN(req.fairylandId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(req.fairylandId < 1 || req.fairylandId > 6) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var characterLevel = 0;
            var startTime;

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取玩家等级 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            characterLevel = player.character.level;
                            callback(null, player.character.level);
                        }
                    });
                },

                /* 验证玩家等级 */
                function(level, callback) {
                    var line = csvManager.Fairylad()[req.fairylandId];
                    if(!line) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    if(level < line.LEVEL_LIMIT) {
                        callback(retCode.FD_LEVEL_LESS);
                        return;
                    }

                    callback(null);
                },

                /* 检查秘境状态 */
                function(callback) {
                    fairylandDb.getFairylands(req.zid, req.zuid, false, function(err, fairylands) {
                        if (err) {
                            callback(err);
                        }
                        else if (globalObject.FAIRYLAND_NEED_CONQUER != fairylands[req.fairylandId - 1].state) {
                            callback(retCode.FD_ALREADY_CONQUERED);
                        }
                        else {
                            callback(null);
                        }
                    });
                },

                /* 设置开始战斗时间 */
                function(callback) {
                    var now = parseInt(Date.now() / 1000);
                    startTime = now;
                    fairylandDb.setFairylandFightBegin(req.zid, req.zuid, req.fairylandId, now, function(err) {
                        if(err) {
                            callback(err);
                        }
                        else {
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
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_instance_mj, preZid, req.channel, req.zuid, req.zuid, characterLevel, battleType.BATTLE_TOWER, 0, req.fairylandId, 1, startTime, 0, 1, 0, 0, 0, '', 1, 0, 0, '');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ConquerFairylandStart;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 结束征服仙境
 */
var CS_ConquerFairylandWin = (function() {

    /**
     * 构造函数
     */
    function CS_ConquerFairylandWin() {
        this.reqProtocolName = packets.pCSConquerFairylandWin;
        this.resProtocolName = packets.pSCConquerFairylandWin;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ConquerFairylandWin.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ConquerFairylandWin();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
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

            var player;
            var fairylandId = 0;
            var startTime;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, result) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            player = result;
                            callback(null);
                        }
                    });
                },

                /* 获取开始战斗时间 */
                function(callback) {
                    fairylandDb.getFairylandFightBegin(req.zid, req.zuid, callback);
                },

                /* 检查时间和战斗力*/
                function(fightBegin, callback) {
                    fairylandDb.delFairylandFightBegin(req.zid, req.zuid);

                    fairylandId = fightBegin.split(':')[0];
                    var beginTime = fightBegin.split(':')[1];
                    startTime = beginTime;

                    var stageId = csvManager.Fairylad()[fairylandId].STATE_ID;
                    var scLine = csvManager.StageConfig()[stageId];
                    if(!scLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    var now  = Date.now() / 1000;
                    if(now - beginTime < scLine.CHECK_TIME) {
                        /* 该玩家正在使用外挂 */
                        callback(retCode.USING_PLUG);
                        return;
                    }
                    if (player.power < scLine.CHECK_BATTLE) {
                        /* 该玩家正在使用外挂 */
                        callback(retCode.USING_PLUG);
                        return;
                    }

                    callback(null);
                },

                /* 更新仙境状态 */
                function(callback) {
                    fairylandDb.getFairylands(req.zid, req.zuid, true, function(err, fairylands) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        else {
                            var fairyland = fairylands[fairylandId - 1];
                            fairyland.state = globalObject.FAIRYLAND_NEED_EXPLORE;
                            fairylandDb.setFairylands(req.zid, req.zuid, fairylands, true, callback);
                        }
                    });
                },

                /* 发送奖励*/
                function(callback) {
                    var groupId = csvManager.Fairylad()[fairylandId].STATE_REARD;
                    var records = csvExtendManager.GroupIDConfigRecordsByGroupID(groupId);
                    if(!records) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    var arrAdd = [];
                    for(var i = 0; i < records.length; ++i) {
                        var item = new globalObject.ItemBase();
                        item.tid = records[i].ITEM_ID;
                        item.itemNum = records[i].ITEM_COUNT * records[i].LOOT_TIME;
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.CONQUERFAIRYLANDWIN_LOGS, item.tid, function(err, retSub, retAdd) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            for(var i  = 0; i < arrAdd.length; ++i) {
                                var inPackage = false;
                                for(var j = 0; j < retAdd.length; ++j) {
                                    if(arrAdd[i].tid == retAdd[j].tid) {
                                        inPackage = true;
                                        break;
                                    }
                                }
                                if(!inPackage) {
                                    res.awardItems.push(arrAdd[i]);
                                }
                            }
                            res.awardItems = res.awardItems.concat(retAdd);
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
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_instance_mj, preZid, req.channel, req.zuid, req.zuid, player.character.level, battleType.BATTLE_TOWER, 0, fairylandId, 1, startTime, 0, 1, 0, 0, 0, JSON.stringify(res.awardItems), 2, 0, 0, '');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ConquerFairylandWin;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 探索仙境
 */
var CS_ExploreFairyland = (function() {

    /**
     * 构造函数
     */
    function CS_ExploreFairyland() {
        this.reqProtocolName = packets.pCSExploreFairyland;
        this.resProtocolName = packets.pSCExploreFairyland;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ExploreFairyland.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ExploreFairyland();
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
                || null == req.fairylandId
                || null == req.petItemId
                || null == req.exploreType) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.fairylandId = parseInt(req.fairylandId);
            req.petItemId = parseInt(req.petItemId);
            req.exploreType = parseInt(req.exploreType);

            if(isNaN(req.zid) || isNaN(req.fairylandId) || isNaN(req.petItemId) || isNaN(req.exploreType)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(req.fairylandId < 1 || req.fairylandId > 6) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var startTime;  /* 开始时间 */
            var useTime;    /* 消耗时间 */
            var characterLevel = 0;
            var fairylands = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 检查玩家状态 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        var line = csvManager.FairyladCost()[req.exploreType];
                        characterLevel = player.character.level;
                        if(!line) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }

                        if(player.vipLevel < line.VIP_LEVEL) {
                            callback(retCode.FD_VIP_LEVEL_LESS);
                            return;
                        }

                        var arrSub = [];
                        var item = new globalObject.ItemBase();
                        item.tid = line.EXPLOR_ITEM_ID;
                        item.itemNum = line.EXPLOR_ITEM_NUM;
                        arrSub.push(item);

                        cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, [],  req.channel, req.acc, logsWater.EXPLOREFAIRYLAND_LOGS, item.tid, function(err) {
                            callback(err);
                        });
                    });
                },

                /* 获取仙境数组 */
                function(callback) {
                    fairylandDb.getFairylands(req.zid, req.zuid, true, function(err, result) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            fairylands = result;
                            callback(null);
                        }
                    });
                },

                /* 检查仙境状态 */
                function(callback) {
                    if(globalObject.FAIRYLAND_NEED_EXPLORE != fairylands[req.fairylandId-1].state) {
                        callback(retCode.FD_STATE_ERR_FOR_EXPLORE);
                        return;
                    }

                    callback(null);
                },

                /* 获取符灵背包 */
                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, true, callback);
                },

                /* 更新符灵状态 */
                function(pkg, callback) {
                    var itemPet = cPackage.getItemByItemId(pkg, req.petItemId);
                    if(!itemPet) {
                        callback(retCode.ITEM_NOT_EXIST);
                        return;
                    }

                    if(itemPet.inFairyland) {
                        callback(retCode.PET_IN_FAIRYLAND);
                        return;
                    }

                    itemPet.inFairyland = req.fairylandId;
                    packageDb.savePackage(req.zid, req.zuid, pkg, true,  function(err) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            callback(null, itemPet);
                        }
                    });
                },

                /* 更新仙境状态*/
                function(itemPet, callback) {
                    var fairyland = fairylands[req.fairylandId-1];
                    fairyland.state = globalObject.FAIRYLAND_EXPLORING;
                    fairyland.tid = itemPet.tid;
                    fairyland.itemId  = itemPet.itemId;
                    var now = parseInt(Date.now() / 1000);
                    fairyland.beginTime = now;
                    fairyland.endTime = now + req.exploreType % 100 * 3600;
                    fairyland.exploreType = req.exploreType;
                    res.endTime = fairyland.endTime;
                    startTime = fairyland.beginTime;
                    useTime = fairyland.endTime - fairyland.beginTime;

                    fairylandDb.setFairylands(req.zid, req.zuid, fairylands, true, callback);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_instance_mj, preZid, req.channel, req.zuid, req.zuid, characterLevel, battleType.BATTLE_TOWER, 0, req.fairylandId, 1, startTime, useTime, 1, 0, 0, 0, '', 3, req.petItemId, req.exploreType, '');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ExploreFairyland;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取仙境信息
 */
var CS_GetFairylandEvents = (function() {

    /**
     * 构造函数
     */
    function CS_GetFairylandEvents() {
        this.reqProtocolName = packets.pCSGetFairylandEvents;
        this.resProtocolName = packets.pSCGetFairylandEvents;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetFairylandEvents.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetFairylandEvents();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.targetId
                || null == req.fairylandId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.fairylandId = parseInt(req.fairylandId);

            if(isNaN(req.zid) || isNaN(req.fairylandId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(req.fairylandId < 1 || req.fairylandId > 6) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取仙境信息 */
                function(callback) {
                    fairylandDb.getFairylands(req.zid, req.targetId, false, callback);
                },

                /* 设置返回值 */
                function(fairylands, callback) {
                    cFairyland.updateFairylandsEvents(fairylands);
                    fairylandDb.setFairylands(req.zid, req.targetId, fairylands, true, function () {});

                    var fairyland  = fairylands[req.fairylandId - 1];
                    res.events = fairyland.events;
                    res.endTime = fairyland.endTime;
                    res.petTid = fairyland.tid;

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
    return CS_GetFairylandEvents;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取探索奖励
 */
var CS_TakeFairylandAwards = (function() {

    /**
     * 构造函数
     */
    function CS_TakeFairylandAwards() {
        this.reqProtocolName = packets.pCSTakeFairylandAwards;
        this.resProtocolName = packets.pSCTakeFairylandAwards;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_TakeFairylandAwards.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_TakeFairylandAwards();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.fairylandId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.fairylandId = parseInt(req.fairylandId);

            if(isNaN(req.zid) || isNaN(req.fairylandId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(req.fairylandId < 1 || req.fairylandId > 6) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var fairylands = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 检查仙境状态 */
                function(callback) {
                    fairylandDb.getFairylands(req.zid, req.zuid, true, function(err, fairylands) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        var fairyland = fairylands[req.fairylandId - 1];
                        if(globalObject.FAIRYLAND_WAIT_HARVEST != fairyland.state) {
                            callback(retCode.FD_CANNOT_HARVEST);
                            return;
                        }
                        callback(null, fairylands);
                    });
                },

                /* 更新符灵状态 */
                function(data, callback) {
                    fairylands = data;

                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, true, function(err, pkg) {
                        var itemId = fairylands[req.fairylandId - 1].itemId;
                        var itemPet = cPackage.getItemByItemId(pkg, itemId);
                        if(itemPet) {
                            itemPet.inFairyland = 0;
                            packageDb.savePackage(req.zid, req.zuid, pkg, true, callback);
                        }
                        else {
                            callback(retCode.ITEM_NOT_EXIST);
                        }
                    });
                },

                /* 更新仙境状态，发放奖励 */
                function(callback) {
                    var fairyland = fairylands[req.fairylandId - 1];
                    /* 仙境探索时间(小时) */
                    var exploreTime = parseInt((fairyland.endTime - fairyland.beginTime) / 3600);

                    /* 寻仙奖励*/
                    var arrAdd = [];
                    for(var i = 0; i < fairyland.events.length; ++i) {
                        var event = fairyland.events[i];
                        var type = parseInt(event.index / 10000);
                        if(type == 3 || type == 4) {
                            var item = new globalObject.ItemBase();
                            item.tid = event.tid;
                            item.itemNum = event.itemNum;
                            arrAdd.push(item);
                        }
                    }

                    /* 更新仙境状态 */
                    fairyland.state = globalObject.FAIRYLAND_NEED_EXPLORE;
                    fairyland.tid = -1;
                    fairyland.itemId = -1;
                    fairyland.beginTime = -1;
                    fairyland.events = [];

                    fairylandDb.setFairylands(req.zid, req.zuid, fairylands, true, function(err) {
                        if(err) {
                            callback(err);
                        }
                        else { /* 添加奖励 */
                            cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.TAKEFAIRYLANDAWARDS_LOGS, item.tid, function(err, retSub, retAdd) {
                                if(err) {
                                    callback(err);
                                }
                                else {
                                    for(var i  = 0; i < arrAdd.length; ++i) {
                                        var inPackage = false;
                                        for(var j = 0; j < retAdd.length; ++j) {
                                            if(arrAdd[i].tid == retAdd[j].tid) {
                                                inPackage = true;
                                                break;
                                            }
                                        }
                                        if(!inPackage) {
                                            res.awardItems.push(arrAdd[i]);
                                        }
                                    }
                                    res.awardItems = res.awardItems.concat(retAdd);
                                    callback(null);

                                    /* 更新任务进度 增加探险时间(小时) */
                                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_15, 0, exploreTime);
                                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_15, 0, 0, exploreTime);
                                }
                            });
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
    return CS_TakeFairylandAwards;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 镇压暴乱
 */
var CS_RepressRiot = (function() {

    /**
     * 构造函数
     */
    function CS_RepressRiot() {
        this.reqProtocolName = packets.pCSRepressRiot;
        this.resProtocolName = packets.pSCRepressRiot;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_RepressRiot.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_RepressRiot();
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
                || null == req.friendId
                || null == req.fairylandId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.fairylandId = parseInt(req.fairylandId);

            if(isNaN(req.zid) || isNaN(req.fairylandId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 检查镇压次数 */
                function(result, callback) {
                    player = result;

                    var dftCnt = csvManager.Viplist()[player.vipLevel].EVENT_NUM;
                    fairylandDb.getRepressCnt(req.zid, req.zuid, function(err, result) {
                        if(err) {
                            callback(err);
                        }
                        else if(result >= dftCnt) {
                            callback(retCode.FD_NO_REPRESS_TIMES);
                        }
                        else {
                            callback(null);
                        }
                    });
                },

                /* 检查好友关系 */
                function(callback) {
                    friendDb.isFriends(req.zid, req.zuid, req.friendId, callback);
                },

                function(isFriends, callback) {
                    if(!isFriends) {
                        callback(retCode.NOT_FRIENDS);
                        return;
                    }

                    /* 获取仙境状态 */
                    fairylandDb.getFairylands(req.zid, req.friendId, true, callback);
                },

                /* 改变仙境状态 */
                function(fairylands, callback) {
                    var fairyland = fairylands[req.fairylandId - 1];
                    if(globalObject.FAIRYLAND_RIOTING != fairyland.state) {
                        callback(retCode.FD_NOT_RIOTING);
                        return;
                    }
                    fairyland.state = globalObject.FAIRYLAND_EXPLORING;

                    /* 好友事件和暴乱事件序号相差10000 */
                    var event  = new globalObject.FairylandEvent();
                    event.index = 20001;
                    for(var i = fairyland.events.length - 1; i >= 0; --i) {
                        if(parseInt(fairyland.events[i].index / 10000) == 1) {
                            event.index = fairyland.events[i].index + 10000;
                            break;
                        }
                    }

                    event.friendName = player.name;
                    fairyland.events.push(event);
                    fairylandDb.setFairylands(req.zid, req.friendId, fairylands, true,  callback);

                    /* 好友加2精力 */
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_SPIRIT;
                    item.itemNum = 2;
                    var arrAdd = [];
                    arrAdd.push(item);
                    cPackage.updateItemWithLog(req.zid, req.friendId, [], arrAdd,req.channel, req.acc, logsWater.REPRESSRIOT_LOGS, item.tid,  function() {});

                    /* 自己加5元宝 */
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                    item.itemNum = 5;
                    var arrAdd = [];
                    arrAdd.push(item);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.REPRESSRIOT_LOGS, item.tid, function() {});

                    /* 更新镇压次数 */
                    fairylandDb.incrRepressCnt(req.zid, req.zuid);
                },

                /* 更新任务进度 */
                function (callback) {
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_14, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_14, 0,  0, 1);
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
                    logger.logBI(preZid, biCode.logs_instance_mj, preZid, req.channel, req.zuid, req.zuid, player.character.level, battleType.BATTLE_TOWER, 0, req.fairylandId, 1, 0, 0, 1, 0, 0, 0, '', 4, 0, 0, req.friendId);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_RepressRiot;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友仙境信息
 */
var CS_GetFairylandFriendList = (function() {

    /**
     * 构造函数
     */
    function CS_GetFairylandFriendList() {
        this.reqProtocolName = packets.pCSGetFairylandFriendList;
        this.resProtocolName = packets.pSCGetFairylandFriendList;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetFairylandFriendList.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetFairylandFriendList();
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

                /* 获取好友列表 */
                function(callback) {
                    friendDb.getFriendList(req.zid, req.zuid, callback);
                },

                /* 获取好友仙境信息 */
                function(friendList, callback) {
                    async.map(friendList, function(zuid, cb) {
                        fairylandDb.getFairylands(req.zid, zuid, true, function (err, fairylands) {
                            if (err) {
                                cb(err);
                                return;
                            }

                            /* 更新仙境状态 */
                            cFairyland.updateFairylandsEvents(fairylands);
                            fairylandDb.setFairylands(req.zid, zuid, fairylands, true, function() {});

                            playerDb.getPlayerData(req.zid, zuid, false, function (err, player) {
                                if (err) {
                                    cb(err);
                                    return;
                                }

                                var fairylandFriend = new protocolObject.FairylandFriend();
                                fairylandFriend.zuid = zuid;
                                fairylandFriend.name = player.name;
                                fairylandFriend.iconIndex = player.character.tid;
                                fairylandFriend.level = player.character.level;
                                fairylandFriend.conquerdNum = 0;
                                fairylandFriend.exploringNum = 0;
                                fairylandFriend.riotingNum = 0;
                                for (var i = 0; i < 6; ++i) {
                                    if (fairylands[i].state > globalObject.FAIRYLAND_NEED_CONQUER) {
                                        ++fairylandFriend.conquerdNum;
                                    }

                                    if (fairylands[i].state == globalObject.FAIRYLAND_EXPLORING) {
                                        ++fairylandFriend.exploringNum;
                                    }

                                    if (fairylands[i].state == globalObject.FAIRYLAND_RIOTING) {
                                        ++fairylandFriend.riotingNum;
                                    }
                                }
                                cb(null, fairylandFriend);

                            });
                        });
                    },function (err, data) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.ffList = data;
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
    return CS_GetFairylandFriendList;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetFairylandStates());
    exportProtocol.push(new CS_ConquerFairylandStart());
    exportProtocol.push(new CS_ConquerFairylandWin());
    exportProtocol.push(new CS_ExploreFairyland());
    exportProtocol.push(new CS_GetFairylandEvents());
    exportProtocol.push(new CS_TakeFairylandAwards());
    exportProtocol.push(new CS_RepressRiot());
    exportProtocol.push(new CS_GetFairylandFriendList());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
