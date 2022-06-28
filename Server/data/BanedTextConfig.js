
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BanedTextConfig 类为 BanedTextConfigTable 每一行的元素对象
 * */
var BanedTextConfig = (function() {

    /**
    * 构造函数
    */
    function BanedTextConfig() {
        this.INDEX = 0;
        this.BANEDLIST = '';

    }

    return BanedTextConfig;
})();

/**
 * [当前为生成代码，不可以修改] BanedTextConfig 配置表
 * */
var BanedTextConfigTableInstance = (function() {

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
            _unique = new BanedTextConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BanedTextConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BanedTextConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BanedTextConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.BANEDLIST = tmpArr[i].BANEDLIST;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BanedTextConfigTable.prototype.GetLines = function() {
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
exports.Instance = BanedTextConfigTableInstance;
