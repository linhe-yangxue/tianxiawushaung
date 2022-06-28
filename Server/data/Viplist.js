
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Viplist 类为 ViplistTable 每一行的元素对象
 * */
var Viplist = (function() {

    /**
    * 构造函数
    */
    function Viplist() {
        this.INDEX = 0;
        this.VIPDESC = '';
        this.VIPICON = '';
        this.CASHPAID = 0;
        this.GIFT = 0;
        this.MANUAL_NUM = '';
        this.ENERGY_NUM = '';
        this.EXP_NUM = '';
        this.MONEY_NUM = '';
        this.MAGIC_NUM = '';
        this.WORSHIP_OPEN = 0;
        this.STR_CRI_RATE = 0;
        this.STR_CRI_LV = 0;
        this.COPYRESET_NUM = 0;
        this.EVENT_NUM = 0;
        this.CLIMBING_NUM = 0;
        this.PART_NUM = 0;
        this.AWAKEN_NUM = 0;
        this.EQUI_NUM = '';
        this.TREASURE_NUM = '';
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
        this.MAGIC_BAG_NUM = 0;
        this.GUILD_BOSS_BUY_TIME = 0;
        this.AUTO_GRAP = 0;
        this.FIVE_GRAP = 0;

    }

    return Viplist;
})();

/**
 * [当前为生成代码，不可以修改] Viplist 配置表
 * */
var ViplistTableInstance = (function() {

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
            _unique = new ViplistTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ViplistTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Viplist');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Viplist();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.VIPDESC = tmpArr[i].VIPDESC;
            obj.VIPICON = tmpArr[i].VIPICON;
            obj.CASHPAID = parseInt(tmpArr[i].CASHPAID);
            obj.GIFT = parseInt(tmpArr[i].GIFT);
            obj.MANUAL_NUM = tmpArr[i].MANUAL_NUM;
            obj.ENERGY_NUM = tmpArr[i].ENERGY_NUM;
            obj.EXP_NUM = tmpArr[i].EXP_NUM;
            obj.MONEY_NUM = tmpArr[i].MONEY_NUM;
            obj.MAGIC_NUM = tmpArr[i].MAGIC_NUM;
            obj.WORSHIP_OPEN = parseInt(tmpArr[i].WORSHIP_OPEN);
            obj.STR_CRI_RATE = parseInt(tmpArr[i].STR_CRI_RATE);
            obj.STR_CRI_LV = parseInt(tmpArr[i].STR_CRI_LV);
            obj.COPYRESET_NUM = parseInt(tmpArr[i].COPYRESET_NUM);
            obj.EVENT_NUM = parseInt(tmpArr[i].EVENT_NUM);
            obj.CLIMBING_NUM = parseInt(tmpArr[i].CLIMBING_NUM);
            obj.PART_NUM = parseInt(tmpArr[i].PART_NUM);
            obj.AWAKEN_NUM = parseInt(tmpArr[i].AWAKEN_NUM);
            obj.EQUI_NUM = tmpArr[i].EQUI_NUM;
            obj.TREASURE_NUM = tmpArr[i].TREASURE_NUM;
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
            obj.MAGIC_BAG_NUM = parseInt(tmpArr[i].MAGIC_BAG_NUM);
            obj.GUILD_BOSS_BUY_TIME = parseInt(tmpArr[i].GUILD_BOSS_BUY_TIME);
            obj.AUTO_GRAP = parseInt(tmpArr[i].AUTO_GRAP);
            obj.FIVE_GRAP = parseInt(tmpArr[i].FIVE_GRAP);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ViplistTable.prototype.GetLines = function() {
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
exports.Instance = ViplistTableInstance;
