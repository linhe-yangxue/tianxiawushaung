var basic = require('../tools/system/basic');
var inherit = basic.inherit;
var csvManager = require('../manager/csv_manager').Instance();

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 用户登陆信息
 */
var UserLoginInfo = (function() {
    function UserLoginInfo() {
        this.zid = 0; /* 区Id */
        this.name = ''; /* 名字 */
        this.level = 0; /* 等级 */
        this.lastTime = 0; /* 最后登录时间 */
    }
    return UserLoginInfo;
})();
exports.UserLoginInfo = UserLoginInfo;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 玩家
 */
var Player = (function() {
    function Player() {
        this.name= ""; /* 名字 */
        this.gold = 0; /* 银币 */
        this.diamond = 0; /* 元宝 */
        this.soulPoint = 0;     /* 符魂 */
        this.reputation = 0; /* 声望 */
        this.prestige = 0; /* 威名 */
        this.battleAchv = 0; /* 战功 */
        this.unionContr = 0; /* 公会贡献 */
        this.vipLevel = 0; /* vip等级 */
        this.vipExp = 0; /* vip经验 */
        this.attack = 0; /* 队伍总攻击力 */
        this.power = 0; /* 战斗力 */
        this.character = new Character(); /* 角色 */
        this.skin = []; /* 皮肤 */
        this.lastLoginTime = parseInt(Date.now() / 1000); /* 最后登陆时间 */
        this.isWorship = 0; /* 公会当日是否贡献 */
        this.todayWorship = 0; /* 当天贡献 */
        this.guildId = ''; /* 公会Id */

        this.stamina = 100; /* 体力 */
        this.spirit = 30; /* 精力 */
        this.beatDemonCard = 10; /* 降魔令 */
        this.staminaStamp = 0; /* 体力恢复开始时间 */
        this.spiritStamp = 0; /* 精力恢复开始时间 */
        this.beatDemonCardStamp = 0; /* 降魔令开始恢复时间 */
        this.dontChatInfo = new DontChatInfo(); /* 禁言信息 */
        this.createDate = '2016-01-01'; /* 创建时间 */
        this.money = 0; /* 充值金额 */
    }
    return Player;
})();
exports.Player = Player;

/**
 * 主角
 */
var Character = (function() {
    function Character() {
        this.tid = 50001; /* 配表Id */
        this.level = 1; /* 等级 */
        this.exp = 0; /* 经验 */
        this.breakLevel = 0; /* 突破等级 */
        this.fateLevel = 0; /* 天命等级 */
        this.fateExp = 0; /* 天命值 */
        this.skillLevel = [1, 1, 1, 1]; /* 技能等级 */
    }
    return Character;
})();
exports.Character = Character;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *  账号表
 */
var UserAccount = (function() {
    function userAccount() {
        this.channel= '';  /* 渠道 */
        this.acc = ''; /* 账号 */
        this.uid = -1 ; /* 用户 */
        this.pw = ''; /* 密码 */
        this.regtoken = ''; /* 注册Token，快速登陆使用 */
    }
    return userAccount;
})();
exports.UserAccount = UserAccount;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 物品基类
 */
var ItemBase = (function () {
    function ItemBase() {
        this.itemId = -1;      /* 物品ID，本人唯一 */
        this.tid = -1;  /* 物品类型，配表Id */
        this.itemNum = -1; /* 物品数量 */
    }
    return ItemBase;
})();
exports.ItemBase = ItemBase;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 宠物
 */
var  ItemPet = (function(parent) {
    inherit(ItemPet, parent);

    function ItemPet() {
        this.teamPos = -1; /*  阵位1-3，缘分位11-16 */
        this.level = 1; /* 等级 */
        this.exp = 0; /* 经验 */
        this.breakLevel = 0; /* 突破等级 */
        this.fateLevel = 0; /* 天命等级 */
        this.fateExp = 0; /* 天命值 */
        this.fateStoneCost = 0; /* 天命石消耗 */
        this.skillLevel = [1, 1, 1, 1]; /* 技能等级 */
        this.inFairyland = 0; /* 仙境探索中 */
    }
    return ItemPet;
})(ItemBase);


/**
 *宠物碎片
 */
