/**
 * 统一错误码定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 通用异常
 */
exports.PACKAGE_VERIFY_ERR = -10001; /* 重复发同一包序号 */
exports.OUTDATED_VERSION = -10000; /* 过时版本 */
exports.MOCK_DATA = -9; /* 捏造的数据 */
exports.OPERATION_VAL_ERR = -8; /* 除法运算使用到零值 */
exports.USING_PLUG = -7; /* 正在使用外挂 */
exports.TABLE_NOT_EXIST = -6; /* 配置表不存在 */
exports.TID_NOT_EXIST = -5; /* TID不存在 */
exports.GTOKEN_TIME_OUT = -4; /*  */
exports.LOGIN_TIMEOUT = -3; /* 登录服务器网络令牌过期 */
exports.DB_ERR = -2; /* 数据库异常 */
exports.ERR = -1;
exports.SUCCESS = 1;
exports.RECV_MASSAGE_UNKNOWN = -800;
exports.REDIS_LOCK_LOCKED = -900;
exports.REDIS_LOCK_EXPIRED = -1000;
/**-------------------------------------------------------------------------------------------------------------------*/
/**游戏服务器网络令牌过期
 * 登录 [51-100]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.ACCOUNT_NOT_EXIST = 51; /* 账号不存在 */
exports.PASSWORD_EROR = 52; /* 密码错误 */
exports.ACCOUNT_GEN_ERR = 54; /* 账号生成错误 */
exports.ACCOUNT_STORE_ERR = 55; /* 账号存储错误 */
exports.ACCOUNT_EXIST = 56; /* 账号已存在 */
exports.ACCOUNT_LOGINED_BY_ANOTHER = 57; /* 账号在别处登陆 */
exports.RRGISTER_TYPE_ERR = 81; /* 注册类型错误 */
exports.REGTOKEN_NOT_EXIST = 82; /* 注册Token不存在 */
exports.ACCOUNT_LOGINED = 83; /* 账号已登陆 */
exports.ACCOUNT_SEAL = 84; /* 已被封号 */
exports.ZONE_NOT_EXIST = 85; /* 区不存在 */
exports.ZONE_NOT_OPEN = 86; /* 区未开服 */
exports.ZONE_ONLY_WHITE_LIST = 87; /* 白名单可以进区 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 创建角色 [101-150]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.NAME_ILLEGAL = 101; /* 名字非法 */
exports.NAME_EXISTS = 102; /* 名字被占用 */
exports.PLAYER_NOT_EXIST = 103; /* 角色数据不存在 */
exports.NAME_TOO_LONG = 104; /* 角色名太长 */
exports.PLAYER_AlREADY_EXIST = 105; /* 角色数据已存在 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 开服狂欢 [151-200]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.REVELRY_END = 151; /* 狂欢已经结束 */
exports.REVELRY_NOT_EXIST = 152; /* 狂欢不存在 */
exports.REVELRY_NOT_COMPLETE = 153; /* 狂欢任务未完成 */
exports.REVELRY_ACCEPTED = 154; /* 狂欢奖励已领取 */
exports.REVELRY_NOT_BEGIN = 155; /* 狂欢还未开始 */
exports.HALFPRICE_ABOVE_LIMIT = 156; /* 半价抢购物品已经没有剩余 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 符灵属性 [201-250]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.POINT_STAR_CURRENT_INDEX_NOT_EXIST = 201; /* 点星当前索引值不存在 */
exports.POINT_STAR_CONFIG_ERROT = 202; /* 点星数据表错误 */
exports.POINT_STAR_AWARD_ERROT = 203; /* 点星奖励物品错误 */
exports.TID_OR_STAR_COST_ERROR = 204; /* 点星客户端发送数据错误 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 创建超级玩家 [251-300]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.NO_CHARACTER_INFO = 251; /* 没有主角信息 */
exports.WRONG_CHARACTER_ID = 252; /* 主角ID错误 */
exports.WRONG_PET_ID = 253; /* 符灵ID错误 */
exports.WRONG_EQUIP_ID = 254; /* 装备ID错误 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * PVP战斗 [301-350]
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 基础货币 [351-400]
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 养成资源 [401-450]
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 组队 [451-500]
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 回收系统 [501-550]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.RECOVER_ITEM_TYPE_ERR = 501;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 天命系统 [551-600]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.FATE_UPGRADE_FAILED = 551; /* 天命升级失败 */
exports.FATE_VALUE_CLEAR = 552; /* 天命值清零 */
exports.FATE_COST_NUM_NOT_CORRECT = 553; /* 天命石消耗不一致 */
exports.TYPE_ERR = 554; /* 类型错误,既不是主角也不是符灵 */
exports.FATE_LEVEL_MAX = 555; /* 天命等级已达最大 */
exports.FATE_LEVEL_WRONG = 556; /* 不存在这样的天命等级 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 升级系统 [601-650]
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 突破系统 [651-700]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.ROLE_LEVEL_NOT_ENOUGH = 651; /* 角色等级不够 */
exports.TYPE_NOT_KNOW = 652; /*　类型未知 */
exports.CONSUME_EMPTY = 653; /*　消耗品为空 */
exports.MAX_BREAK_LEVEL = 654; /* 突破等级已达最大 */
exports.BREAK_CONSUME_NOT_RIGHT = 655; /* 突破石消耗不一致 */
exports.CARD_CONSUME_NOT_RIGHT = 656; /* 卡片消耗不一致 */
exports.BREAK_LEVEL_NOT_RIGHT = 657; /* 突破等级数据错误 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * pve副本 [701-750]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.BATTLE_MAIN_TYPE_ERR = 701; /* 主线副本类型异常 */
exports.BATTLE_MAIN_PRE_ERR = 702; /* 主线副本前置异常 */
exports.BATTLE_MAIN_NOT_SWEEP = 703; /* 主线副本不能扫荡 */
exports.BATTLE_MAIN_NO_RECORD = 704; /* 主线副本开始记录不存在 */
exports.BATTLE_STARS_NO_ENOUGHT = 705; /* 星数不够领取奖励 */
exports.BATTLE_BOX_AWARD_RCVED = 706; /* 宝箱奖励已经领取 */
exports.BATTLE_MAIN_NO_PASS = 707; /* 主线通关次数用完 */
exports.BATTLE_MAIN_NO_RESET = 708; /* 主线重置次数用完 */
exports.BATTLE_MAIN_NO_NEED_RESET = 709; /* 主线副本无需重置 */
exports.BATTLE_MAIN_CANNOT_RESET = 710; /* 主线副本重置已到上限 */
exports.BATTLE_MAIN_RESET_CNT_WRONG = 711; /* 主线副本重置计数错误 */
exports.BATTLE_MAIN_PRE_BATTLE_NOT_PASS = 712; /* 前置副本没有通关 */

