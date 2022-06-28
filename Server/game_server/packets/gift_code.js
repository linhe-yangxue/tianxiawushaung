
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

exports.pCSGiftCode = 'CS_GiftCode';
exports.pSCGiftCode = 'SC_GiftCode';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 礼品码兑换 [CS]
 */
var CS_GiftCode = (function(parent) {
    inherit(CS_GiftCode, parent);
    function CS_GiftCode() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.giftCode = ''; /* 礼品码 */
    }
    return CS_GiftCode;
})(protocolBase.IPacket);
exports.CS_GiftCode = CS_GiftCode;

/**
 * 礼品码兑换 [SC]
 */
var SC_GiftCode = (function (parent) {
    inherit(SC_GiftCode, parent);
    function SC_GiftCode() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.exchangeItem = []; /* 兑换礼品数组 */
        this.errorIndex = -1; /* 状态码 */
    }
    return SC_GiftCode;
})(protocolBase.IPacket);
exports.SC_GiftCode = SC_GiftCode;
/**-------------------------------------------------------------------------------------------------------------------*/

