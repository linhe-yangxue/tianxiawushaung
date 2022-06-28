
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MaxNum 类为 MaxNumTable 每一行的元素对象
 * */
var MaxNum = (function() {

    /**
    * 构造函数
    */
    function MaxNum() {
        this.INDEX = 0;
        this.NAME = '';
        this.MAX_NUM = 0;

    }

    return MaxNum;
})();

/**
 * [当前为生成代码，不可以修改] MaxNum 配置表
 * */
var MaxNumTableInstance = (function() {

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
            _unique = new MaxNumTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MaxNumTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MaxNum');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MaxNum();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.MAX_NUM = parseInt(tmpArr[i].MAX_NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MaxNumTable.prototype.GetLines = function() {
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
exports.Instance = MaxNumTableInstance;
