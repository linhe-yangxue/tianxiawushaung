
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

exports.pCSSearchFriendInfo = 'CS_SearchFriendInfo';
exports.pSCSearchFriendInfo = 'SC_SearchFriendInfo';

exports.pCSSendFriendRequest = 'CS_SendFriendRequest';
exports.pSCSendFriendRequest = 'SC_SendFriendRequest';

exports.pCSGetFriendRcmdList = 'CS_GetFriendRcmdList';
exports.pSCGetFriendRcmdList = 'SC_GetFriendRcmdList';

exports.pCSGetFriendRequestList = 'CS_GetFriendRequestList';
exports.pSCGetFriendRequestList = 'SC_GetFriendRequestList';

exports.pCSGetFriendList = 'CS_GetFriendList';
exports.pSCGetFriendList = 'SC_GetFriendList';

exports.pCSAcceptFriendRequest = 'CS_AcceptFriendRequest';
exports.pSCAcceptFriendRequest = 'SC_AcceptFriendRequest';

exports.pCSRejectFriendRequest = 'CS_RejectFriendRequest';
exports.pSCRejectFriendRequest = 'SC_RejectFriendRequest';

exports.pCSDeleteFriend = 'CS_DeleteFriend';
exports.pSCDeleteFriend = 'SC_DeleteFriend';

exports.pCSGetSpiritSendList = 'CS_GetSpiritSendList';
exports.pSCGetSpiritSendList = 'SC_GetSpiritSendList';

exports.pCSSendSpirit = 'CS_SendSpirit';
exports.pSCSendSpirit = 'SC_SendSpirit';

exports.pCSGetSpiritRcvList = 'CS_GetSpiritRcvList';
exports.pSCGetSpiritRcvList = 'SC_GetSpiritRcvList';

exports.pCSRcvSpirit = 'CS_RcvSpirit';
exports.pSCRcvSpirit = 'SC_RcvSpirit';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查找玩家好友信息 [CS]
 */
var CS_SearchFriendInfo = (function(parent) {
    inherit(CS_SearchFriendInfo, parent);
    function CS_SearchFriendInfo() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.name = '';
    }
    return CS_SearchFriendInfo;
})(protocolBase.IPacket);
exports.CS_SearchFriendInfo = CS_SearchFriendInfo;

/**
 * 查找玩家好友信息 [SC]
 */
var SC_SearchFriendInfo = (function (parent) {
    inherit(SC_SearchFriendInfo, parent);
    function SC_SearchFriendInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = [];
    }
    return SC_SearchFriendInfo;
})(protocolBase.IPacket);
exports.SC_SearchFriendInfo = SC_SearchFriendInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 申请添加好友 [CS]
 */
var CS_SendFriendRequest = (function(parent) {
    inherit(CS_SendFriendRequest, parent);
    function CS_SendFriendRequest() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.friendId = ''; /* 好友 Id */
    }
    return CS_SendFriendRequest;
})(protocolBase.IPacket);
exports.CS_SendFriendRequest = CS_SendFriendRequest;

/**
 * 申请添加好友 [SC]
 */
var SC_SendFriendRequest = (function (parent) {
    inherit(SC_SendFriendRequest, parent);
    function SC_SendFriendRequest() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.friendReqFull = 0; /* 对方好友申请已满 */
        this.friendsAlready = 0; /* 已经是好友 */
    }
    return SC_SendFriendRequest;
})(protocolBase.IPacket);
exports.SC_SendFriendRequest = SC_SendFriendRequest;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友推荐列表 [CS]
 */
var CS_GetFriendRcmdList = (function(parent) {
    inherit(CS_GetFriendRcmdList, parent);
    function CS_GetFriendRcmdList() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetFriendRcmdList;
})(protocolBase.IPacket);
exports.CS_GetFriendRcmdList = CS_GetFriendRcmdList;

/**
 * 获取好友推荐列表 [SC]
 */
var SC_GetFriendRcmdList = (function (parent) {
    inherit(SC_GetFriendRcmdList, parent);
    function SC_GetFriendRcmdList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = [];
    }
    return SC_GetFriendRcmdList;
})(protocolBase.IPacket);
exports.SC_GetFriendRcmdList = SC_GetFriendRcmdList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友申请列表 [CS]
 */
var CS_GetFriendRequestList = (function(parent) {
    inherit(CS_GetFriendRequestList, parent);
    function CS_GetFriendRequestList() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetFriendRequestList;
})(protocolBase.IPacket);
exports.CS_GetFriendRequestList = CS_GetFriendRequestList;

/**
 * 获取好友申请列表 [SC]
 */
var SC_GetFriendRequestList = (function (parent) {
    inherit(SC_GetFriendRequestList, parent);
    function SC_GetFriendRequestList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = [];
    }
    return SC_GetFriendRequestList;
})(protocolBase.IPacket);
exports.SC_GetFriendRequestList = SC_GetFriendRequestList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取好友列表 [CS]
 */
var CS_GetFriendList = (function(parent) {
    inherit(CS_GetFriendList, parent);
    function CS_GetFriendList() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetFriendList;
})(protocolBase.IPacket);
exports.CS_GetFriendList = CS_GetFriendList;

/**
 * 获取好友列表 [SC]
 */
var SC_GetFriendList = (function (parent) {
    inherit(SC_GetFriendList, parent);
    function SC_GetFriendList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = [];
    }
    return SC_GetFriendList;
})(protocolBase.IPacket);
exports.SC_GetFriendList = SC_GetFriendList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 同意加为好友 [CS]
 */
