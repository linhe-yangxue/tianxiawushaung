
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ServerStatus 类为 ServerStatusTable 每一行的元素对象
 * */
var ServerStatus = (function() {

    /**
    * 构造函数
    */
    function ServerStatus() {
        this.INDEX = 0;
        this.PLAYER_NUM = 0;
        this.Server_NUM = 0;

    }

    return ServerStatus;
})();

/**
 * [当前为生成代码，不可以修改] ServerStatus 配置表
 * */
var ServerStatusTableInstance = (function() {

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
            _unique = new ServerStatusTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ServerStatusTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ServerStatus');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ServerStatus();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.PLAYER_NUM = parseInt(tmpArr[i].PLAYER_NUM);
            obj.Server_NUM = parseInt(tmpArr[i].Server_NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ServerStatusTable.prototype.GetLines = function() {
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
exports.Instance = ServerStatusTableInstance;
