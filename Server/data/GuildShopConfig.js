
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] GuildShopConfig 类为 GuildShopConfigTable 每一行的元素对象
 * */
var GuildShopConfig = (function() {

    /**
    * 构造函数
    */
    function GuildShopConfig() {
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
        this.MAX_ITEM_NUM = 0;
        this.OPEN_GUILD_LEVEL = 0;

    }

    return GuildShopConfig;
})();

/**
 * [当前为生成代码，不可以修改] GuildShopConfig 配置表
 * */
var GuildShopConfigTableInstance = (function() {

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
            _unique = new GuildShopConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function GuildShopConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('GuildShopConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new GuildShopConfig();
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
            obj.MAX_ITEM_NUM = parseInt(tmpArr[i].MAX_ITEM_NUM);
            obj.OPEN_GUILD_LEVEL = parseInt(tmpArr[i].OPEN_GUILD_LEVEL);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    GuildShopConfigTable.prototype.GetLines = function() {
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
exports.Instance = GuildShopConfigTableInstance;
