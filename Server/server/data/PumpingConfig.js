
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PumpingConfig 类为 PumpingConfigTable 每一行的元素对象
 * */
var PumpingConfig = (function() {

    /**
    * 构造函数
    */
    function PumpingConfig() {
        this.INDEX = 0;
        this.ITEM_NAME = '';
        this.TYPE = 0;
        this.GET_MONEY = 0;
        this.PUMPING_PRICE_1 = 0;
        this.PUMPING_PRICE_2 = 0;
        this.PUMPING_PRICE_3 = 0;
        this.PUMPING_MULTIPLE = 0;
        this.PUMPING_NUMBER = 0;
        this.FREE_NUMBER = 0;
        this.RESTORE_TIME = 0;
        this.FREE_INT = 0;
        this.REFRESH_BYDAY = 0;
        this.GROUP_ID = '';
        this.SHOW_GROUP_ID = 0;
        this.LEVEL_MIN = 0;
        this.LEVEL_MAX = 0;

    }

    return PumpingConfig;
})();

/**
 * [当前为生成代码，不可以修改] PumpingConfig 配置表
 * */
var PumpingConfigTableInstance = (function() {

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
            _unique = new PumpingConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PumpingConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PumpingConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PumpingConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ITEM_NAME = tmpArr[i].ITEM_NAME;
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.GET_MONEY = parseInt(tmpArr[i].GET_MONEY);
            obj.PUMPING_PRICE_1 = parseInt(tmpArr[i].PUMPING_PRICE_1);
            obj.PUMPING_PRICE_2 = parseInt(tmpArr[i].PUMPING_PRICE_2);
            obj.PUMPING_PRICE_3 = parseInt(tmpArr[i].PUMPING_PRICE_3);
            obj.PUMPING_MULTIPLE = parseInt(tmpArr[i].PUMPING_MULTIPLE);
            obj.PUMPING_NUMBER = parseInt(tmpArr[i].PUMPING_NUMBER);
            obj.FREE_NUMBER = parseInt(tmpArr[i].FREE_NUMBER);
            obj.RESTORE_TIME = parseInt(tmpArr[i].RESTORE_TIME);
            obj.FREE_INT = parseInt(tmpArr[i].FREE_INT);
            obj.REFRESH_BYDAY = parseInt(tmpArr[i].REFRESH_BYDAY);
            obj.GROUP_ID = tmpArr[i].GROUP_ID;
            obj.SHOW_GROUP_ID = parseInt(tmpArr[i].SHOW_GROUP_ID);
            obj.LEVEL_MIN = parseInt(tmpArr[i].LEVEL_MIN);
            obj.LEVEL_MAX = parseInt(tmpArr[i].LEVEL_MAX);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PumpingConfigTable.prototype.GetLines = function() {
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
exports.Instance = PumpingConfigTableInstance;
