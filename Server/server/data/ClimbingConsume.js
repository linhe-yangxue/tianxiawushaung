
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ClimbingConsume 类为 ClimbingConsumeTable 每一行的元素对象
 * */
var ClimbingConsume = (function() {

    /**
    * 构造函数
    */
    function ClimbingConsume() {
        this.INDEX = 0;
        this.RESET_CONSUME = 0;

    }

    return ClimbingConsume;
})();

/**
 * [当前为生成代码，不可以修改] ClimbingConsume 配置表
 * */
var ClimbingConsumeTableInstance = (function() {

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
            _unique = new ClimbingConsumeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ClimbingConsumeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ClimbingConsume');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ClimbingConsume();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.RESET_CONSUME = parseInt(tmpArr[i].RESET_CONSUME);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ClimbingConsumeTable.prototype.GetLines = function() {
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
exports.Instance = ClimbingConsumeTableInstance;
