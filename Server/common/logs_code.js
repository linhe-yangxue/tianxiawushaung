/**
 * 行为日志的编号
 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 账号 [51-100]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log00051 = 51; /* [Register]账号注册 */
exports.log00052 = 52; /* [Register]快速注册账号生成并且绑定 */
exports.log00053 = 53; /* [Register]账号密码注册 */
exports.log00054 = 54; /* [Login]登录 */
exports.log00055 = 55; /* [Login]生成登录服务器网络令牌 */
exports.log00056 = 56; /* [Login]验证登录服务器网络令牌 */
exports.log00057 = 57; /* [Login]获取登录过的服务器列表信息 */
exports.log00058 = 58; /* [GameServerLogin]验证登录服务器网络令牌 */
exports.log00059 = 59; /* [GameServerLogin]生成游戏服务器网络令牌 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 背包 [801-850]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log00801 = 801; /* [GetPackageList]获取七个背包背包中的其中之一 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 创建角色 [101-150]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log00101 = 101; /* [GetPlayerData]获取Player */
exports.log00102 = 102; /* [CreatePlayer]创建角色 */
exports.log00103 = 103; /* [CreatePlayer]创建宠物 */
exports.log00104 = 104; /* [CreatePlayer]创建背包 */
exports.log00105 = 105; /* [CreatePlayer]初始化天命值默认清空时间 */
exports.log00106 = 106; /* [VisitPlayer]获取player */
exports.log00107 = 107; /* [VisitPlayer]获取背包 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 邮件 [1001-1050]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log001001 = 1001; /* [ReqMails]获取邮件列表 */
exports.log001002 = 1002; /* [SendMail]发送邮件 */
exports.log001003 = 1003; /* [GetItem]领取邮件 */
exports.log001004 = 1004; /* [GetAllItem]一键领取邮件 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 好友 [1051-1100]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log001051 = 1051; /* [SearchFriendInfo]搜索好友 */
exports.log001052 = 1052; /* [SendFriendRequest]申请好友 */
exports.log001053 = 1053; /* [GetFriendRcmdList]获取好友推荐列表 */
exports.log001054 = 1054; /* [GetFriendRequestList]获取好友申请列表 */
exports.log001055 = 1055; /* [GetFriendList]获取好友列表 */
exports.log001056 = 1056; /* [AcceptFriendRequest]同意好友申请 */
exports.log001057 = 1057; /* [RejectFriendRequest]拒绝好友申请 */
exports.log001058 = 1058; /* [DeleteFriend]从自己的好友列表中删除 */
exports.log001059 = 1059; /* [DeleteFriend]从其他人的好友列表中删除 */
exports.log001060 = 1060; /* [GetSpiritSendList]获取精力赠送列表 */
exports.log001061 = 1061; /* [SendSpirit]赠送精力 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 排行榜 [1201-1250]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log01201 = 1201; /* [GuildRanklist]公会排行*/
exports.log01202 = 1202; /* [GetArenaRankList]竞技场排行*/
exports.log01203 = 1203; /* [BossBattleDamageRanklist]伤害排行*/
exports.log01204 = 1204; /* [BossBattleFeatsRanklist]功勋排行*/
exports.log01205 = 1205; /* [GetClimbTowerStarsRank]星数排行*/
exports.log01206 = 1206; /* [MainUIPowerRanklist]战斗力排行*/
exports.log01207 = 1207; /* [MainUILevelRanklist]等级排行*/
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 任务成就 [1251-1300]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log001251 = 1251; /* [GetDailyTaskAward] 完成当前日常任务获得奖励 */
exports.log001252 = 1252; /* [GetDailyTaskAward] 完成当前日常任务获得积分 */
exports.log001253 = 1253; /* [GetAchieveTaskAward] 完成当前成就任务获得奖励 */
exports.log001254 = 1254; /* [GetDailyTaskData] 获取宝箱信息 */
exports.log001255 = 1255; /* [GetDailyTaskData] 获取日常任务信息 */
exports.log001256 = 1256; /* [GetAchievementData] 获取成就任务所有信息 */
exports.log001257 = 1257; /* [GetDailyTaskAward] 从数据库中读取当前任务对象信息 */
exports.log001258 = 1258; /* [GetDailyTaskAward] 读出在领取任务奖励后当前任务对象信息 */
exports.log001259 = 1259; /* [GetDailyTaskAward] 读出在领取任务奖励后当前宝箱对象信息 */
exports.log001260 = 1260; /* [GetAchieveTaskAward] 从数据库中读取当前任务同类型对象信息 */
exports.log001261 = 1261; /* [GetAchieveTaskAward] 读出在领取任务奖励后当前任务同类型对象信息 */
exports.log001262 = 1262; /* [GetTaskScoreAward] 在领取宝箱奖励之前从数据库中读取当前宝箱对象信息 */
exports.log001263 = 1263; /* [GetTaskScoreAward] 领取宝箱奖励 */
exports.log001264 = 1264; /* [GetTaskScoreAward] 领取宝箱奖励之后宝箱对象信息 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 公会 [1301-1350]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log01301 = 1301; /* [GetGuildArr]获取公会列表 */
exports.log01302 = 1302; /* [SearchGuildName]搜索公会 */
exports.log01303 = 1303; /* [CreateGuild]创建公会 */
exports.log01304 = 1304; /* [GetGuildMemberArr]获取公会成员列表 */
exports.log01305 = 1305; /* [GuildApplyJoinOrCancel]申请或取消申请 */
exports.log01306 = 1306; /* [GuildDissolution]解散公会 */
exports.log01307 = 1307; /* [GetApplyMemberArr]获取公会申请列表 */
exports.log01308 = 1308; /* [GuildAddMember]增加成员 */
exports.log01309 = 1309; /* [GuildRefuseMember]拒绝成员 */
exports.log01310 = 1310; /* [GuildInfoArr]公会信息列表 */
exports.log01311 = 1311; /* [GetGuildWorshipInfo]获取祭天信息 */
exports.log01312 = 1312; /* [GuildWorship]祭天操作 */
exports.log01313 = 1313; /* [GetGuildWorshipReward]获取祭天奖励 */
exports.log01314 = 1314; /* [GuildImpeach]弹劾会长 */
exports.log01315 = 1315; /* [ChangeGuildInfo]修改公告 */
exports.log01316 = 1316; /* [ChangeGuildOutInfo]修改宣言 */
exports.log01317 = 1317; /* [GuildAppointMember]任命职位 */
exports.log01318 = 1318; /* [GuildCancelAppointMember]罢免职位 */
exports.log01319 = 1319; /* [GuildRemoveMember]踢出成员 */
exports.log01320 = 1320; /* [GetGuildId]获取公会ID */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 夺宝 [2001-2050]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log02001 = 2001; /* [GetTruceTime] 获取免战时间结果 */
exports.log02002 = 2002; /* [UseTruceToken] 使用免战令牌失败失败结果 */
exports.log02003 = 2003; /* [UseTruceToken] 扣除免战令牌  */
exports.log02005 = 2005; /* [IndianaCompose] 合成法宝 消耗物品 */
exports.log02006 = 2006; /* [IndianaCompose] 合成法宝 获得法宝 */
exports.log02008 = 2008; /* [PointIndianaButton] 点击夺宝，扣除精力 */
exports.log02011 = 2011; /* [ResultIndiana] 获得夺宝结算物品 */
exports.log02013 = 2013; /* [ResultIndiana] 被掠夺玩家减少法宝碎片 */
exports.log02014 = 2014; /* [SelectAwardClick] 获得的奖励物品 */
exports.log02015 = 2015; /* [IndianaFiveButton] 获得所有奖励 */
exports.log02016 = 2016; /* [IndianaFiveButton] 消耗的物品 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 符灵探险[2051-2100]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log02051 = 2051; /* [GetFairylandStates]获取仙境 */
exports.log02052 = 2052; /* [ConquerFairylandStart]获取Player*/
exports.log02053 = 2053; /* [ConquerFairylandStart]获取仙境 */
exports.log02054 = 2054; /* [ConquerFairylandStart]保存开始战斗时间 */
exports.log02055 = 2055; /* [ConquerFairylandResult] 获取开始战斗时间*/
exports.log02056 = 2056; /* [ConquerFairylandResult]获取仙境 */
exports.log02057 = 2057; /* [ConquerFairylandResult]获取背包 */
exports.log02058 = 2058; /* [ConquerFairylandResult]保存背包 */
exports.log02059 = 2059; /* [ConquerFairylandResult]保存仙境 */
exports.log02060 = 2060; /* [GetFairylandEvents]获取仙境 */
exports.log02061 = 2061; /* [GetFairylandEvents]保存仙境 */
exports.log02062 = 2062; /* [TakeFairylandAwards]获取仙境 */
exports.log02063 = 2063; /* [TakeFairylandAwards]保存仙境 */
exports.log02064 = 2064; /* [TakeFairylandAwards]添加奖励 */
exports.log02065 = 2065; /* [RepressRiot]获取对方好友列表 */
exports.log02066 = 2066; /* [RepressRiot]获取Player */
exports.log02067 = 2067; /* [RepressRiot]获取仙境 */
exports.log02068 = 2068; /* [RepressRiot]保存仙境 */
exports.log02069 = 2069; /* [GetFairylandFriendList]获取好友列表 */
exports.log02070 = 2070; /* [GetFairylandFriendList]保存仙境 */
exports.log02071 = 2071; /* [GetFairylandFriendList]保存仙境 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 活动[2101-2150]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.log02101 = 2101; /* [FundPurchase]基金购买 */
exports.log02102 = 2102; /* [GiftCode]礼品码兑换 */
exports.log02103 = 2103; /* [DailySignQuery]每日签到请求 */
exports.log02104 = 2104; /* [DailySign]每日签到领取 */
exports.log02105 = 2105; /* [TreeOfGold]摇钱树请求 */
exports.log02106 = 2106; /* [ShakeTree]摇钱树摇一摇 */
exports.log02107 = 2107; /* [TreeExtraGold]摇钱树累计摇六次或以上领取额外奖励 */
exports.log02108 = 2108; /* [FundReward]开服基金领取 */
exports.log02109 = 2109; /* [WelfareReward]全民福利领取 */
exports.log02110 = 2110; /* [FundQuery]开服基金请求 */
exports.log02111 = 2111; /* [RewardPower]领仙桃 */
exports.log02112 = 2112; /* [PowerQuery]领仙桃请求 */
exports.log02113 = 2113; /* [VIPDaily]每日福利领取 */
exports.log02114 = 2114; /* [VIPWeek]每周福利领取 */
exports.log02115 = 2115; /* [VIPGiftQuery]VIP礼包请求 */
