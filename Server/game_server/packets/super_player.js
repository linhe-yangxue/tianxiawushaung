
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

exports.pCSCreateSuperPlayer = 'CS_CreateSuperPlayer';
exports.pSCCreateSuperPlayer = 'SC_CreateSuperPlayer';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 创建超级玩家 [CS]
 */
var CS_CreateSuperPlayer = (function(parent) {
    inherit(CS_CreateSuperPlayer, parent);
    function CS_CreateSuperPlayer() {
        parent.apply(this, arguments);
        this.tk = ''; /* gameToken */
        this.zid = 0; /* 区Id */
        this.zuid = ''; /* 角色Id */
        this.superPlayerInfo = {}; /* 角色信息 */
        this.superPetInfo = []; /* 主角和符灵信息 */
        this.superEquipInfo = []; /* 装备和法器信息 */
        this.stageId = 0; /* 通关关卡号 */
    }
    return CS_CreateSuperPlayer;
})(protocolBase.IPacket);
exports.CS_CreateSuperPlayer = CS_CreateSuperPlayer;

/**
 * 创建超级玩家 [SC]
 */
var SC_CreateSuperPlayer = (function (parent) {
    inherit(SC_CreateSuperPlayer, parent);
    function SC_CreateSuperPlayer() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_CreateSuperPlayer;
})(protocolBase.IPacket);
exports.SC_CreateSuperPlayer = SC_CreateSuperPlayer;
/**-------------------------------------------------------------------------------------------------------------------*/

