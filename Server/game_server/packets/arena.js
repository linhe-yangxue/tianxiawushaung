
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

exports.pCSArenaPrincipal = 'CS_ArenaPrincipal';
exports.pSCArenaPrincipal = 'SC_ArenaPrincipal';

exports.pCSArenaChallengeList = 'CS_ArenaChallengeList';
exports.pSCArenaChallengeList = 'SC_ArenaChallengeList';

exports.pCSArenaBattleStart = 'CS_ArenaBattleStart';
exports.pSCArenaBattleStart = 'SC_ArenaBattleStart';

exports.pCSArenaBattleEnd = 'CS_ArenaBattleEnd';
exports.pSCArenaBattleEnd = 'SC_ArenaBattleEnd';

exports.pCSArenaRankList = 'CS_ArenaRankList';
exports.pSCArenaRankList = 'SC_ArenaRankList';

exports.pCSArenaBattleRecord = 'CS_ArenaBattleRecord';
exports.pSCArenaBattleRecord = 'SC_ArenaBattleRecord';

exports.pCSArenaSweep = 'CS_ArenaSweep';
exports.pSCArenaSweep = 'SC_ArenaSweep';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 个人竞技场信息 [CS]
 */
var CS_ArenaPrincipal = (function(parent) {
    inherit(CS_ArenaPrincipal, parent);
    function CS_ArenaPrincipal() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid  = 0; /* 区ID  */
        this.zuid  = ''; /* 用户ID */
    }
    return CS_ArenaPrincipal;
})(protocolBase.IPacket);
exports.CS_ArenaPrincipal = CS_ArenaPrincipal;

/**
 * 个人竞技场信息 [SC]
 */
var SC_ArenaPrincipal = (function (parent) {
    inherit(SC_ArenaPrincipal, parent);
    function SC_ArenaPrincipal() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arenaPrincipal = {}; /* 个人竞技场信息 */
    }
    return SC_ArenaPrincipal;
})(protocolBase.IPacket);
exports.SC_ArenaPrincipal = SC_ArenaPrincipal;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 竞技场挑战玩家列表 [CS]
 */
var CS_ArenaChallengeList = (function(parent) {
    inherit(CS_ArenaChallengeList, parent);
    function CS_ArenaChallengeList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid  = 0; /* 区ID  */
        this.zuid  = ''; /* 用户ID */
    }
    return CS_ArenaChallengeList;
})(protocolBase.IPacket);
exports.CS_ArenaChallengeList = CS_ArenaChallengeList;

/**
 * 竞技场挑战玩家列表 [SC]
 */
var SC_ArenaChallengeList = (function (parent) {
    inherit(SC_ArenaChallengeList, parent);
    function SC_ArenaChallengeList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arenaPrincipal = {}; /* 个人竞技场信息 */
        this.arenaChallengeList = []; /* 竞技场挑战玩家列表 */
    }
    return SC_ArenaChallengeList;
})(protocolBase.IPacket);
exports.SC_ArenaChallengeList = SC_ArenaChallengeList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 竞技场战斗开始 [CS]
 */
var CS_ArenaBattleStart = (function(parent) {
    inherit(CS_ArenaBattleStart, parent);
    function CS_ArenaBattleStart() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid  = ''; /* 用户ID */
        this.rivalRank = 0; /* 对手的排名 */
    }
    return CS_ArenaBattleStart;
})(protocolBase.IPacket);
exports.CS_ArenaBattleStart = CS_ArenaBattleStart;

/**
 * 竞技场战斗开始 [SC]
 */
var SC_ArenaBattleStart = (function (parent) {
    inherit(SC_ArenaBattleStart, parent);
    function SC_ArenaBattleStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rival = {}; /* 对手战斗信息 */
        this.rivalZuid = ''; /* 对手ID */
    }
    return SC_ArenaBattleStart;
})(protocolBase.IPacket);
exports.SC_ArenaBattleStart = SC_ArenaBattleStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 竞技场战斗结束 [CS]
 */
var CS_ArenaBattleEnd = (function(parent) {
    inherit(CS_ArenaBattleEnd, parent);
    function CS_ArenaBattleEnd() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid  = ''; /* 用户ID */
        this.success = 0; /* 是否胜利 */
        this.rivalRank = 0; /* 对手的排名 */
    }
    return CS_ArenaBattleEnd;
})(protocolBase.IPacket);
exports.CS_ArenaBattleEnd = CS_ArenaBattleEnd;

/**
 * 竞技场战斗结束 [SC]
 */
var SC_ArenaBattleEnd = (function (parent) {
    inherit(SC_ArenaBattleEnd, parent);
    function SC_ArenaBattleEnd() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rewards = []; /* 掉落队列 */
        this.rankChange = 0; /* 排名变化 */
        this.addItems = []; /* 掉落物品 */
    }
    return SC_ArenaBattleEnd;
})(protocolBase.IPacket);
exports.SC_ArenaBattleEnd = SC_ArenaBattleEnd;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取竞技场排行榜 [CS]
 */
var CS_ArenaRankList = (function(parent) {
    inherit(CS_ArenaRankList, parent);
    function CS_ArenaRankList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid  = ''; /* 用户ID */
    }
    return CS_ArenaRankList;
})(protocolBase.IPacket);
exports.CS_ArenaRankList = CS_ArenaRankList;

/**
 * 获取竞技场排行榜 [SC]
 */
var SC_ArenaRankList = (function (parent) {
    inherit(SC_ArenaRankList, parent);
    function SC_ArenaRankList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arenaPrincipal = {}; /* 个人竞技场信息 */
        this.arenaRankList = []; /* 竞技场排行榜 */
    }
    return SC_ArenaRankList;
})(protocolBase.IPacket);
exports.SC_ArenaRankList = SC_ArenaRankList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 返回竞技场战斗记录 [CS]
 */
var CS_ArenaBattleRecord = (function(parent) {
    inherit(CS_ArenaBattleRecord, parent);
    function CS_ArenaBattleRecord() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid  = ''; /* 用户ID */
    }
    return CS_ArenaBattleRecord;
})(protocolBase.IPacket);
exports.CS_ArenaBattleRecord = CS_ArenaBattleRecord;

/**
 * 返回竞技场战斗记录 [SC]
 */
var SC_ArenaBattleRecord = (function (parent) {
    inherit(SC_ArenaBattleRecord, parent);
    function SC_ArenaBattleRecord() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arenaBattleRecord = []; /* 竞技场战斗记录 */
    }
    return SC_ArenaBattleRecord;
})(protocolBase.IPacket);
exports.SC_ArenaBattleRecord = SC_ArenaBattleRecord;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 竞技场扫荡 [CS]
 */
var CS_ArenaSweep = (function(parent) {
    inherit(CS_ArenaSweep, parent);
    function CS_ArenaSweep() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid  = ''; /* 用户ID */
    }
    return CS_ArenaSweep;
})(protocolBase.IPacket);
exports.CS_ArenaSweep = CS_ArenaSweep;

/**
 * 竞技场扫荡 [SC]
 */
var SC_ArenaSweep = (function (parent) {
    inherit(SC_ArenaSweep, parent);
    function SC_ArenaSweep() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rewards = []; /* 掉落队列 */
        this.addItems = []; /* 掉落物品 */
    }
    return SC_ArenaSweep;
})(protocolBase.IPacket);
exports.SC_ArenaSweep = SC_ArenaSweep;
/**-------------------------------------------------------------------------------------------------------------------*/

