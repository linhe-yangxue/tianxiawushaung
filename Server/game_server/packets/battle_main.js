
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

exports.pCSBattleMainMap = 'CS_BattleMainMap';
exports.pSCBattleMainMap = 'SC_BattleMainMap';

exports.pCSBattleMainStart = 'CS_BattleMainStart';
exports.pSCBattleMainStart = 'SC_BattleMainStart';

exports.pCSBattleMainResult = 'CS_BattleMainResult';
exports.pSCBattleMainResult = 'SC_BattleMainResult';

exports.pCSBattleMainSweep = 'CS_BattleMainSweep';
exports.pSCBattleMainSweep = 'SC_BattleMainSweep';

exports.pCSExitBattleMain = 'CS_ExitBattleMain';
exports.pSCExitBattleMain = 'SC_ExitBattleMain';

exports.pCSGetBattleBoxList = 'CS_GetBattleBoxList';
exports.pSCGetBattleBoxList = 'SC_GetBattleBoxList';

exports.pCSRcvBattleBoxAward = 'CS_RcvBattleBoxAward';
exports.pSCRcvBattleBoxAward = 'SC_RcvBattleBoxAward';

exports.pCSResetBattleMain = 'CS_ResetBattleMain';
exports.pSCResetBattleMain = 'SC_ResetBattleMain';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取主线副本的功能 [CS]
 */
var CS_BattleMainMap = (function(parent) {
    inherit(CS_BattleMainMap, parent);
    function CS_BattleMainMap() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_BattleMainMap;
})(protocolBase.IPacket);
exports.CS_BattleMainMap = CS_BattleMainMap;

/**
 * 获取主线副本的功能 [SC]
 */
var SC_BattleMainMap = (function (parent) {
    inherit(SC_BattleMainMap, parent);
    function SC_BattleMainMap() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 主线副本地图列表 */
    }
    return SC_BattleMainMap;
})(protocolBase.IPacket);
exports.SC_BattleMainMap = SC_BattleMainMap;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 进入主线副本 [CS]
 */
var CS_BattleMainStart = (function(parent) {
    inherit(CS_BattleMainStart, parent);
    function CS_BattleMainStart() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.battleId = -1; /* 关卡ID */
    }
    return CS_BattleMainStart;
})(protocolBase.IPacket);
exports.CS_BattleMainStart = CS_BattleMainStart;

/**
 * 进入主线副本 [SC]
 */
var SC_BattleMainStart = (function (parent) {
    inherit(SC_BattleMainStart, parent);
    function SC_BattleMainStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_BattleMainStart;
})(protocolBase.IPacket);
exports.SC_BattleMainStart = SC_BattleMainStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 退出主线副本 [CS]
 */
var CS_BattleMainResult = (function(parent) {
    inherit(CS_BattleMainResult, parent);
    function CS_BattleMainResult() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.battleId = -1; /* 关卡ID */
        this.isWin = 0; /* int 类型，0代表失败，1代表成功 */
        this.starRate = -1; /* 评级 */
        this.isAuto = 0; /* 是否自动操作0否/1是 */
    }
    return CS_BattleMainResult;
})(protocolBase.IPacket);
exports.CS_BattleMainResult = CS_BattleMainResult;

/**
 * 退出主线副本 [SC]
 */
var SC_BattleMainResult = (function (parent) {
    inherit(SC_BattleMainResult, parent);
    function SC_BattleMainResult() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 掉落队列 ItemObject */
        this.demonBoss = {}; /* 天魔BOSS信息 */
    }
    return SC_BattleMainResult;
})(protocolBase.IPacket);
exports.SC_BattleMainResult = SC_BattleMainResult;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 扫荡主线副本 [CS]
 */
var CS_BattleMainSweep = (function(parent) {
    inherit(CS_BattleMainSweep, parent);
    function CS_BattleMainSweep() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.battleId = -1; /* 关卡ID */
        this.sweepObj = {}; /* 扫荡信息对象 */
    }
    return CS_BattleMainSweep;
})(protocolBase.IPacket);
exports.CS_BattleMainSweep = CS_BattleMainSweep;