var FragmentPet = (function (parent) {
    inherit(FragmentPet, parent);

    function FragmentPet() {
    }
    return FragmentPet;
})(ItemBase);


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 装备
 */
var  ItemEquip = (function(parent) {
    inherit(ItemEquip, parent);

    function ItemEquip() {
        this.teamPos = -1;  /* 阵位0-3 */
        this.strengthenLevel = 1; /* 强化等级 */
        this.strengCostGold = 0; /* 强化消耗的银币 */
        this.refineLevel = 0; /* 精炼等级 */
        this.refineExp = 0; /* 精炼经验值 */
    }
    return ItemEquip;
})(ItemBase);


/**
 * 装备碎片
 */
var FragmentEquip = (function (parent) {
    inherit(FragmentEquip, parent);

    function FragmentEquip() {
    }
    return FragmentEquip;
})(ItemBase);


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 法器
 */
var  ItemMagic = (function(parent) {
    inherit(ItemMagic, parent);

    function ItemMagic() {
        this.teamPos = -1; /* 阵位0-3 */
        this.strengthenLevel = 1; /* 强化等级 */
        this.strengthenExp = 0;  /* 强化经验值 */
        this.refineLevel = 0; /* 精炼等级 */
    }
    return ItemMagic;
})(ItemBase);


/**
 * 法器碎片
 */
var FragmentMagic = (function (parent) {
    inherit(FragmentMagic, parent);

    function FragmentMagic() {
    }
    return FragmentMagic;
})(ItemBase);


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 消耗品
 */
var ItemConsume = (function (parent) {
    inherit(ItemConsume, parent);

    function ItemConsume() {
    }
    return ItemConsume;
})(ItemBase);


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 背包类
 */
var Package = (function() {
    function Package(pType) {
        this.pkgId = pType; /* 背包类型 */
        this.itemIdSerial = 1; /*  序列号，用于生成物品Id*/
        this.content = []; /* 物品对象数组 */
    }

    return  Package;
})();
exports.Package = Package;



/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 邮件类
 */
var Mail = (function() {
    function Mail() {
        this.mailId = 0; /*邮件ID*/
        this.mailTitle = "";  /*邮件标题*/
        this.mailContent = "";  /*邮件内容*/
        this.mailTime = 0;  /*邮件生成时间*/
        this.items = []; /*附件物品，ItemObject对象数组*/
    }

    return  Mail;
})();
exports.Mail = Mail;


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 摇钱树类
 */
var TreeState = (function() {
    function TreeState() {
        this.dayNum = 0; /* 每日摇钱次数 */
        this.allNum = 0; /* 摇钱总次数 */
        this.extraGold = 0; /* 摇钱总银币 */
        this.shakeTime = 0; /* 每日摇钱时间 */
        this.refreshTime = 0; /* 每日摇钱次数刷新时间 */
    }

    return  TreeState;
})();
exports.TreeState = TreeState;


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 领仙桃类
 */
var PeachInfo = (function() {
    function PeachInfo() {
        this.isPower_1 = 0; /* 表示时间段一是否领取 */
        this.isPower_2 = 0; /* 表示时间段二是否领取 */
        this.freshTime = 0; /* 用于零点刷新 */
    }

    return  PeachInfo;
})();
exports.PeachInfo = PeachInfo;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 时装状态类
 */
var ClothState = (function() {
    function ClothState() {
        this.clothID = -1; /*时装ID*/
        this.clothLevel = 0;  /*时装强化等级*/
    }
    return  ClothState;
})();
exports.ClothState = ClothState;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 主线副本对象
 */
var Battle = (function() {
    function Battle() {
        this.battleId = -1; /* 关卡ID */
        this.startTime = parseInt(Date.now()/1000); /* 获取当前时间秒 */
        this.successCount = 0; /* 通关次数 */
        this.fightCount = 0; /* 战斗次数 */
        this.bestRate = 0; /* 最高评级 */
        this.battleStarted = 0; /* 已开始主线副本 */
        this.firstChallenge = 1; /* 是否第一次挑战 */
        this.todaySuccess = 0; /* 今日通关次数 */
        this.todayReset = 0; /* 今日重置次数 */
        this.lastDay = ''; /* 最后通关日期 */
        this.dropIndex = 0; /* 掉落组序号 */
    }
    return Battle;
})();
exports.Battle = Battle;


