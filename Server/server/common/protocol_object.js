
/**
 * 道具对象
 */
var ItemObject = (function() {
    function ItemObject() {
        this.itemId = -1; /* 道具ID */ 
        this.tid = -1; /* 表ID */ 
        this.itemNum = 0; /* 道具数量 */ 

    }
    return ItemObject;
})();

/**
 * 道具属性
 */
var ItemAttributeObject = (function() {
    function ItemAttributeObject() {
        this.itemId = -1; /* 道具ID */ 
        this.tid = -1; /* 表ID */ 
        this.aid = -1; /* 道具属性ID */ 

    }
    return ItemAttributeObject;
})();

/**
 * 副本信息公共对象
 */
var BattleObject = (function() {
    function BattleObject() {
        this.battleId = -1; /* 关卡ID */ 
        this.successCount = -1; /* 通关次数 */ 
        this.fightCount = -1; /* 战斗次数 */ 
        this.bestRate = -1; /* 最高评级 */ 
        this.todaySuccess = 0; /* 今日通关次数 */ 
        this.todayReset = 0; /* 今日重置次数 */ 

    }
    return BattleObject;
})();

/**
 * 抽奖对象
 */
var LotteryObject = (function() {
    function LotteryObject() {
        this.leftTime = 0; /* 剩余时间 */ 
        this.leftNum = 0; /* 剩余次数 */ 
        this.isFree = 0; /* 是否免费 */ 

    }
    return LotteryObject;
})();

/**
 * 公会基础对象
 */
var GuildBaseObject = (function() {
    function GuildBaseObject() {
        this.guildId = ''; /* 公会ID */ 
        this.name = ''; /* 公会名称（8个字） */ 
        this.outInfo = ''; /* 公会宣言（50个字） */ 
        this.inInfo = ''; /* 公会公告（50个字） */ 
        this.memberCount = 0; /* 公会成员计数 */ 
        this.requestType = -1; /* 公会申请状态类型（1--已申请、2--申请、3--满员） */ 
        this.level = -1; /* 公会等级 */ 
        this.exp = -1; /* 公会经验 */ 

    }
    return GuildBaseObject;
})();

/**
 * 公会祭天对象
 */
var GuildWorshipObject = (function() {
    function GuildWorshipObject() {
        this.liveness = 0; /* 公会活跃度 */ 
        this.worshipCount = -1; /* 公会祭拜总次数 */ 

    }
    return GuildWorshipObject;
})();

/**
 * 公会成员对象
 */
var GuildMemberObject = (function() {
    function GuildMemberObject() {
        this.zuid = ''; /* 角色ID */ 
        this.title = -1; /* 公会成员的职位 */ 

    }
    return GuildMemberObject;
})();

/**
 * 公会成员基础对象
 */
var GuildMemberBaseObject = (function() {
    function GuildMemberBaseObject() {
        this.zuid = ''; /* 角色ID */ 
        this.level = -1; /* 用户等级 */ 
        this.power = -1; /* 用户战斗力 */ 
        this.unionContr = -1; /* 公会贡献 */ 
        this.todayWorship = -1; /* 当日祭天贡献值 */ 
        this.iconIndex = -1; /* 用户头像 */ 
        this.nickname = ''; /* 昵称 */ 
        this.time = 0; /* 最后登出时间 */ 

    }
    return GuildMemberBaseObject;
})();

/**
 * 公会动态信息对象
 */
var GuildDynamicInfoObject = (function() {
    function GuildDynamicInfoObject() {
        this.zuid = ''; /* 角色ID */ 
        this.nickname = ''; /* 昵称 */ 
        this.infoType = -1; /* 信息类型（1祭天1、2祭天2、3祭天3、4进入公会、5退出公会、6任命、7罢免） */ 

    }
    return GuildDynamicInfoObject;
})();

/**
 * 商店公用购买对象
 */
var DealInfo = (function() {
    function DealInfo() {
        this.index = -1; /* 物品索引 */ 
        this.buyNum = 0; /* 物品已购买次数 */ 

    }
    return DealInfo;
})();

