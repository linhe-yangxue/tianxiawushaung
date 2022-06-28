
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SelPetUIConfig 类为 SelPetUIConfigTable 每一行的元素对象
 * */
var SelPetUIConfig = (function() {

    /**
    * 构造函数
    */
    function SelPetUIConfig() {
        this.INDEX = 0;
        this.MODEL = 0;
        this.RECOMMEND = 0;

    }

    return SelPetUIConfig;
})();

/**
 * [当前为生成代码，不可以修改] SelPetUIConfig 配置表
 * */
var SelPetUIConfigTableInstance = (function() {

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
            _unique = new SelPetUIConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SelPetUIConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SelPetUIConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SelPetUIConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.MODEL = parseInt(tmpArr[i].MODEL);
            obj.RECOMMEND = parseInt(tmpArr[i].RECOMMEND);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SelPetUIConfigTable.prototype.GetLines = function() {
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
exports.Instance = SelPetUIConfigTableInstance;
