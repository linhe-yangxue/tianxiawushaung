
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

exports.pCSFragmentCompose = 'CS_FragmentCompose';
exports.pSCFragmentCompose = 'SC_FragmentCompose';

exports.pCSSale = 'CS_Sale';
exports.pSCSale = 'SC_Sale';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 碎片合成 [CS]
 */
var CS_FragmentCompose = (function(parent) {
    inherit(CS_FragmentCompose, parent);
    function CS_FragmentCompose() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.fragment = {}; /* 碎片对象 */
    }
    return CS_FragmentCompose;
})(protocolBase.IPacket);
exports.CS_FragmentCompose = CS_FragmentCompose;

/**
 * 碎片合成 [SC]
 */
var SC_FragmentCompose = (function (parent) {
    inherit(SC_FragmentCompose, parent);
    function SC_FragmentCompose() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.item = {}; /* 合成的道具 */
    }
    return SC_FragmentCompose;
})(protocolBase.IPacket);
exports.SC_FragmentCompose = SC_FragmentCompose;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 物品出售 [CS]
 */
var CS_Sale = (function(parent) {
    inherit(CS_Sale, parent);
    function CS_Sale() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.itemArr = []; /* 出售对象数组 */
    }
    return CS_Sale;
})(protocolBase.IPacket);
exports.CS_Sale = CS_Sale;

/**
 * 物品出售 [SC]
 */
var SC_Sale = (function (parent) {
    inherit(SC_Sale, parent);
    function SC_Sale() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.reward = {}; /* 出售获得回报 */
    }
    return SC_Sale;
})(protocolBase.IPacket);
exports.SC_Sale = SC_Sale;
/**-------------------------------------------------------------------------------------------------------------------*/

