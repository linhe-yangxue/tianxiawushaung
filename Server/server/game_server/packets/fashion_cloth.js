
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

exports.pCSFashionCloth = 'CS_FashionCloth';
exports.pSCFashionCloth = 'SC_FashionCloth';

exports.pCSClothStrength = 'CS_ClothStrength';
exports.pSCClothStrength = 'SC_ClothStrength';

exports.pCSClothRecoin = 'CS_ClothRecoin';
exports.pSCClothRecoin = 'SC_ClothRecoin';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 时装请求 [CS]
 */
var CS_FashionCloth = (function(parent) {
    inherit(CS_FashionCloth, parent);
    function CS_FashionCloth() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.uid = ''; /* 用户ID */
        this.clothID = -1; /* 时装ID */
    }
    return CS_FashionCloth;
})(protocolBase.IPacket);
exports.CS_FashionCloth = CS_FashionCloth;

/**
 * 时装请求 [SC]
 */
var SC_FashionCloth = (function (parent) {
    inherit(SC_FashionCloth, parent);
    function SC_FashionCloth() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.clothLevel = 0; /* 时装强化等级 */
    }
    return SC_FashionCloth;
})(protocolBase.IPacket);
exports.SC_FashionCloth = SC_FashionCloth;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 时装强化 [CS]
 */
var CS_ClothStrength = (function(parent) {
    inherit(CS_ClothStrength, parent);
    function CS_ClothStrength() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.uid = ''; /* 用户ID */
        this.clothID = -1; /* 时装ID */
        this.consume = {}; /* 消耗的时装精华对象 */
    }
    return CS_ClothStrength;
})(protocolBase.IPacket);
exports.CS_ClothStrength = CS_ClothStrength;

/**
 * 时装强化 [SC]
 */
var SC_ClothStrength = (function (parent) {
    inherit(SC_ClothStrength, parent);
    function SC_ClothStrength() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ClothStrength;
})(protocolBase.IPacket);
exports.SC_ClothStrength = SC_ClothStrength;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 时装重铸 [CS]
 */
var CS_ClothRecoin = (function(parent) {
    inherit(CS_ClothRecoin, parent);
    function CS_ClothRecoin() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.uid = ''; /* 用户ID */
        this.clothID = -1; /* 时装ID */
    }
    return CS_ClothRecoin;
})(protocolBase.IPacket);
exports.CS_ClothRecoin = CS_ClothRecoin;

/**
 * 时装重铸 [SC]
 */
var SC_ClothRecoin = (function (parent) {
    inherit(SC_ClothRecoin, parent);
    function SC_ClothRecoin() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.restitution = []; /* 返还的东西 */
    }
    return SC_ClothRecoin;
})(protocolBase.IPacket);
exports.SC_ClothRecoin = SC_ClothRecoin;
/**-------------------------------------------------------------------------------------------------------------------*/

