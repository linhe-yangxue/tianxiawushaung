
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FeatEventConfig 类为 FeatEventConfigTable 每一行的元素对象
 * */
var FeatEventConfig = (function() {

    /**
    * 构造函数
    */
    function FeatEventConfig() {
        this.INDEX = 0;
        this.OPEN_HOUR = 0;
        this.CLOSE_HOUR = 0;
        this.OPEN_MINUTE = 0;
        this.CLOSE_MINUTE = 0;
        this.COST_MONSTER_TOKEN = 0;
        this.FEAT_TIMES = 0;

    }

    return FeatEventConfig;
})();

/**
 * [当前为生成代码，不可以修改] FeatEventConfig 配置表
 * */
var FeatEventConfigTableInstance = (function() {

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
            _unique = new FeatEventConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FeatEventConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FeatEventConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FeatEventConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.OPEN_HOUR = parseInt(tmpArr[i].OPEN_HOUR);
            obj.CLOSE_HOUR = parseInt(tmpArr[i].CLOSE_HOUR);
            obj.OPEN_MINUTE = parseInt(tmpArr[i].OPEN_MINUTE);
            obj.CLOSE_MINUTE = parseInt(tmpArr[i].CLOSE_MINUTE);
            obj.COST_MONSTER_TOKEN = parseInt(tmpArr[i].COST_MONSTER_TOKEN);
            obj.FEAT_TIMES = parseInt(tmpArr[i].FEAT_TIMES);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FeatEventConfigTable.prototype.GetLines = function() {
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
exports.Instance = FeatEventConfigTableInstance;
