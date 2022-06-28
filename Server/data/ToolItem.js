
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ToolItem 类为 ToolItemTable 每一行的元素对象
 * */
var ToolItem = (function() {

    /**
    * 构造函数
    */
    function ToolItem() {
        this.INDEX = 0;
        this.ITEM_NAME = '';
        this.ITEM_QUALITY = 0;
        this.ITEM_ATLAS_NAME = '';
        this.ITEM_SPRITE_NAME = '';
        this.DESCRIBE = '';
        this.USEABLE = 0;
        this.GUIDE_TIME = 0;
        this.ITEM_GROUP_ID = 0;
        this.CONDITION_GROUP_ID = '';
        this.ITEM_GROUP_TYPE = 0;
        this.FUNCTION = 0;
        this.FUNCTION_TIP = '';
        this.AWARD_NOTICE = '';
        this.USELEVEL = 0;

    }

    return ToolItem;
})();

/**
 * [当前为生成代码，不可以修改] ToolItem 配置表
 * */
var ToolItemTableInstance = (function() {

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
            _unique = new ToolItemTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ToolItemTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ToolItem');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ToolItem();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ITEM_NAME = tmpArr[i].ITEM_NAME;
            obj.ITEM_QUALITY = parseInt(tmpArr[i].ITEM_QUALITY);
            obj.ITEM_ATLAS_NAME = tmpArr[i].ITEM_ATLAS_NAME;
            obj.ITEM_SPRITE_NAME = tmpArr[i].ITEM_SPRITE_NAME;
            obj.DESCRIBE = tmpArr[i].DESCRIBE;
            obj.USEABLE = parseInt(tmpArr[i].USEABLE);
            obj.GUIDE_TIME = parseInt(tmpArr[i].GUIDE_TIME);
            obj.ITEM_GROUP_ID = parseInt(tmpArr[i].ITEM_GROUP_ID);
            obj.CONDITION_GROUP_ID = tmpArr[i].CONDITION_GROUP_ID;
            obj.ITEM_GROUP_TYPE = parseInt(tmpArr[i].ITEM_GROUP_TYPE);
            obj.FUNCTION = parseInt(tmpArr[i].FUNCTION);
            obj.FUNCTION_TIP = tmpArr[i].FUNCTION_TIP;
            obj.AWARD_NOTICE = tmpArr[i].AWARD_NOTICE;
            obj.USELEVEL = parseInt(tmpArr[i].USELEVEL);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ToolItemTable.prototype.GetLines = function() {
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
exports.Instance = ToolItemTableInstance;
