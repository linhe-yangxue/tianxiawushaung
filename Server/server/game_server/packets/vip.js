
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

exports.pCSVIPShop = 'CS_VIPShop';
exports.pSCVIPShop = 'SC_VIPShop';

exports.pCSVIPShopQuery = 'CS_VIPShopQuery';
exports.pSCVIPShopQuery = 'SC_VIPShopQuery';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP商店  [CS]
 */
var CS_VIPShop = (function(parent) {
    inherit(CS_VIPShop, parent);
    function CS_VIPShop() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.index = 0;
    }
    return CS_VIPShop;
})(protocolBase.IPacket);
exports.CS_VIPShop = CS_VIPShop;

/**
 * VIP商店  [SC]
 */
var SC_VIPShop = (function (parent) {
    inherit(SC_VIPShop, parent);
    function SC_VIPShop() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0;
        this.buyItem = [];
    }
    return SC_VIPShop;
})(protocolBase.IPacket);
exports.SC_VIPShop = SC_VIPShop;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP商店请求 [CS]
 */
var CS_VIPShopQuery = (function(parent) {
    inherit(CS_VIPShopQuery, parent);
    function CS_VIPShopQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_VIPShopQuery;
})(protocolBase.IPacket);
exports.CS_VIPShopQuery = CS_VIPShopQuery;

/**
 * VIP商店请求 [SC]
 */
var SC_VIPShopQuery = (function (parent) {
    inherit(SC_VIPShopQuery, parent);
    function SC_VIPShopQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.buyInfo = []; /* vip礼包购买状态信息 */
    }
    return SC_VIPShopQuery;
})(protocolBase.IPacket);
exports.SC_VIPShopQuery = SC_VIPShopQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