/**
 * 每日副本(根据类型)
 */
var DailyStage = (function() {
    function DailyStage() {
        this.zid = 0; /* 大区 */
        this.uid = ''; /* 用户ID */
        this.type = 0; /* 每日副本类型 */
        this.battleTimes = 0; /* 挑战次数 */
        this.lastBattleTime = 0; /* 最近一次挑战的时间 */
    }
    return DailyStage;
})();
exports.DailyStage = DailyStage;

/**
 * 每日副本详细信息(根据INDEX)
 */
var DailyStageDetail = (function() {
    function DailyStageDetail() {
        this.zid = 0; /* 大区 */
        this.uid = ''; /* 用户ID */
        this.mid = 0; /* 每日副本INDEX */
        this.health = 0; /* BOSS血量 */
        this.battleStartTime = 0; /* 战斗开始时间 */
        this.battleEndTime = 0; /* 战斗结束时间 */
        this.lastBattleTime = 0; /* 最后一次挑战的时间 */
    }
    return DailyStageDetail;
})();
exports.DailyStageDetail = DailyStageDetail;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 天魔对象数组
 */
var DemonBoss = (function() {
    function DemonBoss() {
        this.tid = 0; /* 天魔tid */
        this.finderId = ''; /* 发现者角色Id */
        this.findTime = 0; /* 发现时间 */
        this.hpLeft = 0; /* 剩余血量 */
        this.ifShareWithFriend = 0; /* 是否分享给好友 */
        this.quality = -1; /* 天魔品质 */
        this.standingTime = -1; /* 天魔的留存时间(单位是秒) */
        this.bossBirthIndex = -1; /* 天魔对应的bossConfig标的INDEX */
    }
    return DemonBoss;
})();
exports.DemonBoss = DemonBoss;

/**
 * 触发天魔的记录
 */
var DemonBossRcd = (function() {
    function DemonBossRcd() {
        this.bossLevel = 0; /* 当前天魔等级 */
        this.bossIndex = -1; /* 当前天魔序号 */
        this.bossAmt = 3; /* 天魔记录总数 */
        this.demonBoss = []; /* 天魔对象数组 */
    }
    return DemonBossRcd;
})();
exports.DemonBossRcd = DemonBossRcd;

/**
 * 当前攻击的天魔信息
 */
var FightDemonBossInfo = (function() {
    function FightDemonBossInfo() {
        this.finderId = 0; /* 发现者Id */
        this.bossIndex = 0; /* 天魔序号 */
        this.hpLeft = 0; /* 天魔剩余血量 */
        this.battleAchv = 0; /* 获得战功 */
        this.meritTimes = 1; /* 功勋加倍倍数 */
        this.damageOutput = 0; /* 伤害 */
    }
    return FightDemonBossInfo;
})();
exports.FightDemonBossInfo = FightDemonBossInfo;

/**
 * 伤害输出和功勋值
 */
var DamageOutputAndMerit = (function() {
    function DamageOutputAndMerit() {
        this.damageOutput = 0; /* 伤害输出 */
        this.merit = 0; /* 功勋值 */
    }
    return DamageOutputAndMerit;
})();
exports.DamageOutputAndMerit = DamageOutputAndMerit;
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 爬塔
 */
var TowerClimbingInfo = (function() {
    function TowerClimbingInfo() {
        this.rankStars = 0; /* 历史最高星 */
        this.currentStars = 0; /* 当前总星 */
        this.remainStars = 0; /* 用于换取buff的剩余星 */
        this.nextTier = 1; /* 将要挑战的层级 */
        this.tierState = 1; /* 挑战状态 */
        this.buffList = []; /* buffer列表 */
        this.chooseBuff = []; /* 将要选择的buff */
        this.starList = []; /* 获得的星历史 */
        this.resetTimes = 0; /* 重置次数 */
        this.lastResetDate = (new Date()).toDateString(); /* 上次重置时间 */
        this.itemOnSale = null; /* 打折商品 */
        this.saleItemState = 1; /* 是否已经购买打折商品 */
        this.crtTierStars = 0; /* 当前挑战的星数 */
        this.startClimbTime = -1; /* 开始爬塔时间 */
        this.previousTierStarNum = 0; /* 上一层获取的星星总数 */
    }
    return TowerClimbingInfo;
})();

