/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：发邮件接口
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 *包含的头文件
 *
 */
var notice = require('../database/notification');
var async = require('async');
var retCode = require('../../common/ret_code');
var mailDB = require('../database/mail');
var playerDB = require('../database/player');
var guildDB = require('../database/guild');
var globalObject = require('../../common/global_object');
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');
var cZuid = require('../common/zuid');

/**
 *发邮件接口
 * @param mailInfo [MailInfo] 发送邮件需要的信息 MailInfo类对象
 */
var sendMail = function(mailInfo) {
    async.waterfall([
        function(callback) {
            var items = mailInfo.items;
            if(null == mailInfo || null == items) {
                callback(retCode.SUCCESS);
                return;
            }
            var len = items.length;
            var itemArr = [];
            /* 对邮件中的物品是否有非法的进行过滤 */
            for(var i = 0; i < len; ++i) {
                if(items[i].tid == 0 || items[i].itemNum == null || items[i].tid == null) {
                    continue;
                }
                itemArr.push(items[i]);
            }
            if(0 == itemArr.length) {
                callback(retCode.SUCCESS);
                return;
            }
            mailInfo.items = itemArr;
            callback(null);
        },
        /* 邮件ID自增 */
        function(callback) {
            mailDB.incrMailId( mailInfo.zid, mailInfo.uid, 1, callback);
        },
        /* 邮件放入玩家邮箱 */
        function(mid, callback) {
            var mailNew = CreateNewMail(mailInfo, mid);
            mailDB.insertMail( mailInfo.zid, mailInfo.uid, mailNew);
            callback(null);
        }
    ],function(err) {
        if(!err) {
            /*  写BI */
            var preZid = cZuid.zuidSplit(mailInfo.uid)[0];
            logger.logBI(preZid, biCode.logs_mail, preZid, '', mailInfo.uid, mailInfo.uid, mailInfo.mailTitle, mailInfo.mailContent, JSON.stringify(mailInfo.items), 1);
        }
    });
};

/**
*获取全服邮件
* @param req [request]
*/
var getAllServerMail = function(req) {

    var id = 0;
    var lastId = 0;
    var nowTime = parseInt(Date.now() / 1000);
    async.waterfall([
        /* 获取上次读取全服邮件的位置 */
        function(callback) {
            mailDB.getAllMailId(req.zid, req.zuid, function(err, data) {
                if(err) {
                    callback(err);
                    return;
                }
                id = data;
                callback(null);
            });
        },
        function (callback) {
            /* 領取相應的全服郵件 */
            var newMails = [];
            mailDB.getRewardMail(req.zid, function(err, mails) {
                if(err) {
                    callback(err);
                    return;
                }
                var len = mails.length;
                for(var i = 0; i < len; ++i) {
                    if(id <= mails[i].mailId && (nowTime -  mails[i].mailTime) <= 172800) {
                        newMails.push(mails[i]);
                        lastId = mails[i].mailId >= lastId ? mails[i].mailId +1:lastId;
                    }
                }
                callback(null, newMails);
            });
        },

        function(mailArr, callback) {
            /* 邮箱邮件上限限制 */
            var mails = mailArr;
            mailDB.getMailNumber(req.zid, req.zuid,function(err, mailNum) {
                if((mails.length + mailNum) < 1000) { /* 玩家邮件上限 */
                    if(mails.length > 0) {
                        mailDB.insertMails(req.zid, req.zuid, mails);
                        mailDB.saveAllMailId(req.zid, req.zuid, lastId);
                    }
                }
                callback(null);
            });
        }
    ],function(err) {
    });
};
/**
 * 获取定制邮件
 * @param req
 */
