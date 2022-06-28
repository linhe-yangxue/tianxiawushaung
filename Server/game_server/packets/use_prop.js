
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

exports.pCSUseProp = 'CS_UseProp';
exports.pSCUseProp = 'SC_UseProp';

exports.pCSOpenBoxSelect = 'CS_OpenBoxSelect';
exports.pSCOpenBoxSelect = 'SC_OpenBoxSelect';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 使用道具 [CS]
 */
var CS_UseProp = (function(parent) {
    inherit(CS_UseProp, parent);
    function CS_UseProp() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.prop = {}; /* 道具 */
    }
    return CS_UseProp;
})(protocolBase.IPacket);
exports.CS_UseProp = CS_UseProp;

/**
 * 使用道具 [SC]
 */
var SC_UseProp = (function (parent) {
    inherit(SC_UseProp, parent);
    function SC_UseProp() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.items = []; /* 宝箱里的物品 */
    }
    return SC_UseProp;
})(protocolBase.IPacket);
exports.SC_UseProp = SC_UseProp;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开宝箱玩家自选 [CS]
 */
var CS_OpenBoxSelect = (function(parent) {
    inherit(CS_OpenBoxSelect, parent);
    function CS_OpenBoxSelect() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.prop = {}; /* 道具 */
        this.selectItem = {}; /* 玩家选择的物品 */
    }
    return CS_OpenBoxSelect;
})(protocolBase.IPacket);
exports.CS_OpenBoxSelect = CS_OpenBoxSelect;

/**
 * 开宝箱玩家自选 [SC]
 */
var SC_OpenBoxSelect = (function (parent) {
    inherit(SC_OpenBoxSelect, parent);
    function SC_OpenBoxSelect() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.items = []; /* 玩家选择的物品 */
    }
    return SC_OpenBoxSelect;
})(protocolBase.IPacket);
exports.SC_OpenBoxSelect = SC_OpenBoxSelect;
/**-------------------------------------------------------------------------------------------------------------------*/