exports.TowerClimbingInfo = TowerClimbingInfo;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 公会
 */
var GuildMemInfo = (function() {
    function GuildMemInfo() {
        this.zuid = 0; /* 用户ID */
        this.title = 0; /* 用户宗门中的职位 (教主 -- 2、堂主 -- 1、成员 -- 0)*/
        this.worshipCount = 0; /* 用户当天的祭天次数 */
        this.worshipTime = 0; /* 用户当天祭拜的时间 */
        this.joinTime = 0; /* 用户加入公会的时间 */
    }
    return GuildMemInfo;
})();
exports.GuildMemInfo = GuildMemInfo;

var GuildInfo = (function() {
    function GuildInfo() {
        this.gid = 0; /* 公会ID */
        this.name= ""; /* 公会名字 */
        this.outInfo = ""; /* 公会宣言 */
        this.inInfo = ""; /* 公会公告 */
        this.applyMember = []; /* 申请公会的用户列表 */
        this.member = []; /* 公会成员列表，GuildMemInfo对象 */
        this.level = 0; /* 公会等级 */
        this.exp = 0; /* 公会经验 */
        this.foundingTime = 0; /* 公会创建时间 */
        this.liveness = 0; /* 公会祭天进度 */
        this.worshipCount = 0; /* 公会祭天次数 */
    }
    return GuildInfo;
})();
exports.GuildInfo = GuildInfo;

var GuildDynamicInfo = (function() {
    function GuildDynamicInfo() {
        this.zuid = 0; /* 用户ID */
        this.nickname = 0; /* 用户昵称 */
        this.infoType = 0; /* 用户动态信息类型(1 -- 普通祭天、2 -- 中级祭天、3 -- 高级祭天、4 -- 进入公会、5 -- 退出公会、6 -- 任命教主、7 -- 任命堂主、8 -- 罢免) */
    }
    return GuildDynamicInfo;
})();
exports.GuildDynamicInfo = GuildDynamicInfo;

var GuildBossWarrior = (function() {
    function GuildBossWarrior() {
        this.gid = 0; /* 公会ID */
        this.uid = ''; /* 用户ID */
        this.damage = 0; /* 对公会BOSS造成的伤害 */
        this.leftBattleTimes = 0; /* 可以挑战的次数 */
        this.rewardState = 0; /* 是否已经领取奖励 */
        this.rank = 0; /* 玩家在公会BOSS战中的排名,每次战斗结束都会进行排名 */
        this.maxDamage = 0; /* 对公会BOSS造成的最大伤害 */
        this.totalChallengeTimes = 0; /* 挑战公会BOSS的总次数 */
        this.totalBuyChanllengeTimes = 0; /* 购买公会BOSS挑战机会的次数 */
        this.battleStartTime = 0; /* 战斗开始时间 */
        this.battleEndTime = 0; /* 战斗结束时间 */
    }
    return GuildBossWarrior;
})();
exports.GuildBossWarrior = GuildBossWarrior;

var GuildBoss = (function() {
    function GuildBoss() {
        this.gid = 0; /* 公会ID */
        this.mid = 0; /* 公会怪物ID */
        this.monsterHealth = 0; /* 公会怪物当前血量*/
        this.criticalStrikeUID = ''; /* 致命一击用户ID */
        this.criticalStrikeTime = 0; /* 致命一击的时间 */
        this.killedGuildBossIndex = []; /* 击杀过的公会BOSS的INDEX */
        this.nextMid = 0; /* 公会会长指定的下一个公会BOSS ID */
    }
    return GuildBoss;
})();
exports.GuildBoss = GuildBoss;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 竞技场战斗人员
 */
var ArenaWarrior = (function() {
    function ArenaWarrior() {
        this.zid = -1; /* 大区ID */
        this.uid = ''; /* 用户ID */
        this.bestRank = -1; /* 历史最好排名 */
        this.curRank = -1; /* 当前排名 */
        this.rivalRank = -1; /* 挑战对手排名 */
    }
    return ArenaWarrior;
})();
exports.ArenaWarrior = ArenaWarrior;

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
exports.ArenaBattleRecord = ArenaBattleRecord;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 所有商店共用,记录某个物品的已购次数
 */
