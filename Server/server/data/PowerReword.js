
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PowerReword 类为 PowerRewordTable 每一行的元素对象
 * */
var PowerReword = (function() {

    /**
    * 构造函数
    */
    function PowerReword() {
        this.INDEX = 0;
        this.NAME = '';
        this.REWORD_NUM = 0;
        this.EVERY_TIME_NUM = 0;
        this.REFRESH_TIME = 0;
        this.FRIEND_NUM = 0;

    }

    return PowerReword;
})();

/**
 * [当前为生成代码，不可以修改] PowerReword 配置表
 * */
var PowerRewordTableInstance = (function() {

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
            _unique = new PowerRewordTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PowerRewordTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PowerReword');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PowerReword();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.REWORD_NUM = parseInt(tmpArr[i].REWORD_NUM);
            obj.EVERY_TIME_NUM = parseInt(tmpArr[i].EVERY_TIME_NUM);
            obj.REFRESH_TIME = parseInt(tmpArr[i].REFRESH_TIME);
            obj.FRIEND_NUM = parseInt(tmpArr[i].FRIEND_NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PowerRewordTable.prototype.GetLines = function() {
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
exports.Instance = PowerRewordTableInstance;
