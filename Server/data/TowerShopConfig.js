
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] TowerShopConfig 类为 TowerShopConfigTable 每一行的元素对象
 * */
var TowerShopConfig = (function() {

    /**
    * 构造函数
    */
    function TowerShopConfig() {
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
        this.OPEN_STAR_NUM = 0;

    }

    return TowerShopConfig;
})();

/**
 * [当前为生成代码，不可以修改] TowerShopConfig 配置表
 * */
var TowerShopConfigTableInstance = (function() {

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
            _unique = new TowerShopConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function TowerShopConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('TowerShopConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new TowerShopConfig();
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
            obj.OPEN_STAR_NUM = parseInt(tmpArr[i].OPEN_STAR_NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    TowerShopConfigTable.prototype.GetLines = function() {
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
exports.Instance = TowerShopConfigTableInstance;
