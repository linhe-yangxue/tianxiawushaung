
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

exports.pCSGetNotification = 'CS_GetNotification';
exports.pSCGetNotification = 'SC_GetNotification';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 玩家信息变化通知 [CS]
 */
var CS_GetNotification = (function(parent) {
    inherit(CS_GetNotification, parent);
    function CS_GetNotification() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetNotification;
})(protocolBase.IPacket);
exports.CS_GetNotification = CS_GetNotification;

/**
 * 玩家信息变化通知 [SC]
 */
var SC_GetNotification = (function (parent) {
    inherit(SC_GetNotification, parent);
    function SC_GetNotification() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = [];
        this.chatNo = []; /* 聊天序号 */
        this.gold = 0; /* 银币 */
        this.diamond = 0; /* 元宝 */
        this.stamina = 0; /* 体力 */
        this.spirit = 0; /* 精力 */
        this.beatDemonCard = 0; /* 降魔令 */
        this.staminaStamp = 0; /* 体力恢复开始时间 */
        this.spiritStamp = 0; /* 精力恢复开始时间 */
        this.beatDemonCardStamp = 0; /* 降魔令开始恢复时间 */
        this.power = 0; /* 战斗力 */
        this.vipLevel = 0; /* vip等级 */
        this.vipExp = 0; /* vip经验值 */
        this.money = 0; /* 玩家充值的金额 */
        this.wallPaper = {}; /* 玩家走马灯 */
    }
    return SC_GetNotification;
})(protocolBase.IPacket);
exports.SC_GetNotification = SC_GetNotification;
/**-------------------------------------------------------------------------------------------------------------------*/

