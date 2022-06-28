
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

exports.pCSGetSingleRechargeInfo = 'CS_GetSingleRechargeInfo';
exports.pSCGetSingleRechargeInfo = 'SC_GetSingleRechargeInfo';

exports.pCSRevSingleRechargeReward = 'CS_RevSingleRechargeReward';
exports.pSCRevSingleRechargeReward = 'SC_RevSingleRechargeReward';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取单冲信息 [CS]
 */
var CS_GetSingleRechargeInfo = (function(parent) {
    inherit(CS_GetSingleRechargeInfo, parent);
    function CS_GetSingleRechargeInfo() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区id */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetSingleRechargeInfo;
})(protocolBase.IPacket);
exports.CS_GetSingleRechargeInfo = CS_GetSingleRechargeInfo;

/**
 * 获取单冲信息 [SC]
 */
var SC_GetSingleRechargeInfo = (function (parent) {
    inherit(SC_GetSingleRechargeInfo, parent);
    function SC_GetSingleRechargeInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.beginTime = 0; /* 开始时间 */
        this.endTime = 0; /* 结束时间 */
        this.singleRecharges = []; /* 充值情况数组 */
    }
    return SC_GetSingleRechargeInfo;
})(protocolBase.IPacket);
exports.SC_GetSingleRechargeInfo = SC_GetSingleRechargeInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取单冲奖励 [CS]
 */
var CS_RevSingleRechargeReward = (function(parent) {
    inherit(CS_RevSingleRechargeReward, parent);
    function CS_RevSingleRechargeReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区id */
        this.zuid = ''; /* 角色Id */
        this.index = 0; /* 单冲表格序号 */
    }
    return CS_RevSingleRechargeReward;
})(protocolBase.IPacket);
exports.CS_RevSingleRechargeReward = CS_RevSingleRechargeReward;

/**
 * 领取单冲奖励 [SC]
 */
var SC_RevSingleRechargeReward = (function (parent) {
    inherit(SC_RevSingleRechargeReward, parent);
    function SC_RevSingleRechargeReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rewards = []; /* 物品数组  */
    }
    return SC_RevSingleRechargeReward;
})(protocolBase.IPacket);
exports.SC_RevSingleRechargeReward = SC_RevSingleRechargeReward;
/**-------------------------------------------------------------------------------------------------------------------*/

