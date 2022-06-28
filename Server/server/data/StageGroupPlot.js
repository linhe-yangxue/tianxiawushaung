
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StageGroupPlot 类为 StageGroupPlotTable 每一行的元素对象
 * */
var StageGroupPlot = (function() {

    /**
    * 构造函数
    */
    function StageGroupPlot() {
        this.INDEX = 0;
        this.DROP_GROUP = '';

    }

    return StageGroupPlot;
})();

/**
 * [当前为生成代码，不可以修改] StageGroupPlot 配置表
 * */
var StageGroupPlotTableInstance = (function() {

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
            _unique = new StageGroupPlotTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StageGroupPlotTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StageGroupPlot');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StageGroupPlot();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DROP_GROUP = tmpArr[i].DROP_GROUP;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StageGroupPlotTable.prototype.GetLines = function() {
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
exports.Instance = StageGroupPlotTableInstance;
