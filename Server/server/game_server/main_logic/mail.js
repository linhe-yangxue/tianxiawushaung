/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：邮件请求 发送邮件 邮件领取 邮件一键领取
 * 开发者：许林
 * 开发者备注：
 * 审阅者：floven [审阅完成]
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var packets = require('../packets/mail');
var playerOp = require("../common/package");
var logger = require('../../manager/log4_manager');
var mailDB = require("../database/mail");
var object = require("../../common/global_object");
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cfgControl = require('../../../server_config/control.json');
var filter = require('../common/filter_common');
var cZuid = require('../common/zuid');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/


/**
 * 请求邮件
 */
var CS_ReqMails = (function() {

    /**
     * 构造函数
     */
    function CS_ReqMails() {

        this.reqProtocolName = packets.pCSReqMails;
        this.resProtocolName = packets.pSCReqMails;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ReqMails.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ReqMails();
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
                /* 获取前200条邮件 */
                function(callback) {
                    mailDB.getMails(req.zid, req.zuid, callback);
                },
                /* 临时增加邮件物品itemNum和tid判断 */
                function(mails, callback) {
                    var len = mails.length;
                    if(0 == len) {
                        callback(null);
                        return;
                    }
                    /* 临时增加邮件物品itemNum和tid判断 BEGIN*/
                    var mailArr = [];
                    var length = 0;
                    var flag = false;
                    for(var i = 0; i < len; ++i) {
                        var items = mails[i].items;
                        flag = false;
                        if(null == items) {
                            continue;
                        }
                        length = items.length;
                        for(var j = 0; j < length; ++j) {
                            if(items[j].tid == 0 || items[j].itemNum == null || items[j].tid == null) {
                                flag  = true;
                                break;
                            }
                        }
                        if(!flag && length > 0) {
                            mailArr.push(mails[i]);
                        }
                    }
                    /* 临时增加邮件物品itemNum和tid判断 END*/

                    /* 判断邮件是否过期 */
                    isOverDue(req.zid, req.zuid, req.channel, req.acc, mailArr, function(err, data) {
                        res.mails = data;
                        callback(null);
                    });
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response,res,retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ReqMails;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送邮件
 */
var CS_SendMail = (function() {

    /**
     * 构造函数
     */
    function CS_SendMail() {
        this.reqProtocolName = packets.pCSSendMail;
        this.resProtocolName = packets.pSCSendMail;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_SendMail.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_SendMail();
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
                || null == req.title
                || null == req.content
                || null == req.items) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            for(var i = 0; i < req.items.length; ++i) {
                if(null == req.items[i]
                    || null == req.items[i].itemId
                    || null == req.items[i].tid
                    || null == req.items[i].itemNum) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }

                req.items[i].itemId = parseInt(req.items[i].itemId);
                req.items[i].tid = parseInt(req.items[i].tid);
                req.items[i].itemNum = parseInt(req.items[i].itemNum);

                if(isNaN(req.items[i].itemId) || isNaN(req.items[i].tid) || isNaN(req.items[i].itemNum)) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }
            }
            
            var mailData = req;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 邮件ID自增 */
                function(callback) {
                    mailDB.incrMailId(req.zid, req.zuid, 1, function (err, mid) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        var mailNew = CS_SendMail.prototype.CreateNewMail(mailData, mid);
                        mailDB.insertMail(req.zid, req.zuid, mailNew);
                        res.mail = mailNew;
                        callback(null);
                    });
                }

            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_mail, preZid,
                        req.channel, req.zuid, req.zuid, req.title, req.content, JSON.stringify(req.items), 1);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };

    CS_SendMail.prototype.CreateNewMail = function(data,id)
    {
        var mail = data;
        var index = id;
        var nowTime = parseInt( Date.now() / 1000);
        var mailInfo = new object.Mail();
        mailInfo.mailId = index;
        mailInfo.mailTitle = mail.title;
        mailInfo.mailContent = mail.content;
        mailInfo.mailTime = nowTime;
        mailInfo.items = mail.items;
        return mailInfo;
    };
    return CS_SendMail;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 邮件领取
 */
var CS_GetItem = (function() {

    /**
     * 构造函数
     */
    function CS_GetItem() {
        this.reqProtocolName = packets.pCSGetItem;
        this.resProtocolName = packets.pSCGetItem;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetItem.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetItem();
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
                || null == req.mailId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.mailId = parseInt(req.mailId);

            if(isNaN(req.zid) || isNaN(req.mailId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var mail = new object.Mail();
            var mItems = [];
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取领取的那封邮件 */
                function(callback) {
                    mailDB.getMail( req.zid, req.zuid,  req.mailId, callback);
                },
                /* 邮件领取物品进背包 */
                function(data, callback) { /* Mail类对象 */
                    mail = data;
                    if(null == mail) {
                        callback(retCode.MAIL_ID_ILLEGAL);
                        return;
                    }
                    mItems = mail.items;
                    var tmpArr = filter.getItemsInPackageOrNot(mItems, false);
                    playerOp.updateItemWithLog(req.zid, req.zuid, [], mItems, req.channel,
                        req.acc, logsWater.GETITEM_LOGS, req.mailId, function (err, subData, addData) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        res.items = addData.concat(tmpArr);
                        callback(null);
                    });
                },
                /* 背包未满，物品进背包，删除该邮件 */
                function(callback) {
                    mailDB.delMail(req.zid, req.zuid, mail.mailId);
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    if(retCode.MAIL_ID_ILLEGAL != err) {
                        mailDB.delMail(req.zid, req.zuid, mail.mailId);
                    }
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_mail, preZid, req.channel,
                        req.zuid, req.zuid, mail.mailTitle, mail.mailContent, JSON.stringify(mail.items), 2);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetItem;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 邮件一键领取
 */
var CS_GetAllItem = (function() {

    /**
     * 构造函数
     */
    function CS_GetAllItem() {
        this.reqProtocolName = packets.pCSGetAllItem;
        this.resProtocolName = packets.pSCGetAllItem;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GetAllItem.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GetAllItem();
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
            var  arrItems = []; /* 存储邮件中的物品 */
            var mails = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取前200封邮件 */
                function(callback) {
                    mailDB.getMails(req.zid, req.zuid, callback);
                        //isOverDue(req.zid,req.zuid,req.channel,req.acc,allMail,callback););
                },
                /* 获取前200封邮件所包含的物品 */
                function(data, callback) {
                    mails = data;
                    var len = mails.length;
                    for(var j = 0; j < len; ++j) {
                        arrItems = arrItems.concat(mails[j].items);
                        /* 写BI */
                        var preZid = cZuid.zuidSplit(req.zuid)[0];
                        logger.logBI(preZid, biCode.logs_mail, preZid, req.channel, req.zuid,
                            req.zuid, mails[j].mailTitle, mails[j].mailContent, JSON.stringify(mails[j].items), 2);
                    }
                    callback(null);
                },
                /* 邮件中的物品加入背包 */
                function(callback) {
                    var tmpArr = filter.getItemsInPackageOrNot(arrItems, false);
                    playerOp.updateItemWithLog(req.zid, req.zuid, [], arrItems,
                        req.channel, req.acc, logsWater.GETALLITEM_LOGS, '', function(err, subData, addData) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.items = addData.concat(tmpArr);
                        callback(null);
                    });
                },
                /* 一键领取成功 删除邮件 */
                function(callback) {
                    mailDB.delAllMail(req.zid, req.zuid);
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    mailDB.delAllMail(req.zid, req.zuid);
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GetAllItem;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];

    if(cfgControl.cheatProtocal) {
        exportProtocol.push(new CS_SendMail());
    }

    exportProtocol.push(new CS_ReqMails());
    exportProtocol.push(new CS_GetItem());
    exportProtocol.push(new CS_GetAllItem());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 函数区
 */

/**
 * 判断邮件是否过期
 * zid [int] : 区ID
 * zuid [int] : 角色ID
 * data [Array] : 所有邮件
 * cb [Func] : 回调函数 回调出不包含过期的邮件
 */
var isOverDue = function(zid, zuid, channel, acc, mails, cb) {
    var overDueArr = [];
    var useArr = [];
    var nowTime = Date.now() / 1000;
    var mailSaveTime = 2*24*3600;
    var len = mails.length;
    for(var i= 0; i < len; ++i) {
        if((mails[i].mailTime + mailSaveTime ) >= nowTime) {
            useArr.push(mails[i]);
        }
        else {
            overDueArr.push(mails[i]);
        }
    }
    mailDB.delOverDueMail(zid, zuid, overDueArr);
    var preZid = cZuid.zuidSplit(zuid)[0];
    len = overDueArr.length;
    for(var j = 0; j < len; ++j) {
        /* 写BI */
        logger.logBI(preZid, biCode.logs_mail, preZid, channel, zuid, zuid, overDueArr[j].title, overDueArr[j].content, JSON.stringify(overDueArr[j].items), 3);
    }
    cb(null, useArr);
};