exports.BATTLE_ACTIVE_TYPE_ERR = 720; /* 每日副本类型异常 */
exports.BATTLE_ACTIVE_PRE_ERR = 721; /* 每日副本ID异常 */
exports.BATTLE_ACTIVE_COUNT_ERR = 722; /* 每日副本挑战次数不够异常 */
exports.BATTLE_ACTIVE_REQ_FRESH_ERR = 723; /* 每日副本挑客户端请求刷新异常 */
exports.BATTLE_ACTIVE_TABLE_ERR = 724; /* 每日副本表格异常 */
exports.BATTLE_ACTIVE_DATA_ERR = 725; /* 每日副本数据异常 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 法器 [751-800]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.MAGIC_REFINE_LEVEL_BOUNDS = 751; /* 法器精炼等级越界 */
exports.MAGIC_REFINE_LACK_MATERIALS = 752; /* 法器精炼材料不足 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 背包 [801-850]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.PACKAGE_NOT_EXIST = 801; /* 背包不存在 */
exports.ITEM_NOT_EXIST = 802; /* 物品不存在 */
exports.CHARACTER_SEAT = 803; /* 主角宝座，符灵滚蛋 */
exports.AID_NOT_EXIST = 804; /* 属性ID不存在 */
exports.NO_MATCH_PACKAGE = 805; /* 没有对应背包(物品tid错误) */
exports.NO_MATCH_SLOT = 806; /*　没有对应槽(物品tid错误)　*/
exports.NOT_ENOUGH_LEVEL_FOR_TEAMPOS = 807; /* 玩家等级不够上阵物品 */
exports.ILLEGAL_TEAMPOS = 808; /* 非法阵位 */
exports.FORBIDDEN_SAME_PET = 809; /* 相同种类符灵只能上一个 */
exports.ILLEGAL_TID_FOR_PACKAGE = 810; /* 物品类型对于背包非法 */
exports.PET_SEAT_NO_EMPTY = 811; /* 符灵不能下 */
exports.PACKAGE_FULL = 812; /* 背包已满 */
exports.WRONG_TID = 813; /* TID错误 */
exports.SLOT_OCCUPIED = 814; /* 槽已被占 */
exports.WRONG_TEAMPOS = 815; /* TEAMPOS错误 */
exports.CHANGE_POS_REQ_ERR = 816; /* 错误的换位请求 */
exports.ITEM_NUM_NEGATIVE = 817; /* 物品数量是负数 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 合成与出售 [851-900]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.LACK_OF_COMPOSE_NUM = 851; /* 合成所需碎片不足 */
exports.SALE_FAILED = 852; /* 出售失败 */
exports.SALE_ITEM_TID_CONFUSED = 853; /* 出售物品数组不是同一类 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 物品使用 [901-950]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.WRONG_ITEM_TYPE = 901; /* 错误的物品类型  */


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 拆解 [951-1000]
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 邮件 [1001-1050]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.MAIL_EMPTY = 1001; /*没有邮件*/
exports.MAIL_ILLEGAL = 1002; /* 邮件非法 */
exports.MAX_MAIL_NUM = 1003; /* 邮件数量已达上限 */
exports.MAIL_ID_ILLEGAL = 1004; /* 邮件ID错误 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 好友 [1051-1100]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.FRIEND_REQUEST_ALREADY_EXISTS = 1051; /* 对同一人已经发出过好友请求 */
exports.SELF_FRIEND_FULL = 1052; /* 自己的好友数量已到上限 */
exports.SELF_FRIEND_REQUEST_FULL = 1053; /* 自己的好友申请列表已满 */
exports.OTHER_SIDE_FRIEND_FULL = 1054; /* 对方的好友数量已到上限 */
exports.OTHER_SIDE_FRIEND_REQUEST_FULL = 1055; /* 对方的好友申请列表已满 */
exports.FRIENDS_AREADY = 1056; /* 双方已经是好友 */
exports.NOT_FRIENDS = 1057; /* 不是好友 */
exports.NOT_IN_LEVEL_SET = 1058; /* 不在等级排名集合中 */
exports.OTHER_SIDE_NOT_REQED = 1059; /* 对方没有请求好友 */
exports.FRIEND_SPIRIT_SENDED = 1060; /* 精力已经赠送过 */
exports.FRIEND_SPIRIT_NOT_RCV = 1061; /* 未收到过精力 */
exports.FRIEND_SPIRIT_RCV_LIMIT = 1062; /* 领取精力已到上限 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 商店 [1101-1150]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.LACK_OF_GOLD = 1101; /* 硬币不足 */
exports.LACK_OF_DIAMOND = 1102; /* 元宝不足 */
exports.LACK_OF_STAMINA = 1103; /* 体力不足 */
exports.LACK_OF_SPIRIT = 1104; /* 精力不足 */
exports.LACK_OF_SOULPOINT = 1105; /* 符魂不足 */
exports.LACK_OF_REPUTATION = 1106; /* 声望不足 */
exports.LACK_OF_PRESTIGE = 1107; /* 威名不足 */
exports.LACK_OF_BATTLEACHV = 1108; /* 战功不足 */
exports.LACK_OF_UNIONCONTR = 1109; /* 公会贡献不足 */
exports.LACK_OF_BEATDEMONCARD = 1110; /* 降魔令不足 */
exports.LACK_OF_ITEM = 1111; /* 消耗品不够 */
exports.LACK_OF_VIP_LEVEL = 1112; /* VIP等级不够 */
exports.MAX_BUY_NUM_IS = 1113; /* 超过最大购买上限 */
exports.LEFT_NUM_ZERO = 1114; /* */
exports.VIP_GIFT_BOUGHT = 1115; /* vip商店礼包已购买 */
exports.INVALID_INDEX = 1116; /* 无效物品索引 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 聊天 [1151-1200]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.USER_OFFLINE    = 1151;  /* 用户不在线 */
exports.CHAT_REQ_OUT_RANGE = 1152; /* 请求记录序号越界 */
exports.REACH_WORLD_CHAT_LIMIT = 1153; /* 世界聊天次数到达上限 */
exports.NOT_IN_GUILD = 1154; /* 未加入公会 */
exports.DONTCHAT = 1155; /* 你已被禁言 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 排行榜 [1201-1250]神装商店剩余次数为零
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.OUT_OF_RANK = 1201; /* 名次超出排行榜 */


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 任务成就 [1251-1300]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.MISSION_NOT_COMPLETE = 1251; /* 任务未完成 */
exports.MISSION_NOT_EXISTS = 1252; /* 任务不存在 */
exports.BATTLE_TASK_ID_ILLEGAL = 1253; /* 关卡任务Id非法 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 公会 [1301-1350]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GUILD_NAME_ILLEGAL = 1301; /* 公会名字非法 */
exports.GUILD_OUTINFO_ILLEGAL = 1302; /* 公会宣言非法 */
exports.GUILD_EXIST = 1303; /* 公会已存在 */
exports.GUILD_NOT_EXIST = 1304; /* 公会不存在 */
exports.GUILD_APPLY_TYPE_ERROR = 1305; /* 公会申请类型错误 */
exports.GUILD_APPLY_EXCESS = 1306; /* 公会申请超额 */
exports.GUILD_CANNOT_DISSOLUTION = 1307; /* 公会不能解散 */
exports.GUILD_ID_NOT_EXIST = 1308; /* 公会ID不存在 */
exports.GUILD_LEVEL_NOT_ENOUGH = 1309; /* 公会等级不够 */
exports.GUILD_ADD_MEM_ERROR = 1310; /* 公会添加成员错误 */
exports.GUILD_WORSHIP_EXCESS = 1311; /* 不能多次祭天 */
exports.GUILD_UPDATE_ITEM_ERROR = 1312; /* 更新物品错误 */
exports.GUILD_LIVENESS_NOT_ENOUGH = 1313; /* 祭天进度不够奖励 */
exports.GUILD_CANNOT_IMPEACH = 1314; /* 不能弹劾 */
exports.GUILD_CANNOT_APPOINT = 1315; /* 无任命权限 */
exports.GUILD_CANNOT_CANCEL_APPOINT = 1316; /* 无罢免权限 */
exports.GUILD_CANNOT_REMOVE_MEMBER = 1317; /* 无权踢出成员 */
exports.GUILD_CANNOT_ADD_MEMBER = 1318; /* 无同意成员申请权限 */
exports.GUILD_ADDED= 1319;/* 已加入公会 */
exports.GUILD_APPLY_JOIN= 1320;/* 你已申请过该公会 */
exports.GUILD_REFUSE_MEM_ERROR = 1321; /* 公会拒绝成员错误 */
exports.GUILD_WORSHIP_TYPE_ERROR = 1322; /* 祭天类型错误 */
exports.GUILD_NOT_DISSOLUTION = 1323; /* 成员过多不能解散 */
exports.GUILD_BENN_REMOVE = 1324; /* 已被踢出 */
exports.GUILD_REWARD_RECEIVED = 1325; /* 奖励已领取 */
exports.GUILD_MEMBER_FULL = 1326; /* 公会成员已满 */
exports.CAN_NOT_JOIN = 1327; /* 24小时内不能申请 */
exports.MEMBERS_BUILD_GUILD = 1328; /* 申请人已建立公会 */
exports.GUILD_LEVEL_MAX = 1329; /* 已达最高公会等级 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 运营活动 [1351-1400]
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 充值系统 [1401-1450]
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * VIP [1451-1500]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.VIP_LEVEL_ILLEGAL = 1451; /* vip等级错误 */
exports.VIP_INDEX_ILLEGAL = 1452; /* vip索引错误 */
exports.CHARACTER_LEVEL_ILLEGAL = 1453; /* 角色等级错误 */
exports.WEEK_VIPGIFT_TIMES_BEYOND = 1454;/* 购买每周礼包超出限制 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 技能 [1501-1550]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.SKILL_LEVEL_FULL = 1501; /* 技能等级已到上限 */
exports.NO_SKILL_BOOK = 1502; /* 没有技能书 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 锁[1551-1600]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.PLAYER_LOCKED = 1551; /* player锁定 */
exports.PACKAGE_LOCKED = 1552; /* 背包锁定 */
exports.FRIEND_LIST_LOCKED = 1553; /* 好友列表锁定 */
exports.FRIEND_REQUEST_LIST_LOCKED = 1554; /* 好友申请列表锁定 */
exports.BUY_DATA_LOCK = 1555; /* 公会购买数据锁定 */
exports.MAIL_LOCKED = 1556; /* 邮件锁定 */
exports.GUILD_LOCKED = 1557; /* 公会锁定 */
exports.GIFT_LOCKED = 1558; /* 礼品码信息锁定 */
exports.GUILD_BOSS_LOCKED = 1559; /* 公会BOSS锁定 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 特殊值[1601-1700]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.VALUE_NOT_CHANGE = 1601; /* 值未变 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 抽奖[1701-1800]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.SLAVE_COST_NUM_NOT_CORRECT = 1701; /* 银符令消耗数不一致*/
exports.GOLD_COST_NUM_NOT_CORRECT = 1702;  /* 金符令消耗数不一致*/
exports.DIAMOND_COST_NUM_NOT_CORRECT = 1703;  /* 元宝消耗数不一致*/
exports.CONSUME_ITEM_EMPTY = 1704;
exports.REWARD_EMPTY = 1705;
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 活动[1801-1850]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.NOT_EVENT_TIME = 1801; /* 不在活动时间 */
exports.CAN_NOT_SIGN = 1802; /* 不能签到 */
exports.CAN_NOT_REWARD_POWER = 1803; /* 未在规定时间不能领取仙桃 */
exports.CAN_NOT_SHAKE = 1804; /* 不在规定时间内不能摇钱 */
exports.LACK_OF_LEVEL = 1805; /* 主角等级不够 */
exports.CAN_NOT_REWARD_FUND = 1806; /* 已领取过，不能领取基金奖励 */
exports.LACK_OF_BUY_NUM = 1807; /* 购买人数不够 */
exports.CAN_NOT_REWARD_TREE = 1808; /* 未满六次不能领取 */
exports.CAN_NOT_BUY_AGAIN = 1809; /* 开服基金不能再次购买 */
exports.GIFT_CODE_NOT_EXIST = 1810; /* 礼品码不存在 */
exports.GIFT_CODE_OVERDUE = 1811; /* 礼品码过期 */
exports.GIFT_CODE_INVALID = 1812; /* 礼品码无效 */
exports.CLOTH_NOT_EXIST = 1813; /* 时装不存在 */
exports.GOLD_NOT_REWARD = 1814; /* 摇钱树奖励未领取 */
exports.VIP_LEVEL_MATCH_FAILED = 1815; /* VIP等级不匹配 */
exports.DAILY_WELFARE_RECEIVED = 1816; /* VIP每日福利已领取 */
exports.MONTH_CARD_TYPE_ERR = 1817; /* 月卡类型错误 */
exports.HAVE_NOT_CHARGE = 1818; /* 还未充值 */
exports.CHARGE_REWARD_RECEIVED = 1819; /* 充值奖励已领取 */
exports.CAN_NOT_SHOOT =1820; /* 射手乐园次数用完 */
exports.DAY_NUM_OVER =1821; /* 不在次日登录奖励领取时间内 */
exports.CAN_NOT_TURNOVER = 1822; /*翻牌次数不足 */
exports.TIME_OVERDUE = 1823; /* 充值送礼活动已结束  */
exports.CAN_NOT_REWARD_AGAIN = 1824; /* 充值送礼不能多次领取 */
exports.CAN_NOT_RECIVE_PRIZE = 1825; /*不满足领取返利条件*/
exports.HAVE_RECIVED_THIS_PRIZE = 1826; /*已领取过此返利*/
exports.COST_NUMBER_ERROR = 1827; /*消费数据不正常*/
exports.NOT_IN_ACT_TIME = 1828; /*不在活动时间内*/
exports.NO_MONTH_CARD = 1829; /* 没有相应月卡 */
exports.MONTH_CARD_RECEIVED = 1830; /* 不能多次领取月卡 */
exports.DAY_NUM_ERR = 1831; /* 七日活动中天数不符合对应的奖励 */
exports.CAN_NOT_LUXURYSIGN = 1832; /* 不能豪华签到 */
exports.NOT_IN_PRIZE_TIME = 1833; /*不在领取返利时间内*/
exports.BUY_WARE_INDEX_IS_ERROR = 1834; /*打折物品编号有误*/
exports.BUY_WARE_NUMBER_NOT_ENOUGH = 1835; /*可购买次数不足*/
exports.PLAYER_DIAMOND_NOT_ENOUGH = 1836; /*玩家元宝不足*/
exports.DON_NOT_HAVE_THIS_GROUPID = 1837; /*没有该GROUPID*/
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 天魔[1851-1900]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.FIGHT_DEMON_BOSS_INFO_NOT_EXIST = 1851; /* 攻击天魔历史不存在 */
exports.MERIT_NOT_ENOUGH = 1852; /* 功勋值不够 */
exports.DEMON_BOSS_EXIST = 1853; /* 已经有天魔 */
exports.DEMON_NOT_EXISTS = 1854; /* 天魔不存在 */
exports.MERIT_LEVEL_ERROR = 1855; /* 功勋值购买等级不匹配 */
exports.DEMON_BOSS_NOT_BE_SHARED = 1856; /* 天魔BOSS没有被共享 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 爬塔[1901-1950]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.TOWER_CLIMBING_STATE_ERR = 1901; /* 爬塔状态不对(已输) */
exports.TOWER_CLIMBING_HISTORY_NOT_EXIST = 1902; /* 爬塔历史不存在 */
exports.TOWER_CLIMBING_NOT_WHOLE_THREE = 1903; /* 没有通三关 */
exports.TOWER_CLIMBING_RESET_TIMES_USE_OUT = 1904; /* 重置次数已经用完 */
exports.STAR_LEVEL_NOT_ENOUGH = 1905; /* 购买神装星级不够 */
exports.NO_ENOUGH_STAR_FOR_BUFF =  1906; /* 星数不够 */
exports.TOWER_COMMODITY_BOUGHT = 1907; /* 打折商品已经买过 */
exports.TOWER_CLIMBING_REQ_STAR_ERR = 1908; /* 请求挑战星数错误 */
exports.TOWER_CLIMBING_SWEEP_VIP_NOT_REACH = 1909; /* 爬塔扫荡VIP等级没有达到 */
exports.TOWER_CLIMBING_HAS_PASS = 1910; /* 封魔塔已经通关 */
exports.TOWER_CLIMBING_SWEEP_POWER_NOT_REACH = 1911; /* 封魔塔扫荡战力不足 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 竞技场[1951-2000]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.ARENA_RANK_NOT_ENOUGH = 1951; /* 排名不够 */
exports.ARENA_LACK_OF_SPIRIT = 1952; /* 精力不足 */
exports.ARENA_CAN_NOT_CHALLENGE_SELF = 1953; /* 不可以挑战本人 */
exports.ARENA_NO_WARRIOR = 1954; /* 找不到竞技场斗士 */
exports.ARENA_NO_RANK = 1955; /* 找不到对应排名的玩家 */
exports.ARENA_DEFAULT_WARRIOR_RANK_NOT_EXIST = 1956; /* 玩家首次竞技场战斗默认排名错误 */
exports.ARENA_ROBOT_NOT_FOUND = 1957; /* 未找到机器人 */
exports.ARENA_RIVAL_NOT_EXIST = 1958; /* 对手用户ID错误 */
exports.ARENA_RANK_NOT_MATCH = 1959; /* 自己的RANK值与对手的RANK值不匹配 */
exports.ARENA_INVALID_UID = 1960; /* 无效的用户ID */
exports.ARENA_ACTIVE_OBJECT_ROLEID_NOT_EXIST = 1961; /* activeObject表对一个roleId的数据不存在 */
exports.ARENA_ROBOT_CONFIG_CANNON_FODDER_NOT_EXIST = 1926; /* 给玩家刷金币的机器人不存在 */
exports.ARENA_SWEEP_VIP_NOT_ARRIVE = 1927; /* 竞技场扫荡VIP等级不够 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 夺宝[2001-2050]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.TID_NOT_IN_EQUIPCOMPOSE = 2001; /* 请求tid不在表EquipCompose中 */
exports.SAME_FRAGMENT_ALREADY_GOT = 2002; /* 已有同类型碎片 */
exports.NO_OTHER_FRAGMENT_FOR_SAME_MAGIC = 2003; /* 没有合成法器的其他碎片 */
exports.ROB_AIM_NOT_IN_LIST = 2004; /* 夺宝目标不在记录列表中 */
exports.AIM_FRAGMENT_LESS_THAN_TWO = 2005; /* 夺宝目标的碎片小于两个 */
exports.NO_START_ROB_RECORD = 2006; /* 没有开始夺宝记录 */
exports.REQ_DISMATCH_WITH_ROB_RECORD = 2007; /* 请求和记录不符 */
exports.WRONG_TID_FOR_TRUCE = 2008; /* tid不是免战牌 */
exports.FRAGMENT_NUM_NOT_MATCH = 2009; /* 碎片种类数量错误 */
exports.NO_ENOUGH_FRAGMENT = 2010; /* 碎片数量不够 */
exports.NO_ROB_MAGIC_LIST = 2011; /* 没有获取夺宝列表 */
exports.ROB_SPIRI_RUN_OUT = 2012; /* 夺宝精力不足 */
exports.ROB_EQUIP_COMPOSE_CONFIG_NOT_EXIST = 2013; /* EquipCompose 配置表不存在 */
exports.ROB_FRAGMENT_CONFIG_NOT_EXIST = 2014; /* 法器碎片配置表不存在 */
exports.ROB_EQUIP_COMPOSE_HAVE_NO_FRAGMENT = 2015; /* 法器合成没有拥有相关碎片 */
exports.ROB_ROLE_EQUIP_CONFIG_NOT_EXIST = 2016; /* RoleEquipConfig表不存在 */
exports.ROB_VIP_LIST_CONFIG_NOT_EXIST = 2017; /* VipList数据不存在 */
exports.ROB_FUNCTION_CONFIG_NOT_EXIST = 2018; /* FunctionConfig表不存在 */
exports.ROB_PLAYER_LEVEL_AND_VIP_NOT_ARRIVE = 2019; /* 玩家等级和vip都没有达到一键夺宝的要求 */
exports.ROB_LACK_OF_SPIRIT = 2020; /* 精力不足 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 符灵探险[2051-2100]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.FD_LEVEL_LESS = 2051; /* 等级不够探险 */
exports.FD_ALREADY_CONQUERED = 2052; /* 秘境已征服 */
exports.FD_FIGHT_TIME_ERR = 2053; /* 战斗时间错误 */
exports.PET_IN_FAIRYLAND = 2054; /* 符灵在寻仙中 */
exports.FD_STATE_ERR_FOR_EXPLORE = 2055; /* 仙境状态无法寻仙 */
exports.FD_NOT_RIOTING = 2056; /* 仙境没有暴乱 */
exports.FD_CANNOT_HARVEST = 2057; /* 仙境无法收获 */
exports.FD_VIP_LEVEL_LESS = 2058; /* vip等级不够 */
exports.FD_NO_REPRESS_TIMES = 2059; /* 镇压次数用完 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 公会BOSS[2101-2200]
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GUILD_BOSS_NOT_EXIST = 2101; /* 公会BOSS不存在 */
exports.GUILD_BOSS_HAS_DEAD = 2102; /* 公会BOSS已经死亡 */
exports.GUILD_BOSS_CAN_NOT_AVAILABLE = 2103; /* 公会BOSS没有开放 */
exports.GUILD_BOSS_LEFT_BATTLE_TIMES_RUNOUT = 2104; /* 挑战公会次数已经用尽 */
exports.GUILD_BOSS_INIT_ERROR_TIME = 2105; /* 还未到指定公会BOSS的时间段 */
exports.GUILD_BOSS_INIT_NO_PERMISSION = 2106; /* 没有权限开启公会BOSS */
exports.GUILD_BOSS_WARRIOR_NOT_EXIST = 2107; /* 公会BOSS战斗结束后找不到相应的warrior */
exports.GUILD_BOSS_LOCK_EXPIRED = 2108; /* 公会BOSS锁超时 */
exports.GUILD_BOSS_GUILD_LEVEL_REQUIRE_NOT_MEET = 2109 /* 公会等级要求没有达到 */
exports.GUILD_BOSS_NOT_DEAD = 2110; /* 公会BOSS还未死亡 */
exports.GUILD_BOSS_GETREWARD_TIME_NOT_ARRIVE = 2111; /* 还未到领奖时间 */
exports.GUILD_BOSS_REWARD_HAS_GET = 2112; /* 已经领取公会BOSS死亡奖励 */
exports.GUILD_BOSS_MEMBER_NOT_EXIST = 2113; /* 公会成员不存在 */
exports.GUILD_BOSS_STAGE_NOT_EXIST = 2114; /* 公会BOSS对应的副本不存在 */
exports.GUILD_BOSS_MONSTER_OBJECT_NOT_EXIST = 2115; /* 公会BOSS对应的怪物不存在 */
exports.GUILD_BOSS_JOIN_GUILD_LATE = 2116; /* 公会BOSS被击杀后玩家进入公会 */
exports.GUILD_BOSS_PRE_GUILD_BOSS_NOT_KILLED_EVER = 2117; /* 公会BOSS的前置BOSS没有完成过击杀 */
exports.GUILD_BOSS_BUY_CHALLENGE_CHANCE_RUNOUT = 2118; /* 购买公会BOSS挑战已经用完 */
exports.GUILD_BOSS_BUY_CHALLENGE_CHANCE_PRICE_NOT_EXIST = 2119; /* 购买公会BOSS挑战对应的价格不存在 */
exports.GUILD_BOSS_BUY_CHALLENGE_LIMIT_VIP_LIST_NOT_EXIST = 2120; /* 购买公会BOSS挑战对应的vipList不存在 */
/**
 * 每日副本[2201-2300]
 */
