
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

exports.pCSGuildShopQuery = 'CS_GuildShopQuery';
exports.pSCGuildShopQuery = 'SC_GuildShopQuery';

exports.pCSGuildShopOtherBuy = 'CS_GuildShopOtherBuy';
exports.pSCGuildShopOtherBuy = 'SC_GuildShopOtherBuy';

exports.pCSGuildShopLimitBuy = 'CS_GuildShopLimitBuy';
exports.pSCGuildShopLimitBuy = 'SC_GuildShopLimitBuy';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会商店请求  [CS]
 */
var CS_GuildShopQuery = (function(parent) {
    inherit(CS_GuildShopQuery, parent);
    function CS_GuildShopQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
    }
    return CS_GuildShopQuery;
})(protocolBase.IPacket);
exports.CS_GuildShopQuery = CS_GuildShopQuery;

/**
 * 公会商店请求  [SC]
 */
var SC_GuildShopQuery = (function (parent) {
    inherit(SC_GuildShopQuery, parent);
    function SC_GuildShopQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.otherArr = []; /* 其他更新队列 */
        this.pubLimArr = []; /* 公会限时队列 */
        this.priLimArr = []; /* 个人限时队列 */
        this.guildId = ''; /* 公会ID */
        this.time = 0; /* 距离下一次刷新的时间 */
    }
    return SC_GuildShopQuery;
})(protocolBase.IPacket);
exports.SC_GuildShopQuery = SC_GuildShopQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会商店非限时购买  [CS]
 */
var CS_GuildShopOtherBuy = (function(parent) {
    inherit(CS_GuildShopOtherBuy, parent);
    function CS_GuildShopOtherBuy() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.gIndex = -1;
        this.num = 0;
        this.zgid = ''; /* 公会ID */
    }
    return CS_GuildShopOtherBuy;
})(protocolBase.IPacket);
exports.CS_GuildShopOtherBuy = CS_GuildShopOtherBuy;

/**
 * 公会商店非限时购买  [SC]
 */
var SC_GuildShopOtherBuy = (function (parent) {
    inherit(SC_GuildShopOtherBuy, parent);
    function SC_GuildShopOtherBuy() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0; /* 购买成功与否 */
        this.guildId = ''; /* 公会ID */
        this.buyItem = [];
    }
    return SC_GuildShopOtherBuy;
})(protocolBase.IPacket);
exports.SC_GuildShopOtherBuy = SC_GuildShopOtherBuy;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会商店限时购买  [CS]
 */
var CS_GuildShopLimitBuy = (function(parent) {
    inherit(CS_GuildShopLimitBuy, parent);
    function CS_GuildShopLimitBuy() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.gIndex = -1;
        this.num = 0;
        this.zgid = ''; /* 公会ID */
    }
    return CS_GuildShopLimitBuy;
})(protocolBase.IPacket);
exports.CS_GuildShopLimitBuy = CS_GuildShopLimitBuy;

/**
 * 公会商店限时购买  [SC]
 */
var SC_GuildShopLimitBuy = (function (parent) {
    inherit(SC_GuildShopLimitBuy, parent);
    function SC_GuildShopLimitBuy() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0; /* 购买成功与否 */
        this.guildId = ''; /* 公会ID */
        this.buyItem = [];
    }
    return SC_GuildShopLimitBuy;
})(protocolBase.IPacket);
exports.SC_GuildShopLimitBuy = SC_GuildShopLimitBuy;
/**-------------------------------------------------------------------------------------------------------------------*/

