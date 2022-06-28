
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StageFather 类为 StageFatherTable 每一行的元素对象
 * */
var StageFather = (function() {

    /**
    * 构造函数
    */
    function StageFather() {
        this.ID = 0;
        this.TYPE = 0;
        this.NAME = '';

    }

    return StageFather;
})();

/**
 * [当前为生成代码，不可以修改] StageFather 配置表
 * */
var StageFatherTableInstance = (function() {

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
            _unique = new StageFatherTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StageFatherTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StageFather');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StageFather();
            obj.ID = parseInt(tmpArr[i].ID);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.NAME = tmpArr[i].NAME;

            _lines[tmpArr[i].ID] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StageFatherTable.prototype.GetLines = function() {
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
exports.Instance = StageFatherTableInstance;
