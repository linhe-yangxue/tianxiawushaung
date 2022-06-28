var async = require('async');
var packets = require('../packets/charge');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var cPackage = require('../common/package');
var md5 = require('MD5');
var accountDb = require('../database/account');
var chargeDb = require('../database/charge');
var monthCardDb = require('../database/activity/month_card');
var playerDb = require('../database/player');
var csvManager = require('../../manager/csv_manager').Instance();
var filter = require('./filter_common');
var logsWater = require('../../common/logs_water');
var sendMail = require('./send_mail');
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');
var type = require('./item_type');
var cRevelry = require('./revelry');
var notifDb = require('../database/notification');
var cNotif = require('./notification');
var cZuid = require('./zuid');
var cMission = require('./mission');
var flashSaleComm = require('./flash_sale');
var globalObject = require('../../common/global_object');
var cfgSdk = require('../../../server_config/sdk.json');

const ORDER_STATE_GENERATED = 0;
const ORDER_STATE_PAYED = 1;
const ORDER_STATE_CANCEL = 2;
const ORDER_STATE_SDK_CHECKED = 3;
const ORDER_STATE_REWARD_SENDED = 4;
const ORDER_STATE_RESEND_ORDER_REWARD = 5;
const ORDER_STATE_CREATE_NEW_ORDER = 6;
const ORDER_STATE_MAKEUP_ORDER = 7;
const SIGN_KEY = cfgSdk.sdkKey;

/**
 * @param cporder [string]
 * @param orderDetail [object]
 * @param callback [func] 返回ret(错误号)和增加的钻石数量,是否是第一次充值标记以及player信息
 */
var chargeHandle = function (cporder, orderDetail, callback) {
    var chargeConfig = csvManager.ChargeConfig();
    var zid = orderDetail.zid;
    var zuid = orderDetail.zuid;
    var shelfId = orderDetail.shelfId;
    var orderPrice = chargeConfig[shelfId].PRICE;
    var isFirst = 0;
    var addDiamond = 0;
    var playerInfo;
    async.waterfall([
        function(callback) {
            playerDb.getPlayerData(zid, zuid, true, callback);
        },
        /* 记录单笔充值记录 */
        function(player, callback) {
            playerInfo = player;
            chargeDb.addSingleCharge(zid, zuid, orderPrice, callback);
        },
        /* 累计充值金额增加 */
        function(flag, callback) {
            if(null == flag) {
                isFirst = 1;
            }
            cRevelry.updateRevelryProgress(zid, zuid, 11, orderPrice);
            chargeDb.addTotalCharge(zid, zuid, orderPrice, callback);
        },
        /* 是否升级vip等级 */
        function(amount, callback) {
            var itemArr =  filter.splitItemStr(chargeConfig[shelfId].REWARD_BUY, '|', '#');
            var vipExp =  playerInfo.vipExp + itemArr[0].itemNum;
            var vipList = csvManager.Viplist();
            var length = Object.keys(vipList).length;
            for(var i = playerInfo.vipLevel + 1; i < length; ++i) {
                if(vipExp >= parseInt(vipList[i].CASHPAID)) {
                    playerInfo.vipLevel = i;
                }
            }
            playerInfo.vipExp = vipExp;
            if(playerInfo.vipLevel >= vipList[length -1].INDEX && vipExp >= vipList[length -1].CASHPAID) {
                playerInfo.vipExp = vipList[length -1].CASHPAID;
            }
            playerInfo.money = amount;
            playerDb.savePlayerData(zid, zuid, playerInfo, true, callback);
        },
        /* 只记录月卡充值的订单号 */
        function(callback) {
            if(chargeConfig[shelfId] && 1 == chargeConfig[shelfId].IS_CARD) {
                notifDb.addNotification(zid, zuid, cNotif.NOTIF_TASK_FINISH);
                notifDb.addNotification(zid, zuid, cNotif.NOTIF_TASK_REFRESH);
                monthCardDb.saveMonthCardDate(zid, zuid, shelfId, callback);
                return;
            }
            callback(null);
        },
        /* 记录每种充值是否第一次 */
        function(callback) {
            chargeDb.addFirstChargeShelfId(zid, zuid, shelfId, callback);
        },
        function(flag, callback) {
            var awardArr = filter.getChargeRewardArr(flag, chargeConfig, shelfId);
            var tmpArr = filter.getItemsInPackageOrNot(awardArr, false);
            var tempArr = filter.getItemsInPackageOrNot(awardArr, true);

            var len = tmpArr.length;
            /* BI获取加的元宝数 */
            if(len > 0){
                for(var j=0; j<len; j++) {
                    if(tmpArr[j].tid == type.ITEM_TYPE_DIAMOND) {
                        addDiamond += tmpArr[j].itemNum;
                    }
                }
            }
            /* 进背包物品发邮件*/
            if(tempArr.length > 0) {
                var mailInfo = new sendMail.MailInfo();
                mailInfo.zid = zid;
                mailInfo.uid = zuid;
                mailInfo.mailTitle = csvManager.MailString()[1].MAIL_TITLE;
                mailInfo.mailContent = csvManager.MailString()[1].MAIL_WORD;
                mailInfo.items = tempArr;
                sendMail.sendMail(mailInfo);
            }
            cPackage.updateItemWithLog(zid, zuid, [], tmpArr,
                '', '', logsWater.CHARGE_LOGS, shelfId, function(err, subArr, addArr) {
                    callback(err);
                });
        },

        /* 渠道服务器订单验证通过并且奖励成功发送给玩家 */
        function(callback) {
            orderDetail.status = ORDER_STATE_REWARD_SENDED;
            chargeDb.saveOrderDetailByOrderNum(cporder, orderDetail, callback);
        },

        /* 更新任务 */
        function(exist, callback) {
            cMission.updateDailyTask(zid, zuid, cMission.TASK_TYPE_13, 0, playerInfo.vipLevel);
            cMission.updateAchieveTask(zid, zuid, cMission.TASK_TYPE_13, 0, 0, playerInfo.vipLevel);
            callback(null);
        },

        /* 更新限时抢购 */
        function (callback) {
            flashSaleComm.updateFlashSale(zid, zuid, 0);
            callback(null, addDiamond, isFirst, playerInfo);
        }
    ], callback)
}

/**
 * @param shelfId
 * @returns [array] 道具信息
 */
var getChargeReward = function (shelfId) {
    var chargeConfig = csvManager.ChargeConfig();
    var object = chargeConfig[shelfId];
    if(null == object) {
        return [];
    }
    return filter.splitItemStr(object.REWARD_BUY, '|', '#');
}

exports.ORDER_STATE_GENERATED = ORDER_STATE_GENERATED;
exports.ORDER_STATE_PAYED = ORDER_STATE_PAYED;
exports.ORDER_STATE_CANCEL = ORDER_STATE_CANCEL;
exports.ORDER_STATE_SDK_CHECKED = ORDER_STATE_SDK_CHECKED;
exports.ORDER_STATE_REWARD_SENDED = ORDER_STATE_REWARD_SENDED;
exports.ORDER_STATE_CREATE_NEW_ORDER = ORDER_STATE_CREATE_NEW_ORDER;
exports.ORDER_STATE_RESEND_ORDER_REWARD = ORDER_STATE_RESEND_ORDER_REWARD;
exports.ORDER_STATE_MAKEUP_ORDER = ORDER_STATE_MAKEUP_ORDER;
exports.SIGN_KEY = SIGN_KEY;

exports.chargeHandle = chargeHandle;
exports.getChargeReward = getChargeReward;