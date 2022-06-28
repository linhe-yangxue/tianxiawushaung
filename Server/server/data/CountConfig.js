
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] CountConfig 类为 CountConfigTable 每一行的元素对象
 * */
var CountConfig = (function() {

    /**
    * 构造函数
    */
    function CountConfig() {
        this.INDEX = 0;
        this.IS_POWER = 0;
        this.REWORD_STYLE = 0;
        this.CONT_BASE = 0;
        this.CONT_RATIO = 0;

    }

    return CountConfig;
})();

/**
 * [当前为生成代码，不可以修改] CountConfig 配置表
 * */
var CountConfigTableInstance = (function() {

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
            _unique = new CountConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function CountConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('CountConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new CountConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.IS_POWER = parseInt(tmpArr[i].IS_POWER);
            obj.REWORD_STYLE = parseInt(tmpArr[i].REWORD_STYLE);
            obj.CONT_BASE = parseFloat(tmpArr[i].CONT_BASE);
            obj.CONT_RATIO = parseFloat(tmpArr[i].CONT_RATIO);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    CountConfigTable.prototype.GetLines = function() {
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
exports.Instance = CountConfigTableInstance;
