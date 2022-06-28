
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

exports.pCSGetPackageList = 'CS_GetPackageList';
exports.pSCGetPackageList = 'SC_GetPackageList';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取背包 [CS]
 */
var CS_GetPackageList = (function(parent) {
    inherit(CS_GetPackageList, parent);
    function CS_GetPackageList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.pkgId = 0; /* 背包序号 */
    }
    return CS_GetPackageList;
})(protocolBase.IPacket);
exports.CS_GetPackageList = CS_GetPackageList;

/**
 * 获取背包 [SC]
 */
var SC_GetPackageList = (function (parent) {
    inherit(SC_GetPackageList, parent);
    function SC_GetPackageList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.pkgId = 0; /* 背包序号 */
        this.itemList = {}; /* 物品Id:物品对象 */
    }
    return SC_GetPackageList;
})(protocolBase.IPacket);
exports.SC_GetPackageList = SC_GetPackageList;
/**-------------------------------------------------------------------------------------------------------------------*/

