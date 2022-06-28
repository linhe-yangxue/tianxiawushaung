
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MonsterObject 类为 MonsterObjectTable 每一行的元素对象
 * */
var MonsterObject = (function() {

    /**
    * 构造函数
    */
    function MonsterObject() {
        this.INDEX = 0;
        this.NAME = '';
        this.CLASS = '';
        this.INFO = '';
        this.MODEL = 0;
        this.RENDER_TYPE = 0;
        this.HEAD_ATLAS_NAME = '';
        this.HEAD_SPRITE_NAME = '';
        this.ELEMENT_INDEX = 0;
        this.STAR_LEVEL = 0;
        this.SCALE = 0;
        this.UI_SCALE = 0;
        this.MOVE_SPEED = 0;
        this.LOOKBOUND = 0;
        this.AI_TIME = 0;
        this.SKILL_COOLDOWN = 0;
        this.ATTACK_SKILL = 0;
        this.BASE_ATTACK = 0;
        this.BASE_HP = 0;
        this.PHYSICAL_DEFENCE = 0;
        this.MAGIC_DEFENCE = 0;
        this.HIT = 0;
        this.DODGE = 0;
        this.ATTACKSPEED = 0;
        this.CRITICAL_STRIKE = 0;
        this.CHARM_DEF = 0;
        this.FEAR_DEF = 0;
        this.FREEZE_DEF = 0;
        this.STUN_DEF = 0;
        this.BEATBACK_DEF = 0;
        this.KNOCKDOWN_DEF = 0;
        this.HIT_RATE = 0;
        this.MITIGATIONG = 0;
        this.DROP_HP_MAX_NUM = 0;
        this.DROP_HP = 0;
        this.DROP_MP_MAX_NUM = 0;
        this.DROP_MP = 0;
        this.PET_SKILL_1 = 0;
        this.PET_SKILL_2 = 0;
        this.PET_SKILL_3 = 0;
        this.PET_SKILL_4 = 0;
        this.EFFECT = '';
        this.GREEN_REDUCTION = 0;
        this.RED_REDUCTION = 0;
        this.BLUE_REDUCTION = 0;
        this.SHADOW_REDUCTION = 0;
        this.GOLD_REDUCTION = 0;
        this.DEFENCE_CRITICAL_STRIKE = 0;
        this.CRITICAL_STRIKE_DAMAGE = 0;
        this.CRITICAL_DAMAGE_DERATE = 0;
        this.AUTO_HP = 0;
        this.AUTO_MP = 0;
        this.ATTACK_STATE_1 = 0;
        this.ATTACK_STATE_2 = 0;
        this.ATTACK_STATE_3 = 0;
        this.AFFECT_BUFFER_1 = 0;
        this.AFFECT_BUFFER_2 = 0;
        this.AFFECT_BUFFER_3 = 0;
        this.BELOW_HP_RATE = 0;
        this.HP_SKILL = 0;
        this.SKILL = '';
        this.PET_CD_1 = 0;
        this.PET_CD_2 = 0;
        this.PET_CD_3 = 0;
        this.PET_CD_4 = 0;
        this.FULING_ID = 0;

    }

    return MonsterObject;
})();

/**
 * [当前为生成代码，不可以修改] MonsterObject 配置表
 * */
