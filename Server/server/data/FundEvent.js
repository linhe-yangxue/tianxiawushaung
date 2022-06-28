
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FundEvent 类为 FundEventTable 每一行的元素对象
 * */
var FundEvent = (function() {

    /**
    * 构造函数
    */
    function FundEvent() {
        this.INDEX = 0;
        this.TYPE = 0;
        this.DESC = '';
        this.LEVEL = 0;
        this.ITEM_ID = 0;
        this.NUM = 0;
        this.COUNT = 0;
        this.REWARD = '';

    }

    return FundEvent;
})();

/**
 * [当前为生成代码，不可以修改] FundEvent 配置表
 * */
var FundEventTableInstance = (function() {

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
            _unique = new FundEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FundEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FundEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FundEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.DESC = tmpArr[i].DESC;
            obj.LEVEL = parseInt(tmpArr[i].LEVEL);
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.NUM = parseInt(tmpArr[i].NUM);
            obj.COUNT = parseInt(tmpArr[i].COUNT);
            obj.REWARD = tmpArr[i].REWARD;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FundEventTable.prototype.GetLines = function() {
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
exports.Instance = FundEventTableInstance;