/**
 * 扫荡主线副本 [SC]
 */
var SC_BattleMainSweep = (function (parent) {
    inherit(SC_BattleMainSweep, parent);
    function SC_BattleMainSweep() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 掉落队列 ItemObject */
        this.demonBoss = {}; /* 天魔BOSS信息 */
    }
    return SC_BattleMainSweep;
})(protocolBase.IPacket);
exports.SC_BattleMainSweep = SC_BattleMainSweep;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 点击退出按钮退出主线副本 [CS]
 */
var CS_ExitBattleMain = (function(parent) {
    inherit(CS_ExitBattleMain, parent);
    function CS_ExitBattleMain() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.battleId = -1; /* 关卡ID */
        this.isAuto = 0; /* 是否自动操作0否/1是 */
    }
    return CS_ExitBattleMain;
})(protocolBase.IPacket);
exports.CS_ExitBattleMain = CS_ExitBattleMain;

/**
 * 点击退出按钮退出主线副本 [SC]
 */
var SC_ExitBattleMain = (function (parent) {
    inherit(SC_ExitBattleMain, parent);
    function SC_ExitBattleMain() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ExitBattleMain;
})(protocolBase.IPacket);
exports.SC_ExitBattleMain = SC_ExitBattleMain;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取关卡宝箱列表 [CS]
 */
var CS_GetBattleBoxList = (function(parent) {
    inherit(CS_GetBattleBoxList, parent);
    function CS_GetBattleBoxList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetBattleBoxList;
})(protocolBase.IPacket);
exports.CS_GetBattleBoxList = CS_GetBattleBoxList;

/**
 * 获取关卡宝箱列表 [SC]
 */
var SC_GetBattleBoxList = (function (parent) {
    inherit(SC_GetBattleBoxList, parent);
    function SC_GetBattleBoxList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.boxIdArr = []; /* 已领宝箱奖励列表 */
    }
    return SC_GetBattleBoxList;
})(protocolBase.IPacket);
exports.SC_GetBattleBoxList = SC_GetBattleBoxList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取关卡宝箱奖励 [CS]
 */
var CS_RcvBattleBoxAward = (function(parent) {
    inherit(CS_RcvBattleBoxAward, parent);
    function CS_RcvBattleBoxAward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.boxId = -1; /* 领取宝箱Id */
    }
    return CS_RcvBattleBoxAward;
})(protocolBase.IPacket);
exports.CS_RcvBattleBoxAward = CS_RcvBattleBoxAward;

/**
 * 领取关卡宝箱奖励 [SC]
 */
var SC_RcvBattleBoxAward = (function (parent) {
    inherit(SC_RcvBattleBoxAward, parent);
    function SC_RcvBattleBoxAward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.awards = []; /* 获得的奖励物品 */
    }
    return SC_RcvBattleBoxAward;
})(protocolBase.IPacket);
exports.SC_RcvBattleBoxAward = SC_RcvBattleBoxAward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 重置关卡通关次数 [CS]
 */
var CS_ResetBattleMain = (function(parent) {
    inherit(CS_ResetBattleMain, parent);
    function CS_ResetBattleMain() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.battleId = -1; /* 关卡ID */
        this.resetCnt = -1; /* 重置序号 */
    }
    return CS_ResetBattleMain;
})(protocolBase.IPacket);
exports.CS_ResetBattleMain = CS_ResetBattleMain;

/**
 * 重置关卡通关次数 [SC]
 */
var SC_ResetBattleMain = (function (parent) {
    inherit(SC_ResetBattleMain, parent);
    function SC_ResetBattleMain() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ResetBattleMain;
})(protocolBase.IPacket);
exports.SC_ResetBattleMain = SC_ResetBattleMain;
/**-------------------------------------------------------------------------------------------------------------------*/

