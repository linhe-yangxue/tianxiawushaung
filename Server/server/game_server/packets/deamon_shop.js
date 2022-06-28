
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

exports.pCSDeamonShopQuery = 'CS_DeamonShopQuery';
exports.pSCDeamonShopQuery = 'SC_DeamonShopQuery';

exports.pCSDeamonShopPurchase = 'CS_DeamonShopPurchase';
exports.pSCDeamonShopPurchase = 'SC_DeamonShopPurchase';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 战功商店请求  [CS]
 */
var CS_DeamonShopQuery = (function(parent) {
    inherit(CS_DeamonShopQuery, parent);
    function CS_DeamonShopQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_DeamonShopQuery;
})(protocolBase.IPacket);
exports.CS_DeamonShopQuery = CS_DeamonShopQuery;

/**
 * 战功商店请求  [SC]
 */
var SC_DeamonShopQuery = (function (parent) {
    inherit(SC_DeamonShopQuery, parent);
    function SC_DeamonShopQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.buyState = [];
    }
    return SC_DeamonShopQuery;
})(protocolBase.IPacket);
exports.SC_DeamonShopQuery = SC_DeamonShopQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 战功商店购买 [CS]
 */
var CS_DeamonShopPurchase = (function(parent) {
    inherit(CS_DeamonShopPurchase, parent);
    function CS_DeamonShopPurchase() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.indexNum = 0;
        this.num = 0;
        this.itemIdArr = [];
    }
    return CS_DeamonShopPurchase;
})(protocolBase.IPacket);
exports.CS_DeamonShopPurchase = CS_DeamonShopPurchase;

/**
 * 战功商店购买 [SC]
 */
var SC_DeamonShopPurchase = (function (parent) {
    inherit(SC_DeamonShopPurchase, parent);
    function SC_DeamonShopPurchase() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0;
        this.buyItem = [];
    }
    return SC_DeamonShopPurchase;
})(protocolBase.IPacket);
exports.SC_DeamonShopPurchase = SC_DeamonShopPurchase;
/**-------------------------------------------------------------------------------------------------------------------*/

