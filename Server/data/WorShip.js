
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] WorShip 类为 WorShipTable 每一行的元素对象
 * */
var WorShip = (function() {

    /**
    * 构造函数
    */
    function WorShip() {
        this.INDEX = 0;
        this.LV = 0;
        this.REWORD = '';

    }

    return WorShip;
})();

/**
 * [当前为生成代码，不可以修改] WorShip 配置表
 * */
var WorShipTableInstance = (function() {

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
            _unique = new WorShipTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function WorShipTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('WorShip');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new WorShip();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.LV = parseInt(tmpArr[i].LV);
            obj.REWORD = tmpArr[i].REWORD;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    WorShipTable.prototype.GetLines = function() {
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
exports.Instance = WorShipTableInstance;
