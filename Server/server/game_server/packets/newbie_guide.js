
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

exports.pCSSaveGuideProgress = 'CS_SaveGuideProgress';
exports.pSCSaveGuideProgress = 'SC_SaveGuideProgress';

exports.pCSQueryGuideProgress = 'CS_QueryGuideProgress';
exports.pSCQueryGuideProgress = 'SC_QueryGuideProgress';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 保存新手引导 [CS]
 */
var CS_SaveGuideProgress = (function(parent) {
    inherit(CS_SaveGuideProgress, parent);
    function CS_SaveGuideProgress() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.guideProgress = 0; /* 新手引导进度 */
        this.guideIndex = 0; /* 每个引导中的步骤id */
        this.deviceId = ''; /* 设备Id */
        this.clientVersion = ''; /* 客户端版本 */
        this.systemSoftware = ''; /* 移动终端操作系统版本 */
        this.systemHardware = ''; /* 移动终端机型 */
        this.name = ''; /* 新手引导名字 */
    }
    return CS_SaveGuideProgress;
})(protocolBase.IPacket);
exports.CS_SaveGuideProgress = CS_SaveGuideProgress;

/**
 * 保存新手引导 [SC]
 */
var SC_SaveGuideProgress = (function (parent) {
    inherit(SC_SaveGuideProgress, parent);
    function SC_SaveGuideProgress() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_SaveGuideProgress;
})(protocolBase.IPacket);
exports.SC_SaveGuideProgress = SC_SaveGuideProgress;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 请求新手引导 [CS]
 */
var CS_QueryGuideProgress = (function(parent) {
    inherit(CS_QueryGuideProgress, parent);
    function CS_QueryGuideProgress() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_QueryGuideProgress;
})(protocolBase.IPacket);
exports.CS_QueryGuideProgress = CS_QueryGuideProgress;

/**
 * 请求新手引导 [SC]
 */
var SC_QueryGuideProgress = (function (parent) {
    inherit(SC_QueryGuideProgress, parent);
    function SC_QueryGuideProgress() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.resGuideProgress = 0; /* 新手引导进度 */
    }
    return SC_QueryGuideProgress;
})(protocolBase.IPacket);
exports.SC_QueryGuideProgress = SC_QueryGuideProgress;
/**-------------------------------------------------------------------------------------------------------------------*/

