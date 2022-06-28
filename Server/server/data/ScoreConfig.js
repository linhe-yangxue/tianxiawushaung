
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ScoreConfig 类为 ScoreConfigTable 每一行的元素对象
 * */
var ScoreConfig = (function() {

    /**
    * 构造函数
    */
    function ScoreConfig() {
        this.INDX = 0;
        this.NUM = 0;
        this.AWARD_ITEM = '';

    }

    return ScoreConfig;
})();

/**
 * [当前为生成代码，不可以修改] ScoreConfig 配置表
 * */
var ScoreConfigTableInstance = (function() {

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
            _unique = new ScoreConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ScoreConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ScoreConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ScoreConfig();
            obj.INDX = parseInt(tmpArr[i].INDX);
            obj.NUM = parseInt(tmpArr[i].NUM);
            obj.AWARD_ITEM = tmpArr[i].AWARD_ITEM;

            _lines[tmpArr[i].INDX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ScoreConfigTable.prototype.GetLines = function() {
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
exports.Instance = ScoreConfigTableInstance;