var MonsterObjectTableInstance = (function() {

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
            _unique = new MonsterObjectTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MonsterObjectTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MonsterObject');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MonsterObject();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.CLASS = tmpArr[i].CLASS;
            obj.INFO = tmpArr[i].INFO;
            obj.MODEL = parseInt(tmpArr[i].MODEL);
            obj.RENDER_TYPE = parseInt(tmpArr[i].RENDER_TYPE);
            obj.HEAD_ATLAS_NAME = tmpArr[i].HEAD_ATLAS_NAME;
            obj.HEAD_SPRITE_NAME = tmpArr[i].HEAD_SPRITE_NAME;
            obj.ELEMENT_INDEX = parseInt(tmpArr[i].ELEMENT_INDEX);
            obj.STAR_LEVEL = parseInt(tmpArr[i].STAR_LEVEL);
            obj.SCALE = parseFloat(tmpArr[i].SCALE);
            obj.UI_SCALE = parseFloat(tmpArr[i].UI_SCALE);
            obj.MOVE_SPEED = parseFloat(tmpArr[i].MOVE_SPEED);
            obj.LOOKBOUND = parseFloat(tmpArr[i].LOOKBOUND);
            obj.AI_TIME = parseFloat(tmpArr[i].AI_TIME);
            obj.SKILL_COOLDOWN = parseFloat(tmpArr[i].SKILL_COOLDOWN);
            obj.ATTACK_SKILL = parseInt(tmpArr[i].ATTACK_SKILL);
            obj.BASE_ATTACK = parseFloat(tmpArr[i].BASE_ATTACK);
            obj.BASE_HP = parseInt(tmpArr[i].BASE_HP);
            obj.PHYSICAL_DEFENCE = parseInt(tmpArr[i].PHYSICAL_DEFENCE);
            obj.MAGIC_DEFENCE = parseInt(tmpArr[i].MAGIC_DEFENCE);
            obj.HIT = parseInt(tmpArr[i].HIT);
            obj.DODGE = parseInt(tmpArr[i].DODGE);
            obj.ATTACKSPEED = parseInt(tmpArr[i].ATTACKSPEED);
            obj.CRITICAL_STRIKE = parseInt(tmpArr[i].CRITICAL_STRIKE);
            obj.CHARM_DEF = parseInt(tmpArr[i].CHARM_DEF);
            obj.FEAR_DEF = parseInt(tmpArr[i].FEAR_DEF);
            obj.FREEZE_DEF = parseInt(tmpArr[i].FREEZE_DEF);
            obj.STUN_DEF = parseInt(tmpArr[i].STUN_DEF);
            obj.BEATBACK_DEF = parseInt(tmpArr[i].BEATBACK_DEF);
            obj.KNOCKDOWN_DEF = parseInt(tmpArr[i].KNOCKDOWN_DEF);
            obj.HIT_RATE = parseInt(tmpArr[i].HIT_RATE);
            obj.MITIGATIONG = parseInt(tmpArr[i].MITIGATIONG);
            obj.DROP_HP_MAX_NUM = parseInt(tmpArr[i].DROP_HP_MAX_NUM);
            obj.DROP_HP = parseInt(tmpArr[i].DROP_HP);
            obj.DROP_MP_MAX_NUM = parseInt(tmpArr[i].DROP_MP_MAX_NUM);
            obj.DROP_MP = parseInt(tmpArr[i].DROP_MP);
            obj.PET_SKILL_1 = parseInt(tmpArr[i].PET_SKILL_1);
            obj.PET_SKILL_2 = parseInt(tmpArr[i].PET_SKILL_2);
            obj.PET_SKILL_3 = parseInt(tmpArr[i].PET_SKILL_3);
            obj.PET_SKILL_4 = parseInt(tmpArr[i].PET_SKILL_4);
            obj.EFFECT = tmpArr[i].EFFECT;
            obj.GREEN_REDUCTION = parseInt(tmpArr[i].GREEN_REDUCTION);
            obj.RED_REDUCTION = parseInt(tmpArr[i].RED_REDUCTION);
            obj.BLUE_REDUCTION = parseInt(tmpArr[i].BLUE_REDUCTION);
            obj.SHADOW_REDUCTION = parseInt(tmpArr[i].SHADOW_REDUCTION);
            obj.GOLD_REDUCTION = parseInt(tmpArr[i].GOLD_REDUCTION);
            obj.DEFENCE_CRITICAL_STRIKE = parseInt(tmpArr[i].DEFENCE_CRITICAL_STRIKE);
            obj.CRITICAL_STRIKE_DAMAGE = parseInt(tmpArr[i].CRITICAL_STRIKE_DAMAGE);
            obj.CRITICAL_DAMAGE_DERATE = parseInt(tmpArr[i].CRITICAL_DAMAGE_DERATE);
            obj.AUTO_HP = parseInt(tmpArr[i].AUTO_HP);
            obj.AUTO_MP = parseInt(tmpArr[i].AUTO_MP);
            obj.ATTACK_STATE_1 = parseInt(tmpArr[i].ATTACK_STATE_1);
            obj.ATTACK_STATE_2 = parseInt(tmpArr[i].ATTACK_STATE_2);
            obj.ATTACK_STATE_3 = parseInt(tmpArr[i].ATTACK_STATE_3);
            obj.AFFECT_BUFFER_1 = parseInt(tmpArr[i].AFFECT_BUFFER_1);
            obj.AFFECT_BUFFER_2 = parseInt(tmpArr[i].AFFECT_BUFFER_2);
            obj.AFFECT_BUFFER_3 = parseInt(tmpArr[i].AFFECT_BUFFER_3);
            obj.BELOW_HP_RATE = parseInt(tmpArr[i].BELOW_HP_RATE);
            obj.HP_SKILL = parseInt(tmpArr[i].HP_SKILL);
            obj.SKILL = tmpArr[i].SKILL;
            obj.PET_CD_1 = parseInt(tmpArr[i].PET_CD_1);
            obj.PET_CD_2 = parseInt(tmpArr[i].PET_CD_2);
            obj.PET_CD_3 = parseInt(tmpArr[i].PET_CD_3);
            obj.PET_CD_4 = parseInt(tmpArr[i].PET_CD_4);
            obj.FULING_ID = parseInt(tmpArr[i].FULING_ID);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MonsterObjectTable.prototype.GetLines = function() {
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
exports.Instance = MonsterObjectTableInstance;
