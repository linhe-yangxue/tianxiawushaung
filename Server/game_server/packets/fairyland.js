
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

exports.pCSGetFairylandStates = 'CS_GetFairylandStates';
exports.pSCGetFairylandStates = 'SC_GetFairylandStates';

exports.pCSConquerFairylandStart = 'CS_ConquerFairylandStart';
exports.pSCConquerFairylandStart = 'SC_ConquerFairylandStart';

exports.pCSConquerFairylandWin = 'CS_ConquerFairylandWin';
exports.pSCConquerFairylandWin = 'SC_ConquerFairylandWin';

exports.pCSExploreFairyland = 'CS_ExploreFairyland';
exports.pSCExploreFairyland = 'SC_ExploreFairyland';

exports.pCSGetFairylandEvents = 'CS_GetFairylandEvents';
exports.pSCGetFairylandEvents = 'SC_GetFairylandEvents';

exports.pCSTakeFairylandAwards = 'CS_TakeFairylandAwards';
exports.pSCTakeFairylandAwards = 'SC_TakeFairylandAwards';

exports.pCSRepressRiot = 'CS_RepressRiot';
exports.pSCRepressRiot = 'SC_RepressRiot';

exports.pCSGetFairylandFriendList = 'CS_GetFairylandFriendList';
exports.pSCGetFairylandFriendList = 'SC_GetFairylandFriendList';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取仙境状态列表 [CS]
 */
var CS_GetFairylandStates = (function(parent) {
    inherit(CS_GetFairylandStates, parent);
    function CS_GetFairylandStates() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.ownerId = ''; /* 所有者Id */
    }
    return CS_GetFairylandStates;
})(protocolBase.IPacket);
exports.CS_GetFairylandStates = CS_GetFairylandStates;

/**
 * 获取仙境状态列表 [SC]
 */
var SC_GetFairylandStates = (function (parent) {
    inherit(SC_GetFairylandStates, parent);
    function SC_GetFairylandStates() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.fairylandState = []; /* 仙境状态数组 */
        this.endTime = []; /* 结束时间 */
        this.repressCnt = -1; /* 已镇压次数 */
    }
    return SC_GetFairylandStates;
})(protocolBase.IPacket);
exports.SC_GetFairylandStates = SC_GetFairylandStates;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开始征服仙境 [CS]
 */
var CS_ConquerFairylandStart = (function(parent) {
    inherit(CS_ConquerFairylandStart, parent);
    function CS_ConquerFairylandStart() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.fairylandId = -1; /* 仙境Id */
    }
    return CS_ConquerFairylandStart;
})(protocolBase.IPacket);
exports.CS_ConquerFairylandStart = CS_ConquerFairylandStart;

/**
 * 开始征服仙境 [SC]
 */
var SC_ConquerFairylandStart = (function (parent) {
    inherit(SC_ConquerFairylandStart, parent);
    function SC_ConquerFairylandStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ConquerFairylandStart;
})(protocolBase.IPacket);
exports.SC_ConquerFairylandStart = SC_ConquerFairylandStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 结束征服仙境 [CS]
 */
var CS_ConquerFairylandWin = (function(parent) {
    inherit(CS_ConquerFairylandWin, parent);
    function CS_ConquerFairylandWin() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_ConquerFairylandWin;
})(protocolBase.IPacket);
exports.CS_ConquerFairylandWin = CS_ConquerFairylandWin;

/**
 * 结束征服仙境 [SC]
 */
var SC_ConquerFairylandWin = (function (parent) {
    inherit(SC_ConquerFairylandWin, parent);
    function SC_ConquerFairylandWin() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.awardItems = []; /* 奖励物品数组 */
    }
    return SC_ConquerFairylandWin;
})(protocolBase.IPacket);
exports.SC_ConquerFairylandWin = SC_ConquerFairylandWin;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 探索仙境 [CS]
 */
