
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

exports.pCSCreateGuild = 'CS_CreateGuild';
exports.pSCCreateGuild = 'SC_CreateGuild';

exports.pCSGetGuildArr = 'CS_GetGuildArr';
exports.pSCGetGuildArr = 'SC_GetGuildArr';

exports.pCSSearchGuildName = 'CS_SearchGuildName';
exports.pSCSearchGuildName = 'SC_SearchGuildName';

exports.pCSGetGuildWorshipInfo = 'CS_GetGuildWorshipInfo';
exports.pSCGetGuildWorshipInfo = 'SC_GetGuildWorshipInfo';

exports.pCSGuildWorship = 'CS_GuildWorship';
exports.pSCGuildWorship = 'SC_GuildWorship';

exports.pCSGetGuildWorshipReward = 'CS_GetGuildWorshipReward';
exports.pSCGetGuildWorshipReward = 'SC_GetGuildWorshipReward';

exports.pCSGuildInfoArr = 'CS_GuildInfoArr';
exports.pSCGuildInfoArr = 'SC_GuildInfoArr';

exports.pCSGetGuildMemberArr = 'CS_GetGuildMemberArr';
exports.pSCGetGuildMemberArr = 'SC_GetGuildMemberArr';

exports.pCSGuildImpeach = 'CS_GuildImpeach';
exports.pSCGuildImpeach = 'SC_GuildImpeach';

exports.pCSChangeGuildInInfo = 'CS_ChangeGuildInInfo';
exports.pSCChangeGuildInInfo = 'SC_ChangeGuildInInfo';

exports.pCSGuildAppointMember = 'CS_GuildAppointMember';
exports.pSCGuildAppointMember = 'SC_GuildAppointMember';

exports.pCSGuildCancelAppointMember = 'CS_GuildCancelAppointMember';
exports.pSCGuildCancelAppointMember = 'SC_GuildCancelAppointMember';

exports.pCSGuildRemoveMember = 'CS_GuildRemoveMember';
exports.pSCGuildRemoveMember = 'SC_GuildRemoveMember';

exports.pCSGetApplyMemberArr = 'CS_GetApplyMemberArr';
exports.pSCGetApplyMemberArr = 'SC_GetApplyMemberArr';

exports.pCSGuildAddMember = 'CS_GuildAddMember';
exports.pSCGuildAddMember = 'SC_GuildAddMember';

exports.pCSGuildRefuseMember = 'CS_GuildRefuseMember';
exports.pSCGuildRefuseMember = 'SC_GuildRefuseMember';

exports.pCSGuildDissolution = 'CS_GuildDissolution';
exports.pSCGuildDissolution = 'SC_GuildDissolution';

exports.pCSGuildApplyJoinOrCancel = 'CS_GuildApplyJoinOrCancel';
exports.pSCGuildApplyJoinOrCancel = 'SC_GuildApplyJoinOrCancel';

exports.pCSGetGuildId = 'CS_GetGuildId';
exports.pSCGetGuildId = 'SC_GetGuildId';

exports.pCSGuildRanklist = 'CS_GuildRanklist';
exports.pSCGuildRanklist = 'SC_GuildRanklist';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 创建公会 [CS]
 */
var CS_CreateGuild = (function(parent) {
    inherit(CS_CreateGuild, parent);
    function CS_CreateGuild() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.name = ''; /* 公会名称（8个字） */
        this.outInfo = ''; /* 公会宣言（50个字） */
    }
    return CS_CreateGuild;
})(protocolBase.IPacket);
exports.CS_CreateGuild = CS_CreateGuild;

/**
 * 创建公会 [SC]
 */
var SC_CreateGuild = (function (parent) {
    inherit(SC_CreateGuild, parent);
    function SC_CreateGuild() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildObject = {}; /* 公会对象 */
        this.guildExist = 0; /* 公会是否已存在 */
    }
    return SC_CreateGuild;
})(protocolBase.IPacket);
exports.SC_CreateGuild = SC_CreateGuild;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取公会列表 [CS]
 */
