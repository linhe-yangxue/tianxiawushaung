/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：获取游戏通知
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/notification');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var globalObject = require('../../common/global_object');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var notificationDb = require('../database/notification');
var mainUiRankDb = require('../database/main_ui_rank');
var cMission = require('../common/mission');
var guildCommon = require('../common/guild_common');
var chatDb = require('../database/chat');
var mailDb = require('../database/mail');
var allMail = require('../common/send_mail');
var logsWater = require('../../common/logs_water');
var revelryDb = require('../database/revelry');
var cRevelry = require('../common/revelry');
var csvManager = require('../../manager/csv_manager').Instance();
var cNotif = require('../common/notification');
var packageDb = require('../database/package.js');
var pointStarDb = require('../database/point_star');
var cPower = require('../common/power');
var signDb = require('../database/activity/daily_sign');
var timeUtil = require('../../tools/system/time_util');
var cardDb = require('../database/activity/free_diamond');
var chargeDb = require('../database/charge');
var costPrizeDb = require('../database/cost_event');
var limitTimeSaleDb = require('../database/limit_time_sale');
var activityTimeDb = require('../database/activity_time');
var sevenActivityDb = require('../database/activity/seven_day_login');
var vipGiftDb = require('../database/vip_gift');
var firstChargeDb = require('../database/activity/first_charge');
var treeDb = require('../database/activity/shake_tree');
var peachDb = require('../database/activity/reward_peach');
var monthCard = require('../common/month_card');
var cZuid = require('../common/zuid');
var halfPriceDb = require('../database/half_price');
var vipShopDb = require('../database/vip');
var atlasDb = require('../database/atlas');
var shopDb = require('../database/shop');
var arenaDb = require('../database/arena');
var friendDb = require('../database/friend');
var fundDb =  require('../database/activity/fund');
var climbTowerDb = require('../database/climb_tower');
var mysteryShopDB = require('../database/mystery_shop');
var cMysteryShop = require('../common/mystery_shop');
var wallPaper = require('../database/wallPaper');
var flashSaleComm = require('../common/flash_sale');
var rankingActivityDb = require('../database/ranking_activity');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家信息变化通知
 */
