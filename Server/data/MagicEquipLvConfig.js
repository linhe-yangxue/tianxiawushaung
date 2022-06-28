
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MagicEquipLvConfig 类为 MagicEquipLvConfigTable 每一行的元素对象
 * */
var MagicEquipLvConfig = (function() {

    /**
    * 构造函数
    */
    function MagicEquipLvConfig() {
        this.INDEX = 0;
        this.LEVEL_UP_EXP_1 = 0;
        this.TOTAL_EXP_1 = 0;
        this.LEVEL_UP_EXP_2 = 0;
        this.TOTAL_EXP_2 = 0;
        this.LEVEL_UP_EXP_3 = 0;
        this.TOTAL_EXP_3 = 0;
        this.LEVEL_UP_EXP_4 = 0;
        this.TOTAL_EXP_4 = 0;
        this.LEVEL_UP_EXP_5 = 0;
        this.TOTAL_EXP_5 = 0;
        this.LEVEL_UP_EXP_6 = 0;
        this.TOTAL_EXP_6 = 0;
        this.LEVEL_UP_EXP_7 = 0;
        this.TOTAL_EXP_7 = 0;

    }

    return MagicEquipLvConfig;
})();

/**
 * [当前为生成代码，不可以修改] MagicEquipLvConfig 配置表
 * */
var MagicEquipLvConfigTableInstance = (function() {

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
            _unique = new MagicEquipLvConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MagicEquipLvConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MagicEquipLvConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MagicEquipLvConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.LEVEL_UP_EXP_1 = parseInt(tmpArr[i].LEVEL_UP_EXP_1);
            obj.TOTAL_EXP_1 = parseInt(tmpArr[i].TOTAL_EXP_1);
            obj.LEVEL_UP_EXP_2 = parseInt(tmpArr[i].LEVEL_UP_EXP_2);
            obj.TOTAL_EXP_2 = parseInt(tmpArr[i].TOTAL_EXP_2);
            obj.LEVEL_UP_EXP_3 = parseInt(tmpArr[i].LEVEL_UP_EXP_3);
            obj.TOTAL_EXP_3 = parseInt(tmpArr[i].TOTAL_EXP_3);
            obj.LEVEL_UP_EXP_4 = parseInt(tmpArr[i].LEVEL_UP_EXP_4);
            obj.TOTAL_EXP_4 = parseInt(tmpArr[i].TOTAL_EXP_4);
            obj.LEVEL_UP_EXP_5 = parseInt(tmpArr[i].LEVEL_UP_EXP_5);
            obj.TOTAL_EXP_5 = parseInt(tmpArr[i].TOTAL_EXP_5);
            obj.LEVEL_UP_EXP_6 = parseInt(tmpArr[i].LEVEL_UP_EXP_6);
            obj.TOTAL_EXP_6 = parseInt(tmpArr[i].TOTAL_EXP_6);
            obj.LEVEL_UP_EXP_7 = parseInt(tmpArr[i].LEVEL_UP_EXP_7);
            obj.TOTAL_EXP_7 = parseInt(tmpArr[i].TOTAL_EXP_7);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MagicEquipLvConfigTable.prototype.GetLines = function() {
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
exports.Instance = MagicEquipLvConfigTableInstance;
