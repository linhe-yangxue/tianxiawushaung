
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] RoleUIConfig 类为 RoleUIConfigTable 每一行的元素对象
 * */
var RoleUIConfig = (function() {

    /**
    * 构造函数
    */
    function RoleUIConfig() {
        this.INDEX = 0;
        this.MODEL = 0;
        this.ROLE_TYPE = 0;
        this.COST_ITEM_TYPE = 0;
        this.COST_ITEM_COUNT = 0;
        this.ATLAS = '';
        this.SPRITE = '';
        this.BACKGROUND_ATLAS_NAME = '';
        this.BACKGROUND_SPRITE_NAME = '';
        this.ROLE_INFO = '';

    }

    return RoleUIConfig;
})();

/**
 * [当前为生成代码，不可以修改] RoleUIConfig 配置表
 * */
var RoleUIConfigTableInstance = (function() {

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
            _unique = new RoleUIConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function RoleUIConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('RoleUIConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new RoleUIConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.MODEL = parseInt(tmpArr[i].MODEL);
            obj.ROLE_TYPE = parseInt(tmpArr[i].ROLE_TYPE);
            obj.COST_ITEM_TYPE = parseInt(tmpArr[i].COST_ITEM_TYPE);
            obj.COST_ITEM_COUNT = parseInt(tmpArr[i].COST_ITEM_COUNT);
            obj.ATLAS = tmpArr[i].ATLAS;
            obj.SPRITE = tmpArr[i].SPRITE;
            obj.BACKGROUND_ATLAS_NAME = tmpArr[i].BACKGROUND_ATLAS_NAME;
            obj.BACKGROUND_SPRITE_NAME = tmpArr[i].BACKGROUND_SPRITE_NAME;
            obj.ROLE_INFO = tmpArr[i].ROLE_INFO;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    RoleUIConfigTable.prototype.GetLines = function() {
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
exports.Instance = RoleUIConfigTableInstance;
