
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EquipAttributeIconConfig 类为 EquipAttributeIconConfigTable 每一行的元素对象
 * */
var EquipAttributeIconConfig = (function() {

    /**
    * 构造函数
    */
    function EquipAttributeIconConfig() {
        this.INDEX = 0;
        this.NAME = '';
        this.TXT = '';
        this.ATTRIBUTE_BATTLE = 0;
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.NAME_EN = '';

    }

    return EquipAttributeIconConfig;
})();

/**
 * [当前为生成代码，不可以修改] EquipAttributeIconConfig 配置表
 * */
var EquipAttributeIconConfigTableInstance = (function() {

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
            _unique = new EquipAttributeIconConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EquipAttributeIconConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EquipAttributeIconConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EquipAttributeIconConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TXT = tmpArr[i].TXT;
            obj.ATTRIBUTE_BATTLE = parseFloat(tmpArr[i].ATTRIBUTE_BATTLE);
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.NAME_EN = tmpArr[i].NAME_EN;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EquipAttributeIconConfigTable.prototype.GetLines = function() {
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
exports.Instance = EquipAttributeIconConfigTableInstance;
