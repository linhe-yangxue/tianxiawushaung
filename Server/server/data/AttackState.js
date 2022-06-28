
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] AttackState 类为 AttackStateTable 每一行的元素对象
 * */
var AttackState = (function() {

    /**
    * 构造函数
    */
    function AttackState() {
        this.INDEX = 0;
        this.NAME = '';
        this.TIP_TITLE = '';
        this.INFO = '';
        this.SKILL_ATLAS_NAME = '';
        this.SKILL_SPRITE_NAME = '';
        this.ICON = '';
        this.ATTACK_AFFECT = 0;
        this.ATTACK_AFFECT_OBJECT = '';
        this.ATTACK_TARGET_RANGE = 0;
        this.ATTACK_AFFECT_RATE = 0;
        this.ADD_ATTACK_AFFECT_RATE = 0;
        this.HIT_AFFECT = 0;
        this.HIT_AFFECT_OBJECT = '';
        this.HIT_TARGET_RANGE = 0;
        this.HIT_AFFECT_RATE = 0;
        this.ADD_HIT_AFFECT_RATE = 0;
        this.AUREOLA_AFFECT = 0;
        this.AUREOLA_AFFECT_RANGE = 0;
        this.AUREOLA_AFFECT_OBJECT = '';
        this.AUREOLA_AFFECT_RATE = 0;
        this.AUREOLA_AFFECT_TIME = 0;
        this.ITEM_TYPE = 0;
        this.ITEM_ID = 0;
        this.ITEM_NUM = 0;
        this.COST_TYPE = 0;
        this.COST_ID = 0;
        this.COST_NUM = 0;
        this.START_BATTLE = 0;
        this.UPGRADE_BATTLE = 0;

    }

    return AttackState;
})();

/**
 * [当前为生成代码，不可以修改] AttackState 配置表
 * */
var AttackStateTableInstance = (function() {

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
            _unique = new AttackStateTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function AttackStateTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('AttackState');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new AttackState();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TIP_TITLE = tmpArr[i].TIP_TITLE;
            obj.INFO = tmpArr[i].INFO;
            obj.SKILL_ATLAS_NAME = tmpArr[i].SKILL_ATLAS_NAME;
            obj.SKILL_SPRITE_NAME = tmpArr[i].SKILL_SPRITE_NAME;
            obj.ICON = tmpArr[i].ICON;
            obj.ATTACK_AFFECT = parseInt(tmpArr[i].ATTACK_AFFECT);
            obj.ATTACK_AFFECT_OBJECT = tmpArr[i].ATTACK_AFFECT_OBJECT;
            obj.ATTACK_TARGET_RANGE = parseFloat(tmpArr[i].ATTACK_TARGET_RANGE);
            obj.ATTACK_AFFECT_RATE = parseInt(tmpArr[i].ATTACK_AFFECT_RATE);
            obj.ADD_ATTACK_AFFECT_RATE = parseFloat(tmpArr[i].ADD_ATTACK_AFFECT_RATE);
            obj.HIT_AFFECT = parseInt(tmpArr[i].HIT_AFFECT);
            obj.HIT_AFFECT_OBJECT = tmpArr[i].HIT_AFFECT_OBJECT;
            obj.HIT_TARGET_RANGE = parseFloat(tmpArr[i].HIT_TARGET_RANGE);
            obj.HIT_AFFECT_RATE = parseInt(tmpArr[i].HIT_AFFECT_RATE);
            obj.ADD_HIT_AFFECT_RATE = parseFloat(tmpArr[i].ADD_HIT_AFFECT_RATE);
            obj.AUREOLA_AFFECT = parseInt(tmpArr[i].AUREOLA_AFFECT);
            obj.AUREOLA_AFFECT_RANGE = parseInt(tmpArr[i].AUREOLA_AFFECT_RANGE);
            obj.AUREOLA_AFFECT_OBJECT = tmpArr[i].AUREOLA_AFFECT_OBJECT;
            obj.AUREOLA_AFFECT_RATE = parseInt(tmpArr[i].AUREOLA_AFFECT_RATE);
            obj.AUREOLA_AFFECT_TIME = parseInt(tmpArr[i].AUREOLA_AFFECT_TIME);
            obj.ITEM_TYPE = parseInt(tmpArr[i].ITEM_TYPE);
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.ITEM_NUM = parseInt(tmpArr[i].ITEM_NUM);
            obj.COST_TYPE = parseInt(tmpArr[i].COST_TYPE);
            obj.COST_ID = parseInt(tmpArr[i].COST_ID);
            obj.COST_NUM = parseInt(tmpArr[i].COST_NUM);
            obj.START_BATTLE = parseInt(tmpArr[i].START_BATTLE);
            obj.UPGRADE_BATTLE = parseInt(tmpArr[i].UPGRADE_BATTLE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    AttackStateTable.prototype.GetLines = function() {
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
exports.Instance = AttackStateTableInstance;
