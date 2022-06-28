
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ActiveObject 类为 ActiveObjectTable 每一行的元素对象
 * */
var ActiveObject = (function() {

    /**
    * 构造函数
    */
    function ActiveObject() {
        this.INDEX = 0;
        this.NAME = '';
        this.TXT = '';
        this.DESCRIBE = '';
        this.PET_TYPE = 0;
        this.FIRST_SHOW = 0;
        this.RENDER_TYPE = 0;
        this.CLASS = '';
        this.INFO = '';
        this.MODEL = 0;
        this.POS_Y = 0;
        this.ROTATION_Y = 0;
        this.HEAD_ATLAS_NAME = '';
        this.HEAD_SPRITE_NAME = '';
        this.IS_TUJIAN_SHOW = 0;
        this.SCALE = 0;
        this.UI_SCALE = 0;
        this.STAR_LEVEL = 0;
        this.APTITUDE_LEVEL = 0;
        this.ELEMENT_INDEX = 0;
        this.MOVE_SPEED = 0;
        this.LOOKBOUND = 0;
        this.AI_TIME = 0;
        this.SKILL_COOLDOWN = 0;
        this.ATTACK_SKILL = 0;
        this.BASE_ATTACK = 0;
        this.ADD_ATTACK = 0;
        this.BASE_BREAK_ATTACK = 0;
        this.BREAK_ATTACK = 0;
        this.BASE_HP = 0;
        this.ADD_HP = 0;
        this.BASE_BREAK_HP = 0;
        this.BREAK_HP = 0;
        this.BASE_MP = 0;
        this.ADD_MP = 0;
        this.BASE_BREAK_MP = 0;
        this.BREAK_MP = 0;
        this.BASE_PHYSICAL_DEFENCE = 0;
        this.ADD_PHYSICAL_DEFENCE = 0;
        this.BASE_BREAK_PHYSICAL_DEFENCE = 0;
        this.BREAK_PHYSICAL_DEFENCE = 0;
        this.BASE_MAGIC_DEFENCE = 0;
        this.ADD_MAGIC_DEFENCE = 0;
        this.BASE_BREAK_MAGIC_DEFENCE = 0;
        this.BREAK_MAGIC_DEFENCE = 0;
        this.HIT = 0;
        this.DODGE = 0;
        this.CRITICAL_STRIKE = 0;
        this.CRITICAL_DERATE = 0;
        this.ATTACK_DAMAGE = 0;
        this.MITIGATIONG = 0;
        this.PET_SKILL_1 = 0;
        this.PET_SKILL_2 = 0;
        this.PET_SKILL_3 = 0;
        this.PET_SKILL_4 = 0;
        this.SKILL_ACTIVE_LEVEL_1 = 0;
        this.SKILL_ACTIVE_LEVEL_2 = 0;
        this.SKILL_ACTIVE_LEVEL_3 = 0;
        this.SKILL_ACTIVE_LEVEL_4 = 0;
        this.SKILL_DESCRIPTOR = '';
        this.DROP_EXP = 0;
        this.MODEL_2 = '';
        this.MAXMANA = 0;
        this.MATTACK_DAMAGE = 0;
        this.SKILL = '';
        this.EFFECT = '';
        this.UI_EFFECT = '';
        this.SKILLPOINTS = 0;
        this.MAX_LEVEL = 0;
        this.MAX_LEVEL_BREAK = 0;
        this.MAX_STRENGTH = 0;
        this.EXP_MULRIPLE = 0;
        this.EXP_ELEMENT_MULRIPLE = 0;
        this.SUMMON_TIME = 0;
        this.ACTIVE_TIME = 0;
        this.PUNISH_TIME = 0;
        this.LEVEL_BERAK_FLAG = 0;
        this.ATTACK_TYPE = 0;
        this.BASE_MAGIC_DEF = 0;
        this.ADD_MAGIC_DEF = 0;
        this.RELATE_ID_1 = 0;
        this.RELATE_ID_2 = 0;
        this.RELATE_ID_3 = 0;
        this.RELATE_ID_4 = 0;
        this.RELATE_ID_5 = 0;
        this.RELATE_ID_6 = 0;
        this.RELATE_ID_7 = 0;
        this.RELATE_ID_8 = 0;
        this.RELATE_ID_9 = 0;
        this.RELATE_ID_10 = 0;
        this.RELATE_ID_11 = 0;
        this.RELATE_ID_12 = 0;
        this.RELATE_ID_13 = 0;
        this.RELATE_ID_14 = 0;
        this.RELATE_ID_15 = 0;
        this.SELL_PRICE = '';
        this.AUTO_HP = 0;
        this.AUTO_MP = 0;
        this.CRITICAL_STRIKE_DAMAGE = 0;
        this.CRITICAL_DAMAGE_DERATE = 0;
        this.CHARM_DEF = 0;
        this.FEAR_DEF = 0;
        this.FREEZE_DEF = 0;
        this.STUN_DEF = 0;
        this.BEATBACK_DEF = 0;
        this.KNOCKDOWN_DEF = 0;
        this.GREEN_REDUCTION = 0;
        this.RED_REDUCTION = 0;
        this.BLUE_REDUCTION = 0;
        this.SHADOW_REDUCTION = 0;
        this.GOLD_REDUCTION = 0;
        this.DROP_HP_MAX_NUM = 0;
        this.DROP_HP = 0;
        this.DROP_MP_MAX_NUM = 0;
        this.DROP_MP = 0;
        this.ATTACKSPEED = 0;
        this.ATTACK_STATE_1 = 0;
        this.ATTACK_STATE_2 = 0;
        this.ATTACK_STATE_3 = 0;
        this.AFFECT_BUFFER_1 = 0;
        this.AFFECT_BUFFER_2 = 0;
        this.AFFECT_BUFFER_3 = 0;
        this.GROUP_ID = 0;
        this.EVOLUTION_ID = 0;
        this.EVOLUTION_GET = 0;
        this.STORE_GET = 0;

    }

    return ActiveObject;
})();

