
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Skill 类为 SkillTable 每一行的元素对象
 * */
var Skill = (function() {

    /**
    * 构造函数
    */
    function Skill() {
        this.INDEX = 0;
        this.NAME = '';
        this.TIP_TITLE = '';
        this.INFO = '';
        this.TYPE = '';
        this.ATTACK_SKILL = 0;
        this.SKILL_ATLAS_NAME = '';
        this.SKILL_SPRITE_NAME = '';
        this.START_MOTION = '';
        this.START_EFFECT = 0;
        this.START_TIME = 0;
        this.ATTACK_MOTION = '';
        this.ATTACK_EFFECT = 0;
        this.EFFECT_SPACE = 0;
        this.ATTACK_DISTANCE = 0;
        this.ATTACK_TIME = 0;
        this.HIT_MOTION = '';
        this.DAMAGE_EFFECT = 0;
        this.DO_HIT_TIME = 0;
        this.DAMAGE = 0;
        this.ADD_DAMAGE = '';
        this.DAMAGE_TYPE_PARAM = 0;
        this.DAMAGE_TIME = 0;
        this.DAMAGE_COUNT = 0;
        this.MULT_EFFECT = 0;
        this.EXTRA_PARAM = '';
        this.DAMAGE_RANGE = 0;
        this.CAMERA_SHAKE = 0;
        this.BEAT_BACK = 0;
        this.CD_TIME = 0;
        this.ADD_CD_TIME = 0;
        this.NEED_MP = 0;
        this.ADD_NEED_MP = 0;
        this.FLY_LENGTH = 0;
        this.FLY_SPEED = 0;
        this.OBJECT_ID = 0;
        this.OBJECT_TIME = 0;
        this.TARGET_CONDITION = 0;
        this.BUFF_TARGET_TYPE = 0;
        this.BUFF_ADDITION = 0;
        this.BUFF_PROBABILITY_BASE = 0;
        this.BUFF_PROBABILITY_ADD = '';
        this.BUFF_RANGE = 0;
        this.ATTACK_STATE = 0;
        this.IS_ANIME = 0;
        this.ANIME_EFFECT = 0;
        this.PAUSE_TIME = 0;
        this.ITEM_TYPE = 0;
        this.ITEM_ID = 0;
        this.ITEM_NUM = 0;
        this.COST_TYPE = 0;
        this.COST_ID = 0;
        this.COST_NUM = 0;
        this.START_BATTLE = 0;
        this.UPGRADE_BATTLE = 0;
        this.ICON = '';
        this.DAMAGE_NUM = 0;
        this.ADD_DAMAGE_NUM = 0;
        this.ATTACK_TYPE = 0;
        this.SKILL_CONDITION = '';

    }

    return Skill;
})();

/**
 * [当前为生成代码，不可以修改] Skill 配置表
 * */
