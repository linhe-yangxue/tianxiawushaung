
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] CommonShopConfig 类为 CommonShopConfigTable 每一行的元素对象
 * */
var CommonShopConfig = (function() {

    /**
    * 构造函数
    */
    function CommonShopConfig() {
        this.INDEX = 0;
        this.SHOP_TYPE = 0;
        this.TAB_ID = 0;
        this.TAB_NAME = '';
        this.ITEM_ID = 0;
        this.ITEM_SHOW_LEVEL = 0;
        this.VIP_LEVEL_DISPLAY = 0;
        this.COST_TYPE_1 = 0;
        this.COST_NUM_1 = 0;
        this.COST_TYPE_2 = 0;
        this.COST_NUM_2 = 0;
        this.BUY_NUM = 0;
        this.REFRESH_BYDAY = 0;
        this.MAX_ITEM_NUM = 0;
        this.OPEN_TYPE = 0;
        this.OPEN_NUM = 0;
        this.NUMBER_STAGE_1 = 0;
        this.STAGE_PRICE_1 = 0;
        this.NUMBER_STAGE_2 = 0;
        this.STAGE_PRICE_2 = 0;
        this.NUMBER_STAGE_3 = 0;
        this.STAGE_PRICE_3 = 0;
        this.NUMBER_STAGE_4 = 0;
        this.STAGE_PRICE_4 = 0;
        this.NUMBER_STAGE_5 = 0;
        this.STAGE_PRICE_5 = 0;

    }

    return CommonShopConfig;
})();

/**
 * [当前为生成代码，不可以修改] CommonShopConfig 配置表
 * */
var CommonShopConfigTableInstance = (function() {

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
            _unique = new CommonShopConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function CommonShopConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('CommonShopConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new CommonShopConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.SHOP_TYPE = parseInt(tmpArr[i].SHOP_TYPE);
            obj.TAB_ID = parseInt(tmpArr[i].TAB_ID);
            obj.TAB_NAME = tmpArr[i].TAB_NAME;
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.ITEM_SHOW_LEVEL = parseInt(tmpArr[i].ITEM_SHOW_LEVEL);
            obj.VIP_LEVEL_DISPLAY = parseInt(tmpArr[i].VIP_LEVEL_DISPLAY);
            obj.COST_TYPE_1 = parseInt(tmpArr[i].COST_TYPE_1);
            obj.COST_NUM_1 = parseInt(tmpArr[i].COST_NUM_1);
            obj.COST_TYPE_2 = parseInt(tmpArr[i].COST_TYPE_2);
            obj.COST_NUM_2 = parseInt(tmpArr[i].COST_NUM_2);
            obj.BUY_NUM = parseInt(tmpArr[i].BUY_NUM);
            obj.REFRESH_BYDAY = parseInt(tmpArr[i].REFRESH_BYDAY);
            obj.MAX_ITEM_NUM = parseInt(tmpArr[i].MAX_ITEM_NUM);
            obj.OPEN_TYPE = parseInt(tmpArr[i].OPEN_TYPE);
            obj.OPEN_NUM = parseInt(tmpArr[i].OPEN_NUM);
            obj.NUMBER_STAGE_1 = parseInt(tmpArr[i].NUMBER_STAGE_1);
            obj.STAGE_PRICE_1 = parseInt(tmpArr[i].STAGE_PRICE_1);
            obj.NUMBER_STAGE_2 = parseInt(tmpArr[i].NUMBER_STAGE_2);
            obj.STAGE_PRICE_2 = parseInt(tmpArr[i].STAGE_PRICE_2);
            obj.NUMBER_STAGE_3 = parseInt(tmpArr[i].NUMBER_STAGE_3);
            obj.STAGE_PRICE_3 = parseInt(tmpArr[i].STAGE_PRICE_3);
            obj.NUMBER_STAGE_4 = parseInt(tmpArr[i].NUMBER_STAGE_4);
            obj.STAGE_PRICE_4 = parseInt(tmpArr[i].STAGE_PRICE_4);
            obj.NUMBER_STAGE_5 = parseInt(tmpArr[i].NUMBER_STAGE_5);
            obj.STAGE_PRICE_5 = parseInt(tmpArr[i].STAGE_PRICE_5);

            _lines[tmpArr[i].INDEX] = obj;
            if(isNaN(obj.INDEX)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] INDEX [TID]' + i);
            }
            if(isNaN(obj.SHOP_TYPE)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] SHOP_TYPE [TID]' + i);
            }
            if(isNaN(obj.TAB_ID)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] TAB_ID [TID]' + i);
            }
            if(isNaN(obj.ITEM_ID)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] ITEM_ID [TID]' + i);
            }
            if(isNaN(obj.ITEM_SHOW_LEVEL)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] ITEM_SHOW_LEVEL [TID]' + i);
            }
            if(isNaN(obj.VIP_LEVEL_DISPLAY)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] VIP_LEVEL_DISPLAY [TID]' + i);
            }
            if(isNaN(obj.COST_TYPE_1)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] COST_TYPE_1 [TID]' + i);
            }
            if(isNaN(obj.COST_NUM_1)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] COST_NUM_1 [TID]' + i);
            }
            if(isNaN(obj.COST_TYPE_2)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] COST_TYPE_2 [TID]' + i);
            }
            if(isNaN(obj.COST_NUM_2)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] COST_NUM_2 [TID]' + i);
            }
            if(isNaN(obj.BUY_NUM)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] BUY_NUM [TID]' + i);
            }
            if(isNaN(obj.REFRESH_BYDAY)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] REFRESH_BYDAY [TID]' + i);
            }
            if(isNaN(obj.MAX_ITEM_NUM)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] MAX_ITEM_NUM [TID]' + i);
            }
            if(isNaN(obj.OPEN_TYPE)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] OPEN_TYPE [TID]' + i);
            }
            if(isNaN(obj.OPEN_NUM)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] OPEN_NUM [TID]' + i);
            }
            if(isNaN(obj.NUMBER_STAGE_1)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] NUMBER_STAGE_1 [TID]' + i);
            }
            if(isNaN(obj.STAGE_PRICE_1)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] STAGE_PRICE_1 [TID]' + i);
            }
            if(isNaN(obj.NUMBER_STAGE_2)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] NUMBER_STAGE_2 [TID]' + i);
            }
            if(isNaN(obj.STAGE_PRICE_2)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] STAGE_PRICE_2 [TID]' + i);
            }
            if(isNaN(obj.NUMBER_STAGE_3)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] NUMBER_STAGE_3 [TID]' + i);
            }
            if(isNaN(obj.STAGE_PRICE_3)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] STAGE_PRICE_3 [TID]' + i);
            }
            if(isNaN(obj.NUMBER_STAGE_4)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] NUMBER_STAGE_4 [TID]' + i);
            }
            if(isNaN(obj.STAGE_PRICE_4)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] STAGE_PRICE_4 [TID]' + i);
            }
            if(isNaN(obj.NUMBER_STAGE_5)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] NUMBER_STAGE_5 [TID]' + i);
            }
            if(isNaN(obj.STAGE_PRICE_5)) {
                console.error('[CSV data error] [Table] CommonShopConfig [Column] STAGE_PRICE_5 [TID]' + i);
            }

        }
    }

    /**
    * 获取行队列
    */
    CommonShopConfigTable.prototype.GetLines = function() {
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
exports.Instance = CommonShopConfigTableInstance;
