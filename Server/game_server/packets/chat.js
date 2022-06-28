
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

exports.pCSSendPrivateChat = 'CS_SendPrivateChat';
exports.pSCSendPrivateChat = 'SC_SendPrivateChat';

exports.pCSRcvPrivateChat = 'CS_RcvPrivateChat';
exports.pSCRcvPrivateChat = 'SC_RcvPrivateChat';

exports.pCSSendGuildChat = 'CS_SendGuildChat';
exports.pSCSendGuildChat = 'SC_SendGuildChat';

exports.pCSRcvGuildChat = 'CS_RcvGuildChat';
exports.pSCRcvGuildChat = 'SC_RcvGuildChat';

exports.pCSSendWorldChat = 'CS_SendWorldChat';
exports.pSCSendWorldChat = 'SC_SendWorldChat';

exports.pCSRcvWorldChat = 'CS_RcvWorldChat';
exports.pSCRcvWorldChat = 'SC_RcvWorldChat';

exports.pCSGetWorldChatCnt = 'CS_GetWorldChatCnt';
exports.pSCGetWorldChatCnt = 'SC_GetWorldChatCnt';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送私聊 [CS]
 */
var CS_SendPrivateChat = (function(parent) {
    inherit(CS_SendPrivateChat, parent);
    function CS_SendPrivateChat() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.msg = ''; /* 消息内容 */
        this.targetId = ''; /* 目标Id */
    }
    return CS_SendPrivateChat;
})(protocolBase.IPacket);
exports.CS_SendPrivateChat = CS_SendPrivateChat;

/**
 * 发送私聊 [SC]
 */
var SC_SendPrivateChat = (function (parent) {
    inherit(SC_SendPrivateChat, parent);
    function SC_SendPrivateChat() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_SendPrivateChat;
})(protocolBase.IPacket);
exports.SC_SendPrivateChat = SC_SendPrivateChat;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取私聊 [CS]
 */
var CS_RcvPrivateChat = (function(parent) {
    inherit(CS_RcvPrivateChat, parent);
    function CS_RcvPrivateChat() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.rcdIndex = 0; /* 聊天记录序号 */
    }
    return CS_RcvPrivateChat;
})(protocolBase.IPacket);
exports.CS_RcvPrivateChat = CS_RcvPrivateChat;

/**
 * 获取私聊 [SC]
 */
var SC_RcvPrivateChat = (function (parent) {
    inherit(SC_RcvPrivateChat, parent);
    function SC_RcvPrivateChat() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 聊天记录数组 */
        this.rcdIndex = 0; /* 聊天记录序号 */
    }
    return SC_RcvPrivateChat;
})(protocolBase.IPacket);
exports.SC_RcvPrivateChat = SC_RcvPrivateChat;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送公会聊天 [CS]
 */
var CS_SendGuildChat = (function(parent) {
    inherit(CS_SendGuildChat, parent);
    function CS_SendGuildChat() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.msg = ''; /* 消息内容 */
    }
    return CS_SendGuildChat;
})(protocolBase.IPacket);
exports.CS_SendGuildChat = CS_SendGuildChat;

/**
 * 发送公会聊天 [SC]
 */
var SC_SendGuildChat = (function (parent) {
    inherit(SC_SendGuildChat, parent);
    function SC_SendGuildChat() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.kicked = 0; /* 被踢 */
    }
    return SC_SendGuildChat;
})(protocolBase.IPacket);
exports.SC_SendGuildChat = SC_SendGuildChat;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取公会聊天 [CS]
 */
var CS_RcvGuildChat = (function(parent) {
    inherit(CS_RcvGuildChat, parent);
    function CS_RcvGuildChat() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.rcdIndex = 0; /* 聊天记录序号 */
    }
    return CS_RcvGuildChat;
})(protocolBase.IPacket);
exports.CS_RcvGuildChat = CS_RcvGuildChat;

/**
 * 获取公会聊天 [SC]
 */
var SC_RcvGuildChat = (function (parent) {
    inherit(SC_RcvGuildChat, parent);
    function SC_RcvGuildChat() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 聊天记录数组 */
        this.rcdIndex = 0; /* 聊天记录序号 */
        this.kicked = 0; /* 被踢 */
    }
    return SC_RcvGuildChat;
})(protocolBase.IPacket);
exports.SC_RcvGuildChat = SC_RcvGuildChat;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 发送世界聊天 [CS]
 */
var CS_SendWorldChat = (function(parent) {
    inherit(CS_SendWorldChat, parent);
    function CS_SendWorldChat() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.msg = ''; /* 消息内容 */
    }
    return CS_SendWorldChat;
})(protocolBase.IPacket);
exports.CS_SendWorldChat = CS_SendWorldChat;

/**
 * 发送世界聊天 [SC]
 */
var SC_SendWorldChat = (function (parent) {
    inherit(SC_SendWorldChat, parent);
    function SC_SendWorldChat() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isDontChat = 0; /* 是否禁言 */
    }
    return SC_SendWorldChat;
})(protocolBase.IPacket);
exports.SC_SendWorldChat = SC_SendWorldChat;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取世界聊天 [CS]
 */
var CS_RcvWorldChat = (function(parent) {
    inherit(CS_RcvWorldChat, parent);
    function CS_RcvWorldChat() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.rcdIndex = 0; /* 聊天记录序号 */
    }
    return CS_RcvWorldChat;
})(protocolBase.IPacket);
exports.CS_RcvWorldChat = CS_RcvWorldChat;

/**
 * 获取世界聊天 [SC]
 */
var SC_RcvWorldChat = (function (parent) {
    inherit(SC_RcvWorldChat, parent);
    function SC_RcvWorldChat() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 聊天记录数组 */
        this.rcdIndex = 0; /* 聊天记录序号 */
    }
    return SC_RcvWorldChat;
})(protocolBase.IPacket);
exports.SC_RcvWorldChat = SC_RcvWorldChat;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取世界聊天次数 [CS]
 */
var CS_GetWorldChatCnt = (function(parent) {
    inherit(CS_GetWorldChatCnt, parent);
    function CS_GetWorldChatCnt() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_GetWorldChatCnt;
})(protocolBase.IPacket);
exports.CS_GetWorldChatCnt = CS_GetWorldChatCnt;

/**
 * 获取世界聊天次数 [SC]
 */
var SC_GetWorldChatCnt = (function (parent) {
    inherit(SC_GetWorldChatCnt, parent);
    function SC_GetWorldChatCnt() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.cnt = -1; /* 世界聊天次数 */
    }
    return SC_GetWorldChatCnt;
})(protocolBase.IPacket);
exports.SC_GetWorldChatCnt = SC_GetWorldChatCnt;
/**-------------------------------------------------------------------------------------------------------------------*/

