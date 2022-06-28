
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

exports.pCSLoginRewardQuery = 'CS_LoginRewardQuery';
exports.pSCLoginRewardQuery = 'SC_LoginRewardQuery';

exports.pCSLoginReward = 'CS_LoginReward';
exports.pSCLoginReward = 'SC_LoginReward';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 登录送礼请求 [CS]
 */
var CS_LoginRewardQuery = (function(parent) {
    inherit(CS_LoginRewardQuery, parent);
    function CS_LoginRewardQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_LoginRewardQuery;
})(protocolBase.IPacket);
exports.CS_LoginRewardQuery = CS_LoginRewardQuery;

/**
 * 登录送礼请求 [SC]
 */
var SC_LoginRewardQuery = (function (parent) {
    inherit(SC_LoginRewardQuery, parent);
    function SC_LoginRewardQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.dayArr = [];
    }
    return SC_LoginRewardQuery;
})(protocolBase.IPacket);
exports.SC_LoginRewardQuery = SC_LoginRewardQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 登录送礼领取 [CS]
 */
var CS_LoginReward = (function(parent) {
    inherit(CS_LoginReward, parent);
    function CS_LoginReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.day = 0; /* 开服第几天 */
    }
    return CS_LoginReward;
})(protocolBase.IPacket);
exports.CS_LoginReward = CS_LoginReward;

/**
 * 登录送礼领取 [SC]
 */
var SC_LoginReward = (function (parent) {
    inherit(SC_LoginReward, parent);
    function SC_LoginReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.loginReward = []; /* 登录奖励数组 */
    }
    return SC_LoginReward;
})(protocolBase.IPacket);
exports.SC_LoginReward = SC_LoginReward;
/**-------------------------------------------------------------------------------------------------------------------*/

