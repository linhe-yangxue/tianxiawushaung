
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] HDlogin 类为 HDloginTable 每一行的元素对象
 * */
var HDlogin = (function() {

    /**
    * 构造函数
    */
    function HDlogin() {
        this.INDEX = 0;
        this.ITEM = '';

    }

    return HDlogin;
})();

/**
 * [当前为生成代码，不可以修改] HDlogin 配置表
 * */
var HDloginTableInstance = (function() {

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
            _unique = new HDloginTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function HDloginTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('HDlogin');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new HDlogin();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ITEM = tmpArr[i].ITEM;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    HDloginTable.prototype.GetLines = function() {
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
exports.Instance = HDloginTableInstance;
