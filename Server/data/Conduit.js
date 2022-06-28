
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Conduit 类为 ConduitTable 每一行的元素对象
 * */
var Conduit = (function() {

    /**
    * 构造函数
    */
    function Conduit() {
        this.CONDUIT_ID = 0;
        this.CONDUIT_NAME = '';
        this.CONDUIT_PROPORTION = 0;
        this.CONDUIT_MONEY = '';

    }

    return Conduit;
})();

/**
 * [当前为生成代码，不可以修改] Conduit 配置表
 * */
var ConduitTableInstance = (function() {

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
            _unique = new ConduitTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ConduitTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Conduit');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Conduit();
            obj.CONDUIT_ID = parseInt(tmpArr[i].CONDUIT_ID);
            obj.CONDUIT_NAME = tmpArr[i].CONDUIT_NAME;
            obj.CONDUIT_PROPORTION = parseFloat(tmpArr[i].CONDUIT_PROPORTION);
            obj.CONDUIT_MONEY = tmpArr[i].CONDUIT_MONEY;

            _lines[tmpArr[i].CONDUIT_ID] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ConduitTable.prototype.GetLines = function() {
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
exports.Instance = ConduitTableInstance;
