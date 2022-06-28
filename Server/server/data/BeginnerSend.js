
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BeginnerSend 类为 BeginnerSendTable 每一行的元素对象
 * */
var BeginnerSend = (function() {

    /**
    * 构造函数
    */
    function BeginnerSend() {
        this.INDEX = 0;
        this.PROPS = '';

    }

    return BeginnerSend;
})();

/**
 * [当前为生成代码，不可以修改] BeginnerSend 配置表
 * */
var BeginnerSendTableInstance = (function() {

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
            _unique = new BeginnerSendTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BeginnerSendTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BeginnerSend');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BeginnerSend();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.PROPS = tmpArr[i].PROPS;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BeginnerSendTable.prototype.GetLines = function() {
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
exports.Instance = BeginnerSendTableInstance;
