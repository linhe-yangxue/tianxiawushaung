
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] CommonEvent 类为 CommonEventTable 每一行的元素对象
 * */
var CommonEvent = (function() {

    /**
    * 构造函数
    */
    function CommonEvent() {
        this.INDEX = 0;
        this.SEVER_DAY = 0;
        this.COST = 0;
        this.TIMES = 0;
        this.GROUP_ID = '';
        this.DESC = '';

    }

    return CommonEvent;
})();

/**
 * [当前为生成代码，不可以修改] CommonEvent 配置表
 * */
var CommonEventTableInstance = (function() {

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
            _unique = new CommonEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function CommonEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('CommonEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new CommonEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.SEVER_DAY = parseInt(tmpArr[i].SEVER_DAY);
            obj.COST = parseInt(tmpArr[i].COST);
            obj.TIMES = parseInt(tmpArr[i].TIMES);
            obj.GROUP_ID = tmpArr[i].GROUP_ID;
            obj.DESC = tmpArr[i].DESC;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    CommonEventTable.prototype.GetLines = function() {
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
exports.Instance = CommonEventTableInstance;
