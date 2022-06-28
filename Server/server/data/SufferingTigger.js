
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SufferingTigger 类为 SufferingTiggerTable 每一行的元素对象
 * */
var SufferingTigger = (function() {

    /**
    * 构造函数
    */
    function SufferingTigger() {
        this.INDEX = 0;
        this.TITLE = '';
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.Function_ID = 0;

    }

    return SufferingTigger;
})();

/**
 * [当前为生成代码，不可以修改] SufferingTigger 配置表
 * */
var SufferingTiggerTableInstance = (function() {

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
            _unique = new SufferingTiggerTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SufferingTiggerTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SufferingTigger');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SufferingTigger();
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
    SufferingTiggerTable.prototype.GetLines = function() {
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
exports.Instance = SufferingTiggerTableInstance;
