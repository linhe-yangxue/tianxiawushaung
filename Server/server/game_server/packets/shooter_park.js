
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

exports.pCSShooterQuery = 'CS_ShooterQuery';
exports.pSCShooterQuery = 'SC_ShooterQuery';

exports.pCSShooterPark = 'CS_ShooterPark';
exports.pSCShooterPark = 'SC_ShooterPark';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 进入射手乐园  [CS]
 */
var CS_ShooterQuery = (function(parent) {
    inherit(CS_ShooterQuery, parent);
    function CS_ShooterQuery() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_ShooterQuery;
})(protocolBase.IPacket);
exports.CS_ShooterQuery = CS_ShooterQuery;

/**
 * 进入射手乐园  [SC]
 */
var SC_ShooterQuery = (function (parent) {
    inherit(SC_ShooterQuery, parent);
    function SC_ShooterQuery() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.addDiamond = 0; /* 累计元宝 */
        this.usingTimes = 0; /* 已射击次数 */
    }
    return SC_ShooterQuery;
})(protocolBase.IPacket);
exports.SC_ShooterQuery = SC_ShooterQuery;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 射击 [CS]
 */
var CS_ShooterPark = (function(parent) {
    inherit(CS_ShooterPark, parent);
    function CS_ShooterPark() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_ShooterPark;
})(protocolBase.IPacket);
exports.CS_ShooterPark = CS_ShooterPark;

/**
 * 射击 [SC]
 */
var SC_ShooterPark = (function (parent) {
    inherit(SC_ShooterPark, parent);
    function SC_ShooterPark() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.earnRatio = 0; /* 获得的奖励 */
    }
    return SC_ShooterPark;
})(protocolBase.IPacket);
exports.SC_ShooterPark = SC_ShooterPark;
/**-------------------------------------------------------------------------------------------------------------------*/

