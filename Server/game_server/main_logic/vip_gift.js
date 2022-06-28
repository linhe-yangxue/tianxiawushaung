/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：VIP礼包(活动)  VIP礼包请求 VIP每日福利 VIP每周福利
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/vip_gift');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var vipGiftDb = require('../database/vip_gift');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtend =  require('../../manager/csv_extend_manager').Instance();
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var protocolObject = require('../../common/protocol_object');
var timeUtil = require('../../tools/system/time_util');
var itemType = require('../common/item_type');
var filter = require('../common/filter_common');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');
var filterCommon = require('../common/filter_common');
var globalObject = require('../../common/global_object');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP每日礼包信息
 */
var CS_VIPDailyInfo = (function() {

    /**
     * 构造函数
     */
    function CS_VIPDailyInfo() {
        this.reqProtocolName = packets.pCSVIPDailyInfo;
        this.resProtocolName = packets.pSCVIPDailyInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_VIPDailyInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_VIPDailyInfo();
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

                /* 获取角色vip等级 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取vip每日礼包 */
                function(player, callback) {
                    vipGiftDb.getVipDailyGiftInfo(req.zid, req.zuid, player.vipLevel, function(err, result) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.dailyWelfare.preVipLevel = result.preVipLevel;
                            res.dailyWelfare.vipLevel = player.vipLevel;
                            res.dailyWelfare.array = result.array;
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
    return CS_VIPDailyInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP周礼包信息
 */
var CS_VIPWeeklyInfo = (function() {

    /**
     * 构造函数
     */
    function CS_VIPWeeklyInfo() {
        this.reqProtocolName = packets.pCSVIPWeeklyInfo;
        this.resProtocolName = packets.pSCVIPWeeklyInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_VIPWeeklyInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_VIPWeeklyInfo();
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

                /* 获取vip每周礼包 */
                function(callback) {
                    var md = timeUtil.getMondayTime();
                    vipGiftDb.setVipWeeklyGiftTimeStamp(req.zid, req.zuid, md);

                    vipGiftDb.getAllVipWeeklyGiftInfo(req.zid, req.zuid, function(err, result) {
                        if(err) {
                            callback(err);
                        }
                        else {
                            res.weekWelfare = result;
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
    return CS_VIPWeeklyInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP每日福利
 */
var CS_VIPDaily = (function() {

    /**
     * 构造函数
     */
    function CS_VIPDaily() {
        this.reqProtocolName = packets.pCSVIPDaily;
        this.resProtocolName = packets.pSCVIPDaily;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_VIPDaily.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_VIPDaily();
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
                || null == req.vipLevel) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.vipLevel = parseInt(req.vipLevel);

            if(isNaN(req.zid) || isNaN(req.vipLevel)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var vipLevel = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取玩家VIP等级 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取每日礼包对象 */
                function(player, callback) {
                    vipLevel = player.vipLevel;
                    vipGiftDb.getVipDailyGiftInfo(req.zid, req.zuid, vipLevel, callback);
                },


                function(vipDailyGift, callback) {
                    var vpLine = csvManager.Viplist()[req.vipLevel];
                    if(!vpLine) {
                        callback(retCode.TID_NOT_EXIST);
                    }

                    /* vip等级检查 */
                    if(req.vipLevel > vipLevel || req.vipLevel < vipDailyGift.preVipLevel) {
                        callback(retCode.VIP_LEVEL_MATCH_FAILED);
                        return;
                    }

                    /* 是否已经领过 */
                    if(vipDailyGift.array.indexOf(req.vipLevel) != -1) {
                        callback(retCode.DAILY_WELFARE_RECEIVED);
                        return;
                    }

                    /* 添加领取记录 */
                    vipDailyGift.array.push(req.vipLevel);
                    vipGiftDb.setVipDailyGiftInfo( req.zid, req.zuid, vipDailyGift);

                    /* 添加物品 */
                    var arrAdd = csvExtend.GroupIDConfigAllByGroupID(vpLine.DAY_GROUP_ID);
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.VIPDAILY_LOGS, '', function(err, retAdd) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.rewards = retAdd;
                        callback(null);
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
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 6, 0, 1);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_VIPDaily;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP每周福利
 */
var CS_VIPWeek = (function() {

    /**
     * 构造函数
     */
    function CS_VIPWeek() {
        this.reqProtocolName = packets.pCSVIPWeek;
        this.resProtocolName = packets.pSCVIPWeek;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_VIPWeek.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_VIPWeek();
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
                || null == req.index) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.index = parseInt(req.index);

            if(isNaN(req.zid) || isNaN(req.index)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取角色对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, result) {
                        player= result;
                        callback(err);
                    });
                },

                /* 检查领取资格  */
                function(callback) {
                    var vgeLine = csvManager.WeekGiftEvent()[req.index];
                    if(!vgeLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    var a = vgeLine.CONDITION.split('|');

                    /* 主角等级要求 */
                    var lvls = a[0].split('#');
                    lvls[0] = parseInt(lvls[0]);
                    lvls[1] = parseInt(lvls[1]);
                    var lv = player.character.level;
                    if(lv < lvls[0] || lv > lvls[1]) {
                        callback(retCode.CHARACTER_LEVEL_ILLEGAL);
                        return;
                    }

                    /* vip等要求 */
                    var vipLvls = a[1].split('#');
                    vipLvls[0] = parseInt(vipLvls[0]);
                    vipLvls[1] = parseInt(vipLvls[1]);
                    var vipLv = player.vipLevel;
                    if(vipLv < vipLvls[0] || vipLv > vipLvls[1]) {
                        callback(retCode.VIP_LEVEL_ILLEGAL);
                        return;
                    }

                    /* 获取vip每周礼包信息 */
                    vipGiftDb.getVipWeeklyGiftInfo(req.zid, req.zuid, req.index, callback);
                },

                function(vipWeeklyGift, callback) {
                    var vgeLine = csvManager.WeekGiftEvent()[req.index];
                    if(vipWeeklyGift.buyNum >= vgeLine.BUY_NUM) {
                        callback(retCode.WEEK_VIPGIFT_TIMES_BEYOND);
                        return;
                    }

                    vipWeeklyGift.buyNum += 1;
                    vipGiftDb.setVipWeeklyGiftInfo(req.zid, req.zuid, vipWeeklyGift);

                    /* 扣元宝并将领取的物品加入背包 */
                    var itemDiamond = new globalObject.ItemBase();
                    itemDiamond.tid = itemType.ITEM_TYPE_DIAMOND;
                    itemDiamond.itemNum = vgeLine.PRICE;

                    var arrAdd = filterCommon.splitItemStr(vgeLine.ITEM,'|', '#');
                    cPackage.smartUpdateItemWithLog(req.zid, req.zuid, [itemDiamond], arrAdd, req.channel, req.acc, logsWater.VIPWEEK_LOGS, itemType.ITEM_TYPE_DIAMOND, function(err, retAdd) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.rewards = retAdd;
                        callback(null);
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
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 7, 0, 1);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_VIPWeek;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_VIPDailyInfo());
    exportProtocol.push(new CS_VIPWeeklyInfo());
    exportProtocol.push(new CS_VIPDaily());
    exportProtocol.push(new CS_VIPWeek());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;