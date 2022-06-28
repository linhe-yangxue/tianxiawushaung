
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ChargeConfig 类为 ChargeConfigTable 每一行的元素对象
 * */
var ChargeConfig = (function() {

    /**
    * 构造函数
    */
    function ChargeConfig() {
        this.INDEX = 0;
        this.IS_CARD = 0;
        this.PRICE = 0;
        this.PROPORTION = 0;
        this.FIRST_CHARGE_REWARD1 = '';
        this.NAME = '';
        this.REWARD_BUY = '';
        this.REWARD_SEND = '';
        this.TIME = 0;
        this.DAILY_REWARD = '';

    }

    return ChargeConfig;
})();

/**
 * [当前为生成代码，不可以修改] ChargeConfig 配置表
 * */
var ChargeConfigTableInstance = (function() {

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
            _unique = new ChargeConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ChargeConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ChargeConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ChargeConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.IS_CARD = parseInt(tmpArr[i].IS_CARD);
            obj.PRICE = parseInt(tmpArr[i].PRICE);
            obj.PROPORTION = parseFloat(tmpArr[i].PROPORTION);
            obj.FIRST_CHARGE_REWARD1 = tmpArr[i].FIRST_CHARGE_REWARD1;
            obj.NAME = tmpArr[i].NAME;
            obj.REWARD_BUY = tmpArr[i].REWARD_BUY;
            obj.REWARD_SEND = tmpArr[i].REWARD_SEND;
            obj.TIME = parseInt(tmpArr[i].TIME);
            obj.DAILY_REWARD = tmpArr[i].DAILY_REWARD;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ChargeConfigTable.prototype.GetLines = function() {
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
exports.Instance = ChargeConfigTableInstance;