/**
 * 仙境事件
 */
var FairylandEvent = (function() {
    function FairylandEvent() {
        this.index = -1; /* 表格索引 */ 
        this.tid = -1; /* 物品表格Id */ 
        this.itemNum = -1; /* 物品数量 */ 
        this.friendName = ''; /* 好友名字 */ 

    }
    return FairylandEvent;
})();

/**
 * 任务对象
 */
var TaskObject = (function() {
    function TaskObject() {
        this.taskId = -1; /* 任务索引 */ 
        this.progress = 0; /* 进度 */ 
        this.accepted = -1; /* 是否领取奖励 */ 

    }
    return TaskObject;
})();

/**
 * 仙境好友对象
 */
var FairylandFriend = (function() {
    function FairylandFriend() {
        this.zuid = ''; /* 角色Id */ 
        this.name = ''; /* 名字 */ 
        this.level = -1; /* 等级 */ 
        this.conquerdNum = -1; /* 征服数量 */ 
        this.iconIndex = -1; /* 头像 */ 
        this.exploringNum = -1; /* 探索中数量 */ 
        this.riotingNum = -1; /* 暴乱中数量 */ 

    }
    return FairylandFriend;
})();

/**
 * 邮件
 */
var Mail = (function() {
    function Mail() {
        this.mailId = -1; /* 邮件ID */ 
        this.mailTitle = ''; /* 标题 */ 
        this.mailContent = ''; /* 内容 */ 
        this.mailTime = 0; /* 邮件生成时间 */ 
        this.items = [];

    }
    return Mail;
})();

/**
 * 天魔对象数组
 */
var DemonBoss = (function() {
    function DemonBoss() {
        this.tid = 0; /* 天魔tid */ 
        this.finderId = ''; /* 发现者角色Id */ 
        this.finderName = ''; /* 发现者名字 */ 
        this.findTime = 0; /* 发现时间 */ 
        this.hpLeft = 0; /* 剩余血量 */ 
        this.ifShareWithFriend = 0; /* 是否分享给好友 */ 
        this.finderTid = -1; /* 发现者的角色tid */ 
        this.quality = -1; /* 天魔品质 */ 
        this.standingTime = -1; /* 天魔停留时间 */ 
        this.bossLevel = -1; /* 天魔等级 */ 
        this.hpBase = 0; /* 天魔的初始化血量 */ 

    }
    return DemonBoss;
})();

/**
 * 天魔乱入伤害排行
 */
var DamageRanklistObject = (function() {
    function DamageRanklistObject() {
        this.nickname = ''; /* 昵称 */ 
        this.playerId = -1; /* 用户ID */ 
        this.power = -1; /* 战斗力 */ 
        this.headIconId = -1; /* 头像Id */ 
        this.ranking = -1; /* 排名 */ 
        this.vipLv = 0; /* VIP等级 */ 
        this.damage = 0; /* 伤害值 */ 

    }
    return DamageRanklistObject;
})();

/**
 * 天魔乱入功勋排行
 */
var FeatsRanklistObject = (function() {
    function FeatsRanklistObject() {
        this.nickname = ''; /* 昵称 */ 
        this.playerId = -1; /* 用户ID */ 
        this.power = -1; /* 战斗力 */ 
        this.headIconId = -1; /* 头像Id */ 
        this.ranking = -1; /* 排名 */ 
        this.vipLv = 0; /* VIP等级 */ 
        this.feats = 0; /* 功勋 */ 

    }
    return FeatsRanklistObject;
})();

/**
 * 群魔乱舞排行
 */
var ClimbTowerStarsRankObject = (function() {
    function ClimbTowerStarsRankObject() {
        this.nickname = ''; /* 昵称 */ 
        this.power = -1; /* 战斗力 */ 
        this.headIconId = -1; /* 头像Id */ 
        this.ranking = -1; /* 排名 */ 
        this.vipLv = 0; /* VIP等级 */ 
        this.starCount = 0; /* 星星数量 */ 

    }
    return ClimbTowerStarsRankObject;
})();