var CS_GetGuildArr = (function(parent) {
    inherit(CS_GetGuildArr, parent);
    function CS_GetGuildArr() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
    }
    return CS_GetGuildArr;
})(protocolBase.IPacket);
exports.CS_GetGuildArr = CS_GetGuildArr;

/**
 * 获取公会列表 [SC]
 */
var SC_GetGuildArr = (function (parent) {
    inherit(SC_GetGuildArr, parent);
    function SC_GetGuildArr() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 公会信息列表 */
        this.applyArr = []; /* 申请公会ID列表 */
    }
    return SC_GetGuildArr;
})(protocolBase.IPacket);
exports.SC_GetGuildArr = SC_GetGuildArr;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 搜索公会 [CS]
 */
var CS_SearchGuildName = (function(parent) {
    inherit(CS_SearchGuildName, parent);
    function CS_SearchGuildName() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.guildName = ''; /* 公会名称 */
    }
    return CS_SearchGuildName;
})(protocolBase.IPacket);
exports.CS_SearchGuildName = CS_SearchGuildName;

/**
 * 搜索公会 [SC]
 */
var SC_SearchGuildName = (function (parent) {
    inherit(SC_SearchGuildName, parent);
    function SC_SearchGuildName() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildObjectArr = []; /* 公会对象数组 */
        this.applyArr = []; /* 申请公会ID列表 */
    }
    return SC_SearchGuildName;
})(protocolBase.IPacket);
exports.SC_SearchGuildName = SC_SearchGuildName;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取祭天信息 [CS]
 */
var CS_GetGuildWorshipInfo = (function(parent) {
    inherit(CS_GetGuildWorshipInfo, parent);
    function CS_GetGuildWorshipInfo() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
    }
    return CS_GetGuildWorshipInfo;
})(protocolBase.IPacket);
exports.CS_GetGuildWorshipInfo = CS_GetGuildWorshipInfo;

/**
 * 获取祭天信息 [SC]
 */
var SC_GetGuildWorshipInfo = (function (parent) {
    inherit(SC_GetGuildWorshipInfo, parent);
    function SC_GetGuildWorshipInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.worshipInfo = {}; /* 祭天对象 */
        this.guildId = ''; /* 公会ID */
        this.rewardInfo = []; /* 奖励领取状态信息 */
    }
    return SC_GetGuildWorshipInfo;
})(protocolBase.IPacket);
exports.SC_GetGuildWorshipInfo = SC_GetGuildWorshipInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 祭天操作 [CS]
 */
var CS_GuildWorship = (function(parent) {
    inherit(CS_GuildWorship, parent);
    function CS_GuildWorship() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.worshipType = ''; /* 祭天类型（1、2、3） */
        this.zgid = ''; /* 公会ID */
    }
    return CS_GuildWorship;
})(protocolBase.IPacket);
exports.CS_GuildWorship = CS_GuildWorship;

/**
 * 祭天操作 [SC]
 */
var SC_GuildWorship = (function (parent) {
    inherit(SC_GuildWorship, parent);
    function SC_GuildWorship() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
    }
    return SC_GuildWorship;
})(protocolBase.IPacket);
exports.SC_GuildWorship = SC_GuildWorship;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 领取祭天奖励 [CS]
 */
var CS_GetGuildWorshipReward = (function(parent) {
    inherit(CS_GetGuildWorshipReward, parent);
    function CS_GetGuildWorshipReward() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.rewardType = ''; /* 奖励类型（1、2、3、4） */
        this.zgid = -1; /* 公会ID */
    }
    return CS_GetGuildWorshipReward;
})(protocolBase.IPacket);
exports.CS_GetGuildWorshipReward = CS_GetGuildWorshipReward;

/**
 * 领取祭天奖励 [SC]
 */
var SC_GetGuildWorshipReward = (function (parent) {
    inherit(SC_GetGuildWorshipReward, parent);
    function SC_GetGuildWorshipReward() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 奖励道具数组 */
        this.guildId = ''; /* 公会ID */
    }
    return SC_GetGuildWorshipReward;
})(protocolBase.IPacket);
exports.SC_GetGuildWorshipReward = SC_GetGuildWorshipReward;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会信息列表 [CS]
 */
