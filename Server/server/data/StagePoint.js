
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StagePoint 类为 StagePointTable 每一行的元素对象
 * */
var StagePoint = (function() {

    /**
    * 构造函数
    */
    function StagePoint() {
        this.INDEX = 0;
        this.STAGETYPE = 0;
        this.STAGEID = 0;

    }

    return StagePoint;
})();

/**
 * [当前为生成代码，不可以修改] StagePoint 配置表
 * */
var StagePointTableInstance = (function() {

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
            _unique = new StagePointTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StagePointTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StagePoint');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StagePoint();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.STAGETYPE = parseInt(tmpArr[i].STAGETYPE);
            obj.STAGEID = parseInt(tmpArr[i].STAGEID);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StagePointTable.prototype.GetLines = function() {
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
exports.Instance = StagePointTableInstance;