var DealInfo = (function() {
    function DealInfo() {
        this.index = -1; /* 商城表tid  */
        this.buyNum = 0; /* 物品已购买次数 */

    }
    return DealInfo;
})();
exports.DealInfo = DealInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 抽奖刷新存储对象
 */
var Lottery = (function() {
    function Lottery() {
        this.lastTime = 0; /*上次普通抽奖操作的时间*/
        this.todayCnt = 0; /* 今日免费抽取次数 */
    }
    return  Lottery;
})();
exports.Lottery = Lottery;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 点星信息公共对象
 */
var PointStar = (function() {
    function PointStar() {
        this.index = -1; /* 当前点星索引 */
    }
    return PointStar;
})();
exports.PointStar = PointStar;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 开始夺宝记录
 */
var StartRobRecord = (function() {
    function StartRobRecord() {
        this.uid = 0; /* 用户Id */
        this.tid = 0; /* 法器碎片tid */
        this.opponent = {}; /* 战斗对象 */
    }
    return StartRobRecord;
})();
exports.StartRobRecord = StartRobRecord;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 仙境类
 */
var Fairyland = (function () {
    function Fairyland() {
        this.state = 0; /* 仙境状态 */
        this.tid = -1; /* 寻仙符灵tid*/
        this.itemId = 0; /* 寻仙符灵itemId */
        this.beginTime = -1; /* 寻仙开始时间 */
        this.endTime = -1; /* 结束寻仙时间 */
        this.exploreType = -1; /* 寻仙类型 */
        this.events = []; /* 寻仙事件 */
    }
    return Fairyland;
})();
exports.Fairyland = Fairyland;


/**
 * 仙境事件
 */
var FairylandEvent = (function() {
    function FairylandEvent() {
        this.index = -1; /* 表格索引 */
        this.tid = -1; /* 物品表格Id */
        this.itemNum = -1; /* 物品数量 */
        this.friendName = -1; /* 好友名字 */
    }
    return FairylandEvent;
})();
exports.FairylandEvent = FairylandEvent;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 任务
 */

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
exports.TaskObject = TaskObject;

/**
 * 任务积分奖励箱
 */
var TaskScoreAwardBox = (function() {
    function TaskScoreAwardBox() {
        this.curScore = 0; /* 当前分数 */
        this.awardsRcvd = []; /* 已经领取奖励的索引 */
    }
    return TaskScoreAwardBox;
})();
exports.TaskScoreAwardBox = TaskScoreAwardBox;


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 每日签到
 */
var Sign = (function() {
    function Sign() {
        this.signNum = 1; /* 当前应签到次数 */
        this.isSign = 0; /* 是否已签到 */
        this.signTime = 0; /* 签到请求时间*/

    }
    return Sign;
})();
exports.Sign = Sign;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 豪华签到
 */
var LuxurySign = (function() {
    function LuxurySign() {
        this.isSign = 0; /* 是否已签到 */
        this.signTime = 0; /* 签到请求时间*/
        this.isRecharge = 0; /* 是否今日充值满足签到条件 */

    }
    return LuxurySign;
})();
exports.LuxurySign = LuxurySign;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 神秘商店
 */
var MysteryShop = (function() {
    function MysteryShop() {
        this.freeRefreshCnt = 0; /* 免费刷新次数 */
        this.freeRefreshTimeStamp = 0; /* 最后免费刷新时间 */
        this.refreshCnt = 0; /* 今日刷新次数 */
        this.lastRefreshDate = ''; /* 最后刷新日期 */
        this.itemsRcd = {}; /* 物品购买记录 */
    }
    return MysteryShop;
})();
exports.MysteryShop = MysteryShop;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * VIP每日福利
 */
var Welfare = (function() {
    function Welfare() {
        this.preVipLvDate = ''; /* 初始vip等级记录日期 */
        this.preVipLevel = 0; /* 初始vip等级 */
        this.array = []; /* 已领取的礼包序号 */
    }
    return Welfare;
})();
exports.Welfare = Welfare;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 用户禁言信息
 */
