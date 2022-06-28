
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FirstRechargeEvent 类为 FirstRechargeEventTable 每一行的元素对象
 * */
var FirstRechargeEvent = (function() {

    /**
    * 构造函数
    */
    function FirstRechargeEvent() {
        this.INDEX = 0;
        this.REWARD = '';

    }

    return FirstRechargeEvent;
})();

/**
 * [当前为生成代码，不可以修改] FirstRechargeEvent 配置表
 * */
var FirstRechargeEventTableInstance = (function() {

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
            _unique = new FirstRechargeEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FirstRechargeEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FirstRechargeEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FirstRechargeEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.REWARD = tmpArr[i].REWARD;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FirstRechargeEventTable.prototype.GetLines = function() {
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
exports.Instance = FirstRechargeEventTableInstance;
