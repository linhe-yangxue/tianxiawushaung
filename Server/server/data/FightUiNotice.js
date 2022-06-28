
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FightUiNotice 类为 FightUiNoticeTable 每一行的元素对象
 * */
var FightUiNotice = (function() {

    /**
    * 构造函数
    */
    function FightUiNotice() {
        this.INDEX = 0;
        this.NOTICE = '';
        this.WIN = 0;
        this.TIME = 0;
        this.RATE = 0;
        this.CONDITION = '';

    }

    return FightUiNotice;
})();

/**
 * [当前为生成代码，不可以修改] FightUiNotice 配置表
 * */
var FightUiNoticeTableInstance = (function() {

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
            _unique = new FightUiNoticeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FightUiNoticeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FightUiNotice');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FightUiNotice();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NOTICE = tmpArr[i].NOTICE;
            obj.WIN = parseInt(tmpArr[i].WIN);
            obj.TIME = parseInt(tmpArr[i].TIME);
            obj.RATE = parseInt(tmpArr[i].RATE);
            obj.CONDITION = tmpArr[i].CONDITION;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FightUiNoticeTable.prototype.GetLines = function() {
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
exports.Instance = FightUiNoticeTableInstance;
