
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

exports.pCSRegister = 'CS_Register';
exports.pSCRegister = 'SC_Register';

exports.pCSLogin = 'CS_Login';
exports.pSCLogin = 'SC_Login';

exports.pCSZoneList = 'CS_ZoneList';
exports.pSCZoneList = 'SC_ZoneList';

exports.pCSGameServerLogin = 'CS_GameServerLogin';
exports.pSCGameServerLogin = 'SC_GameServerLogin';

exports.pCSHeartbeat = 'CS_Heartbeat';
exports.pSCHeartbeat = 'SC_Heartbeat';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 注册 [CS]
 */
var CS_Register = (function(parent) {
    inherit(CS_Register, parent);
    function CS_Register() {
        parent.apply(this, arguments);
        this.channel = ''; /* 渠道 */
        this.acc = ''; /* 账号 */
        this.pw = ''; /* 密码 */
        this.registtype = 0; /* 注册类型 */
        this.deviceId = ''; /* 设备ID */
        this.channelUserId = ''; /* 渠道用户编号/ID */
        this.systemSoftware = ''; /* 移动终端操作系统版本 */
        this.systemHardware = ''; /* 移动终端机型 */
        this.ip = ''; /* IP地址 */
        this.mac = ''; /* MAC地址 */
    }
    return CS_Register;
})(protocolBase.IPacket);
exports.CS_Register = CS_Register;

/**
 * 注册 [SC]
 */
var SC_Register = (function (parent) {
    inherit(SC_Register, parent);
    function SC_Register() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.registtype = 0; /* 注册类型 */
        this.regtoken = ''; /* 快速登录token */
        this.accExists = 0; /* 账号已存在 */
    }
    return SC_Register;
})(protocolBase.IPacket);
exports.SC_Register = SC_Register;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 账号登陆 [CS]
 */
var CS_Login = (function(parent) {
    inherit(CS_Login, parent);
    function CS_Login() {
        parent.apply(this, arguments);
        this.registtype = -1; /* 登陆方式 */
        this.regtoken = ''; /* 快速登录token */
        this.channel = ''; /* 渠道 */
        this.acc = ''; /* 账号 */
        this.pw = ''; /* 密码 */
        this.ip = '';
        this.mac = '';
    }
    return CS_Login;
})(protocolBase.IPacket);
exports.CS_Login = CS_Login;

/**
 * 账号登陆 [SC]
 */
var SC_Login = (function (parent) {
    inherit(SC_Login, parent);
    function SC_Login() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.uid = ''; /* 用户ID */
        this.tk = ''; /* login token */
        this.accNotExists = 0; /* 账号不存在 */
        this.wrongPw = 0; /* 密码错误 */
    }
    return SC_Login;
})(protocolBase.IPacket);
exports.SC_Login = SC_Login;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 区列表 [CS]
 */
var CS_ZoneList = (function(parent) {
    inherit(CS_ZoneList, parent);
    function CS_ZoneList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 登陆token */
        this.mac = ''; /* mac地址 */
    }
    return CS_ZoneList;
})(protocolBase.IPacket);
exports.CS_ZoneList = CS_ZoneList;

/**
 * 区列表 [SC]
 */
var SC_ZoneList = (function (parent) {
    inherit(SC_ZoneList, parent);
    function SC_ZoneList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.zoneInfos = []; /* 区信息列表 */
    }
    return SC_ZoneList;
})(protocolBase.IPacket);
exports.SC_ZoneList = SC_ZoneList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 游戏登陆 [CS]
 */
var CS_GameServerLogin = (function(parent) {
    inherit(CS_GameServerLogin, parent);
    function CS_GameServerLogin() {
        parent.apply(this, arguments);
        this.zid = 0; /* 区Id */
        this.zuid = 0; /* 用户Id、因为客户端原因此处也是zuid用户Id */
        this.tk = ''; /* 登陆token */
        this.mac = ''; /* mac地址 */
        this.deviceId = ''; /* 设备ID */
        this.clientVersion = ''; /* 客户端版本 */
        this.systemSoftware = ''; /* 移动终端操作系统版本 */
        this.systemHardware = ''; /* 移动终端机型 */
        this.ip = ''; /* IP地址 */
        this.channel = ''; /* 渠道 */
        this.isWifi = 0; /* 是否是wifi(1是0不是) */
    }
    return CS_GameServerLogin;
})(protocolBase.IPacket);
exports.CS_GameServerLogin = CS_GameServerLogin;

/**
 * 游戏登陆 [SC]
 */
var SC_GameServerLogin = (function (parent) {
    inherit(SC_GameServerLogin, parent);
    function SC_GameServerLogin() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.gtk = ''; /* game token */
        this.isSeal = 0; /* 是否封号 */
        this.openDate = ''; /* 开服时间 */
        this.zid = 0; /* 区Id */
        this.zuid = ''; /* 角色Id */
    }
    return SC_GameServerLogin;
})(protocolBase.IPacket);
exports.SC_GameServerLogin = SC_GameServerLogin;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 心跳 [CS]
 */
var CS_Heartbeat = (function(parent) {
    inherit(CS_Heartbeat, parent);
    function CS_Heartbeat() {
        parent.apply(this, arguments);
        this.tk = ''; /* 游戏token */
        this.zid = -1; /* 区Id */
        this.zuid = ''; /* 角色Id */
        this.channel = ''; /* 渠道 */
    }
    return CS_Heartbeat;
})(protocolBase.IPacket);
exports.CS_Heartbeat = CS_Heartbeat;

/**
 * 心跳 [SC]
 */
var SC_Heartbeat = (function (parent) {
    inherit(SC_Heartbeat, parent);
    function SC_Heartbeat() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_Heartbeat;
})(protocolBase.IPacket);
exports.SC_Heartbeat = SC_Heartbeat;
/**-------------------------------------------------------------------------------------------------------------------*/

