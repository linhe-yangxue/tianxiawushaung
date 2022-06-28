﻿
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

exports.pCSPetAlbum = 'CS_PetAlbum';
exports.pSCPetAlbum = 'SC_PetAlbum';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 图鉴 [CS]
 */
var CS_PetAlbum = (function(parent) {
    inherit(CS_PetAlbum, parent);
    function CS_PetAlbum() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_PetAlbum;
})(protocolBase.IPacket);
exports.CS_PetAlbum = CS_PetAlbum;

/**
 * 图鉴 [SC]
 */
var SC_PetAlbum = (function (parent) {
    inherit(SC_PetAlbum, parent);
    function SC_PetAlbum() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.tidArr = []; /* 符灵tid数组 */
    }
    return SC_PetAlbum;
})(protocolBase.IPacket);
exports.SC_PetAlbum = SC_PetAlbum;
/**-------------------------------------------------------------------------------------------------------------------*/

