
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PetPostionLevel 类为 PetPostionLevelTable 每一行的元素对象
 * */
var PetPostionLevel = (function() {

    /**
    * 构造函数
    */
    function PetPostionLevel() {
        this.INDEX = 0;
        this.OPEN_LEVEL = 0;

    }

    return PetPostionLevel;
})();

/**
 * [当前为生成代码，不可以修改] PetPostionLevel 配置表
 * */
var PetPostionLevelTableInstance = (function() {

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
            _unique = new PetPostionLevelTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PetPostionLevelTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PetPostionLevel');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PetPostionLevel();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.OPEN_LEVEL = parseInt(tmpArr[i].OPEN_LEVEL);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PetPostionLevelTable.prototype.GetLines = function() {
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
exports.Instance = PetPostionLevelTableInstance;
