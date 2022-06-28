
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SetEquipConfig 类为 SetEquipConfigTable 每一行的元素对象
 * */
var SetEquipConfig = (function() {

    /**
    * 构造函数
    */
    function SetEquipConfig() {
        this.INDEX = 0;
        this.SET_NAME = '';
        this.SET_EQUIP_0 = 0;
        this.SET_EQUIP_1 = 0;
        this.SET_EQUIP_2 = 0;
        this.SET_EQUIP_3 = 0;
        this.SET2_BUFF_ID_1 = 0;
        this.SET2_BUFF_ID_2 = 0;
        this.SET3_BUFF_ID_1 = 0;
        this.SET3_BUFF_ID_2 = 0;
        this.SET3_BUFF_ID_3 = 0;
        this.SET4_BUFF_ID_1 = 0;
        this.SET4_BUFF_ID_2 = 0;
        this.SET4_BUFF_ID_3 = 0;

    }

    return SetEquipConfig;
})();

/**
 * [当前为生成代码，不可以修改] SetEquipConfig 配置表
 * */
var SetEquipConfigTableInstance = (function() {

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
            _unique = new SetEquipConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SetEquipConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SetEquipConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SetEquipConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.SET_NAME = tmpArr[i].SET_NAME;
            obj.SET_EQUIP_0 = parseInt(tmpArr[i].SET_EQUIP_0);
            obj.SET_EQUIP_1 = parseInt(tmpArr[i].SET_EQUIP_1);
            obj.SET_EQUIP_2 = parseInt(tmpArr[i].SET_EQUIP_2);
            obj.SET_EQUIP_3 = parseInt(tmpArr[i].SET_EQUIP_3);
            obj.SET2_BUFF_ID_1 = parseInt(tmpArr[i].SET2_BUFF_ID_1);
            obj.SET2_BUFF_ID_2 = parseInt(tmpArr[i].SET2_BUFF_ID_2);
            obj.SET3_BUFF_ID_1 = parseInt(tmpArr[i].SET3_BUFF_ID_1);
            obj.SET3_BUFF_ID_2 = parseInt(tmpArr[i].SET3_BUFF_ID_2);
            obj.SET3_BUFF_ID_3 = parseInt(tmpArr[i].SET3_BUFF_ID_3);
            obj.SET4_BUFF_ID_1 = parseInt(tmpArr[i].SET4_BUFF_ID_1);
            obj.SET4_BUFF_ID_2 = parseInt(tmpArr[i].SET4_BUFF_ID_2);
            obj.SET4_BUFF_ID_3 = parseInt(tmpArr[i].SET4_BUFF_ID_3);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SetEquipConfigTable.prototype.GetLines = function() {
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
exports.Instance = SetEquipConfigTableInstance;
