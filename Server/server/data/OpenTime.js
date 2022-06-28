
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] OpenTime 类为 OpenTimeTable 每一行的元素对象
 * */
var OpenTime = (function() {

    /**
    * 构造函数
    */
    function OpenTime() {
        this.INDEX = 0;
        this.NAME = '';
        this.TYPE = 0;
        this.Condition = '';

    }

    return OpenTime;
})();

/**
 * [当前为生成代码，不可以修改] OpenTime 配置表
 * */
var OpenTimeTableInstance = (function() {

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
            _unique = new OpenTimeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function OpenTimeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('OpenTime');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new OpenTime();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.Condition = tmpArr[i].Condition;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    OpenTimeTable.prototype.GetLines = function() {
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
exports.Instance = OpenTimeTableInstance;
