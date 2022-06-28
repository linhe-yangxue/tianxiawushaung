
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

exports.pCSGetDamageAndMerit = 'CS_GetDamageAndMerit';
exports.pSCGetDamageAndMerit = 'SC_GetDamageAndMerit';

exports.pCSGetDemonBossList = 'CS_GetDemonBossList';
exports.pSCGetDemonBossList = 'SC_GetDemonBossList';

exports.pCSDemonBossStart = 'CS_DemonBossStart';
exports.pSCDemonBossStart = 'SC_DemonBossStart';

exports.pCSDemonBossResult = 'CS_DemonBossResult';
exports.pSCDemonBossResult = 'SC_DemonBossResult';

exports.pCSBossBattleDamageRanklist = 'CS_BossBattleDamageRanklist';
exports.pSCBossBattleDamageRanklist = 'SC_BossBattleDamageRanklist';

exports.pCSBossBattleFeatsRanklist = 'CS_BossBattleFeatsRanklist';
exports.pSCBossBattleFeatsRanklist = 'SC_BossBattleFeatsRanklist';

exports.pCSReceiveMeritAward = 'CS_ReceiveMeritAward';
exports.pSCReceiveMeritAward = 'SC_ReceiveMeritAward';

exports.pCSGetMeritAwardList = 'CS_GetMeritAwardList';
exports.pSCGetMeritAwardList = 'SC_GetMeritAwardList';

exports.pCSChangeDemonBossShareState = 'CS_ChangeDemonBossShareState';
exports.pSCChangeDemonBossShareState = 'SC_ChangeDemonBossShareState';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取伤害输出和功勋 [CS]
 */
var CS_GetDamageAndMerit = (function(parent) {
    inherit(CS_GetDamageAndMerit, parent);
    function CS_GetDamageAndMerit() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetDamageAndMerit;
})(protocolBase.IPacket);
exports.CS_GetDamageAndMerit = CS_GetDamageAndMerit;

/**
 * 获取伤害输出和功勋 [SC]
 */
var SC_GetDamageAndMerit = (function (parent) {
    inherit(SC_GetDamageAndMerit, parent);
    function SC_GetDamageAndMerit() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.damageOutput = 0; /* 伤害输出 */
        this.merit = 0; /* 功勋 */
        this.selfDamageRank = -1; /* 伤害排名 */
        this.selfMeritRank = -1; /* 功勋排行 */
    }
    return SC_GetDamageAndMerit;
})(protocolBase.IPacket);
exports.SC_GetDamageAndMerit = SC_GetDamageAndMerit;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取天魔列表 [CS]
 */
var CS_GetDemonBossList = (function(parent) {
    inherit(CS_GetDemonBossList, parent);
    function CS_GetDemonBossList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetDemonBossList;
})(protocolBase.IPacket);
exports.CS_GetDemonBossList = CS_GetDemonBossList;

/**
 * 获取天魔列表 [SC]
 */
var SC_GetDemonBossList = (function (parent) {
    inherit(SC_GetDemonBossList, parent);
    function SC_GetDemonBossList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.arr = []; /* 天魔对象数组 */
    }
    return SC_GetDemonBossList;
})(protocolBase.IPacket);
exports.SC_GetDemonBossList = SC_GetDemonBossList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 进入天魔副本 [CS]
 */
var CS_DemonBossStart = (function(parent) {
    inherit(CS_DemonBossStart, parent);
    function CS_DemonBossStart() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.finderId = ''; /* 发现者Id */
        this.buttonIndex = 0; /* 活动序号 */
        this.eventIndex = 0; /* 活动序号 */
    }
    return CS_DemonBossStart;
})(protocolBase.IPacket);
exports.CS_DemonBossStart = CS_DemonBossStart;

/**
 * 进入天魔副本 [SC]
 */
var SC_DemonBossStart = (function (parent) {
    inherit(SC_DemonBossStart, parent);
    function SC_DemonBossStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.bossDead = 0; /* 天魔已死 */
        this.quality = -1; /* 天魔品质 */
        this.hpLeft = -1; /* 天魔剩余血量 */
        this.duration = -1; /* 战斗持续时间 */
    }
    return SC_DemonBossStart;
})(protocolBase.IPacket);
exports.SC_DemonBossStart = SC_DemonBossStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 退出天魔副本 [CS]
 */
var CS_DemonBossResult = (function(parent) {
    inherit(CS_DemonBossResult, parent);
    function CS_DemonBossResult() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_DemonBossResult;
})(protocolBase.IPacket);
exports.CS_DemonBossResult = CS_DemonBossResult;

/**
 * 退出天魔副本 [SC]
 */
