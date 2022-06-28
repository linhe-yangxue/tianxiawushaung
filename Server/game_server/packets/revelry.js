
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

exports.pCSGetRevelryList = 'CS_GetRevelryList';
exports.pSCGetRevelryList = 'SC_GetRevelryList';

exports.pCSTakeRevelryAward = 'CS_TakeRevelryAward';
exports.pSCTakeRevelryAward = 'SC_TakeRevelryAward';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获得开服狂欢列表 [CS]
 */
var CS_GetRevelryList = (function(parent) {
    inherit(CS_GetRevelryList, parent);
    function CS_GetRevelryList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_GetRevelryList;
})(protocolBase.IPacket);
exports.CS_GetRevelryList = CS_GetRevelryList;

/**
 * 获得开服狂欢列表 [SC]
 */
var SC_GetRevelryList = (function (parent) {
    inherit(SC_GetRevelryList, parent);
    function SC_GetRevelryList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.revelryArr = []; /* 狂欢内容列表 */
    }
    return SC_GetRevelryList;
})(protocolBase.IPacket);
exports.SC_GetRevelryList = SC_GetRevelryList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取开服狂欢奖励 [CS]
 */
var CS_TakeRevelryAward = (function(parent) {
    inherit(CS_TakeRevelryAward, parent);
    function CS_TakeRevelryAward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = -1; /* 角色ID */
        this.revelryId = -1; /* 狂欢Id */
    }
    return CS_TakeRevelryAward;
})(protocolBase.IPacket);
exports.CS_TakeRevelryAward = CS_TakeRevelryAward;

/**
 * 领取开服狂欢奖励 [SC]
 */
var SC_TakeRevelryAward = (function (parent) {
    inherit(SC_TakeRevelryAward, parent);
    function SC_TakeRevelryAward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.awards = []; /* 奖励物品 */
        this.revelryId = -1; /* 狂欢Id */
    }
    return SC_TakeRevelryAward;
})(protocolBase.IPacket);
exports.SC_TakeRevelryAward = SC_TakeRevelryAward;
/**-------------------------------------------------------------------------------------------------------------------*/

