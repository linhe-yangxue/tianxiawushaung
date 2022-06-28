
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] TipiconConfig 类为 TipiconConfigTable 每一行的元素对象
 * */
var TipiconConfig = (function() {

    /**
    * 构造函数
    */
    function TipiconConfig() {
        this.INDEX = 0;
        this.TIPICON_NAME = '';
        this.TIPICON_ATLAS_NAME = '';
        this.TIPICON_SPRITE_NAME = '';

    }

    return TipiconConfig;
})();

/**
 * [当前为生成代码，不可以修改] TipiconConfig 配置表
 * */
var TipiconConfigTableInstance = (function() {

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
            _unique = new TipiconConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function TipiconConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('TipiconConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new TipiconConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TIPICON_NAME = tmpArr[i].TIPICON_NAME;
            obj.TIPICON_ATLAS_NAME = tmpArr[i].TIPICON_ATLAS_NAME;
            obj.TIPICON_SPRITE_NAME = tmpArr[i].TIPICON_SPRITE_NAME;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    TipiconConfigTable.prototype.GetLines = function() {
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
exports.Instance = TipiconConfigTableInstance;
