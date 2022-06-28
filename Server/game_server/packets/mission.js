
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

exports.pCSGetDailyTaskData = 'CS_GetDailyTaskData';
exports.pSCGetDailyTaskData = 'SC_GetDailyTaskData';

exports.pCSGetAchievementData = 'CS_GetAchievementData';
exports.pSCGetAchievementData = 'SC_GetAchievementData';

exports.pCSGetDailyTaskAward = 'CS_GetDailyTaskAward';
exports.pSCGetDailyTaskAward = 'SC_GetDailyTaskAward';

exports.pCSGetAchievementAward = 'CS_GetAchievementAward';
exports.pSCGetAchievementAward = 'SC_GetAchievementAward';

exports.pCSGetTaskScoreAward = 'CS_GetTaskScoreAward';
exports.pSCGetTaskScoreAward = 'SC_GetTaskScoreAward';

exports.pCSGetBattleTask = 'CS_GetBattleTask';
exports.pSCGetBattleTask = 'SC_GetBattleTask';

exports.pCSGetBattleTaskAward = 'CS_GetBattleTaskAward';
exports.pSCGetBattleTaskAward = 'SC_GetBattleTaskAward';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获得日常任务信息 [CS]
 */
var CS_GetDailyTaskData = (function(parent) {
    inherit(CS_GetDailyTaskData, parent);
    function CS_GetDailyTaskData() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetDailyTaskData;
})(protocolBase.IPacket);
exports.CS_GetDailyTaskData = CS_GetDailyTaskData;

/**
 * 获得日常任务信息 [SC]
 */
var SC_GetDailyTaskData = (function (parent) {
    inherit(SC_GetDailyTaskData, parent);
    function SC_GetDailyTaskData() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.curScore = 0; /* 当前积分 */
        this.scoreAwards = []; /* 已经领取的索引 */
        this.arr = []; /* 日常任务信息对象组 */
    }
    return SC_GetDailyTaskData;
})(protocolBase.IPacket);
exports.SC_GetDailyTaskData = SC_GetDailyTaskData;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获得成就任务信息 [CS]
 */
var CS_GetAchievementData = (function(parent) {
    inherit(CS_GetAchievementData, parent);
    function CS_GetAchievementData() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetAchievementData;
})(protocolBase.IPacket);
exports.CS_GetAchievementData = CS_GetAchievementData;

/**
 * 获得成就任务信息 [SC]
 */
var SC_GetAchievementData = (function (parent) {
    inherit(SC_GetAchievementData, parent);
    function SC_GetAchievementData() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 成就任务信息对象组 */
    }
    return SC_GetAchievementData;
})(protocolBase.IPacket);
exports.SC_GetAchievementData = SC_GetAchievementData;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取日常任务奖励 [CS]
 */
var CS_GetDailyTaskAward = (function(parent) {
    inherit(CS_GetDailyTaskAward, parent);
    function CS_GetDailyTaskAward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.taskId = -1; /* 任务id */
    }
    return CS_GetDailyTaskAward;
})(protocolBase.IPacket);
exports.CS_GetDailyTaskAward = CS_GetDailyTaskAward;

/**
 * 领取日常任务奖励 [SC]
 */
var SC_GetDailyTaskAward = (function (parent) {
    inherit(SC_GetDailyTaskAward, parent);
    function SC_GetDailyTaskAward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 掉落队列 ItemObject */
    }
    return SC_GetDailyTaskAward;
})(protocolBase.IPacket);
exports.SC_GetDailyTaskAward = SC_GetDailyTaskAward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取成就任务奖励 [CS]
 */
var CS_GetAchievementAward = (function(parent) {
    inherit(CS_GetAchievementAward, parent);
    function CS_GetAchievementAward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.taskId = -1; /* 任务id */
    }
    return CS_GetAchievementAward;
})(protocolBase.IPacket);
exports.CS_GetAchievementAward = CS_GetAchievementAward;

/**
 * 领取成就任务奖励 [SC]
 */
var SC_GetAchievementAward = (function (parent) {
    inherit(SC_GetAchievementAward, parent);
    function SC_GetAchievementAward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 掉落队列 ItemObject */
    }
    return SC_GetAchievementAward;
})(protocolBase.IPacket);
exports.SC_GetAchievementAward = SC_GetAchievementAward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取积分宝箱奖励 [CS]
 */
var CS_GetTaskScoreAward = (function(parent) {
    inherit(CS_GetTaskScoreAward, parent);
    function CS_GetTaskScoreAward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.awardId = -1; /* 积分宝箱id */
    }
    return CS_GetTaskScoreAward;
})(protocolBase.IPacket);
exports.CS_GetTaskScoreAward = CS_GetTaskScoreAward;

/**
 * 领取积分宝箱奖励 [SC]
 */
var SC_GetTaskScoreAward = (function (parent) {
    inherit(SC_GetTaskScoreAward, parent);
    function SC_GetTaskScoreAward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 掉落队列 ItemObject */
    }
    return SC_GetTaskScoreAward;
})(protocolBase.IPacket);
exports.SC_GetTaskScoreAward = SC_GetTaskScoreAward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取主线任务信息 [CS]
 */
var CS_GetBattleTask = (function(parent) {
    inherit(CS_GetBattleTask, parent);
    function CS_GetBattleTask() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetBattleTask;
})(protocolBase.IPacket);
exports.CS_GetBattleTask = CS_GetBattleTask;

/**
 * 获取主线任务信息 [SC]
 */
var SC_GetBattleTask = (function (parent) {
    inherit(SC_GetBattleTask, parent);
    function SC_GetBattleTask() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.taskArr = []; /* 当前任务列表 */
    }
    return SC_GetBattleTask;
})(protocolBase.IPacket);
exports.SC_GetBattleTask = SC_GetBattleTask;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取主线任务奖励 [CS]
 */
var CS_GetBattleTaskAward = (function(parent) {
    inherit(CS_GetBattleTaskAward, parent);
    function CS_GetBattleTaskAward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.taskId = -1; /* 任务Id */
    }
    return CS_GetBattleTaskAward;
})(protocolBase.IPacket);
exports.CS_GetBattleTaskAward = CS_GetBattleTaskAward;

/**
 * 领取主线任务奖励 [SC]
 */
var SC_GetBattleTaskAward = (function (parent) {
    inherit(SC_GetBattleTaskAward, parent);
    function SC_GetBattleTaskAward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.nextTask = {}; /* 下一个任务 */
        this.awards = []; /* 奖励物品列表 */
    }
    return SC_GetBattleTaskAward;
})(protocolBase.IPacket);
exports.SC_GetBattleTaskAward = SC_GetBattleTaskAward;
/**-------------------------------------------------------------------------------------------------------------------*/

