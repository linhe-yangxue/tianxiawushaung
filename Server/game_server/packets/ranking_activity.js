
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

exports.pCSPvpList = 'CS_PvpList';
exports.pSCPvpList = 'SC_PvpList';

exports.pCSFightingList = 'CS_FightingList';
exports.pSCFightingList = 'SC_FightingList';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取竞技场排行榜 [CS]
 */
var CS_PvpList = (function(parent) {
    inherit(CS_PvpList, parent);
    function CS_PvpList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_PvpList;
})(protocolBase.IPacket);
exports.CS_PvpList = CS_PvpList;

/**
 * 获取竞技场排行榜 [SC]
 */
var SC_PvpList = (function (parent) {
    inherit(SC_PvpList, parent);
    function SC_PvpList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.myRanking = -1; /* 我的排行 */
        this.ranklist = []; /* 排行榜 */
        this.endTime = 0; /* 结束时间 */
    }
    return SC_PvpList;
})(protocolBase.IPacket);
exports.SC_PvpList = SC_PvpList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 战斗力排行 [CS]
 */
var CS_FightingList = (function(parent) {
    inherit(CS_FightingList, parent);
    function CS_FightingList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_FightingList;
})(protocolBase.IPacket);
exports.CS_FightingList = CS_FightingList;

/**
 * 战斗力排行 [SC]
 */
var SC_FightingList = (function (parent) {
    inherit(SC_FightingList, parent);
    function SC_FightingList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.myRanking = -1; /* 我的排行 */
        this.ranklist = []; /* 排行榜 */
        this.endTime = 0; /* 结束时间 */
    }
    return SC_FightingList;
})(protocolBase.IPacket);
exports.SC_FightingList = SC_FightingList;
/**-------------------------------------------------------------------------------------------------------------------*/

