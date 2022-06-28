
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

exports.pCSChangeVipLevel = 'CS_ChangeVipLevel';
exports.pSCChangeVipLevel = 'SC_ChangeVipLevel';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 改变vip等级 [CS]
 */
var CS_ChangeVipLevel = (function(parent) {
    inherit(CS_ChangeVipLevel, parent);
    function CS_ChangeVipLevel() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.vipLevel = -1;
    }
    return CS_ChangeVipLevel;
})(protocolBase.IPacket);
exports.CS_ChangeVipLevel = CS_ChangeVipLevel;

/**
 * 改变vip等级 [SC]
 */
var SC_ChangeVipLevel = (function (parent) {
    inherit(SC_ChangeVipLevel, parent);
    function SC_ChangeVipLevel() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ChangeVipLevel;
})(protocolBase.IPacket);
exports.SC_ChangeVipLevel = SC_ChangeVipLevel;
/**-------------------------------------------------------------------------------------------------------------------*/

