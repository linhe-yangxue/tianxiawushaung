
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Dailysign 类为 DailysignTable 每一行的元素对象
 * */
var Dailysign = (function() {

    /**
    * 构造函数
    */
    function Dailysign() {

    }

    return Dailysign;
})();

/**
 * [当前为生成代码，不可以修改] Dailysign 配置表
 * */
var DailysignTableInstance = (function() {

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
            _unique = new DailysignTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function DailysignTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Dailysign');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Dailysign();

            _lines[tmpArr[i].INT] = obj;

        }
    }

    /**
    * 获取行队列
    */
    DailysignTable.prototype.GetLines = function() {
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
exports.Instance = DailysignTableInstance;
