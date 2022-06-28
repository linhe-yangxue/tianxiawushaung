
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] DailySignEvent 类为 DailySignEventTable 每一行的元素对象
 * */
var DailySignEvent = (function() {

    /**
    * 构造函数
    */
    function DailySignEvent() {
        this.INDEX = 0;
        this.VIP_LEVEL = 0;
        this.ITEM_ID = 0;
        this.COUNT = 0;

    }

    return DailySignEvent;
})();

/**
 * [当前为生成代码，不可以修改] DailySignEvent 配置表
 * */
var DailySignEventTableInstance = (function() {

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
            _unique = new DailySignEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function DailySignEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('DailySignEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new DailySignEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.VIP_LEVEL = parseInt(tmpArr[i].VIP_LEVEL);
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.COUNT = parseInt(tmpArr[i].COUNT);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    DailySignEventTable.prototype.GetLines = function() {
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
exports.Instance = DailySignEventTableInstance;
