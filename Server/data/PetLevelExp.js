
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PetLevelExp 类为 PetLevelExpTable 每一行的元素对象
 * */
var PetLevelExp = (function() {

    /**
    * 构造函数
    */
    function PetLevelExp() {
        this.INDEX = 0;
        this.NEED_EXP_QUALITY_1 = 0;
        this.TOTAL_EXP_1 = 0;
        this.NEED_EXP_QUALITY_2 = 0;
        this.TOTAL_EXP_2 = 0;
        this.NEED_EXP_QUALITY_3 = 0;
        this.TOTAL_EXP_3 = 0;
        this.NEED_EXP_QUALITY_4 = 0;
        this.TOTAL_EXP_4 = 0;
        this.NEED_EXP_QUALITY_5 = 0;
        this.TOTAL_EXP_5 = 0;
        this.NEED_EXP_QUALITY_6 = 0;
        this.TOTAL_EXP_6 = 0;
        this.NEED_EXP_QUALITY_7 = 0;
        this.TOTAL_EXP_7 = 0;

    }

    return PetLevelExp;
})();

/**
 * [当前为生成代码，不可以修改] PetLevelExp 配置表
 * */
var PetLevelExpTableInstance = (function() {

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
            _unique = new PetLevelExpTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PetLevelExpTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PetLevelExp');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PetLevelExp();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NEED_EXP_QUALITY_1 = parseInt(tmpArr[i].NEED_EXP_QUALITY_1);
            obj.TOTAL_EXP_1 = parseInt(tmpArr[i].TOTAL_EXP_1);
            obj.NEED_EXP_QUALITY_2 = parseInt(tmpArr[i].NEED_EXP_QUALITY_2);
            obj.TOTAL_EXP_2 = parseInt(tmpArr[i].TOTAL_EXP_2);
            obj.NEED_EXP_QUALITY_3 = parseInt(tmpArr[i].NEED_EXP_QUALITY_3);
            obj.TOTAL_EXP_3 = parseInt(tmpArr[i].TOTAL_EXP_3);
            obj.NEED_EXP_QUALITY_4 = parseInt(tmpArr[i].NEED_EXP_QUALITY_4);
            obj.TOTAL_EXP_4 = parseInt(tmpArr[i].TOTAL_EXP_4);
            obj.NEED_EXP_QUALITY_5 = parseInt(tmpArr[i].NEED_EXP_QUALITY_5);
            obj.TOTAL_EXP_5 = parseInt(tmpArr[i].TOTAL_EXP_5);
            obj.NEED_EXP_QUALITY_6 = parseInt(tmpArr[i].NEED_EXP_QUALITY_6);
            obj.TOTAL_EXP_6 = parseInt(tmpArr[i].TOTAL_EXP_6);
            obj.NEED_EXP_QUALITY_7 = parseInt(tmpArr[i].NEED_EXP_QUALITY_7);
            obj.TOTAL_EXP_7 = parseInt(tmpArr[i].TOTAL_EXP_7);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PetLevelExpTable.prototype.GetLines = function() {
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
exports.Instance = PetLevelExpTableInstance;
