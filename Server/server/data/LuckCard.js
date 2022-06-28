
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] LuckCard 类为 LuckCardTable 每一行的元素对象
 * */
var LuckCard = (function() {

    /**
    * 构造函数
    */
    function LuckCard() {
        this.INDEX = 0;
        this.NUMBER = 0;
        this.PROBABILITY = 0;

    }

    return LuckCard;
})();

/**
 * [当前为生成代码，不可以修改] LuckCard 配置表
 * */
var LuckCardTableInstance = (function() {

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
            _unique = new LuckCardTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function LuckCardTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('LuckCard');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new LuckCard();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NUMBER = parseInt(tmpArr[i].NUMBER);
            obj.PROBABILITY = parseInt(tmpArr[i].PROBABILITY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    LuckCardTable.prototype.GetLines = function() {
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
exports.Instance = LuckCardTableInstance;
