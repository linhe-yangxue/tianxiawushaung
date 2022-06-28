
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MailMax 类为 MailMaxTable 每一行的元素对象
 * */
var MailMax = (function() {

    /**
    * 构造函数
    */
    function MailMax() {
        this.INDEX = 0;
        this.MAX_NUM = 0;

    }

    return MailMax;
})();

/**
 * [当前为生成代码，不可以修改] MailMax 配置表
 * */
var MailMaxTableInstance = (function() {

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
            _unique = new MailMaxTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MailMaxTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MailMax');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MailMax();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.MAX_NUM = parseInt(tmpArr[i].MAX_NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MailMaxTable.prototype.GetLines = function() {
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
exports.Instance = MailMaxTableInstance;
