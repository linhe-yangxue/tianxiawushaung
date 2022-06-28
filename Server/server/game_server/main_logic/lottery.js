/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：抽奖请求 普通抽奖 普通十连抽 高级抽奖 高级十连抽
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/lottery');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var redisKey = require('../../common/redis_key');
var async = require("async");
var accountDb = require('../database/account');
var packageDb = require('../database/package');
var cPackage = require('../common/package');
var csvManager = require('../../manager/csv_manager').Instance();
var logger = require('../../manager/log4_manager');
var lotteryDb = require('../database/lottery');
var csvExtends = require('../../manager/csv_extend_manager').Instance();
var dbManager = require('../../manager/redis_manager').Instance();
var itemType = require('../common/item_type');
var protocolObject = require('../../common/protocol_object');
var cMission = require('../common/mission');
var timeUtil = require('../../tools/system/time_util');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');
var playerDb = require('../database/player');
var wallPaper = require('../database/wallPaper');
var globalObject = require('../../common/global_object');
var cLottery = require('../common/lottery');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 免费抽奖次数请求
 */
var CS_LotteryQuery = (function() {

    /**
     * 构造函数
     */
    function CS_LotteryQuery() {
        this.reqProtocolName = packets.pCSLotteryQuery;
        this.resProtocolName = packets.pSCLotteryQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_LotteryQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_LotteryQuery();
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

            var chaLvl; /* 主角等级 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                function(player, callback) {
                    chaLvl = player.character.level;
                    lotteryDb.getLotteryCnt(req.zid, req.zuid, false, callback);
                },

                function(lotteryCnt, callback){
                    var pcTable = csvManager.PumpingConfig();
                    var tot = 1;
                    for(var i in pcTable) {
                        var pcLine = pcTable[i];
                        if(pcLine.TYPE === 1 && chaLvl >= pcLine.LEVEL_MIN && chaLvl <= pcLine.LEVEL_MAX) {
                            tot = pcLine.GROUP_ID.split('|').length;
                            break;
                        }
                    }
                    res.times = lotteryCnt % tot + 1;

                    lotteryDb.getLottery(req.zid, req.zuid, false, callback);
                },

                function(pLottery, callback) {
                    res.preciousLottery = cLottery.lotteryFromDbToRes(pLottery, chaLvl, false);
                    lotteryDb.getLottery(req.zid, req.zuid, true, callback);
                },

                function(nLottery, callback) {
                    res.normalLottery = cLottery.lotteryFromDbToRes(nLottery, chaLvl, true);
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
    return CS_LotteryQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 普通抽奖
 */
var CS_NormalLottery = (function() {

    /**
     * 构造函数
     */
    function CS_NormalLottery() {
        this.reqProtocolName = packets.pCSNormalLottery;
        this.resProtocolName = packets.pSCNormalLottery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_NormalLottery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_NormalLottery();
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
                || null == req.consume) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.consume.itemId
                || null == req.consume.tid
                || null == req.consume.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.consume.itemId = parseInt(req.consume.itemId);
            req.consume.tid = parseInt(req.consume.tid);
            req.consume.itemNum = parseInt(req.consume.itemNum);

            if(isNaN(req.consume.itemId) || isNaN(req.consume.tid) || isNaN(req.consume.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var isFree = 0;
            var lotteryCnt = 0;
            var lottery;
            var player;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                function(result, callback) {
                    player = result;
                    lotteryDb.getLotteryCnt(req.zid, req.zuid, true, callback);
                },

                function(result, callback) {
                    lotteryCnt = result;
                    lotteryDb.getLottery(req.zid, req.zuid, true, callback);
                },

                function(result, callback) {
                    lottery = result;
                    var arrAdd = [];
                    var arrSub = [];
                    var oLottery = cLottery.lotteryFromDbToRes(lottery, player.character.level, true);
                    isFree = oLottery.isFree;

                    var pcTable = csvManager.PumpingConfig();
                    var pcLine;
                    for(var i in pcTable) {
                        pcLine = pcTable[i];
                        if(pcLine.TYPE === 3 && player.character.level >= pcLine.LEVEL_MIN && player.character.level <= pcLine.LEVEL_MAX) {
                            break;
                        }
                    }

                    if(isFree) {
                        lottery.lastTime = parseInt(Date.now() / 1000);
                        lottery.todayCnt += 1;
                    }
                    else {
                        req.consume.tid = itemType.ITEM_TYPE_SILVERCARD;
                        req.consume.itemNum = pcLine.PUMPING_PRICE_1 * pcLine.PUMPING_MULTIPLE;
                        arrSub.push(req.consume);
                    }

                    var a = pcLine.GROUP_ID.split("|");
                    var index = lotteryCnt % a.length;
                    csvExtends.StageLootGroupIDConfig_DropId(a[index].split('#')[0], 1, function(err, result) {
                        if(!err) {
                            arrAdd = result;
                            ++ lotteryCnt;
                        }
                    });

                    res.freeGold = pcLine.GET_MONEY;
                    var itemGold = new globalObject.ItemBase();
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = pcLine.GET_MONEY;
                    arrAdd.push(itemGold);

                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.NORMALLOTTERY_LOGS, req.consume.tid, function(err, subArr, addArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.reward = addArr[0];
                        callback(null);
                    });
                },

                function (callback) {
                    /* 更新抽卡状态 */
                    lotteryDb.setLottery(req.zid, req.zuid, true, lottery);
                    lotteryDb.setLotteryCnt(req.zid, req.zuid, true, lotteryCnt);

                    /* 更新任务进度 */
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_20, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_20, 0,  0, 1);
                    /* 更新玩家走马灯信息 */
                    wallPaper.updateRollingWallPaper(req.zid, req.zuid, player, -1, 1, [res.reward]);
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
                    logger.logBI(preZid, biCode.logs_lottery_draw, preZid, req.channel, req.zuid, req.zuid, 0, isFree, req.consume.itemNum, JSON.stringify(res.reward), JSON.stringify(req.consume));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_NormalLottery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 普通十连抽
 */
var CS_TenNormalLottery = (function() {

    /**
     * 构造函数
     */
    function CS_TenNormalLottery() {
        this.reqProtocolName = packets.pCSTenNormalLottery;
        this.resProtocolName = packets.pSCTenNormalLottery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_TenNormalLottery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_TenNormalLottery();
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
                || null == req.consume) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.consume.itemId
                || null == req.consume.tid
                || null == req.consume.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.consume.itemId = parseInt(req.consume.itemId);
            req.consume.tid = parseInt(req.consume.tid);
            req.consume.itemNum = parseInt(req.consume.itemNum);

            if(isNaN(req.consume.itemId) || isNaN(req.consume.tid) || isNaN(req.consume.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var lotteryCnt = 0;
            var player;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                function(result, callback) {
                    player = result;
                    lotteryDb.getLotteryCnt(req.zid, req.zuid, true, callback);
                },

                function(result, callback) {
                    lotteryCnt = result;

                    var pcTable = csvManager.PumpingConfig();
                    var pcLine;
                    for(var i in pcTable) {
                        pcLine = pcTable[i];
                        if(pcLine.TYPE === 4 && player.character.level >= pcLine.LEVEL_MIN && player.character.level <= pcLine.LEVEL_MAX) {
                            break;
                        }
                    }

                    var arrAdd = [];
                    var arrSub = [];
                    req.consume.tid = itemType.ITEM_TYPE_SILVERCARD;
                    req.consume.itemNum = pcLine.PUMPING_PRICE_1 * pcLine.PUMPING_MULTIPLE;
                    arrSub.push(req.consume);

                    var a = pcLine.GROUP_ID.split("|");
                    for(var i = 0; i < pcLine.PUMPING_NUMBER; ++i) {
                        var index = lotteryCnt % a.length;
                        csvExtends.StageLootGroupIDConfig_DropId(a[index].split('#')[0], 1, function(err, result) {
                            if(!err) {
                                arrAdd = arrAdd.concat(result);
                                ++ lotteryCnt;
                            }
                        });
                    }

                    res.freeGold = pcLine.GET_MONEY;
                    var itemGold = new globalObject.ItemBase();
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = pcLine.GET_MONEY;
                    arrAdd.push(itemGold);

                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.TENNORMALLOTTERY_LOGS, req.consume.tid, function(err, subArr, addArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.reward = addArr;
                        callback(null);
                    });
                },

                function (callback) {
                    /* 更新抽卡状态 */
                    lotteryDb.setLotteryCnt(req.zid, req.zuid, true, lotteryCnt);
                    /* 更新任务进度 */
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_20, 0, 10);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_20, 0,  0, 10);
                    /* 更新玩家走马灯信息 */
                    wallPaper.updateRollingWallPaper(req.zid, req.zuid, player, -1, 1, res.reward);
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
                    logger.logBI(preZid, biCode.logs_lottery_draw, preZid, req.channel, req.zuid,
                        req.zuid, 0, 3, req.consume.itemNum, JSON.stringify(res.reward), JSON.stringify(req.consume));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_TenNormalLottery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 高级抽卡
 */
var CS_PreciousLottery = (function() {

    /**
     * 构造函数
     */
    function CS_PreciousLottery() {
        this.reqProtocolName = packets.pCSPreciousLottery;
        this.resProtocolName = packets.pSCPreciousLottery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_PreciousLottery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_PreciousLottery();
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
                || null == req.consume) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.consume.itemId
                || null == req.consume.tid
                || null == req.consume.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.consume.itemId = parseInt(req.consume.itemId);
            req.consume.tid = parseInt(req.consume.tid);
            req.consume.itemNum = parseInt(req.consume.itemNum);

            if(isNaN(req.consume.itemId) || isNaN(req.consume.tid) || isNaN(req.consume.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var isFree = 0;
            var lotteryCnt = 0;
            var lottery;
            var player;
            var petPkg;
            var petFrgPkg;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    packageDb.getPlayerAndPackages(req.zid, req.zuid, false, callback);
                },

                function(pap, callback) {
                    player = pap[0];
                    petPkg = pap[globalObject.PACKAGE_TYPE_PET];
                    petFrgPkg = pap[globalObject.PACKAGE_TYPE_PET_FRAGMENT];
                    lotteryDb.getLotteryCnt(req.zid, req.zuid, false, callback);
                },

                function(result, callback) {
                    lotteryCnt = result;
                    lotteryDb.getLottery(req.zid, req.zuid, false, callback);
                },

                function(result, callback) {
                    lottery = result;
                    var arrAdd = [];
                    var arrSub = [];
                    var oLottery = cLottery.lotteryFromDbToRes(lottery, player.character.level, false);
                    isFree = oLottery.isFree;

                    var pcTable = csvManager.PumpingConfig();
                    var pcLine;
                    for(var i in pcTable) {
                        pcLine = pcTable[i];
                        if(pcLine.TYPE === 1 && player.character.level >= pcLine.LEVEL_MIN && player.character.level <= pcLine.LEVEL_MAX) {
                            break;
                        }
                    }

                    if(isFree) {
                        lottery.lastTime = parseInt(Date.now() / 1000);
                        lottery.todayCnt += 1;
                    }
                    else {
                        if(req.consume.tid == itemType.ITEM_TYPE_GOLDCARD) {
                            req.consume.itemNum = pcLine.PUMPING_PRICE_2 * pcLine.PUMPING_MULTIPLE;
                        }
                        else if (req.consume.tid == itemType.ITEM_TYPE_DIAMOND) {
                            req.consume.itemNum = pcLine.PUMPING_PRICE_3 * pcLine.PUMPING_MULTIPLE;
                        }
                        else {
                            callback(retCode.WRONG_ITEM_TYPE);
                            return;
                        }
                        arrSub.push(req.consume);
                    }

                    var a = pcLine.GROUP_ID.split("|");
                    var index = lotteryCnt % a.length;
                    var groupId = parseInt(a[index].split('#')[0]);
                    var item = cLottery.dropWithHiddenRule(petPkg, petFrgPkg, lotteryCnt+1, groupId);
                    arrAdd.push(item);
                    lotteryCnt += 1;

                    res.freeGold = pcLine.GET_MONEY;
                    var itemGold = new globalObject.ItemBase();
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = pcLine.GET_MONEY;
                    arrAdd.push(itemGold);

                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.PRECIOUSLOTTERY_LOGS, req.consume.tid, function(err, subArr, addArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.reward = addArr[0];
                        callback(null);
                    });
                },

                function (callback) {
                    /* 更新抽卡状态 */
                    lotteryDb.setLottery(req.zid, req.zuid, false, lottery);
                    lotteryDb.setLotteryCnt(req.zid, req.zuid, false, lotteryCnt);
                    /* 更新任务进度 */
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_21, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_21, 0,  0, 1);
                    /* 更新玩家走马灯信息 */
                    wallPaper.updateRollingWallPaper(req.zid, req.zuid, player, -1, 1, [res.reward]);
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
                    logger.logBI(preZid, biCode.logs_lottery_draw, preZid, req.channel, req.zuid,
                        req.zuid, 0, isFree, req.consume.itemNum, JSON.stringify(res.reward), JSON.stringify(req.consume));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_PreciousLottery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 高级十连抽
 */
var CS_TenPreciousLottery = (function() {

    /**
     * 构造函数
     */
    function CS_TenPreciousLottery() {
        this.reqProtocolName = packets.pCSTenPreciousLottery;
        this.resProtocolName = packets.pSCTenPreciousLottery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_TenPreciousLottery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_TenPreciousLottery();
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

            var lotteryCnt = 0;
            var player;
            var petPkg;
            var petFrgPkg;
            var itemDiamond = new globalObject.ItemBase();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function (callback) {
                    packageDb.getPlayerAndPackages(req.zid, req.zuid, false, callback);
                },

                function(pap, callback) {
                    player = pap[0];
                    petPkg = pap[globalObject.PACKAGE_TYPE_PET];
                    petFrgPkg = pap[globalObject.PACKAGE_TYPE_PET_FRAGMENT];
                    lotteryDb.getLotteryCnt(req.zid, req.zuid, false, callback);
                },

                function(result, callback) {
                    lotteryCnt = result;

                    var pcTable = csvManager.PumpingConfig();
                    var pcLine;
                    for(var i in pcTable) {
                        pcLine = pcTable[i];
                        if(pcLine.TYPE === 2 && player.character.level >= pcLine.LEVEL_MIN && player.character.level <= pcLine.LEVEL_MAX) {
                            break;
                        }
                    }

                    var arrAdd = [];
                    var arrSub = [];
                    itemDiamond.tid = itemType.ITEM_TYPE_DIAMOND;
                    itemDiamond.itemNum = pcLine.PUMPING_PRICE_3 * pcLine.PUMPING_MULTIPLE;
                    arrSub.push(itemDiamond);

                    var a = pcLine.GROUP_ID.split("|");
                    for(var i = 0; i < pcLine.PUMPING_NUMBER; ++i) {
                        var index = lotteryCnt % a.length;
                        var groupId = parseInt(a[index].split('#')[0]);
                        var item = cLottery.dropWithHiddenRule(petPkg, petFrgPkg, lotteryCnt+1, groupId);
                        arrAdd.push(item);
                        petPkg.content.push(item); /* 本次抽卡会影响下次抽卡 */
                        lotteryCnt += 1;
                    }

                    res.freeGold = pcLine.GET_MONEY;
                    var itemGold = new globalObject.ItemBase();
                    itemGold.tid = itemType.ITEM_TYPE_GOLD;
                    itemGold.itemNum = pcLine.GET_MONEY;
                    arrAdd.push(itemGold);

                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.TENPRECIOUSLOTTERY_LOGS, itemDiamond.tid, function(err, subArr, addArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.reward = addArr;
                        callback(null);
                    });
                },

                function (callback) {
                    /* 更新抽卡状态 */
                    lotteryDb.setLotteryCnt(req.zid, req.zuid, false, lotteryCnt);
                    /* 更新任务进度 */
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_21, 0, 10);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_21, 0,  0, 10);
                    /* 更新玩家走马灯信息 */
                    wallPaper.updateRollingWallPaper(req.zid, req.zuid, player, -1, 1, res.reward);
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
                    logger.logBI(preZid, biCode.logs_lottery_draw, preZid, req.channel, req.zuid,
                        req.zuid, 0, 5, itemDiamond.itemNum, JSON.stringify(res.reward), JSON.stringify(itemDiamond));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_TenPreciousLottery;
})();

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_LotteryQuery());
    exportProtocol.push(new CS_NormalLottery());
    exportProtocol.push(new CS_TenNormalLottery());
    exportProtocol.push(new CS_PreciousLottery());
    exportProtocol.push(new CS_TenPreciousLottery());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;


