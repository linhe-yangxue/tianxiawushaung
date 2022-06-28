
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

exports.pCSTreeOfGold = 'CS_TreeOfGold';
exports.pSCTreeOfGold = 'SC_TreeOfGold';

exports.pCSShakeTree = 'CS_ShakeTree';
exports.pSCShakeTree = 'SC_ShakeTree';

exports.pCSTreeExtraGold = 'CS_TreeExtraGold';
exports.pSCTreeExtraGold = 'SC_TreeExtraGold';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 摇钱树请求 [CS]
 */
var CS_TreeOfGold = (function(parent) {
    inherit(CS_TreeOfGold, parent);
    function CS_TreeOfGold() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_TreeOfGold;
})(protocolBase.IPacket);
exports.CS_TreeOfGold = CS_TreeOfGold;

/**
 * 摇钱树请求 [SC]
 */
var SC_TreeOfGold = (function (parent) {
    inherit(SC_TreeOfGold, parent);
    function SC_TreeOfGold() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.dayNum = 0; /* 今日摇钱次数 */
        this.allNum = 0; /* 总摇钱次数 */
        this.leftTime = 0; /* 距离下次摇钱时间 */
        this.extraGold = 0; /* 额外摇钱总和 */
    }
    return SC_TreeOfGold;
})(protocolBase.IPacket);
exports.SC_TreeOfGold = SC_TreeOfGold;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 摇一摇 [CS]
 */
var CS_ShakeTree = (function(parent) {
    inherit(CS_ShakeTree, parent);
    function CS_ShakeTree() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_ShakeTree;
})(protocolBase.IPacket);
exports.CS_ShakeTree = CS_ShakeTree;

/**
 * 摇一摇 [SC]
 */
var SC_ShakeTree = (function (parent) {
    inherit(SC_ShakeTree, parent);
    function SC_ShakeTree() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.goldNum = 0;
        this.extraGoldNum = 0; /* 额外金币总数 */
    }
    return SC_ShakeTree;
})(protocolBase.IPacket);
exports.SC_ShakeTree = SC_ShakeTree;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 摇钱树领取额外奖励 [CS]
 */
var CS_TreeExtraGold = (function(parent) {
    inherit(CS_TreeExtraGold, parent);
    function CS_TreeExtraGold() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_TreeExtraGold;
})(protocolBase.IPacket);
exports.CS_TreeExtraGold = CS_TreeExtraGold;

/**
 * 摇钱树领取额外奖励 [SC]
 */
var SC_TreeExtraGold = (function (parent) {
    inherit(SC_TreeExtraGold, parent);
    function SC_TreeExtraGold() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.extraGold = 0; /* 额外摇钱总和 */
    }
    return SC_TreeExtraGold;
})(protocolBase.IPacket);
exports.SC_TreeExtraGold = SC_TreeExtraGold;
/**-------------------------------------------------------------------------------------------------------------------*/

