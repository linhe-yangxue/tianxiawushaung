
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] VipWeek 类为 VipWeekTable 每一行的元素对象
 * */
var VipWeek = (function() {

    /**
    * 构造函数
    */
    function VipWeek() {
        this.INDEX = 0;
        this.WEEK_GROUP_ID = 0;
        this.ORIGINAL_PRICE = 0;
        this.PRESENT_PRICE = 0;
        this.NEED_LEVEL = 0;

    }

    return VipWeek;
})();

/**
 * [当前为生成代码，不可以修改] VipWeek 配置表
 * */
var VipWeekTableInstance = (function() {

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
            _unique = new VipWeekTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function VipWeekTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('VipWeek');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new VipWeek();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.WEEK_GROUP_ID = parseInt(tmpArr[i].WEEK_GROUP_ID);
            obj.ORIGINAL_PRICE = parseInt(tmpArr[i].ORIGINAL_PRICE);
            obj.PRESENT_PRICE = parseInt(tmpArr[i].PRESENT_PRICE);
            obj.NEED_LEVEL = parseInt(tmpArr[i].NEED_LEVEL);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    VipWeekTable.prototype.GetLines = function() {
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
exports.Instance = VipWeekTableInstance;
