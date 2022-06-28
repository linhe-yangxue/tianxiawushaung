
exports.ITEM_TYPE_DIAMOND = 1000001; /* 元宝 */
exports.ITEM_TYPE_GOLD = 1000002; /* 硬币 */
exports.ITEM_TYPE_STAMINA = 1000003; /* 体力 */
exports.ITEM_TYPE_SOULPOINT = 1000004; /* 符魂 */
exports.ITEM_TYPE_SPIRIT = 1000005; /* 精力 */
exports.ITEM_TYPE_REPUTATION = 1000006; /* 声望 */
exports.ITEM_TYPE_PRESTIGE = 1000007; /* 威名 */
exports.ITEM_TYPE_BATTLEACHV = 1000008; /* 战功 */
exports.ITEM_TYPE_UNIONCONTR = 1000009; /* 公会贡献 */
exports.ITEM_TYPE_BEATDEMONCARD = 1000010; /* 降魔令 */
exports.ITEM_TYPE_EXP = 1000011; /* 角色经验 */
exports.STONE_TYPE_FATE = 2000001; /* 天命石 */
exports.STONE_TYPE_BREAK_STONE = 2000002; /* 突破石 */
exports.STONE_TYPE_MAGIC_REFINE = 2000003;	/* 法器精炼石 */
exports.STONE_TYPE_EQUIP_REFINE_LOW = 2000004; /* 装备低级精炼石 */
exports.STONE_TYPE_EQUIP_REFINE_MID = 2000005; /* 装备中级精炼石 */
exports.STONE_TYPE_EQUIP_REFINE_HIGH = 2000006; /* 装备高级精炼石 */
exports.STONE_TYPE_EQUIP_REFINE_RARE = 2000007; /* 装备极品精炼石 */
exports.SKILL_BOOK = 2000008; /* 技能书 */
exports.ITEM_TYPE_SWEEPTICKET = 2000009; /* 扫荡券 */
exports.ITEM_TYPE_SILVERCARD = 2000010; /* 银符令 */
exports.ITEM_TYPE_GOLDCARD = 2000011; /* 金符令 */
exports.ITEM_TYPE_RUNE = 2000012; /* 符文 */
exports.ITEM_TYPE_STAMINA_PILL = 2000013; /* 体力丹 */
exports.ITEM_TYPE_SPIRIT_PILL = 2000014; /* 精力丹 */
exports.ITEM_TYPE_TRUCE_TOKEN_BIG = 2000016; /* 夺宝令牌大 */
exports.ITEM_TYPE_TRUCE_TOKEN_SMALL = 2000017; /* 夺宝令牌小 */
exports.ITEM_TYPE_REFRESH_TOKEN = 2000018; /* 刷新令*/
exports.ITEM_TYPE_CLOTH_ESSENCE = 2000019; /* 时装精华 */
exports.MAIN_TYPE_PET_HIGH = 30305; /* 高级经验符灵 */
exports.MAIN_TYPE_PET_MID = 30299; /* 中级经验符灵 */
exports.MAIN_TYPE_PET_LOW = 30293; /* 低级经验符灵 */


exports.MAGIC_EXP_LOW = 15201; /* 低级经验法器 */
exports.MAGIC_EXP_MID = 15202; /* 中级经验法器 */
exports.MAGIC_EXP_HIGH = 15203; /* 高级经验法器 */

/**
 * 大类
 */
exports.MAIN_TYPE_UNKNOWN = -1; /* 未知类型 */
exports.MAIN_TYPE_EQUIP = 14; /* 装备 */
exports.MAIN_TYPE_MAGIC = 15; /* 法器 */
exports.MAIN_TYPE_EQUIP_FRAGMENT = 16; /* 装备碎片 */
exports.MAIN_TYPE_MAGIC_FRAGMENT = 17; /* 法器碎片 */
exports.MAIN_TYPE_PET = 30; /* 符灵 */
exports.MAIN_TYPE_PET_FRAGMENT = 40; /* 符灵碎片 */
exports.MAIN_TYPE_CHARACTER = 50; /* 主角 */

/**
 * 获取物品大类
 * @param tid {number} 表Id
 * @return {number} 物品大类
 */
