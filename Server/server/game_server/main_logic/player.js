/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：玩家数据：创建角色、获取主角、访问玩家
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：floven [审阅中] [20150924前修改完成]
 * 优化建议：
 *      1.放到下一个瀑布中，现在的写法不安全， warning01 [未完成]
 *      2.注解不完整，添加详细的功能描述 [未完成]
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/player');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var logger = require('../../manager/log4_manager');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var packageDb = require('../database/package');
var mainUiRankDb = require('../database/main_ui_rank');
var arenaDb = require('../database/arena');
var cPlayer = require('../common/player');
var cPackage = require('../common/package');
var biCode = require('../../common/bi_code');
var itemType= require('../common/item_type');
var logsWater = require('../../common/logs_water');
var robot = require('../../common/robot');
var cZuid = require('../common/zuid');
var cRevelry = require('../common/revelry');
var awardObt = require('../database/award_obt');
var guildDb = require('../database/guild');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 创建角色
 */
var CS_CreatePlayer = (function() {

    /**
     * 构造函数
     */
    function CS_CreatePlayer() {
        this.reqProtocolName = packets.pCSCreatePlayer;
        this.resProtocolName = packets.pSCCreatePlayer;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_CreatePlayer.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_CreatePlayer();
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
                || null == req.chaModelIndex
                || null == req.playerName
                || null == req.systemSoftware
                || null == req.systemHardware) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.chaModelIndex = parseInt(req.chaModelIndex);

            if(isNaN(req.zid) || isNaN(req.chaModelIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 检测是否已经创角 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, result) {
                        if (result) {
                            callback(retCode.PLAYER_AlREADY_EXIST);
                        }
                        else if(err == retCode.PLAYER_NOT_EXIST) {
                            callback(null);
                        }
                        else {
                            callback(err);
                        }
                    });
                },

                /* 人物验证 */
                function(callback) {
                    cPlayer.checkChaModel(req.chaModelIndex, callback);
                },
                /* 名字合法性检测 */
                function(callback) {
                    cPlayer.checkPlayerName(req.playerName, callback);
                },
                /* 名字唯一性检测 */
                function(callback) {
                    playerDb.bindNameWithZuid(req.zid, req.playerName, req.zuid, callback);
                },

                /* 创建背包，添加符灵 */
                function(callback) {
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    var now = new Date();

                    /* 创建player */
                    var player = new globalObject.Player();
                    player.name = req.playerName;
                    player.character.tid = req.chaModelIndex;
                    player.skin.push(player.character.tid);
                    player.createDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                    
                    /* 保存player和背包 */
                    var playerAndPackages = [];
                    playerAndPackages[0] = player;
                    for (var i = 1; i <= 7; ++i) {
                        playerAndPackages[i] = new globalObject.Package(i);
                    }
                    packageDb.savePlayerAndPackages(req.zid, req.zuid, playerAndPackages, false, callback);

                    /* 加入主界面等级、战斗力排行榜 */
                    mainUiRankDb.updateLevelRanklist(req.zid, req.zuid, player.character.level, parseInt(now.getTime()/1000));
                    mainUiRankDb.updatePowerRanklist(req.zid, req.zuid, player.power, parseInt(now.getTime()/1000));
                    accountDb.addZoneMemCnt(preZid);
                    playerDb.addZuidInZone(req.zid, req.zuid);
                },

                /* 赠送默认物品 */
                function(callback) {
                    var arrAdd = [];
                    var bsTable = csvManager.BeginnerSend();

                    for(var i in bsTable) {
                        var item = new globalObject.ItemBase();
                        var attrs = bsTable[i].PROPS.split('#');
                        item.tid = attrs[0];
                        item.itemNum = attrs[1];
                        arrAdd.push(item);
                    }

                    cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd,  req.channel, req.acc, logsWater.BEGINNER_SEND, '', function (err) {
                        callback(err);
                    });
                },
                function(callback) {
                    awardObt.awardOBT(req.zid, req.zuid); /* 公测返还发邮件 */
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
                    logger.logBI(preZid, biCode.logs_character_create, preZid, req.channel, req.zuid, req.zuid, req.playerName, req.chaModelIndex, 1, req.systemSoftware, req.systemHardware);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_CreatePlayer;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取主角
 */
var CS_GetPlayerData = (function() {

    /**
     * 构造函数
     */
    function CS_GetPlayerData() {
        this.reqProtocolName = packets.pCSGetPlayerData;
        this.resProtocolName = packets.pSCGetPlayerData;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetPlayerData.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetPlayerData();
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

            var player;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取player数据 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, true,  function(err, result) {
                        /* 角色数据不存在时提示客户端创建角色 */
                        if(retCode.PLAYER_NOT_EXIST == err) {
                            res.newPlayer = 1;
                            callback(retCode.SUCCESS);
                        }
                        else if(err) {
                            callback(err);
                        }
                        else {
                            player = result;
                            callback(null);
                        }
                    });
                },

                /* 更新体力、精力、降魔令 */
                function(callback) {
                    cPackage.recoverAttr(player);
                    playerDb.savePlayerData(req.zid, req.zuid, player, true, callback);
                },

                /* 设置返回值 */
                function(callback) {
                    /* 记录登陆信息 */
                    var p = cZuid.zuidSplit(req.zuid);
                    var preZid = p[0];
                    var preUid = p[1];

                    var userLoginInfo = new globalObject.UserLoginInfo();
                    userLoginInfo.zid = preZid;
                    userLoginInfo.name = player.name;
                    userLoginInfo.level = player.character.level;
                    userLoginInfo.lastTime = parseInt(Date.now() / 1000);
                    accountDb.addLoginInfo(preUid, userLoginInfo);

                    res.name= player.name;
                    res.iconIndex = player.character.tid;
                    res.gold = player.gold;
                    res.diamond = player.diamond;
                    res.stamina =player.stamina;
                    res.spirit = player.spirit;
                    res.soulPoint = player.soulPoint;
                    res.reputation = player.reputation;
                    res.prestige = player.prestige;
                    res.battleAchv = player.battleAchv;
                    res.unionContr = player.unionContr;
                    res.beatDemonCard = player.beatDemonCard;
                    res.vipLevel = player.vipLevel;
                    res.power = player.power;
                    res.character = player.character;
                    res.skin = player.skin;
                    res.lastLoginTime = player.lastLoginTime;
                    res.guildId = player.guildId;
                    res.staminaStamp = player.staminaStamp;
                    res.spiritStamp = player.spiritStamp;
                    res.beatDemonCardStamp = player.beatDemonCardStamp;
                    res.createDate = player.createDate;
                    res.vipExp = player.vipExp;
                    res.money = player.money;

                    callback(null);
                }
            ],function(err) {
                if(err && err != retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetPlayerData;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 访问玩家
 */
var CS_VisitPlayer = (function() {

    /**
     * 构造函数
     */
    function CS_VisitPlayer() {
        this.reqProtocolName = packets.pCSVisitPlayer;
        this.resProtocolName = packets.pSCVisitPlayer;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_VisitPlayer.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_VisitPlayer();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.targetId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(robot.checkIfRobot(req.targetId)) { /* 机器人 */
                async.waterfall([
                    /* Game server 网络令牌验证 */
                    function(callback) {
                        accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                    },

                    function(callback) {
                        arenaDb.getArenaRobot(req.targetId, callback);
                    },

                    function(playerFD, callback) {
                        res.name = playerFD.name;
                        res.power = playerFD.power;

                        for(var i = 0; i < playerFD.petFDs.length; ++i) {
                            res.arr[i] = {};
                            res.arr[i].tid = playerFD.petFDs[i].tid;
                            res.arr[i].level = playerFD.level;
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
            }
            else {
                var player;
                async.waterfall([
                    /* Game server 网络令牌验证 */
                    function(callback) {
                        accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                    },

                    function(callback) {
                        playerDb.getPlayerData(req.zid, req.targetId, false, callback);
                    },

                    function(result, callback) {
                        player = result;

                        res.name = player.name;
                        res.power = player.power;
                        res.arr.push({});
                        res.arr[0].tid = player.character.tid;
                        res.arr[0].level = player.character.level;
                        packageDb.getPackage(req.zid, req.targetId, globalObject.PACKAGE_TYPE_PET, false, callback);
                    },

                    function(pkg, callback) {
                        for(var i = 0; i < pkg.content.length; ++i) {
                            var tIndex = pkg.content[i].teamPos;
                            if(tIndex > 0 && tIndex < 4) {
                                res.arr[tIndex] = {};
                                res.arr[tIndex].tid = pkg.content[i].tid;
                                res.arr[tIndex].level = pkg.content[i].level;
                            }
                        }
                        callback(null);
                    },

                    /* 获取公会名 */
                    function(callback) {
                        guildDb.getGuildInfoByGid(req.zid, player.guildId, false, function(err, result) {
                            if(result) {
                                res.guildName = result.name;
                            }

                            if(retCode.GUILD_NOT_EXIST == err) {
                                err = null;
                            }

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
            }
        });
    };
    return CS_VisitPlayer;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_CreatePlayer());
    exportProtocol.push(new CS_GetPlayerData());
    exportProtocol.push(new CS_VisitPlayer());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

