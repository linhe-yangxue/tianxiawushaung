
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] VipConfig 类为 VipConfigTable 每一行的元素对象
 * */
var VipConfig = (function() {

    /**
    * 构造函数
    */
    function VipConfig() {
        this.INDEX = 0;
        this.VIPICON = '';
        this.CASHPAID = 0;
        this.GIFT = 0;
        this.MANUAL_NUM = 0;
        this.ENERGY_NUM = 0;
        this.CRUSADE_NUM = 0;
        this.EXP_NUM = 0;
        this.MONEY_NUM = 0;
        this.WORSHIP_OPEN = 0;
        this.STR_CRI_RATE = 0;
        this.STR_CRI_LV = 0;
        this.COPYRESET_NUM = 0;
        this.EVENT_NUM = 0;
        this.CLIMBING_NUM = 0;
        this.PART_NUM = 0;
        this.AWAKEN_NUM = 0;
        this.EQUI_NUM = 0;
        this.TREASURE_NUM = 0;
        this.TREASURE_PROFIT_1 = 0;
        this.TREASURE_PROFIT_2 = 0;
        this.DESTINY = 0;
        this.REFINE = 0;
        this.BREACH = 0;
        this.DAY_GROUP_ID = 0;
        this.DAY_DESC = '';
        this.WEEK_GROUP_ID = 0;
        this.ORIGINAL_PRICE = 0;
        this.PRESENT_PRICE = 0;
        this.PET_BAG_NUM = 0;
        this.EQUIP_BAG_NUM = 0;
        this.MAGICEQUIP_BAG_NUM = 0;

    }

    return VipConfig;
})();

/**
 * [当前为生成代码，不可以修改] VipConfig 配置表
 * */
