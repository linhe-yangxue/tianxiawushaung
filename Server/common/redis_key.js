///<KeyNeedDelete>要删除的key</KeyNeedDelete>
///<SortedSetNeedMerge>要合并的有序集合</SortedSetNeedMerge>

/** 服务器状态与玩家账号信息 */
exports.keyHashZoneInfo = 'hashZoneInfo'; /* 区信息 */
exports.keyStringUidSerial = 'stringUidSerial'; /* Uid计数，用于生成Uid  */
exports.keyStringZidSerial = 'stringZidSerial'; /* Zid计数，用于生成Zid  */
exports.keyHashUserLoginInfoByUid = 'hashUserLoginInfoByUid'; /* 储存用户的附属信息，对象 UserLoginInfo*/
exports.keyHashUidByChannelAcc = 'hashUidByChannelAcc'; /* 用渠道和账号获取用户Id Field是用渠道和账号，Value是Uid*/
exports.keyStringUserAccountByUid = 'stringUserAccountByUid'; /* 用户Id查找账号对象UserAccount  */
exports.keyStringUserAccountByRegToken = 'stringUserAccountByRegToken';   /* 注册Token查找账号对象UserAccount */
exports.keyStringUidByLoginToken  = 'stringUidByLoginToken'; /* 注册token查找Uid */
exports.keyHashSealAccountByZid  = 'hashSealAccountByZid'; /* 封号信息,Feild是uid 值为SealAccountInfo对象*/
exports.keyStringRegisterInfo  = 'stringRegisterInfo'; /* 注册状态, value=0,不能注册，=1能注册 */
exports.keyHashUidByChannelIdGuid  = 'hashUidByChannelId'; /* 通过SDK 的id 绑定uid */
exports.keySetChannelsByZid = 'setChannelsByZid'; /* 特定区的渠道集合 */
exports.keyStringOnlineNumByZidChannel = 'stringOnlineNumByZidChannel'; /* 特定区的渠道用户在线人数 */
exports.keyHashZoneMemCnt = 'hashZoneMemCnt'; /* 记录区的人数 */
exports.keyHashChannelInfoByUid = 'hashChannelInfoByUid'; /* 通过uid绑定渠道id */
exports.keyHashRollPlaying= 'hashRollPlaying'; /* 全服走马灯信息 键值为自增id， value:RollPlayingInfo对象*/
exports.keyHashIncrAnnounceId= 'hashIncrAnnounceId'; /*公告自增id*/
exports.keyHashAnnounceByChannel= 'hashAnnounceByChannel'; /* 公告信息 value:AnnounceInfo对象*/
exports.keyHashWhiteListByZid= 'hashWhiteListByZid'; /* 全服白名单信息 键值为mac地址， value:WhiteListInfo对象*/
exports.keyHashChannelRateByChannel = 'hashChannelRateByChannel'; /*渠道返利*/
exports.keyStringActivationGiftId = 'stringActivationGiftId'; /* 用于礼包码礼包ID自增 */
exports.keyHashActivationGift= 'hashActivationGift'; /* 全服礼包码礼包信息 键值为自增id， value:ActivationGiftInfo对象*/
exports.keyHashActivationCode= 'hashActivationCode'; /* 全服礼包码信息 键值为礼包码， value:ActivationGiftInfo对象*/
exports.keyHashRechargeAmount = 'hashRechargeAmount'; /* 玩家充值总金额 value ChannelUidMoney对象 */
exports.keyStringMacByUid = 'stringMacByUid'; /* uid绑定mac地址 */
exports.keyHashPowerRank = 'hashPowerRank'; /*记录 公测要回馈的战力前500名玩家信息 */
exports.keyHashPvpRank = 'hashPvpRank'; /*记录 公测要回馈的竞技场前50名玩家信息 */


