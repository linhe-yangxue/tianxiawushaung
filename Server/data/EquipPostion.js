
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EquipPostion 类为 EquipPostionTable 每一行的元素对象
 * */
var EquipPostion = (function() {

    /**
    * 构造函数
    */
    function EquipPostion() {
        this.INDEX = 0;
        this.TYPE = 0;
        this.INDEX_NUM = 0;
        this.ITEM_ID = 0;

    }

    return EquipPostion;
})();

/**
 * [当前为生成代码，不可以修改] EquipPostion 配置表
 * */
var EquipPostionTableInstance = (function() {

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
            _unique = new EquipPostionTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EquipPostionTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EquipPostion');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EquipPostion();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.INDEX_NUM = parseInt(tmpArr[i].INDEX_NUM);
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EquipPostionTable.prototype.GetLines = function() {
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
exports.Instance = EquipPostionTableInstance;
