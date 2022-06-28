
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Board 类为 BoardTable 每一行的元素对象
 * */
var Board = (function() {

    /**
    * 构造函数
    */
    function Board() {
        this.INDEX = 0;
        this.PAGENAME = '';
        this.DESC = '';
        this.TYPE = 0;
        this.DATE = 0;

    }

    return Board;
})();

/**
 * [当前为生成代码，不可以修改] Board 配置表
 * */
var BoardTableInstance = (function() {

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
            _unique = new BoardTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BoardTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Board');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Board();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.PAGENAME = tmpArr[i].PAGENAME;
            obj.DESC = tmpArr[i].DESC;
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.DATE = parseInt(tmpArr[i].DATE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BoardTable.prototype.GetLines = function() {
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
exports.Instance = BoardTableInstance;
