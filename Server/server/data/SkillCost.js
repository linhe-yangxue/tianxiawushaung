
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SkillCost 类为 SkillCostTable 每一行的元素对象
 * */
var SkillCost = (function() {

    /**
    * 构造函数
    */
    function SkillCost() {
        this.INDEX = 0;
        this.NEED_LEVEL = 0;
        this.MONEY_COST = 0;
        this.SKILL_BOOK_COST = 0;
        this.TOTAL_MONEY_COST = 0;
        this.TOTAL_SKILL_BOOK_COST = 0;

    }

    return SkillCost;
})();

/**
 * [当前为生成代码，不可以修改] SkillCost 配置表
 * */
var SkillCostTableInstance = (function() {

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
            _unique = new SkillCostTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SkillCostTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SkillCost');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SkillCost();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NEED_LEVEL = parseInt(tmpArr[i].NEED_LEVEL);
            obj.MONEY_COST = parseInt(tmpArr[i].MONEY_COST);
            obj.SKILL_BOOK_COST = parseInt(tmpArr[i].SKILL_BOOK_COST);
            obj.TOTAL_MONEY_COST = parseInt(tmpArr[i].TOTAL_MONEY_COST);
            obj.TOTAL_SKILL_BOOK_COST = parseInt(tmpArr[i].TOTAL_SKILL_BOOK_COST);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SkillCostTable.prototype.GetLines = function() {
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
exports.Instance = SkillCostTableInstance;
