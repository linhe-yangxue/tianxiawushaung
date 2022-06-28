
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FairyladDesc 类为 FairyladDescTable 每一行的元素对象
 * */
var FairyladDesc = (function() {

    /**
    * 构造函数
    */
    function FairyladDesc() {
        this.INDEX = 0;
        this.DESC = '';

    }

    return FairyladDesc;
})();

/**
 * [当前为生成代码，不可以修改] FairyladDesc 配置表
 * */
var FairyladDescTableInstance = (function() {

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
            _unique = new FairyladDescTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FairyladDescTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FairyladDesc');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FairyladDesc();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DESC = tmpArr[i].DESC;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FairyladDescTable.prototype.GetLines = function() {
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
exports.Instance = FairyladDescTableInstance;