var SkillTableInstance = (function() {

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
            _unique = new SkillTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SkillTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Skill');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Skill();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TIP_TITLE = tmpArr[i].TIP_TITLE;
            obj.INFO = tmpArr[i].INFO;
            obj.TYPE = tmpArr[i].TYPE;
            obj.ATTACK_SKILL = parseInt(tmpArr[i].ATTACK_SKILL);
            obj.SKILL_ATLAS_NAME = tmpArr[i].SKILL_ATLAS_NAME;
            obj.SKILL_SPRITE_NAME = tmpArr[i].SKILL_SPRITE_NAME;
            obj.START_MOTION = tmpArr[i].START_MOTION;
            obj.START_EFFECT = parseInt(tmpArr[i].START_EFFECT);
            obj.START_TIME = parseFloat(tmpArr[i].START_TIME);
            obj.ATTACK_MOTION = tmpArr[i].ATTACK_MOTION;
            obj.ATTACK_EFFECT = parseInt(tmpArr[i].ATTACK_EFFECT);
            obj.EFFECT_SPACE = parseFloat(tmpArr[i].EFFECT_SPACE);
            obj.ATTACK_DISTANCE = parseFloat(tmpArr[i].ATTACK_DISTANCE);
            obj.ATTACK_TIME = parseFloat(tmpArr[i].ATTACK_TIME);
            obj.HIT_MOTION = tmpArr[i].HIT_MOTION;
            obj.DAMAGE_EFFECT = parseInt(tmpArr[i].DAMAGE_EFFECT);
            obj.DO_HIT_TIME = parseFloat(tmpArr[i].DO_HIT_TIME);
            obj.DAMAGE = parseInt(tmpArr[i].DAMAGE);
            obj.ADD_DAMAGE = tmpArr[i].ADD_DAMAGE;
            obj.DAMAGE_TYPE_PARAM = parseInt(tmpArr[i].DAMAGE_TYPE_PARAM);
            obj.DAMAGE_TIME = parseFloat(tmpArr[i].DAMAGE_TIME);
            obj.DAMAGE_COUNT = parseInt(tmpArr[i].DAMAGE_COUNT);
            obj.MULT_EFFECT = parseInt(tmpArr[i].MULT_EFFECT);
            obj.EXTRA_PARAM = tmpArr[i].EXTRA_PARAM;
            obj.DAMAGE_RANGE = parseFloat(tmpArr[i].DAMAGE_RANGE);
            obj.CAMERA_SHAKE = parseInt(tmpArr[i].CAMERA_SHAKE);
            obj.BEAT_BACK = parseFloat(tmpArr[i].BEAT_BACK);
            obj.CD_TIME = parseFloat(tmpArr[i].CD_TIME);
            obj.ADD_CD_TIME = parseFloat(tmpArr[i].ADD_CD_TIME);
            obj.NEED_MP = parseInt(tmpArr[i].NEED_MP);
            obj.ADD_NEED_MP = parseInt(tmpArr[i].ADD_NEED_MP);
            obj.FLY_LENGTH = parseFloat(tmpArr[i].FLY_LENGTH);
            obj.FLY_SPEED = parseFloat(tmpArr[i].FLY_SPEED);
            obj.OBJECT_ID = parseInt(tmpArr[i].OBJECT_ID);
            obj.OBJECT_TIME = parseInt(tmpArr[i].OBJECT_TIME);
            obj.TARGET_CONDITION = parseInt(tmpArr[i].TARGET_CONDITION);
            obj.BUFF_TARGET_TYPE = parseInt(tmpArr[i].BUFF_TARGET_TYPE);
            obj.BUFF_ADDITION = parseInt(tmpArr[i].BUFF_ADDITION);
            obj.BUFF_PROBABILITY_BASE = parseInt(tmpArr[i].BUFF_PROBABILITY_BASE);
            obj.BUFF_PROBABILITY_ADD = tmpArr[i].BUFF_PROBABILITY_ADD;
            obj.BUFF_RANGE = parseFloat(tmpArr[i].BUFF_RANGE);
            obj.ATTACK_STATE = parseInt(tmpArr[i].ATTACK_STATE);
            obj.IS_ANIME = parseInt(tmpArr[i].IS_ANIME);
            obj.ANIME_EFFECT = parseInt(tmpArr[i].ANIME_EFFECT);
            obj.PAUSE_TIME = parseFloat(tmpArr[i].PAUSE_TIME);
            obj.ITEM_TYPE = parseInt(tmpArr[i].ITEM_TYPE);
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.ITEM_NUM = parseInt(tmpArr[i].ITEM_NUM);
            obj.COST_TYPE = parseInt(tmpArr[i].COST_TYPE);
            obj.COST_ID = parseInt(tmpArr[i].COST_ID);
            obj.COST_NUM = parseInt(tmpArr[i].COST_NUM);
            obj.START_BATTLE = parseInt(tmpArr[i].START_BATTLE);
            obj.UPGRADE_BATTLE = parseInt(tmpArr[i].UPGRADE_BATTLE);
            obj.ICON = tmpArr[i].ICON;
            obj.DAMAGE_NUM = parseInt(tmpArr[i].DAMAGE_NUM);
            obj.ADD_DAMAGE_NUM = parseInt(tmpArr[i].ADD_DAMAGE_NUM);
            obj.ATTACK_TYPE = parseInt(tmpArr[i].ATTACK_TYPE);
            obj.SKILL_CONDITION = tmpArr[i].SKILL_CONDITION;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SkillTable.prototype.GetLines = function() {
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
exports.Instance = SkillTableInstance;