var CS_AcceptFriendRequest = (function(parent) {
    inherit(CS_AcceptFriendRequest, parent);
    function CS_AcceptFriendRequest() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.friendId = ''; /* 好友 Id */
    }
    return CS_AcceptFriendRequest;
})(protocolBase.IPacket);
exports.CS_AcceptFriendRequest = CS_AcceptFriendRequest;

/**
 * 同意加为好友 [SC]
 */
var SC_AcceptFriendRequest = (function (parent) {
    inherit(SC_AcceptFriendRequest, parent);
    function SC_AcceptFriendRequest() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.friendFull = 0; /* 1表示对方好友已满，2表示自己的好友已满 */
    }
    return SC_AcceptFriendRequest;
})(protocolBase.IPacket);
exports.SC_AcceptFriendRequest = SC_AcceptFriendRequest;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 拒绝加为好友 [CS]
 */
var CS_RejectFriendRequest = (function(parent) {
    inherit(CS_RejectFriendRequest, parent);
    function CS_RejectFriendRequest() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.friendId = ''; /* 好友 Id */
    }
    return CS_RejectFriendRequest;
})(protocolBase.IPacket);
exports.CS_RejectFriendRequest = CS_RejectFriendRequest;

/**
 * 拒绝加为好友 [SC]
 */
var SC_RejectFriendRequest = (function (parent) {
    inherit(SC_RejectFriendRequest, parent);
    function SC_RejectFriendRequest() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_RejectFriendRequest;
})(protocolBase.IPacket);
exports.SC_RejectFriendRequest = SC_RejectFriendRequest;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 删除好友 [CS]
 */
var CS_DeleteFriend = (function(parent) {
    inherit(CS_DeleteFriend, parent);
    function CS_DeleteFriend() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.friendId = ''; /* 好友 Id */
    }
    return CS_DeleteFriend;
})(protocolBase.IPacket);
exports.CS_DeleteFriend = CS_DeleteFriend;

/**
 * 删除好友 [SC]
 */
var SC_DeleteFriend = (function (parent) {
    inherit(SC_DeleteFriend, parent);
    function SC_DeleteFriend() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_DeleteFriend;
})(protocolBase.IPacket);
exports.SC_DeleteFriend = SC_DeleteFriend;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取精力赠送列表 [CS]
 */
var CS_GetSpiritSendList = (function(parent) {
    inherit(CS_GetSpiritSendList, parent);
    function CS_GetSpiritSendList() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetSpiritSendList;
})(protocolBase.IPacket);
exports.CS_GetSpiritSendList = CS_GetSpiritSendList;

/**
 * 获取精力赠送列表 [SC]
 */
var SC_GetSpiritSendList = (function (parent) {
    inherit(SC_GetSpiritSendList, parent);
    function SC_GetSpiritSendList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = [];
    }
    return SC_GetSpiritSendList;
})(protocolBase.IPacket);
exports.SC_GetSpiritSendList = SC_GetSpiritSendList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 赠送精力 [CS]
 */
var CS_SendSpirit = (function(parent) {
    inherit(CS_SendSpirit, parent);
    function CS_SendSpirit() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.friendId = ''; /* 好友 Id */
    }
    return CS_SendSpirit;
})(protocolBase.IPacket);
exports.CS_SendSpirit = CS_SendSpirit;

/**
 * 赠送精力 [SC]
 */
var SC_SendSpirit = (function (parent) {
    inherit(SC_SendSpirit, parent);
    function SC_SendSpirit() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
    }
    return SC_SendSpirit;
})(protocolBase.IPacket);
exports.SC_SendSpirit = SC_SendSpirit;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取精力领取列表 [CS]
 */
var CS_GetSpiritRcvList = (function(parent) {
    inherit(CS_GetSpiritRcvList, parent);
    function CS_GetSpiritRcvList() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
    }
    return CS_GetSpiritRcvList;
})(protocolBase.IPacket);
exports.CS_GetSpiritRcvList = CS_GetSpiritRcvList;

/**
 * 获取精力领取列表 [SC]
 */
var SC_GetSpiritRcvList = (function (parent) {
    inherit(SC_GetSpiritRcvList, parent);
    function SC_GetSpiritRcvList() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = [];
        this.leftCnt = 0; /* 剩余领取次数 */
    }
    return SC_GetSpiritRcvList;
})(protocolBase.IPacket);
exports.SC_GetSpiritRcvList = SC_GetSpiritRcvList;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取精力 [CS]
 */
var CS_RcvSpirit = (function(parent) {
    inherit(CS_RcvSpirit, parent);
    function CS_RcvSpirit() {
        parent.apply(this, arguments);
        this.tk = '';
        this.zid = 0;
        this.zuid = ''; /* 角色Id */
        this.friendIds = []; /* 好友Id */
    }
    return CS_RcvSpirit;
})(protocolBase.IPacket);
exports.CS_RcvSpirit = CS_RcvSpirit;

/**
 * 领取精力 [SC]
 */
var SC_RcvSpirit = (function (parent) {
    inherit(SC_RcvSpirit, parent);
    function SC_RcvSpirit() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.idRcv = []; /* 领取成功的好友Id */
    }
    return SC_RcvSpirit;
})(protocolBase.IPacket);
exports.SC_RcvSpirit = SC_RcvSpirit;
/**-------------------------------------------------------------------------------------------------------------------*/