/** 区数据 */
exports.keyHashWorldChatRcdByZid = 'hashWorldChatRcdByZid'; /* 世界聊天记录 */
exports.keyStringWorldChatTailByZid = 'stringWorldChatTailByZid'; /* 世界聊天当前纪录序号 */
exports.keyHashGameTokenByZid = 'hashGameTokenByZid'; /* 区全部的game token */
exports.keyHashMacByZid = 'hashMacByZid'; /* 区玩家mac */
exports.keyStringZuidByName = 'stringZuidByName'; /* 玩家名到zuid 的映射 */
exports.keyHashHalfPriceNumByZid = 'hashHalfPriceNumByZid'; /* 半价商品购买数量数组 */
exports.keySortedCustomMadeMailByZid = 'sortedCustomMadeMailByZid';/*定制邮件集合*/
exports.keyHashActivityTimeByZid = 'hashActivityTimeByZid'; /*GM工具设置的活动时间*/
exports.keyHashZuidInZone = 'hashZuidInZone'; /* 区中创角的Zuid  */

/** 玩家游戏数据 */
exports.keySetLoginRecordByZuid = 'setLoginRecordByZuid'; /* 登陆日期集合 */
exports.keyStringPlayerByZuid = 'stringPlayerByZuid';  /* 玩家，对象 Player */
exports.keySortedSetLastHBTimeByZid = 'sortedSetLastHBTimeByZid'; /* 最后心跳时间 */
exports.keySetFriendsByZuid = 'setFriendsByZuid'; /* 好友uid集合 */
exports.keySetFriendRequestsByZuid = 'setFriendRequestsByZuid'; /* 好友申请者uid列表 */
exports.keySetSpiritSendRcdsByZuidDate = 'setSpiritSendRcdsByZuidDate'; /* 精力赠送记录 */
exports.keySetSpiritRcvListByZuid = 'setSpiritRcvListByZuid'; /* 可领精力列表 */
exports.keyStringSpiritRcvCntByZuidDate = 'stringSpiritRcvCntByZuidDate'; /* 当天精力领取次数 */
exports.keyStringPackageByZuidPkgId = 'stringPackageByZuidPkgId'; /* 背包,对象 Package */
exports.keyStringMOAMByZuidDate = 'stringMOAMByZuidDate'; /* 天魔副本伤害输出和功勋值，对象 DamageOutputAndMerit */
exports.keyStringFDBIByZuid = 'stringFDBIByZuid'; /* 玩家当前攻击的天魔信息，对象  FightDemonBossInfo */
exports.keyStringDemonBossRcdByZuid = 'stringDemonBossRcdByZuid'; /* 触发的天魔记录，对象 DemonBossRcd */
exports.keyStringDemonBossResetFlagByZuid = 'stringDemonBossResetFlagByZuid'; /* 天魔等级重置标志 */
exports.keySetMeritAwardListByZuidDate = 'setMeritAwardListByZuidDate'; /* 功勋奖励领取记录 */
exports.keyStringTowerClimbingInfoByZuid = 'stringTowerClimbingInfoByZuid'; /* 爬塔信息 */
exports.keySetNotificationByZuid = 'setNotificationByZuid'; /* 状态通知 */
exports.keyStringFairylandsByZuid = 'stringFairylandsByZuid'; /* 仙境数组 */
exports.keyStringFDFightBeginByZuid = 'stringFDFightBeginByZuid'; /* 仙境战斗开始时间 */
exports.keyStringFDRepressCntByZuidDate = 'stringFDRepressCntByZuidDate'; /* 仙境镇压次数 */
exports.keySortSetMailByZuid = 'sortSetMailByZuid'; /* 存邮件  对象名 Mail*/
exports.keyStringMailIdByZuid = 'stringMailIdByZuid'; /* 用于邮件ID[mailId]自增 */
exports.keyStringAllMailIdByZuid = 'stringAllMailIdByZuid'; /* 用于全服邮件 */
exports.keyStringMailBeginTimeByZuid = 'stringMailBeginTimeByZuid'; /* 用于定制邮件 */
exports.keyStringFateExpDateByZuidItemId = 'stringFateExpDateByZuidItemId'; /* 用于天命值每天零点清零操作 */
exports.keyStringFateStoneByZuidItemId = 'stringFateStoneByZuidItemId'; /* 保存当前天命等级消耗的天命石 */
exports.keyHashBattleMainByZuid = 'hashBattleMainByZuid'; /* 主线关卡信息保存，Battle 对象数组 */
exports.keyStringPointStarIndexByZuid = 'stringPointStarIndexByZuid'; /* 用于点星中保存当前到达index操作 */


