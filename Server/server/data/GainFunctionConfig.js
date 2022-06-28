
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] GainFunctionConfig 类为 GainFunctionConfigTable 每一行的元素对象
 * */
var GainFunctionConfig = (function() {

    /**
    * 构造函数
    */
    function GainFunctionConfig() {
        this.INDEX = 0;
        this.Type = 0;
        this.TITLE = '';
        this.DESC = '';
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.FAILD_ATLAS_NAME = '';
        this.FAILD_SPRITE_NAME = '';
        this.Function_ID = 0;

    }

    return GainFunctionConfig;
})();

/**
 * [当前为生成代码，不可以修改] GainFunctionConfig 配置表
 * */
var GainFunctionConfigTableInstance = (function() {

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
            _unique = new GainFunctionConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function GainFunctionConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('GainFunctionConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new GainFunctionConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.Type = parseInt(tmpArr[i].Type);
            obj.TITLE = tmpArr[i].TITLE;
            obj.DESC = tmpArr[i].DESC;
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.FAILD_ATLAS_NAME = tmpArr[i].FAILD_ATLAS_NAME;
            obj.FAILD_SPRITE_NAME = tmpArr[i].FAILD_SPRITE_NAME;
            obj.Function_ID = parseInt(tmpArr[i].Function_ID);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    GainFunctionConfigTable.prototype.GetLines = function() {
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
exports.Instance = GainFunctionConfigTableInstance;