var CS_GetNotification = (function() {

    /**
     * 构造函数
     */
    function CS_GetNotification() {
        this.reqProtocolName = packets.pCSGetNotification;
        this.resProtocolName = packets.pSCGetNotification;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetNotification.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetNotification();
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

            var player; /* 玩家对象 */
            var starTail; /* 下次点星序号 */
            var date = new Date().toDateString();
            var zeroTime = timeUtil.getDetailTime(date, 0);
            var nowTime = parseInt(Date.now() / 1000);
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /*获取定制邮件*/
                function(callback) {
                    allMail.getSubscriptionMails(req);
                    callback(null);
                },
                /* 从全服邮件那获取邮件 */
                function(callback) {
                    allMail.getAllServerMail(req);
                    callback(null);
                },

                /* 排名活动红点 */
                function (callback) {
                    rankingActivityDb.getRankingActivityRedPointDate(req.zid, req.zuid, function(err, result) {
                        if(result != date) {
                            res.arr.push(cNotif.NOTIF_RANK_ACTIVITY);
                        }
                        callback(err);
                    });
                },

                /* 每日签到红点 */
                function(callback) {
                    signDb.getSign(req.zid, req.zuid, nowTime, function(err, dailySign) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if( parseInt(dailySign.signTime) <= zeroTime || 0 == dailySign.isSign) {
                            res.arr.push(cNotif.NOTIF_DAILY_SIGN);
                        }
                        callback(null);
                    });
                },
                /* 七日登录红点 */
                function(callback) {
                    sevenActivityDb.getLoginDay(req.zid, req.zuid, callback);
                },
                function(loginDay, callback) {
                    sevenActivityDb.getRewardIndexArr(req.zid, req.zuid, function(err, array) {
                        if(array.length < loginDay) {
                            res.arr.push(cNotif.NOTIF_SEVEN_DAY_LOGIN);
                        }
                        callback(null);
                    });
                },
                /* 首冲礼包红点 */
                function(callback) {
                    firstChargeDb.acceptAwardBefore(req.zid, req.zuid, function(err, received) {
                        if(err) {
                            callback(retCode.DB_ERR);
                            return;
                        }
                        if(null == received) {
                            res.arr.push(cNotif.NOTIF_FIRST_CHARGE_AWARD);
                        }
                        callback(null);
                    });
                },
                /* 摇钱树红点 */
                function(callback) {
                    treeDb.getShakeState(req.zid, req.zuid, nowTime, callback);
                },
                function(tree, callback) {
                    if(tree.refreshTime < zeroTime || (tree.shakeTime + 15*60 <= nowTime && tree.dayNum < 3) || tree.allNum >= 6) {
                        res.arr.push(cNotif.NOTIF_SHAKE_TREE);
                    }
                    callback(null);
                },
                /* 领仙桃红点 */
                function(callback) {
                    peachDb.getPeachInfo(req.zid, req.zuid, nowTime, callback);
                },
                function(powerInfo, callback) {
                    var energyData = csvManager.EnergyEvent();
                    var twelveTime = timeUtil.getDetailTime(date, parseInt(energyData[1].START_TIME));
                    var fourteenTime = timeUtil.getDetailTime(date, parseInt(energyData[1].END_TIME));
                    var eighteenTime = timeUtil.getDetailTime(date, parseInt(energyData[2].START_TIME));
                    var twentyTime = timeUtil.getDetailTime(date, parseInt(energyData[2].END_TIME));
                    if((twelveTime <= nowTime && nowTime <= fourteenTime && ( powerInfo.freshTime < zeroTime || 0 == powerInfo.isPower_1)) ||
                        (eighteenTime <= nowTime && nowTime <= twentyTime && (powerInfo.freshTime < zeroTime || 0 == powerInfo.isPower_2))) {
                        res.arr.push(cNotif.NOTIF_REWARD_PEACH);
                    }
                    callback(null);
                },
                /* 月卡红点 */
                function(callback) {
                    monthCard.monthCardCheck(req.zid, req.zuid, callback);
                },
                /* 幸运翻牌红点 */
                function(cheap, expensive, callback) {
                    if(1 == cheap || 1 == expensive) {
                        res.arr.push(cNotif.NOTIF_MONTH_CARD);
                    }
                    cardDb.getCardState(req.zid, req.zuid, nowTime, callback);
                },
                /* 累充送礼红点 */
                function(cardState, callback) {
                    if(cardState.theLastTime < zeroTime || cardState.residueNum > 0) {
                        res.arr.push(cNotif.NOTIF_LUCKY_CARD);
                    }
                    chargeDb.getTotalCharge(req.zid, req.zuid, callback);
                },
                function(money, callback) {
                    var preZid = cZuid.zuidSplit(req.zuid);
                    activityTimeDb.getActivityTime(req.zid, preZid[0], 1, function(err, chargeAwardInfo) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        var chargeAward = [];
                        if(null != chargeAwardInfo) {
                            chargeAward = chargeAwardInfo.chargeAward;
                        }
                        callback(null, money, chargeAward);
                    });
                },
                function(myMoney, chargeArr, callback) {
                    var array = [];
                    var len = chargeArr.length;
                    if(null == myMoney || 0 == len) {
                        callback(null);
                        return;
                    }
                    for(var i = 0; i < len; ++i) {
                        if(myMoney >= chargeArr[i].rmbNum) {
                            array.push(chargeArr[i].rmbNum);
                        }
                    }
                    chargeDb.getPayAwardArr(req.zid, req.zuid, array, function(err, arr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(0 != arr.length && arr.indexOf(null) != -1) {
                            res.arr.push(cNotif.NOTIF_CHARGE_AWARD);
                        }
                        callback(null);
                    });
                },
                /* 累计消费红点 */
                function(callback) {
                    costPrizeDb.getCostNum(req.zid, req.zuid, callback);
                },
                function(consumption, callback) {
                    var preZid = cZuid.zuidSplit(req.zuid);
                    activityTimeDb.getActivityTime(req.zid, preZid[0], 2, function(err, chargeAwardInfo) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(!chargeAwardInfo || 0 == chargeAwardInfo.chargeAward.length) {
                            callback(null, consumption, null);
                            return;
                        }
                        callback(null, consumption, chargeAwardInfo.chargeAward);
                    });
                },
                function(consumption, chargeArr, callback) {
                    if(!consumption || !chargeArr) {
                        callback(null);
                        return;
                    }
                    var flag = false;
                    consumption = parseInt(consumption);
                    costPrizeDb.getPrizeStatus(req.zid, req.zuid, function(err, array) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        var length = chargeArr.length;
                        for(var i= 0; i < length; ++i ) {
                            if(consumption >= chargeArr[i].rmbNum && -1 == array.indexOf(chargeArr[i].rmbNum)) {
                                flag = true;
                                break;
                            }
                        }
                        if(flag) {
                            res.arr.push(cNotif.NOTIF_CONSUME_AWARD);
                        }
                        callback(null);
                    });
                },
                /* 豪华签到红点 */
                function(callback) {
                    signDb.getLuxurySign(req.zid, req.zuid, nowTime, function(err, luxurySign) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(1 != luxurySign.isSign) {
                            res.arr.push(cNotif.NOTIF_LUXURY_SIGN);
                        }
                        callback(null);
                    });
                },

                /* 限时抢购红点 */
                function(callback) {
                    limitTimeSaleDb.getGoodsBuyTime(req.zid, req.zuid, callback);
                },
                function(lastTime, callback) {
                    var limitTimeSaleData = csvManager.LimitTimeSale();
                    if(!lastTime || lastTime < zeroTime) {
                        res.arr.push(cNotif.NOTIF_LIMIT_BUY);
                        callback(null);
                        return;
                    }
                    limitTimeSaleDb.getGoodsBuyNum(req.zid, req.zuid, function(err, array){
                        if(err) {
                            callback(err);
                            return;
                        }
                        var len = array.length;
                        if(0 == len) {
                            res.arr.push(cNotif.NOTIF_LIMIT_BUY);
                            callback(null);
                            return;
                        }
                        for(var i = 0; i < len; ++i) {
                            if(array[i].hadBuyNum < limitTimeSaleData[array[i].goodsIndex].BUY_NUM) {
                                res.arr.push(cNotif.NOTIF_LIMIT_BUY);
                                break;
                            }
                        }
                        callback(null);
                    });
                },
                /* 邮箱紅點 */
                function(callback) {
                    mailDb.getMailNumber(req.zid, req.zuid, function(err, number) {
                        if(number > 0) {
                            res.arr.push(cNotif.NOTIF_MAIL);
                        }
                        callback(null);
                    });
                },

                /* 集市紅點 */
                function(callback) {
                    callback(null);
                },

                function(callback) {
                    atlasDb.getAtlasNotice(req.zid, req.zuid, function(err, result) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(null != result) {
                            res.arr.push(cNotif.NOTIF_ATLAS);
                        }
                        callback(null);
                    });
                },
                /* 获取点星序号 */
                function(callback) {
                    pointStarDb.getPointStarIndex(req.zid, req.zuid, function(err, result) {
                        starTail = result;
                        callback(err);
                    });
                },

                /* 获取玩家对象和背包对象 */
                function(callback) {
                    packageDb.getPlayerAndPackages(req.zid, req.zuid, true, callback);
                },

                /* 更新战斗力数据 */
                function(pap, callback) {
                    player = pap[0];
                    var prePower = player.power;
                    cPower.updatePower(starTail, pap, null);
                    var aftPower = player.power;

                    if (prePower < aftPower) {
                        cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_12, 0, aftPower);
                        cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_12, 0, 0, aftPower);
                        cRevelry.updateRevelryProgress(req.zid, req.zuid, 14, aftPower);
                    }
                    mainUiRankDb.updatePowerRanklist(req.zid, req.zuid, aftPower, parseInt(Date.now() / 1000));
                    res.power = aftPower;
                    packageDb.savePlayerAndPackages(req.zid, req.zuid, pap, true, callback);
                },

                /* 开服狂欢红点 */
                function (callback) {
                    revelryRedPoint(req.zid, req.zuid, res.arr, callback);
                },

                /* vip礼包红点 */
                function (callback) {
                    vipGiftRedPoint(req.zid, req.zuid, player, res.arr, callback);
                },

                /* vip商店红点 */
                function(callback) {
                    vipShopDb.getAllVIPBuyInfo(req.zid, req.zuid, function(err, array) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(array.length < (player.vipLevel +1)) {
                            res.arr.push(cNotif.NOTIF_VIP_GIFT);
                        }
                        callback(null);
                    });
                },
                /* 公会红点 */
                function(callback) {
                    if(0 == player.isWorship && player.guildId.length > 0) {
                        res.arr.push(cNotif.NOTIF_GUILD_WORSHIP);
                    }
                    guildCommon.getGuildNotice(req.zid, req.zuid, player.guildId, function(err, array) {
                        if(!err) {
                            res.arr = res.arr.concat(array);
                        }
                        callback(err);
                    });
                },

                /* 声望商店红点 */
                function(callback) {
                     reputationShopRedPoint(req.zid, req.zuid,  res.arr, callback);
                },

                /* 神装商店红点 */
                function(callback) {
                    clothShopRedPoint(req.zid, req.zuid, res.arr, callback);
                },

                /* 开服基金红点 */
                function (callback) {
                    fundRedPoint(req.zid, req.zuid, player, res.arr, callback);
                } ,

                /* 好友红点 */
                function(callback) {
                    friendRedPoint(req.zid, req.zuid, res.arr, callback);
                },

                /* 符灵商店红点  */
                function (callback) {
                    petShopRedPoint(req.zid, req.zuid, res.arr, callback) ;
                },

                /* 限时抢购红点 */
                function (callback) {
                    flashSaleRedPoint(req.zid, req.zuid, res.arr, callback) ;
                },

                /* 获取红点 */
                function(callback) {
                    notificationDb.getNotification(req.zid, req.zuid, function(err, result) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.arr = res.arr.concat(result);
                        res.arr.sort(function(a, b) { return a - b; });
                        callback(null);
                    });
                },
                /* 设置同步数据，获取聊天纪录尾标 */
                function(callback) {
                    res.gold = player.gold;
                    res.diamond = player.diamond;
                    res.stamina = player.stamina;
                    res.spirit = player.spirit;
                    res.beatDemonCard = player.beatDemonCard;
                    res.staminaStamp = player.staminaStamp;
                    res.spiritStamp = player.spiritStamp;
                    res.beatDemonCardStamp = player.beatDemonCardStamp;
                    res.vipLevel = player.vipLevel;
                    res.vipExp = player.vipExp;
                    res.money = player.money;

                    chatDb.getChatTails(req.zid, req.zuid, player.guildId, callback);
                },

                function(tails, callback) {
                    res.chatNo = tails;
                    /* 更新登录历史信息 */
                    var p = cZuid.zuidSplit(req.zuid);
                    var preZid = p[0];
                    var preUid = p[1];
                    var userLoginInfo = new globalObject.UserLoginInfo();
                    userLoginInfo.zid = preZid;
                    userLoginInfo.name = player.name;
                    userLoginInfo.level = player.character.level;
                    userLoginInfo.lastTime = parseInt(Date.now() / 1000);
                    accountDb.addLoginInfo(preUid, userLoginInfo);
                    callback(null);
                },
                function(callback) {
                    /* 获取玩家走马灯信息 */
                    wallPaper.getRollingWallPaper(req.zid, req.zuid, function(err, data) {
                        res.wallPaper = data;
                        callback(err);
                    });
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
    return CS_GetNotification;
})();

