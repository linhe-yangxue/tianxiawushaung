
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EnergyEvent 类为 EnergyEventTable 每一行的元素对象
 * */
var EnergyEvent = (function() {

    /**
    * 构造函数
    */
    function EnergyEvent() {
        this.INDEX = 0;
        this.START_TIME = 0;
        this.END_TIME = 0;
        this.ITEM = 0;
        this.NUMBER = 0;

    }

    return EnergyEvent;
})();

/**
 * [当前为生成代码，不可以修改] EnergyEvent 配置表
 * */
var EnergyEventTableInstance = (function() {

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
            _unique = new EnergyEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EnergyEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EnergyEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EnergyEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.START_TIME = parseInt(tmpArr[i].START_TIME);
            obj.END_TIME = parseInt(tmpArr[i].END_TIME);
            obj.ITEM = parseInt(tmpArr[i].ITEM);
            obj.NUMBER = parseInt(tmpArr[i].NUMBER);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EnergyEventTable.prototype.GetLines = function() {
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
exports.Instance = EnergyEventTableInstance;
