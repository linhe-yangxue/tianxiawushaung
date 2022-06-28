
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

exports.pCSVIPDailyInfo = 'CS_VIPDailyInfo';
exports.pSCVIPDailyInfo = 'SC_VIPDailyInfo';

exports.pCSVIPWeeklyInfo = 'CS_VIPWeeklyInfo';
exports.pSCVIPWeeklyInfo = 'SC_VIPWeeklyInfo';

exports.pCSVIPDaily = 'CS_VIPDaily';
exports.pSCVIPDaily = 'SC_VIPDaily';

exports.pCSVIPWeek = 'CS_VIPWeek';
exports.pSCVIPWeek = 'SC_VIPWeek';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP每日礼包信息 [CS]
 */
var CS_VIPDailyInfo = (function(parent) {
    inherit(CS_VIPDailyInfo, parent);
    function CS_VIPDailyInfo() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_VIPDailyInfo;
})(protocolBase.IPacket);
exports.CS_VIPDailyInfo = CS_VIPDailyInfo;

/**
 * VIP每日礼包信息 [SC]
 */
var SC_VIPDailyInfo = (function (parent) {
    inherit(SC_VIPDailyInfo, parent);
    function SC_VIPDailyInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.dailyWelfare = {}; /* 每日福利领取信息 */
    }
    return SC_VIPDailyInfo;
})(protocolBase.IPacket);
exports.SC_VIPDailyInfo = SC_VIPDailyInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * VIP周礼包信息 [CS]
 */
var CS_VIPWeeklyInfo = (function(parent) {
    inherit(CS_VIPWeeklyInfo, parent);
    function CS_VIPWeeklyInfo() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_VIPWeeklyInfo;
})(protocolBase.IPacket);
exports.CS_VIPWeeklyInfo = CS_VIPWeeklyInfo;

/**
 * VIP周礼包信息 [SC]
 */
var SC_VIPWeeklyInfo = (function (parent) {
    inherit(SC_VIPWeeklyInfo, parent);
    function SC_VIPWeeklyInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.weekWelfare = []; /* 每周福利领取信息 */
    }
    return SC_VIPWeeklyInfo;
})(protocolBase.IPacket);
exports.SC_VIPWeeklyInfo = SC_VIPWeeklyInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取VIP每日礼包 [CS]
 */
var CS_VIPDaily = (function(parent) {
    inherit(CS_VIPDaily, parent);
    function CS_VIPDaily() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.vipLevel = 0; /* VIP等级 */
    }
    return CS_VIPDaily;
})(protocolBase.IPacket);
exports.CS_VIPDaily = CS_VIPDaily;

/**
 * 领取VIP每日礼包 [SC]
 */
var SC_VIPDaily = (function (parent) {
    inherit(SC_VIPDaily, parent);
    function SC_VIPDaily() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rewards = []; /* 每日领取的福利 */
    }
    return SC_VIPDaily;
})(protocolBase.IPacket);
exports.SC_VIPDaily = SC_VIPDaily;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取VIP每周福利 [CS]
 */
var CS_VIPWeek = (function(parent) {
    inherit(CS_VIPWeek, parent);
    function CS_VIPWeek() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.index = 0; /* 礼包索引 */
    }
    return CS_VIPWeek;
})(protocolBase.IPacket);
exports.CS_VIPWeek = CS_VIPWeek;

/**
 * 领取VIP每周福利 [SC]
 */
var SC_VIPWeek = (function (parent) {
    inherit(SC_VIPWeek, parent);
    function SC_VIPWeek() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rewards = []; /* 每周购买的福利 */
    }
    return SC_VIPWeek;
})(protocolBase.IPacket);
exports.SC_VIPWeek = SC_VIPWeek;
/**-------------------------------------------------------------------------------------------------------------------*/

