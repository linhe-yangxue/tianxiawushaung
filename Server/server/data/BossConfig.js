
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BossConfig 类为 BossConfigTable 每一行的元素对象
 * */
var BossConfig = (function() {

    /**
    * 构造函数
    */
    function BossConfig() {
        this.INDEX = 0;
        this.NAME = '';
        this.CLASS = '';
        this.SCENE_ID = 0;
        this.INFO = '';
        this.LV = 0;
        this.MODEL = 0;
        this.HEAD_ATLAS_NAME = '';
        this.HEAD_SPRITE_NAME = '';
        this.ELEMENT_INDEX = 0;
        this.STAR_LEVEL = 0;
        this.SCALE = 0;
        this.POS_Y = 0;
        this.ROTATION_Y = 0;
        this.MOVE_SPEED = 0;
        this.LOOKBOUND = 0;
        this.AI_TIME = 0;
        this.SKILL_COOLDOWN = 0;
        this.ATTACK_SKILL = 0;
        this.BASE_ATTACK = 0;
        this.BASE_HP = 0;
        this.MAGIC_DEFENCE = 0;
        this.PHYSICAL_DEFENCE = 0;
        this.HIT = 0;
        this.DODGE = 0;
        this.CRITICAL_STRIKE = 0;
        this.CRITICAL_DEF = 0;
        this.DAMAGE_REDUCE = 0;
        this.DAMAGE_INCREASE = 0;
        this.PET_SKILL_1 = 0;
        this.PET_SKILL_2 = 0;
        this.PET_SKILL_3 = 0;
        this.PET_SKILL_4 = 0;
        this.PET_CD_1 = 0;
        this.PET_CD_2 = 0;
        this.PET_CD_3 = 0;
        this.PET_CD_4 = 0;
        this.ATTACK_SKILL_1 = 0;
        this.ATTACK_SKILL_2 = 0;
        this.ATTACK_SKILL_3 = 0;
        this.ATTACK_SKILL_4 = 0;
        this.ATTACK_SKILL_5 = 0;
        this.EFFECT = '';
        this.UI_EFFECT = 0;
        this.DEBUFF_IMMUNE = 0;

    }

    return BossConfig;
})();

/**
 * [当前为生成代码，不可以修改] BossConfig 配置表
 * */
var BossConfigTableInstance = (function() {

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
            _unique = new BossConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BossConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BossConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BossConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.CLASS = tmpArr[i].CLASS;
            obj.SCENE_ID = parseInt(tmpArr[i].SCENE_ID);
            obj.INFO = tmpArr[i].INFO;
            obj.LV = parseInt(tmpArr[i].LV);
            obj.MODEL = parseInt(tmpArr[i].MODEL);
            obj.HEAD_ATLAS_NAME = tmpArr[i].HEAD_ATLAS_NAME;
            obj.HEAD_SPRITE_NAME = tmpArr[i].HEAD_SPRITE_NAME;
            obj.ELEMENT_INDEX = parseInt(tmpArr[i].ELEMENT_INDEX);
            obj.STAR_LEVEL = parseInt(tmpArr[i].STAR_LEVEL);
            obj.SCALE = parseFloat(tmpArr[i].SCALE);
            obj.POS_Y = parseFloat(tmpArr[i].POS_Y);
            obj.ROTATION_Y = parseInt(tmpArr[i].ROTATION_Y);
            obj.MOVE_SPEED = parseInt(tmpArr[i].MOVE_SPEED);
            obj.LOOKBOUND = parseInt(tmpArr[i].LOOKBOUND);
            obj.AI_TIME = parseFloat(tmpArr[i].AI_TIME);
            obj.SKILL_COOLDOWN = parseFloat(tmpArr[i].SKILL_COOLDOWN);
            obj.ATTACK_SKILL = parseInt(tmpArr[i].ATTACK_SKILL);
            obj.BASE_ATTACK = parseInt(tmpArr[i].BASE_ATTACK);
            obj.BASE_HP = parseInt(tmpArr[i].BASE_HP);
            obj.MAGIC_DEFENCE = parseInt(tmpArr[i].MAGIC_DEFENCE);
            obj.PHYSICAL_DEFENCE = parseInt(tmpArr[i].PHYSICAL_DEFENCE);
            obj.HIT = parseInt(tmpArr[i].HIT);
            obj.DODGE = parseInt(tmpArr[i].DODGE);
            obj.CRITICAL_STRIKE = parseInt(tmpArr[i].CRITICAL_STRIKE);
            obj.CRITICAL_DEF = parseInt(tmpArr[i].CRITICAL_DEF);
            obj.DAMAGE_REDUCE = parseInt(tmpArr[i].DAMAGE_REDUCE);
            obj.DAMAGE_INCREASE = parseInt(tmpArr[i].DAMAGE_INCREASE);
            obj.PET_SKILL_1 = parseInt(tmpArr[i].PET_SKILL_1);
            obj.PET_SKILL_2 = parseInt(tmpArr[i].PET_SKILL_2);
            obj.PET_SKILL_3 = parseInt(tmpArr[i].PET_SKILL_3);
            obj.PET_SKILL_4 = parseInt(tmpArr[i].PET_SKILL_4);
            obj.PET_CD_1 = parseInt(tmpArr[i].PET_CD_1);
            obj.PET_CD_2 = parseInt(tmpArr[i].PET_CD_2);
            obj.PET_CD_3 = parseInt(tmpArr[i].PET_CD_3);
            obj.PET_CD_4 = parseInt(tmpArr[i].PET_CD_4);
            obj.ATTACK_SKILL_1 = parseInt(tmpArr[i].ATTACK_SKILL_1);
            obj.ATTACK_SKILL_2 = parseInt(tmpArr[i].ATTACK_SKILL_2);
            obj.ATTACK_SKILL_3 = parseInt(tmpArr[i].ATTACK_SKILL_3);
            obj.ATTACK_SKILL_4 = parseInt(tmpArr[i].ATTACK_SKILL_4);
            obj.ATTACK_SKILL_5 = parseInt(tmpArr[i].ATTACK_SKILL_5);
            obj.EFFECT = tmpArr[i].EFFECT;
            obj.UI_EFFECT = parseInt(tmpArr[i].UI_EFFECT);
            obj.DEBUFF_IMMUNE = parseInt(tmpArr[i].DEBUFF_IMMUNE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BossConfigTable.prototype.GetLines = function() {
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
exports.Instance = BossConfigTableInstance;
