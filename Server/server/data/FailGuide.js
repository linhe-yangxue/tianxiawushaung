
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FailGuide 类为 FailGuideTable 每一行的元素对象
 * */
var FailGuide = (function() {

    /**
    * 构造函数
    */
    function FailGuide() {
        this.INDEX = 0;
        this.LEVEL_AREA = '';
        this.FUNCTION_WEIGHT = '';
        this.FUNCTION_RATE_1 = '';
        this.FUNCTION_RATE_2 = '';
        this.FUNCTION_RATE_3 = '';

    }

    return FailGuide;
})();

/**
 * [当前为生成代码，不可以修改] FailGuide 配置表
 * */
var FailGuideTableInstance = (function() {

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
            _unique = new FailGuideTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FailGuideTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FailGuide');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FailGuide();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.LEVEL_AREA = tmpArr[i].LEVEL_AREA;
            obj.FUNCTION_WEIGHT = tmpArr[i].FUNCTION_WEIGHT;
            obj.FUNCTION_RATE_1 = tmpArr[i].FUNCTION_RATE_1;
            obj.FUNCTION_RATE_2 = tmpArr[i].FUNCTION_RATE_2;
            obj.FUNCTION_RATE_3 = tmpArr[i].FUNCTION_RATE_3;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FailGuideTable.prototype.GetLines = function() {
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
exports.Instance = FailGuideTableInstance;
