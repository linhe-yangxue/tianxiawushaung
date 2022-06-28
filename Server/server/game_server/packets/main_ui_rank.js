
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

exports.pCSMainUIPowerRanklist = 'CS_MainUIPowerRanklist';
exports.pSCMainUIPowerRanklist = 'SC_MainUIPowerRanklist';

exports.pCSMainUILevelRanklist = 'CS_MainUILevelRanklist';
exports.pSCMainUILevelRanklist = 'SC_MainUILevelRanklist';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 战斗力排行 [CS]
 */
var CS_MainUIPowerRanklist = (function(parent) {
    inherit(CS_MainUIPowerRanklist, parent);
    function CS_MainUIPowerRanklist() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_MainUIPowerRanklist;
})(protocolBase.IPacket);
exports.CS_MainUIPowerRanklist = CS_MainUIPowerRanklist;

/**
 * 战斗力排行 [SC]
 */
var SC_MainUIPowerRanklist = (function (parent) {
    inherit(SC_MainUIPowerRanklist, parent);
    function SC_MainUIPowerRanklist() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.myRanking = -1; /* 我的排行 */
        this.ranklist = []; /* 排行榜 */
    }
    return SC_MainUIPowerRanklist;
})(protocolBase.IPacket);
exports.SC_MainUIPowerRanklist = SC_MainUIPowerRanklist;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 等级排行 [CS]
 */
var CS_MainUILevelRanklist = (function(parent) {
    inherit(CS_MainUILevelRanklist, parent);
    function CS_MainUILevelRanklist() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_MainUILevelRanklist;
})(protocolBase.IPacket);
exports.CS_MainUILevelRanklist = CS_MainUILevelRanklist;

/**
 * 等级排行 [SC]
 */
var SC_MainUILevelRanklist = (function (parent) {
    inherit(SC_MainUILevelRanklist, parent);
    function SC_MainUILevelRanklist() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.myRanking = -1; /* 我的排行 */
        this.ranklist = []; /* 排行榜 */
    }
    return SC_MainUILevelRanklist;
})(protocolBase.IPacket);
exports.SC_MainUILevelRanklist = SC_MainUILevelRanklist;
/**-------------------------------------------------------------------------------------------------------------------*/

