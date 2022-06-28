
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StageBonus 类为 StageBonusTable 每一行的元素对象
 * */
var StageBonus = (function() {

    /**
    * 构造函数
    */
    function StageBonus() {

    }

    return StageBonus;
})();

/**
 * [当前为生成代码，不可以修改] StageBonus 配置表
 * */
var StageBonusTableInstance = (function() {

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
            _unique = new StageBonusTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StageBonusTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StageBonus');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StageBonus();

            _lines[tmpArr[i].INT] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StageBonusTable.prototype.GetLines = function() {
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
exports.Instance = StageBonusTableInstance;
