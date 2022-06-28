
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

exports.pCSGetTowerClimbingInfo = 'CS_GetTowerClimbingInfo';
exports.pSCGetTowerClimbingInfo = 'SC_GetTowerClimbingInfo';

exports.pCSClimbTowerStart = 'CS_ClimbTowerStart';
exports.pSCClimbTowerStart = 'SC_ClimbTowerStart';

exports.pCSClimbTowerResult = 'CS_ClimbTowerResult';
exports.pSCClimbTowerResult = 'SC_ClimbTowerResult';

exports.pCSClimbTowerChooseBuff = 'CS_ClimbTowerChooseBuff';
exports.pSCClimbTowerChooseBuff = 'SC_ClimbTowerChooseBuff';

exports.pCSClimbTowerBuyCommodity = 'CS_ClimbTowerBuyCommodity';
exports.pSCClimbTowerBuyCommodity = 'SC_ClimbTowerBuyCommodity';

exports.pCSResetClimbTower = 'CS_ResetClimbTower';
exports.pSCResetClimbTower = 'SC_ResetClimbTower';

exports.pCSGetClimbTowerStarsRank = 'CS_GetClimbTowerStarsRank';
exports.pSCGetClimbTowerStarsRank = 'SC_GetClimbTowerStarsRank';

exports.pCSClimbTowerSweep = 'CS_ClimbTowerSweep';
exports.pSCClimbTowerSweep = 'SC_ClimbTowerSweep';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取爬塔信息 [CS]
 */
var CS_GetTowerClimbingInfo = (function(parent) {
    inherit(CS_GetTowerClimbingInfo, parent);
    function CS_GetTowerClimbingInfo() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
    }
    return CS_GetTowerClimbingInfo;
})(protocolBase.IPacket);
exports.CS_GetTowerClimbingInfo = CS_GetTowerClimbingInfo;

/**
 * 获取爬塔信息 [SC]
 */
var SC_GetTowerClimbingInfo = (function (parent) {
    inherit(SC_GetTowerClimbingInfo, parent);
    function SC_GetTowerClimbingInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.rankStars = 0; /* 历史最高星数 */
        this.currentStars = 0; /* 当前总星数 */
        this.remainStars = 0; /* 剩余可用星数 */
        this.nextTier = 1; /* 将要挑战的层级 */
        this.tierState = 1; /* 挑战状态 */
        this.buffList = []; /* buff列表 */
        this.chooseBuff = []; /* 备选的新buff */
        this.starList = []; /* 获得的星历史 */
        this.resetTimes = 0; /* 重置次数 */
        this.itemOnSale = {}; /* 打折商品表 */
        this.saleItemState = 0; /* 是否已经购买重置商品 */
        this.saleItemPrice = 0; /* 打折商品价格 */
        this.originalItemPrice = 0; /* 原始商品价格 */
    }
    return SC_GetTowerClimbingInfo;
})(protocolBase.IPacket);
exports.SC_GetTowerClimbingInfo = SC_GetTowerClimbingInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开始爬塔 [CS]
 */
var CS_ClimbTowerStart = (function(parent) {
    inherit(CS_ClimbTowerStart, parent);
    function CS_ClimbTowerStart() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
        this.crtTierStars = 0; /* 当前挑战的星数 */
    }
    return CS_ClimbTowerStart;
})(protocolBase.IPacket);
exports.CS_ClimbTowerStart = CS_ClimbTowerStart;

/**
 * 开始爬塔 [SC]
 */
var SC_ClimbTowerStart = (function (parent) {
    inherit(SC_ClimbTowerStart, parent);
    function SC_ClimbTowerStart() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ClimbTowerStart;
})(protocolBase.IPacket);
exports.SC_ClimbTowerStart = SC_ClimbTowerStart;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 结束爬塔 [CS]
 */
var CS_ClimbTowerResult = (function(parent) {
    inherit(CS_ClimbTowerResult, parent);
    function CS_ClimbTowerResult() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
        this.isWin = 0; /* 是否胜利 */
        this.buffEffect = []; /* buff加成效果 */
    }
    return CS_ClimbTowerResult;
})(protocolBase.IPacket);
exports.CS_ClimbTowerResult = CS_ClimbTowerResult;

/**
 * 结束爬塔 [SC]
 */
var SC_ClimbTowerResult = (function (parent) {
    inherit(SC_ClimbTowerResult, parent);
    function SC_ClimbTowerResult() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.itemOnSale = {}; /* 打折商品 */
        this.chooseBuff = []; /* 备选的新buff */
        this.awardIndex = 0; /* 奖励序号 */
        this.arr = []; /* 通关奖励 */
        this.saleItemPrice = 0; /* 打折商品价格 */
        this.originalItemPrice = 0; /* 原始商品价格 */
    }
    return SC_ClimbTowerResult;
})(protocolBase.IPacket);
exports.SC_ClimbTowerResult = SC_ClimbTowerResult;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 选buff [CS]
 */
