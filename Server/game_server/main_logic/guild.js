/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：公会逻辑模块
 * 开发者：杨磊
 * 开发者备注：创建公会、祭天、议事大堂功能实现
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/guild');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var player = require('../common/player');
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var guildDb = require('../database/guild');
var itemType= require('../../game_server/common/item_type');
var protocolObject = require('../../common/protocol_object');
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var guildCommon = require('../common/guild_common');
var cLevelCheck = require('../common/level_check');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var timeUtil = require('../../tools/system/time_util');
var cNotice = require('../common/notification');
var cZuid = require('../common/zuid');
var guildBossCommon = require('../common/guild_boss');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 创建公会
 */
var CS_CreateGuild = (function() {

    /**
     * 构造函数
     */
    function CS_CreateGuild() {
        this.reqProtocolName = packets.pCSCreateGuild;
        this.resProtocolName = packets.pSCCreateGuild;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_CreateGuild.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_CreateGuild();
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
                || null == req.name
                || null == req.outInfo) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player;
            var guildInfo = null; /* 公会信息 */
            var now = parseInt(Date.now() /1000);
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 名称及宣言验证 */
                function(callback) {
                    if(req.name.length > 8) {
                        callback(retCode.GUILD_NAME_ILLEGAL);
                        return;
                    }
                    if (!isNaN(req.name)) {/* 不能全是数字 */
                        callback(retCode.GUILD_NAME_ILLEGAL);
                        return;
                    }
                    if(req.outInfo.length > 50) { /* 宣言长度 */
                        callback(retCode.GUILD_OUTINFO_ILLEGAL);
                        return
                    }
                    var banList = csvManager.BanedTextConfig();
                    for(var index = 0; index < banList.length; ++index) {
                        var word = banList[index].BANEDLIST.trim();
                        if ( word.length == 0 ) {
                            continue;
                        }
                        if (req.name.indexOf(word) != -1) {
                            return callback(retCode.GUILD_NAME_ILLEGAL);
                        }
                        if (req.outInfo.indexOf(word) != -1) {
                            return callback(retCode.GUILD_OUTINFO_ILLEGAL);
                        }
                    }
                    var pattern = /[^\u4e00-\u9fa5\w\d]/;
                    if(pattern.test(req.name)) {
                        return callback(retCode.GUILD_NAME_ILLEGAL);
                    }
                    callback(null);
                },

                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 判断是否在公会 */
                function(data, callback) {
                    player = data;

                    if(!cLevelCheck(player, 'guild')) {
                        callback(retCode.LACK_OF_LEVEL);
                        return;
                    }

                    if (player.guildId.length > 0 || parseInt(cZuid.zuidSplit(player.guildId)[1]) > 0) {
                        callback(retCode.GUILD_ADDED);
                        return;
                    }
                    callback(null);
                },

                /* 扣除元宝 */
                function(callback) {
                    var item = new globalObject.ItemBase();
                    item.itemId = -1;
                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                    item.itemNum = 500;   /* 500元宝扣费写死 */
                    var arrSub = [];
                    arrSub.push(item);
                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, [], req.channel, req.acc, logsWater.CREATEGUILD_LOGS, item.tid, function(err) {
                        callback(err);
                    });
                },

                /* 创建公会 */
                function(callback) {
                    var memInfo = new globalObject.GuildMemInfo();
                    memInfo.zuid = req.zuid;
                    memInfo.title = 2;
                    memInfo.joinTime = now;

                    guildInfo = new globalObject.GuildInfo();
                    guildInfo.name = req.name;
                    guildInfo.outInfo = req.outInfo;
                    guildInfo.inInfo = "";
                    guildInfo.member.push(memInfo);
                    guildInfo.level = 1;
                    guildInfo.exp = 0;
                    guildInfo.foundingTime = now;
                    guildInfo.liveness = 0;

                    guildDb.createGuildInfo(guildInfo, req.zid, req.zuid, callback);
                },

                /*加入公会排行*/
                function(callback) {
                    var obj = new protocolObject.GuildBaseObject();
                    obj.guildId = guildInfo.gid;
                    obj.name = req.name;
                    obj.outInfo = req.outInfo;
                    obj.level = 1;
                    obj.exp = 0;
                    obj.memberCount = guildInfo.member.length;
                    res.guildObject = obj;
                    guildDb.updateGuildRankList(req.zid, guildInfo.gid, guildInfo.level, now, callback);
                },

                /* 再次获取player对象，更新公会id */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, true, callback);
                },
                function(data, callback) {
                    player = data;
                    player.guildId = guildInfo.gid;
                    playerDb.savePlayerData(req.zid, req.zuid, player, true, callback);
                }
            ],function(err) {
                if(err) {
                    if(retCode.GUILD_EXIST == err) {
                        res.guildExist = 1;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    if (err == retCode.GUILD_NAME_ILLEGAL || err == retCode.GUILD_OUTINFO_ILLEGAL) {
                        res.guildObject = null;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    else{
                        logger.LoggerGame.info(err, JSON.stringify(req));
                        http.sendResponseWithResultCode(response, res, err);
                    }
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, player.character.level, 3, guildInfo.gid, req.name, '');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_CreateGuild;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取公会列表
 */
var CS_GetGuildArr = (function() {

    /**
     * 构造函数
     */
    function CS_GetGuildArr() {
        this.reqProtocolName = packets.pCSGetGuildArr;
        this.resProtocolName = packets.pSCGetGuildArr;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetGuildArr.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetGuildArr();
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
                /* 獲取申请列表 */
                function(callback) {
                    guildDb.getApplyGidArr(req.zid, req.zuid, callback);
                },
                /* 获取公会信息列表  */
                function(applyArr, callback) {
                    res.applyArr = applyArr;
                    guildDb.getGuildInfoArr(req.zid, function(err, arr) {
                        if(err) {
                            callback(err);
                            return
                        }
                        for(var i = 0; i < arr.length; ++i) {
                            var obj = new protocolObject.GuildBaseObject();
                            obj.guildId = arr[i].gid;
                            obj.name = arr[i].name;
                            obj.outInfo = arr[i].outInfo;
                            obj.inInfo = arr[i].inInfo;
                            obj.memberCount = arr[i].member.length;
                            obj.level = arr[i].level;
                            obj.exp = arr[i].exp;

                            res.arr.push(obj);
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
    return CS_GetGuildArr;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 搜索公会
 */
var CS_SearchGuildName = (function() {

    /**
     * 构造函数
     */
    function CS_SearchGuildName() {
        this.reqProtocolName = packets.pCSSearchGuildName;
        this.resProtocolName = packets.pSCSearchGuildName;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SearchGuildName.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SearchGuildName();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.guildName) {
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
                /* 按名称搜索公会 */
                function(callback) {
                    guildDb.getGuildInfoByName(req.zid, req.guildName, function(err, guildInfoArr) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if(null == guildInfoArr || 0 == guildInfoArr.length) {
                            res.guildObjectArr = [];
                            callback(retCode.SUCCESS);
                            return;
                        }
                        for(var i = 0; i < guildInfoArr.length; ++i) {
                            if(null == guildInfoArr[i]) {
                                continue;
                            }
                            var obj = new protocolObject.GuildBaseObject();
                            obj.guildId = guildInfoArr[i].gid;
                            obj.name = req.guildName;
                            obj.outInfo = guildInfoArr[i].outInfo;
                            obj.inInfo = guildInfoArr[i].inInfo;
                            obj.memberCount = guildInfoArr[i].member.length;
                            obj.level = guildInfoArr[i].level;
                            obj.exp = guildInfoArr[i].exp;

                            res.guildObjectArr.push(obj);
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    guildDb.getApplyGidArr(req.zid, req.zuid, function (err, arr) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        res.applyArr = arr;
                        callback(null);
                    });
                }
            ],function(err) {
                if(err) {
                    if(err == retCode.GUILD_NOT_EXIST) {
                        res.guildObject = null;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    else {
                        logger.LoggerGame.info(err, JSON.stringify(req));
                        http.sendResponseWithResultCode(response, res, err);
                    }
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_SearchGuildName;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取祭天信息
 */
var CS_GetGuildWorshipInfo = (function() {

    /**
     * 构造函数
     */
    function CS_GetGuildWorshipInfo() {
        this.reqProtocolName = packets.pCSGetGuildWorshipInfo;
        this.resProtocolName = packets.pSCGetGuildWorshipInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetGuildWorshipInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetGuildWorshipInfo();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var flag = false;
            var playerData = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.guildId = player.guildId;
                        if (req.zgid !== player.guildId ) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        playerData = player;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, function (err, guildInfo) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        guild = guildInfo;
                        callback(null);
                    });
                },
                function(callback) {
                    var date = new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date,0);
                    for (var i = 0; i < guild.member.length; ++i) {
                        var time = parseInt(guild.member[i].worshipTime);
                        if(guild.member[i].zuid == req.zuid && time <= zeroTime) {
                            playerData.isWorship = 0;
                            playerDb.savePlayerData(req.zid, req.zuid, playerData, false, callback);
                            return;
                        }
                    }
                    callback(null);
                },
                /* 获取祭天信息和祭天奖励领取信息 */
                function(callback) {
                    var date = new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date,0);
                    var obj = new protocolObject.GuildWorshipObject();
                    var time = 0;
                    for (var i = 0; i < guild.member.length; ++i) {
                        time = parseInt(guild.member[i].worshipTime);
                        if(time > zeroTime) {
                            flag = true;
                        }
                    }
                    if(!flag) {
                        guild.liveness = 0;
                        guild.worshipCount = 0;
                    }
                    obj.liveness = guild.liveness;
                    obj.worshipCount = guild.worshipCount;
                    res.worshipInfo = obj;
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);

                },
                function(callback) {
                    if(!flag) {
                        guildDb.clearRewardInfo(req.zid, req.zgid, req.zuid);
                        callback(null);
                    } else {
                        guildDb.getRewardInfo(req.zid, req.zgid, req.zuid, function(err, arr) {
                            if (err) {
                                callback(err);
                                return
                            }
                            res.rewardInfo = arr;
                            callback(null);
                        });
                    }
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
    return CS_GetGuildWorshipInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 祭天操作
 */
var CS_GuildWorship = (function() {

    /**
     * 构造函数
     */
    function CS_GuildWorship() {
        this.reqProtocolName = packets.pCSGuildWorship;
        this.resProtocolName = packets.pSCGuildWorship;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildWorship.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildWorship();
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
                || null == req.worshipType
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.worshipType = parseInt(req.worshipType);

            if(isNaN(req.zid) || isNaN(req.worshipType)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = {};
            var worshipInfo = csvManager.WorshipConfig()[req.worshipType];
            var playerData = null;
            var upgrade = 0; /*公会是否升级，1为升级*/
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 判断是否在公会 */
                function(callback) {
                    if(undefined == worshipInfo || null == worshipInfo) {
                        return callback(retCode.GUILD_WORSHIP_TYPE_ERROR);
                    }
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.guildId = player.guildId;
                        if (req.zgid !== player.guildId) {
                            callback(retCode.SUCCESS);
                            return;
                        }
                        playerData = player;
                        callback(null);
                    });
                },
                function(callback) {
                    var vipList = csvManager.Viplist();
                    if(null == vipList[playerData.vipLevel]) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    /* 判断祭天次数 */
                    if(playerData.isWorship) {
                        guildDb.openLockGuildInfo(req.zid,  req.zgid);
                        callback(retCode.GUILD_WORSHIP_EXCESS);
                        return;
                    }
                    if(3 == req.worshipType && 1 != vipList[playerData.vipLevel].WORSHIP_OPEN) {
                        callback(retCode.LACK_OF_VIP_LEVEL); /* vip等级不足不可以进行高级祭天 */
                        return;
                    }
                    /* 获取公会对象 */
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, function (err, guildInfo) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        guild = guildInfo;
                        callback(null);
                    });
                },
                /* 增加公会等级并判断是否升级 */
                function(callback) {
                    var length = Object.keys(csvManager.GuildCreated()).length;
                    /* 增加 */
                    guild.exp += worshipInfo.EXP;
                    var index = guild.level >= length ? length:guild.level +1;
                    var expNeed = csvManager.GuildCreated()[index].EXP;
                    if(index == length) {
                        guild.exp = csvManager.GuildCreated()[index].EXP;
                    }
                    while (guild.exp >= expNeed && guild.level < length) {
                        upgrade = 1;
                        guild.exp -= expNeed;
                        guild.level += 1;
                        index = guild.level >= length ? length:guild.level +1;
                        expNeed = parseInt(csvManager.GuildCreated()[index].EXP);
                        if(index == length) {
                            guild.exp = csvManager.GuildCreated()[index].EXP;
                            break;
                        }
                    }
                    guild.liveness += worshipInfo.SCHEDULE;
                    guild.worshipCount += 1;
                    for (var j = 0; j < guild.member.length; ++j) {
                        if (guild.member[j].zuid == req.zuid) {
                            guild.member[j].worshipTime = parseInt(Date.now() / 1000);
                        }
                    }
                    if (upgrade == 1) { /* 更新公会排行 */
                        guildDb.updateGuildRankList(req.zid, guild.gid, guild.level, parseInt(Date.now() / 1000), callback);
                    }
                    else {
                        callback(null);
                    }
                },
                /* 更新公会对象 */
                function(callback) {
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);
                },
                function(callback) {
                    var subArr = [];
                    var item = new protocolObject.ItemObject();
                    item.itemId = -1;
                    item.tid = worshipInfo.PRICE_TYPE;
                    item.itemNum = worshipInfo.PRICE;
                    subArr.push(item);
                    /* 扣除 */
                    cPackage.updateItemWithLog(req.zid, req.zuid, subArr, [],
                        req.channel, req.acc, logsWater.GUILD_WORSHIP_LOGS, item.tid, function(err) {
                            callback(err);
                        });
                },
                /* 更新player信息 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, true, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        playerData = player;
                        playerData.unionContr += worshipInfo.CONTRIBUTE;
                        playerData.todayWorship += worshipInfo.CONTRIBUTE;
                        playerData.isWorship = 1;
                        playerDb.savePlayerData(req.zid, req.zuid, playerData, true, callback);
                    });
                },
                /* 加公会动态信息 */
                function(callback) {
                    guildCommon.addGuildDynamicInfo(req.zid, req.zgid, req.zuid, playerData.name, req.worshipType, callback);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, playerData.character.level, req.worshipType + 8, req.zgid, guild.name, '');
                    logger.logBI(preZid, biCode.logs_guild_contr, preZid, req.channel, req.zuid, req.zuid, playerData.character.level, playerData.vipLevel,
                        logsWater.GUILD_WORSHIP_LOGS, worshipInfo.PRICE_TYPE, 0, worshipInfo.EXP, guild.exp-worshipInfo.EXP, guild.exp, 0);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildWorship;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取祭天奖励
 */
var CS_GetGuildWorshipReward = (function() {

    /**
     * 构造函数
     */
    function CS_GetGuildWorshipReward() {
        this.reqProtocolName = packets.pCSGetGuildWorshipReward;
        this.resProtocolName = packets.pSCGetGuildWorshipReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetGuildWorshipReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetGuildWorshipReward();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.rewardType
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.rewardType = parseInt(req.rewardType);

            if(isNaN(req.zid) || isNaN(req.rewardType)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var schedule = 0;
            var groupId = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },
                function(callback) {
                    /* 获取公会对象 */
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, false, function (err, guildInfo) {
                        if (err) {
                            callback(err);
                            return
                        }
                        guild = guildInfo;
                        callback(null);
                    });
                },
                /* 根据不同奖励类型获取进度和掉落组ID */
                function(callback) {
                    var rewardInfo = csvManager.WorshipSchedule()[guild.level];
                    if (req.rewardType == 1) {
                        schedule = rewardInfo.SCHEDULE_1;
                        groupId = rewardInfo.GROUP_ID_1;
                    }
                    else if (req.rewardType == 2) {
                        schedule = rewardInfo.SCHEDULE_2;
                        groupId = rewardInfo.GROUP_ID_2;
                    }
                    else if (req.rewardType == 3) {
                        schedule = rewardInfo.SCHEDULE_3;
                        groupId = rewardInfo.GROUP_ID_3;
                    }
                    else if (req.rewardType == 4) {
                        schedule = rewardInfo.SCHEDULE_4;
                        groupId = rewardInfo.GROUP_ID_4;
                    }
                    else{
                        schedule = rewardInfo.SCHEDULE_5;
                        groupId = rewardInfo.GROUP_ID_5;
                    }
                    callback(null);
                },
                /* 验证是否已领取 */
                function(callback) {
                    if (guild.liveness < schedule) {
                        callback(retCode.GUILD_LIVENESS_NOT_ENOUGH);
                        return;
                    }
                    guildDb.getRewardBefore(req.zid, req.zgid, req.zuid, guild.level, req.rewardType, callback);
                },
                function(flag, callback) {
                    if(0 == flag) {
                        callback(retCode.GUILD_REWARD_RECEIVED);
                        return;
                    }
                    csvExtendManager.GroupIDConfig_DropId(groupId, 1, callback);
                },
                /* 奖励物品发放给玩家*/
                function(arrAdd, callback) {
                    if(0 == arrAdd.length) {
                        callback(null);
                        return;
                    }
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel,
                        req.acc, logsWater.GETGUILDWORSHIPREWARD_LOGS, req.zgid, function(err, retSub, retAdd) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.arr = retAdd;
                        if( 0 == retAdd.length) {
                            res.arr = arrAdd;
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
    return CS_GetGuildWorshipReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会信息列表
 */
var CS_GuildInfoArr = (function() {

    /**
     * 构造函数
     */
    function CS_GuildInfoArr() {
        this.reqProtocolName = packets.pCSGuildInfoArr;
        this.resProtocolName = packets.pSCGuildInfoArr;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildInfoArr.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildInfoArr();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var dynamicInfoArr = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },
                /* 获取公会动态信息 */
                function(callback) {
                    guildDb.getGuildDynamicInfo(req.zid, req.zgid, function (err, arr) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        dynamicInfoArr = arr;
                        callback(null);
                    });
                },
                /* 转换公会动态信息存入数组 */
                function(callback) {
                    var obj = new protocolObject.GuildDynamicInfoObject();
                    var dynamicInfo = null;
                    for (var i = 0; i < dynamicInfoArr.length; ++i) {
                        dynamicInfo = JSON.parse(dynamicInfoArr[i]);
                        obj.zuid = dynamicInfo.zuid;
                        obj.nickname = dynamicInfo.nickname;
                        obj.infoType = dynamicInfo.infoType;

                        res.arr.push(dynamicInfo);
                    }
                    guildCommon.delGuildNotice(req.zid, req.zuid, cNotice.NOTIF_GUILD_REMOVE);
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
    return CS_GuildInfoArr;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取公会成员列表
 */
var CS_GetGuildMemberArr = (function() {

    /**
     * 构造函数
     */
    function CS_GetGuildMemberArr() {
        this.reqProtocolName = packets.pCSGetGuildMemberArr;
        this.resProtocolName = packets.pSCGetGuildMemberArr;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetGuildMemberArr.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetGuildMemberArr();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var date = new Date().toDateString();
            var zeroTime = timeUtil.getDetailTime(date,0); /* 当天的零点时间 */
            var playerData = null;
            var is_change_player = 0; /* 是否更新playerData,1要更新 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        playerData = player;
                        callback(null);
                    });
                },
                /* 获取GuildInfo对象*/
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, false, function(err, guildInfo) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        guild = guildInfo;
                        callback(null);
                    });
                },
                /* 赋值res.guildObject对象和赋值res.arr对象 */
                function(callback) {
                    if (guild == null) {
                       return callback(retCode.GUILD_NOT_EXIST);
                    }
                    var obj = new protocolObject.GuildBaseObject();
                    obj.guildId = req.zgid;
                    obj.name = guild.name;
                    obj.outInfo = guild.outInfo;
                    obj.inInfo = guild.inInfo;
                    obj.memberCount = guild.member.length;
                    obj.level = guild.level;
                    obj.exp = guild.exp;
                    res.guildObject = obj;
                    var len = guild.member.length;
                    for (var i = 0; i < len; ++i) {
                        var memObj = new protocolObject.GuildMemberObject();
                        memObj.zuid = guild.member[i].zuid;
                        memObj.title = guild.member[i].title;
                        res.arr.push(memObj);
                    }
                    callback(null);
                },
                /* 赋值res.baseArr对象 */
                function(callback) {
                    var time = 0;
                    var memberArr = guild.member;
                    async.each(memberArr, function(member, cb) {
                        player.getPlayerGuildInfo(req.zid, member.zuid, function(err, object) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            /* 判断每日贡献数是否要重置 */
                            time = member.worshipTime;
                            if (time <= zeroTime) {
                                object.todayWorship = 0;
                                if(member.zuid == req.zuid) { /* 只改自己的 */
                                    is_change_player = 1;
                                    //member.worshipTime = parseInt(Date.now() /1000 );
                                    playerData.todayWorship = 0;
                                }
                            }
                            res.baseArr.push(object);
                            cb(null);
                        });
                    },function(err) {
                        callback(err);
                    });
                },
                /* 保存每日要清空的数据 */
                function(callback) {
                    if(is_change_player == 1) {
                        guildDb.updateGuildInfo(req.zid, guild, false, function() {});
                        playerDb.savePlayerData(req.zid, req.zuid, playerData, false, function() {});
                    }
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
    return CS_GetGuildMemberArr;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 弹劾会长
 */
var CS_GuildImpeach = (function() {

    /**
     * 构造函数
     */
    function CS_GuildImpeach() {
        this.reqProtocolName = packets.pCSGuildImpeach;
        this.resProtocolName = packets.pSCGuildImpeach;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildImpeach.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildImpeach();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var playerData = null;
            var impeachUid = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, function (err, guildInfo) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        guild = guildInfo;
                        callback(null);
                    });
                },
                /* 获取会长信息 */
                function(callback) {
                    for (var i = 0; i < guild.member.length; ++i) {
                        if (guild.member[i].title == 2) {
                            impeachUid = guild.member[i].zuid;
                        }
                    }
                    player.getPlayerGuildInfo(req.zid, impeachUid, function (err, obj) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        playerData = obj;
                        callback(null);
                    });
                },
                function (callback) {
                    var subArr = [];
                    var item = new protocolObject.ItemObject();
                    var nowSeconds = parseInt(Date.now()/1000);
                    if (!playerData || (nowSeconds - playerData.time < 604800)) { /* 7*24*60*60 */
                        return callback(retCode.GUILD_CANNOT_IMPEACH);
                    }
                    item.itemId = -1;
                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                    item.itemNum = 2000;   /**  2000元宝扣费写死 */
                    subArr.push(item);
                    cPackage.updateItemWithLog(req.zid, req.zuid, subArr, [], req.channel, req.acc, logsWater.GUILDIMPEACH_LOGS, item.tid, function(err) {   /* 扣除 */
                        callback(err);
                    });
                },
                /* 弹劾会长 */
                function(callback) {
                    for (var i = 0; i < guild.member.length; ++i) {
                        if (guild.member[i].zuid == impeachUid) {
                            guild.member[i].title = 0;
                        }
                        if (guild.member[i].zuid == req.zuid) {
                            guild.member[i].title = 2;
                        }
                    }
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);
                }
            ],function(err) {
                if(err) {
                    guildDb.openLockGuildInfo(req.zid, req.zgid);
                    if(retCode.GUILD_CANNOT_IMPEACH == err) {
                        res.canImpeach = 0;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                        return;
                    }
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildImpeach;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改公告
 */
var CS_ChangeGuildInInfo = (function() {

    /**
     * 构造函数
     */
    function CS_ChangeGuildInInfo() {
        this.reqProtocolName = packets.pCSChangeGuildInInfo;
        this.resProtocolName = packets.pSCChangeGuildInInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChangeGuildInInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChangeGuildInInfo();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.zgid
                || null == req.inMsg
                || null == req.outMsg) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, function (err, guildInfo) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        guild = guildInfo;
                        if(guild.inInfo !== req.inMsg || guild.outInfo !== req.outMsg) {  /* 公会公告或宣言红点 */
                            guildCommon.addGuildNotice(req.zid, req.memberZuid, guildInfo.member, cNotice.NOTIF_GUILD_IN_OUT_MSG);
                        }
                        guild.inInfo = req.inMsg;
                        guild.outInfo = req.outMsg;
                        guildDb.updateGuildInfo(req.zid, guild, true, callback);
                    });
                }
            ],function(err) {
                if(err) {
                    guildDb.openLockGuildInfo(req.zid, req.zgid);
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ChangeGuildInInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 任命职位
 */
var CS_GuildAppointMember = (function() {

    /**
     * 构造函数
     */
    function CS_GuildAppointMember() {
        this.reqProtocolName = packets.pCSGuildAppointMember;
        this.resProtocolName = packets.pSCGuildAppointMember;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildAppointMember.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildAppointMember();
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
                || null == req.zgid
                || null == req.memberZuid
                || null == req.titleType) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.titleType = parseInt(req.titleType);

            if(isNaN(req.zid) ||  isNaN(req.titleType)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var characterLevel = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        characterLevel = player.character.level;
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, callback);
                },
                /* 任命 */
                function(guildInfo, callback) {
                    guild = guildInfo;
                    for (var i = 0; i < guild.member.length; ++i) {
                        if (guild.member[i].zuid == req.zuid) {
                            if (guild.member[i].title != 2) {
                                callback(retCode.GUILD_CANNOT_APPOINT);
                                return;
                            }
                        }
                    }
                    if (req.titleType == 2) {
                        for (var k = 0; k < guild.member.length; ++k) {
                            if (guild.member[k].zuid == req.zuid) {
                                guild.member[k].title = 0;
                            }
                            if (guild.member[k].zuid == req.memberZuid) {
                                guild.member[k].title = 2;
                            }
                        }
                    }
                    else if (req.titleType == 1) {
                        for (var j = 0; j < guild.member.length; ++j) {
                            if (guild.member[j].zuid == req.memberZuid) {
                                guild.member[j].title = 1;
                            }
                        }
                    }
                    callback(null);
                },
                /* 更新公会对象 */
                function(callback) {
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);
                },
                /* 获取玩家的部分公会信息 */
                function(callback) {
                    player.getPlayerGuildInfo(req.zid, req.memberZuid, callback);
                },
                /* 加公会动态信息 */
                function(playerData, callback) {
                    var type = 7; /* req.titleType == 1 */
                    if (req.titleType == 2) {
                        type = 6;
                    }
                    guildCommon.addGuildDynamicInfo(req.zid, req.zgid, req.memberZuid, playerData.nickname, type, callback);
                }
            ],function(err) {
                if(err) {
                    guildDb.openLockGuildInfo(req.zid, req.zgid);
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, characterLevel, 4, req.zgid, guild.name, req.memberZuid);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildAppointMember;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 罢免职位
 */
var CS_GuildCancelAppointMember = (function() {

    /**
     * 构造函数
     */
    function CS_GuildCancelAppointMember() {
        this.reqProtocolName = packets.pCSGuildCancelAppointMember;
        this.resProtocolName = packets.pSCGuildCancelAppointMember;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildCancelAppointMember.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildCancelAppointMember();
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
                || null == req.zgid
                || null == req.memberZuid
                || null == req.titleType) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.titleType = parseInt(req.titleType);

            if(isNaN(req.zid)  || isNaN(req.titleType)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var characterLevel = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        characterLevel = player.character.level;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, function (err, guildInfo) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        guild = guildInfo;
                        callback(null);
                    });
                },
                /* 罢免 */
                function(callback) {
                    for (var i = 0; i < guild.member.length; ++i) {
                        if (guild.member[i].zuid == req.zuid) {
                            if (guild.member[i].title != 2) {
                                callback(retCode.GUILD_CANNOT_CANCEL_APPOINT);
                                return;
                            }
                        }
                    }
                    for (var j = 0;  j < guild.member.length; ++j) {
                        if (guild.member[j].zuid == req.memberZuid) {
                            guild.member[j].title = 0;
                        }
                    }
                    callback(null);
                },
                /* 更新公会对象 */
                function(callback) {
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);
                },
                function(callback) {
                    player.getPlayerGuildInfo(req.zid, req.memberZuid, callback);
                },
                /* 加公会动态信息 */
                function(playerData, callback) {
                    guildCommon.addGuildDynamicInfo(req.zid, req.zgid, req.memberZuid, playerData.nickname, 8, callback);
                }
            ],function(err) {
                if(err) {
                    guildDb.openLockGuildInfo(req.zid, req.zgid);
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, characterLevel, 5, req.zgid, guild.name, req.memberZuid);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildCancelAppointMember;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 踢出成员
 */
var CS_GuildRemoveMember = (function() {

    /**
     * 构造函数
     */
    function CS_GuildRemoveMember() {
        this.reqProtocolName = packets.pCSGuildRemoveMember;
        this.resProtocolName = packets.pSCGuildRemoveMember;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildRemoveMember.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildRemoveMember();
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
                || null == req.zgid
                || null == req.memberZuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var nickname = '';
            var characterLevel = 0;
            var infoType = 9;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        characterLevel = player.character.level;
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, callback);
                },
                /* 判断是否可以踢出或退出 */
                function(guildInfo, callback) {
                    guild = guildInfo;
                    var nowTime = parseInt(Date.now() / 1000);
                    if (req.zuid != req.memberZuid) {
                        for (var i = 0; i < guild.member.length; ++i) {
                            if (guild.member[i].zuid == req.zuid) {
                                if (guild.member[i].title == 0) {
                                    callback(retCode.GUILD_CANNOT_REMOVE_MEMBER);
                                    return;
                                }
                                callback(null);
                                return;
                            }
                        }
                    }
                    else{ /* 自己退出公会 */
                        for (var j = 0; j < guild.member.length; ++j) {
                            if (guild.member[j].zuid == req.zuid) {
                                if (guild.member[j].title == 2) {
                                    callback(retCode.GUILD_CANNOT_REMOVE_MEMBER);
                                    return;
                                }
                                else {
                                    infoType = 5;
                                    guildDb.saveRemoveTime(req.zid, req.zuid, nowTime);
                                    callback(null);
                                    return;
                                }
                            }
                        }
                    }
                },
                /* 更新公会对象 */
                function(callback) {
                    for (var i = 0; i < guild.member.length; ++i) {
                        if (guild.member[i].zuid == req.memberZuid) {
                            guild.member.splice(i, 1);
                            break;
                        }
                    }
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);
                },
                /* 更新被踢出成员公会ID */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.memberZuid, true, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        player.guildId = '';
                        nickname = player.name;
                        playerDb.savePlayerData(req.zid, req.memberZuid, player, true, callback);
                    });
                },
                /* 加公会动态信息 */
                function(callback) {
                    guildCommon.addGuildDynamicInfo(req.zid, req.zgid, req.memberZuid, nickname, infoType, callback);
                },
                /* 成员退出或被踢出红点 */
                function(callback) {
                    guildCommon.addGuildNotice(req.zid, req.memberZuid, guild.member, cNotice.NOTIF_GUILD_REMOVE);
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    guildDb.openLockGuildInfo(req.zid, req.zgid);
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, characterLevel, 6, req.zgid, guild.name, req.memberZuid);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildRemoveMember;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取申请成员列表
 */
var CS_GetApplyMemberArr = (function() {

    /**
     * 构造函数
     */
    function CS_GetApplyMemberArr() {
        this.reqProtocolName = packets.pCSGetApplyMemberArr;
        this.resProtocolName = packets.pSCGetApplyMemberArr;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetApplyMemberArr.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetApplyMemberArr();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        callback(null);
                    });
                },
                /* 获取GuildInfo对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, false, callback);
                },
                /* 获取申请人员列表 */
                function(guildInfo, callback) {
                    guild = guildInfo;
                    var applyMemberArr = guild.applyMember;
                    async.each(applyMemberArr, function(applyMemberUid, cb) {
                        player.getPlayerGuildInfo(req.zid, applyMemberUid, function(err, obj) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            res.arr.push(obj);
                            cb(null);
                        });
                    }, function(err) {
                        callback(err);
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
    return CS_GetApplyMemberArr;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加成员
 */
var CS_GuildAddMember = (function() {

    /**
     * 构造函数
     */
    function CS_GuildAddMember() {
        this.reqProtocolName = packets.pCSGuildAddMember;
        this.resProtocolName = packets.pSCGuildAddMember;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildAddMember.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildAddMember();
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
                || null == req.zgid
                || null == req.memberZuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var flag = 0;
            var playerData = null;
            var guildCreate = csvManager.GuildCreated();
            var characterLevel = 0;
            var now = parseInt(Date.now() /1000);

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        characterLevel = player.character.level;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, callback);
                },
                function(guildInfo, callback) {
                    guild = guildInfo;
                    if(guild.member.length >= guildCreate[guild.level].NUMBRE_LIMIT) { /* 判断该公会是否已满员 */
                        callback(retCode.GUILD_MEMBER_FULL);
                        return;
                    }
                    for (var i = 0; i < guild.member.length; ++i) { /* 判断是否为教主或堂主 */
                        if (guild.member[i].zuid == req.zuid ) {
                            if (guild.member[i].title == 0) {
                                return callback(retCode.GUILD_CANNOT_ADD_MEMBER);
                            }
                        }
                    }
                    var index = guild.applyMember.indexOf(req.memberZuid); /* 将该申请人从公会申请列表中移除 */
                    if(-1 != index) {
                        guild.applyMember.splice(index, 1);
                        flag = 1;
                    }
                    if (flag != 1) {
                        callback(retCode.GUILD_ADD_MEM_ERROR);
                        return;
                    }
                    callback(null);
                },
                /* 将该公会从申请人的申请列表中移除 */
                function(callback) {
                    guildDb.getApplyGidArr(req.zid, req.memberZuid, function (err, arr) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        var  applyArr = arr;
                        var index = applyArr.indexOf(req.zgid);
                        if(index > -1) {
                            applyArr.splice(index,1);
                        }
                        guildDb.updateApplyGidArr(req.zid, req.memberZuid, applyArr, callback);
                    });
                },
                /* 判断是否已加入公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.memberZuid, true, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        var gid = cZuid.zuidSplit(player.guildId);
                        if(player.guildId.length <= 0 || gid[1] <= 0) {
                            var memInfo = new globalObject.GuildMemInfo();
                            memInfo.zuid = req.memberZuid;
                            memInfo.title = 0;
                            memInfo.joinTime = now;
                            memInfo.worshipTime = now;

                            guild.member.push(memInfo);
                            /* 更新玩家公会ID */
                            player.guildId = guild.gid;
                            playerData = player;
                            playerDb.savePlayerData(req.zid, req.memberZuid, player, true, callback);
                        } else {
                            playerDb.openLockPlayerData(req.zid, req.memberZuid);
                            guildDb.updateGuildInfo(req.zid, guild, true, function() {});
                            callback(retCode.MEMBERS_BUILD_GUILD);
                        }
                    });
                },
                /* 更新公会信息 */
                function(callback) {
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);
                },
                /* 加公会动态信息 */
                function(callback) {
                    guildCommon.addGuildDynamicInfo(req.zid, req.zgid, req.memberZuid, playerData.name, 4, callback);
                },
                /* 加入公会红点 */
                function(callback) {
                    guildCommon.addGuildNotice(req.zid, req.memberZuid, guild.member, cNotice.NOTIF_GUILD_ADD);
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    guildDb.openLockGuildInfo(req.zid, req.zgid);
                    if(retCode.MEMBERS_BUILD_GUILD == err) {
                        res.memberAddGuild = 1;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    else if(retCode.GUILD_MEMBER_FULL == err) {
                        res.isFull = 1;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    else {
                        logger.LoggerGame.info(err, JSON.stringify(req));
                        http.sendResponseWithResultCode(response, res, err);
                    }
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, characterLevel, 2, req.zgid, guild.name, req.memberZuid);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildAddMember;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 拒绝成员
 */
var CS_GuildRefuseMember = (function() {

    /**
     * 构造函数
     */
    function CS_GuildRefuseMember() {
        this.reqProtocolName = packets.pCSGuildRefuseMember;
        this.resProtocolName = packets.pSCGuildRefuseMember;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildRefuseMember.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildRefuseMember();
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
                || null == req.zgid
                || null == req.memberZuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var flag = 0;
            var characterLevel = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        characterLevel = player.character.level;
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, callback);
                },
                /* 更新公会对象 */
                function(guildInfo, callback) {
                    guild = guildInfo;
                    var index = guild.applyMember.indexOf(req.memberZuid);
                    if(-1 != index) {
                        guild.applyMember.splice(index, 1);
                        flag = 1;
                    }
                    if (flag != 1) {
                        guildDb.openLockGuildInfo(req.zid, req.zgid);
                        return callback(retCode.GUILD_REFUSE_MEM_ERROR);
                    }
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);
                },
                /* 获取申请人的申请列表 */
                function(callback) {
                    guildDb.getApplyGidArr(req.zid, req.memberZuid, callback);
                },
                /* 将该公会的公会ID从申请人的申请列表中移除 */
                function(applyArr, callback) {
                    if (null == applyArr || 0 == applyArr.length) {
                        callback(retCode.GUILD_REFUSE_MEM_ERROR);
                        return;
                    }
                    var index = applyArr.indexOf(req.zgid);
                    if( -1 != index) {
                        applyArr.splice(index, 1);
                        flag = 2;
                    }
                    if (flag != 2) {
                        callback(retCode.GUILD_REFUSE_MEM_ERROR);
                        return;
                    }
                    guildDb.updateApplyGidArr(req.zid, req.memberZuid, applyArr, callback);
                },
                /* 拒绝加入公会红点 */
                function(callback) {
                    guildCommon.addGuildNotice(req.zid, req.memberZuid, guild.member,cNotice.NOTIF_GUILD_REFUSE);
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
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, characterLevel, 7, req.zgid, guild.name, req.memberZuid);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildRefuseMember;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 解散公会
 */
var CS_GuildDissolution = (function() {

    /**
     * 构造函数
     */
    function CS_GuildDissolution() {
        this.reqProtocolName = packets.pCSGuildDissolution;
        this.resProtocolName = packets.pSCGuildDissolution;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildDissolution.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildDissolution();
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
                || null == req.zgid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var guild = null;
            var characterLevel = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 判断是否在公会 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if (req.zgid !== player.guildId) {
                            callback( retCode.SUCCESS); /* 被踢出公会不往下执行 */
                            return;
                        }
                        res.guildId = player.guildId;
                        characterLevel = player.character.level;
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, false, callback);
                },
                function(guildInfo, callback) {
                    guild = guildInfo;
                    /* 检查是否是教主 */
                    for (var i = 0; i < guild.member.length; ++i) {
                        if (guild.member[i].zuid == req.zuid) {
                            if (guild.member[i].title != 2) {
                                callback(retCode.GUILD_CANNOT_DISSOLUTION);
                                return;
                            }
                            break;
                        }
                    }
                    /* 大于10人禁止解散 */
                    var len = guild.member.length;
                    if (len > 10) {
                        callback(retCode.GUILD_NOT_DISSOLUTION);
                        return;
                    }
                    /* 更新公会所有玩家公会ID */
                    var memberArr = guild.member;
                    async.each(memberArr, function(member, cb) {
                        playerDb.getPlayerData(req.zid, member.zuid, true, function(err, player) {
                            if(err) {
                                cb(err);
                                return;
                            }
                            player.guildId = '';
                            player.unionContr = 0;
                            player.todayWorship = 0;
                            playerDb.savePlayerData(req.zid, member.zuid, player, true, function() {});
                            cb(null);
                        });
                    }, function(err) {
                        callback(err);
                    });
                },
                /* 解散公会 */
                function(callback) {
                    guildDb.deleteGuildInfo(req.zid, req.zgid, guild.name, callback);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, characterLevel, 8, req.zgid, guild.name, '');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildDissolution;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 申请或取消申请加入公会
 */
var CS_GuildApplyJoinOrCancel = (function() {

    /**
     * 构造函数
     */
    function CS_GuildApplyJoinOrCancel() {
        this.reqProtocolName = packets.pCSGuildApplyJoinOrCancel;
        this.resProtocolName = packets.pSCGuildApplyJoinOrCancel;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildApplyJoinOrCancel.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildApplyJoinOrCancel();
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
                || null == req.zgid
                || null == req.reqType) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.reqType = parseInt(req.reqType);

            if(isNaN(req.zid) || isNaN(req.reqType)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player; /* 主角对象 */
            var guild; /* 公会对象 */
            var guildCreate = csvManager.GuildCreated();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },


                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 判断是否在公会 */
                function(data, callback) {
                    player = data;

                    if(!cLevelCheck(player, 'guild')) {
                        callback(retCode.LACK_OF_LEVEL);
                        return;
                    }
                    if (player.guildId.length > 0 ) {
                        callback(retCode.GUILD_ADDED);
                        return;
                    }

                    callback(null);
                },
                /* 24小时之内不能再申请公会 */
                function(callback) {
                    var nowTime = parseInt(Date.now() / 1000);
                    guildDb.getRemoveTime(req.zid, req.zuid, function(err, time) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(0 == time) {
                            callback(null);
                            return;
                        }
                        if((nowTime - time) < 86400) {
                            callback(retCode.CAN_NOT_JOIN);
                            return;
                        }
                        callback(null);
                    });
                },
                /* 获取公会对象 */
                function(callback) {
                    guildDb.getGuildInfoByGid(req.zid, req.zgid, true, callback);
                },
                function(guildInfo, callback) {
                    guild = guildInfo;
                    /* 增加或删除申请成员*/
                    if (req.reqType == 1) {
                        if(guild.member.length >= guildCreate[guild.level].NUMBRE_LIMIT) { /* 判断该公会是否已满员 */
                            guildDb.openLockGuildInfo(req.zid, req.zgid);
                            callback(retCode.GUILD_MEMBER_FULL);
                            return;
                        }
                        if(-1 != guild.applyMember.indexOf(req.zuid)) {
                            guildDb.openLockGuildInfo(req.zid, req.zgid);
                            callback(retCode.GUILD_APPLY_JOIN);
                            return;
                        }
                        guild.applyMember.push(req.zuid);
                    }
                    else if (req.reqType == 2) {
                        var index = guild.applyMember.indexOf(req.zuid);
                        if(-1 != index) {
                            guild.applyMember.splice(index, 1);
                        }
                    }
                    else {
                        guildDb.openLockGuildInfo(req.zid, req.zgid);
                        callback(retCode.GUILD_APPLY_TYPE_ERROR);
                        return;
                    }
                    callback(null);
                },
                /* 更新公会对象 */
                function(callback) {
                    guildDb.updateGuildInfo(req.zid, guild, true, callback);
                },
                /* 获取所申请的公会的列表 */
                function(callback) {
                    guildDb.getApplyGidArr(req.zid, req.zuid, callback);
                },
                function(applyArr, callback) {
                    if (req.reqType == 1) {
                        applyArr.push(req.zgid);
                        callback(null);
                    }
                    else if (req.reqType == 2) {
                        var index = applyArr.indexOf(req.zgid);
                        if(-1 != index) {
                            applyArr.splice(index, 1);
                        }
                        callback(null);
                    }
                    else {
                        callback(retCode.GUILD_APPLY_TYPE_ERROR);
                        return;
                    }
                    /* 更新申请的公会的列表 */
                    guildDb.updateApplyGidArr(req.zid, req.zuid, applyArr, callback);
                }
            ],function(err) {
                if(err) {
                    if(retCode.GUILD_MEMBER_FULL == err) {
                        res.isFull = 1;
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                    }
                    if(retCode.CAN_NOT_JOIN == err){
                        res.appliable = 0;
                        http.sendResponseWithResultCode(response, res,  retCode.SUCCESS);
                    }
                    else {
                        logger.LoggerGame.info(err, JSON.stringify(req));
                        http.sendResponseWithResultCode(response, res, err);
                    }
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_gang, preZid, req.channel, req.zuid, req.zuid, player.character.level, 1, guild.gid, guild.name, '');
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GuildApplyJoinOrCancel;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取公会ID
 */
var CS_GetGuildId = (function() {

    /**
     * 构造函数
     */
    function CS_GetGuildId() {
        this.reqProtocolName = packets.pCSGetGuildId;
        this.resProtocolName = packets.pSCGetGuildId;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetGuildId.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetGuildId();
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

            req.zid  = parseInt(req.zid );

            if(isNaN(req.zid )) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取玩家公会ID */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.guildId = player.guildId;
                        callback(null);
                    });
                },

                function(callback) {
                    async.series({
                        checkBattleStart: function (cb) {
                            guildBossCommon.checkBattleStart(req.zid, req.zuid, res.guildId, function (err) {
                                if(!!err && err !== retCode.GUILD_BOSS_NOT_EXIST && err !== retCode.GUILD_BOSS_WARRIOR_NOT_EXIST) { /* check failed, try next check */
                                    cb(null);
                                    return;
                                }
                                res.guildBossRedPoint = 1; /* check success, over */
                                cb('over');
                            });
                        },

                        checkGetReward: function (cb) {
                            guildBossCommon.checkGetReward(req.zid, req.zuid, res.guildId, function (err) {
                                if(!!err) { /* check success*/
                                    cb(null);
                                    return;
                                }
                                res.guildBossRedPoint = 1;
                                cb(null);
                            });
                        }
                    }, function () {
                        callback(null);
                    });
                },
                
                function(callback) {
                    guildCommon.delGuildNotice(req.zid, req.zuid, cNotice.NOTIF_GUILD_ADD);
                    guildCommon.delGuildNotice(req.zid, req.zuid, cNotice.NOTIF_GUILD_REFUSE);
                    guildCommon.delGuildNotice(req.zid, req.zuid, cNotice.NOTIF_GUILD_IN_OUT_MSG);
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
    return CS_GetGuildId;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会排行
 */
var CS_GuildRanklist = (function() {

    /**
     * 构造函数
     */
    function CS_GuildRanklist() {
        this.reqProtocolName = packets.pCSGuildRanklist;
        this.resProtocolName = packets.pSCGuildRanklist;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GuildRanklist.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GuildRanklist();
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

            req.zid  = parseInt(req.zid );

            if(isNaN(req.zid )) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var guildId = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取公会ID */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        guildId = player.guildId;
                        callback(null);
                    });
                },
                /* 赋值自己公会的排名 */
                function(callback) {
                    var gid = cZuid.zuidSplit(guildId);
                    if(guildId.length == 0 || parseInt(gid[1]) <= 0) {
                        res.myRanking = -1;
                        callback(null);
                        return;
                    }
                    guildDb.getGuildRankListIndex(req.zid, guildId, function(err, ranking) {
                        if(err) {
                           callback(err);
                        }
                        res.myRanking = ranking;
                        if(ranking > 200 || -1 == ranking) {
                            res.myRanking = 0; /* 不在200名以内，发0 */
                        }
                        callback(null);
                    });
                },
                /* 赋值前n名公会信息 */
                function(callback) {
                    guildDb.getGuildRankList(req.zid, callback);
                },
                function(ranklist, callback) {
                    async.map(ranklist, function(gid, cb) {
                        guildDb.getGuildInfoByGid(req.zid, gid, false, function (err, guildInfo) {
                            if(err) {
                                cb(err);
                                return;
                            }
                            var memberArr = guildInfo.member;
                            var zuid = null;
                            for(var i = 0; i < memberArr.length; ++i) {
                                if(2 != memberArr[i].title) {
                                    continue;
                                }
                                zuid = memberArr[i].zuid;
                            }
                            /* 找会长名 */
                            playerDb.getPlayerData(req.zid, zuid, false, function (err, player) {
                                if (err) {
                                    cb(err);
                                    return;
                                }
                                var rankObj = new protocolObject.GuildRanklistObject();
                                rankObj.guildName = guildInfo.name;
                                rankObj.currMemberCount = guildInfo.member.length;
                                rankObj.ranking = ranklist.indexOf(gid) + 1;
                                /* 排名 */
                                rankObj.guildLv = guildInfo.level;
                                rankObj.hierarchName = player.name;
                                cb(null, rankObj);
                            });
                        });
                    }, function(err, result) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.ranklist = result;
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
    return CS_GuildRanklist;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_CreateGuild());
    exportProtocol.push(new CS_GetGuildArr());
    exportProtocol.push(new CS_SearchGuildName());
    exportProtocol.push(new CS_GetGuildWorshipInfo());
    exportProtocol.push(new CS_GuildWorship());
    exportProtocol.push(new CS_GetGuildWorshipReward());
    exportProtocol.push(new CS_GuildInfoArr());
    exportProtocol.push(new CS_GetGuildMemberArr());
    exportProtocol.push(new CS_GuildImpeach());
    exportProtocol.push(new CS_ChangeGuildInInfo());
    exportProtocol.push(new CS_GuildAppointMember());
    exportProtocol.push(new CS_GuildCancelAppointMember());
    exportProtocol.push(new CS_GuildRemoveMember());
    exportProtocol.push(new CS_GetApplyMemberArr());
    exportProtocol.push(new CS_GuildAddMember());
    exportProtocol.push(new CS_GuildRefuseMember());
    exportProtocol.push(new CS_GuildDissolution());
    exportProtocol.push(new CS_GuildApplyJoinOrCancel());
    exportProtocol.push(new CS_GetGuildId());
    exportProtocol.push(new CS_GuildRanklist());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
