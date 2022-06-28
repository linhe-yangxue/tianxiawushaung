
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

exports.pCSSDKLogin = 'CS_SDKLogin';
exports.pSCSDKLogin = 'SC_SDKLogin';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * SDK登录  [CS]
 */
var CS_SDKLogin = (function(parent) {
    inherit(CS_SDKLogin, parent);
    function CS_SDKLogin() {
        parent.apply(this, arguments);
        this.token = ''; /* 网络令牌 */
        this.id = 0; /* 渠道用户id */
        this.data = '';
        this.channelId = 0; /* 渠道ID */
        this.deviceId = ''; /* 设备ID */
        this.channel = ''; /* 渠道名称 */
        this.systemSoftware = ''; /* 移动终端操作系统版本 */
        this.systemHardware = ''; /* 移动终端机型 */
        this.ip = ''; /* IP地址 */
        this.mac = ''; /* MAC地址 */
    }
    return CS_SDKLogin;
})(protocolBase.IPacket);
exports.CS_SDKLogin = CS_SDKLogin;

/**
 * SDK登录  [SC]
 */
var SC_SDKLogin = (function (parent) {
    inherit(SC_SDKLogin, parent);
    function SC_SDKLogin() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.uid = '';
        this.token = '';
        this.sdkErr = 0;
        this.channelUid = -1; /* 渠道用户id */
        this.channelToken = ''; /* 渠道令牌 */
    }
    return SC_SDKLogin;
})(protocolBase.IPacket);
exports.SC_SDKLogin = SC_SDKLogin;
/**-------------------------------------------------------------------------------------------------------------------*/

