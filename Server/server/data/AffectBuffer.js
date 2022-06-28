
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] AffectBuffer 类为 AffectBufferTable 每一行的元素对象
 * */
var AffectBuffer = (function() {

    /**
    * 构造函数
    */
    function AffectBuffer() {
        this.INDEX = 0;
        this.NAME = '';
        this.TIP_TITLE = '';
        this.INFO = '';
        this.BUFFER_TYPE = '';
        this.ANIMATION = '';
        this.EFFECT = 0;
        this.VALUE_COEFF = '';
        this.EFFECT_PARAM = 0;
        this.TIME = 0;
        this.ADD_TIME = '';
        this.TIMES = 0;
        this.AFFECT_TYPE = '';
        this.AFFECT_VALUE = 0;
        this.ADD_AFFECT_VALUE = '';
        this.AFFECT_TYPE_1 = '';
        this.AFFECT_VALUE_1 = 0;
        this.ADD_AFFECT_VALUE_1 = '';
        this.BUFF_RANGE = 0;
        this.BUFFER_ATLAS_NAME = '';
        this.BUFFER_SPRITE_NAME = '';
        this.SKILL_ATLAS_NAME = '';
        this.SKILL_SPRITE_NAME = '';
        this.SCRIPT = 0;
        this.ITEM_TYPE = 0;
        this.ITEM_ID = 0;
        this.ITEM_NUM = 0;
        this.COST_TYPE = 0;
        this.COST_ID = 0;
        this.COST_NUM = 0;
        this.EXTRA_CONDITION = 0;
        this.SHOCKSCERRN_TIME = 0;
        this.RANGE = 0;
        this.AFFECT_TIME = 0;
        this.SPUTTERING_DAMAGE = 0;
        this.TARGET = 0;
        this.EXTRA_BUFFID = 0;
        this.START_BATTLE = 0;
        this.UPGRADE_BATTLE = 0;

    }

    return AffectBuffer;
})();

/**
 * [当前为生成代码，不可以修改] AffectBuffer 配置表
 * */
var AffectBufferTableInstance = (function() {

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
            _unique = new AffectBufferTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function AffectBufferTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('AffectBuffer');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new AffectBuffer();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TIP_TITLE = tmpArr[i].TIP_TITLE;
            obj.INFO = tmpArr[i].INFO;
            obj.BUFFER_TYPE = tmpArr[i].BUFFER_TYPE;
            obj.ANIMATION = tmpArr[i].ANIMATION;
            obj.EFFECT = parseInt(tmpArr[i].EFFECT);
            obj.VALUE_COEFF = tmpArr[i].VALUE_COEFF;
            obj.EFFECT_PARAM = parseInt(tmpArr[i].EFFECT_PARAM);
            obj.TIME = parseFloat(tmpArr[i].TIME);
            obj.ADD_TIME = tmpArr[i].ADD_TIME;
            obj.TIMES = parseInt(tmpArr[i].TIMES);
            obj.AFFECT_TYPE = tmpArr[i].AFFECT_TYPE;
            obj.AFFECT_VALUE = parseInt(tmpArr[i].AFFECT_VALUE);
            obj.ADD_AFFECT_VALUE = tmpArr[i].ADD_AFFECT_VALUE;
            obj.AFFECT_TYPE_1 = tmpArr[i].AFFECT_TYPE_1;
            obj.AFFECT_VALUE_1 = parseInt(tmpArr[i].AFFECT_VALUE_1);
            obj.ADD_AFFECT_VALUE_1 = tmpArr[i].ADD_AFFECT_VALUE_1;
            obj.BUFF_RANGE = parseInt(tmpArr[i].BUFF_RANGE);
            obj.BUFFER_ATLAS_NAME = tmpArr[i].BUFFER_ATLAS_NAME;
            obj.BUFFER_SPRITE_NAME = tmpArr[i].BUFFER_SPRITE_NAME;
            obj.SKILL_ATLAS_NAME = tmpArr[i].SKILL_ATLAS_NAME;
            obj.SKILL_SPRITE_NAME = tmpArr[i].SKILL_SPRITE_NAME;
            obj.SCRIPT = parseInt(tmpArr[i].SCRIPT);
            obj.ITEM_TYPE = parseInt(tmpArr[i].ITEM_TYPE);
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.ITEM_NUM = parseInt(tmpArr[i].ITEM_NUM);
            obj.COST_TYPE = parseInt(tmpArr[i].COST_TYPE);
            obj.COST_ID = parseInt(tmpArr[i].COST_ID);
            obj.COST_NUM = parseInt(tmpArr[i].COST_NUM);
            obj.EXTRA_CONDITION = parseInt(tmpArr[i].EXTRA_CONDITION);
            obj.SHOCKSCERRN_TIME = parseFloat(tmpArr[i].SHOCKSCERRN_TIME);
            obj.RANGE = parseInt(tmpArr[i].RANGE);
            obj.AFFECT_TIME = parseFloat(tmpArr[i].AFFECT_TIME);
            obj.SPUTTERING_DAMAGE = parseInt(tmpArr[i].SPUTTERING_DAMAGE);
            obj.TARGET = parseInt(tmpArr[i].TARGET);
            obj.EXTRA_BUFFID = parseInt(tmpArr[i].EXTRA_BUFFID);
            obj.START_BATTLE = parseInt(tmpArr[i].START_BATTLE);
            obj.UPGRADE_BATTLE = parseInt(tmpArr[i].UPGRADE_BATTLE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    AffectBufferTable.prototype.GetLines = function() {
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
exports.Instance = AffectBufferTableInstance;
