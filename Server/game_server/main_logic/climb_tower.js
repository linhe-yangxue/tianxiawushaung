/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：爬塔（群魔乱舞）：获取爬塔信息、开始爬塔、结束爬塔、选择buff、购买打折商品、重值爬塔
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/climb_tower');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var climbTowerDb = require('../database/climb_tower');
var math = require('../../tools/system/math');
var globalObject = require('../../common/global_object');
var itemType = require('../common/item_type');
var protocolObject = require('../../common/protocol_object');
var cMission = require('../common/mission');
var playerDb = require('../database/player');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cRevelry = require('../common/revelry');
var cZuid = require('../common/zuid');
var clevelCheck = require('../common/level_check');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取爬塔信息
 */
var CS_GetTowerClimbingInfo = (function() {

    /**
     * 构造函数
     */
    function CS_GetTowerClimbingInfo() {
        this.reqProtocolName = packets.pCSGetTowerClimbingInfo;
        this.resProtocolName = packets.pSCGetTowerClimbingInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetTowerClimbingInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetTowerClimbingInfo();
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

            var info = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function (callback) { /* 将失败推荐道具钱取出来 */
                    climbTowerDb.getGroupPrice(req.zid, req.zuid, callback);
                },

                /* 获取爬塔信息 */
                function(price, callback) {
                    res.originalItemPrice = price[1];
                    res.saleItemPrice = price[0];
                    climbTowerDb.getTowerClimbingInfo(req.zid, req.zuid, callback);
                },

                /* 每天更新重置次数 */
                function(towerClimbingInfo, callback) {
                    info = towerClimbingInfo;

                    var today = (new Date()).toDateString();
                    if(info.lastResetDate != today) {
                        info.lastResetDate = today;
                        info.resetTimes = 0;
                        climbTowerDb.setTowerClimbingInfo(req.zid, req.zuid, info, callback);
                    }
                    else {
                        callback(null);
                    }
                },

                /* 设置返回数据 */
                function(callback) {
                    res.rankStars = info.rankStars;
                    res.currentStars = info.currentStars;
                    res.remainStars = info.remainStars;
                    res.nextTier = info.nextTier;
                    res.tierState = info.tierState;
                    res.buffList = info.buffList;
                    res.chooseBuff = info.chooseBuff;
                    res.starList = info.starList;
                    res.resetTimes = info.resetTimes;
                    res.itemOnSale = info.itemOnSale;
                    res.saleItemState = info.saleItemState;
                    res.previousTierStarNum = info.previousTierStarNum;
                    callback(null);
                },
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
    return CS_GetTowerClimbingInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开始爬塔
 */
var CS_ClimbTowerStart = (function() {

    /**
     * 构造函数
     */
    function CS_ClimbTowerStart() {
        this.reqProtocolName = packets.pCSClimbTowerStart;
        this.resProtocolName = packets.pSCClimbTowerStart;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ClimbTowerStart.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClimbTowerStart();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.crtTierStars) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.crtTierStars = parseInt(req.crtTierStars);

            if(isNaN(req.zid) || isNaN(req.crtTierStars)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取爬塔信息 */
                function(callback) {
                    climbTowerDb.getTowerClimbingInfo(req.zid, req.zuid, callback);
                },

                /* 保存挑战级别 */
                function(towerClimbingInfo, callback) {
                    if(towerClimbingInfo.tierState == 0) {
                        callback(retCode.TOWER_CLIMBING_STATE_ERR);
                        return;
                    }

                    if(req.crtTierStars < 1 || req.crtTierStars > 3) {
                        callback(retCode.TOWER_CLIMBING_REQ_STAR_ERR);
                        return;
                    }

                    towerClimbingInfo.crtTierStars = req.crtTierStars;
                    towerClimbingInfo.startClimbTime = parseInt(Date.now() / 1000);
                    climbTowerDb.setTowerClimbingInfo(req.zid, req.zuid, towerClimbingInfo, callback);
                },

                /* 更新任务进度 */
                function (callback) {
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_17, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_17, 0, 0, 1);
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
    return CS_ClimbTowerStart;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 结束爬塔
 */
var CS_ClimbTowerResult = (function() {

    /**
     * 构造函数
     */
    function CS_ClimbTowerResult() {
        this.reqProtocolName = packets.pCSClimbTowerResult;
        this.resProtocolName = packets.pSCClimbTowerResult;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ClimbTowerResult.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClimbTowerResult();
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
                || null == req.isWin
                || null == req.buffEffect) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.isWin = parseInt(req.isWin);

            if(isNaN(req.zid) || isNaN(req.isWin)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var player;
            var nowCrtTierStars;
            var nowNextTier;
            var nowChooseBuff;
            var towerClimbingInfo;
            var arrAdd = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取player对象 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },

                /* 获取爬塔信息 */
                function(p, callback) {
                    player = p;
                    climbTowerDb.getTowerClimbingInfo(req.zid, req.zuid, callback);
                },

                function(towerClimbing, callback) {
                    towerClimbingInfo = towerClimbing;
                    if(!towerClimbingInfo.tierState) {
                        callback(retCode.TOWER_CLIMBING_STATE_ERR);
                        return;
                    }

                    if(towerClimbingInfo.crtTierStars == 0) {
                        callback(retCode.TOWER_CLIMBING_HISTORY_NOT_EXIST);
                        return;
                    }

                    if(req.isWin) {
                        var ctLine = csvManager.ClimbingTower()[towerClimbingInfo.nextTier];
                         var stateIndex = ctLine['STAR_' + towerClimbingInfo.crtTierStars];

                        var scLine = csvManager.StageConfig()[stateIndex];
                        if(!scLine) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        /* 验证战斗力和时间 */
                        if (player.power < scLine.CHECK_BATTLE
                            || parseInt(Date.now() / 1000) - towerClimbingInfo.startClimbTime < scLine.CHECK_TIME) {
                            /* 该玩家正在使用外挂 */
                            callback(retCode.USING_PLUG);
                            return;
                        }

                        /* 抽取奖励 */
                        res.awardIndex = math.rand(1, 3);
                        var prestige = ctLine.BASE_EQUIP_TOKEN.split('|')[res.awardIndex - 1];
                        var gold = ctLine.BASE_MONEY.split('|')[res.awardIndex - 1];
                        prestige = parseInt(prestige);
                        gold = parseInt(gold);
                        if(isNaN(prestige) || isNaN(gold)) {
                            callback(retCode.ERR);
                            return;
                        }
                        prestige *= towerClimbingInfo.crtTierStars;
                        gold *= towerClimbingInfo.crtTierStars;

                        var item = new globalObject.ItemBase();
                        item.tid = itemType.ITEM_TYPE_PRESTIGE;
                        item.itemNum = prestige;
                        arrAdd.push(item);
                        item = new globalObject.ItemBase();
                        item.tid = itemType.ITEM_TYPE_GOLD;
                        item.itemNum = gold;
                        arrAdd.push(item);

                        /* 更新爬塔信息 */
                        var addStars = towerClimbingInfo.crtTierStars;
                        towerClimbingInfo.crtTierStars = 0;
                        towerClimbingInfo.currentStars += addStars;
                        towerClimbingInfo.remainStars += addStars;
                        towerClimbingInfo.starList.push(addStars);

                        /* 达到新的历史记录，更新排行榜 */
                        if(towerClimbingInfo.currentStars > towerClimbingInfo.rankStars) {
                            towerClimbingInfo.rankStars = towerClimbingInfo.currentStars;

                            /* 更新任务进度 */
                            cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_26, 0, towerClimbingInfo.rankStars);
                            cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_26, 0, 0, towerClimbingInfo.rankStars);

                            /* 更新排行榜 */
                            climbTowerDb.updateStarsRanklist(req.zid, req.zuid, towerClimbingInfo.rankStars, function (err) {
                                if(!!err) {
                                    return;
                                }
                                cRevelry.updateRevelryProgress(req.zid, req.zuid, 21, 0);
                            });
                        }

                        /* 开服狂欢 */
                        cRevelry.updateRevelryProgress(req.zid, req.zuid, 9, addStars);
                        /* 通过三关奖励，选buff */
                        if(towerClimbingInfo.nextTier % 3 == 0) {
                            var recentStars = 0;
                            var i = towerClimbingInfo.starList.length;
                            for(var j = 1; j <= 3; ++j) {
                                recentStars += towerClimbingInfo.starList[i - j];
                            }
                            var groupId = 0;
                            if(recentStars == 9) {
                                groupId = ctLine.STAR_REWARD_9;
                            }
                            else if(recentStars >= 6) {
                                groupId = ctLine.STAR_REWARD_6;
                            }
                            else {
                                groupId = ctLine.STAR_REWARD_3;
                            }
                            var records = csvExtendManager.GroupIDConfigRecordsByGroupID(groupId);
                            if(!records) {
                                callback(retCode.TID_NOT_EXIST);
                                return;
                            }
                            for(var i = 0; i < records.length; ++i) {
                                var item = new globalObject.ItemBase();
                                item.tid = records[i].ITEM_ID;
                                item.itemNum = records[i].ITEM_COUNT * records[i].LOOT_TIME;
                                arrAdd.push(item);
                            }
                            towerClimbingInfo.starList = [];

                            /* 随机buff权重 */
                            var randNumList = []; /* 权重列表 */
                            var indexList = []; /* 索引列表 */
                            var randSum = 0; /* 权重和 */
                            var buffEffectInfo = new globalObject.BuffEffectInfo();
                            if(null == req.buffEffect.length || undefined == req.buffEffect.length){
                                callback(retCode.MOCK_DATA);
                                return;
                            }
                            for(var z = 0; z < req.buffEffect.length; z++){ /* 将接收到的buffEffect进行转换 */
                                buffEffectInfo[req.buffEffect[z].buffType] = (req.buffEffect[z].buffValue)*100;
                            }
                            var climbBuffTable = csvManager.ClimbingBuff();
                            for(var i in climbBuffTable){
                                var cbtLine = climbBuffTable[i];
                                var cbtLineType = cbtLine.BUFF_TYPE;
                                if(cbtLine.FLOOR_NUM == (towerClimbingInfo.nextTier/3)){
                                    /* 对其类型value进行判断以及初始化 */
                                    if(buffEffectInfo.cbtLineType == undefined || buffEffectInfo.cbtLineType == null){
                                        buffEffectInfo.cbtLineType = 0;
                                    }
                                    if(cbtLine.BUFF_MIN > buffEffectInfo.cbtLineType){
                                        randNumList.push(cbtLine.MIN_ADD);
                                        indexList.push(cbtLine.INDEX);
                                        randSum += cbtLine.MIN_ADD;
                                        continue;
                                    }else if(cbtLine.BUFF_MAX < buffEffectInfo.cbtLineType){
                                        randNumList.push(cbtLine.MAX_ADD);
                                        indexList.push(cbtLine.INDEX);
                                        randSum += cbtLine.MAX_ADD;
                                        continue;
                                    }
                                    randNumList.push(cbtLine.BUFF_WEIGHT);
                                    indexList.push(cbtLine.INDEX);
                                    randSum += cbtLine.BUFF_WEIGHT;
                                }
                            }

                            /* 用来产生随机buff */
                            var randCut3 = math.rand(0, randSum);
                            for(var star3 = 0;star3 < randNumList.length; star3++) {
                                if (randCut3 > randNumList[star3]) {
                                    randCut3 -= randNumList[star3];
                                    continue;
                                }
                                res.chooseBuff.push(climbBuffTable[indexList[star3]].STAR3_BUFF)
                                break;
                            }
                            var randCut6 =math.rand(0, randSum);
                            for(var star6 = 0;star6 < randNumList.length; star6++){
                                if(randCut6 > randNumList[star6]){
                                    randCut6 -= randNumList[star6];
                                    continue;
                                }
                                res.chooseBuff.push(climbBuffTable[indexList[star6]].STAR6_BUFF)
                                break;
                            }
                            var randCut9 = math.rand(0, randSum);
                            for(var star9 = 0;star9 < randNumList.length; star9++){
                                if(randCut9 > randNumList[star9]){
                                    randCut9 -= randNumList[star9];
                                    continue;
                                }
                                res.chooseBuff.push(climbBuffTable[indexList[star9]].STAR9_BUFF)
                                break;
                            }

                            towerClimbingInfo.chooseBuff = res.chooseBuff;

                            towerClimbingInfo.previousTierStarNum = recentStars;
                        }

                        ++ towerClimbingInfo.nextTier;
                        /* 如果通关*/
                        if(!csvManager.ClimbingTower()[towerClimbingInfo.nextTier]) {
                            towerClimbingInfo.tierState = 0; /* 挑战状态设为输 */
                            towerClimbingInfo.chooseBuff = [];
                        }

                        nowCrtTierStars = addStars;
                        nowNextTier = towerClimbingInfo.nextTier - 1;
                        nowChooseBuff = towerClimbingInfo.chooseBuff;

                        cPackage.updateItemWithLog(req.zid, req.zuid, [], arrAdd, req.channel, req.acc, logsWater.CLIMBTOWERRESULT_LOGS, item.tid, function(err, retSub, retAdd) {
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
                                res.arr = retAdd.concat(arrEx);
                                climbTowerDb.setTowerClimbingInfo(req.zid, req.zuid, towerClimbingInfo, callback);
                            }
                        });
                    }
                    else {
                        var ctLine = csvManager.ClimbingTower()[towerClimbingInfo.nextTier];

                        towerClimbingInfo.tierState = 0; /* 挑战状态设为输 */
                        towerClimbingInfo.saleItemState = 0; /* 重置打折物品购买状态 */
                        towerClimbingInfo.crtTierStars = 0; /* 当前挑战的星数设置为零 */

                        nowCrtTierStars = towerClimbingInfo.crtTierStars;
                        nowNextTier = towerClimbingInfo.nextTier;
                        nowChooseBuff = towerClimbingInfo.chooseBuff;

                        var vipLv = player.vipLevel;
                        if(vipLv < 0 || vipLv > 12) {
                            vipLv = 0;
                        }

                        /* 新增爬塔失败道具改为多个随机 */
                        var lostGroupId  = ctLine['LOST_GROUPID_VIP' + vipLv].split('|');
                        var lostGroupPrice = ctLine['PRICE_VIP' + vipLv].split('|');
                        var lostGropOriginalPrice = ctLine['BASE_PRICE_VIP' + vipLv].split('|');
                        var lostRand = math.rand(1,lostGroupId.length);
                        var groupId = lostGroupId[lostRand-1];
                        var groupPrice = lostGroupPrice[lostRand-1];
                        var originalPrice = lostGropOriginalPrice[lostRand-1];
                        res.saleItemPrice = parseInt(groupPrice);
                        res.originalItemPrice = parseInt(originalPrice);
                        var arr = [res.saleItemPrice, res.originalItemPrice];
                        climbTowerDb.setGroupPrice(req.zid, req.zuid, arr, callback); /* 保存掉落物品价格 */

                        csvExtendManager.GroupIDConfig_DropId(groupId, 1, function(err, arr) {
                            if(err) {
                                callback(err);
                            }
                            else {
                                towerClimbingInfo.itemOnSale = arr[0];
                                res.itemOnSale = arr[0];
                                climbTowerDb.setTowerClimbingInfo(req.zid, req.zuid, towerClimbingInfo, callback);
                            }
                        });
                    }
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /*写BT*/
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_climb_tower, preZid, req.channel, req.zuid, req.zuid, nowCrtTierStars, nowNextTier, req.isWin, JSON.stringify(res.itemOnSale), JSON.stringify(nowChooseBuff), JSON.stringify(arrAdd));
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ClimbTowerResult;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 选buff
 */
var CS_ClimbTowerChooseBuff = (function() {

    /**
     * 构造函数
     */
    function CS_ClimbTowerChooseBuff() {
        this.reqProtocolName = packets.pCSClimbTowerChooseBuff;
        this.resProtocolName = packets.pSCClimbTowerChooseBuff;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ClimbTowerChooseBuff.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClimbTowerChooseBuff();
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
                || null == req.buffIndex) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.buffIndex = parseInt(req.buffIndex);

            if(isNaN(req.zid) || isNaN(req.buffIndex)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(req.buffIndex <= 0 || req.buffIndex >= 4) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var towerTier = 0;  /* 用来接收层数 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取爬塔信息 */
                function(callback) {
                    climbTowerDb.getTowerClimbingInfo(req.zid, req.zuid, callback);
                },

                /* 更新爬塔信息 */
                function(towerClimbingInfo, callback) {
                    if(towerClimbingInfo.chooseBuff.length == 0) {
                        callback(retCode.TOWER_CLIMBING_NOT_WHOLE_THREE);
                        return;
                    }

                    if(towerClimbingInfo.remainStars < req.buffIndex * 3) {
                        callback(retCode.NO_ENOUGH_STAR_FOR_BUFF);
                        return;
                    }

                    towerClimbingInfo.buffList.push(towerClimbingInfo.chooseBuff[req.buffIndex - 1]);
                    towerClimbingInfo.chooseBuff = [];
                    towerClimbingInfo.remainStars -= req.buffIndex * 3;
                    towerTier = towerClimbingInfo.nextTier - 1;

                    climbTowerDb.setTowerClimbingInfo(req.zid, req.zuid, towerClimbingInfo, callback);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_climb_tower_buff, preZid, req.channel, req.zuid, req.zuid, towerTier, req.buffIndex);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ClimbTowerChooseBuff;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 买商品
 */
var CS_ClimbTowerBuyCommodity = (function() {

    /**
     * 构造函数
     */
    function CS_ClimbTowerBuyCommodity() {
        this.reqProtocolName = packets.pCSClimbTowerBuyCommodity;
        this.resProtocolName = packets.pSCClimbTowerBuyCommodity;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ClimbTowerBuyCommodity.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClimbTowerBuyCommodity();
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

            var info = null;
            var groupPrice = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function (callback) { /* 将失败推荐道具钱取出来 */
                    climbTowerDb.getGroupPrice(req.zid, req.zuid, callback);
                },
                /* 获取爬塔信息 */
                function(price, callback) {
                    groupPrice = price[0];
                    climbTowerDb.getTowerClimbingInfo(req.zid, req.zuid, callback);
                },

                /* 更新爬塔信息 */
                function(towerClimbingInfo, callback) {
                    info = towerClimbingInfo;

                    /* 没有输 */
                    if (info.tierState == 1) {
                        callback(retCode.TOWER_CLIMBING_STATE_ERR);
                        return;
                    }

                    /* 商品已经买过 */
                    if(info.saleItemState == 1) {
                        callback(retCode.TOWER_COMMODITY_BOUGHT);
                        return;
                    }

                    info.saleItemState = 1;
                    var arrAdd = [];
                    arrAdd.push(info.itemOnSale);

                    var ctLine = csvManager.ClimbingTower()[info.nextTier];
                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                    item.itemNum = groupPrice; /* 原为ctLine.PRICE */
                    var arrSub = [];
                    arrSub.push(item);

                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, arrAdd, req.channel, req.acc, logsWater.CLIMBTOWERBUYCOMMODITY_LOGS, item.tid, function (err, retSub, retAdd) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            res.arr = retAdd;
                            callback(null);
                        }
                    });
                },

                function(callback) {
                    climbTowerDb.setTowerClimbingInfo(req.zid, req.zuid, info, callback);
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
    return CS_ClimbTowerBuyCommodity;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 重置关卡
 */
var CS_ResetClimbTower = (function() {

    /**
     * 构造函数
     */
    function CS_ResetClimbTower() {
        this.reqProtocolName = packets.pCSResetClimbTower;
        this.resProtocolName = packets.pSCResetClimbTower;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ResetClimbTower.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ResetClimbTower();
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

            var info = null;
            var vipLevel = 0;
            var vipList = csvManager.Viplist();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid,false, function(err,player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        vipLevel = player.vipLevel;
                        callback(null);
                    });
                },
                /* 获取爬塔信息 */
                function(callback) {
                    climbTowerDb.getTowerClimbingInfo(req.zid, req.zuid, callback);
                },

                /* 扣去重置费用 */
                function(towerClimbingInfo, callback) {
                    info = towerClimbingInfo;
                    ++info.resetTimes;
                    info.lastResetDate = (new Date()).toDateString();
                    var ctLine = csvManager.ClimbingConsume()[info.resetTimes];
                    if (info.resetTimes > vipList[vipLevel].CLIMBING_NUM || !ctLine) {
                        callback(retCode.TOWER_CLIMBING_RESET_TIMES_USE_OUT);
                        return;
                    }

                    var item = new globalObject.ItemBase();
                    item.tid = itemType.ITEM_TYPE_DIAMOND;
                    item.itemNum = ctLine.RESET_CONSUME;

                    if (item.itemNum == 0) {
                        callback(null);
                        return;
                    }

                    var arrSub = [];
                    arrSub.push(item);
                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, [], req.channel, req.acc, logsWater.RESETCLIMBTOWER_LOGS, item.tid, function (err) {
                        callback(err);
                    });
                },

                /* 重置爬塔信息 */
                function(callback) {
                    info.currentStars = 0;
                    info.remainStars = 0;
                    info.nextTier = 1;
                    info.tierState = 1;
                    info.buffList = [];
                    info.chooseBuff = [];
                    info.starList = [];
                    info.itemOnSale = null;
                    info.saleItemState = 1;
                    info.crtTierStars = 0;

                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 29, 1);
                    climbTowerDb.setTowerClimbingInfo(req.zid, req.zuid, info, callback);
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
    return CS_ResetClimbTower;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 星数排行榜
 */
var CS_GetClimbTowerStarsRank = (function() {

    /**
     * 构造函数
     */
    function CS_GetClimbTowerStarsRank() {
        this.reqProtocolName = packets.pCSGetClimbTowerStarsRank;
        this.resProtocolName = packets.pSCGetClimbTowerStarsRank;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request : 通讯协议的请求对象
     * @param response : 通讯协议的响应对象
     */
    CS_GetClimbTowerStarsRank.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetClimbTowerStarsRank();
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

                /* 获取自己的名次 */
                function(callback) {
                    climbTowerDb.getStarsRanklistIndex(req.zid, req.zuid, function(err, index) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.myRanking = index;
                        callback(null);
                    });
                },

                /* 获取自己的历史最高星星数量*/
                function(callback) {
                    climbTowerDb.getTowerClimbingInfo(req.zid, req.zuid, function(err, towerClimbingInfo) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.myMaxStarCount = towerClimbingInfo.rankStars;
                        callback(null);
                    });
                },

                /* 获取前n名的信息 */
                function(callback) {
                    climbTowerDb.getStarsRanklist(req.zid, function(err, ranklist) {
                        if(err) {
                            callback(err);
                            return;
                        }

                        var i = 0;
                        var len = ranklist.length;
                        async.whilst(
                            function() {return i < len; },
                            function(cb) {
                                playerDb.getPlayerData(req.zid, ranklist[i], false, function(err, player) {
                                    if(err) {
                                        cb(err);
                                        return;
                                    }
                                    var rankObj = new protocolObject.ClimbTowerStarsRankObject();
                                    rankObj.nickname = player.name; /* 昵称 */
                                    rankObj.power = player.power; /* 战斗力 */
                                    rankObj.headIconId = player.character.tid; /* 头像Id */
                                    rankObj.ranking = i/2+1; /* 排名 */
                                    rankObj.vipLv = player.vipLevel; /* VIP等级 */
                                    rankObj.starCount = ranklist[i+1]*(-1); /* 星星数量 */

                                    i+=2;
                                    res.ranklist.push(rankObj);
                                    cb(null);
                                });
                            },
                            function(err) {
                                callback(err);
                            }
                        );
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
    return CS_GetClimbTowerStarsRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 一键三星
 */
var CS_ClimbTowerSweep = (function() {

    /**
     * 构造函数
     */
    function CS_ClimbTowerSweep() {
        this.reqProtocolName = packets.pCSClimbTowerSweep;
        this.resProtocolName = packets.pSCClimbTowerSweep;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ClimbTowerSweep.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ClimbTowerSweep();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.buffEffect) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(false || isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    var zid = req.zid;
                    var uid = req.zuid;

                    var curStar = 3;
                    var rewards = [];
                    var climbTowerInfo = null;
                    var awardIndexes = [];
                    var chooseBuff = [];
                    var tierPassRewards = [];
                    var climbingTowerConfig = null;
                    var player = null;
                    var sweepNum = 0;
                    async.series({
                        checkLimit: function (cb) {
                            playerDb.getPlayerData(zid, uid, false, function (err, data) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                player = data;

                                if(!clevelCheck(player, 'climbTower')) {
                                    cb(retCode.LACK_OF_LEVEL);
                                    return;
                                }
                                cb(null);
                            });
                        },
                        
                        getClimbTowerInfo: function (cb) {
                            climbTowerDb.getTowerClimbingInfo(req.zid, req.zuid, function (err, data) {
                                if(!!err) {
                                    cb(err);
                                    return;
                                }
                                climbTowerInfo = data;
                                if(0 === climbTowerInfo.tierState) {
                                    cb(retCode.TOWER_CLIMBING_STATE_ERR);
                                    return;
                                }
                                cb(null);
                            });
                        },
                        compute: function (cb) {
                            do{
                                sweepNum ++;
                                climbingTowerConfig = csvManager.ClimbingTower()[climbTowerInfo.nextTier];
                                if(undefined === climbingTowerConfig || null === climbingTowerConfig) {
                                    cb(retCode.TOWER_CLIMBING_HAS_PASS);
                                    return;
                                }
                                if(player.power < climbingTowerConfig.FIGHT_POINT_STAR) {
                                    cb(retCode.TOWER_CLIMBING_SWEEP_POWER_NOT_REACH);
                                    return;
                                }
                                /* get pass reward */
                                var awardIndex = math.rand(1, 3);
                                var item = new globalObject.ItemBase();
                                item.tid = itemType.ITEM_TYPE_PRESTIGE;
                                item.itemNum = parseInt(climbingTowerConfig.BASE_EQUIP_TOKEN.split('|')[awardIndex - 1]) * curStar;
                                rewards.push(item);
                                item = new globalObject.ItemBase();
                                item.tid = itemType.ITEM_TYPE_GOLD;
                                item.itemNum = parseInt(climbingTowerConfig.BASE_MONEY.split('|')[awardIndex - 1]) * curStar;
                                rewards.push(item);
                                /**/
                                climbTowerInfo.currentStars += curStar;
                                climbTowerInfo.nextTier += 1;
                                climbTowerInfo.remainStars += curStar;
                                /**/
                                awardIndexes.push(awardIndex);
                            }while(1 !== climbTowerInfo.nextTier % 3);
                            /* get tierPass reward */
                            var groupId = climbingTowerConfig['STAR_REWARD_' + curStar * 3];
                            var records = csvExtendManager.GroupIDConfigRecordsByGroupID(groupId);
                            if(!records) {
                                cb(retCode.TID_NOT_EXIST);
                                return;
                            }
                            for(var i = 0; i < records.length; ++i) {
                                var item = new globalObject.ItemBase();
                                item.tid = records[i].ITEM_ID;
                                item.itemNum = records[i].ITEM_COUNT * records[i].LOOT_TIME;
                                rewards.push(item);
                                tierPassRewards.push(item);
                            }
                            /* clear star record */
                            climbTowerInfo.starList = [];
                            /* get tierPass Buff */

                            /* 随机buff权重 */
                            var randNumList = []; /* 权重列表 */
                            var indexList = []; /* 索引列表 */
                            var randSum = 0; /* 权重和 */
                            var buffEffectInfo = new globalObject.BuffEffectInfo();
                            if(null == req.buffEffect.length || undefined == req.buffEffect.length){
                               cb(retCode.MOCK_DATA);
                                return;
                            }
                            for(var z = 0; z < req.buffEffect.length; z++){ /* 将接收到的buffEffect进行转换 */
                                buffEffectInfo[req.buffEffect[z].buffType] = (req.buffEffect[z].buffValue)*100;
                            }
                            var climbBuffTable = csvManager.ClimbingBuff();
                            for(var i in climbBuffTable){
                                var cbtLine = climbBuffTable[i];
                                var cbtLineType = cbtLine.BUFF_TYPE;
                                if(cbtLine.FLOOR_NUM == ((climbTowerInfo.nextTier-1)/3)){
                                    /* 对其类型value进行判断以及初始化 */
                                    if(buffEffectInfo.cbtLineType == undefined || buffEffectInfo.cbtLineType == null){
                                        buffEffectInfo.cbtLineType = 0;
                                    }
                                    if(cbtLine.BUFF_MIN > buffEffectInfo.cbtLineType){
                                        randNumList.push(cbtLine.MIN_ADD);
                                        indexList.push(cbtLine.INDEX);
                                        randSum += cbtLine.MIN_ADD;
                                        continue;
                                    }else if(cbtLine.BUFF_MAX < buffEffectInfo.cbtLineType){
                                        randNumList.push(cbtLine.MAX_ADD);
                                        indexList.push(cbtLine.INDEX);
                                        randSum += cbtLine.MAX_ADD;
                                        continue;
                                    }
                                    randNumList.push(cbtLine.BUFF_WEIGHT);
                                    indexList.push(cbtLine.INDEX);
                                    randSum += cbtLine.BUFF_WEIGHT;
                                }
                            }

                            /* 用来产生随机buff */
                            var randCut3 = math.rand(0, randSum);
                            for(var star3 = 0;star3 < randNumList.length; star3++) {
                                if (randCut3 > randNumList[star3]) {
                                    randCut3 -= randNumList[star3];
                                    continue;
                                }
                                chooseBuff.push(climbBuffTable[indexList[star3]].STAR3_BUFF)
                                break;
                            }
                            var randCut6 =math.rand(0, randSum);
                            for(var star6 = 0;star6 < randNumList.length; star6++){
                                if(randCut6 > randNumList[star6]){
                                    randCut6 -= randNumList[star6];
                                    continue;
                                }
                                chooseBuff.push(climbBuffTable[indexList[star6]].STAR6_BUFF)
                                break;
                            }
                            var randCut9 = math.rand(0, randSum);
                            for(var star9 = 0;star9 < randNumList.length; star9++){
                                if(randCut9 > randNumList[star9]){
                                    randCut9 -= randNumList[star9];
                                    continue;
                                }
                                chooseBuff.push(climbBuffTable[indexList[star9]].STAR9_BUFF)
                                break;
                            }
                            
                            climbTowerInfo.chooseBuff = chooseBuff;
                            cb(null);
                        },

                        update: function (cb) {
                            async.parallel({
                                updateTaskRankClimbTowerInfo: function (cb) {
                                    if(climbTowerInfo.currentStars > climbTowerInfo.rankStars) {
                                        climbTowerInfo.rankStars = climbTowerInfo.currentStars;
                                        /* 更新任务进度 */
                                        cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_26, 0, climbTowerInfo.rankStars);
                                        cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_26, 0, 0, climbTowerInfo.rankStars);
                                        /* 更新排行榜 */
                                        climbTowerDb.updateStarsRanklist(req.zid, req.zuid, climbTowerInfo.rankStars, function (err) {
                                            if(!!err) {
                                                return;
                                            }
                                            cRevelry.updateRevelryProgress(req.zid, req.zuid, 21, 0);
                                        });
                                    }
                                    climbTowerDb.setTowerClimbingInfo(zid, uid, climbTowerInfo, cb);
                                },
                                
                                updateItems: function (cb) {
                                    cPackage.updateItemWithLog(req.zid, req.zuid, [], rewards, req.channel, req.acc, logsWater.CLIMB_TOWER_SWEEP_LOGS, climbTowerInfo.nextTier - 1, function(err, retSub, retAdd) {
                                        if(!!err) {
                                            cb(err);
                                            return;
                                        }
                                        for(var i = 0; i < tierPassRewards.length; i++) {
                                            for(var j = 0; j < retAdd.length; j++) {
                                                if(tierPassRewards[i].tid === retAdd[j].tid) {
                                                    tierPassRewards[i].itemId = retAdd[j].itemId;
                                                    tierPassRewards[i].itemNum = retAdd[j].itemNum;
                                                }
                                            }
                                        }
                                        cb(null);
                                    });
                                }
                            }, cb);
                        },

                        revelry: function (cb) {
                            cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_17, 0, sweepNum);
                            cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_17, 0, 0, sweepNum);
                            /* 开服狂欢 */
                            cRevelry.updateRevelryProgress(req.zid, req.zuid, 9, sweepNum * curStar);
                            cb(null);
                        }
                    }, function (err) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        res.chooseBuff = chooseBuff;
                        res.awardIndexes = awardIndexes;
                        res.tierPassRewards = tierPassRewards;
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
    return CS_ClimbTowerSweep;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetTowerClimbingInfo());
    exportProtocol.push(new CS_ClimbTowerStart());
    exportProtocol.push(new CS_ClimbTowerResult());
    exportProtocol.push(new CS_ClimbTowerChooseBuff());
    exportProtocol.push(new CS_ClimbTowerBuyCommodity());
    exportProtocol.push(new CS_ResetClimbTower());
    exportProtocol.push(new CS_GetClimbTowerStarsRank());
    exportProtocol.push(new CS_ClimbTowerSweep());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;