var getMainType = function(tid) {
    if(tid >= exports.ITEM_TYPE_DIAMOND && tid <= exports.ITEM_TYPE_BEATDEMONCARD) {
        return tid;
    }
    if(tid >= exports.STONE_TYPE_FATE && tid <= exports.ITEM_TYPE_GOLDCARD) {
        return tid;
    }

    var type = parseInt(tid / 1000);
    if(type >= exports.MAIN_TYPE_EQUIP && type <= exports.MAIN_TYPE_MAGIC_FRAGMENT) {
         return type;
    }

    type = parseInt(tid / 10000) * 10;
    if(type >= exports.MAIN_TYPE_PET && type <= exports.MAIN_TYPE_CHARACTER) {
        return type;
    }

    return exports.MAIN_TYPE_UNKNOWN;
};


/**
 * 小类
 */
exports.SUB_TYPE_UNKNOWN = -1; /* 未知类型 */
exports.SUB_TYPE_WEAPON = 140; /* 武器 */
exports.SUB_TYPE_JEWELRY = 141; /* 饰品 */
exports.SUB_TYPE_ARMOR_ONE = 142; /* 防具1 */
exports.SUB_TYPE_ARMOR_TWO = 143; /* 防具2 */
exports.SUB_TYPE_MAGIC_ONE = 150; /* 法器1 */
exports.SUB_TYPE_MAGIC_TWO = 151; /* 法器2 */
exports.SUB_TYPE_MAGIC_THREE = 152; /* 法器3 */
exports.SUB_TYPE_WEAPON_FRAGMENT = 160; /* 武器碎片 */
exports.SUB_TYPE_JEWELRY_FRAGMENT = 161; /* 饰品碎片 */
exports.SUB_TYPE_ARMOR_ONE_FRAGMENT = 162; /* 防具1碎片 */
exports.SUB_TYPE_ARMOR_TWO_FRAGMENT = 163; /* 防具2碎片 */
exports.SUB_TYPE_MAGIC_ONE_FRAGMENT = 170; /* 法器1碎片 */
exports.SUB_TYPE_MAGIC_TWO_FRAGMENT = 171; /* 法器2碎片 */
exports.SUB_TYPE_MAGIC_THREE_FRAGMENT = 172; /* 法器3碎片 */
exports.SUB_TYPE_PET = 300; /* 宠物 */
exports.SUB_TYPE_PET_FRAGMENT = 400; /* 宠物碎片 */
exports.SUB_TYPE_CHARACTER = 500; /* 主角 */

/**
 * 获取物品小类
 * @param tid {number} 表Id
 * @return {number} 物品小类
 */
var getSubType = function(tid) {
    if(tid >= exports.ITEM_TYPE_DIAMOND && tid <= exports.ITEM_TYPE_BEATDEMONCARD) {
        return tid;
    }
    if(tid >= exports.STONE_TYPE_FATE && tid <= exports.ITEM_TYPE_GOLDCARD) {
        return tid;
    }

    var type = parseInt(tid / 100);
    if(type >= exports.SUB_TYPE_WEAPON && type <= exports.SUB_TYPE_ARMOR_TWO) {
        return type;
    }
    else if(type >= exports.SUB_TYPE_MAGIC_ONE && type <= exports.SUB_TYPE_MAGIC_THREE) {
        return type;
    }
    else if(type >= exports.SUB_TYPE_WEAPON_FRAGMENT && type <= exports.SUB_TYPE_ARMOR_TWO_FRAGMENT) {
        return type;
    }
    else if(type >= exports.SUB_TYPE_MAGIC_ONE_FRAGMENT && type <= exports.SUB_TYPE_MAGIC_THREE_FRAGMENT) {
        return type;
    }

    type = parseInt(tid / 10000) * 100;
    if(type >= exports.SUB_TYPE_PET && type <= exports.SUB_TYPE_CHARACTER) {
        return type;
    }

    return exports.SUB_TYPE_UNKNOWN;
};

/**
 * 声明全局对象
 */
exports.getMainType = getMainType; /* 获取物品大类 */
exports.getSubType = getSubType; /* 获取物品小类 */
