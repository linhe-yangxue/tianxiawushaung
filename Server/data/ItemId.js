
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ItemId 类为 ItemIdTable 每一行的元素对象
 * */
var ItemId = (function() {

    /**
    * 构造函数
    */
    function ItemId() {
        this.ID = 0;
        this.TYPE = '';

    }

    return ItemId;
})();

/**
 * [当前为生成代码，不可以修改] ItemId 配置表
 * */
var ItemIdTableInstance = (function() {

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
            _unique = new ItemIdTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ItemIdTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ItemId');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ItemId();
            obj.ID = parseInt(tmpArr[i].ID);
            obj.TYPE = tmpArr[i].TYPE;

            _lines[tmpArr[i].ID] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ItemIdTable.prototype.GetLines = function() {
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
exports.Instance = ItemIdTableInstance;
