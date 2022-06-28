
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FundEventRule 类为 FundEventRuleTable 每一行的元素对象
 * */
var FundEventRule = (function() {

    /**
    * 构造函数
    */
    function FundEventRule() {
        this.INDEX = 0;
        this.TIME = 0;
        this.BUY_TIMES = 0;

    }

    return FundEventRule;
})();

/**
 * [当前为生成代码，不可以修改] FundEventRule 配置表
 * */
var FundEventRuleTableInstance = (function() {

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
            _unique = new FundEventRuleTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FundEventRuleTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FundEventRule');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FundEventRule();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TIME = parseInt(tmpArr[i].TIME);
            obj.BUY_TIMES = parseInt(tmpArr[i].BUY_TIMES);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FundEventRuleTable.prototype.GetLines = function() {
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
exports.Instance = FundEventRuleTableInstance;
