
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

exports.pCSFateQuery = 'CS_FateQuery';
exports.pSCFateQuery = 'SC_FateQuery';

exports.pCSFateUpgrade = 'CS_FateUpgrade';
exports.pSCFateUpgrade = 'SC_FateUpgrade';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 天命值清零 [CS]
 */
var CS_FateQuery = (function(parent) {
    inherit(CS_FateQuery, parent);
    function CS_FateQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.uid = ''; /* 用户ID */
        this.itemId = -1;
        this.tid = -1;
    }
    return CS_FateQuery;
})(protocolBase.IPacket);
exports.CS_FateQuery = CS_FateQuery;

/**
 * 天命值清零 [SC]
 */
var SC_FateQuery = (function (parent) {
    inherit(SC_FateQuery, parent);
    function SC_FateQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.fateValue = 0;
    }
    return SC_FateQuery;
})(protocolBase.IPacket);
exports.SC_FateQuery = SC_FateQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 天命升级 [CS]
 */
var CS_FateUpgrade = (function(parent) {
    inherit(CS_FateUpgrade, parent);
    function CS_FateUpgrade() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.uid = ''; /* 用户ID */
        this.itemId = -1;
        this.tid = -1;
        this.consume = {};
    }
    return CS_FateUpgrade;
})(protocolBase.IPacket);
exports.CS_FateUpgrade = CS_FateUpgrade;

/**
 * 天命升级 [SC]
 */
var SC_FateUpgrade = (function (parent) {
    inherit(SC_FateUpgrade, parent);
    function SC_FateUpgrade() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isFateSuccess = 0;
        this.fateValue = 0; /* 升级后的天命值 */
    }
    return SC_FateUpgrade;
})(protocolBase.IPacket);
exports.SC_FateUpgrade = SC_FateUpgrade;
/**-------------------------------------------------------------------------------------------------------------------*/

