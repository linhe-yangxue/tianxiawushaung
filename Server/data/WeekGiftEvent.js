
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] WeekGiftEvent 类为 WeekGiftEventTable 每一行的元素对象
 * */
var WeekGiftEvent = (function() {

    /**
    * 构造函数
    */
    function WeekGiftEvent() {
        this.INDEX = 0;
        this.DISCOUNT = '';
        this.TITLE = '';
        this.ITEM = '';
        this.CONDITION = '';
        this.BUY_NUM = 0;
        this.PRICE = 0;

    }

    return WeekGiftEvent;
})();

/**
 * [当前为生成代码，不可以修改] WeekGiftEvent 配置表
 * */
var WeekGiftEventTableInstance = (function() {

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
            _unique = new WeekGiftEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function WeekGiftEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('WeekGiftEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new WeekGiftEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DISCOUNT = tmpArr[i].DISCOUNT;
            obj.TITLE = tmpArr[i].TITLE;
            obj.ITEM = tmpArr[i].ITEM;
            obj.CONDITION = tmpArr[i].CONDITION;
            obj.BUY_NUM = parseInt(tmpArr[i].BUY_NUM);
            obj.PRICE = parseInt(tmpArr[i].PRICE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    WeekGiftEventTable.prototype.GetLines = function() {
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
exports.Instance = WeekGiftEventTableInstance;