var SC_DemonBossResult = (function (parent) {
    inherit(SC_DemonBossResult, parent);
    function SC_DemonBossResult() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.battleAchv = 0; /* 战功 */
        this.merit = 0; /* 功勋 */
        this.finderTid = 0; /* 发现者tid */
    }
    return SC_DemonBossResult;
})(protocolBase.IPacket);
exports.SC_DemonBossResult = SC_DemonBossResult;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取伤害排行 [CS]
 */
var CS_BossBattleDamageRanklist = (function(parent) {
    inherit(CS_BossBattleDamageRanklist, parent);
    function CS_BossBattleDamageRanklist() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_BossBattleDamageRanklist;
})(protocolBase.IPacket);
exports.CS_BossBattleDamageRanklist = CS_BossBattleDamageRanklist;

/**
 * 获取伤害排行 [SC]
 */
var SC_BossBattleDamageRanklist = (function (parent) {
    inherit(SC_BossBattleDamageRanklist, parent);
    function SC_BossBattleDamageRanklist() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.myRanking = -1; /* 自己排名 */
        this.ranklist = []; /* 伤害排行榜 */
    }
    return SC_BossBattleDamageRanklist;
})(protocolBase.IPacket);
exports.SC_BossBattleDamageRanklist = SC_BossBattleDamageRanklist;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取功勋排行 [CS]
 */
var CS_BossBattleFeatsRanklist = (function(parent) {
    inherit(CS_BossBattleFeatsRanklist, parent);
    function CS_BossBattleFeatsRanklist() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_BossBattleFeatsRanklist;
})(protocolBase.IPacket);
exports.CS_BossBattleFeatsRanklist = CS_BossBattleFeatsRanklist;

/**
 * 获取功勋排行 [SC]
 */
var SC_BossBattleFeatsRanklist = (function (parent) {
    inherit(SC_BossBattleFeatsRanklist, parent);
    function SC_BossBattleFeatsRanklist() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.myRanking = -1; /* 自己排名 */
        this.ranklist = []; /* 功勋排行榜 */
    }
    return SC_BossBattleFeatsRanklist;
})(protocolBase.IPacket);
exports.SC_BossBattleFeatsRanklist = SC_BossBattleFeatsRanklist;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取功勋奖励 [CS]
 */
var CS_ReceiveMeritAward = (function(parent) {
    inherit(CS_ReceiveMeritAward, parent);
    function CS_ReceiveMeritAward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.awardIndex = 0; /* 奖励序号 */
    }
    return CS_ReceiveMeritAward;
})(protocolBase.IPacket);
exports.CS_ReceiveMeritAward = CS_ReceiveMeritAward;

/**
 * 领取功勋奖励 [SC]
 */
var SC_ReceiveMeritAward = (function (parent) {
    inherit(SC_ReceiveMeritAward, parent);
    function SC_ReceiveMeritAward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.featAddArr = []; /* 奖励数组 */
    }
    return SC_ReceiveMeritAward;
})(protocolBase.IPacket);
exports.SC_ReceiveMeritAward = SC_ReceiveMeritAward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取功勋奖励记录 [CS]
 */
var CS_GetMeritAwardList = (function(parent) {
    inherit(CS_GetMeritAwardList, parent);
    function CS_GetMeritAwardList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetMeritAwardList;
})(protocolBase.IPacket);
exports.CS_GetMeritAwardList = CS_GetMeritAwardList;

/**
 * 领取功勋奖励记录 [SC]
 */
var SC_GetMeritAwardList = (function (parent) {
    inherit(SC_GetMeritAwardList, parent);
    function SC_GetMeritAwardList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.arr = []; /* 已领取的奖励序号 */
    }
    return SC_GetMeritAwardList;
})(protocolBase.IPacket);
exports.SC_GetMeritAwardList = SC_GetMeritAwardList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 改变天魔BOSS分享状态 [CS]
 */
var CS_ChangeDemonBossShareState = (function(parent) {
    inherit(CS_ChangeDemonBossShareState, parent);
    function CS_ChangeDemonBossShareState() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色Id */
        this.state = -1; /* 天魔BOSS分享状态 */
    }
    return CS_ChangeDemonBossShareState;
})(protocolBase.IPacket);
exports.CS_ChangeDemonBossShareState = CS_ChangeDemonBossShareState;

/**
 * 改变天魔BOSS分享状态 [SC]
 */
var SC_ChangeDemonBossShareState = (function (parent) {
    inherit(SC_ChangeDemonBossShareState, parent);
    function SC_ChangeDemonBossShareState() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
    }
    return SC_ChangeDemonBossShareState;
})(protocolBase.IPacket);
exports.SC_ChangeDemonBossShareState = SC_ChangeDemonBossShareState;
/**-------------------------------------------------------------------------------------------------------------------*/

