
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FightUi 类为 FightUiTable 每一行的元素对象
 * */
var FightUi = (function() {

    /**
    * 构造函数
    */
    function FightUi() {
        this.INDEX = 0;
        this.NAME = '';
        this.LEVEL = 0;

    }

    return FightUi;
})();

/**
 * [当前为生成代码，不可以修改] FightUi 配置表
 * */
var FightUiTableInstance = (function() {

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
            _unique = new FightUiTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FightUiTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FightUi');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FightUi();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.LEVEL = parseInt(tmpArr[i].LEVEL);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FightUiTable.prototype.GetLines = function() {
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
exports.Instance = FightUiTableInstance;
