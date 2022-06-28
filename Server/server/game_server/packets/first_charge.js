
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

exports.pCSFirstChargeQuery = 'CS_FirstChargeQuery';
exports.pSCFirstChargeQuery = 'SC_FirstChargeQuery';

exports.pCSFirstChargeReward = 'CS_FirstChargeReward';
exports.pSCFirstChargeReward = 'SC_FirstChargeReward';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 首冲请求  [CS]
 */
var CS_FirstChargeQuery = (function(parent) {
    inherit(CS_FirstChargeQuery, parent);
    function CS_FirstChargeQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_FirstChargeQuery;
})(protocolBase.IPacket);
exports.CS_FirstChargeQuery = CS_FirstChargeQuery;

/**
 * 首冲请求  [SC]
 */
var SC_FirstChargeQuery = (function (parent) {
    inherit(SC_FirstChargeQuery, parent);
    function SC_FirstChargeQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.code = 0; /* 首充领取状态 */
    }
    return SC_FirstChargeQuery;
})(protocolBase.IPacket);
exports.SC_FirstChargeQuery = SC_FirstChargeQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 首冲送礼 [CS]
 */
var CS_FirstChargeReward = (function(parent) {
    inherit(CS_FirstChargeReward, parent);
    function CS_FirstChargeReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_FirstChargeReward;
})(protocolBase.IPacket);
exports.CS_FirstChargeReward = CS_FirstChargeReward;

/**
 * 首冲送礼 [SC]
 */
var SC_FirstChargeReward = (function (parent) {
    inherit(SC_FirstChargeReward, parent);
    function SC_FirstChargeReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rewards = []; /* 奖励数组 */
    }
    return SC_FirstChargeReward;
})(protocolBase.IPacket);
exports.SC_FirstChargeReward = SC_FirstChargeReward;
/**-------------------------------------------------------------------------------------------------------------------*/

