
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FlashSaleEvent 类为 FlashSaleEventTable 每一行的元素对象
 * */
var FlashSaleEvent = (function() {

    /**
    * 构造函数
    */
    function FlashSaleEvent() {
        this.INDEX = 0;
        this.TYPE = 0;
        this.TITLE = '';
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.CONDITION = '';
        this.LAST = 0;
        this.DAILY_UPDATE = 0;
        this.DAILY_PURCHASE = 0;
        this.ITEM_LIST = '';
        this.PRICE = '';

    }

    return FlashSaleEvent;
})();

/**
 * [当前为生成代码，不可以修改] FlashSaleEvent 配置表
 * */
var FlashSaleEventTableInstance = (function() {

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
            _unique = new FlashSaleEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FlashSaleEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FlashSaleEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FlashSaleEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.TITLE = tmpArr[i].TITLE;
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.CONDITION = tmpArr[i].CONDITION;
            obj.LAST = parseInt(tmpArr[i].LAST);
            obj.DAILY_UPDATE = parseInt(tmpArr[i].DAILY_UPDATE);
            obj.DAILY_PURCHASE = parseInt(tmpArr[i].DAILY_PURCHASE);
            obj.ITEM_LIST = tmpArr[i].ITEM_LIST;
            obj.PRICE = tmpArr[i].PRICE;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FlashSaleEventTable.prototype.GetLines = function() {
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
exports.Instance = FlashSaleEventTableInstance;