var CS_ExploreFairyland = (function(parent) {
    inherit(CS_ExploreFairyland, parent);
    function CS_ExploreFairyland() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.fairylandId = -1; /* 仙境Id */
        this.petItemId = -1; /* 寻仙符灵itemId */
        this.exploreType = -1; /* 探索方式 */
    }
    return CS_ExploreFairyland;
})(protocolBase.IPacket);
exports.CS_ExploreFairyland = CS_ExploreFairyland;

/**
 * 探索仙境 [SC]
 */
var SC_ExploreFairyland = (function (parent) {
    inherit(SC_ExploreFairyland, parent);
    function SC_ExploreFairyland() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.endTime = -1; /* 结束时间 */
    }
    return SC_ExploreFairyland;
})(protocolBase.IPacket);
exports.SC_ExploreFairyland = SC_ExploreFairyland;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取仙境信息 [CS]
 */
var CS_GetFairylandEvents = (function(parent) {
    inherit(CS_GetFairylandEvents, parent);
    function CS_GetFairylandEvents() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.targetId = ''; /* 目标用户Id */
        this.fairylandId = -1; /* 仙境Id */
    }
    return CS_GetFairylandEvents;
})(protocolBase.IPacket);
exports.CS_GetFairylandEvents = CS_GetFairylandEvents;

/**
 * 获取仙境信息 [SC]
 */
var SC_GetFairylandEvents = (function (parent) {
    inherit(SC_GetFairylandEvents, parent);
    function SC_GetFairylandEvents() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.events = []; /* 事件列表 */
        this.endTime = -1; /* 结束时间 */
        this.refreshTime = -1; /* 刷新时间 */
        this.petTid = -1; /* 寻仙符灵Id */
    }
    return SC_GetFairylandEvents;
})(protocolBase.IPacket);
exports.SC_GetFairylandEvents = SC_GetFairylandEvents;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取探索奖励 [CS]
 */
var CS_TakeFairylandAwards = (function(parent) {
    inherit(CS_TakeFairylandAwards, parent);
    function CS_TakeFairylandAwards() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.fairylandId = -1; /* 仙境Id */
    }
    return CS_TakeFairylandAwards;
})(protocolBase.IPacket);
exports.CS_TakeFairylandAwards = CS_TakeFairylandAwards;

/**
 * 领取探索奖励 [SC]
 */
var SC_TakeFairylandAwards = (function (parent) {
    inherit(SC_TakeFairylandAwards, parent);
    function SC_TakeFairylandAwards() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.awardItems = []; /* 奖励物品数组 */
    }
    return SC_TakeFairylandAwards;
})(protocolBase.IPacket);
exports.SC_TakeFairylandAwards = SC_TakeFairylandAwards;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 镇压暴乱 [CS]
 */
var CS_RepressRiot = (function(parent) {
    inherit(CS_RepressRiot, parent);
    function CS_RepressRiot() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.friendId = ''; /* 好友Id */
        this.fairylandId = -1; /* 仙境Id */
    }
    return CS_RepressRiot;
})(protocolBase.IPacket);
exports.CS_RepressRiot = CS_RepressRiot;

/**
 * 镇压暴乱 [SC]
 */
var SC_RepressRiot = (function (parent) {
    inherit(SC_RepressRiot, parent);
    function SC_RepressRiot() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_RepressRiot;
})(protocolBase.IPacket);
exports.SC_RepressRiot = SC_RepressRiot;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友仙境信息 [CS]
 */
var CS_GetFairylandFriendList = (function(parent) {
    inherit(CS_GetFairylandFriendList, parent);
    function CS_GetFairylandFriendList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetFairylandFriendList;
})(protocolBase.IPacket);
exports.CS_GetFairylandFriendList = CS_GetFairylandFriendList;

/**
 * 获取好友仙境信息 [SC]
 */
var SC_GetFairylandFriendList = (function (parent) {
    inherit(SC_GetFairylandFriendList, parent);
    function SC_GetFairylandFriendList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.ffList = []; /* 仙境好友对象数组 */
    }
    return SC_GetFairylandFriendList;
})(protocolBase.IPacket);
exports.SC_GetFairylandFriendList = SC_GetFairylandFriendList;
/**-------------------------------------------------------------------------------------------------------------------*/