exports.keyStringNormalLotteryByZuid = 'stringNormalLotteryByZuid'; /* 记录操作普通抽奖时的抽奖状态,NormalLottery对象 */
exports.keyStringPreciousLotteryByZuid = 'stringPreciousLotteryByZuid'; /* 记录操作高级抽奖时的抽奖状态,LotteryObject */

exports.keyStringNormalIdByZuid = 'stringNormalIdByZuid'; /* 记录操作普通抽奖时的GROUP_ID */
exports.keyStringPreciousIdByZuid = 'stringPreciousIdByZuid'; /* 记录操作高级抽的GROUP_ID */
exports.keyStringWorldChatCntByZuidDate = 'stringWorldChatCntByZuidDate';   /* 世界聊天的次数 */
exports.keyHashPrivateChatRcdByZuid = 'hashPrivateChatRcdByZuid'; /* 私聊记录 */
exports.keyStringPrivateChatTailByZuid = 'stringPrivateChatTailByZuid'; /* 私聊当前记录序号 */
exports.keyHashMarketBuyByZuid = 'hashMarketBuyByZuid'; /* 记录商店物品购买次数,Field是商城表的tid 值为 Buy对象 */
exports.keyStringMarketTimeByZuid = 'stringMarketTimeByZuid'; /* 集市商店购买时间用于刷新 */
exports.keyHashVipShopByZuid = 'hashVipShopByZuid'; /* 保存vip商店购买礼包的状态信息 Buy类对象 */
exports.keyHashClothBuyByZuid = 'hashClothBuyByZuid'; /* 记录神装商店物品购买次数，Field是商城表的tid 值为 Buy对象*/
exports.keyStringClothTimeByZuid = 'stringClothTimeByZuid'; /* 记录神装商店物品购买时间用于每日刷新 */
exports.keyHashPrestigeBuyByZuid = 'hashPrestigeBuyByZuid'; /* 记录声望商店物品购买次数 Field是商城表的tid 值为 Buy对象*/
exports.keyStringPrestigeTimeByZuid = 'stringPrestigeTimeByZuid'; /* 记录声望商店物品购买时间用于每日刷新 */
exports.keyHashDemonBuyByZuid = 'hashDemonBuyByZuid'; /* 记录战功商店物品购买次数 Field是商城表的tid value为 Buy对象 */
exports.keyStringSignStateByZuid = 'stringSignStateByZuid'; /* 记录签到状态，存储对象为 signObject */
exports.keyStringMysteryShopByZuid = 'stringMysteryShopByZuid2'; /* 神秘商店记录数据，value为MysteryShop类对象 */
exports.keyStringShakeTreeByZuid = 'stringShakeTreeByZuid'; /* 摇钱树记录数据 value 为TreeState类对象 */
exports.keyStringFundBuyBeforeByZuid = 'stringFundBuyBeforeByZuid';  /* 开服基金记录玩家是否购买过 */
exports.keyHashFundRewardByZuid = 'hashFundRewardByZuid';  /* 记录开服基金所有福利领取状态信息 field: 配表索引index  value: 配表index*/
exports.keyStringFundRewardByZid = 'stringFundRewardByZid';  /* 开服基金记录全服购买人数 */
exports.keySetGiftCodeByZuid = 'setGiftCodeByZuid';  /* 记录礼品码是否兑换 member 为礼品码*/
exports.keyStringRewardPowerByZuid = 'stringRewardPowerByZuid';  /* 记录玩家领仙桃信息 PowerInfo类对象 */
exports.keyStringVipDailyGiftByZuid = 'stringVipDailyGiftByZuid'; /* 记录玩家vip礼包每日福利领取信息  Welfare类对象 */
exports.keyHashVipWeeklyGiftByZuid = 'hashVipWeeklyGiftByZuid'; /* 记录玩家vip礼包每周福利领取信息 VIP等级作为域和值*/
exports.keyStringVipWeeklyGiftTimeByZuid = 'stringVipWeeklyGiftTimeByZuid'; /* 记录玩家vip礼包每周福利中的周一时间 */
exports.keyStringVipWeeklyGiftRedPointTimeStamp = 'stringVipWeeklyGiftRedPointTimeStamp'; /* vip周礼包红点时间戳 */
exports.keyStringGuideProgressByZuid = 'stringGuideProgressByZuid'; /* 新手引导进度 */
exports.keyHashActDiamondStatusByZuid = 'listActDiamondStatusByZuid';/*消费返利福利领取情况*/
exports.keyStringCostDiamondByZuid = 'stringCostDiamondByZuid'; /*消费元宝数量*/
exports.keyHashGoodsHaveBuyNumByZuid = 'hashGoodsResidueBuyNumByZuid';/*限购剩余购买次数*/
exports.keyStringActGoodsBuyTimeByZuid = 'stringActGoodsBuyTimeByZuid';/*购买时间*/
exports.keyStringAtlasByZuid = 'stringAtlasByZuid';/* 图鉴红点 */
exports.keyHashGuildNoticeByZuid = 'hashGuildNoticeByZuid';/* 公会成员红点 */
exports.keyStringTowerClimbinggroupPriceByZuid = 'stringTowerClimbinggroupPriceByZuid'; /* 爬塔失败推荐道具价格 */
exports.keySortedSetWallPaperByZid = 'sortedSetWallPaperByZid'; /* 玩家走马灯信息 */
exports.keyStringWallPaperTimerByZuid = 'stringWallPaperTimerByZuid'; /* 保存与玩家走马灯有关的时间戳 */
exports.keyHashSingleRechargeByZuid = 'hashSingleRechargeByZuid'; /* 单冲活动信息 */
exports.keyStringLastRechargeTimeByZuid = 'stringLastRechargeTimeByZuid'; /* 最近充值时间 */


