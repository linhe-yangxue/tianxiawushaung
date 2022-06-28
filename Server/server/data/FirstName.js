
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FirstName 类为 FirstNameTable 每一行的元素对象
 * */
var FirstName = (function() {

    /**
    * 构造函数
    */
    function FirstName() {
        this.INDEX = 0;
        this.FIRSTNAME = '';
        this.MIDDLENAME = '';
        this.LASTNAME = '';

    }

    return FirstName;
})();

/**
 * [当前为生成代码，不可以修改] FirstName 配置表
 * */
var FirstNameTableInstance = (function() {

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
            _unique = new FirstNameTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FirstNameTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FirstName');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FirstName();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.FIRSTNAME = tmpArr[i].FIRSTNAME;
            obj.MIDDLENAME = tmpArr[i].MIDDLENAME;
            obj.LASTNAME = tmpArr[i].LASTNAME;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FirstNameTable.prototype.GetLines = function() {
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
exports.Instance = FirstNameTableInstance;
