
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

exports.pCSClothShopQuery = 'CS_ClothShopQuery';
exports.pSCClothShopQuery = 'SC_ClothShopQuery';

exports.pCSClothShopPurchase = 'CS_ClothShopPurchase';
exports.pSCClothShopPurchase = 'SC_ClothShopPurchase';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 神装商店请求  [CS]
 */
var CS_ClothShopQuery = (function(parent) {
    inherit(CS_ClothShopQuery, parent);
    function CS_ClothShopQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_ClothShopQuery;
})(protocolBase.IPacket);
exports.CS_ClothShopQuery = CS_ClothShopQuery;

/**
 * 神装商店请求  [SC]
 */
var SC_ClothShopQuery = (function (parent) {
    inherit(SC_ClothShopQuery, parent);
    function SC_ClothShopQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.cloth = [];
        this.star = 0; /* 最高星数 */
    }
    return SC_ClothShopQuery;
})(protocolBase.IPacket);
exports.SC_ClothShopQuery = SC_ClothShopQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 神装商店购买 [CS]
 */
var CS_ClothShopPurchase = (function(parent) {
    inherit(CS_ClothShopPurchase, parent);
    function CS_ClothShopPurchase() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.indexNum = 0;
        this.num = 0;
        this.itemIdArr = [];
    }
    return CS_ClothShopPurchase;
})(protocolBase.IPacket);
exports.CS_ClothShopPurchase = CS_ClothShopPurchase;

/**
 * 神装商店购买 [SC]
 */
var SC_ClothShopPurchase = (function (parent) {
    inherit(SC_ClothShopPurchase, parent);
    function SC_ClothShopPurchase() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0;
        this.buyItem = [];
    }
    return SC_ClothShopPurchase;
})(protocolBase.IPacket);
exports.SC_ClothShopPurchase = SC_ClothShopPurchase;
/**-------------------------------------------------------------------------------------------------------------------*/

