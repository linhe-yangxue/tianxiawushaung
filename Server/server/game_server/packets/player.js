
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

exports.pCSCreatePlayer = 'CS_CreatePlayer';
exports.pSCCreatePlayer = 'SC_CreatePlayer';

exports.pCSGetPlayerData = 'CS_GetPlayerData';
exports.pSCGetPlayerData = 'SC_GetPlayerData';

exports.pCSVisitPlayer = 'CS_VisitPlayer';
exports.pSCVisitPlayer = 'SC_VisitPlayer';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 创建角色 [CS]
 */
var CS_CreatePlayer = (function(parent) {
    inherit(CS_CreatePlayer, parent);
    function CS_CreatePlayer() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.chaModelIndex = 0; /* 主角配表ID */
        this.playerName = ''; /* 角色名字 */
        this.systemSoftware = ''; /* 终端版本 */
        this.systemHardware = ''; /* 终端机型 */
    }
    return CS_CreatePlayer;
})(protocolBase.IPacket);
exports.CS_CreatePlayer = CS_CreatePlayer;

/**
 * 创建角色 [SC]
 */
var SC_CreatePlayer = (function (parent) {
    inherit(SC_CreatePlayer, parent);
    function SC_CreatePlayer() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_CreatePlayer;
})(protocolBase.IPacket);
exports.SC_CreatePlayer = SC_CreatePlayer;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取主角 [CS]
 */
var CS_GetPlayerData = (function(parent) {
    inherit(CS_GetPlayerData, parent);
    function CS_GetPlayerData() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetPlayerData;
})(protocolBase.IPacket);
exports.CS_GetPlayerData = CS_GetPlayerData;

/**
 * 获取主角 [SC]
 */
var SC_GetPlayerData = (function (parent) {
    inherit(SC_GetPlayerData, parent);
    function SC_GetPlayerData() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.name = ''; /* 名字 */
        this.gold = 0; /* 银币 */
        this.diamond = 0; /* 元宝 */
        this.stamina = 0; /* 体力 */
        this.spirit = 0; /* 精力 */
        this.soulPoint = 0; /* 符魂 */
        this.reputation = 0; /* 声望 */
        this.prestige = 0; /* 威名 */
        this.battleAchv = 0; /* 战功 */
        this.unionContr = 0; /* 公会贡献 */
        this.beatDemonCard = 0; /* 降魔令 */
        this.vipLevel = 0; /* vip等级 */
        this.power = 0; /* 战斗力 */
        this.character = {}; /* 角色 */
        this.skin = []; /* 皮肤 */
        this.lastLoginTime = 0; /* 最后登陆时间 */
        this.newPlayer = 0; /* 是否新玩家 */
        this.guildId = ''; /* 公会Id */
        this.staminaStamp = 0; /* 体力开始恢复时间 */
        this.spiritStamp = 0; /* 精力开始恢复时间 */
        this.beatDemonCardStamp = 0; /* 降魔令开始恢复时间 */
        this.createDate = ''; /* 创建时间 */
    }
    return SC_GetPlayerData;
})(protocolBase.IPacket);
exports.SC_GetPlayerData = SC_GetPlayerData;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 访问玩家 [CS]
 */
var CS_VisitPlayer = (function(parent) {
    inherit(CS_VisitPlayer, parent);
    function CS_VisitPlayer() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.targetId = ''; /* 访问目标的Id */
    }
    return CS_VisitPlayer;
})(protocolBase.IPacket);
exports.CS_VisitPlayer = CS_VisitPlayer;

/**
 * 访问玩家 [SC]
 */
var SC_VisitPlayer = (function (parent) {
    inherit(SC_VisitPlayer, parent);
    function SC_VisitPlayer() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.name = ''; /* 玩家姓名 */
        this.power = 0; /* 战斗力 */
        this.guildName = ''; /* 公会名 */
        this.arr = []; /* 数组元素是tid和level组成的对象 */
    }
    return SC_VisitPlayer;
})(protocolBase.IPacket);
exports.SC_VisitPlayer = SC_VisitPlayer;
/**-------------------------------------------------------------------------------------------------------------------*/

