
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EnergyCost 类为 EnergyCostTable 每一行的元素对象
 * */
var EnergyCost = (function() {

    /**
    * 构造函数
    */
    function EnergyCost() {
        this.INDEX = 0;
        this.ENERGY_COST = 0;

    }

    return EnergyCost;
})();

/**
 * [当前为生成代码，不可以修改] EnergyCost 配置表
 * */
var EnergyCostTableInstance = (function() {

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
            _unique = new EnergyCostTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EnergyCostTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EnergyCost');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EnergyCost();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ENERGY_COST = parseInt(tmpArr[i].ENERGY_COST);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EnergyCostTable.prototype.GetLines = function() {
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
exports.Instance = EnergyCostTableInstance;
