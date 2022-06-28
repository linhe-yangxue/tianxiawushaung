
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] LimitTimeSale 类为 LimitTimeSaleTable 每一行的元素对象
 * */
var LimitTimeSale = (function() {

    /**
    * 构造函数
    */
    function LimitTimeSale() {
        this.INDEX = 0;
        this.NAME = '';
        this.DESCRIBE = '';
        this.GroupID = 0;
        this.OLD_COST_TYPE = 0;
        this.OLD_COST_NUM = 0;
        this.NEW_COST_TYPE = 0;
        this.NEW_COST_NUM = 0;
        this.BUY_NUM = 0;
        this.REFRESH_BYDAY = 0;

    }

    return LimitTimeSale;
})();

/**
 * [当前为生成代码，不可以修改] LimitTimeSale 配置表
 * */
var LimitTimeSaleTableInstance = (function() {

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
            _unique = new LimitTimeSaleTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function LimitTimeSaleTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('LimitTimeSale');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new LimitTimeSale();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.DESCRIBE = tmpArr[i].DESCRIBE;
            obj.GroupID = parseInt(tmpArr[i].GroupID);
            obj.OLD_COST_TYPE = parseInt(tmpArr[i].OLD_COST_TYPE);
            obj.OLD_COST_NUM = parseInt(tmpArr[i].OLD_COST_NUM);
            obj.NEW_COST_TYPE = parseInt(tmpArr[i].NEW_COST_TYPE);
            obj.NEW_COST_NUM = parseInt(tmpArr[i].NEW_COST_NUM);
            obj.BUY_NUM = parseInt(tmpArr[i].BUY_NUM);
            obj.REFRESH_BYDAY = parseInt(tmpArr[i].REFRESH_BYDAY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    LimitTimeSaleTable.prototype.GetLines = function() {
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
exports.Instance = LimitTimeSaleTableInstance;
