
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

exports.pCSSevenDayLoginQuery = 'CS_SevenDayLoginQuery';
exports.pSCSevenDayLoginQuery = 'SC_SevenDayLoginQuery';

exports.pCSSevenDayLoginReward = 'CS_SevenDayLoginReward';
exports.pSCSevenDayLoginReward = 'SC_SevenDayLoginReward';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 七日登录送礼请求 [CS]
 */
var CS_SevenDayLoginQuery = (function(parent) {
    inherit(CS_SevenDayLoginQuery, parent);
    function CS_SevenDayLoginQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_SevenDayLoginQuery;
})(protocolBase.IPacket);
exports.CS_SevenDayLoginQuery = CS_SevenDayLoginQuery;

/**
 * 七日登录送礼请求 [SC]
 */
var SC_SevenDayLoginQuery = (function (parent) {
    inherit(SC_SevenDayLoginQuery, parent);
    function SC_SevenDayLoginQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.indexArr = []; /* 已领取奖励对应的配表中的索引 */
        this.loginDay = 0; /* 已登录天数 */
    }
    return SC_SevenDayLoginQuery;
})(protocolBase.IPacket);
exports.SC_SevenDayLoginQuery = SC_SevenDayLoginQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 七日登录送礼领取 [CS]
 */
var CS_SevenDayLoginReward = (function(parent) {
    inherit(CS_SevenDayLoginReward, parent);
    function CS_SevenDayLoginReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.index = 0; /* 登录天数 */
    }
    return CS_SevenDayLoginReward;
})(protocolBase.IPacket);
exports.CS_SevenDayLoginReward = CS_SevenDayLoginReward;

/**
 * 七日登录送礼领取 [SC]
 */
var SC_SevenDayLoginReward = (function (parent) {
    inherit(SC_SevenDayLoginReward, parent);
    function SC_SevenDayLoginReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.items = []; /* 登录奖励数组 */
    }
    return SC_SevenDayLoginReward;
})(protocolBase.IPacket);
exports.SC_SevenDayLoginReward = SC_SevenDayLoginReward;
/**-------------------------------------------------------------------------------------------------------------------*/