/**
 * [当前为生成代码，不可以修改] ActiveObject 配置表
 * */
var ActiveObjectTableInstance = (function() {

    /**
    * 类的成员变量
    */
    var _unique;
    var _lines;

    /**
    * 单例函数
    */
    function Instance() {
        if(_unique === undefined) {
            _unique = new ActiveObjectTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ActiveObjectTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ActiveObject');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ActiveObject();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TXT = tmpArr[i].TXT;
            obj.DESCRIBE = tmpArr[i].DESCRIBE;
            obj.PET_TYPE = parseInt(tmpArr[i].PET_TYPE);
            obj.FIRST_SHOW = parseInt(tmpArr[i].FIRST_SHOW);
            obj.RENDER_TYPE = parseInt(tmpArr[i].RENDER_TYPE);
            obj.CLASS = tmpArr[i].CLASS;
            obj.INFO = tmpArr[i].INFO;
            obj.MODEL = parseInt(tmpArr[i].MODEL);
            obj.POS_Y = parseFloat(tmpArr[i].POS_Y);
            obj.ROTATION_Y = parseInt(tmpArr[i].ROTATION_Y);
            obj.HEAD_ATLAS_NAME = tmpArr[i].HEAD_ATLAS_NAME;
            obj.HEAD_SPRITE_NAME = tmpArr[i].HEAD_SPRITE_NAME;
            obj.IS_TUJIAN_SHOW = parseInt(tmpArr[i].IS_TUJIAN_SHOW);
            obj.SCALE = parseFloat(tmpArr[i].SCALE);
            obj.UI_SCALE = parseFloat(tmpArr[i].UI_SCALE);
            obj.STAR_LEVEL = parseInt(tmpArr[i].STAR_LEVEL);
            obj.APTITUDE_LEVEL = parseInt(tmpArr[i].APTITUDE_LEVEL);
            obj.ELEMENT_INDEX = parseInt(tmpArr[i].ELEMENT_INDEX);
            obj.MOVE_SPEED = parseFloat(tmpArr[i].MOVE_SPEED);
            obj.LOOKBOUND = parseFloat(tmpArr[i].LOOKBOUND);
            obj.AI_TIME = parseFloat(tmpArr[i].AI_TIME);
            obj.SKILL_COOLDOWN = parseFloat(tmpArr[i].SKILL_COOLDOWN);
            obj.ATTACK_SKILL = parseInt(tmpArr[i].ATTACK_SKILL);
            obj.BASE_ATTACK = parseInt(tmpArr[i].BASE_ATTACK);
            obj.ADD_ATTACK = parseInt(tmpArr[i].ADD_ATTACK);
            obj.BASE_BREAK_ATTACK = parseInt(tmpArr[i].BASE_BREAK_ATTACK);
            obj.BREAK_ATTACK = parseInt(tmpArr[i].BREAK_ATTACK);
            obj.BASE_HP = parseInt(tmpArr[i].BASE_HP);
            obj.ADD_HP = parseInt(tmpArr[i].ADD_HP);
            obj.BASE_BREAK_HP = parseInt(tmpArr[i].BASE_BREAK_HP);
            obj.BREAK_HP = parseInt(tmpArr[i].BREAK_HP);
            obj.BASE_MP = parseInt(tmpArr[i].BASE_MP);
            obj.ADD_MP = parseInt(tmpArr[i].ADD_MP);
            obj.BASE_BREAK_MP = parseInt(tmpArr[i].BASE_BREAK_MP);
            obj.BREAK_MP = parseInt(tmpArr[i].BREAK_MP);
            obj.BASE_PHYSICAL_DEFENCE = parseInt(tmpArr[i].BASE_PHYSICAL_DEFENCE);
            obj.ADD_PHYSICAL_DEFENCE = parseInt(tmpArr[i].ADD_PHYSICAL_DEFENCE);
            obj.BASE_BREAK_PHYSICAL_DEFENCE = parseInt(tmpArr[i].BASE_BREAK_PHYSICAL_DEFENCE);
            obj.BREAK_PHYSICAL_DEFENCE = parseInt(tmpArr[i].BREAK_PHYSICAL_DEFENCE);
            obj.BASE_MAGIC_DEFENCE = parseInt(tmpArr[i].BASE_MAGIC_DEFENCE);
            obj.ADD_MAGIC_DEFENCE = parseInt(tmpArr[i].ADD_MAGIC_DEFENCE);
            obj.BASE_BREAK_MAGIC_DEFENCE = parseInt(tmpArr[i].BASE_BREAK_MAGIC_DEFENCE);
            obj.BREAK_MAGIC_DEFENCE = parseInt(tmpArr[i].BREAK_MAGIC_DEFENCE);
            obj.HIT = parseInt(tmpArr[i].HIT);
            obj.DODGE = parseInt(tmpArr[i].DODGE);
            obj.CRITICAL_STRIKE = parseInt(tmpArr[i].CRITICAL_STRIKE);
            obj.CRITICAL_DERATE = parseInt(tmpArr[i].CRITICAL_DERATE);
            obj.ATTACK_DAMAGE = parseInt(tmpArr[i].ATTACK_DAMAGE);
            obj.MITIGATIONG = parseInt(tmpArr[i].MITIGATIONG);
            obj.PET_SKILL_1 = parseInt(tmpArr[i].PET_SKILL_1);
            obj.PET_SKILL_2 = parseInt(tmpArr[i].PET_SKILL_2);
            obj.PET_SKILL_3 = parseInt(tmpArr[i].PET_SKILL_3);
            obj.PET_SKILL_4 = parseInt(tmpArr[i].PET_SKILL_4);
            obj.SKILL_ACTIVE_LEVEL_1 = parseInt(tmpArr[i].SKILL_ACTIVE_LEVEL_1);
            obj.SKILL_ACTIVE_LEVEL_2 = parseInt(tmpArr[i].SKILL_ACTIVE_LEVEL_2);
            obj.SKILL_ACTIVE_LEVEL_3 = parseInt(tmpArr[i].SKILL_ACTIVE_LEVEL_3);
            obj.SKILL_ACTIVE_LEVEL_4 = parseInt(tmpArr[i].SKILL_ACTIVE_LEVEL_4);
            obj.SKILL_DESCRIPTOR = tmpArr[i].SKILL_DESCRIPTOR;
            obj.DROP_EXP = parseInt(tmpArr[i].DROP_EXP);
            obj.MODEL_2 = tmpArr[i].MODEL_2;
            obj.MAXMANA = parseInt(tmpArr[i].MAXMANA);
            obj.MATTACK_DAMAGE = parseInt(tmpArr[i].MATTACK_DAMAGE);
            obj.SKILL = tmpArr[i].SKILL;
            obj.EFFECT = tmpArr[i].EFFECT;
            obj.UI_EFFECT = tmpArr[i].UI_EFFECT;
            obj.SKILLPOINTS = parseInt(tmpArr[i].SKILLPOINTS);
            obj.MAX_LEVEL = parseInt(tmpArr[i].MAX_LEVEL);
            obj.MAX_LEVEL_BREAK = parseInt(tmpArr[i].MAX_LEVEL_BREAK);
            obj.MAX_STRENGTH = parseInt(tmpArr[i].MAX_STRENGTH);
            obj.EXP_MULRIPLE = parseFloat(tmpArr[i].EXP_MULRIPLE);
            obj.EXP_ELEMENT_MULRIPLE = parseFloat(tmpArr[i].EXP_ELEMENT_MULRIPLE);
            obj.SUMMON_TIME = parseInt(tmpArr[i].SUMMON_TIME);
            obj.ACTIVE_TIME = parseInt(tmpArr[i].ACTIVE_TIME);
            obj.PUNISH_TIME = parseInt(tmpArr[i].PUNISH_TIME);
            obj.LEVEL_BERAK_FLAG = parseInt(tmpArr[i].LEVEL_BERAK_FLAG);
            obj.ATTACK_TYPE = parseInt(tmpArr[i].ATTACK_TYPE);
            obj.BASE_MAGIC_DEF = parseInt(tmpArr[i].BASE_MAGIC_DEF);
            obj.ADD_MAGIC_DEF = parseInt(tmpArr[i].ADD_MAGIC_DEF);
            obj.RELATE_ID_1 = parseInt(tmpArr[i].RELATE_ID_1);
            obj.RELATE_ID_2 = parseInt(tmpArr[i].RELATE_ID_2);
            obj.RELATE_ID_3 = parseInt(tmpArr[i].RELATE_ID_3);
            obj.RELATE_ID_4 = parseInt(tmpArr[i].RELATE_ID_4);
            obj.RELATE_ID_5 = parseInt(tmpArr[i].RELATE_ID_5);
            obj.RELATE_ID_6 = parseInt(tmpArr[i].RELATE_ID_6);
            obj.RELATE_ID_7 = parseInt(tmpArr[i].RELATE_ID_7);
            obj.RELATE_ID_8 = parseInt(tmpArr[i].RELATE_ID_8);
            obj.RELATE_ID_9 = parseInt(tmpArr[i].RELATE_ID_9);
            obj.RELATE_ID_10 = parseInt(tmpArr[i].RELATE_ID_10);
            obj.RELATE_ID_11 = parseInt(tmpArr[i].RELATE_ID_11);
            obj.RELATE_ID_12 = parseInt(tmpArr[i].RELATE_ID_12);
            obj.RELATE_ID_13 = parseInt(tmpArr[i].RELATE_ID_13);
            obj.RELATE_ID_14 = parseInt(tmpArr[i].RELATE_ID_14);
            obj.RELATE_ID_15 = parseInt(tmpArr[i].RELATE_ID_15);
            obj.SELL_PRICE = tmpArr[i].SELL_PRICE;
            obj.AUTO_HP = parseInt(tmpArr[i].AUTO_HP);
            obj.AUTO_MP = parseInt(tmpArr[i].AUTO_MP);
            obj.CRITICAL_STRIKE_DAMAGE = parseInt(tmpArr[i].CRITICAL_STRIKE_DAMAGE);
            obj.CRITICAL_DAMAGE_DERATE = parseInt(tmpArr[i].CRITICAL_DAMAGE_DERATE);
            obj.CHARM_DEF = parseInt(tmpArr[i].CHARM_DEF);
            obj.FEAR_DEF = parseInt(tmpArr[i].FEAR_DEF);
            obj.FREEZE_DEF = parseInt(tmpArr[i].FREEZE_DEF);
            obj.STUN_DEF = parseInt(tmpArr[i].STUN_DEF);
            obj.BEATBACK_DEF = parseInt(tmpArr[i].BEATBACK_DEF);
            obj.KNOCKDOWN_DEF = parseInt(tmpArr[i].KNOCKDOWN_DEF);
            obj.GREEN_REDUCTION = parseInt(tmpArr[i].GREEN_REDUCTION);
            obj.RED_REDUCTION = parseInt(tmpArr[i].RED_REDUCTION);
            obj.BLUE_REDUCTION = parseInt(tmpArr[i].BLUE_REDUCTION);
            obj.SHADOW_REDUCTION = parseInt(tmpArr[i].SHADOW_REDUCTION);
            obj.GOLD_REDUCTION = parseInt(tmpArr[i].GOLD_REDUCTION);
            obj.DROP_HP_MAX_NUM = parseInt(tmpArr[i].DROP_HP_MAX_NUM);
            obj.DROP_HP = parseInt(tmpArr[i].DROP_HP);
            obj.DROP_MP_MAX_NUM = parseInt(tmpArr[i].DROP_MP_MAX_NUM);
            obj.DROP_MP = parseInt(tmpArr[i].DROP_MP);
            obj.ATTACKSPEED = parseInt(tmpArr[i].ATTACKSPEED);
            obj.ATTACK_STATE_1 = parseInt(tmpArr[i].ATTACK_STATE_1);
            obj.ATTACK_STATE_2 = parseInt(tmpArr[i].ATTACK_STATE_2);
            obj.ATTACK_STATE_3 = parseInt(tmpArr[i].ATTACK_STATE_3);
            obj.AFFECT_BUFFER_1 = parseInt(tmpArr[i].AFFECT_BUFFER_1);
            obj.AFFECT_BUFFER_2 = parseInt(tmpArr[i].AFFECT_BUFFER_2);
            obj.AFFECT_BUFFER_3 = parseInt(tmpArr[i].AFFECT_BUFFER_3);
            obj.GROUP_ID = parseInt(tmpArr[i].GROUP_ID);
            obj.EVOLUTION_ID = parseInt(tmpArr[i].EVOLUTION_ID);
            obj.EVOLUTION_GET = parseInt(tmpArr[i].EVOLUTION_GET);
            obj.STORE_GET = parseInt(tmpArr[i].STORE_GET);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ActiveObjectTable.prototype.GetLines = function() {
        return _lines;
    };
    
    /**
    * 返回一个单例函数
    */
    return Instance;
})();

/**
* 声明一个单例对象
*/
exports.Instance = ActiveObjectTableInstance;
