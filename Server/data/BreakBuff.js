
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BreakBuff 类为 BreakBuffTable 每一行的元素对象
 * */
var BreakBuff = (function() {

    /**
    * 构造函数
    */
    function BreakBuff() {
        this.INDEX = 0;
        this.BREAK_1 = 0;
        this.BREAK_2 = 0;
        this.BREAK_3 = 0;
        this.BREAK_4 = 0;
        this.BREAK_5 = 0;
        this.BREAK_6 = 0;
        this.BREAK_7 = 0;
        this.BREAK_8 = 0;
        this.BREAK_9 = 0;
        this.BREAK_10 = 0;
        this.BREAK_11 = 0;
        this.BREAK_12 = 0;
        this.BREAK_13 = 0;
        this.BREAK_14 = 0;
        this.BREAK_15 = 0;

    }

    return BreakBuff;
})();

/**
 * [当前为生成代码，不可以修改] BreakBuff 配置表
 * */
var BreakBuffTableInstance = (function() {

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
            _unique = new BreakBuffTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BreakBuffTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BreakBuff');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BreakBuff();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.BREAK_1 = parseInt(tmpArr[i].BREAK_1);
            obj.BREAK_2 = parseInt(tmpArr[i].BREAK_2);
            obj.BREAK_3 = parseInt(tmpArr[i].BREAK_3);
            obj.BREAK_4 = parseInt(tmpArr[i].BREAK_4);
            obj.BREAK_5 = parseInt(tmpArr[i].BREAK_5);
            obj.BREAK_6 = parseInt(tmpArr[i].BREAK_6);
            obj.BREAK_7 = parseInt(tmpArr[i].BREAK_7);
            obj.BREAK_8 = parseInt(tmpArr[i].BREAK_8);
            obj.BREAK_9 = parseInt(tmpArr[i].BREAK_9);
            obj.BREAK_10 = parseInt(tmpArr[i].BREAK_10);
            obj.BREAK_11 = parseInt(tmpArr[i].BREAK_11);
            obj.BREAK_12 = parseInt(tmpArr[i].BREAK_12);
            obj.BREAK_13 = parseInt(tmpArr[i].BREAK_13);
            obj.BREAK_14 = parseInt(tmpArr[i].BREAK_14);
            obj.BREAK_15 = parseInt(tmpArr[i].BREAK_15);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BreakBuffTable.prototype.GetLines = function() {
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
exports.Instance = BreakBuffTableInstance;