var CS_GuildInfoArr = (function(parent) {
    inherit(CS_GuildInfoArr, parent);
    function CS_GuildInfoArr() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
    }
    return CS_GuildInfoArr;
})(protocolBase.IPacket);
exports.CS_GuildInfoArr = CS_GuildInfoArr;

/**
 * 公会信息列表 [SC]
 */
var SC_GuildInfoArr = (function (parent) {
    inherit(SC_GuildInfoArr, parent);
    function SC_GuildInfoArr() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 公会动态信息数组 */
        this.guildId = ''; /* 公会ID */
    }
    return SC_GuildInfoArr;
})(protocolBase.IPacket);
exports.SC_GuildInfoArr = SC_GuildInfoArr;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取公会成员列表 [CS]
 */
var CS_GetGuildMemberArr = (function(parent) {
    inherit(CS_GetGuildMemberArr, parent);
    function CS_GetGuildMemberArr() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
    }
    return CS_GetGuildMemberArr;
})(protocolBase.IPacket);
exports.CS_GetGuildMemberArr = CS_GetGuildMemberArr;

/**
 * 获取公会成员列表 [SC]
 */
var SC_GetGuildMemberArr = (function (parent) {
    inherit(SC_GetGuildMemberArr, parent);
    function SC_GetGuildMemberArr() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 公会成员数组 */
        this.baseArr = []; /* 公会基础成员数组 */
        this.guildObject = {}; /* 公会对象 */
        this.guildId = -1; /* 公会ID */
    }
    return SC_GetGuildMemberArr;
})(protocolBase.IPacket);
exports.SC_GetGuildMemberArr = SC_GetGuildMemberArr;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 弹劾会长 [CS]
 */
var CS_GuildImpeach = (function(parent) {
    inherit(CS_GuildImpeach, parent);
    function CS_GuildImpeach() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
    }
    return CS_GuildImpeach;
})(protocolBase.IPacket);
exports.CS_GuildImpeach = CS_GuildImpeach;

/**
 * 弹劾会长 [SC]
 */
var SC_GuildImpeach = (function (parent) {
    inherit(SC_GuildImpeach, parent);
    function SC_GuildImpeach() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
    }
    return SC_GuildImpeach;
})(protocolBase.IPacket);
exports.SC_GuildImpeach = SC_GuildImpeach;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改公告 [CS]
 */
var CS_ChangeGuildInInfo = (function(parent) {
    inherit(CS_ChangeGuildInInfo, parent);
    function CS_ChangeGuildInInfo() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
        this.inMsg = ''; /* 公告 */
        this.outMsg = ''; /* 宣言 */
    }
    return CS_ChangeGuildInInfo;
})(protocolBase.IPacket);
exports.CS_ChangeGuildInInfo = CS_ChangeGuildInInfo;

/**
 * 修改公告 [SC]
 */
var SC_ChangeGuildInInfo = (function (parent) {
    inherit(SC_ChangeGuildInInfo, parent);
    function SC_ChangeGuildInInfo() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
    }
    return SC_ChangeGuildInInfo;
})(protocolBase.IPacket);
exports.SC_ChangeGuildInInfo = SC_ChangeGuildInInfo;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 任命职位 [CS]
 */
var CS_GuildAppointMember = (function(parent) {
    inherit(CS_GuildAppointMember, parent);
    function CS_GuildAppointMember() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
        this.memberZuid = ''; /* 被操作的UID */
        this.titleType = -1; /* 职位类型（2 -- 会长、1 -- 堂主、0 -- 成员） */
    }
    return CS_GuildAppointMember;
})(protocolBase.IPacket);
exports.CS_GuildAppointMember = CS_GuildAppointMember;

/**
 * 任命职位 [SC]
 */
