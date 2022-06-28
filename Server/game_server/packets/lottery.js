
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

exports.pCSLotteryQuery = 'CS_LotteryQuery';
exports.pSCLotteryQuery = 'SC_LotteryQuery';

exports.pCSNormalLottery = 'CS_NormalLottery';
exports.pSCNormalLottery = 'SC_NormalLottery';

exports.pCSTenNormalLottery = 'CS_TenNormalLottery';
exports.pSCTenNormalLottery = 'SC_TenNormalLottery';

exports.pCSPreciousLottery = 'CS_PreciousLottery';
exports.pSCPreciousLottery = 'SC_PreciousLottery';

exports.pCSTenPreciousLottery = 'CS_TenPreciousLottery';
exports.pSCTenPreciousLottery = 'SC_TenPreciousLottery';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 免费抽奖 [CS]
 */
var CS_LotteryQuery = (function(parent) {
    inherit(CS_LotteryQuery, parent);
    function CS_LotteryQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_LotteryQuery;
})(protocolBase.IPacket);
exports.CS_LotteryQuery = CS_LotteryQuery;

/**
 * 免费抽奖 [SC]
 */
var SC_LotteryQuery = (function (parent) {
    inherit(SC_LotteryQuery, parent);
    function SC_LotteryQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.normalLottery = {}; /* 存储普通抽奖信息 */
        this.preciousLottery = {}; /* 存储高级抽奖信息 */
        this.times = 0; /* 抽奖次数 */
    }
    return SC_LotteryQuery;
})(protocolBase.IPacket);
exports.SC_LotteryQuery = SC_LotteryQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 普通抽奖 [CS]
 */
var CS_NormalLottery = (function(parent) {
    inherit(CS_NormalLottery, parent);
    function CS_NormalLottery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.consume = {};
    }
    return CS_NormalLottery;
})(protocolBase.IPacket);
exports.CS_NormalLottery = CS_NormalLottery;

/**
 * 普通抽奖 [SC]
 */
var SC_NormalLottery = (function (parent) {
    inherit(SC_NormalLottery, parent);
    function SC_NormalLottery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.reward = {};
        this.freeGold = 0; /* 赠送硬币数量 */
    }
    return SC_NormalLottery;
})(protocolBase.IPacket);
exports.SC_NormalLottery = SC_NormalLottery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 普通十连抽 [CS]
 */
var CS_TenNormalLottery = (function(parent) {
    inherit(CS_TenNormalLottery, parent);
    function CS_TenNormalLottery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.consume = {};
    }
    return CS_TenNormalLottery;
})(protocolBase.IPacket);
exports.CS_TenNormalLottery = CS_TenNormalLottery;

/**
 * 普通十连抽 [SC]
 */
var SC_TenNormalLottery = (function (parent) {
    inherit(SC_TenNormalLottery, parent);
    function SC_TenNormalLottery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.reward = [];
        this.freeGold = 0; /* 赠送硬币数量 */
    }
    return SC_TenNormalLottery;
})(protocolBase.IPacket);
exports.SC_TenNormalLottery = SC_TenNormalLottery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 高级抽奖 [CS]
 */
var CS_PreciousLottery = (function(parent) {
    inherit(CS_PreciousLottery, parent);
    function CS_PreciousLottery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.consume = {};
    }
    return CS_PreciousLottery;
})(protocolBase.IPacket);
exports.CS_PreciousLottery = CS_PreciousLottery;

/**
 * 高级抽奖 [SC]
 */
var SC_PreciousLottery = (function (parent) {
    inherit(SC_PreciousLottery, parent);
    function SC_PreciousLottery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.reward = {};
        this.freeGold = 0; /* 赠送硬币数量 */
    }
    return SC_PreciousLottery;
})(protocolBase.IPacket);
exports.SC_PreciousLottery = SC_PreciousLottery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 高级十连抽 [CS]
 */
var CS_TenPreciousLottery = (function(parent) {
    inherit(CS_TenPreciousLottery, parent);
    function CS_TenPreciousLottery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_TenPreciousLottery;
})(protocolBase.IPacket);
exports.CS_TenPreciousLottery = CS_TenPreciousLottery;

/**
 * 高级十连抽 [SC]
 */
var SC_TenPreciousLottery = (function (parent) {
    inherit(SC_TenPreciousLottery, parent);
    function SC_TenPreciousLottery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.reward = [];
        this.freeGold = 0; /* 赠送硬币数量 */
    }
    return SC_TenPreciousLottery;
})(protocolBase.IPacket);
exports.SC_TenPreciousLottery = SC_TenPreciousLottery;
/**-------------------------------------------------------------------------------------------------------------------*/

