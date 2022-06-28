
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] HiddenRule 类为 HiddenRuleTable 每一行的元素对象
 * */
var HiddenRule = (function() {

    /**
    * 构造函数
    */
    function HiddenRule() {
        this.INDEX = 0;
        this.CONDITION = '';
        this.DRAW_WEIGHT_CHANGE = '';
        this.BOX_WEIGHT_CHANGE = '';
        this.REFRESH_WEIGHT_CHANGE = '';

    }

    return HiddenRule;
})();

/**
 * [当前为生成代码，不可以修改] HiddenRule 配置表
 * */
var HiddenRuleTableInstance = (function() {

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
            _unique = new HiddenRuleTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function HiddenRuleTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('HiddenRule');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new HiddenRule();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.CONDITION = tmpArr[i].CONDITION;
            obj.DRAW_WEIGHT_CHANGE = tmpArr[i].DRAW_WEIGHT_CHANGE;
            obj.BOX_WEIGHT_CHANGE = tmpArr[i].BOX_WEIGHT_CHANGE;
            obj.REFRESH_WEIGHT_CHANGE = tmpArr[i].REFRESH_WEIGHT_CHANGE;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    HiddenRuleTable.prototype.GetLines = function() {
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
exports.Instance = HiddenRuleTableInstance;