var SC_GuildAppointMember = (function (parent) {
    inherit(SC_GuildAppointMember, parent);
    function SC_GuildAppointMember() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
    }
    return SC_GuildAppointMember;
})(protocolBase.IPacket);
exports.SC_GuildAppointMember = SC_GuildAppointMember;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 罢免职位 [CS]
 */
var CS_GuildCancelAppointMember = (function(parent) {
    inherit(CS_GuildCancelAppointMember, parent);
    function CS_GuildCancelAppointMember() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
        this.memberZuid = ''; /* 被操作的UID */
        this.titleType = -1; /* 职位类型（2 -- 会长、1 -- 堂主、0 -- 成员） */
    }
    return CS_GuildCancelAppointMember;
})(protocolBase.IPacket);
exports.CS_GuildCancelAppointMember = CS_GuildCancelAppointMember;

/**
 * 罢免职位 [SC]
 */
var SC_GuildCancelAppointMember = (function (parent) {
    inherit(SC_GuildCancelAppointMember, parent);
    function SC_GuildCancelAppointMember() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
    }
    return SC_GuildCancelAppointMember;
})(protocolBase.IPacket);
exports.SC_GuildCancelAppointMember = SC_GuildCancelAppointMember;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 踢出成员 [CS]
 */
var CS_GuildRemoveMember = (function(parent) {
    inherit(CS_GuildRemoveMember, parent);
    function CS_GuildRemoveMember() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
        this.memberZuid = ''; /* 被操作的UID */
    }
    return CS_GuildRemoveMember;
})(protocolBase.IPacket);
exports.CS_GuildRemoveMember = CS_GuildRemoveMember;

/**
 * 踢出成员 [SC]
 */
var SC_GuildRemoveMember = (function (parent) {
    inherit(SC_GuildRemoveMember, parent);
    function SC_GuildRemoveMember() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
    }
    return SC_GuildRemoveMember;
})(protocolBase.IPacket);
exports.SC_GuildRemoveMember = SC_GuildRemoveMember;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取申请成员列表 [CS]
 */
var CS_GetApplyMemberArr = (function(parent) {
    inherit(CS_GetApplyMemberArr, parent);
    function CS_GetApplyMemberArr() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
    }
    return CS_GetApplyMemberArr;
})(protocolBase.IPacket);
exports.CS_GetApplyMemberArr = CS_GetApplyMemberArr;

/**
 * 获取申请成员列表 [SC]
 */
var SC_GetApplyMemberArr = (function (parent) {
    inherit(SC_GetApplyMemberArr, parent);
    function SC_GetApplyMemberArr() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.arr = []; /* 公会基础成员数组 */
    }
    return SC_GetApplyMemberArr;
})(protocolBase.IPacket);
exports.SC_GetApplyMemberArr = SC_GetApplyMemberArr;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 添加成员 [CS]
 */
var CS_GuildAddMember = (function(parent) {
    inherit(CS_GuildAddMember, parent);
    function CS_GuildAddMember() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
        this.memberZuid = ''; /* 被操作的UID */
    }
    return CS_GuildAddMember;
})(protocolBase.IPacket);
exports.CS_GuildAddMember = CS_GuildAddMember;

/**
 * 添加成员 [SC]
 */
var SC_GuildAddMember = (function (parent) {
    inherit(SC_GuildAddMember, parent);
    function SC_GuildAddMember() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
        this.memberAddGuild = 0; /* 判断是否已在公会中 */
        this.isFull = 0; /* 工会是否满员 */
    }
    return SC_GuildAddMember;
})(protocolBase.IPacket);
exports.SC_GuildAddMember = SC_GuildAddMember;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 拒绝成员 [CS]
 */
var CS_GuildRefuseMember = (function(parent) {
    inherit(CS_GuildRefuseMember, parent);
    function CS_GuildRefuseMember() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
        this.memberZuid = ''; /* 被操作的UID */
    }
    return CS_GuildRefuseMember;
})(protocolBase.IPacket);
exports.CS_GuildRefuseMember = CS_GuildRefuseMember;

/**
 * 拒绝成员 [SC]
 */