exports.DAILY_STAGE_NOT_EXIST = 2201; /* 每日副本不存在 */
exports.DAILY_STAGE_PLAYER_LEVEL_NOT_ARRIVE = 2202; /* 每日副本开放等级没有达到 */
exports.DAILY_STAGE_BATTLE_CHANCE_RUNOUT = 2203; /* 每日副本挑战次数用尽 */
exports.DAILY_STAGE_NOT_OPEN = 2204; /* 每日副本没有开启 */
exports.DAILY_STAGE_STAGE_NOT_EXIST = 2205; /* 每日副本对应的副本不存在 */
exports.DAILY_STAGE_MONSTER_NOT_EXIST = 2206; /* 每日副本对应的BOSS不存在 */
exports.DAILY_STAGE_MONSTER_NOT_DEAD = 2207; /* 每日副本的BOSS没有死亡 */
exports.DAILY_STAGE_DETAIL_NOT_EXIST = 2208; /* 每日副本的详细信息不存在 */
exports.DAILY_STAGE_MONSTER_HAS_DEAD = 2209; /* 每日副本的BOSS已经死亡 */
/**
 * 限时抢购[2301-2400]
 */
exports.FLASH_SALE_LACK_OF_DIAMOND = 2301; /* 元宝不足 */
exports.FLASH_SALE_NOT_EXIST = 2302; /* 限时抢购商品不存在 */
exports.FLASH_SALE_CAN_NOT_APPROACH = 2303; /* 限时抢购条件没有达到 */
exports.FLASH_SALE_HAS_PURCHASED = 2304; /* 限时抢购已经购买 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * SDK返回码
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.SDK_CHARGE_SUCCESS = 0; /* 充值成功 */
exports.SDK_SIGN_ERR = 2; /* 签名错误 */
exports.SDK_PARAMETER_ERR = 3; /* 参数有错 */
exports.SDK_WRONG_ORDER = 4; /* 订单号错误 */
exports.SDK_REPEAT_ORDER = 5; /* 重复的订单号 */
exports.SDK_WRONG_ORDER = 6; /* 錯誤的订单号 */
exports.SDK_CHARGE_FAILED = -100; /* 充值失败 */
exports.SDK_CHANNEL_ERR = -99; /* sdk渠道id错误 */
exports.SDK_BODY_NULL = -98; /* SDK返回数据为空 */
exports.SDK_BODY_ERR = -97; /* SDK返回数据不为JSON对象 */
exports.SDK_LOGIN_FAILED = -50; /* SDK登录失败 */
exports.SDK_CHECK_OREDER_ERR = -49; /* SDK校验cporder失败 */
exports.SDK_CANNOT_PAY_PAYED_ORDER = -51; /* 不能支付已经支付过的订单 */
exports.SDK_CANNOT_CANCEL_PAYED_ORDER = -52; /* 不能取消已经支付过的订单 */