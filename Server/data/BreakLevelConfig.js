
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BreakLevelConfig 类为 BreakLevelConfigTable 每一行的元素对象
 * */
var BreakLevelConfig = (function() {

    /**
    * 构造函数
    */
    function BreakLevelConfig() {
        this.INDEX = 0;
        this.ACTIVE_LEVEL = 0;
        this.NEED_GEM_NUM = 0;
        this.TOTAL_NEED_GEM_NUM = 0;
        this.NEED_COIN_NUM = 0;
        this.TOTAL_NEED_COIN_NUM = 0;
        this.ACTIVE_NUM = 0;
        this.TOTAL_ACTIVE_NUM = 0;
        this.ROLE_NEED_GEM_NUM = 0;

    }

    return BreakLevelConfig;
})();

/**
 * [当前为生成代码，不可以修改] BreakLevelConfig 配置表
 * */
var BreakLevelConfigTableInstance = (function() {

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
            _unique = new BreakLevelConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BreakLevelConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BreakLevelConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BreakLevelConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ACTIVE_LEVEL = parseInt(tmpArr[i].ACTIVE_LEVEL);
            obj.NEED_GEM_NUM = parseInt(tmpArr[i].NEED_GEM_NUM);
            obj.TOTAL_NEED_GEM_NUM = parseInt(tmpArr[i].TOTAL_NEED_GEM_NUM);
            obj.NEED_COIN_NUM = parseInt(tmpArr[i].NEED_COIN_NUM);
            obj.TOTAL_NEED_COIN_NUM = parseInt(tmpArr[i].TOTAL_NEED_COIN_NUM);
            obj.ACTIVE_NUM = parseInt(tmpArr[i].ACTIVE_NUM);
            obj.TOTAL_ACTIVE_NUM = parseInt(tmpArr[i].TOTAL_ACTIVE_NUM);
            obj.ROLE_NEED_GEM_NUM = parseInt(tmpArr[i].ROLE_NEED_GEM_NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BreakLevelConfigTable.prototype.GetLines = function() {
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
exports.Instance = BreakLevelConfigTableInstance;
