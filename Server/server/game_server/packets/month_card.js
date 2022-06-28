
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

exports.pCSMonthCardReward = 'CS_MonthCardReward';
exports.pSCMonthCardReward = 'SC_MonthCardReward';

exports.pCSMonthCardQuery = 'CS_MonthCardQuery';
exports.pSCMonthCardQuery = 'SC_MonthCardQuery';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 月卡领取 [CS]
 */
var CS_MonthCardReward = (function(parent) {
    inherit(CS_MonthCardReward, parent);
    function CS_MonthCardReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.index = -1; /* 配表索引 */
    }
    return CS_MonthCardReward;
})(protocolBase.IPacket);
exports.CS_MonthCardReward = CS_MonthCardReward;

/**
 * 月卡领取 [SC]
 */
var SC_MonthCardReward = (function (parent) {
    inherit(SC_MonthCardReward, parent);
    function SC_MonthCardReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.diamond = 0; /* 元宝数量 */
    }
    return SC_MonthCardReward;
})(protocolBase.IPacket);
exports.SC_MonthCardReward = SC_MonthCardReward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 月卡请求 [CS]
 */
var CS_MonthCardQuery = (function(parent) {
    inherit(CS_MonthCardQuery, parent);
    function CS_MonthCardQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_MonthCardQuery;
})(protocolBase.IPacket);
exports.CS_MonthCardQuery = CS_MonthCardQuery;

/**
 * 月卡请求 [SC]
 */
var SC_MonthCardQuery = (function (parent) {
    inherit(SC_MonthCardQuery, parent);
    function SC_MonthCardQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.haveCheapCard = 0; /* 小月卡是否已买 */
        this.haveExpensiveCard = 0; /* 大月卡是否已买 */
        this.cheapLeft = 0; /* 小月卡剩余天数 */
        this.expensiveLeft = 0; /* 大月卡剩余天数 */
        this.cardArr = []; /* 配表索引数组表示是否已领取 */
    }
    return SC_MonthCardQuery;
})(protocolBase.IPacket);
exports.SC_MonthCardQuery = SC_MonthCardQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

