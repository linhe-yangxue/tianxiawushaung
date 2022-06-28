
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

exports.pCSHalfPriceQuery = 'CS_HalfPriceQuery';
exports.pSCHalfPriceQuery = 'SC_HalfPriceQuery';

exports.pCSHalfPrice = 'CS_HalfPrice';
exports.pSCHalfPrice = 'SC_HalfPrice';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 半价抢购请求  [CS]
 */
var CS_HalfPriceQuery = (function(parent) {
    inherit(CS_HalfPriceQuery, parent);
    function CS_HalfPriceQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_HalfPriceQuery;
})(protocolBase.IPacket);
exports.CS_HalfPriceQuery = CS_HalfPriceQuery;

/**
 * 半价抢购请求  [SC]
 */
var SC_HalfPriceQuery = (function (parent) {
    inherit(SC_HalfPriceQuery, parent);
    function SC_HalfPriceQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.buyArr = []; /* 购买状态 */
        this.useArr = []; /* 已购买数量数组 */
    }
    return SC_HalfPriceQuery;
})(protocolBase.IPacket);
exports.SC_HalfPriceQuery = SC_HalfPriceQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 半价抢购 [CS]
 */
var CS_HalfPrice = (function(parent) {
    inherit(CS_HalfPrice, parent);
    function CS_HalfPrice() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.whichDay = 0; /* 抢购哪天物品 */
    }
    return CS_HalfPrice;
})(protocolBase.IPacket);
exports.CS_HalfPrice = CS_HalfPrice;

/**
 * 半价抢购 [SC]
 */
var SC_HalfPrice = (function (parent) {
    inherit(SC_HalfPrice, parent);
    function SC_HalfPrice() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.buyItem = []; /* 购买物品 */
    }
    return SC_HalfPrice;
})(protocolBase.IPacket);
exports.SC_HalfPrice = SC_HalfPrice;
/**-------------------------------------------------------------------------------------------------------------------*/

