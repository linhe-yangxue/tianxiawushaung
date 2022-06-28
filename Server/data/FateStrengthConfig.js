
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FateStrengthConfig 类为 FateStrengthConfigTable 每一行的元素对象
 * */
var FateStrengthConfig = (function() {

    /**
    * 构造函数
    */
    function FateStrengthConfig() {
        this.INDEX = 0;
        this.NEED_NUM = 0;
        this.COST_NUM = 0;
        this.ADD_RATE = 0;
        this.TOTAL_ADD_RATE = 0;
        this.PROGRESS_ADD = '';
        this.LV_UP_RATE = '';

    }

    return FateStrengthConfig;
})();

/**
 * [当前为生成代码，不可以修改] FateStrengthConfig 配置表
 * */
var FateStrengthConfigTableInstance = (function() {

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
            _unique = new FateStrengthConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FateStrengthConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FateStrengthConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FateStrengthConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NEED_NUM = parseInt(tmpArr[i].NEED_NUM);
            obj.COST_NUM = parseInt(tmpArr[i].COST_NUM);
            obj.ADD_RATE = parseInt(tmpArr[i].ADD_RATE);
            obj.TOTAL_ADD_RATE = parseInt(tmpArr[i].TOTAL_ADD_RATE);
            obj.PROGRESS_ADD = tmpArr[i].PROGRESS_ADD;
            obj.LV_UP_RATE = tmpArr[i].LV_UP_RATE;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FateStrengthConfigTable.prototype.GetLines = function() {
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
exports.Instance = FateStrengthConfigTableInstance;
