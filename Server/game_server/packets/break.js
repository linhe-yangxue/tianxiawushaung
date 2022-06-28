
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

exports.pCSBreakUpgrade = 'CS_BreakUpgrade';
exports.pSCBreakUpgrade = 'SC_BreakUpgrade';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 突破升级  [CS]
 */
var CS_BreakUpgrade = (function(parent) {
    inherit(CS_BreakUpgrade, parent);
    function CS_BreakUpgrade() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.itemId = -1;
        this.tid = -1;
        this.consume = [];
    }
    return CS_BreakUpgrade;
})(protocolBase.IPacket);
exports.CS_BreakUpgrade = CS_BreakUpgrade;

/**
 * 突破升级  [SC]
 */
var SC_BreakUpgrade = (function (parent) {
    inherit(SC_BreakUpgrade, parent);
    function SC_BreakUpgrade() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBreakSuccess = 0;
    }
    return SC_BreakUpgrade;
})(protocolBase.IPacket);
exports.SC_BreakUpgrade = SC_BreakUpgrade;
/**-------------------------------------------------------------------------------------------------------------------*/

