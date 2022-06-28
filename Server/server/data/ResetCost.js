
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ResetCost 类为 ResetCostTable 每一行的元素对象
 * */
var ResetCost = (function() {

    /**
    * 构造函数
    */
    function ResetCost() {
        this.INDEX = 0;
        this.COST_NUM = 0;

    }

    return ResetCost;
})();

/**
 * [当前为生成代码，不可以修改] ResetCost 配置表
 * */
var ResetCostTableInstance = (function() {

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
            _unique = new ResetCostTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ResetCostTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ResetCost');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ResetCost();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.COST_NUM = parseInt(tmpArr[i].COST_NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ResetCostTable.prototype.GetLines = function() {
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
exports.Instance = ResetCostTableInstance;