/**
 * 竞技场排行
 */
var ArenaRankObject = (function() {
    function ArenaRankObject() {
        this.nickname = ''; /* 昵称 */ 
        this.playerId = -1; /* 用户ID */ 
        this.power = -1; /* 战斗力 */ 
        this.headIconId = -1; /* 头像Id */ 
        this.ranking = -1; /* 排名 */ 

    }
    return ArenaRankObject;
})();

/**
 * 宗门排行
 */
var GuildRanklistObject = (function() {
    function GuildRanklistObject() {
        this.guildName = ''; /* 宗门名字 */ 
        this.hierarchName = ''; /* 教主名 */ 
        this.currMemberCount = -1; /* 当前成员数 */ 
        this.ranking = -1; /* 排名 */ 
        this.guildLv = 0; /* 宗门等级 */ 

    }
    return GuildRanklistObject;
})();

/**
 * 主界面排行
 */
var MainUIRanklistObject = (function() {
    function MainUIRanklistObject() {
        this.nickname = ''; /* 昵称 */ 
        this.power = -1; /* 战斗力 */ 
        this.headIconId = -1; /* 头像Id */ 
        this.ranking = -1; /* 排名 */ 
        this.vipLv = 0; /* VIP等级 */ 
        this.level = 0; /* 用户等级 */ 
        this.guildName = ''; /* 公会名 */ 

    }
    return MainUIRanklistObject;
})();

/**
 * 聊天记录
 */
var ChatRecord = (function() {
    function ChatRecord() {
        this.zuid = ''; /* 角色Id */ 
        this.name = ''; /* 名字 */ 
        this.charTid = -1; /* 主角tid */ 
        this.msg = ''; /* 消息内容 */ 
        this.targetName = ''; /* 目标名字 */ 

    }
    return ChatRecord;
})();

/**
 * GM禁言req对象
 */
var DontChatReqObject = (function() {
    function DontChatReqObject() {
        this.zid = 0; /* 区ID */ 
        this.uid = -1; /* 用户ID */ 
        this.name = ''; /* 名字 */ 
        this.endTime = 0; /* 结束时间 */ 

    }
    return DontChatReqObject;
})();

/**
 * 夺宝目标
 */
var RobAim = (function() {
    function RobAim() {
        this.uid = 0; /* 目标Id */ 
        this.name = ''; /* 目标名字 */ 
        this.level = 0; /* 主角等级 */ 
        this.charTid = 0; /* 主角Tid */ 
        this.petTid = []; /* 符灵Tid数组 */ 

    }
    return RobAim;
})();

/**
 * 被夺历史
 */
var HistoryOfRobbed = (function() {
    function HistoryOfRobbed() {
        this.uid = 0; /* 抢夺者Id */ 
        this.name = ''; /* 抢夺者名字 */ 
        this.tid = 0; /* 被抢物品tid */ 
        this.robTime = 0; /* 被抢时间 */ 

    }
    return HistoryOfRobbed;
})();

/**
 * 选区信息
 */
var InfoOfZone = (function() {
    function InfoOfZone() {
        this.zid = 0; /* 区ID */ 
        this.zname = ''; /* 区名称 */ 
        this.zstate = 0; /* 区状态 */ 
        this.pname = ''; /* 玩家名字 */ 
        this.plevel = 0; /* 玩家等级 */ 
        this.lastTime = 0; /* 最近的登陆时间 */ 

    }
    return InfoOfZone;
})();

/**
 * 走马灯对象
 */
var RollPlayingObject = (function() {
    function RollPlayingObject() {
        this.rollid = 0; /* 走马灯ID */ 
        this.content = ''; /* 内容 */ 
        this.playInterval = 0; /* 播放间隔 */ 
        this.playCount = 0; /* 播放次数(最多99次) */ 
        this.beginTime = 0; /* 开始时间（utc时间） */ 
        this.endTime = 0; /* 结束时间（utc时间） */ 

    }
    return RollPlayingObject;
})();

