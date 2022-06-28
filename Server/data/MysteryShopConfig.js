
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MysteryShopConfig 类为 MysteryShopConfigTable 每一行的元素对象
 * */
var MysteryShopConfig = (function() {

    /**
    * 构造函数
    */
    function MysteryShopConfig() {
        this.INDEX = 0;
        this.ITEM_ID = 0;
        this.ITEM_NUM = 0;
        this.ITEM_SHOW_LEVEL = 0;
        this.COST_TYPE_1 = 0;
        this.COST_NUM_1 = 0;
        this.FIRST_SHOW = 0;
        this.PET_ID = 0;
        this.REFRESH_RATE = 0;
        this.LEVEL_MIN = 0;
        this.LEVEL_MAX = 0;

    }

    return MysteryShopConfig;
})();

/**
 * [当前为生成代码，不可以修改] MysteryShopConfig 配置表
 * */
var MysteryShopConfigTableInstance = (function() {

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
            _unique = new MysteryShopConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MysteryShopConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MysteryShopConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MysteryShopConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.ITEM_NUM = parseInt(tmpArr[i].ITEM_NUM);
            obj.ITEM_SHOW_LEVEL = parseInt(tmpArr[i].ITEM_SHOW_LEVEL);
            obj.COST_TYPE_1 = parseInt(tmpArr[i].COST_TYPE_1);
            obj.COST_NUM_1 = parseInt(tmpArr[i].COST_NUM_1);
            obj.FIRST_SHOW = parseInt(tmpArr[i].FIRST_SHOW);
            obj.PET_ID = parseInt(tmpArr[i].PET_ID);
            obj.REFRESH_RATE = parseInt(tmpArr[i].REFRESH_RATE);
            obj.LEVEL_MIN = parseInt(tmpArr[i].LEVEL_MIN);
            obj.LEVEL_MAX = parseInt(tmpArr[i].LEVEL_MAX);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MysteryShopConfigTable.prototype.GetLines = function() {
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
exports.Instance = MysteryShopConfigTableInstance;
