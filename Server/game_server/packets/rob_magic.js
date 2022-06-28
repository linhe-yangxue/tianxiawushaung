
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

exports.pCSGetRobAimList = 'CS_GetRobAimList';
exports.pSCGetRobAimList = 'SC_GetRobAimList';

exports.pCSRobMagicStart = 'CS_RobMagicStart';
exports.pSCRobMagicStart = 'SC_RobMagicStart';

exports.pCSRobMagicResult = 'CS_RobMagicResult';
exports.pSCRobMagicResult = 'SC_RobMagicResult';

exports.pCSRob5Times = 'CS_Rob5Times';
exports.pSCRob5Times = 'SC_Rob5Times';

exports.pCSGetRobbedHistoryList = 'CS_GetRobbedHistoryList';
exports.pSCGetRobbedHistoryList = 'SC_GetRobbedHistoryList';

exports.pCSMagicCompose = 'CS_MagicCompose';
exports.pSCMagicCompose = 'SC_MagicCompose';

exports.pCSUseTruceCard = 'CS_UseTruceCard';
exports.pSCUseTruceCard = 'SC_UseTruceCard';

exports.pCSGetTruceTime = 'CS_GetTruceTime';
exports.pSCGetTruceTime = 'SC_GetTruceTime';

exports.pCSRobOneKey = 'CS_RobOneKey';
exports.pSCRobOneKey = 'SC_RobOneKey';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 夺宝目标列表 [CS]
 */
var CS_GetRobAimList = (function(parent) {
    inherit(CS_GetRobAimList, parent);
    function CS_GetRobAimList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.tid = -1; /* 法器碎片tid */
    }
    return CS_GetRobAimList;
})(protocolBase.IPacket);
exports.CS_GetRobAimList = CS_GetRobAimList;

/**
 * 夺宝目标列表 [SC]
 */
var SC_GetRobAimList = (function (parent) {
    inherit(SC_GetRobAimList, parent);
    function SC_GetRobAimList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 夺宝信息列表 */
    }
    return SC_GetRobAimList;
})(protocolBase.IPacket);
exports.SC_GetRobAimList = SC_GetRobAimList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开始夺宝 [CS]
 */
var CS_RobMagicStart = (function(parent) {
    inherit(CS_RobMagicStart, parent);
    function CS_RobMagicStart() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.aimUid = ''; /* 被抢玩家uid */
        this.tid = -1; /* 法器碎片tid */
    }
    return CS_RobMagicStart;
})(protocolBase.IPacket);
exports.CS_RobMagicStart = CS_RobMagicStart;

/**
 * 开始夺宝 [SC]
 */
var SC_RobMagicStart = (function (parent) {
    inherit(SC_RobMagicStart, parent);
    function SC_RobMagicStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.noEnoughFrag = 0; /* 目标玩家碎片不足 */
        this.InTruce = 0; /* 目标玩家处于免战状态 */
        this.opponent = {}; /* 玩家战斗信息 */
    }
    return SC_RobMagicStart;
})(protocolBase.IPacket);
exports.SC_RobMagicStart = SC_RobMagicStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 结束夺宝 [CS]
 */
var CS_RobMagicResult = (function(parent) {
    inherit(CS_RobMagicResult, parent);
    function CS_RobMagicResult() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.aimUid = ''; /* 被抢玩家uid */
        this.tid = -1; /* 法器碎片tid */
        this.isWin = 0; /* 是否胜利 */
    }
    return CS_RobMagicResult;
})(protocolBase.IPacket);
exports.CS_RobMagicResult = CS_RobMagicResult;

/**
 * 结束夺宝 [SC]
 */
var SC_RobMagicResult = (function (parent) {
    inherit(SC_RobMagicResult, parent);
    function SC_RobMagicResult() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.succeed = 0; /* 是否成功抢夺 */
        this.gold = 0; /* 硬币数量 */
        this.exp = 0; /* 经验数量 */
        this.awardItem = {}; /* 奖励物品 */
        this.allAddItems = []; /* 所有添加物品 */
    }
    return SC_RobMagicResult;
})(protocolBase.IPacket);
exports.SC_RobMagicResult = SC_RobMagicResult;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 夺五次 [CS]
 */
var CS_Rob5Times = (function(parent) {
    inherit(CS_Rob5Times, parent);
    function CS_Rob5Times() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.aimUid = ''; /* 被抢玩家uid */
        this.tid = -1; /* 法器碎片tid */
    }
    return CS_Rob5Times;
})(protocolBase.IPacket);
exports.CS_Rob5Times = CS_Rob5Times;

/**
 * 夺五次 [SC]
 */
