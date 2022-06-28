
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SufferingTrigger 类为 SufferingTriggerTable 每一行的元素对象
 * */
var SufferingTrigger = (function() {

    /**
    * 构造函数
    */
    function SufferingTrigger() {
        this.INDEX = 0;
        this.TITLE = '';
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.Function_ID = 0;

    }

    return SufferingTrigger;
})();

/**
 * [当前为生成代码，不可以修改] SufferingTrigger 配置表
 * */
var SufferingTriggerTableInstance = (function() {

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
            _unique = new SufferingTriggerTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SufferingTriggerTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SufferingTrigger');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SufferingTrigger();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TITLE = tmpArr[i].TITLE;
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.Function_ID = parseInt(tmpArr[i].Function_ID);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SufferingTriggerTable.prototype.GetLines = function() {
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
exports.Instance = SufferingTriggerTableInstance;
