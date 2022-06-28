
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

exports.pCSBattleActiveFresh = 'CS_BattleActiveFresh';
exports.pSCBattleActiveFresh = 'SC_BattleActiveFresh';

exports.pCSBattleActiveMap = 'CS_BattleActiveMap';
exports.pSCBattleActiveMap = 'SC_BattleActiveMap';

exports.pCSBattleActiveStart = 'CS_BattleActiveStart';
exports.pSCBattleActiveStart = 'SC_BattleActiveStart';

exports.pCSBattleActiveResult = 'CS_BattleActiveResult';
exports.pSCBattleActiveResult = 'SC_BattleActiveResult';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日副本数据刷新 [CS]
 */
var CS_BattleActiveFresh = (function(parent) {
    inherit(CS_BattleActiveFresh, parent);
    function CS_BattleActiveFresh() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.uid = -1; /* 用户ID */
    }
    return CS_BattleActiveFresh;
})(protocolBase.IPacket);
exports.CS_BattleActiveFresh = CS_BattleActiveFresh;

/**
 * 每日副本数据刷新 [SC]
 */
var SC_BattleActiveFresh = (function (parent) {
    inherit(SC_BattleActiveFresh, parent);
    function SC_BattleActiveFresh() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.freshFlag = 0; /* 是否刷新 */
    }
    return SC_BattleActiveFresh;
})(protocolBase.IPacket);
exports.SC_BattleActiveFresh = SC_BattleActiveFresh;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取每日副本的功能 [CS]
 */
var CS_BattleActiveMap = (function(parent) {
    inherit(CS_BattleActiveMap, parent);
    function CS_BattleActiveMap() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.uid = -1; /* 用户ID */
    }
    return CS_BattleActiveMap;
})(protocolBase.IPacket);
exports.CS_BattleActiveMap = CS_BattleActiveMap;

/**
 * 获取每日副本的功能 [SC]
 */
var SC_BattleActiveMap = (function (parent) {
    inherit(SC_BattleActiveMap, parent);
    function SC_BattleActiveMap() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 每日副本地图列表 */
    }
    return SC_BattleActiveMap;
})(protocolBase.IPacket);
exports.SC_BattleActiveMap = SC_BattleActiveMap;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 进入每日副本 [CS]
 */
var CS_BattleActiveStart = (function(parent) {
    inherit(CS_BattleActiveStart, parent);
    function CS_BattleActiveStart() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.uid = -1; /* 用户ID */
        this.battleId = -1; /* 关卡ID */
    }
    return CS_BattleActiveStart;
})(protocolBase.IPacket);
exports.CS_BattleActiveStart = CS_BattleActiveStart;

/**
 * 进入每日副本 [SC]
 */
var SC_BattleActiveStart = (function (parent) {
    inherit(SC_BattleActiveStart, parent);
    function SC_BattleActiveStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_BattleActiveStart;
})(protocolBase.IPacket);
exports.SC_BattleActiveStart = SC_BattleActiveStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 退出每日副本 [CS]
 */
var CS_BattleActiveResult = (function(parent) {
    inherit(CS_BattleActiveResult, parent);
    function CS_BattleActiveResult() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.uid = -1; /* 用户ID */
        this.battleId = -1; /* 关卡ID */
        this.isWin = 0; /* int 类型，0代表失败，1代表成功 */
        this.starRate = -1; /* 评级 */
    }
    return CS_BattleActiveResult;
})(protocolBase.IPacket);
exports.CS_BattleActiveResult = CS_BattleActiveResult;

/**
 * 退出每日副本 [SC]
 */
var SC_BattleActiveResult = (function (parent) {
    inherit(SC_BattleActiveResult, parent);
    function SC_BattleActiveResult() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 掉落队列 ItemObject */
    }
    return SC_BattleActiveResult;
})(protocolBase.IPacket);
exports.SC_BattleActiveResult = SC_BattleActiveResult;
/**-------------------------------------------------------------------------------------------------------------------*/

