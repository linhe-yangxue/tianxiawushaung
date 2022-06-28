
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

exports.pCSPetDisenchant = 'CS_PetDisenchant';
exports.pSCPetDisenchant = 'SC_PetDisenchant';

exports.pCSPetRebirth = 'CS_PetRebirth';
exports.pSCPetRebirth = 'SC_PetRebirth';

exports.pCSEquipDisenchant = 'CS_EquipDisenchant';
exports.pSCEquipDisenchant = 'SC_EquipDisenchant';

exports.pCSMagicRebirth = 'CS_MagicRebirth';
exports.pSCMagicRebirth = 'SC_MagicRebirth';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 宠物分解 [CS]
 */
var CS_PetDisenchant = (function(parent) {
    inherit(CS_PetDisenchant, parent);
    function CS_PetDisenchant() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.arr = []; /* 要分解的宠物数组 */
    }
    return CS_PetDisenchant;
})(protocolBase.IPacket);
exports.CS_PetDisenchant = CS_PetDisenchant;

/**
 * 宠物分解 [SC]
 */
var SC_PetDisenchant = (function (parent) {
    inherit(SC_PetDisenchant, parent);
    function SC_PetDisenchant() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 分解返回的道具 */
    }
    return SC_PetDisenchant;
})(protocolBase.IPacket);
exports.SC_PetDisenchant = SC_PetDisenchant;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 宠物重生 [CS]
 */
var CS_PetRebirth = (function(parent) {
    inherit(CS_PetRebirth, parent);
    function CS_PetRebirth() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.item = {}; /* 要重生的宠物对象 */
    }
    return CS_PetRebirth;
})(protocolBase.IPacket);
exports.CS_PetRebirth = CS_PetRebirth;

/**
 * 宠物重生 [SC]
 */
var SC_PetRebirth = (function (parent) {
    inherit(SC_PetRebirth, parent);
    function SC_PetRebirth() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 分解返回的道具 */
    }
    return SC_PetRebirth;
})(protocolBase.IPacket);
exports.SC_PetRebirth = SC_PetRebirth;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 装备分解 [CS]
 */
var CS_EquipDisenchant = (function(parent) {
    inherit(CS_EquipDisenchant, parent);
    function CS_EquipDisenchant() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.arr = []; /* 要分解的装备数组 */
    }
    return CS_EquipDisenchant;
})(protocolBase.IPacket);
exports.CS_EquipDisenchant = CS_EquipDisenchant;

/**
 * 装备分解 [SC]
 */
var SC_EquipDisenchant = (function (parent) {
    inherit(SC_EquipDisenchant, parent);
    function SC_EquipDisenchant() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 分解返回的道具 */
    }
    return SC_EquipDisenchant;
})(protocolBase.IPacket);
exports.SC_EquipDisenchant = SC_EquipDisenchant;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 法器重生 [CS]
 */
var CS_MagicRebirth = (function(parent) {
    inherit(CS_MagicRebirth, parent);
    function CS_MagicRebirth() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.item = {}; /* 要重生的法器对象 */
    }
    return CS_MagicRebirth;
})(protocolBase.IPacket);
exports.CS_MagicRebirth = CS_MagicRebirth;

/**
 * 法器重生 [SC]
 */
var SC_MagicRebirth = (function (parent) {
    inherit(SC_MagicRebirth, parent);
    function SC_MagicRebirth() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 分解返回的道具 */
    }
    return SC_MagicRebirth;
})(protocolBase.IPacket);
exports.SC_MagicRebirth = SC_MagicRebirth;
/**-------------------------------------------------------------------------------------------------------------------*/

