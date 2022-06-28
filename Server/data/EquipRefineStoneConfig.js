
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EquipRefineStoneConfig 类为 EquipRefineStoneConfigTable 每一行的元素对象
 * */
var EquipRefineStoneConfig = (function() {

    /**
    * 构造函数
    */
    function EquipRefineStoneConfig() {
        this.INDEX = 0;
        this.REFINE_STONE_NAME = '';
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.REFINE_STONE_EXP = 0;
        this.SPEED = 0;

    }

    return EquipRefineStoneConfig;
})();

/**
 * [当前为生成代码，不可以修改] EquipRefineStoneConfig 配置表
 * */
var EquipRefineStoneConfigTableInstance = (function() {

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
            _unique = new EquipRefineStoneConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EquipRefineStoneConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EquipRefineStoneConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EquipRefineStoneConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.REFINE_STONE_NAME = tmpArr[i].REFINE_STONE_NAME;
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.REFINE_STONE_EXP = parseInt(tmpArr[i].REFINE_STONE_EXP);
            obj.SPEED = parseFloat(tmpArr[i].SPEED);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EquipRefineStoneConfigTable.prototype.GetLines = function() {
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
exports.Instance = EquipRefineStoneConfigTableInstance;
