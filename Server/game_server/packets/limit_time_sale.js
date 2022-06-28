
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

exports.pCSLimitTimeSale = 'CS_LimitTimeSale';
exports.pSCLimitTimeSale = 'SC_LimitTimeSale';

exports.pCSBuyCheapWares = 'CS_BuyCheapWares';
exports.pSCBuyCheapWares = 'SC_BuyCheapWares';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 限时抢购请求 [CS]
 */
var CS_LimitTimeSale = (function(parent) {
    inherit(CS_LimitTimeSale, parent);
    function CS_LimitTimeSale() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_LimitTimeSale;
})(protocolBase.IPacket);
exports.CS_LimitTimeSale = CS_LimitTimeSale;

/**
 * 限时抢购请求 [SC]
 */
var SC_LimitTimeSale = (function (parent) {
    inherit(SC_LimitTimeSale, parent);
    function SC_LimitTimeSale() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.haveBuyNum = []; /* 已购买次数 */
    }
    return SC_LimitTimeSale;
})(protocolBase.IPacket);
exports.SC_LimitTimeSale = SC_LimitTimeSale;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 抢购物品 [CS]
 */
var CS_BuyCheapWares = (function(parent) {
    inherit(CS_BuyCheapWares, parent);
    function CS_BuyCheapWares() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.buyWareIndex = 0; /* 购买宝箱编号 */
    }
    return CS_BuyCheapWares;
})(protocolBase.IPacket);
exports.CS_BuyCheapWares = CS_BuyCheapWares;

/**
 * 抢购物品 [SC]
 */
var SC_BuyCheapWares = (function (parent) {
    inherit(SC_BuyCheapWares, parent);
    function SC_BuyCheapWares() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.randWareID = []; /* 发放物品ID */
        this.haveBuyNum = 0; /* 已购买次数 */
    }
    return SC_BuyCheapWares;
})(protocolBase.IPacket);
exports.SC_BuyCheapWares = SC_BuyCheapWares;
/**-------------------------------------------------------------------------------------------------------------------*/

