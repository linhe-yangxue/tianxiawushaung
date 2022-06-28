
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SingleRechargeEvent 类为 SingleRechargeEventTable 每一行的元素对象
 * */
var SingleRechargeEvent = (function() {

    /**
    * 构造函数
    */
    function SingleRechargeEvent() {
        this.INDEX = 0;
        this.DESCRIBE = '';
        this.CHARGE_INDEX = 0;
        this.REWARDE = '';
        this.REWARDE_TIME_MAX = 0;

    }

    return SingleRechargeEvent;
})();

/**
 * [当前为生成代码，不可以修改] SingleRechargeEvent 配置表
 * */
var SingleRechargeEventTableInstance = (function() {

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
            _unique = new SingleRechargeEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SingleRechargeEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SingleRechargeEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SingleRechargeEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DESCRIBE = tmpArr[i].DESCRIBE;
            obj.CHARGE_INDEX = parseInt(tmpArr[i].CHARGE_INDEX);
            obj.REWARDE = tmpArr[i].REWARDE;
            obj.REWARDE_TIME_MAX = parseInt(tmpArr[i].REWARDE_TIME_MAX);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SingleRechargeEventTable.prototype.GetLines = function() {
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
exports.Instance = SingleRechargeEventTableInstance;