/**
 * 好友信息
 */
var FriendInfo = (function() {
    function FriendInfo() {
        this.friendId = ''; /* 好友角色Id */ 
        this.name = ''; /* 名字 */ 
        this.level = -1; /* 等级 */ 
        this.lastLoginTime = -1; /* 最后登录时间 */ 
        this.icon = -1; /* 头像 */ 
        this.power = 0; /* 战斗力 */ 
        this.guildName = ''; /* 公会名 */ 

    }
    return FriendInfo;
})();

/**
 * 月卡信息
 */
var MonthCard = (function() {
    function MonthCard() {
        this.cardType = 0; /* 月卡类型 */ 
        this.purchased = -1;

    }
    return MonthCard;
})();

/**
 * 关卡任务
 */
var BattleTask = (function() {
    function BattleTask() {
        this.taskId = -1; /* 任务Id */ 
        this.finished = 0; /* 是否完成 */ 

    }
    return BattleTask;
})();

/**
 * 开服狂欢对象
 */
var RevelryObject = (function() {
    function RevelryObject() {
        this.revelryId = -1; /* 狂欢Id */ 
        this.progress = 0; /* 进度 */ 
        this.accepted = 0; /* 是否领取奖励 */ 

    }
    return RevelryObject;
})();

/**
 * 公会BOSS对象
 */
var GuildBoss = (function() {
    function GuildBoss() {
        this.gid = ''; /* 公会ID */ 
        this.mid = -1; /* 怪物ID */ 
        this.monsterHealth = -1; /* 公会BOSS当前血量 */ 
        this.criticalStrikeUID = -1; /* 致命一击玩家ID */ 
        this.criticalStrikeTime = -1; /* 致命一击的时间 */ 
        this.warriors = []; /* 公会BOSS战斗人员  */ 
        this.killedGuildBossIndex = []; /* 击杀过的公会BOSS */ 
        this.nextMid = -1; /* 公会会长制定的公会BOSS的index */ 

    }
    return GuildBoss;
})();

/**
 * 活动相关时间
 */
var ActivityTime = (function() {
    function ActivityTime() {
        this.activityOpenTime = 0; /* 活动开始时间 */ 
        this.activityEndTime = 0; /* 活动结束时间 */ 
        this.rewardEndTime = 0; /* 奖励结束时间 */ 

    }
    return ActivityTime;
})();

/**
 * 每日副本对象
 */
var DailyStage = (function() {
    function DailyStage() {
        this.zid = -1; /* 区ID */ 
        this.uid = ''; /* 用户ID */ 
        this.type = -1; /* 副本类型 */ 
        this.battleTimes = -1; /* 挑战次数 */ 
        this.lastBattleTime = -1; /* 最近一次挑战的时间 */ 

    }
    return DailyStage;
})();

/**
 * 每日副本详细信息对象
 */
var DailyStageDetail = (function() {
    function DailyStageDetail() {
        this.zid = -1; /* 区ID */ 
        this.uid = ''; /* 用户ID */ 
        this.mid = -1; /* 副本INDEX */ 
        this.health = -1; /* BOSS血量 */ 
        this.battleStartTime = -1; /* 战斗开始时间 */ 
        this.battleEndTime = -1; /* 战斗结束时间 */ 
        this.lastBattleTime = -1; /* 最近一次挑战的时间 */ 

    }
    return DailyStageDetail;
})();

/**
 * 符灵战斗信息
 */
var PetFightDetail = (function() {
    function PetFightDetail() {
        this.tid = 0; /* 符灵Tid */ 
        this.attack = 0; /* 攻击力 */ 
        this.hp = 0; /* 生命值 */ 
        this.phyDef = 0; /* 物防值 */ 
        this.mgcDef = 0; /* 法防值 */ 
        this.criRt = 0; /* 暴击率 */ 
        this.dfCriRt = 0; /* 抗暴率 */ 
        this.hitTrRt = 0; /* 命中率 */ 
        this.gdRt = 0; /* 闪避率 */ 
        this.hitRt = 0; /* 伤害率 */ 
        this.dfHitRt = 0; /* 减伤率 */ 

    }
    return PetFightDetail;
})();

