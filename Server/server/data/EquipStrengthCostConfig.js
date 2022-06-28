
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EquipStrengthCostConfig 类为 EquipStrengthCostConfigTable 每一行的元素对象
 * */
var EquipStrengthCostConfig = (function() {

    /**
    * 构造函数
    */
    function EquipStrengthCostConfig() {
        this.INDEX = 0;
        this.COST_MONEY = 0;
        this.COST_MONEY_1 = 0;
        this.COST_MONEY_2 = 0;
        this.COST_MONEY_3 = 0;
        this.COST_MONEY_4 = 0;
        this.COST_MONEY_5 = 0;
        this.COST_MONEY_6 = 0;
        this.COST_MONEY_7 = 0;

    }

    return EquipStrengthCostConfig;
})();

/**
 * [当前为生成代码，不可以修改] EquipStrengthCostConfig 配置表
 * */
var EquipStrengthCostConfigTableInstance = (function() {

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
            _unique = new EquipStrengthCostConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EquipStrengthCostConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EquipStrengthCostConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EquipStrengthCostConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.COST_MONEY = parseInt(tmpArr[i].COST_MONEY);
            obj.COST_MONEY_1 = parseInt(tmpArr[i].COST_MONEY_1);
            obj.COST_MONEY_2 = parseInt(tmpArr[i].COST_MONEY_2);
            obj.COST_MONEY_3 = parseInt(tmpArr[i].COST_MONEY_3);
            obj.COST_MONEY_4 = parseInt(tmpArr[i].COST_MONEY_4);
            obj.COST_MONEY_5 = parseInt(tmpArr[i].COST_MONEY_5);
            obj.COST_MONEY_6 = parseInt(tmpArr[i].COST_MONEY_6);
            obj.COST_MONEY_7 = parseInt(tmpArr[i].COST_MONEY_7);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EquipStrengthCostConfigTable.prototype.GetLines = function() {
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
exports.Instance = EquipStrengthCostConfigTableInstance;
