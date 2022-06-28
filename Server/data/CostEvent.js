
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] CostEvent 类为 CostEventTable 每一行的元素对象
 * */
var CostEvent = (function() {

    /**
    * 构造函数
    */
    function CostEvent() {
        this.INDEX = 0;
        this.TASK_TIP = '';
        this.NUMBER = 0;
        this.REWARD = '';

    }

    return CostEvent;
})();

/**
 * [当前为生成代码，不可以修改] CostEvent 配置表
 * */
var CostEventTableInstance = (function() {

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
            _unique = new CostEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function CostEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('CostEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new CostEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TASK_TIP = tmpArr[i].TASK_TIP;
            obj.NUMBER = parseInt(tmpArr[i].NUMBER);
            obj.REWARD = tmpArr[i].REWARD;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    CostEventTable.prototype.GetLines = function() {
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
exports.Instance = CostEventTableInstance;
