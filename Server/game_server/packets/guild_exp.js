
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

exports.pCSAddGuildExp = 'CS_AddGuildExp';
exports.pSCAddGuildExp = 'SC_AddGuildExp';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会经验  [CS]
 */
var CS_AddGuildExp = (function(parent) {
    inherit(CS_AddGuildExp, parent);
    function CS_AddGuildExp() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.uid = ''; /* 用户ID */
        this.exp = 0;
    }
    return CS_AddGuildExp;
})(protocolBase.IPacket);
exports.CS_AddGuildExp = CS_AddGuildExp;

/**
 * 公会经验  [SC]
 */
var SC_AddGuildExp = (function (parent) {
    inherit(SC_AddGuildExp, parent);
    function SC_AddGuildExp() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_AddGuildExp;
})(protocolBase.IPacket);
exports.SC_AddGuildExp = SC_AddGuildExp;
/**-------------------------------------------------------------------------------------------------------------------*/

