
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] GuildCreated 类为 GuildCreatedTable 每一行的元素对象
 * */
var GuildCreated = (function() {

    /**
    * 构造函数
    */
    function GuildCreated() {
        this.INDEX = 0;
        this.EXP = 0;
        this.NUMBRE_LIMIT = 0;
        this.VICE_NUMBRE = 0;

    }

    return GuildCreated;
})();

/**
 * [当前为生成代码，不可以修改] GuildCreated 配置表
 * */
var GuildCreatedTableInstance = (function() {

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
            _unique = new GuildCreatedTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function GuildCreatedTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('GuildCreated');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new GuildCreated();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.EXP = parseInt(tmpArr[i].EXP);
            obj.NUMBRE_LIMIT = parseInt(tmpArr[i].NUMBRE_LIMIT);
            obj.VICE_NUMBRE = parseInt(tmpArr[i].VICE_NUMBRE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    GuildCreatedTable.prototype.GetLines = function() {
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
exports.Instance = GuildCreatedTableInstance;
