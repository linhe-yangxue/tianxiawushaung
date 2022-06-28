
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

exports.pCSCostEvent = 'CS_CostEvent';
exports.pSCCostEvent = 'SC_CostEvent';

exports.pCSreceivePrize = 'CS_receivePrize';
exports.pSCreceivePrize = 'SC_receivePrize';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 消费返利请求 [CS]
 */
var CS_CostEvent = (function(parent) {
    inherit(CS_CostEvent, parent);
    function CS_CostEvent() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_CostEvent;
})(protocolBase.IPacket);
exports.CS_CostEvent = CS_CostEvent;

/**
 * 消费返利请求 [SC]
 */
var SC_CostEvent = (function (parent) {
    inherit(SC_CostEvent, parent);
    function SC_CostEvent() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.costNums = 0; /* 消费元宝数 */
        this.prizeStatus = []; /* 领奖状态信息 */
        this.chargeAward = []; /* 返利内容 */
    }
    return SC_CostEvent;
})(protocolBase.IPacket);
exports.SC_CostEvent = SC_CostEvent;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取返利物品 [CS]
 */
var CS_receivePrize = (function(parent) {
    inherit(CS_receivePrize, parent);
    function CS_receivePrize() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.clickItemMoney = 0; /* 要领取福利的ID */
    }
    return CS_receivePrize;
})(protocolBase.IPacket);
exports.CS_receivePrize = CS_receivePrize;

/**
 * 领取返利物品 [SC]
 */
var SC_receivePrize = (function (parent) {
    inherit(SC_receivePrize, parent);
    function SC_receivePrize() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.prizeContent = []; /* 返利内容 */
    }
    return SC_receivePrize;
})(protocolBase.IPacket);
exports.SC_receivePrize = SC_receivePrize;
/**-------------------------------------------------------------------------------------------------------------------*/

