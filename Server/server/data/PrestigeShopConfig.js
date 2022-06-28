
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PrestigeShopConfig 类为 PrestigeShopConfigTable 每一行的元素对象
 * */
var PrestigeShopConfig = (function() {

    /**
    * 构造函数
    */
    function PrestigeShopConfig() {
        this.INDEX = 0;
        this.TAB_ID = 0;
        this.TAB_NAME = '';
        this.ITEM_ID = 0;
        this.ITEM_NUM = 0;
        this.ITEM_SHOW_LEVEL = 0;
        this.COST_TYPE_1 = 0;
        this.COST_NUM_1 = 0;
        this.COST_TYPE_2 = 0;
        this.COST_NUM_2 = 0;
        this.BUY_NUM = 0;
        this.REFRESH_BYDAY = 0;
        this.OPEN_RANK = 0;
        this.FIRST_SHOW = 0;
        this.CURRENT_RANK = 0;

    }

    return PrestigeShopConfig;
})();

/**
 * [当前为生成代码，不可以修改] PrestigeShopConfig 配置表
 * */
var PrestigeShopConfigTableInstance = (function() {

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
            _unique = new PrestigeShopConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PrestigeShopConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PrestigeShopConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PrestigeShopConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TAB_ID = parseInt(tmpArr[i].TAB_ID);
            obj.TAB_NAME = tmpArr[i].TAB_NAME;
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.ITEM_NUM = parseInt(tmpArr[i].ITEM_NUM);
            obj.ITEM_SHOW_LEVEL = parseInt(tmpArr[i].ITEM_SHOW_LEVEL);
            obj.COST_TYPE_1 = parseInt(tmpArr[i].COST_TYPE_1);
            obj.COST_NUM_1 = parseInt(tmpArr[i].COST_NUM_1);
            obj.COST_TYPE_2 = parseInt(tmpArr[i].COST_TYPE_2);
            obj.COST_NUM_2 = parseInt(tmpArr[i].COST_NUM_2);
            obj.BUY_NUM = parseInt(tmpArr[i].BUY_NUM);
            obj.REFRESH_BYDAY = parseInt(tmpArr[i].REFRESH_BYDAY);
            obj.OPEN_RANK = parseInt(tmpArr[i].OPEN_RANK);
            obj.FIRST_SHOW = parseInt(tmpArr[i].FIRST_SHOW);
            obj.CURRENT_RANK = parseInt(tmpArr[i].CURRENT_RANK);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PrestigeShopConfigTable.prototype.GetLines = function() {
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
exports.Instance = PrestigeShopConfigTableInstance;
