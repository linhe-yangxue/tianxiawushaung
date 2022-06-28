
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] WorshipConfig 类为 WorshipConfigTable 每一行的元素对象
 * */
var WorshipConfig = (function() {

    /**
    * 构造函数
    */
    function WorshipConfig() {
        this.INDEX = 0;
        this.PRICE_TYPE = 0;
        this.PRICE = 0;
        this.SCHEDULE = 0;
        this.EXP = 0;
        this.CONTRIBUTE = 0;

    }

    return WorshipConfig;
})();

/**
 * [当前为生成代码，不可以修改] WorshipConfig 配置表
 * */
var WorshipConfigTableInstance = (function() {

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
            _unique = new WorshipConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function WorshipConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('WorshipConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new WorshipConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.PRICE_TYPE = parseInt(tmpArr[i].PRICE_TYPE);
            obj.PRICE = parseInt(tmpArr[i].PRICE);
            obj.SCHEDULE = parseInt(tmpArr[i].SCHEDULE);
            obj.EXP = parseInt(tmpArr[i].EXP);
            obj.CONTRIBUTE = parseInt(tmpArr[i].CONTRIBUTE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    WorshipConfigTable.prototype.GetLines = function() {
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
exports.Instance = WorshipConfigTableInstance;