/** 夺宝之战 */
exports.keyStringTruceTimeByZuid = 'stringTruceTimeByZuid'; /* 免战时间 */
exports.keyListRobbedHistoryByZuid = 'listRobbedHistoryByZuid'; /* 被抢夺记录，对象HistoryOfRobbed */
exports.keyStringRobAimListByZuidTid = 'stringRobAimListByZuidTid'; /* 夺宝目标列表 */
exports.keyStringStartRobRecordByZuid = 'stringStartRobRecordByZuid'; /* 开始夺宝记录 */
exports.keyStringFirstRobByZuid = 'stringFirstRobByZuid'; /* 第一次夺宝标记 */
exports.keySortedSetMagicOwnerUidbyZid = 'sortedSetMagicOwnerUidbyZid'; /*  法器拥有者uid集合  */

exports.keyHashAtlasByZuid = 'hashAtlasByZuid'; /* 图鉴存储符灵tid */
exports.keyStringRemoveTimeByZuid = 'stringRemoveTimeByZuid'; /* 当用户自己退出公会时记录当时的时间 */
exports.keyStringTreasureBoxByZuid = 'stringTreasureBoxByZuid'; /* 日常任务中的宝箱信息   键值为区zid,uid， value:宝箱的相关信息TreasureBoxObject */
exports.keyHashDailyTaskByZuid = 'hashDailyTaskByZuid'; /* 每日任务信息  键值为区zid,uid， value:任务相关信息TaskObject */
exports.keyHashAchvTaskByZuid = 'hashAchvTaskByZuid'; /* 成就任务信息  键值为区zid,uid， value:任务相关信息TaskObject*/
exports.keyStringBattleTaskIdArrByZuid = 'stringBattleTaskIdArrByZuid'; /* 关卡任务Id数组 */
exports.keySetBattleTaskBoxByZuid = 'setBattleTaskBoxByZuid'; /* 已领取的关卡宝箱列表 */
exports.keyHashRevelryAwardRcdByZuid = 'hashRevelryAwardRcdByZuid'; /* 开服狂欢奖励领取记录 */
exports.keyHashRevelryProgressByZuid = 'hashRevelryProgressByZuid'; /* 开服狂欢进度 */
exports.keyStringLoginOtherByZuid = 'stringLoginOtherByZuid'; /* 次日登陆领奖 */
exports.keyStringLoginRewardTimeByZuid = 'stringLoginRewardTimeByZuid'; /* 设置次日登陆领奖首次请求时间  */
exports.keyStringLuckyCardByZuid = 'stringLuckyCardByZuid '; /*幸运翻牌 键值uid，zid， value*/
exports.keyListPackageIndexByZuid = 'listPackageIndexByZuid '; /*包序号*/
exports.keyHashMonthCardByZuid = 'hashMonthCardByZuid '; /* 保存已领取月卡在配表中的对应的索引，field:index, value:index */
exports.keyStringCardTimeByZuid = 'stringCardTimeByZuid '; /* 保存每次请求月卡页面的时间戳 */
exports.keyHashCporderDateByZuid = 'hashCporderDateByZuid '; /* 保存每次购买月卡后 结束日期加30天 */
exports.keyStringFirstChargeReceiveByZuid = 'stringFirstChargeReceiveByZuid '; /* 记录首冲奖励是否已领取 */
exports.keyStringChargeTotalByZuid = 'stringChargeTotalByZuid '; /* 保存累计充值总金额 */
exports.keyStringChargeSingleByZuid = 'stringChargeSingleByZuid '; /* 保存单笔充值信息 */
exports.keyHashChargeRewardByZuid = 'hashChargeRewardByZuid '; /* 保存累充送礼已领取奖励所对应配表的索引 field: index value:index*/
exports.keySetOrderByZuid = 'setOrderByZuid '; /* 保存已充值成功的订单号 member:订单号 */
exports.keySetShelfIdByZuid = 'setShelfIdByZuid '; /*保存每种充值金额首次充值时所对应配表中的索引 */
exports.keyStringLastDateByZuid = 'stringLastDateByZuid '; /* 保存上次登录的日期 格式为:'yyyy-mm-dd'*/
exports.keyStringLoginDayByZuid = 'stringLoginDayByZuid '; /* 保存已登录天数 */
exports.keyHashAwardIndexByZuid = 'hashAwardIndexByZuid '; /* 保存已领取奖励所对应配表中索引 field:index, value: index*/
exports.keyStringShootStateByZuid = 'StringShootStateByZuid'; /* 射手乐园状态状态 */
exports.keyStringLuxurySignStateByZuid = 'stringLuxurySignStateByZuid'; /* 豪华签到信息， value：LuxurySign对象 */
exports.keyStringBuyArrHalfPriceByZuid = 'listStringArrHalfPriceByZuid'; /* 获取七天半价商品购买状态数组 */
exports.keyStringRankActRdPtDateByZuid = 'stringRankActRdPtDateByZuid'; /* 排名活动红点时间戳 */