var DontChatInfo = (function() {
    function DontChatInfo() {
        this.beginTime = 0; /* 禁言开始时间 */
        this.endTime = 0; /* 禁言结束时间 */
        this.reason = ''; /* 原因 */

    }
    return DontChatInfo;
})();
exports.DontChatInfo = DontChatInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 用户封号信息
 */
var SealAccountInfo = (function() {
    function SealAccountInfo() {
        this.beginTime = 0; /* 封号开始时间 */
        this.endTime = 0; /* 封号结束时间 */
        this.reason = ''; /* 原因 */

    }
    return SealAccountInfo;
})();
exports.SealAccountInfo = SealAccountInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 全服邮件信息
 */
var AllServerMailInfo = (function() {
    function AllServerMailInfo() {
        this.mailId = 0; /*邮件ID*/
        this.mailTitle = '';  /*邮件标题*/
        this.mailContent = '';  /*邮件内容*/
        this.mailTime = 0;  /*邮件生成时间*/
        this.items = []; /*附件物品，ItemObject对象数组 */

    }
    return AllServerMailInfo;
})();
exports.AllServerMailInfo = AllServerMailInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 走马灯信息
 */
var RollPlayingInfo = (function() {
    function RollPlayingInfo() {
        this.rollid = 0; /*走马灯ID*/
        this.content = ''; /*内容*/
        this.playInterval = 0;  /*播放间隔*/
        this.playCount = 0;  /*播放次数*/
        this.beginTime = 0;  /*开始时间（utc时间）*/
        this.endTime = 0;  /*结束时间（utc时间）*/
        this.overdue = 0; /* 是否过期，1为过期 */
    }
    return RollPlayingInfo;
})();
exports.RollPlayingInfo = RollPlayingInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 公告信息
 */
var AnnounceInfo = (function() {
    function AnnounceInfo() {
        this.annid = 0; /*公告ID*/
        this.content = ''; /*内容*/
        this.title = ''; /*标题*/

    }
    return AnnounceInfo;
})();
exports.AnnounceInfo = AnnounceInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 礼包码礼包对象信息
 */
var ActivationGiftInfo = (function() {
    function ActivationGiftInfo() {
        this.agId = 0; /*自增id*/
        this.giftType = 0; /*礼包类型*/
        this.useMax = 1;  /*使用上限*/
        this.name = '';  /*礼包名称*/
        this.codeNum = 0;  /*生成数量*/
        this.media = '';  /*媒体*/
        this.beginTime = 0;  /*开始时间（utc时间）*/
        this.endTime = 0;  /*结束时间（utc时间）*/
        this.items = [];  /*附件物品*/
        this.description = '';  /*礼包描述*/
        this.channelId = 0; /*渠道id*/

    }
    return ActivationGiftInfo;
})();
exports.ActivationGiftInfo = ActivationGiftInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 礼包码信息
 */
var ActivationCodeInfo = (function() {
    function ActivationCodeInfo() {
        this.agId = 0; /*礼包码礼包对象id*/
        this.useNum = 0;  /*已使用的次数*/

    }
    return ActivationCodeInfo;
})();
exports.ActivationCodeInfo = ActivationCodeInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 白名单信息
 */
var WhiteListInfo = (function() {
    function WhiteListInfo() {
        this.mac = ''; /*mac地址串*/
        this.time = 0;  /*添加时间（utc秒）*/

    }
    return WhiteListInfo;
})();
exports.WhiteListInfo = WhiteListInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 区信息
 */
var ZoneInfo = (function() {
    function ZoneInfo() {
        this.zid = 0;
        this.name = '';
        this.state = 0; /* 服务器状态 1新服，2火爆，3正常，4隐藏，5维护 6爆满 */
        this.openDate = '1970-01-01'; /* 开服日期 */
        this.playerCnt = 0; /* 该区的玩家数量 */
        this.maxRegister = 0; /*最大注册人数 */
        this.areaId = 0; /* 所属大区(合区前等于本身) */
    }
    return ZoneInfo;
})();
exports.ZoneInfo = ZoneInfo;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 物品改变log对象
 */