/**
 * 玩家战斗信息
 */
var PlayerFightDetail = (function() {
    function PlayerFightDetail() {
        this.name = ''; /* 玩家名字 */ 
        this.level = 0; /* 主角等级 */ 
        this.power = 0; /* 战斗力 */ 
        this.petFDs = []; /* 符灵战斗信息 */ 

    }
    return PlayerFightDetail;
})();

/**
 * 竞技场战斗人员对象
 */
var ArenaWarrior = (function() {
    function ArenaWarrior() {
        this.name = ''; /* 名字 */ 
        this.level = -1; /* 用户等级 */ 
        this.rank = -1; /* 排名 */ 
        this.power = -1; /* 战斗力 */ 
        this.uid = ''; /* 用户Id */ 
        this.vipLevel = 0; /* VIP等级 */ 
        this.tid = 0; /* 玩家头像 */ 
        this.pets = []; /* 宠物头像 */ 
        this.bestRank = 0; /* 最好排名 */ 
        this.canBattle = 0; /* 是否可以进行战斗 */ 

    }
    return ArenaWarrior;
})();

/**
 * 竞技场战斗记录
 */
var ArenaBattleRecord = (function() {
    function ArenaBattleRecord() {
        this.rivalUid = ''; /* 对手用户ID */ 
        this.attackTime = -1; /* 攻击时间 */ 
        this.rankChange = -1; /* 排名变化 */ 

    }
    return ArenaBattleRecord;
})();

/**
 * 公告信息
 */
var AnnounceObject = (function() {
    function AnnounceObject() {
        this.annid = 0; /* 公告id */ 
        this.content = ''; /* 内容 */ 
        this.title = ''; /* 标题 */ 

    }
    return AnnounceObject;
})();

/**
 * 超级玩家角色信息
 */
var SuperPlayerInfo = (function() {
    function SuperPlayerInfo() {
        this.name = ''; /* 名字 */ 
        this.gold = 0; /* 硬币 */ 
        this.diamond = 0; /* 元宝 */ 
        this.soulPoint = 0; /* 符魂 */ 
        this.reputation = 0; /* 声望 */ 
        this.prestige = 0; /* 威名 */ 
        this.battleAchv = 0; /* 战功 */ 
        this.unionContr = 0; /* 公会贡献 */ 

    }
    return SuperPlayerInfo;
})();

/**
 * 超级玩家主角和符灵信息
 */
var SuperPetInfo = (function() {
    function SuperPetInfo() {
        this.teamPos = 0; /* 阵位 */ 
        this.tid = 0; /* 表格Id */ 
        this.level = 1; /* 等级 */ 
        this.breakLevel = 0; /* 突破等级 */ 
        this.skillLevel = []; /* 技能等级 */ 

    }
    return SuperPetInfo;
})();

/**
 * 超级玩家装备和法器信息
 */
var SuperEquipInfo = (function() {
    function SuperEquipInfo() {
        this.teamPos = 0; /* 阵位 */ 
        this.tid = 0; /* 表格Id */ 
        this.strengthenLevel = 1; /* 强化等级 */ 
        this.refineLevel = 0; /* 精炼等级 */ 

    }
    return SuperEquipInfo;
})();

/**
 * 限时抢购商品
 */
var FlashSaleItem = (function() {
    function FlashSaleItem() {
        this.index = -1; /* 商品下标 */ 
        this.putawayTime = 0; /* 上架时间 */ 
        this.state = -1; /* 商品状态 */ 

    }
    return FlashSaleItem;
})();

/**
 * 单冲情况对象
 */