/**
 * 获取好友红点
 * @param zid 区Id
 * @param zuid 角色ID
 * @param redPoints 红点数组
 * @param callback 返回错误码
 */
function friendRedPoint(zid, zuid, redPoints, callback) {
    async.waterfall([
        function(wcb) {
            friendDb.getFriendRequestList(zid, zuid, wcb);
        },

        function(frdReqs, wcb) {
            if (frdReqs.length > 0) {
                redPoints.push(cNotif.NOTIF_FRIEND_REQUEST);
            }

            friendDb.getSpiritRevList(zid, zuid, wcb);
        },

        function(rcvs, wcb) {
            if (rcvs.length > 0) {
                redPoints.push(cNotif.NOTIF_FRIEND_SPIRIT);
            }

            wcb(null);
        }
    ], callback);
}

/**
 * @param zid 获取声望商店红点
 * @param zuid 角色ID
 * @param redPoints 红点数组
 * @param callback 返回错误码
 */
function reputationShopRedPoint(zid, zuid, redPoints, callback) {
    var bestRank = 0; /* 竞技场历史最高排名 */
    var pscTable = csvManager.PrestigeShopConfig();
    var nowTime = parseInt(Date.now() / 1000);

    async.waterfall([
        /* 返回历史最好排名 */
        function (wcb) {
            arenaDb.getArenaWarrior(zid, zuid, false, wcb);
        },

        function(rankInfo, wcb) {
            bestRank = rankInfo.bestRank;
            shopDb.getSetRefreshTime(zid, -1, zuid, nowTime, 'prestige', wcb);
        },

        function( time, wcb) {
            var date = new Date().toDateString();
            var zeroTime = timeUtil.getDetailTime(date, 0);

            /* 同一天不更新 */
            if(time > zeroTime) {
                shopDb.getShopItemsInfo(zid, zuid, 'prestige', wcb);  /* 获取购买数量 */
            } else {
                shopDb.refreshShopItemsInfo(zid, -1, zuid, pscTable, 'prestige', wcb);
            }
        },

        /* 检查是否有可以购买的奖励 */
        function(buyNumArr, wcb) {
            var mp = {};

            for(var i in pscTable) {
                if(pscTable[i].TAB_ID == 2 && pscTable[i].BUY_NUM > 0 && bestRank <= pscTable[i].OPEN_RANK) {
                    mp[i] = pscTable[i].BUY_NUM;
                }
            }

            for(var i = 0; i < buyNumArr.length; ++i) {
                var b = buyNumArr[i];
                if(mp.hasOwnProperty(b.index)) {
                    mp[b.index] -= b.buyNum;
                }
            }

            for(var i in mp) {
                if(mp[i] > 0) {
                    redPoints.push(cNotif.NOTIF_REPUTATION_SHOP);
                    wcb(null);
                    return;
                }
            }

            wcb(null);
        }
    ], callback);
}

