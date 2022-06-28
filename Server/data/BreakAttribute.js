
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BreakAttribute 类为 BreakAttributeTable 每一行的元素对象
 * */
var BreakAttribute = (function() {

    /**
    * 构造函数
    */
    function BreakAttribute() {
        this.INDEX = 0;
        this.APTITUDE_LEVEL = 0;
        this.BREAK_LEVEL = 0;
        this.BASE_BREAK_HP = 0;
        this.BASE_BREAK_ATTACK = 0;
        this.BASE_BREAK_PHYSICAL_DEFENCE = 0;
        this.BASE_BREAK_MAGIC_DEFENCE = 0;
        this.BREAK_HP = 0;
        this.BREAK_ATTACK = 0;
        this.BREAK_PHYSICAL_DEFENCE = 0;
        this.BREAK_MAGIC_DEFENCE = 0;

    }

    return BreakAttribute;
})();

/**
 * [当前为生成代码，不可以修改] BreakAttribute 配置表
 * */
var BreakAttributeTableInstance = (function() {

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
            _unique = new BreakAttributeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BreakAttributeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BreakAttribute');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BreakAttribute();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.APTITUDE_LEVEL = parseInt(tmpArr[i].APTITUDE_LEVEL);
            obj.BREAK_LEVEL = parseInt(tmpArr[i].BREAK_LEVEL);
            obj.BASE_BREAK_HP = parseInt(tmpArr[i].BASE_BREAK_HP);
            obj.BASE_BREAK_ATTACK = parseInt(tmpArr[i].BASE_BREAK_ATTACK);
            obj.BASE_BREAK_PHYSICAL_DEFENCE = parseInt(tmpArr[i].BASE_BREAK_PHYSICAL_DEFENCE);
            obj.BASE_BREAK_MAGIC_DEFENCE = parseInt(tmpArr[i].BASE_BREAK_MAGIC_DEFENCE);
            obj.BREAK_HP = parseInt(tmpArr[i].BREAK_HP);
            obj.BREAK_ATTACK = parseInt(tmpArr[i].BREAK_ATTACK);
            obj.BREAK_PHYSICAL_DEFENCE = parseInt(tmpArr[i].BREAK_PHYSICAL_DEFENCE);
            obj.BREAK_MAGIC_DEFENCE = parseInt(tmpArr[i].BREAK_MAGIC_DEFENCE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BreakAttributeTable.prototype.GetLines = function() {
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
exports.Instance = BreakAttributeTableInstance;
