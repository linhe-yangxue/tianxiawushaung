
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

exports.pCSUpgradeSkill = 'CS_UpgradeSkill';
exports.pSCUpgradeSkill = 'SC_UpgradeSkill';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 升级技能 [CS]
 */
var CS_UpgradeSkill = (function(parent) {
    inherit(CS_UpgradeSkill, parent);
    function CS_UpgradeSkill() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.itemId = 0;
        this.skillIndex = 0; /* 技能序号 */
    }
    return CS_UpgradeSkill;
})(protocolBase.IPacket);
exports.CS_UpgradeSkill = CS_UpgradeSkill;

/**
 * 升级技能 [SC]
 */
var SC_UpgradeSkill = (function (parent) {
    inherit(SC_UpgradeSkill, parent);
    function SC_UpgradeSkill() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_UpgradeSkill;
})(protocolBase.IPacket);
exports.SC_UpgradeSkill = SC_UpgradeSkill;
/**-------------------------------------------------------------------------------------------------------------------*/