/**
 * @param zid 获取神装商店红点
 * @param zuid 角色ID
 * @param redPoints 红点数组
 * @param callback 返回错误码
 */
function clothShopRedPoint(zid, zuid, redPoints, callback) {
    var rankStars = 0; /* 爬塔最高星数 */
    var nowTime = parseInt(Date.now() / 1000);
    var tscTable = csvManager.TowerShopConfig();

    async.waterfall([
        /*获得爬塔的最高星数*/
        function (wcb) {
            climbTowerDb.getTowerClimbingInfo(zid, zuid, wcb);
        },

        function(climbInfo, wcb) {
            rankStars = climbInfo.rankStars;
            shopDb.getSetRefreshTime(zid, -1, zuid, nowTime, 'cloth', wcb);
        },

        function( time, wcb) {
            var date = new Date().toDateString();
            var zeroTime = timeUtil.getDetailTime(date, 0);

            /* 同一天不更新 */
            if(time > zeroTime) {
                shopDb.getShopItemsInfo(zid, zuid, 'cloth', wcb);  /* 获取购买数量 */
            } else {
                shopDb.refreshShopItemsInfo(zid, -1, zuid, tscTable, 'cloth', wcb);
            }
        },

        /* 检查是否有可以购买的奖励 */
        function(buyNumArr, wcb) {
            var mp = {};

            for(var i in tscTable) {
                if(tscTable[i].TAB_ID == 4 && tscTable[i].BUY_NUM > 0 && rankStars >= tscTable[i].OPEN_STAR_NUM) {
                    mp[i] = tscTable[i].BUY_NUM;
                }
            }

            for(var i = 0; i < buyNumArr.length; ++i) {
                var b = buyNumArr[i];
                if(mp.hasOwnProperty(b.index)) {
                    mp[b.index] -= b.buyNum;
                }
            }

            for(var i in mp) {
                if(mp[i] > 0) {
                    redPoints.push(cNotif.NOTIF_CLOTH_SHOP);
                    wcb(null);
                    return;
                }
            }

            wcb(null);
        }
    ], callback);
}