var SC_Rob5Times = (function (parent) {
    inherit(SC_Rob5Times, parent);
    function SC_Rob5Times() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.succeed = 0; /* 是否成功抢夺 */
        this.golds = []; /* 硬币数量 */
        this.exps = []; /* 经验数量 */
        this.awardItems = []; /* 奖励物品 */
        this.allAddItems = []; /* 所有添加物品 */
    }
    return SC_Rob5Times;
})(protocolBase.IPacket);
exports.SC_Rob5Times = SC_Rob5Times;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 被抢夺记录 [CS]
 */
var CS_GetRobbedHistoryList = (function(parent) {
    inherit(CS_GetRobbedHistoryList, parent);
    function CS_GetRobbedHistoryList() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_GetRobbedHistoryList;
})(protocolBase.IPacket);
exports.CS_GetRobbedHistoryList = CS_GetRobbedHistoryList;

/**
 * 被抢夺记录 [SC]
 */
var SC_GetRobbedHistoryList = (function (parent) {
    inherit(SC_GetRobbedHistoryList, parent);
    function SC_GetRobbedHistoryList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 抢夺成功历史队列 */
    }
    return SC_GetRobbedHistoryList;
})(protocolBase.IPacket);
exports.SC_GetRobbedHistoryList = SC_GetRobbedHistoryList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 法器合成 [CS]
 */
var CS_MagicCompose = (function(parent) {
    inherit(CS_MagicCompose, parent);
    function CS_MagicCompose() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.tid = -1; /* 法器tid */
        this.frags = []; /* 合成所需碎片 */
    }
    return CS_MagicCompose;
})(protocolBase.IPacket);
exports.CS_MagicCompose = CS_MagicCompose;

/**
 * 法器合成 [SC]
 */
var SC_MagicCompose = (function (parent) {
    inherit(SC_MagicCompose, parent);
    function SC_MagicCompose() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.ItemMagic = {}; /* 合成法器 */
        this.magicFragmentsInfo = []; /* 法器对应的碎片情况 */
    }
    return SC_MagicCompose;
})(protocolBase.IPacket);
exports.SC_MagicCompose = SC_MagicCompose;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 使用免战令牌 [CS]
 */
var CS_UseTruceCard = (function(parent) {
    inherit(CS_UseTruceCard, parent);
    function CS_UseTruceCard() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.truceCard = {}; /* 免战令 */
    }
    return CS_UseTruceCard;
})(protocolBase.IPacket);
exports.CS_UseTruceCard = CS_UseTruceCard;

/**
 * 使用免战令牌 [SC]
 */
var SC_UseTruceCard = (function (parent) {
    inherit(SC_UseTruceCard, parent);
    function SC_UseTruceCard() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_UseTruceCard;
})(protocolBase.IPacket);
exports.SC_UseTruceCard = SC_UseTruceCard;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取免战时间 [CS]
 */
var CS_GetTruceTime = (function(parent) {
    inherit(CS_GetTruceTime, parent);
    function CS_GetTruceTime() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
    }
    return CS_GetTruceTime;
})(protocolBase.IPacket);
exports.CS_GetTruceTime = CS_GetTruceTime;

/**
 * 获取免战时间 [SC]
 */
var SC_GetTruceTime = (function (parent) {
    inherit(SC_GetTruceTime, parent);
    function SC_GetTruceTime() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.time = 0; /* 免战时间 */
    }
    return SC_GetTruceTime;
})(protocolBase.IPacket);
exports.SC_GetTruceTime = SC_GetTruceTime;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 一键夺宝 [CS]
 */
var CS_RobOneKey = (function(parent) {
    inherit(CS_RobOneKey, parent);
    function CS_RobOneKey() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = -1; /* 区ID */
        this.zuid = ''; /* 用户ID */
        this.equipTid = -1; /* 法器tid */
        this.fragmentTid = -1; /* 法器碎片tid */
    }
    return CS_RobOneKey;
})(protocolBase.IPacket);
exports.CS_RobOneKey = CS_RobOneKey;

/**
 * 一键夺宝 [SC]
 */
var SC_RobOneKey = (function (parent) {
    inherit(SC_RobOneKey, parent);
    function SC_RobOneKey() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.succeed = 0; /* 是否成功抢夺 */
        this.gold = 0; /* 硬币数量 */
        this.exp = 0; /* 经验数量 */
        this.awardItem = {}; /* 奖励物品 */
        this.allAddItems = []; /* 所有添加物品 */
    }
    return SC_RobOneKey;
})(protocolBase.IPacket);
exports.SC_RobOneKey = SC_RobOneKey;
/**-------------------------------------------------------------------------------------------------------------------*/

