
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] TaskType 类为 TaskTypeTable 每一行的元素对象
 * */
var TaskType = (function() {

    /**
    * 构造函数
    */
    function TaskType() {
        this.INDEX = 0;
        this.TYPE = '';

    }

    return TaskType;
})();

/**
 * [当前为生成代码，不可以修改] TaskType 配置表
 * */
var TaskTypeTableInstance = (function() {

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
            _unique = new TaskTypeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function TaskTypeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('TaskType');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new TaskType();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TYPE = tmpArr[i].TYPE;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    TaskTypeTable.prototype.GetLines = function() {
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
exports.Instance = TaskTypeTableInstance;
