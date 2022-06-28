
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PetRecoverConfig 类为 PetRecoverConfigTable 每一行的元素对象
 * */
var PetRecoverConfig = (function() {

    /**
    * 构造函数
    */
    function PetRecoverConfig() {
        this.INDEX = 0;
        this.PET_GHOST = 0;
        this.MONEY = 0;

    }

    return PetRecoverConfig;
})();

/**
 * [当前为生成代码，不可以修改] PetRecoverConfig 配置表
 * */
var PetRecoverConfigTableInstance = (function() {

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
            _unique = new PetRecoverConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PetRecoverConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PetRecoverConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PetRecoverConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.PET_GHOST = parseInt(tmpArr[i].PET_GHOST);
            obj.MONEY = parseInt(tmpArr[i].MONEY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PetRecoverConfigTable.prototype.GetLines = function() {
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
exports.Instance = PetRecoverConfigTableInstance;
