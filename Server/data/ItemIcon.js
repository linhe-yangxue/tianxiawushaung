
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ItemIcon 类为 ItemIconTable 每一行的元素对象
 * */
var ItemIcon = (function() {

    /**
    * 构造函数
    */
    function ItemIcon() {
        this.INDEX = 0;
        this.NAME = '';
        this.ITEM_ATLAS_NAME = '';
        this.ITEM_SPRITE_NAME = '';
        this.ITEM_ICON_ATLAS = '';
        this.ITEM_ICON_SPRITE = '';
        this.MYSTERIOUS_SHOP_ATLAS = '';
        this.MYSTERIOUS_SHOP_SPRITE = '';

    }

    return ItemIcon;
})();

/**
 * [当前为生成代码，不可以修改] ItemIcon 配置表
 * */
var ItemIconTableInstance = (function() {

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
            _unique = new ItemIconTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ItemIconTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ItemIcon');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ItemIcon();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.ITEM_ATLAS_NAME = tmpArr[i].ITEM_ATLAS_NAME;
            obj.ITEM_SPRITE_NAME = tmpArr[i].ITEM_SPRITE_NAME;
            obj.ITEM_ICON_ATLAS = tmpArr[i].ITEM_ICON_ATLAS;
            obj.ITEM_ICON_SPRITE = tmpArr[i].ITEM_ICON_SPRITE;
            obj.MYSTERIOUS_SHOP_ATLAS = tmpArr[i].MYSTERIOUS_SHOP_ATLAS;
            obj.MYSTERIOUS_SHOP_SPRITE = tmpArr[i].MYSTERIOUS_SHOP_SPRITE;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ItemIconTable.prototype.GetLines = function() {
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
exports.Instance = ItemIconTableInstance;
