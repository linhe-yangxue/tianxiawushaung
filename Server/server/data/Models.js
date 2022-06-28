
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Models 类为 ModelsTable 每一行的元素对象
 * */
var Models = (function() {

    /**
    * 构造函数
    */
    function Models() {
        this.INDEX = 0;
        this.NAME = '';
        this.ANIMATION = '';
        this.BODY = '';
        this.BODY_TEX_1 = '';
        this.IMPACT_RADIUS = 0;
        this.SELECT_RADIUS = 0;
        this.MODEL_ATTACK_SPEED = 0;
        this.GUARD_TYPE = 0;
        this.RIM_COLOR = '';

    }

    return Models;
})();

/**
 * [当前为生成代码，不可以修改] Models 配置表
 * */
var ModelsTableInstance = (function() {

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
            _unique = new ModelsTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ModelsTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Models');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Models();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.ANIMATION = tmpArr[i].ANIMATION;
            obj.BODY = tmpArr[i].BODY;
            obj.BODY_TEX_1 = tmpArr[i].BODY_TEX_1;
            obj.IMPACT_RADIUS = parseFloat(tmpArr[i].IMPACT_RADIUS);
            obj.SELECT_RADIUS = parseFloat(tmpArr[i].SELECT_RADIUS);
            obj.MODEL_ATTACK_SPEED = parseFloat(tmpArr[i].MODEL_ATTACK_SPEED);
            obj.GUARD_TYPE = parseInt(tmpArr[i].GUARD_TYPE);
            obj.RIM_COLOR = tmpArr[i].RIM_COLOR;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ModelsTable.prototype.GetLines = function() {
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
exports.Instance = ModelsTableInstance;
