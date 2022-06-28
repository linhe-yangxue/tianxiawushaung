
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BattleProve 类为 BattleProveTable 每一行的元素对象
 * */
var BattleProve = (function() {

    /**
    * 构造函数
    */
    function BattleProve() {
        this.INDEX = 0;
        this.TYPE = 0;
        this.INFO = '';
        this.MIN = 0;
        this.MAX = 0;
        this.NUM = 0;

    }

    return BattleProve;
})();

/**
 * [当前为生成代码，不可以修改] BattleProve 配置表
 * */
var BattleProveTableInstance = (function() {

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
            _unique = new BattleProveTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BattleProveTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BattleProve');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BattleProve();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.INFO = tmpArr[i].INFO;
            obj.MIN = parseInt(tmpArr[i].MIN);
            obj.MAX = parseInt(tmpArr[i].MAX);
            obj.NUM = parseInt(tmpArr[i].NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BattleProveTable.prototype.GetLines = function() {
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
exports.Instance = BattleProveTableInstance;
