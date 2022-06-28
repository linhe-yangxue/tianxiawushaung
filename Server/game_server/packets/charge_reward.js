
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

exports.pCSChargeRewardQuery = 'CS_ChargeRewardQuery';
exports.pSCChargeRewardQuery = 'SC_ChargeRewardQuery';

exports.pCSChargeReward = 'CS_ChargeReward';
exports.pSCChargeReward = 'SC_ChargeReward';

exports.pCSOpenEndTime = 'CS_OpenEndTime';
exports.pSCOpenEndTime = 'SC_OpenEndTime';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 充值送礼请求 [CS]
 */
var CS_ChargeRewardQuery = (function(parent) {
    inherit(CS_ChargeRewardQuery, parent);
    function CS_ChargeRewardQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_ChargeRewardQuery;
})(protocolBase.IPacket);
exports.CS_ChargeRewardQuery = CS_ChargeRewardQuery;

/**
 * 充值送礼请求 [SC]
 */
var SC_ChargeRewardQuery = (function (parent) {
    inherit(SC_ChargeRewardQuery, parent);
    function SC_ChargeRewardQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.indexArr = []; /* 返回已领取的奖励对应的配表索引 */
        this.money = 0; /* 充值总金额 */
    }
    return SC_ChargeRewardQuery;
})(protocolBase.IPacket);
exports.SC_ChargeRewardQuery = SC_ChargeRewardQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 充值送礼领取 [CS]
 */
var CS_ChargeReward = (function(parent) {
    inherit(CS_ChargeReward, parent);
    function CS_ChargeReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.rmbNum = 0; /* 人民币金额数 */
    }
    return CS_ChargeReward;
})(protocolBase.IPacket);
exports.CS_ChargeReward = CS_ChargeReward;

/**
 * 充值送礼领取 [SC]
 */
var SC_ChargeReward = (function (parent) {
    inherit(SC_ChargeReward, parent);
    function SC_ChargeReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.awardArr = []; /* 奖励数组 */
    }
    return SC_ChargeReward;
})(protocolBase.IPacket);
exports.SC_ChargeReward = SC_ChargeReward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 活动相关时间 [CS]
 */
var CS_OpenEndTime = (function(parent) {
    inherit(CS_OpenEndTime, parent);
    function CS_OpenEndTime() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_OpenEndTime;
})(protocolBase.IPacket);
exports.CS_OpenEndTime = CS_OpenEndTime;

/**
 * 活动相关时间 [SC]
 */
var SC_OpenEndTime = (function (parent) {
    inherit(SC_OpenEndTime, parent);
    function SC_OpenEndTime() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rechargeTime = {}; /* 充值送礼活动时间 */
        this.cumulativeTime = {}; /* 累计消费活动时间 */
    }
    return SC_OpenEndTime;
})(protocolBase.IPacket);
exports.SC_OpenEndTime = SC_OpenEndTime;
/**-------------------------------------------------------------------------------------------------------------------*/

