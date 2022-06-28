
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

exports.pCSGetZoneState = 'CS_GetZoneState';
exports.pSCGetZoneState = 'SC_GetZoneState';

exports.pCSPageZoneList = 'CS_PageZoneList';
exports.pSCPageZoneList = 'SC_PageZoneList';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 更新某个区的状态 [CS]
 */
var CS_GetZoneState = (function(parent) {
    inherit(CS_GetZoneState, parent);
    function CS_GetZoneState() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区id */
    }
    return CS_GetZoneState;
})(protocolBase.IPacket);
exports.CS_GetZoneState = CS_GetZoneState;

/**
 * 更新某个区的状态 [SC]
 */
var SC_GetZoneState = (function (parent) {
    inherit(SC_GetZoneState, parent);
    function SC_GetZoneState() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.state = 1; /* 状态 */
    }
    return SC_GetZoneState;
})(protocolBase.IPacket);
exports.SC_GetZoneState = SC_GetZoneState;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 分页获取区列表 [CS]
 */
var CS_PageZoneList = (function(parent) {
    inherit(CS_PageZoneList, parent);
    function CS_PageZoneList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.mac = ''; /* mac地址 */
        this.page = 0; /* 页数 */
        this.cnt = 0; /* 每页区数 */
    }
    return CS_PageZoneList;
})(protocolBase.IPacket);
exports.CS_PageZoneList = CS_PageZoneList;

/**
 * 分页获取区列表 [SC]
 */
var SC_PageZoneList = (function (parent) {
    inherit(SC_PageZoneList, parent);
    function SC_PageZoneList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.zoneInfos = []; /* 区信息列表 */
    }
    return SC_PageZoneList;
})(protocolBase.IPacket);
exports.SC_PageZoneList = SC_PageZoneList;
/**-------------------------------------------------------------------------------------------------------------------*/

