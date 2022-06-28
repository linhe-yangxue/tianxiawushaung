
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

exports.pCSAppLaunch = 'CS_AppLaunch';
exports.pSCAppLaunch = 'SC_AppLaunch';

exports.pCSAppLoadStep = 'CS_AppLoadStep';
exports.pSCAppLoadStep = 'SC_AppLoadStep';

exports.pCSAppUpdate = 'CS_AppUpdate';
exports.pSCAppUpdate = 'SC_AppUpdate';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * App首次启动 [CS]
 */
var CS_AppLaunch = (function(parent) {
    inherit(CS_AppLaunch, parent);
    function CS_AppLaunch() {
        parent.apply(this, arguments);
        this.deviceId = ''; /* 设备唯一ID(64字节) */
        this.channel = ''; /* 渠道名称(32字节) */
        this.ip = ''; /* 客户端IP */
        this.clientVersion = ''; /* 客户端版本 */
        this.systemSoftware = ''; /* 终端操作系统版本(32字节) */
        this.systemHardware = ''; /* 移动终端机型(32字节) */
        this.mac = ''; /* mac地址(32字节) */
    }
    return CS_AppLaunch;
})(protocolBase.IPacket);
exports.CS_AppLaunch = CS_AppLaunch;

/**
 * App首次启动 [SC]
 */
var SC_AppLaunch = (function (parent) {
    inherit(SC_AppLaunch, parent);
    function SC_AppLaunch() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_AppLaunch;
})(protocolBase.IPacket);
exports.SC_AppLaunch = SC_AppLaunch;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * App首次加载步骤 [CS]
 */
var CS_AppLoadStep = (function(parent) {
    inherit(CS_AppLoadStep, parent);
    function CS_AppLoadStep() {
        parent.apply(this, arguments);
        this.deviceId = ''; /* 设备唯一ID(64字节) */
        this.channel = ''; /* 渠道名称(32字节) */
        this.clientVersion = ''; /* 客户端版本 */
        this.systemSoftware = ''; /* 终端操作系统版本(32字节) */
        this.systemHardware = ''; /* 移动终端机型(32字节) */
        this.step = 0; /* 完成第1步加载记录10；完成第2步加载记录20；以此类推 */
        this.interval = 0; /* 从初始化到当前步骤的时间。单位秒 */
    }
    return CS_AppLoadStep;
})(protocolBase.IPacket);
exports.CS_AppLoadStep = CS_AppLoadStep;

/**
 * App首次加载步骤 [SC]
 */
var SC_AppLoadStep = (function (parent) {
    inherit(SC_AppLoadStep, parent);
    function SC_AppLoadStep() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_AppLoadStep;
})(protocolBase.IPacket);
exports.SC_AppLoadStep = SC_AppLoadStep;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * App热更新 [CS]
 */
var CS_AppUpdate = (function(parent) {
    inherit(CS_AppUpdate, parent);
    function CS_AppUpdate() {
        parent.apply(this, arguments);
        this.deviceId = ''; /* 设备唯一ID(64字节) */
        this.channel = ''; /* 渠道名称(32字节) */
        this.clientVersion = ''; /* 客户端版本 */
        this.systemSoftware = ''; /* 终端操作系统版本(32字节) */
        this.systemHardware = ''; /* 移动终端机型(32字节) */
        this.gameVersion1 = ''; /* 更新前版本号 */
        this.gameVersion2 = ''; /* 更新后版本号 */
        this.updateTime = 0; /* 更新过程所花的时间。单位秒 */
    }
    return CS_AppUpdate;
})(protocolBase.IPacket);
exports.CS_AppUpdate = CS_AppUpdate;

/**
 * App热更新 [SC]
 */
var SC_AppUpdate = (function (parent) {
    inherit(SC_AppUpdate, parent);
    function SC_AppUpdate() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_AppUpdate;
})(protocolBase.IPacket);
exports.SC_AppUpdate = SC_AppUpdate;
/**-------------------------------------------------------------------------------------------------------------------*/

