
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

exports.pCSGetFlashSaleList = 'CS_GetFlashSaleList';
exports.pSCGetFlashSaleList = 'SC_GetFlashSaleList';

exports.pCSFlashPurchase = 'CS_FlashPurchase';
exports.pSCFlashPurchase = 'SC_FlashPurchase';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取限时抢购列表 [CS]
 */
var CS_GetFlashSaleList = (function(parent) {
    inherit(CS_GetFlashSaleList, parent);
    function CS_GetFlashSaleList() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
        this.type = -1; /* 显示抢购类型 */
    }
    return CS_GetFlashSaleList;
})(protocolBase.IPacket);
exports.CS_GetFlashSaleList = CS_GetFlashSaleList;

/**
 * 获取限时抢购列表 [SC]
 */
var SC_GetFlashSaleList = (function (parent) {
    inherit(SC_GetFlashSaleList, parent);
    function SC_GetFlashSaleList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.flashSaleList = []; /* 显示抢购商品列表 */
    }
    return SC_GetFlashSaleList;
})(protocolBase.IPacket);
exports.SC_GetFlashSaleList = SC_GetFlashSaleList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 限时抢购 [CS]
 */
var CS_FlashPurchase = (function(parent) {
    inherit(CS_FlashPurchase, parent);
    function CS_FlashPurchase() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
        this.index = -1; /* 商品位于FlashSaleEvent.csv中的下标 */
    }
    return CS_FlashPurchase;
})(protocolBase.IPacket);
exports.CS_FlashPurchase = CS_FlashPurchase;

/**
 * 限时抢购 [SC]
 */
var SC_FlashPurchase = (function (parent) {
    inherit(SC_FlashPurchase, parent);
    function SC_FlashPurchase() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rewards = []; /* 获取的奖励 */
    }
    return SC_FlashPurchase;
})(protocolBase.IPacket);
exports.SC_FlashPurchase = SC_FlashPurchase;
/**-------------------------------------------------------------------------------------------------------------------*/

