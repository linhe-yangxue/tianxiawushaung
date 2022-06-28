/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：公测返还
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 *包含的模块
 */
var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var dbManager = require("../../manager/redis_manager").Instance();
var cZuid = require('../common/zuid');
var sendMail = require('../common/send_mail');
var filter = require('../common/filter_common');
var sdkAccountDb = require('./sdk_account');
var csvManager = require('../../manager/csv_manager').Instance();
var itemType = require('../common/item_type');

/**
 * 公测返还奖励
 * @param zid {int} 区id
 * @param zuid {string} 角色id
 */
var awardOBT = function(zid, zuid) {
    var redisDB = dbManager.getGlobalRedisClient().getDB(0);
    var key1 = redisKey.keyHashPowerRank; /* 战力排行 */
    var key2 = redisKey.keyHashPvpRank; /* 竞技场排行 */
    var key3 = redisKey.keyHashRechargeAmount; /* 充值金额 */
    if(1 != cZuid.zuidSplit(zuid)[0]) { /*不在一区登录 */
        return;
    }
    async.waterfall([
        function(callback) {
            sdkAccountDb.getChannelInfoByUid(zuid,callback); /* 获取渠道用户信息 */
        },
        function(channelInfo, callback) {
            if(-1 == channelInfo.channel || 0 == channelInfo.id) {
                callback(-1);
                return;
            }
            var field =redisClient.joinKey(channelInfo.channel, channelInfo.id);
            var client = redisDB.MULTI();
            client.HGET(key1, field);
            client.HGET(key2, field);
            client.HGET(key3, field);
            client.HDEL(key1, field);
            client.HDEL(key2, field);
            client.HDEL(key3, field);
            client.EXEC(callback);
        },
        function(array,  callback) { /* 公测返还奖励发邮件 */
            for(var i = 0, len = array.length; i < len; ++i) {
                array[i] = JSON.parse(array[i]);
            }

            if(null != array[0] && null != array[0].rank) {
                var xMailInfo = {};
                xMailInfo.zid = zid;
                xMailInfo.uid = zuid;
                xMailInfo.mailTitle = csvManager.MailString()[8].MAIL_TITLE;
                xMailInfo.mailContent = csvManager.MailString()[8].MAIL_WORD;
                xMailInfo.items = getRankAward(2, array[0].rank);
                sendMail.sendMail(xMailInfo);
            }
            if(null != array[1] && null != array[1].rank) {
                var yMailInfo = {};
                yMailInfo.zid = zid;
                yMailInfo.uid = zuid;
                yMailInfo.mailTitle = csvManager.MailString()[9].MAIL_TITLE;
                yMailInfo.mailContent = csvManager.MailString()[9].MAIL_WORD;
                yMailInfo.items = getRankAward(1, array[1].rank);
                sendMail.sendMail(yMailInfo);
            }
            if(null != array[2] && null != array[2].amount) {
                var zMailInfo = {};
                var item = {};
                zMailInfo.zid = zid;
                zMailInfo.uid = zuid;
                zMailInfo.mailTitle = csvManager.MailString()[10].MAIL_TITLE;
                zMailInfo.mailContent = csvManager.MailString()[10].MAIL_WORD;
                zMailInfo.items = [];
                item.itemId = -1;
                item.tid = itemType.ITEM_TYPE_DIAMOND;
                item.itemNum = (array[2].amount / 10 * 2);
                zMailInfo.items.push(item);
                sendMail.sendMail(zMailInfo);
            }
            callback(null);
        }
    ],function(err) {});
};

/**
 *
 * @param type {int} 排名类型 1:巅峰挑战排名 2:战力排名
 * @param myRank {int} 我的排名
 * @returns {Array} 奖励数组
 */
function getRankAward(type, myRank) {
    if(0 == type || 0 == myRank) {
        return [];
    }
    var rankActivity = csvManager.RankActivity();
    for(var i in rankActivity) {
        if(rankActivity[i].TYPE == type && myRank >= rankActivity[i].RANK_MIN && myRank <= rankActivity[i].RANK_MAX) {
            return filter.splitItemStr(rankActivity[i].AWARD_GROUPID, '|', '#');
        }
    }
}

module.exports = {
    awardOBT:awardOBT
};