
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MainUiNotice 类为 MainUiNoticeTable 每一行的元素对象
 * */
var MainUiNotice = (function() {

    /**
    * 构造函数
    */
    function MainUiNotice() {
        this.INDEX = 0;
        this.NOTICE = '';
        this.RATE = 0;
        this.CONDITION = '';

    }

    return MainUiNotice;
})();

/**
 * [当前为生成代码，不可以修改] MainUiNotice 配置表
 * */
var MainUiNoticeTableInstance = (function() {

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
            _unique = new MainUiNoticeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MainUiNoticeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MainUiNotice');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MainUiNotice();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NOTICE = tmpArr[i].NOTICE;
            obj.RATE = parseInt(tmpArr[i].RATE);
            obj.CONDITION = tmpArr[i].CONDITION;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MainUiNoticeTable.prototype.GetLines = function() {
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
exports.Instance = MainUiNoticeTableInstance;
