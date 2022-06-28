
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EquipRecoverConfig 类为 EquipRecoverConfigTable 每一行的元素对象
 * */
var EquipRecoverConfig = (function() {

    /**
    * 构造函数
    */
    function EquipRecoverConfig() {
        this.INDEX = 0;
        this.EQUIP_TOKEN = 0;
        this.MONEY = 0;

    }

    return EquipRecoverConfig;
})();

/**
 * [当前为生成代码，不可以修改] EquipRecoverConfig 配置表
 * */
var EquipRecoverConfigTableInstance = (function() {

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
            _unique = new EquipRecoverConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EquipRecoverConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EquipRecoverConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EquipRecoverConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.EQUIP_TOKEN = parseInt(tmpArr[i].EQUIP_TOKEN);
            obj.MONEY = parseInt(tmpArr[i].MONEY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EquipRecoverConfigTable.prototype.GetLines = function() {
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
exports.Instance = EquipRecoverConfigTableInstance;
