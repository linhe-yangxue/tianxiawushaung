
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] WindowPoint 类为 WindowPointTable 每一行的元素对象
 * */
var WindowPoint = (function() {

    /**
    * 构造函数
    */
    function WindowPoint() {
        this.WINDOW_NAME = '';
        this.WIN_POINT_COLOR = '';
        this.INFO = '';

    }

    return WindowPoint;
})();

/**
 * [当前为生成代码，不可以修改] WindowPoint 配置表
 * */
var WindowPointTableInstance = (function() {

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
            _unique = new WindowPointTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function WindowPointTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('WindowPoint');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new WindowPoint();
            obj.WINDOW_NAME = tmpArr[i].WINDOW_NAME;
            obj.WIN_POINT_COLOR = tmpArr[i].WIN_POINT_COLOR;
            obj.INFO = tmpArr[i].INFO;

            _lines[tmpArr[i].WINDOW_NAME] = obj;

        }
    }

    /**
    * 获取行队列
    */
    WindowPointTable.prototype.GetLines = function() {
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
exports.Instance = WindowPointTableInstance;