var VipConfigTableInstance = (function() {

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
            _unique = new VipConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function VipConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('VipConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new VipConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.VIPICON = tmpArr[i].VIPICON;
            obj.CASHPAID = parseInt(tmpArr[i].CASHPAID);
            obj.GIFT = parseInt(tmpArr[i].GIFT);
            obj.MANUAL_NUM = parseInt(tmpArr[i].MANUAL_NUM);
            obj.ENERGY_NUM = parseInt(tmpArr[i].ENERGY_NUM);
            obj.CRUSADE_NUM = parseInt(tmpArr[i].CRUSADE_NUM);
            obj.EXP_NUM = parseInt(tmpArr[i].EXP_NUM);
            obj.MONEY_NUM = parseInt(tmpArr[i].MONEY_NUM);
            obj.WORSHIP_OPEN = parseInt(tmpArr[i].WORSHIP_OPEN);
            obj.STR_CRI_RATE = parseInt(tmpArr[i].STR_CRI_RATE);
            obj.STR_CRI_LV = parseInt(tmpArr[i].STR_CRI_LV);
            obj.COPYRESET_NUM = parseInt(tmpArr[i].COPYRESET_NUM);
            obj.EVENT_NUM = parseInt(tmpArr[i].EVENT_NUM);
            obj.CLIMBING_NUM = parseInt(tmpArr[i].CLIMBING_NUM);
            obj.PART_NUM = parseInt(tmpArr[i].PART_NUM);
            obj.AWAKEN_NUM = parseInt(tmpArr[i].AWAKEN_NUM);
            obj.EQUI_NUM = parseInt(tmpArr[i].EQUI_NUM);
            obj.TREASURE_NUM = parseInt(tmpArr[i].TREASURE_NUM);
            obj.TREASURE_PROFIT_1 = parseInt(tmpArr[i].TREASURE_PROFIT_1);
            obj.TREASURE_PROFIT_2 = parseInt(tmpArr[i].TREASURE_PROFIT_2);
            obj.DESTINY = parseInt(tmpArr[i].DESTINY);
            obj.REFINE = parseInt(tmpArr[i].REFINE);
            obj.BREACH = parseInt(tmpArr[i].BREACH);
            obj.DAY_GROUP_ID = parseInt(tmpArr[i].DAY_GROUP_ID);
            obj.DAY_DESC = tmpArr[i].DAY_DESC;
            obj.WEEK_GROUP_ID = parseInt(tmpArr[i].WEEK_GROUP_ID);
            obj.ORIGINAL_PRICE = parseInt(tmpArr[i].ORIGINAL_PRICE);
            obj.PRESENT_PRICE = parseInt(tmpArr[i].PRESENT_PRICE);
            obj.PET_BAG_NUM = parseInt(tmpArr[i].PET_BAG_NUM);
            obj.EQUIP_BAG_NUM = parseInt(tmpArr[i].EQUIP_BAG_NUM);
            obj.MAGICEQUIP_BAG_NUM = parseInt(tmpArr[i].MAGICEQUIP_BAG_NUM);

            _lines[tmpArr[i].INDEX] = obj;
            if(isNaN(obj.INDEX)) {
                console.error('[CSV data error] [Table] VipConfig [Column] INDEX [TID]' + i);
            }
            if(isNaN(obj.CASHPAID)) {
                console.error('[CSV data error] [Table] VipConfig [Column] CASHPAID [TID]' + i);
            }
            if(isNaN(obj.GIFT)) {
                console.error('[CSV data error] [Table] VipConfig [Column] GIFT [TID]' + i);
            }
            if(isNaN(obj.MANUAL_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] MANUAL_NUM [TID]' + i);
            }
            if(isNaN(obj.ENERGY_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] ENERGY_NUM [TID]' + i);
            }
            if(isNaN(obj.CRUSADE_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] CRUSADE_NUM [TID]' + i);
            }
            if(isNaN(obj.EXP_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] EXP_NUM [TID]' + i);
            }
            if(isNaN(obj.MONEY_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] MONEY_NUM [TID]' + i);
            }
            if(isNaN(obj.WORSHIP_OPEN)) {
                console.error('[CSV data error] [Table] VipConfig [Column] WORSHIP_OPEN [TID]' + i);
            }
            if(isNaN(obj.STR_CRI_RATE)) {
                console.error('[CSV data error] [Table] VipConfig [Column] STR_CRI_RATE [TID]' + i);
            }
            if(isNaN(obj.STR_CRI_LV)) {
                console.error('[CSV data error] [Table] VipConfig [Column] STR_CRI_LV [TID]' + i);
            }
            if(isNaN(obj.COPYRESET_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] COPYRESET_NUM [TID]' + i);
            }
            if(isNaN(obj.EVENT_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] EVENT_NUM [TID]' + i);
            }
            if(isNaN(obj.CLIMBING_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] CLIMBING_NUM [TID]' + i);
            }
            if(isNaN(obj.PART_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] PART_NUM [TID]' + i);
            }
            if(isNaN(obj.AWAKEN_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] AWAKEN_NUM [TID]' + i);
            }
            if(isNaN(obj.EQUI_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] EQUI_NUM [TID]' + i);
            }
            if(isNaN(obj.TREASURE_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] TREASURE_NUM [TID]' + i);
            }
            if(isNaN(obj.TREASURE_PROFIT_1)) {
                console.error('[CSV data error] [Table] VipConfig [Column] TREASURE_PROFIT_1 [TID]' + i);
            }
            if(isNaN(obj.TREASURE_PROFIT_2)) {
                console.error('[CSV data error] [Table] VipConfig [Column] TREASURE_PROFIT_2 [TID]' + i);
            }
            if(isNaN(obj.DESTINY)) {
                console.error('[CSV data error] [Table] VipConfig [Column] DESTINY [TID]' + i);
            }
            if(isNaN(obj.REFINE)) {
                console.error('[CSV data error] [Table] VipConfig [Column] REFINE [TID]' + i);
            }
            if(isNaN(obj.BREACH)) {
                console.error('[CSV data error] [Table] VipConfig [Column] BREACH [TID]' + i);
            }
            if(isNaN(obj.DAY_GROUP_ID)) {
                console.error('[CSV data error] [Table] VipConfig [Column] DAY_GROUP_ID [TID]' + i);
            }
            if(isNaN(obj.WEEK_GROUP_ID)) {
                console.error('[CSV data error] [Table] VipConfig [Column] WEEK_GROUP_ID [TID]' + i);
            }
            if(isNaN(obj.ORIGINAL_PRICE)) {
                console.error('[CSV data error] [Table] VipConfig [Column] ORIGINAL_PRICE [TID]' + i);
            }
            if(isNaN(obj.PRESENT_PRICE)) {
                console.error('[CSV data error] [Table] VipConfig [Column] PRESENT_PRICE [TID]' + i);
            }
            if(isNaN(obj.PET_BAG_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] PET_BAG_NUM [TID]' + i);
            }
            if(isNaN(obj.EQUIP_BAG_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] EQUIP_BAG_NUM [TID]' + i);
            }
            if(isNaN(obj.MAGICEQUIP_BAG_NUM)) {
                console.error('[CSV data error] [Table] VipConfig [Column] MAGICEQUIP_BAG_NUM [TID]' + i);
            }

        }
    }

    /**
    * 获取行队列
    */
    VipConfigTable.prototype.GetLines = function() {
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
exports.Instance = VipConfigTableInstance;
