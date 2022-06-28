
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] RechargeEvent 类为 RechargeEventTable 每一行的元素对象
 * */
var RechargeEvent = (function() {

    /**
    * 构造函数
    */
    function RechargeEvent() {
        this.INDEX = 0;
        this.DESC = '';
        this.COST = 0;
        this.REWARD = '';

    }

    return RechargeEvent;
})();

/**
 * [当前为生成代码，不可以修改] RechargeEvent 配置表
 * */
var RechargeEventTableInstance = (function() {

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
            _unique = new RechargeEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function RechargeEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('RechargeEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new RechargeEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DESC = tmpArr[i].DESC;
            obj.COST = parseInt(tmpArr[i].COST);
            obj.REWARD = tmpArr[i].REWARD;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    RechargeEventTable.prototype.GetLines = function() {
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
exports.Instance = RechargeEventTableInstance;
