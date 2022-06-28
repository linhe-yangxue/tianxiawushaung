
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] RetCode 类为 RetCodeTable 每一行的元素对象
 * */
var RetCode = (function() {

    /**
    * 构造函数
    */
    function RetCode() {
        this.INDEX = 0;
        this.EMUN = '';
        this.ID = 0;
        this.INFO = '';

    }

    return RetCode;
})();

/**
 * [当前为生成代码，不可以修改] RetCode 配置表
 * */
var RetCodeTableInstance = (function() {

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
            _unique = new RetCodeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function RetCodeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('RetCode');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new RetCode();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.EMUN = tmpArr[i].EMUN;
            obj.ID = parseInt(tmpArr[i].ID);
            obj.INFO = tmpArr[i].INFO;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    RetCodeTable.prototype.GetLines = function() {
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
exports.Instance = RetCodeTableInstance;
