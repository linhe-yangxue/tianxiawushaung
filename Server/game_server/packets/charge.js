
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

exports.pCSGenerateOrder = 'CS_GenerateOrder';
exports.pSCGenerateOrder = 'SC_GenerateOrder';

exports.pCSChargeResult = 'CS_ChargeResult';
exports.pSCChargeResult = 'SC_ChargeResult';

exports.pCSChargeFirst = 'CS_ChargeFirst';
exports.pSCChargeFirst = 'SC_ChargeFirst';

exports.pCSChargeFeedBack = 'CS_ChargeFeedBack';
exports.pSCChargeFeedBack = 'SC_ChargeFeedBack';

exports.pCSChargePayOrder = 'CS_ChargePayOrder';
exports.pSCChargePayOrder = 'SC_ChargePayOrder';

exports.pCSChargeCancelOrder = 'CS_ChargeCancelOrder';
exports.pSCChargeCancelOrder = 'SC_ChargeCancelOrder';

exports.pCSChargeGetInfo = 'CS_ChargeGetInfo';
exports.pSCChargeGetInfo = 'SC_ChargeGetInfo';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 生成订单号  [CS]
 */
var CS_GenerateOrder = (function(parent) {
    inherit(CS_GenerateOrder, parent);
    function CS_GenerateOrder() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.shelfId = -1; /* 商品在配表中的id */
    }
    return CS_GenerateOrder;
})(protocolBase.IPacket);
exports.CS_GenerateOrder = CS_GenerateOrder;

/**
 * 生成订单号  [SC]
 */
var SC_GenerateOrder = (function (parent) {
    inherit(SC_GenerateOrder, parent);
    function SC_GenerateOrder() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.orderNum = -1; /* 订单号 */
        this.productId = ''; /* 商品Id */
    }
    return SC_GenerateOrder;
})(protocolBase.IPacket);
exports.SC_GenerateOrder = SC_GenerateOrder;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 充值结果会话 [CS]
 */
var CS_ChargeResult = (function(parent) {
    inherit(CS_ChargeResult, parent);
    function CS_ChargeResult() {
        parent.apply(this, arguments);
        this.code = -1; /* 错误码 */
        this.id = ''; /* 渠道用户ID */
        this.order = ''; /* 渠道订单号 */
        this.cporder = ''; /* 内部订单号 */
        this.info = ''; /* 额外信息 */
        this.amount = 0; /* 金额 */
        this.sign = ''; /* 签名 */
    }
    return CS_ChargeResult;
})(protocolBase.IPacket);
exports.CS_ChargeResult = CS_ChargeResult;

/**
 * 充值结果会话 [SC]
 */
var SC_ChargeResult = (function (parent) {
    inherit(SC_ChargeResult, parent);
    function SC_ChargeResult() {
        parent.apply(this, arguments);
        this.code = -1; /* 错误码 */
        this.msg = ''; /* 错误信息 */
    }
    return SC_ChargeResult;
})(protocolBase.IPacket);
exports.SC_ChargeResult = SC_ChargeResult;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每种金额首次充值记录 [CS]
 */
var CS_ChargeFirst = (function(parent) {
    inherit(CS_ChargeFirst, parent);
    function CS_ChargeFirst() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_ChargeFirst;
})(protocolBase.IPacket);
exports.CS_ChargeFirst = CS_ChargeFirst;

/**
 * 每种金额首次充值记录 [SC]
 */
var SC_ChargeFirst = (function (parent) {
    inherit(SC_ChargeFirst, parent);
    function SC_ChargeFirst() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.infoArr = []; /* 返回包含ChargeConfig配表中的索引数组 */
    }
    return SC_ChargeFirst;
})(protocolBase.IPacket);
exports.SC_ChargeFirst = SC_ChargeFirst;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 充值成功后返回相关数据 [CS]
 */
