
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FunctionConfig 类为 FunctionConfigTable 每一行的元素对象
 * */
var FunctionConfig = (function() {

    /**
    * 构造函数
    */
    function FunctionConfig() {
        this.INDEX = 0;
        this.FUNC_NAME = '';
        this.FUNC_OPEN = 0;
        this.VIP_SHOW_LEVEL = '';
        this.FUNC_RESOURCE = '';
        this.ICON_ATLAS_NAME_OPEN = '';
        this.SPRITE_NAME_OPEN = '';
        this.ICON_ATLAS_NAME_CLOSE = '';
        this.SPRITE_NAME_CLOSE = '';
        this.FUNC_CLOSE_DESCRIBE = '';
        this.FUNC_CONDITION = 0;
        this.FUNC_CONDITION_USE = '';
        this.FUNC_CONDITION_DESCRIBE = '';
        this.FUNC_DISAPPER_DESCRIBE = '';
        this.FUNC_DISAPPER_NUM = '';
        this.TITLE = '';
        this.DESC = '';
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.FUNC_SHOW = 0;

    }

    return FunctionConfig;
})();

/**
 * [当前为生成代码，不可以修改] FunctionConfig 配置表
 * */
var FunctionConfigTableInstance = (function() {

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
            _unique = new FunctionConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FunctionConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FunctionConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FunctionConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.FUNC_NAME = tmpArr[i].FUNC_NAME;
            obj.FUNC_OPEN = parseInt(tmpArr[i].FUNC_OPEN);
            obj.VIP_SHOW_LEVEL = tmpArr[i].VIP_SHOW_LEVEL;
            obj.FUNC_RESOURCE = tmpArr[i].FUNC_RESOURCE;
            obj.ICON_ATLAS_NAME_OPEN = tmpArr[i].ICON_ATLAS_NAME_OPEN;
            obj.SPRITE_NAME_OPEN = tmpArr[i].SPRITE_NAME_OPEN;
            obj.ICON_ATLAS_NAME_CLOSE = tmpArr[i].ICON_ATLAS_NAME_CLOSE;
            obj.SPRITE_NAME_CLOSE = tmpArr[i].SPRITE_NAME_CLOSE;
            obj.FUNC_CLOSE_DESCRIBE = tmpArr[i].FUNC_CLOSE_DESCRIBE;
            obj.FUNC_CONDITION = parseInt(tmpArr[i].FUNC_CONDITION);
            obj.FUNC_CONDITION_USE = tmpArr[i].FUNC_CONDITION_USE;
            obj.FUNC_CONDITION_DESCRIBE = tmpArr[i].FUNC_CONDITION_DESCRIBE;
            obj.FUNC_DISAPPER_DESCRIBE = tmpArr[i].FUNC_DISAPPER_DESCRIBE;
            obj.FUNC_DISAPPER_NUM = tmpArr[i].FUNC_DISAPPER_NUM;
            obj.TITLE = tmpArr[i].TITLE;
            obj.DESC = tmpArr[i].DESC;
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.FUNC_SHOW = parseInt(tmpArr[i].FUNC_SHOW);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FunctionConfigTable.prototype.GetLines = function() {
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
exports.Instance = FunctionConfigTableInstance;
