
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

exports.pCSPetLineupChange = 'CS_PetLineupChange';
exports.pSCPetLineupChange = 'SC_PetLineupChange';

exports.pCSPetUpgrade = 'CS_PetUpgrade';
exports.pSCPetUpgrade = 'SC_PetUpgrade';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 宠物阵型变化的功能 [CS]
 */
var CS_PetLineupChange = (function(parent) {
    inherit(CS_PetLineupChange, parent);
    function CS_PetLineupChange() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.teamPos = 0; /* 阵位 */
        this.upItemId = 0;
        this.upTid = 0;
        this.downItemId = 0;
        this.downTid = 0;
    }
    return CS_PetLineupChange;
})(protocolBase.IPacket);
exports.CS_PetLineupChange = CS_PetLineupChange;

/**
 * 宠物阵型变化的功能 [SC]
 */
var SC_PetLineupChange = (function (parent) {
    inherit(SC_PetLineupChange, parent);
    function SC_PetLineupChange() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_PetLineupChange;
})(protocolBase.IPacket);
exports.SC_PetLineupChange = SC_PetLineupChange;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 宠物升级的功能 [CS]
 */
var CS_PetUpgrade = (function(parent) {
    inherit(CS_PetUpgrade, parent);
    function CS_PetUpgrade() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.itemId = 0;
        this.tid = 0;
        this.arr = []; /* 宠物消耗数组，对象ItemObject */
    }
    return CS_PetUpgrade;
})(protocolBase.IPacket);
exports.CS_PetUpgrade = CS_PetUpgrade;

/**
 * 宠物升级的功能 [SC]
 */
var SC_PetUpgrade = (function (parent) {
    inherit(SC_PetUpgrade, parent);
    function SC_PetUpgrade() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_PetUpgrade;
})(protocolBase.IPacket);
exports.SC_PetUpgrade = SC_PetUpgrade;
/**-------------------------------------------------------------------------------------------------------------------*/