exports.keyHashOrderDetailByOrderNum = 'hashOrderDetailByOrderNum '; /*通过订单号绑定订单详情 */ //TODO:重写
exports.keyHashShelfIdByorderNum = 'hashShelfIdByorderNum '; /* 将订单号和ChargeConfig配表中的索引绑定 field: orderNum(订单号) value:index */ //TODO:重写
exports.keyStringAllServerMailId = 'stringAllServerMailId'; /* 用于全服邮件ID[mailId]自增 */ //TODO:重写
exports.keyHashAllServerMailByZid = 'hashAllServerMailByZid'; /* 全服邮件信息 键值为自增id， value:AllServerMailInfo对象*/ //TODO:重写

/** 公会数据 */
exports.keyStringGidSerial = 'stringGidSerial'; /* Gid计数，用于生成Gid */
exports.keyHashGuildOtherBuyByZgidZuid = 'hashGuildOtherBuyByZgidZuid'; /* 记录公会商店非限时物品购买次数 Field是商城表的tid 值为 Buy对象 */
exports.keyStringGuildOtherTimeByZgidZuid = 'stringGuildOtherTimeByZgidZuid'; /* 记录公会商店不限时物品购买时间用于每日刷新 */
exports.keyHashGuildPrivateLimBuyByZgidZuid = 'hashGuildPrivateLimBuyByZgidZuid'; /* 记录公会商店限时物品个人购买次数 Field是商城表的tid 值为Buy对象 */
exports.keyStringDemonTimeByZuid = 'stringDemonTimeByZuid'; /* 记录战功商店物品购买时间用于每日刷新 */
exports.keyHashGuildRewardByZgidZuid = 'hashGuildRewardByZgidZuid'; /* 记录公会中宝箱奖励领取状态信息域为公会等级guildLevel拼接奖励进度类型rewardType 值为rewardType */
exports.keyHashGuildChatRcdByZgid = 'hashGuildChatRcdByZgid'; /* 公会聊天记录 */
exports.keyStringGuildChatTailByZgid = 'stringGuildChatTailByZgid'; /* 公会聊天当前纪录序号 */
exports.keyHashGuildInfoByPreZid = 'hashGuildInfoByPreZid'; /* 公会信息保存， 键值为区ID value的Hash结构为key:公会ID value:公会信息对象 */
exports.keyStringGidByPreZidName = 'stringGidByPreZidName'; /* 用公会名称获取公会Id key为公会名称，value为公会ID */
exports.keyHashGidArrByZid = 'hashGidArrByZid'; /* 申请公会对象数组信息保存， 键值为区ID，value的Hash结构为key:用户ID value:公会ID数组 */
exports.keyListGuildDynamicByZgid = 'listGuildDynamicByZgid'; /* 公会动态信息列表，键值为区ID，公会ID， value为公会动态信息列表 */
exports.keyHashPublicLimNumByZgid = 'hashPublicLimNumByZidGid'; /* 记录公会商店限时物品购买次数 Field是商城表的tid 值为 Buy对象*/
exports.keyStringPubBuyTimeByZgid = 'stringPubBuyTimeByZidGid'; /* 限时购买共享刷新时间 */

