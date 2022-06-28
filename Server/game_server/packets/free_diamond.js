
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

exports.pCSFreeDiamond = 'CS_FreeDiamond';
exports.pSCFreeDiamond = 'SC_FreeDiamond';

exports.pCStransformCard = 'CS_transformCard';
exports.pSCtransformCard = 'SC_transformCard';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 幸运翻牌请求 [CS]
 */
var CS_FreeDiamond = (function(parent) {
    inherit(CS_FreeDiamond, parent);
    function CS_FreeDiamond() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_FreeDiamond;
})(protocolBase.IPacket);
exports.CS_FreeDiamond = CS_FreeDiamond;

/**
 * 幸运翻牌请求 [SC]
 */
var SC_FreeDiamond = (function (parent) {
    inherit(SC_FreeDiamond, parent);
    function SC_FreeDiamond() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.residueNum = 0; /* 剩余翻牌次数 */
    }
    return SC_FreeDiamond;
})(protocolBase.IPacket);
exports.SC_FreeDiamond = SC_FreeDiamond;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开始翻牌 [CS]
 */
var CS_transformCard = (function(parent) {
    inherit(CS_transformCard, parent);
    function CS_transformCard() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_transformCard;
})(protocolBase.IPacket);
exports.CS_transformCard = CS_transformCard;

/**
 * 开始翻牌 [SC]
 */
var SC_transformCard = (function (parent) {
    inherit(SC_transformCard, parent);
    function SC_transformCard() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.diamondIndex = 0; /* 元宝编号 */
        this.residueNum = 0; /* 剩余翻牌次数 */
    }
    return SC_transformCard;
})(protocolBase.IPacket);
exports.SC_transformCard = SC_transformCard;
/**-------------------------------------------------------------------------------------------------------------------*/

