
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

exports.pCSGM = 'CS_GM';
exports.pSCGM = 'SC_GM';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * GM通用外层结构 [CS]
 */
var CS_GM = (function(parent) {
    inherit(CS_GM, parent);
    function CS_GM() {
        parent.apply(this, arguments);
        this.cmd = ''; /* 接口标识 */
        this.operatorid = 0; /* 操作人编号 */
        this.sign = ''; /* 签名 */
        this.type = ''; /* req的格式 */
        this.req = ''; /* 向游戏服发送的请求 */
    }
    return CS_GM;
})(protocolBase.IPacket);
exports.CS_GM = CS_GM;

/**
 * GM通用外层结构 [SC]
 */
var SC_GM = (function (parent) {
    inherit(SC_GM, parent);
    function SC_GM() {
        parent.apply(this, arguments);
        this.code = -1; /* 状态码 */
        this.msg = ''; /* 返回的请求响应描述信息 */
        this.type = ''; /* res的格式 */
        this.res = {}; /* 游戏服返回的请求响应 */
    }
    return SC_GM;
})(protocolBase.IPacket);
exports.SC_GM = SC_GM;
/**-------------------------------------------------------------------------------------------------------------------*/

