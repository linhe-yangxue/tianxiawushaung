
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Agreement 类为 AgreementTable 每一行的元素对象
 * */
var Agreement = (function() {

    /**
    * 构造函数
    */
    function Agreement() {
        this.INDEX = 0;
        this.PAGE = 0;
        this.TEXT = '';

    }

    return Agreement;
})();

/**
 * [当前为生成代码，不可以修改] Agreement 配置表
 * */
var AgreementTableInstance = (function() {

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
            _unique = new AgreementTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function AgreementTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Agreement');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Agreement();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.PAGE = parseInt(tmpArr[i].PAGE);
            obj.TEXT = tmpArr[i].TEXT;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    AgreementTable.prototype.GetLines = function() {
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
exports.Instance = AgreementTableInstance;