var ItemLog = (function() {
    function ItemLog() {
        this.itemId = -1;
        this.tid = -1;
        this.beforeNum = -1; /* 操作前物品数俩 */
        this.afterNum = -1; /* 操作后物品数俩 */
    }
    return ItemLog;
})();
exports.ItemLog = ItemLog;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 射手乐园
 */
var Shoot = (function() {
    function Shoot() {
        this.addDiamond = 0; /* 当前累计元宝 */
        this.usingTimes= 0; /* 已射击次数 */
    }
    return Shoot;
})();
exports.Shoot = Shoot;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 幸运卡牌对象
 */
var CardState = (function() {
    function CardState() {
        this.residueTime = -1; /* 剩余抽卡次数 */
        this.theLastTime = 0; /* 最后操作时间 */
    }
    return CardState;
})();
exports.CardState = CardState;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 活动消费返利对象
 */
var CoastRecvPrizeState = (function() {
    function CoastRecvPrizeState() {
        this.prizeStatus = []; /*返利领取状态*/
    }
    return CoastRecvPrizeState;
})();
exports.CoastRecvPrizeState = CoastRecvPrizeState;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 活动限时抢购对象
 */
var GoodsState = (function() {
    function GoodsState() {
        this.goodsIndex = 0; /*物品编号*/
        this.haveBuyNum = 0; /*购买数量*/
    }
    return GoodsState;
})();
exports.GoodsState = GoodsState;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 定制邮件对象
 */
var CustomMadeMailInfo = (function() {
    function CustomMadeMailInfo() {
        this.beginTime = 0;/*开始时间 utc时间*/
        this.endTime = 0;/*结束时间 utc时间*/
        this.title = '';/*邮件标题*/
        this.content = '';/*邮件内容*/
        this.items = []; /*附件物品，ItemObject对象数组 */
        this.minUserLev = 0;/*最小的角色等级(不限制填0)*/
        this.maxUserLev = 0;/*最大的角色等级(不限制填0)*/
        this.minVipLev = 0;/*最小的vip等级(不限制填0)*/
        this.maxVipLev = 0;/*最大的vip等级(不限制填0)*/
        this.gid = '';/*公会id(不限制填'')*/
        this.minGuildLev = 0;/*最小的公会等级(不限制填0)*/
        this.maxGuildLev = 0;/*最大的公会等级(不限制填0)*/
    }
    return CustomMadeMailInfo;
})();
exports.CustomMadeMailInfo = CustomMadeMailInfo;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * GM工具设置的运营活动
 */
var ActivityTimeInfo = (function() {
    function ActivityTimeInfo() {
        this.beginTime = 0;/*开始时间 utc时间*/
        this.endTime = 0;/*结束时间 utc时间*/
        this.endAwardTime = 0;/*奖励领取结束 utc时间*/
        this.chargeAward = []; /*充值相关奖励信息，放GMChargeAward对象*/
    }
    return ActivityTimeInfo;
})();
exports.ActivityTimeInfo = ActivityTimeInfo;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 运营活动中，充值相关奖励信息
 */
var GMChargeAward = (function() {
    function GMChargeAward() {
        this.rmbNum = 0;/*RMB数量*/
        this.items = [];/*ItemObject对象*/
    }
    return GMChargeAward;
})();
exports.GMChargeAward = GMChargeAward;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 订单详情
 */
var OrderDetail = (function() {
    function OrderDetail() {
        this.zid = 0;
        this.zuid = '';
        this.status = -1;
        this.shelfId = -1;
        this.createtime = ''; /* 订单创建时间 */
        this.order = ''; /* 渠道订单号 */
    }
    return OrderDetail;
})();
exports.OrderDetail = OrderDetail;
/**-------------------------------------------------------------------------------------------------------------------*/
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
exports.PlayerFightDetail = PlayerFightDetail;
/**-------------------------------------------------------------------------------------------------------------------*/
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
exports.PetFightDetail = PetFightDetail;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 渠道返利信息
 */
var ChannelRateInfo = (function() {
    function ChannelRateInfo() {
        this.channelId = 0; /* 渠道id */
        this.rate = 0; /* 利率（浮点数）*/
    }
    return ChannelRateInfo;
})();
exports.ChannelRateInfo = ChannelRateInfo;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 充值送礼返给客户端信息
 */
