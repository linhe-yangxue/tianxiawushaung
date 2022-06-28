
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ConfigTable 类为 ConfigTableTable 每一行的元素对象
 * */
var ConfigTable = (function() {

    /**
    * 构造函数
    */
    function ConfigTable() {
        this.INDEXNAME = '';
        this.FILENAME = '';
        this.FILETYPE = '';
        this.INFO = '';

    }

    return ConfigTable;
})();

/**
 * [当前为生成代码，不可以修改] ConfigTable 配置表
 * */
var ConfigTableTableInstance = (function() {

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
            _unique = new ConfigTableTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ConfigTableTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ConfigTable');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ConfigTable();
            obj.INDEXNAME = tmpArr[i].INDEXNAME;
            obj.FILENAME = tmpArr[i].FILENAME;
            obj.FILETYPE = tmpArr[i].FILETYPE;
            obj.INFO = tmpArr[i].INFO;

            _lines[tmpArr[i].INDEXNAME] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ConfigTableTable.prototype.GetLines = function() {
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
exports.Instance = ConfigTableTableInstance;
