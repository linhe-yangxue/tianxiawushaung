
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PetType 类为 PetTypeTable 每一行的元素对象
 * */
var PetType = (function() {

    /**
    * 构造函数
    */
    function PetType() {
        this.INDEX = 0;
        this.NAME = '';
        this.TPYE_ATLAS_NAME = '';
        this.TYPE_SPRITE_NAME = '';

    }

    return PetType;
})();

/**
 * [当前为生成代码，不可以修改] PetType 配置表
 * */
var PetTypeTableInstance = (function() {

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
            _unique = new PetTypeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PetTypeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PetType');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PetType();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TPYE_ATLAS_NAME = tmpArr[i].TPYE_ATLAS_NAME;
            obj.TYPE_SPRITE_NAME = tmpArr[i].TYPE_SPRITE_NAME;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PetTypeTable.prototype.GetLines = function() {
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
exports.Instance = PetTypeTableInstance;
