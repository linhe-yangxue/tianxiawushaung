
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] WorShipString 类为 WorShipStringTable 每一行的元素对象
 * */
var WorShipString = (function() {

    /**
    * 构造函数
    */
    function WorShipString() {
        this.INDEX = 0;
        this.STRING_WORD = '';

    }

    return WorShipString;
})();

/**
 * [当前为生成代码，不可以修改] WorShipString 配置表
 * */
var WorShipStringTableInstance = (function() {

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
            _unique = new WorShipStringTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function WorShipStringTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('WorShipString');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new WorShipString();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.STRING_WORD = tmpArr[i].STRING_WORD;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    WorShipStringTable.prototype.GetLines = function() {
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
exports.Instance = WorShipStringTableInstance;
