
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] RoleEquipConfig 类为 RoleEquipConfigTable 每一行的元素对象
 * */
var RoleEquipConfig = (function() {

    /**
    * 构造函数
    */
    function RoleEquipConfig() {
        this.INDEX = 0;
        this.NAME = '';
        this.DESCRIPTION = '';
        this.EQUIP_TYPE = 0;
        this.QUALITY = 0;
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.ATTRIBUTE_TYPE_0 = 0;
        this.ATTRIBUTE_TYPE_TXT_0 = '';
        this.BASE_ATTRIBUTE_0 = 0;
        this.STRENGTHEN_0 = 0;
        this.ATTRIBUTE_TYPE_1 = 0;
        this.ATTRIBUTE_TYPE_TXT_1 = '';
        this.BASE_ATTRIBUTE_1 = 0;
        this.STRENGTHEN_1 = 0;
        this.REFINE_TYPE_0 = 0;
        this.REFINE_VALUE_0 = 0;
        this.REFINE_TYPE_1 = 0;
        this.REFINE_VALUE_1 = 0;
        this.SUPPLY_EXP = 0;
        this.MAX_GROW_LEVEL = 0;
        this.MAX_REFINE_LEVEL = 0;
        this.ATTACHATTRIBUTE_NUM = 0;
        this.MAX_STRENGTH = 0;
        this.GET_WAY_INDEX = 0;
        this.SELL_PRICE = '';

    }

    return RoleEquipConfig;
})();

/**
 * [当前为生成代码，不可以修改] RoleEquipConfig 配置表
 * */
var RoleEquipConfigTableInstance = (function() {

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
            _unique = new RoleEquipConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function RoleEquipConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('RoleEquipConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new RoleEquipConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.DESCRIPTION = tmpArr[i].DESCRIPTION;
            obj.EQUIP_TYPE = parseInt(tmpArr[i].EQUIP_TYPE);
            obj.QUALITY = parseInt(tmpArr[i].QUALITY);
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.ATTRIBUTE_TYPE_0 = parseInt(tmpArr[i].ATTRIBUTE_TYPE_0);
            obj.ATTRIBUTE_TYPE_TXT_0 = tmpArr[i].ATTRIBUTE_TYPE_TXT_0;
            obj.BASE_ATTRIBUTE_0 = parseInt(tmpArr[i].BASE_ATTRIBUTE_0);
            obj.STRENGTHEN_0 = parseInt(tmpArr[i].STRENGTHEN_0);
            obj.ATTRIBUTE_TYPE_1 = parseInt(tmpArr[i].ATTRIBUTE_TYPE_1);
            obj.ATTRIBUTE_TYPE_TXT_1 = tmpArr[i].ATTRIBUTE_TYPE_TXT_1;
            obj.BASE_ATTRIBUTE_1 = parseInt(tmpArr[i].BASE_ATTRIBUTE_1);
            obj.STRENGTHEN_1 = parseInt(tmpArr[i].STRENGTHEN_1);
            obj.REFINE_TYPE_0 = parseInt(tmpArr[i].REFINE_TYPE_0);
            obj.REFINE_VALUE_0 = parseInt(tmpArr[i].REFINE_VALUE_0);
            obj.REFINE_TYPE_1 = parseInt(tmpArr[i].REFINE_TYPE_1);
            obj.REFINE_VALUE_1 = parseInt(tmpArr[i].REFINE_VALUE_1);
            obj.SUPPLY_EXP = parseInt(tmpArr[i].SUPPLY_EXP);
            obj.MAX_GROW_LEVEL = parseInt(tmpArr[i].MAX_GROW_LEVEL);
            obj.MAX_REFINE_LEVEL = parseInt(tmpArr[i].MAX_REFINE_LEVEL);
            obj.ATTACHATTRIBUTE_NUM = parseInt(tmpArr[i].ATTACHATTRIBUTE_NUM);
            obj.MAX_STRENGTH = parseInt(tmpArr[i].MAX_STRENGTH);
            obj.GET_WAY_INDEX = parseInt(tmpArr[i].GET_WAY_INDEX);
            obj.SELL_PRICE = tmpArr[i].SELL_PRICE;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    RoleEquipConfigTable.prototype.GetLines = function() {
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
exports.Instance = RoleEquipConfigTableInstance;
