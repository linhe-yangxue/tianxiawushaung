
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StrengMaster 类为 StrengMasterTable 每一行的元素对象
 * */
var StrengMaster = (function() {

    /**
    * 构造函数
    */
    function StrengMaster() {
        this.INDEX = 0;
        this.EQUIP_STERNG_LEVEL = 0;
        this.EQUIP_STERNG_BUFF1 = 0;
        this.EQUIP_STERNG_BUFF2 = 0;
        this.EQUIP_STERNG_BUFF3 = 0;
        this.EQUIP_STERNG_BUFF4 = 0;
        this.EQUIP_REFINE_LEVEL = 0;
        this.EQUIP_REFINE_BUFF1 = 0;
        this.EQUIP_REFINE_BUFF2 = 0;
        this.MAGIC_STERNG_LEVEL = 0;
        this.MAGIC_STERNG_BUFF1 = 0;
        this.MAGIC_STERNG_BUFF2 = 0;
        this.MAGIC_STERNG_BUFF3 = 0;
        this.MAGIC_REFINE_LEVEL = 0;
        this.MAGIC_REFINE_BUFF1 = 0;
        this.MAGIC_REFINE_BUFF2 = 0;

    }

    return StrengMaster;
})();

/**
 * [当前为生成代码，不可以修改] StrengMaster 配置表
 * */
var StrengMasterTableInstance = (function() {

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
            _unique = new StrengMasterTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StrengMasterTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StrengMaster');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StrengMaster();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.EQUIP_STERNG_LEVEL = parseInt(tmpArr[i].EQUIP_STERNG_LEVEL);
            obj.EQUIP_STERNG_BUFF1 = parseInt(tmpArr[i].EQUIP_STERNG_BUFF1);
            obj.EQUIP_STERNG_BUFF2 = parseInt(tmpArr[i].EQUIP_STERNG_BUFF2);
            obj.EQUIP_STERNG_BUFF3 = parseInt(tmpArr[i].EQUIP_STERNG_BUFF3);
            obj.EQUIP_STERNG_BUFF4 = parseInt(tmpArr[i].EQUIP_STERNG_BUFF4);
            obj.EQUIP_REFINE_LEVEL = parseInt(tmpArr[i].EQUIP_REFINE_LEVEL);
            obj.EQUIP_REFINE_BUFF1 = parseInt(tmpArr[i].EQUIP_REFINE_BUFF1);
            obj.EQUIP_REFINE_BUFF2 = parseInt(tmpArr[i].EQUIP_REFINE_BUFF2);
            obj.MAGIC_STERNG_LEVEL = parseInt(tmpArr[i].MAGIC_STERNG_LEVEL);
            obj.MAGIC_STERNG_BUFF1 = parseInt(tmpArr[i].MAGIC_STERNG_BUFF1);
            obj.MAGIC_STERNG_BUFF2 = parseInt(tmpArr[i].MAGIC_STERNG_BUFF2);
            obj.MAGIC_STERNG_BUFF3 = parseInt(tmpArr[i].MAGIC_STERNG_BUFF3);
            obj.MAGIC_REFINE_LEVEL = parseInt(tmpArr[i].MAGIC_REFINE_LEVEL);
            obj.MAGIC_REFINE_BUFF1 = parseInt(tmpArr[i].MAGIC_REFINE_BUFF1);
            obj.MAGIC_REFINE_BUFF2 = parseInt(tmpArr[i].MAGIC_REFINE_BUFF2);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StrengMasterTable.prototype.GetLines = function() {
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
exports.Instance = StrengMasterTableInstance;
