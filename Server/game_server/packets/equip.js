
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

exports.pCSBodyEquipChange = 'CS_BodyEquipChange';
exports.pSCBodyEquipChange = 'SC_BodyEquipChange';

exports.pCSStrengthenEquip = 'CS_StrengthenEquip';
exports.pSCStrengthenEquip = 'SC_StrengthenEquip';

exports.pCSRefineEquip = 'CS_RefineEquip';
exports.pSCRefineEquip = 'SC_RefineEquip';

exports.pCSStrengthenMagic = 'CS_StrengthenMagic';
exports.pSCStrengthenMagic = 'SC_StrengthenMagic';

exports.pCSRefineMagic = 'CS_RefineMagic';
exports.pSCRefineMagic = 'SC_RefineMagic';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 身上装备的装配和卸载功能 [CS]
 */
var CS_BodyEquipChange = (function(parent) {
    inherit(CS_BodyEquipChange, parent);
    function CS_BodyEquipChange() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.teamPos = 0;
        this.upItemId = 0;
        this.upTid = 0;
        this.downItemId = 0;
        this.downTid = 0;
    }
    return CS_BodyEquipChange;
})(protocolBase.IPacket);
exports.CS_BodyEquipChange = CS_BodyEquipChange;

/**
 * 身上装备的装配和卸载功能 [SC]
 */
var SC_BodyEquipChange = (function (parent) {
    inherit(SC_BodyEquipChange, parent);
    function SC_BodyEquipChange() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_BodyEquipChange;
})(protocolBase.IPacket);
exports.SC_BodyEquipChange = SC_BodyEquipChange;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 强化装备的功能 [CS]
 */
var CS_StrengthenEquip = (function(parent) {
    inherit(CS_StrengthenEquip, parent);
    function CS_StrengthenEquip() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.itemId = 0;
        this.tid = 0;
        this.strenTimes = 0; /* 请求强化的次数 */
    }
    return CS_StrengthenEquip;
})(protocolBase.IPacket);
exports.CS_StrengthenEquip = CS_StrengthenEquip;

/**
 * 强化装备的功能 [SC]
 */
var SC_StrengthenEquip = (function (parent) {
    inherit(SC_StrengthenEquip, parent);
    function SC_StrengthenEquip() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.succTimes = 0; /* 强化的次数 */
        this.upgradeLevel = 0; /* 强化的等级数 */
        this.costGold = 0; /* 强化的花费 */
    }
    return SC_StrengthenEquip;
})(protocolBase.IPacket);
exports.SC_StrengthenEquip = SC_StrengthenEquip;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 精炼装备的功能 [CS]
 */
var CS_RefineEquip = (function(parent) {
    inherit(CS_RefineEquip, parent);
    function CS_RefineEquip() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.itemId = 0;
        this.tid = 0;
        this.arr = []; /* 精炼石消耗数组，对象ItemObject */
    }
    return CS_RefineEquip;
})(protocolBase.IPacket);
exports.CS_RefineEquip = CS_RefineEquip;

/**
 * 精炼装备的功能 [SC]
 */
var SC_RefineEquip = (function (parent) {
    inherit(SC_RefineEquip, parent);
    function SC_RefineEquip() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_RefineEquip;
})(protocolBase.IPacket);
exports.SC_RefineEquip = SC_RefineEquip;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 强化法器的功能 [CS]
 */
var CS_StrengthenMagic = (function(parent) {
    inherit(CS_StrengthenMagic, parent);
    function CS_StrengthenMagic() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.itemId = 0;
        this.tid = 0;
        this.arr = []; /* 法宝消耗数组，对象ItemObject */
    }
    return CS_StrengthenMagic;
})(protocolBase.IPacket);
exports.CS_StrengthenMagic = CS_StrengthenMagic;

/**
 * 强化法器的功能 [SC]
 */
var SC_StrengthenMagic = (function (parent) {
    inherit(SC_StrengthenMagic, parent);
    function SC_StrengthenMagic() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_StrengthenMagic;
})(protocolBase.IPacket);
exports.SC_StrengthenMagic = SC_StrengthenMagic;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 精炼法器的功能 [CS]
 */
var CS_RefineMagic = (function(parent) {
    inherit(CS_RefineMagic, parent);
    function CS_RefineMagic() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.itemId = 0;
        this.tid = 0;
        this.arr = []; /* 法宝消耗数组，对象ItemObject */
    }
    return CS_RefineMagic;
})(protocolBase.IPacket);
exports.CS_RefineMagic = CS_RefineMagic;

/**
 * 精炼法器的功能 [SC]
 */
var SC_RefineMagic = (function (parent) {
    inherit(SC_RefineMagic, parent);
    function SC_RefineMagic() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_RefineMagic;
})(protocolBase.IPacket);
exports.SC_RefineMagic = SC_RefineMagic;
/**-------------------------------------------------------------------------------------------------------------------*/

