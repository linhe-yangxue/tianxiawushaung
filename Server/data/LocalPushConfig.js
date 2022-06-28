
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] LocalPushConfig 类为 LocalPushConfigTable 每一行的元素对象
 * */
var LocalPushConfig = (function() {

    /**
    * 构造函数
    */
    function LocalPushConfig() {
        this.ID = 0;
        this.PUSH_ID = 0;
        this.PUSH_TITLE = '';
        this.PUSH_INFO = '';
        this.PUSH_TICKER = '';
        this.PUSH_ALERT_DATE = '';

    }

    return LocalPushConfig;
})();

/**
 * [当前为生成代码，不可以修改] LocalPushConfig 配置表
 * */
var LocalPushConfigTableInstance = (function() {

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
            _unique = new LocalPushConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function LocalPushConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('LocalPushConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new LocalPushConfig();
            obj.ID = parseInt(tmpArr[i].ID);
            obj.PUSH_ID = parseInt(tmpArr[i].PUSH_ID);
            obj.PUSH_TITLE = tmpArr[i].PUSH_TITLE;
            obj.PUSH_INFO = tmpArr[i].PUSH_INFO;
            obj.PUSH_TICKER = tmpArr[i].PUSH_TICKER;
            obj.PUSH_ALERT_DATE = tmpArr[i].PUSH_ALERT_DATE;

            _lines[tmpArr[i].ID] = obj;

        }
    }

    /**
    * 获取行队列
    */
    LocalPushConfigTable.prototype.GetLines = function() {
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
exports.Instance = LocalPushConfigTableInstance;
