
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

exports.pCSFundPurchase = 'CS_FundPurchase';
exports.pSCFundPurchase = 'SC_FundPurchase';

exports.pCSFundReward = 'CS_FundReward';
exports.pSCFundReward = 'SC_FundReward';

exports.pCSWelfareReward = 'CS_WelfareReward';
exports.pSCWelfareReward = 'SC_WelfareReward';

exports.pCSFundQuery = 'CS_FundQuery';
exports.pSCFundQuery = 'SC_FundQuery';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开服基金购买  [CS]
 */
var CS_FundPurchase = (function(parent) {
    inherit(CS_FundPurchase, parent);
    function CS_FundPurchase() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_FundPurchase;
})(protocolBase.IPacket);
exports.CS_FundPurchase = CS_FundPurchase;

/**
 * 开服基金购买  [SC]
 */
var SC_FundPurchase = (function (parent) {
    inherit(SC_FundPurchase, parent);
    function SC_FundPurchase() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isBuySuccess = 0;
    }
    return SC_FundPurchase;
})(protocolBase.IPacket);
exports.SC_FundPurchase = SC_FundPurchase;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开服基金领取  [CS]
 */
var CS_FundReward = (function(parent) {
    inherit(CS_FundReward, parent);
    function CS_FundReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.index = -1;
    }
    return CS_FundReward;
})(protocolBase.IPacket);
exports.CS_FundReward = CS_FundReward;

/**
 * 开服基金领取  [SC]
 */
var SC_FundReward = (function (parent) {
    inherit(SC_FundReward, parent);
    function SC_FundReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_FundReward;
})(protocolBase.IPacket);
exports.SC_FundReward = SC_FundReward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 全民福利领取  [CS]
 */
var CS_WelfareReward = (function(parent) {
    inherit(CS_WelfareReward, parent);
    function CS_WelfareReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.index = -1;
    }
    return CS_WelfareReward;
})(protocolBase.IPacket);
exports.CS_WelfareReward = CS_WelfareReward;

/**
 * 全民福利领取  [SC]
 */
var SC_WelfareReward = (function (parent) {
    inherit(SC_WelfareReward, parent);
    function SC_WelfareReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.items = [];
    }
    return SC_WelfareReward;
})(protocolBase.IPacket);
exports.SC_WelfareReward = SC_WelfareReward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开服基金请求  [CS]
 */
var CS_FundQuery = (function(parent) {
    inherit(CS_FundQuery, parent);
    function CS_FundQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_FundQuery;
})(protocolBase.IPacket);
exports.CS_FundQuery = CS_FundQuery;

/**
 * 开服基金请求  [SC]
 */
var SC_FundQuery = (function (parent) {
    inherit(SC_FundQuery, parent);
    function SC_FundQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.buyNum = 0; /* 购买人数 */
        this.isBuy = 0; /* 开服基金是否已购买 */
        this.fundArr = []; /* FundEvent配表中的index数组 用于判断是否已领取 */
    }
    return SC_FundQuery;
})(protocolBase.IPacket);
exports.SC_FundQuery = SC_FundQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

