
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] GuildBossPrice 类为 GuildBossPriceTable 每一行的元素对象
 * */
var GuildBossPrice = (function() {

    /**
    * 构造函数
    */
    function GuildBossPrice() {
        this.INDEX = 0;
        this.PRICE = 0;

    }

    return GuildBossPrice;
})();

/**
 * [当前为生成代码，不可以修改] GuildBossPrice 配置表
 * */
var GuildBossPriceTableInstance = (function() {

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
            _unique = new GuildBossPriceTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function GuildBossPriceTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('GuildBossPrice');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new GuildBossPrice();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.PRICE = parseInt(tmpArr[i].PRICE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    GuildBossPriceTable.prototype.GetLines = function() {
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
exports.Instance = GuildBossPriceTableInstance;
