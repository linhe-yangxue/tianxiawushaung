
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FairyladCost 类为 FairyladCostTable 每一行的元素对象
 * */
var FairyladCost = (function() {

    /**
    * 构造函数
    */
    function FairyladCost() {
        this.INDEX = 0;
        this.VIP_LEVEL = 0;
        this.EXPLOR_ITEM_ID = 0;
        this.EXPLOR_ITEM_NUM = 0;
        this.REWARD_TIME = 0;
        this.DESC = '';

    }

    return FairyladCost;
})();

/**
 * [当前为生成代码，不可以修改] FairyladCost 配置表
 * */
var FairyladCostTableInstance = (function() {

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
            _unique = new FairyladCostTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FairyladCostTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FairyladCost');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FairyladCost();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.VIP_LEVEL = parseInt(tmpArr[i].VIP_LEVEL);
            obj.EXPLOR_ITEM_ID = parseInt(tmpArr[i].EXPLOR_ITEM_ID);
            obj.EXPLOR_ITEM_NUM = parseInt(tmpArr[i].EXPLOR_ITEM_NUM);
            obj.REWARD_TIME = parseInt(tmpArr[i].REWARD_TIME);
            obj.DESC = tmpArr[i].DESC;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FairyladCostTable.prototype.GetLines = function() {
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
exports.Instance = FairyladCostTableInstance;