/**
 * 开服基金红点
 * @param zid 获取声望商店红点
 * @param zuid 角色ID
 * @param player 主角对象
 * @param redPoints 红点数组
 * @param callback 返回错误码
 */
function fundRedPoint(zid, zuid, player, redPoints, callback) {
    var isBought = false; /*是否购买过 */
    var boughtCnt = 0; /* 购买人数 */

    async.waterfall([
        /* 判断是否已购买 */
        function (wcb) {
            fundDb.isBought(zid, zuid, wcb);
        },

        /* 获取基金购买人数 */
        function (result, wcb) {
            isBought = result;
            fundDb.getBuyNum(zid, wcb);
        },

        /* 获取奖励领取记录 */
        function (result, wcb) {
            boughtCnt = result;
            fundDb.getAllFundRewardInfo(zid, zuid, wcb);
        },

        /* 检查是否存在可领奖励 */
        function(records, wcb) {
            var feTable = csvManager.FundEvent();

            if(isBought) {
                for(var i in feTable) {
                    if(records.indexOf(i) == -1 && feTable[i].TYPE == 1 && player.character.level >= feTable[i].LEVEL) {
                        redPoints.push(cNotif.NOTIF_FUND_DIAMOND);
                        break;
                    }
                }
            }
            else {
                if(player.vipLevel >= 2 && player.diamond >= 1000) {
                    redPoints.push(cNotif.NOTIF_FUND_DIAMOND);
                }
            }

            for(var i in feTable) {
                if(records.indexOf(i) == -1 && feTable[i].TYPE == 2 && boughtCnt >= feTable[i].COUNT) {
                    redPoints.push(cNotif.NOTIF_FUND_WELFARE);
                    break;
                }
            }
            wcb(null);
        }
    ], callback);
}