var SC_GuildRefuseMember = (function (parent) {
    inherit(SC_GuildRefuseMember, parent);
    function SC_GuildRefuseMember() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
    }
    return SC_GuildRefuseMember;
})(protocolBase.IPacket);
exports.SC_GuildRefuseMember = SC_GuildRefuseMember;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 解散公会 [CS]
 */
var CS_GuildDissolution = (function(parent) {
    inherit(CS_GuildDissolution, parent);
    function CS_GuildDissolution() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
    }
    return CS_GuildDissolution;
})(protocolBase.IPacket);
exports.CS_GuildDissolution = CS_GuildDissolution;

/**
 * 解散公会 [SC]
 */
var SC_GuildDissolution = (function (parent) {
    inherit(SC_GuildDissolution, parent);
    function SC_GuildDissolution() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
    }
    return SC_GuildDissolution;
})(protocolBase.IPacket);
exports.SC_GuildDissolution = SC_GuildDissolution;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 申请或取消申请加入公会 [CS]
 */
var CS_GuildApplyJoinOrCancel = (function(parent) {
    inherit(CS_GuildApplyJoinOrCancel, parent);
    function CS_GuildApplyJoinOrCancel() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid = 0; /* 区ID */
        this.zuid = ''; /* 角色ID */
        this.zgid = ''; /* 公会ID */
        this.reqType = 0; /* 请求类型(0 -- 初始、1 -- 申请、2 -- 取消申请) */
    }
    return CS_GuildApplyJoinOrCancel;
})(protocolBase.IPacket);
exports.CS_GuildApplyJoinOrCancel = CS_GuildApplyJoinOrCancel;

/**
 * 申请或取消申请加入公会 [SC]
 */
var SC_GuildApplyJoinOrCancel = (function (parent) {
    inherit(SC_GuildApplyJoinOrCancel, parent);
    function SC_GuildApplyJoinOrCancel() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.isFull = 0; /* 判断是否满员 */
        this.appliable = 1; /* 是否可以申请 */
    }
    return SC_GuildApplyJoinOrCancel;
})(protocolBase.IPacket);
exports.SC_GuildApplyJoinOrCancel = SC_GuildApplyJoinOrCancel;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取公会ID [CS]
 */
var CS_GetGuildId = (function(parent) {
    inherit(CS_GetGuildId, parent);
    function CS_GetGuildId() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid  = 0; /* 区ID */
        this.zuid = ''; /* 角色ID  */
    }
    return CS_GetGuildId;
})(protocolBase.IPacket);
exports.CS_GetGuildId = CS_GetGuildId;

/**
 * 获取公会ID [SC]
 */
var SC_GetGuildId = (function (parent) {
    inherit(SC_GetGuildId, parent);
    function SC_GetGuildId() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.guildId = ''; /* 公会ID */
        this.guildBossRedPoint = 0; /* 宗门秘境红点 */
    }
    return SC_GetGuildId;
})(protocolBase.IPacket);
exports.SC_GetGuildId = SC_GetGuildId;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 公会排行 [CS]
 */
var CS_GuildRanklist = (function(parent) {
    inherit(CS_GuildRanklist, parent);
    function CS_GuildRanklist() {
        parent.apply(this, arguments);
        this.tk = ''; /* 网络令牌 */
        this.zid  = 0; /* 区ID */
        this.zuid = ''; /* 角色ID  */
    }
    return CS_GuildRanklist;
})(protocolBase.IPacket);
exports.CS_GuildRanklist = CS_GuildRanklist;

/**
 * 公会排行 [SC]
 */
var SC_GuildRanklist = (function (parent) {
    inherit(SC_GuildRanklist, parent);
    function SC_GuildRanklist() {
        parent.apply(this, arguments);
        this.ret = retCode.ERR;
        this.myRanking = -1; /* 我的排名 */
        this.ranklist = []; /* 排行榜 */
    }
    return SC_GuildRanklist;
})(protocolBase.IPacket);
exports.SC_GuildRanklist = SC_GuildRanklist;
/**-------------------------------------------------------------------------------------------------------------------*/

