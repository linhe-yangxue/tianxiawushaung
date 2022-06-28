
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] HDshooter 类为 HDshooterTable 每一行的元素对象
 * */
var HDshooter = (function() {

    /**
    * 构造函数
    */
    function HDshooter() {
        this.INDEX = 0;
        this.COST = '';
        this.NUMBER = '';

    }

    return HDshooter;
})();

/**
 * [当前为生成代码，不可以修改] HDshooter 配置表
 * */
var HDshooterTableInstance = (function() {

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
            _unique = new HDshooterTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function HDshooterTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('HDshooter');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new HDshooter();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.COST = tmpArr[i].COST;
            obj.NUMBER = tmpArr[i].NUMBER;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    HDshooterTable.prototype.GetLines = function() {
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
exports.Instance = HDshooterTableInstance;
