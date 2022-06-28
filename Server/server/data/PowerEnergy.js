
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PowerEnergy 类为 PowerEnergyTable 每一行的元素对象
 * */
var PowerEnergy = (function() {

    /**
    * 构造函数
    */
    function PowerEnergy() {
        this.INDEX = 0;
        this.BASE = 0;
        this.QUOTIETY = 0;

    }

    return PowerEnergy;
})();

/**
 * [当前为生成代码，不可以修改] PowerEnergy 配置表
 * */
var PowerEnergyTableInstance = (function() {

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
            _unique = new PowerEnergyTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PowerEnergyTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PowerEnergy');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PowerEnergy();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.BASE = parseFloat(tmpArr[i].BASE);
            obj.QUOTIETY = parseFloat(tmpArr[i].QUOTIETY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PowerEnergyTable.prototype.GetLines = function() {
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
exports.Instance = PowerEnergyTableInstance;
