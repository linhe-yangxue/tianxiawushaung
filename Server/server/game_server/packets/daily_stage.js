
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

exports.pCSDailyStageInfo = 'CS_DailyStageInfo';
exports.pSCDailyStageInfo = 'SC_DailyStageInfo';

exports.pCSDailyStageBattleStart = 'CS_DailyStageBattleStart';
exports.pSCDailyStageBattleStart = 'SC_DailyStageBattleStart';

exports.pCSDailyStageBattleEnd = 'CS_DailyStageBattleEnd';
exports.pSCDailyStageBattleEnd = 'SC_DailyStageBattleEnd';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日副本信息 [CS]
 */
var CS_DailyStageInfo = (function(parent) {
    inherit(CS_DailyStageInfo, parent);
    function CS_DailyStageInfo() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_DailyStageInfo;
})(protocolBase.IPacket);
exports.CS_DailyStageInfo = CS_DailyStageInfo;

/**
 * 每日副本信息 [SC]
 */
var SC_DailyStageInfo = (function (parent) {
    inherit(SC_DailyStageInfo, parent);
    function SC_DailyStageInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.dailyStage = []; /* 每日副本信息 */
    }
    return SC_DailyStageInfo;
})(protocolBase.IPacket);
exports.SC_DailyStageInfo = SC_DailyStageInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日副本战斗开始 [CS]
 */
var CS_DailyStageBattleStart = (function(parent) {
    inherit(CS_DailyStageBattleStart, parent);
    function CS_DailyStageBattleStart() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.mid = -1; /* 每日副本的index */
    }
    return CS_DailyStageBattleStart;
})(protocolBase.IPacket);
exports.CS_DailyStageBattleStart = CS_DailyStageBattleStart;

/**
 * 每日副本战斗开始 [SC]
 */
var SC_DailyStageBattleStart = (function (parent) {
    inherit(SC_DailyStageBattleStart, parent);
    function SC_DailyStageBattleStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_DailyStageBattleStart;
})(protocolBase.IPacket);
exports.SC_DailyStageBattleStart = SC_DailyStageBattleStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每日副本战斗结束 [CS]
 */
var CS_DailyStageBattleEnd = (function(parent) {
    inherit(CS_DailyStageBattleEnd, parent);
    function CS_DailyStageBattleEnd() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.mid = -1; /* 每日副本的index */
    }
    return CS_DailyStageBattleEnd;
})(protocolBase.IPacket);
exports.CS_DailyStageBattleEnd = CS_DailyStageBattleEnd;

/**
 * 每日副本战斗结束 [SC]
 */
var SC_DailyStageBattleEnd = (function (parent) {
    inherit(SC_DailyStageBattleEnd, parent);
    function SC_DailyStageBattleEnd() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.attr = []; /* 掉落队列 ItemObject */
    }
    return SC_DailyStageBattleEnd;
})(protocolBase.IPacket);
exports.SC_DailyStageBattleEnd = SC_DailyStageBattleEnd;
/**-------------------------------------------------------------------------------------------------------------------*/