/**
 * 符灵商铺红点
 * @param zid 区ID
 * @param zuid 角色ID
 * @param redPoints 红点数组
 * @param callback 返回错误码
 */
function petShopRedPoint(zid, zuid, redPoints, callback) {
    async.waterfall([
        function(wcb) {
            mysteryShopDB.getMysteryShop(zid, zuid, wcb);
        },

        function(result, wcb) {
            var mysteryShop = cMysteryShop.updateMysteryShop(result);
            if(mysteryShop.freeRefreshCnt < cMysteryShop.freeRefreshLimit) {
                redPoints.push(cNotif.NOTIF_PET_SHOP);
            }
            wcb(null);
        }
    ], callback);
}

/**
 * 限时抢购红点
 * @param zid 区ID
 * @param zuid 角色ID
 * @param redPoints 红点数组
 * @param callback 返回错误码
 */
function flashSaleRedPoint(zid, zuid, redPoints, callback) {
    async.waterfall([
        function(wcb) {
            flashSaleComm.updateFlashSale(zid, zuid, 0, wcb);
        },

        function(putawayItemListShow, wcb) {
            var flashSaleEventAll = csvManager.FlashSaleEvent();
            var type1HasPush = 0;
            var type2HasPush = 0;
            for(var i = 0; i < putawayItemListShow.length; i ++) {
                if(type1HasPush === 0 && flashSaleEventAll[putawayItemListShow[i].index].TYPE === 1 && putawayItemListShow[i].state === 0) {
                    type1HasPush = 1;
                    redPoints.push(cNotif.NOTIF_FLASHSALE_TYPE_1);
                }
                if(type2HasPush === 0 && flashSaleEventAll[putawayItemListShow[i].index].TYPE === 2 && putawayItemListShow[i].state === 0) {
                    type2HasPush = 1;
                    redPoints.push(cNotif.NOTIF_FLASHSALE_TYPE_2);
                }
            }
            wcb(null);
        }
    ], callback);
}


/**
 *开服狂欢红点
 * @param zid 区Id
 * @param zuid 角色Id
 * @param redPoints 红点数组
 * @param callback 返回错误值
 */
