
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Stringlist 类为 StringlistTable 每一行的元素对象
 * */
var Stringlist = (function() {

    /**
    * 构造函数
    */
    function Stringlist() {
        this.INDEX = 0;
        this.DESC = '';
        this.STRING_CN = '';
        this.STRING_TC = '';
        this.STRING_EN = '';

    }

    return Stringlist;
})();

/**
 * [当前为生成代码，不可以修改] Stringlist 配置表
 * */
var StringlistTableInstance = (function() {

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
            _unique = new StringlistTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StringlistTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Stringlist');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Stringlist();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DESC = tmpArr[i].DESC;
            obj.STRING_CN = tmpArr[i].STRING_CN;
            obj.STRING_TC = tmpArr[i].STRING_TC;
            obj.STRING_EN = tmpArr[i].STRING_EN;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StringlistTable.prototype.GetLines = function() {
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
exports.Instance = StringlistTableInstance;
