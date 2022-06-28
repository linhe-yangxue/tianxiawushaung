/**
 * Created by gaojun on 2015/10/19.
 * BI表名定义日志文件表名定义
 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *通用日志说明
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.logs_app_launch = 1; /* App首次启动日志 */
exports.logs_app_load_step = 2; /*  App首次加载步骤*/
exports.logs_app_update = 3; /* App更新(热更新)*/
exports.logs_character_step = 4;  /* 新手引导步骤*/
exports.logs_user_create = 5;  /* 用户创建日志*/
exports.logs_character_create = 6; /* 角色创建日志 */
exports.logs_character_level_up = 7; /* 角色升级日志 */
exports.logs_online_users = 8; /* 在线用户数日志 */
exports.logs_user_login = 9; /* 用户登录日志 */
exports.logs_user_logout = 10; /* 用户登出日志 */
exports.logs_user_money_change = 11; /* 用户游戏币变动流水日志 */
exports.logs_user_yuanbao_change = 12; /* 用户元宝变动流水日志 */
exports.logs_user_item_change = 13; /* 道具流水表 */
exports.logs_user_cash_charge = 14; /* 用户充值日志 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *游戏内容日志
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.logs_instance = 101; /* 关卡日志 */
exports.logs_instance_more_reward = 102; /* 关卡再抽一次 */
exports.logs_instance_money = 103; /* 金钱关卡日志 */
exports.logs_instance_exp = 104; /* 经验关卡日志 */
exports.logs_instance_mj = 105; /* 秘境探索日志 */
exports.logs_lottery_draw = 106; /* 抽奖日志 */
exports.logs_friends = 107; /* 好友日志 */
exports.logs_mission_reward = 108; /* 任务奖励 */
exports.logs_gang = 109; /* 帮派/门派日志 */
exports.logs_sign = 110; /* 签到日志 */
exports.logs_hero_foster = 111; /* 人员升级 */
exports.logs_hero_advanced = 112; /* 人员进阶日志 */
exports.logs_hero_star = 113; /* 人员升星日志 */
exports.logs_hero_skill = 114; /* 人员技能升级日志 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *新加
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.logs_arena = 201;  /* 竞技场日志*/
exports.logs_world_chat = 202;  /*世界聊天*/
exports.logs_climb_tower = 203; /*爬塔*/
exports.logs_climb_tower_buff = 204; /*爬塔选BUFF日志*/
exports.logs_demon_boss = 205; /*天魔副本日志*/
exports.logs_strengthen_equip = 206; /*装备操作日志*/
exports.logs_fate = 207; /*天命升级日志*/
exports.logs_fund = 208; /*基金操作日志*/
exports.logs_code_gift = 209; /*礼包码日志*/
exports.logs_mail = 210; /*邮件日志 */
exports.logs_pet_upgrade = 211; /*宠物升级日志*/
exports.logs_recover = 212; /*回收日志*/
exports.logs_indiana_fight = 213; /*夺宝日志*/
exports.logs_gm_code = 214; /*gm生成的礼包码日志*/
exports.logs_gm_operation = 215; /*gm操作日志*/
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *二期新加
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.logs_online_info = 301; /*角色在线记录*/
exports.logs_battleachv = 302; /*魔鳞/战功日志*/
exports.logs_soulpoint = 303; /*符魂日志*/
exports.logs_reputation = 304; /*声望日志*/
exports.logs_prestige = 305; /*灵核/威名日志*/
exports.logs_guild_contr = 306; /*宗门贡献日志*/
exports.logs_stamina = 307; /*体力日志*/
exports.logs_integral = 308; /*积分日志*/
