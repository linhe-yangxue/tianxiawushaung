
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

exports.pCSGetRollPlaying = 'CS_GetRollPlaying';
exports.pSCGetRollPlaying = 'SC_GetRollPlaying';

exports.pCSGetAnnounce = 'CS_GetAnnounce';
exports.pSCGetAnnounce = 'SC_GetAnnounce';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 请求走马灯 [CS]
 */
var CS_GetRollPlaying = (function(parent) {
    inherit(CS_GetRollPlaying, parent);
    function CS_GetRollPlaying() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetRollPlaying;
})(protocolBase.IPacket);
exports.CS_GetRollPlaying = CS_GetRollPlaying;

/**
 * 请求走马灯 [SC]
 */
var SC_GetRollPlaying = (function (parent) {
    inherit(SC_GetRollPlaying, parent);
    function SC_GetRollPlaying() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 走马灯信息 */
    }
    return SC_GetRollPlaying;
})(protocolBase.IPacket);
exports.SC_GetRollPlaying = SC_GetRollPlaying;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 请求公告 [CS]
 */
var CS_GetAnnounce = (function(parent) {
    inherit(CS_GetAnnounce, parent);
    function CS_GetAnnounce() {
        parent.apply(this, arguments);
        this.channelId = 0; /* 渠道id */
    }
    return CS_GetAnnounce;
})(protocolBase.IPacket);
exports.CS_GetAnnounce = CS_GetAnnounce;

/**
 * 请求公告 [SC]
 */
var SC_GetAnnounce = (function (parent) {
    inherit(SC_GetAnnounce, parent);
    function SC_GetAnnounce() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 公告信息 */
    }
    return SC_GetAnnounce;
})(protocolBase.IPacket);
exports.SC_GetAnnounce = SC_GetAnnounce;
/**-------------------------------------------------------------------------------------------------------------------*/

