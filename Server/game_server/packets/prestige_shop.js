
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

exports.pCSPrestigeShopQuery = 'CS_PrestigeShopQuery';
exports.pSCPrestigeShopQuery = 'SC_PrestigeShopQuery';

exports.pCSPrestigeShopPurchase = 'CS_PrestigeShopPurchase';
exports.pSCPrestigeShopPurchase = 'SC_PrestigeShopPurchase';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 声望商店请求  [CS]
 */
var CS_PrestigeShopQuery = (function(parent) {
    inherit(CS_PrestigeShopQuery, parent);
    function CS_PrestigeShopQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_PrestigeShopQuery;
})(protocolBase.IPacket);
exports.CS_PrestigeShopQuery = CS_PrestigeShopQuery;

/**
 * 声望商店请求  [SC]
 */
var SC_PrestigeShopQuery = (function (parent) {
    inherit(SC_PrestigeShopQuery, parent);
    function SC_PrestigeShopQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.commodity = [];
        this.rank = 0; /* 历史最好排名 */
        this.curRank = 0; /* 当前排名 */
    }
    return SC_PrestigeShopQuery;
})(protocolBase.IPacket);
exports.SC_PrestigeShopQuery = SC_PrestigeShopQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 声望商店购买 [CS]
 */
var CS_PrestigeShopPurchase = (function(parent) {
    inherit(CS_PrestigeShopPurchase, parent);
    function CS_PrestigeShopPurchase() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.pIndex = 0;
        this.num = 0;
        this.itemIdArr = [];
    }
    return CS_PrestigeShopPurchase;
})(protocolBase.IPacket);
exports.CS_PrestigeShopPurchase = CS_PrestigeShopPurchase;

/**
 * 声望商店购买 [SC]
 */
var SC_PrestigeShopPurchase = (function (parent) {
    inherit(SC_PrestigeShopPurchase, parent);
    function SC_PrestigeShopPurchase() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0;
        this.buyItem = [];
    }
    return SC_PrestigeShopPurchase;
})(protocolBase.IPacket);
exports.SC_PrestigeShopPurchase = SC_PrestigeShopPurchase;
/**-------------------------------------------------------------------------------------------------------------------*/

