
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

exports.pCSPointStarMap = 'CS_PointStarMap';
exports.pSCPointStarMap = 'SC_PointStarMap';

exports.pCSPointLightenClick = 'CS_PointLightenClick';
exports.pSCPointLightenClick = 'SC_PointLightenClick';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取点星界面的功能 [CS]
 */
var CS_PointStarMap = (function(parent) {
    inherit(CS_PointStarMap, parent);
    function CS_PointStarMap() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.uid = -1; /* 用户ID */
    }
    return CS_PointStarMap;
})(protocolBase.IPacket);
exports.CS_PointStarMap = CS_PointStarMap;

/**
 * 获取点星界面的功能 [SC]
 */
var SC_PointStarMap = (function (parent) {
    inherit(SC_PointStarMap, parent);
    function SC_PointStarMap() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.currentIndex   = 1; /* 当前的索引 */
    }
    return SC_PointStarMap;
})(protocolBase.IPacket);
exports.SC_PointStarMap = SC_PointStarMap;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 点击点亮按钮 [CS]
 */
var CS_PointLightenClick = (function(parent) {
    inherit(CS_PointLightenClick, parent);
    function CS_PointLightenClick() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.uid = -1; /* 用户ID */
        this.itemArr = []; /* 物品队列 ItemObject */
    }
    return CS_PointLightenClick;
})(protocolBase.IPacket);
exports.CS_PointLightenClick = CS_PointLightenClick;

/**
 * 点击点亮按钮 [SC]
 */
var SC_PointLightenClick = (function (parent) {
    inherit(SC_PointLightenClick, parent);
    function SC_PointLightenClick() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.currentIndex = 1; /* 当前的索引 */
        this.successPointStart = 0; /* 是否成功点亮星星 */
        this.arr = []; /* 掉落队列 ItemObject */
    }
    return SC_PointLightenClick;
})(protocolBase.IPacket);
exports.SC_PointLightenClick = SC_PointLightenClick;
/**-------------------------------------------------------------------------------------------------------------------*/