var SingleRecharge = (function() {
    function SingleRecharge() {
        this.index = 0; /* 表格索引 */ 
        this.rechargeCnt = 0; /* 充值次数 */ 
        this.revCnt = 0; /* 奖励领取次数 */ 

    }
    return SingleRecharge;
})();

/**
 * 声明全局对象
 */
exports.ItemObject = ItemObject; /* 道具对象 */
exports.ItemAttributeObject = ItemAttributeObject; /* 道具属性 */
exports.BattleObject = BattleObject; /* 副本信息公共对象 */
exports.LotteryObject = LotteryObject; /* 抽奖对象 */
exports.GuildBaseObject = GuildBaseObject; /* 公会基础对象 */
exports.GuildWorshipObject = GuildWorshipObject; /* 公会祭天对象 */
exports.GuildMemberObject = GuildMemberObject; /* 公会成员对象 */
exports.GuildMemberBaseObject = GuildMemberBaseObject; /* 公会成员基础对象 */
exports.GuildDynamicInfoObject = GuildDynamicInfoObject; /* 公会动态信息对象 */
exports.DealInfo = DealInfo; /* 商店公用购买对象 */
exports.FairylandEvent = FairylandEvent; /* 仙境事件 */
exports.TaskObject = TaskObject; /* 任务对象 */
exports.FairylandFriend = FairylandFriend; /* 仙境好友对象 */
exports.Mail = Mail; /* 邮件 */
exports.DemonBoss = DemonBoss; /* 天魔对象数组 */
exports.DamageRanklistObject = DamageRanklistObject; /* 天魔乱入伤害排行 */
exports.FeatsRanklistObject = FeatsRanklistObject; /* 天魔乱入功勋排行 */
exports.ClimbTowerStarsRankObject = ClimbTowerStarsRankObject; /* 群魔乱舞排行 */
exports.ArenaRankObject = ArenaRankObject; /* 竞技场排行 */
exports.GuildRanklistObject = GuildRanklistObject; /* 宗门排行 */
exports.MainUIRanklistObject = MainUIRanklistObject; /* 主界面排行 */
exports.ChatRecord = ChatRecord; /* 聊天记录 */
exports.DontChatReqObject = DontChatReqObject; /* GM禁言req对象 */
exports.RobAim = RobAim; /* 夺宝目标 */
exports.HistoryOfRobbed = HistoryOfRobbed; /* 被夺历史 */
exports.InfoOfZone = InfoOfZone; /* 选区信息 */
exports.RollPlayingObject = RollPlayingObject; /* 走马灯对象 */
exports.FriendInfo = FriendInfo; /* 好友信息 */
exports.MonthCard = MonthCard; /* 月卡信息 */
exports.BattleTask = BattleTask; /* 关卡任务 */
exports.RevelryObject = RevelryObject; /* 开服狂欢对象 */
exports.GuildBoss = GuildBoss; /* 公会BOSS对象 */
exports.ActivityTime = ActivityTime; /* 活动相关时间 */
exports.DailyStage = DailyStage; /* 每日副本对象 */
exports.DailyStageDetail = DailyStageDetail; /* 每日副本详细信息对象 */
exports.PetFightDetail = PetFightDetail; /* 符灵战斗信息 */
exports.PlayerFightDetail = PlayerFightDetail; /* 玩家战斗信息 */
exports.ArenaWarrior = ArenaWarrior; /* 竞技场战斗人员对象 */
exports.ArenaBattleRecord = ArenaBattleRecord; /* 竞技场战斗记录 */
exports.AnnounceObject = AnnounceObject; /* 公告信息 */
exports.SuperPlayerInfo = SuperPlayerInfo; /* 超级玩家角色信息 */
exports.SuperPetInfo = SuperPetInfo; /* 超级玩家主角和符灵信息 */
exports.SuperEquipInfo = SuperEquipInfo; /* 超级玩家装备和法器信息 */
exports.FlashSaleItem = FlashSaleItem; /* 限时抢购商品 */
exports.SingleRecharge = SingleRecharge; /* 单冲情况对象 */