function revelryRedPoint(zid, zuid, redPoints,callback) {
    var revelryArr; /* 狂欢对象数组 */
    var openTime; /* 开服时间 */
    var isRed = false;

    async.waterfall([
        /* 获取区信息 */
        function(wcb) {
            accountDb.getZoneInfo(zid, wcb);
        },

        /*  10天后清空狂欢 */
        function(zoneInfo, wcb) {
            openTime = timeUtil.getDetailTime(zoneInfo.openDate, 0) * 1000;
            var tenDaysAfter = openTime + 10 * 24 * 3600 * 1000;

            if(Date.now() > tenDaysAfter) {
                isRed = false;
                wcb(retCode.SUCCESS);
                return;
            }

            /* 获取狂欢领取状态 */
            revelryDb.getAllRevelriesObjects(zid, zuid, wcb);
        },

        /* 获取狂欢进度 */
        function(revelries, wcb) {
            revelryArr = revelries;
            revelryDb.getAllRevelriesTypeProgress(zid, zuid, wcb);
        },

        /* 狂欢对象填充进度 */
        function(progs, wcb) {
            for (var i = 0; i < revelryArr.length; ++i) {
                var hrLine = csvManager.HDrevelry()[revelryArr[i].revelryId];
                if (!hrLine) {
                    wcb(retCode.TID_NOT_EXIST);
                    return;
                }

                /* 判断每个狂欢开始日期 */
                if(Date.now() < openTime + (hrLine.DAY - 1) * 24 * 3600 * 1000) {
                    continue;
                }

                /* 进度 */
                var value = parseInt(progs[hrLine.TYPE]);
                if (isNaN(value)) {
                    continue;
                }

                if (revelryArr[i].accepted == 0 && hrLine.PAGE != 4) {
                    if (revelryDb.isRankType(hrLine.TYPE)) {
                        if(value <= hrLine.NUMBER) {
                            isRed = true;
                            wcb(retCode.SUCCESS);
                            return;
                        }
                    }
                    else {
                        if(value >= hrLine.NUMBER) {
                            isRed = true;
                            wcb(retCode.SUCCESS);
                            return;
                        }
                    }
                }
            }
            wcb(null);
        },

        /* 获取半价抢购记录 */
        function(wcb) {
            halfPriceDb.getBuyArrHalfPrice(zid, zuid, wcb);
        },

        /* 获取半价抢购物品出售次数 */
        function(selfBought, wcb) {
            var limits = [];
            var rvrTable = csvManager.HDrevelry();
            for(var index in rvrTable) {
                if(rvrTable[index].PAGE == 4) {
                    limits[rvrTable[index].DAY - 1] = rvrTable[index].SERVER_LIMIT;
                }
            }

            halfPriceDb.getAllHalfPriceNum(zid, function(err, boughtCnt) {
                if(err) {
                    wcb(err);
                    return;
                }

                for(var i = 1; i <= 7; ++i) {
                    if(selfBought.indexOf(i) == -1 && boughtCnt[i-1] < limits[i-1]
                        && Date.now() >= openTime + (i - 1) * 24 * 3600 * 1000) {
                        isRed = true;
                        wcb(retCode.SUCCESS);
                        return;
                    }
                }

                wcb(null);
            });
        }
    ], function(err) {
        if(isRed) {
            redPoints.push(cNotif.NOTIF_REVELRY);
        }
        if(retCode.SUCCESS == err) {
            err = null;
        }
        callback(err);
    });
}

/**
 * vip礼包红点
 * @param zid 区Id
 * @param zuid 角色Id
 * @param player 角色对象
 * @param redPoints 红点数组
 * @param callback 返回错误码
 */
function vipGiftRedPoint(zid, zuid, player, redPoints, callback) {
    async.waterfall([
        function(wcb) {
            vipGiftDb.getVipDailyGiftInfo(zid, zuid, player.vipLevel, wcb);
        },

        /* vip每日礼包 */
        function(vipDailyGift, wcb) {
            for(var i = vipDailyGift.preVipLevel; i <= player.vipLevel; ++i) {
                if(vipDailyGift.array.indexOf(i) == -1) {
                    redPoints.push(cNotif.NOTIF_DAILY_WELFARE);
                    break;
                }
            }

            vipGiftDb.getVipWeeklyGiftTimeStamp(zid, zuid, wcb);
        },

        /* vip每周礼包 */
        function(timeStamp, wcb) {
            var curStamp = timeUtil.getMondayTime();
            if(timeStamp != curStamp) {
                redPoints.push(cNotif.NOTIF_WEEK_WELFARE);
            }
            wcb(null);
        }
    ], callback);
}

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GetNotification());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