var CS_ClimbTowerChooseBuff = (function(parent) {
    inherit(CS_ClimbTowerChooseBuff, parent);
    function CS_ClimbTowerChooseBuff() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
        this.buffIndex = 0;
    }
    return CS_ClimbTowerChooseBuff;
})(protocolBase.IPacket);
exports.CS_ClimbTowerChooseBuff = CS_ClimbTowerChooseBuff;

/**
 * 选buff [SC]
 */
var SC_ClimbTowerChooseBuff = (function (parent) {
    inherit(SC_ClimbTowerChooseBuff, parent);
    function SC_ClimbTowerChooseBuff() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ClimbTowerChooseBuff;
})(protocolBase.IPacket);
exports.SC_ClimbTowerChooseBuff = SC_ClimbTowerChooseBuff;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 买商品 [CS]
 */
var CS_ClimbTowerBuyCommodity = (function(parent) {
    inherit(CS_ClimbTowerBuyCommodity, parent);
    function CS_ClimbTowerBuyCommodity() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
    }
    return CS_ClimbTowerBuyCommodity;
})(protocolBase.IPacket);
exports.CS_ClimbTowerBuyCommodity = CS_ClimbTowerBuyCommodity;

/**
 * 买商品 [SC]
 */
var SC_ClimbTowerBuyCommodity = (function (parent) {
    inherit(SC_ClimbTowerBuyCommodity, parent);
    function SC_ClimbTowerBuyCommodity() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 购买的商品列表 */
    }
    return SC_ClimbTowerBuyCommodity;
})(protocolBase.IPacket);
exports.SC_ClimbTowerBuyCommodity = SC_ClimbTowerBuyCommodity;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 重置关卡 [CS]
 */
var CS_ResetClimbTower = (function(parent) {
    inherit(CS_ResetClimbTower, parent);
    function CS_ResetClimbTower() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
    }
    return CS_ResetClimbTower;
})(protocolBase.IPacket);
exports.CS_ResetClimbTower = CS_ResetClimbTower;

/**
 * 重置关卡 [SC]
 */
var SC_ResetClimbTower = (function (parent) {
    inherit(SC_ResetClimbTower, parent);
    function SC_ResetClimbTower() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_ResetClimbTower;
})(protocolBase.IPacket);
exports.SC_ResetClimbTower = SC_ResetClimbTower;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 星数排行榜 [CS]
 */
var CS_GetClimbTowerStarsRank = (function(parent) {
    inherit(CS_GetClimbTowerStarsRank, parent);
    function CS_GetClimbTowerStarsRank() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
    }
    return CS_GetClimbTowerStarsRank;
})(protocolBase.IPacket);
exports.CS_GetClimbTowerStarsRank = CS_GetClimbTowerStarsRank;

/**
 * 星数排行榜 [SC]
 */
var SC_GetClimbTowerStarsRank = (function (parent) {
    inherit(SC_GetClimbTowerStarsRank, parent);
    function SC_GetClimbTowerStarsRank() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR; /* 错误码 */
        this.myRanking = -1; /* 我的排名 */
        this.myMaxStarCount = 0; /* 历史最高星星数量 */
        this.ranklist = []; /* 星数排行榜 */
    }
    return SC_GetClimbTowerStarsRank;
})(protocolBase.IPacket);
exports.SC_GetClimbTowerStarsRank = SC_GetClimbTowerStarsRank;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 一键三星 [CS]
 */
var CS_ClimbTowerSweep = (function(parent) {
    inherit(CS_ClimbTowerSweep, parent);
    function CS_ClimbTowerSweep() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色ID */
        this.buffEffect = []; /* buff加成效果 */
    }
    return CS_ClimbTowerSweep;
})(protocolBase.IPacket);
exports.CS_ClimbTowerSweep = CS_ClimbTowerSweep;

/**
 * 一键三星 [SC]
 */
var SC_ClimbTowerSweep = (function (parent) {
    inherit(SC_ClimbTowerSweep, parent);
    function SC_ClimbTowerSweep() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.chooseBuff = []; /* 备选的新buff */
        this.awardIndexes = []; /* 奖励序号 */
        this.tierPassRewards = []; /* 通关奖励 */
    }
    return SC_ClimbTowerSweep;
})(protocolBase.IPacket);
exports.SC_ClimbTowerSweep = SC_ClimbTowerSweep;
/**-------------------------------------------------------------------------------------------------------------------*/

