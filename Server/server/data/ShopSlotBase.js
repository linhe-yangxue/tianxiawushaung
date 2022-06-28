
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ShopSlotBase 类为 ShopSlotBaseTable 每一行的元素对象
 * */
var ShopSlotBase = (function() {

    /**
    * 构造函数
    */
    function ShopSlotBase() {
        this.INDEX = 0;
        this.NAME = '';
        this.DESC = '';
        this.PAGE_TYPE = 0;
        this.START_TIME = '';
        this.END_TIME = '';
        this.GROUP_ID = 0;
        this.PROTECT_NUM = 0;
        this.PROTECT_GROUP_ID = '';
        this.EXTRACT_TIMES = '';
        this.MINIMUM_GUARANTEE_TIMES = '';
        this.BUY_ITEM_TYPE = 0;
        this.BUY_ITEM_COUNT = 0;
        this.ROLE_MODEL_INDEX = 0;
        this.ITEM_ATLAS_NAME = '';
        this.ITEM_SPRITE_NAME = '';
        this.COST_ITEM_TYPE = 0;
        this.COST_ITEM_COUNT = 0;
        this.ITEM_DESCRIPTION = '';
        this.IS_HOT = 0;
        this.IS_NEW = 0;
        this.IS_SALE = 0;
        this.IS_FREE = 0;
        this.FREE_COUNT = 0;
        this.FREE_INTERVAL = 0;
        this.IS_DAILY_REFRESH = 0;
        this.IS_DISCOUNT = 0;

    }

    return ShopSlotBase;
})();

/**
 * [当前为生成代码，不可以修改] ShopSlotBase 配置表
 * */
var ShopSlotBaseTableInstance = (function() {

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
            _unique = new ShopSlotBaseTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ShopSlotBaseTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ShopSlotBase');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ShopSlotBase();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.DESC = tmpArr[i].DESC;
            obj.PAGE_TYPE = parseInt(tmpArr[i].PAGE_TYPE);
            obj.START_TIME = tmpArr[i].START_TIME;
            obj.END_TIME = tmpArr[i].END_TIME;
            obj.GROUP_ID = parseInt(tmpArr[i].GROUP_ID);
            obj.PROTECT_NUM = parseInt(tmpArr[i].PROTECT_NUM);
            obj.PROTECT_GROUP_ID = tmpArr[i].PROTECT_GROUP_ID;
            obj.EXTRACT_TIMES = tmpArr[i].EXTRACT_TIMES;
            obj.MINIMUM_GUARANTEE_TIMES = tmpArr[i].MINIMUM_GUARANTEE_TIMES;
            obj.BUY_ITEM_TYPE = parseInt(tmpArr[i].BUY_ITEM_TYPE);
            obj.BUY_ITEM_COUNT = parseInt(tmpArr[i].BUY_ITEM_COUNT);
            obj.ROLE_MODEL_INDEX = parseInt(tmpArr[i].ROLE_MODEL_INDEX);
            obj.ITEM_ATLAS_NAME = tmpArr[i].ITEM_ATLAS_NAME;
            obj.ITEM_SPRITE_NAME = tmpArr[i].ITEM_SPRITE_NAME;
            obj.COST_ITEM_TYPE = parseInt(tmpArr[i].COST_ITEM_TYPE);
            obj.COST_ITEM_COUNT = parseInt(tmpArr[i].COST_ITEM_COUNT);
            obj.ITEM_DESCRIPTION = tmpArr[i].ITEM_DESCRIPTION;
            obj.IS_HOT = parseInt(tmpArr[i].IS_HOT);
            obj.IS_NEW = parseInt(tmpArr[i].IS_NEW);
            obj.IS_SALE = parseInt(tmpArr[i].IS_SALE);
            obj.IS_FREE = parseInt(tmpArr[i].IS_FREE);
            obj.FREE_COUNT = parseInt(tmpArr[i].FREE_COUNT);
            obj.FREE_INTERVAL = parseInt(tmpArr[i].FREE_INTERVAL);
            obj.IS_DAILY_REFRESH = parseInt(tmpArr[i].IS_DAILY_REFRESH);
            obj.IS_DISCOUNT = parseInt(tmpArr[i].IS_DISCOUNT);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ShopSlotBaseTable.prototype.GetLines = function() {
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
exports.Instance = ShopSlotBaseTableInstance;