var getSubscriptionMails = function(req) {
    var mailArr = [];
    var mails = [];
    var player = null;
    var guild = null;
    async.waterfall([
        /* 获取玩家数据 */
        function (callback) {
            playerDB.getPlayerData(req.zid, req.zuid, false, callback);
        },
        /* 获取公会信息 如果有 */
        function (p, callback) {
            player = p;
            if (!player) {
                callback(retCode.SUCCESS);
                return;
            }
            if (player.guildId.length > 0 && parseInt(cZuid.zuidSplit(player.guildId)[1]) > 0) {
                guildDB.getGuildInfoByGid(req.zid, player.guildId, false, callback);
                return;
            }
            callback(null, null);
        },
        /* 获取邮件数量 不可邮件上限 */
        function (guildInfo, callback) {
            if (null != guildInfo) {
                guild = guildInfo;
            }
            mailDB.getMailNumber(req.zid, req.zuid, callback);
        },
        function (number, callback) {
            if (number >= 999) {
                callback(retCode.SUCCESS);
                return;
            }
            mailDB.getLastMailBeginTime(req.zid, req.zuid, callback); /* 获取上次邮件的开始时间 */
        },
        /* 获取定制邮件 */
        function (lastBeginTime, callback) {
            mailDB.getRelevantMails(req.zid, lastBeginTime, callback);
        },
        /* 判断领取条件 */
        function (cMails, callback) {
            mails = cMails;
            var nowTime = parseInt(Date.now() / 1000);
            var len = mails.length;
            if (0 == len) {
                callback(retCode.SUCCESS);
                return;
            }
            for (var i = 0; i < len; ++i) {
                /*已结束 */
                if (nowTime > mails[i].endTime) {
                    continue;
                }
                /* 不在玩家等级范围类 */
                if (0 != mails[i].maxUserLev && (player.character.level > mails[i].maxUserLev || player.character.level < mails[i].minUserLev)) {
                    continue;
                }
                /* 不在玩家vip等级范围类 */
                if (0 != mails[i].maxVipLev && (player.vipLevel > mails[i].maxVipLev || player.vipLevel < mails[i].minVipLev)) {
                    continue;
                }
                /* 不是对应公会 */
                if (0 != mails[i].gid.length && mails[i].gid !== player.guildId) {
                    continue;
                }
                /* 不是对应公会 */
                if (0 != mails[i].gid.length && 0 != mails[i].maxGuildLev && (guild.guildLv > mails[i].maxGuildLev || guild.guildLv < mails[i].minGuildLev)) {
                    continue;
                }
                /* 不在对应公会等级范围内 */
                if(0 == mails[i].gid.length && 0 != mails[i].maxGuildLev && (!guild || guild.guildLv > mails[i].maxGuildLev || guild.guildLv < mails[i].minGuildLev)) {
                    continue;
                }
                mailArr.push(mails[i]);
            }
            callback(null, mailArr);
        },
        /* 增加邮件ID */
        function (cMailArr, callback) {
            if (0 == cMailArr.length) {
                callback(retCode.SUCCESS);
                return;
            }
            mailDB.incrMailId(req.zid, req.zuid, cMailArr.length, callback);
        },
        /* 生成邮件 */
        function (mid, callback) {
            var mailArray = [];
            var len = mailArr.length;
            for (var i = mid - len + 1, j = 0; i <= mid; ++i, ++j) {
                var mail = new globalObject.Mail();
                mail.mailId = i;
                mail.mailContent = mailArr[j].content;
                mail.mailTitle = mailArr[j].title;
                mail.items = mailArr[j].items;
                mail.mailTime = parseInt(Date.now() / 1000);
                mailArray.push(mail);
            }
            mailDB.insertMails(req.zid, req.zuid, mailArray);
            mailDB.saveMailBeginTime(req.zid, req.zuid, mails[mails.length - 1].beginTime);  /* 保存所领取邮件最后一封的开始时间 */
            callback(null);
        }
    ], function(err) {

    });
};
/**
 *创建新邮件
 * @param mail [request]  GM工具发来的包含的邮件信息
 * @param index [int] 邮件ID
 * @returns {exports.Mail}
 */
var CreateNewMail = function(mail, index) {
    var nowTime = parseInt(new Date().getTime() / 1000);
    var mailInfo = new globalObject.Mail();
    mailInfo.mailId = index;
    mailInfo.mailTitle = mail.mailTitle;
    mailInfo.mailContent = mail.mailContent;
    mailInfo.mailTime = nowTime;
    mailInfo.items = mail.items;
    return mailInfo;
};

/**
 *非法邮件拦截
 * @param items [array] 邮件物品数组
 * @returns {boolean}
 */
var stopIllegalMail = function(items) {
    var arr = [14,15,16,17,30,40];
    for(var i= 1000001; i<= 1000011; ++i) {
        arr.push(i);
    }
     for(var j= 2000001; j<= 2000022; ++j) {
         arr.push(j);
     }
    for(var index = 0; index < items.length; ++index) {
        var tid = items[index].tid;
        var mTid = parseInt(tid / 1000);
        if( -1 != arr.indexOf(tid) || -1 != arr.indexOf(mTid)) {
            return false;
        }
    }
    return true;
};



/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 *发邮件接口
 * @param mailInfo [MailInfo] 发送邮件需要的信息 MailInfo类对象
 * @param cb [func] 返回邮件信息
 */
exports.sendMail = sendMail;
/**
 *发邮件接口 全服
 * @param req [request]
 * @param cb [func] 返回邮件信息
 */
exports.getAllServerMail = getAllServerMail;
/**
 *非法邮件拦截
 * @param items [array] 邮件物品数组
 * @returns {boolean}
 */
exports.stopIllegalMail = stopIllegalMail;
/**
 * 获取定制邮件
 * @param req
 */
exports.getSubscriptionMails = getSubscriptionMails;



/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *  GM工具发送的邮件信息类
 */
var MailInfo = (function() {
    function MailInfo() {
        this.zid = -1; /* 区ID */
        this.uid = ''; /* 角色ID */
        this.mailTitle = "";  /*邮件标题*/
        this.mailContent = "";  /*邮件内容*/
        this.items = []; /*附件物品，ItemObject对象数组*/
    }

    return  MailInfo;
})();
exports.MailInfo = MailInfo;
