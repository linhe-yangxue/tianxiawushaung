
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

exports.pCSDailySignQuery = 'CS_DailySignQuery';
exports.pSCDailySignQuery = 'SC_DailySignQuery';

exports.pCSDailySign = 'CS_DailySign';
exports.pSCDailySign = 'SC_DailySign';

exports.pCSLuxurySignQuery = 'CS_LuxurySignQuery';
exports.pSCLuxurySignQuery = 'SC_LuxurySignQuery';

exports.pCSLuxurySign = 'CS_LuxurySign';
exports.pSCLuxurySign = 'SC_LuxurySign';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日签到请求  [CS]
 */
var CS_DailySignQuery = (function(parent) {
    inherit(CS_DailySignQuery, parent);
    function CS_DailySignQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_DailySignQuery;
})(protocolBase.IPacket);
exports.CS_DailySignQuery = CS_DailySignQuery;

/**
 * 每日签到请求  [SC]
 */
var SC_DailySignQuery = (function (parent) {
    inherit(SC_DailySignQuery, parent);
    function SC_DailySignQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.signNum = 1;
        this.isSign = 0;
    }
    return SC_DailySignQuery;
})(protocolBase.IPacket);
exports.SC_DailySignQuery = SC_DailySignQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日签到领取 [CS]
 */
var CS_DailySign = (function(parent) {
    inherit(CS_DailySign, parent);
    function CS_DailySign() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_DailySign;
})(protocolBase.IPacket);
exports.CS_DailySign = CS_DailySign;

/**
 * 每日签到领取 [SC]
 */
var SC_DailySign = (function (parent) {
    inherit(SC_DailySign, parent);
    function SC_DailySign() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isSignSuccess = 0;
        this.item = [];
    }
    return SC_DailySign;
})(protocolBase.IPacket);
exports.SC_DailySign = SC_DailySign;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 豪华签到请求  [CS]
 */
var CS_LuxurySignQuery = (function(parent) {
    inherit(CS_LuxurySignQuery, parent);
    function CS_LuxurySignQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_LuxurySignQuery;
})(protocolBase.IPacket);
exports.CS_LuxurySignQuery = CS_LuxurySignQuery;

/**
 * 豪华签到请求  [SC]
 */
var SC_LuxurySignQuery = (function (parent) {
    inherit(SC_LuxurySignQuery, parent);
    function SC_LuxurySignQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isSign = 0;
        this.isRecharge = 0;
    }
    return SC_LuxurySignQuery;
})(protocolBase.IPacket);
exports.SC_LuxurySignQuery = SC_LuxurySignQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 豪华签到领取 [CS]
 */
var CS_LuxurySign = (function(parent) {
    inherit(CS_LuxurySign, parent);
    function CS_LuxurySign() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_LuxurySign;
})(protocolBase.IPacket);
exports.CS_LuxurySign = CS_LuxurySign;

/**
 * 豪华签到领取 [SC]
 */
var SC_LuxurySign = (function (parent) {
    inherit(SC_LuxurySign, parent);
    function SC_LuxurySign() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isSignSuccess = 0;
        this.item = [];
    }
    return SC_LuxurySign;
})(protocolBase.IPacket);
exports.SC_LuxurySign = SC_LuxurySign;
/**-------------------------------------------------------------------------------------------------------------------*/

