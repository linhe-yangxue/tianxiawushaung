
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] HDrevelry 类为 HDrevelryTable 每一行的元素对象
 * */
var HDrevelry = (function() {

    /**
    * 构造函数
    */
    function HDrevelry() {
        this.INDEX = 0;
        this.DAY = 0;
        this.PAGE = 0;
        this.PAGENAME = '';
        this.TYPE = 0;
        this.TASK_TIP = '';
        this.NUMBER = 0;
        this.REWARD = '';
        this.PRICE = '';
        this.SERVER_LIMIT = 0;

    }

    return HDrevelry;
})();

/**
 * [当前为生成代码，不可以修改] HDrevelry 配置表
 * */
var HDrevelryTableInstance = (function() {

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
            _unique = new HDrevelryTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function HDrevelryTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('HDrevelry');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new HDrevelry();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DAY = parseInt(tmpArr[i].DAY);
            obj.PAGE = parseInt(tmpArr[i].PAGE);
            obj.PAGENAME = tmpArr[i].PAGENAME;
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.TASK_TIP = tmpArr[i].TASK_TIP;
            obj.NUMBER = parseInt(tmpArr[i].NUMBER);
            obj.REWARD = tmpArr[i].REWARD;
            obj.PRICE = tmpArr[i].PRICE;
            obj.SERVER_LIMIT = parseInt(tmpArr[i].SERVER_LIMIT);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    HDrevelryTable.prototype.GetLines = function() {
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
exports.Instance = HDrevelryTableInstance;
