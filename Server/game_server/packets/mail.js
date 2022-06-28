
/**
 * 包含的头文件
 */
var protocolBase = require('../../common/protocol_base');
var basic = require('../../tools/system/basic');
var inherit = basic.inherit;
var retCode = require('../../common/ret_code');

/**
 * 协议名称的定义
 */

exports.pCSReqMails = 'CS_ReqMails';
exports.pSCReqMails = 'SC_ReqMails';

exports.pCSSendMail = 'CS_SendMail';
exports.pSCSendMail = 'SC_SendMail';

exports.pCSGetItem = 'CS_GetItem';
exports.pSCGetItem = 'SC_GetItem';

exports.pCSGetAllItem = 'CS_GetAllItem';
exports.pSCGetAllItem = 'SC_GetAllItem';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 请求邮件  [CS]
 */
var CS_ReqMails = (function(parent) {
    inherit(CS_ReqMails, parent);
    function CS_ReqMails() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_ReqMails;
})(protocolBase.IPacket);
exports.CS_ReqMails = CS_ReqMails;

/**
 * 请求邮件  [SC]
 */
var SC_ReqMails = (function (parent) {
    inherit(SC_ReqMails, parent);
    function SC_ReqMails() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.mails = [];
    }
    return SC_ReqMails;
})(protocolBase.IPacket);
exports.SC_ReqMails = SC_ReqMails;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送邮件  [CS]
 */
var CS_SendMail = (function(parent) {
    inherit(CS_SendMail, parent);
    function CS_SendMail() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.title = ''; /* 标题 */
        this.content = ''; /* 内容 */
        this.items = [];
    }
    return CS_SendMail;
})(protocolBase.IPacket);
exports.CS_SendMail = CS_SendMail;

/**
 * 发送邮件  [SC]
 */
var SC_SendMail = (function (parent) {
    inherit(SC_SendMail, parent);
    function SC_SendMail() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.mail = {};
    }
    return SC_SendMail;
})(protocolBase.IPacket);
exports.SC_SendMail = SC_SendMail;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 邮件领取 [CS]
 */
var CS_GetItem = (function(parent) {
    inherit(CS_GetItem, parent);
    function CS_GetItem() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.mailId = 0;
    }
    return CS_GetItem;
})(protocolBase.IPacket);
exports.CS_GetItem = CS_GetItem;

/**
 * 邮件领取 [SC]
 */
var SC_GetItem = (function (parent) {
    inherit(SC_GetItem, parent);
    function SC_GetItem() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.items = [];
    }
    return SC_GetItem;
})(protocolBase.IPacket);
exports.SC_GetItem = SC_GetItem;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 邮件一键领取 [CS]
 */
var CS_GetAllItem = (function(parent) {
    inherit(CS_GetAllItem, parent);
    function CS_GetAllItem() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_GetAllItem;
})(protocolBase.IPacket);
exports.CS_GetAllItem = CS_GetAllItem;

/**
 * 邮件一键领取 [SC]
 */
var SC_GetAllItem = (function (parent) {
    inherit(SC_GetAllItem, parent);
    function SC_GetAllItem() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.items = [];
    }
    return SC_GetAllItem;
})(protocolBase.IPacket);
exports.SC_GetAllItem = SC_GetAllItem;
/**-------------------------------------------------------------------------------------------------------------------*/

