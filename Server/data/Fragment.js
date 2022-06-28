
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Fragment 类为 FragmentTable 每一行的元素对象
 * */
var Fragment = (function() {

    /**
    * 构造函数
    */
    function Fragment() {
        this.INDEX = 0;
        this.NAME = '';
        this.DESCRIPTION = '';
        this.COST_NUM = 0;
        this.ITEM_ID = 0;
        this.SELL_PRICE = '';

    }

    return Fragment;
})();

/**
 * [当前为生成代码，不可以修改] Fragment 配置表
 * */
var FragmentTableInstance = (function() {

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
            _unique = new FragmentTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FragmentTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Fragment');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Fragment();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.DESCRIPTION = tmpArr[i].DESCRIPTION;
            obj.COST_NUM = parseInt(tmpArr[i].COST_NUM);
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.SELL_PRICE = tmpArr[i].SELL_PRICE;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FragmentTable.prototype.GetLines = function() {
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
exports.Instance = FragmentTableInstance;
