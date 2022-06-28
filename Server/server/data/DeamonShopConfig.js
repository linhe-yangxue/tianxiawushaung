
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] DeamonShopConfig 类为 DeamonShopConfigTable 每一行的元素对象
 * */
var DeamonShopConfig = (function() {

    /**
    * 构造函数
    */
    function DeamonShopConfig() {
        this.INDEX = 0;
        this.TAB_ID = 0;
        this.TAB_NAME = '';
        this.ITEM_ID = 0;
        this.ITEM_NUM = 0;
        this.ITEM_SHOW_LEVEL = 0;
        this.VIP_LEVEL_DISPLAY = 0;
        this.COST_TYPE_1 = 0;
        this.COST_NUM_1 = 0;
        this.COST_TYPE_2 = 0;
        this.COST_NUM_2 = 0;
        this.BUY_NUM = 0;
        this.REFRESH_BYDAY = 0;

    }

    return DeamonShopConfig;
})();

/**
 * [当前为生成代码，不可以修改] DeamonShopConfig 配置表
 * */
var DeamonShopConfigTableInstance = (function() {

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
            _unique = new DeamonShopConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function DeamonShopConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('DeamonShopConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new DeamonShopConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TAB_ID = parseInt(tmpArr[i].TAB_ID);
            obj.TAB_NAME = tmpArr[i].TAB_NAME;
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.ITEM_NUM = parseInt(tmpArr[i].ITEM_NUM);
            obj.ITEM_SHOW_LEVEL = parseInt(tmpArr[i].ITEM_SHOW_LEVEL);
            obj.VIP_LEVEL_DISPLAY = parseInt(tmpArr[i].VIP_LEVEL_DISPLAY);
            obj.COST_TYPE_1 = parseInt(tmpArr[i].COST_TYPE_1);
            obj.COST_NUM_1 = parseInt(tmpArr[i].COST_NUM_1);
            obj.COST_TYPE_2 = parseInt(tmpArr[i].COST_TYPE_2);
            obj.COST_NUM_2 = parseInt(tmpArr[i].COST_NUM_2);
            obj.BUY_NUM = parseInt(tmpArr[i].BUY_NUM);
            obj.REFRESH_BYDAY = parseInt(tmpArr[i].REFRESH_BYDAY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    DeamonShopConfigTable.prototype.GetLines = function() {
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
exports.Instance = DeamonShopConfigTableInstance;