/** 限时抢购 */
exports.keyStringFlashSaleItemsByZuid = 'stringFlashSaleItemsByZuid'; /* 限时抢购商品 */

/** 排行榜 */
///<SortedSetNeedMerge>
exports.keySortedSetZuidInLevelByZid = 'sortedSetZuidInLevelByZid'; /* 玩家等级排名 */
exports.keySortedSetZuidInPowerByZid = 'sortedSetZuidInPowerByZid'; /* 玩家战斗力排行 */
exports.keySortedTowerClimbStarsRankByZid = 'sortedTowerClimbStarsRankByZid'; /* 爬塔排行 */
exports.keySortedSetDamageOutputByZid = 'sortedSetDamageOutputByZid'; /* 伤害输出排行 */
exports.keyTimerSortedSetDamageOutputByZid = 'timerSortedSetDamageOutputByZid'; /* 定时刷新的伤害输出排行 */
exports.keySortedSetMeritByZid = 'sortedSetMeritByZid'; /* 功勋排行 */
exports.keyTimerSortedSetMeritByZid = 'timerSortedSetMeritByZid'; /* 定时刷新的功勋排行 */
exports.keySortedSetGuildByZid = 'sortedSetGuildByZid'; /* 合区后 新区的公会排行，键值为区ID，score为公会等级与升级时间拼成的int，value为公会ID */
///</SortedSetNeedMerge>


/** 每日副本 */
exports.keyHashDailyStageByZuid = 'hashDailyStageByZuid'; /* 每日副本 */
exports.keyHashDailyStageDetailByZuid = 'hashDailyStageDetailByZuid'; /* 每日副本详细信息 */

/** 公会BOSS */
exports.keyStringGuildBossLockByZidZgid = 'stringGuildBossLockByZidZgid'; /* 公会BOSS锁 */
exports.keyHashGuildBossByZid = 'hashGuildBossByZid'; /* 公会BOSS记录 */
exports.keyHashGuildBossWarriorByZidZgid = 'hashGuildBossWarriorByZidZgid'; /* 公会BOSS挑战人员记录 */

/** 竞技场 */
///<KeyNeedDelete>
exports.keyHashArenaWarriorByZid = 'hashArenaWarriorByZid'; /* 竞技场斗士 */
exports.keyListArenaRankListByZid = 'listArenaRankListByZid'; /* 竞技场排名*/
exports.keyListArenaBattleRecordByZidZuid = 'listArenaBattleRecordByZidZuid'; /* 竞技场战斗记录 */
exports.keyStringArenaCannonFodderByZidZuid = 'stringArenaCannonFodderByZidZuid'; /* 竞技场炮灰 */
exports.keyStringArenaBattleLockByZidZuid = 'stringArenaBattleLockByZidZuid'; /* 竞技场战斗锁 */
exports.keyStringArenaWarriorInitLockByZidZuid = 'stringArenaWarriorInitLockByZidZuid'; /* 竞技场战斗人员初始化锁 */
exports.keyStringArenaWarriorFirstBattle = 'stringArenaWarriorFirstBattle '; /* 竞技场战斗人员第一次战斗 */
///</KeyNeedDelete>