var AwardInfo = (function() {
    function AwardInfo() {
        this.rmbNum = 0; /* 人民币数额 单位分 */
        this.items = []; /* ItemObject对象数组 */
        this.hasAward = 0; /* 是否已领取*/
    }
    return AwardInfo;
})();
exports.AwardInfo = AwardInfo;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 渠道用户充值总金额
 */
var ChannelUidMoney = (function() {
    function ChannelUidMoney() {
        this.channelId = -1; /* 用户渠道id */
        this.channelUid = 0; /* 渠道对应用户id */
        this.amount = 0; /* 渠道用户充值总金额 */
    }
    return ChannelUidMoney;
})();
exports.ChannelUidMoney = ChannelUidMoney;

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 爬塔点星buff加成信息
 */
var BuffEffectInfo = (function () {
    function BuffEffectInfo(){
        this.HP_MAX_RATE = 0;/* 生命百分比*/
        this.CRITICAL_STRIKE_RATE = 0;/* 暴击率 */
        this.DEFENCE_CRITICAL_STRIKE = 0; /* 抗暴率 */
        this.HIT_TARGET_RATE = 0;/* 命中率 */
        this.DODGE_RATE = 0;/* 闪避率 */
        this.HIT_RATE = 0;/* 伤害率 */
        this.DEFENCE_HIT_RATE = 0;/* 减伤率 */
    }
    return BuffEffectInfo;
})();
exports.BuffEffectInfo = BuffEffectInfo  ;/* 爬塔点星buff加成信息 */

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
exports.FlashSaleItem = FlashSaleItem  ;/* 限时抢购商品 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *  背包类型 定义
 */
exports.PACKAGE_TYPE_ERR = 0; /* 错误 */
exports.PACKAGE_TYPE_PET = 1; /* 宠物 */
exports.PACKAGE_TYPE_PET_FRAGMENT = 2;  /* 宠物碎片 */
exports.PACKAGE_TYPE_EQUIP = 3; /* 装备 */
exports.PACKAGE_TYPE_EQUIP_FRAGMENT = 4; /* 装备碎片 */
exports.PACKAGE_TYPE_MAGIC = 5; /* 法器 */
exports.PACKAGE_TYPE_MAGIC_FRAGMENT = 6; /* 法器碎片 */
exports.PACKAGE_TYPE_CONSUME_ITEM = 7; /* 消耗品 */

/**
 *  道具槽定义
 */
exports.SLOT_TYPE_ERR = 0; /* 错误 */
exports.SLOT_TYPE_WEAPON = 1; /* 武器槽 */
exports.SLOT_TYPE_JEWELRY = 2; /* 饰品槽 */
exports.SLOT_TYPE_ARMOR_ONE = 3; /* 防具1 */
exports.SLOT_TYPE_ARMOR_TWO = 4; /* 防具2 */
exports.SLOT_TYPE_MAGIC_ONE = 5; /* 法器1 */
exports.SLOT_TYPE_MAGIC_TWO = 6; /* 法器2 */
exports.SLOT_TYPE_PET = 7; /* 宠物 */

/**
 * 道具的对象类
 */
exports.ItemPet = ItemPet; /* 宠物 */
exports.FragmentPet = FragmentPet; /* 宠物碎片 */
exports.ItemEquip = ItemEquip;/* 装备 */
exports.FragmentEquip = FragmentEquip; /* 装备碎片 */
exports.ItemMagic = ItemMagic; /* 法器 */
exports.FragmentMagic = FragmentMagic; /* 法器碎片 */
exports.ItemConsume = ItemConsume; /* 消耗品 */


/**
 *　注册方式
 */
exports.REGIST_TYPE_QUICK = 0; /* 快速登录方式 */
exports.REGIST_TYPE_CHECK = 1; /* 账号密码验证方式 */


/**
 * 仙境状态
 * */
exports.FAIRYLAND_NEED_CONQUER = 0; /* 仙境未征服 */
exports.FAIRYLAND_NEED_EXPLORE = 1; /* 仙境未探索 */
exports.FAIRYLAND_EXPLORING = 2; /* 仙境探索中 */
exports.FAIRYLAND_RIOTING = 3; /* 仙境暴乱中 */
exports.FAIRYLAND_WAIT_HARVEST = 4; /* 仙境等待收获 */
