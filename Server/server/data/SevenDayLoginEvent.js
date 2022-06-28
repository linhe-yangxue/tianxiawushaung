
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SevenDayLoginEvent 类为 SevenDayLoginEventTable 每一行的元素对象
 * */
var SevenDayLoginEvent = (function() {

    /**
    * 构造函数
    */
    function SevenDayLoginEvent() {
        this.INDEX = 0;
        this.AWARD_NAME = '';
        this.AWARD_DESCRIBE = '';
        this.LOGIN_AWARD = '';
        this.LOGIN_DAY_REQUEST = 0;

    }

    return SevenDayLoginEvent;
})();

/**
 * [当前为生成代码，不可以修改] SevenDayLoginEvent 配置表
 * */
var SevenDayLoginEventTableInstance = (function() {

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
            _unique = new SevenDayLoginEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SevenDayLoginEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SevenDayLoginEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SevenDayLoginEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.AWARD_NAME = tmpArr[i].AWARD_NAME;
            obj.AWARD_DESCRIBE = tmpArr[i].AWARD_DESCRIBE;
            obj.LOGIN_AWARD = tmpArr[i].LOGIN_AWARD;
            obj.LOGIN_DAY_REQUEST = parseInt(tmpArr[i].LOGIN_DAY_REQUEST);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SevenDayLoginEventTable.prototype.GetLines = function() {
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
exports.Instance = SevenDayLoginEventTableInstance;
