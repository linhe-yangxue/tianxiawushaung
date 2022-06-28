
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

exports.pCSRewardPower = 'CS_RewardPower';
exports.pSCRewardPower = 'SC_RewardPower';

exports.pCSPowerQuery = 'CS_PowerQuery';
exports.pSCPowerQuery = 'SC_PowerQuery';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领仙桃  [CS]
 */
var CS_RewardPower = (function(parent) {
    inherit(CS_RewardPower, parent);
    function CS_RewardPower() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_RewardPower;
})(protocolBase.IPacket);
exports.CS_RewardPower = CS_RewardPower;

/**
 * 领仙桃  [SC]
 */
var SC_RewardPower = (function (parent) {
    inherit(SC_RewardPower, parent);
    function SC_RewardPower() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_RewardPower;
})(protocolBase.IPacket);
exports.SC_RewardPower = SC_RewardPower;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领仙桃请求 [CS]
 */
var CS_PowerQuery = (function(parent) {
    inherit(CS_PowerQuery, parent);
    function CS_PowerQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_PowerQuery;
})(protocolBase.IPacket);
exports.CS_PowerQuery = CS_PowerQuery;

/**
 * 领仙桃请求 [SC]
 */
var SC_PowerQuery = (function (parent) {
    inherit(SC_PowerQuery, parent);
    function SC_PowerQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isPower_1 = 0;
        this.isPower_2 = 0;
    }
    return SC_PowerQuery;
})(protocolBase.IPacket);
exports.SC_PowerQuery = SC_PowerQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

