
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

exports.pCSMysteryShopQuery = 'CS_MysteryShopQuery';
exports.pSCMysteryShopQuery = 'SC_MysteryShopQuery';

exports.pCSMysteryShopRefresh = 'CS_MysteryShopRefresh';
exports.pSCMysteryShopRefresh = 'SC_MysteryShopRefresh';

exports.pCSMysteryShopPurchase = 'CS_MysteryShopPurchase';
exports.pSCMysteryShopPurchase = 'SC_MysteryShopPurchase';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 神秘商店请求  [CS]
 */
var CS_MysteryShopQuery = (function(parent) {
    inherit(CS_MysteryShopQuery, parent);
    function CS_MysteryShopQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_MysteryShopQuery;
})(protocolBase.IPacket);
exports.CS_MysteryShopQuery = CS_MysteryShopQuery;

/**
 * 神秘商店请求  [SC]
 */
var SC_MysteryShopQuery = (function (parent) {
    inherit(SC_MysteryShopQuery, parent);
    function SC_MysteryShopQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.indexArr = [];
        this.freeNum = 10; /* 免费刷新次数 */
        this.leftTime = 0; /* 剩余时间 */
        this.leftNum = 0; /* 剩余次数 */
        this.mysteryArr = []; /* 物品購買信息 */
    }
    return SC_MysteryShopQuery;
})(protocolBase.IPacket);
exports.SC_MysteryShopQuery = SC_MysteryShopQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 神秘商店刷新 [CS]
 */
var CS_MysteryShopRefresh = (function(parent) {
    inherit(CS_MysteryShopRefresh, parent);
    function CS_MysteryShopRefresh() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.consume = {}; /* 刷新资源 */
    }
    return CS_MysteryShopRefresh;
})(protocolBase.IPacket);
exports.CS_MysteryShopRefresh = CS_MysteryShopRefresh;

/**
 * 神秘商店刷新 [SC]
 */
var SC_MysteryShopRefresh = (function (parent) {
    inherit(SC_MysteryShopRefresh, parent);
    function SC_MysteryShopRefresh() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.indexArr = [];
    }
    return SC_MysteryShopRefresh;
})(protocolBase.IPacket);
exports.SC_MysteryShopRefresh = SC_MysteryShopRefresh;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 神秘商店购买 [CS]
 */
var CS_MysteryShopPurchase = (function(parent) {
    inherit(CS_MysteryShopPurchase, parent);
    function CS_MysteryShopPurchase() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.indexNum = -1;
        this.num = 0;
    }
    return CS_MysteryShopPurchase;
})(protocolBase.IPacket);
exports.CS_MysteryShopPurchase = CS_MysteryShopPurchase;

/**
 * 神秘商店购买 [SC]
 */
var SC_MysteryShopPurchase = (function (parent) {
    inherit(SC_MysteryShopPurchase, parent);
    function SC_MysteryShopPurchase() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0;
        this.buyItem = [];
    }
    return SC_MysteryShopPurchase;
})(protocolBase.IPacket);
exports.SC_MysteryShopPurchase = SC_MysteryShopPurchase;
/**-------------------------------------------------------------------------------------------------------------------*/

