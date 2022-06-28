
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

exports.pCSGuildBossInfo = 'CS_GuildBossInfo';
exports.pSCGuildBossInfo = 'SC_GuildBossInfo';

exports.pCSGuildBossBattleStart = 'CS_GuildBossBattleStart';
exports.pSCGuildBossBattleStart = 'SC_GuildBossBattleStart';

exports.pCSGuildBossBattleEnd = 'CS_GuildBossBattleEnd';
exports.pSCGuildBossBattleEnd = 'SC_GuildBossBattleEnd';

exports.pCSGuildBossGetReward = 'CS_GuildBossGetReward';
exports.pSCGuildBossGetReward = 'SC_GuildBossGetReward';

exports.pCSGuildBossInit = 'CS_GuildBossInit';
exports.pSCGuildBossInit = 'SC_GuildBossInit';

exports.pCSGuildBossBuyBattleTimes = 'CS_GuildBossBuyBattleTimes';
exports.pSCGuildBossBuyBattleTimes = 'SC_GuildBossBuyBattleTimes';

exports.pCSGuildBossInfoSimple = 'CS_GuildBossInfoSimple';
exports.pSCGuildBossInfoSimple = 'SC_GuildBossInfoSimple';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS请求  [CS]
 */
var CS_GuildBossInfo = (function(parent) {
    inherit(CS_GuildBossInfo, parent);
    function CS_GuildBossInfo() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_GuildBossInfo;
})(protocolBase.IPacket);
exports.CS_GuildBossInfo = CS_GuildBossInfo;

/**
 * 公会BOSS请求  [SC]
 */
var SC_GuildBossInfo = (function (parent) {
    inherit(SC_GuildBossInfo, parent);
    function SC_GuildBossInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildBoss = {}; /* 公会BOSS信息 */
        this.guildId = -1; /* 公会ID */
    }
    return SC_GuildBossInfo;
})(protocolBase.IPacket);
exports.SC_GuildBossInfo = SC_GuildBossInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS战斗开始 [CS]
 */
var CS_GuildBossBattleStart = (function(parent) {
    inherit(CS_GuildBossBattleStart, parent);
    function CS_GuildBossBattleStart() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_GuildBossBattleStart;
})(protocolBase.IPacket);
exports.CS_GuildBossBattleStart = CS_GuildBossBattleStart;

/**
 * 公会BOSS战斗开始 [SC]
 */
var SC_GuildBossBattleStart = (function (parent) {
    inherit(SC_GuildBossBattleStart, parent);
    function SC_GuildBossBattleStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = -1; /* 公会ID */
    }
    return SC_GuildBossBattleStart;
})(protocolBase.IPacket);
exports.SC_GuildBossBattleStart = SC_GuildBossBattleStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS战斗结束 [CS]
 */
var CS_GuildBossBattleEnd = (function(parent) {
    inherit(CS_GuildBossBattleEnd, parent);
    function CS_GuildBossBattleEnd() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.damage = -1; /* 对公会BOSS造成的伤害 */
    }
    return CS_GuildBossBattleEnd;
})(protocolBase.IPacket);
exports.CS_GuildBossBattleEnd = CS_GuildBossBattleEnd;

/**
 * 公会BOSS战斗结束 [SC]
 */
var SC_GuildBossBattleEnd = (function (parent) {
    inherit(SC_GuildBossBattleEnd, parent);
    function SC_GuildBossBattleEnd() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildBoss = {}; /* 公会BOSS信息 */
        this.attr = []; /* 掉落队列 ItemObject */
    }
    return SC_GuildBossBattleEnd;
})(protocolBase.IPacket);
exports.SC_GuildBossBattleEnd = SC_GuildBossBattleEnd;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS领取奖励  [CS]
 */
var CS_GuildBossGetReward = (function(parent) {
    inherit(CS_GuildBossGetReward, parent);
    function CS_GuildBossGetReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_GuildBossGetReward;
})(protocolBase.IPacket);
exports.CS_GuildBossGetReward = CS_GuildBossGetReward;

/**
 * 公会BOSS领取奖励  [SC]
 */
var SC_GuildBossGetReward = (function (parent) {
    inherit(SC_GuildBossGetReward, parent);
    function SC_GuildBossGetReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.attr = []; /* 掉落队列 ItemObject */
        this.guildId = -1; /* 公会ID */
    }
    return SC_GuildBossGetReward;
})(protocolBase.IPacket);
exports.SC_GuildBossGetReward = SC_GuildBossGetReward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS初始化 [CS]
 */
var CS_GuildBossInit = (function(parent) {
    inherit(CS_GuildBossInit, parent);
    function CS_GuildBossInit() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.mid = -1; /* 公会BOSS的ID */
    }
    return CS_GuildBossInit;
})(protocolBase.IPacket);
exports.CS_GuildBossInit = CS_GuildBossInit;

/**
 * 公会BOSS初始化 [SC]
 */
var SC_GuildBossInit = (function (parent) {
    inherit(SC_GuildBossInit, parent);
    function SC_GuildBossInit() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = -1; /* 公会ID */
    }
    return SC_GuildBossInit;
})(protocolBase.IPacket);
exports.SC_GuildBossInit = SC_GuildBossInit;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会BOSS购买挑战次数 [CS]
 */
var CS_GuildBossBuyBattleTimes = (function(parent) {
    inherit(CS_GuildBossBuyBattleTimes, parent);
    function CS_GuildBossBuyBattleTimes() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.times = -1; /* 公会BOSS购买战斗次数 */
    }
    return CS_GuildBossBuyBattleTimes;
})(protocolBase.IPacket);
exports.CS_GuildBossBuyBattleTimes = CS_GuildBossBuyBattleTimes;

/**
 * 公会BOSS购买挑战次数 [SC]
 */
var SC_GuildBossBuyBattleTimes = (function (parent) {
    inherit(SC_GuildBossBuyBattleTimes, parent);
    function SC_GuildBossBuyBattleTimes() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = -1; /* 公会ID */
    }
    return SC_GuildBossBuyBattleTimes;
})(protocolBase.IPacket);
exports.SC_GuildBossBuyBattleTimes = SC_GuildBossBuyBattleTimes;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取指定的公会BOSS基础信息 [CS]
 */
var CS_GuildBossInfoSimple = (function(parent) {
    inherit(CS_GuildBossInfoSimple, parent);
    function CS_GuildBossInfoSimple() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_GuildBossInfoSimple;
})(protocolBase.IPacket);
exports.CS_GuildBossInfoSimple = CS_GuildBossInfoSimple;

/**
 * 获取指定的公会BOSS基础信息 [SC]
 */
var SC_GuildBossInfoSimple = (function (parent) {
    inherit(SC_GuildBossInfoSimple, parent);
    function SC_GuildBossInfoSimple() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildBossSimple = {}; /* GuildBoss的精简信息，不包括战斗人员信息 */
        this.guildBossWarrior = {}; /* 本人公会BOSS战斗记录信息 */
        this.guildId = -1; /* 公会ID */
    }
    return SC_GuildBossInfoSimple;
})(protocolBase.IPacket);
exports.SC_GuildBossInfoSimple = SC_GuildBossInfoSimple;
/**-------------------------------------------------------------------------------------------------------------------*/

