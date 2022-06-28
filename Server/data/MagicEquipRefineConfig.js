
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MagicEquipRefineConfig 类为 MagicEquipRefineConfigTable 每一行的元素对象
 * */
var MagicEquipRefineConfig = (function() {

    /**
    * 构造函数
    */
    function MagicEquipRefineConfig() {
        this.INDEX = 0;
        this.REFINESTONE_NUM = 0;
        this.TOTAL_REFINESTONE_NUM = 0;
        this.REFINE_EQUIP_NUM = 0;
        this.TOTAL_REFINE_EQUIP_NUM = 0;
        this.REFINE_EQUIP_MONEY = 0;
        this.TOTAL_REFINE_EQUIP_MONEY = 0;

    }

    return MagicEquipRefineConfig;
})();

/**
 * [当前为生成代码，不可以修改] MagicEquipRefineConfig 配置表
 * */
var MagicEquipRefineConfigTableInstance = (function() {

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
            _unique = new MagicEquipRefineConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MagicEquipRefineConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MagicEquipRefineConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MagicEquipRefineConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.REFINESTONE_NUM = parseInt(tmpArr[i].REFINESTONE_NUM);
            obj.TOTAL_REFINESTONE_NUM = parseInt(tmpArr[i].TOTAL_REFINESTONE_NUM);
            obj.REFINE_EQUIP_NUM = parseInt(tmpArr[i].REFINE_EQUIP_NUM);
            obj.TOTAL_REFINE_EQUIP_NUM = parseInt(tmpArr[i].TOTAL_REFINE_EQUIP_NUM);
            obj.REFINE_EQUIP_MONEY = parseInt(tmpArr[i].REFINE_EQUIP_MONEY);
            obj.TOTAL_REFINE_EQUIP_MONEY = parseInt(tmpArr[i].TOTAL_REFINE_EQUIP_MONEY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MagicEquipRefineConfigTable.prototype.GetLines = function() {
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
exports.Instance = MagicEquipRefineConfigTableInstance;