var CS_ChargeFeedBack = (function(parent) {
    inherit(CS_ChargeFeedBack, parent);
    function CS_ChargeFeedBack() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_ChargeFeedBack;
})(protocolBase.IPacket);
exports.CS_ChargeFeedBack = CS_ChargeFeedBack;

/**
 * 充值成功后返回相关数据 [SC]
 */
var SC_ChargeFeedBack = (function (parent) {
    inherit(SC_ChargeFeedBack, parent);
    function SC_ChargeFeedBack() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.diamond = 0; /* 元宝总数  */
        this.vipLevel = -1; /* vip等级 */
        this.vipExp = 0; /* vip经验 */
    }
    return SC_ChargeFeedBack;
})(protocolBase.IPacket);
exports.SC_ChargeFeedBack = SC_ChargeFeedBack;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 用户支付订单 [CS]
 */
var CS_ChargePayOrder = (function(parent) {
    inherit(CS_ChargePayOrder, parent);
    function CS_ChargePayOrder() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.cporder = ''; /* 内部订单号 */
    }
    return CS_ChargePayOrder;
})(protocolBase.IPacket);
exports.CS_ChargePayOrder = CS_ChargePayOrder;

/**
 * 用户支付订单 [SC]
 */
var SC_ChargePayOrder = (function (parent) {
    inherit(SC_ChargePayOrder, parent);
    function SC_ChargePayOrder() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ChargePayOrder;
})(protocolBase.IPacket);
exports.SC_ChargePayOrder = SC_ChargePayOrder;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 用户取消订单 [CS]
 */
var CS_ChargeCancelOrder = (function(parent) {
    inherit(CS_ChargeCancelOrder, parent);
    function CS_ChargeCancelOrder() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.cporder = ''; /* 内部订单号 */
    }
    return CS_ChargeCancelOrder;
})(protocolBase.IPacket);
exports.CS_ChargeCancelOrder = CS_ChargeCancelOrder;

/**
 * 用户取消订单 [SC]
 */
var SC_ChargeCancelOrder = (function (parent) {
    inherit(SC_ChargeCancelOrder, parent);
    function SC_ChargeCancelOrder() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ChargeCancelOrder;
})(protocolBase.IPacket);
exports.SC_ChargeCancelOrder = SC_ChargeCancelOrder;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取订单情况 [CS]
 */
var CS_ChargeGetInfo = (function(parent) {
    inherit(CS_ChargeGetInfo, parent);
    function CS_ChargeGetInfo() {
        parent.apply(this, arguments);
        this.code = -1; /* 错误码 */
        this.id = ''; /* 对应渠道的用户ID */
        this.order = ''; /* 渠道订单号 */
        this.cporder = ''; /* 内部订单号 */
        this.info = ''; /* 订单附加信息 */
        this.sign = ''; /* 签名 */
    }
    return CS_ChargeGetInfo;
})(protocolBase.IPacket);
exports.CS_ChargeGetInfo = CS_ChargeGetInfo;

/**
 * 获取订单情况 [SC]
 */
var SC_ChargeGetInfo = (function (parent) {
    inherit(SC_ChargeGetInfo, parent);
    function SC_ChargeGetInfo() {
        parent.apply(this, arguments);
        this.code = -1; /* 错误码 */
        this.msg = ''; /* 响应信息 */
        this.id = ''; /* 对应渠道的用户ID */
        this.order = ''; /* 渠道订单号 */
        this.cporder = ''; /* 内部订单号 */
        this.amount = ''; /* 订单金额 */
        this.createtime = ''; /* 订单创建时间 */
        this.Itemid = ''; /* 该笔订单的道具ID */
        this.itemquantity = -1; /* 道具数量 */
        this.status = -1; /* 订单状态 */
        this.info = ''; /* 其他信息 */
    }
    return SC_ChargeGetInfo;
})(protocolBase.IPacket);
exports.SC_ChargeGetInfo = SC_ChargeGetInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

