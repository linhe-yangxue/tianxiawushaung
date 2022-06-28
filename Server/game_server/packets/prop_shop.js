
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

exports.pCSPropShopQuery = 'CS_PropShopQuery';
exports.pSCPropShopQuery = 'SC_PropShopQuery';

exports.pCSPropShopPurchase = 'CS_PropShopPurchase';
exports.pSCPropShopPurchase = 'SC_PropShopPurchase';

exports.pCSPropShopItemQuery = 'CS_PropShopItemQuery';
exports.pSCPropShopItemQuery = 'SC_PropShopItemQuery';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 道具商店请求  [CS]
 */
var CS_PropShopQuery = (function(parent) {
    inherit(CS_PropShopQuery, parent);
    function CS_PropShopQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_PropShopQuery;
})(protocolBase.IPacket);
exports.CS_PropShopQuery = CS_PropShopQuery;

/**
 * 道具商店请求  [SC]
 */
var SC_PropShopQuery = (function (parent) {
    inherit(SC_PropShopQuery, parent);
    function SC_PropShopQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.prop = [];
    }
    return SC_PropShopQuery;
})(protocolBase.IPacket);
exports.SC_PropShopQuery = SC_PropShopQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 道具商店购买 [CS]
 */
var CS_PropShopPurchase = (function(parent) {
    inherit(CS_PropShopPurchase, parent);
    function CS_PropShopPurchase() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.sIndex = 0;
        this.num = 0;
    }
    return CS_PropShopPurchase;
})(protocolBase.IPacket);
exports.CS_PropShopPurchase = CS_PropShopPurchase;

/**
 * 道具商店购买 [SC]
 */
var SC_PropShopPurchase = (function (parent) {
    inherit(SC_PropShopPurchase, parent);
    function SC_PropShopPurchase() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0;
    }
    return SC_PropShopPurchase;
})(protocolBase.IPacket);
exports.SC_PropShopPurchase = SC_PropShopPurchase;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 道具商店单个物品购买请求  [CS]
 */
var CS_PropShopItemQuery = (function(parent) {
    inherit(CS_PropShopItemQuery, parent);
    function CS_PropShopItemQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.index = -1; /* 物品索引 */
    }
    return CS_PropShopItemQuery;
})(protocolBase.IPacket);
exports.CS_PropShopItemQuery = CS_PropShopItemQuery;

/**
 * 道具商店单个物品购买请求  [SC]
 */
var SC_PropShopItemQuery = (function (parent) {
    inherit(SC_PropShopItemQuery, parent);
    function SC_PropShopItemQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.prop = [];
    }
    return SC_PropShopItemQuery;
})(protocolBase.IPacket);
exports.SC_PropShopItemQuery = SC_PropShopItemQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

