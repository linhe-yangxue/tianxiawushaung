
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] IndianaDraw 类为 IndianaDrawTable 每一行的元素对象
 * */
var IndianaDraw = (function() {

    /**
    * 构造函数
    */
    function IndianaDraw() {
        this.INDEX = 0;
        this.DRAW_GROUP_ID = 0;
        this.LEVEL_MIN = 0;
        this.LEVEL_MAX = 0;
        this.CONDITION_GROUP_ID = '';

    }

    return IndianaDraw;
})();

/**
 * [当前为生成代码，不可以修改] IndianaDraw 配置表
 * */
var IndianaDrawTableInstance = (function() {

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
            _unique = new IndianaDrawTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function IndianaDrawTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('IndianaDraw');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new IndianaDraw();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DRAW_GROUP_ID = parseInt(tmpArr[i].DRAW_GROUP_ID);
            obj.LEVEL_MIN = parseInt(tmpArr[i].LEVEL_MIN);
            obj.LEVEL_MAX = parseInt(tmpArr[i].LEVEL_MAX);
            obj.CONDITION_GROUP_ID = tmpArr[i].CONDITION_GROUP_ID;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    IndianaDrawTable.prototype.GetLines = function() {
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
exports.Instance = IndianaDrawTableInstance;
