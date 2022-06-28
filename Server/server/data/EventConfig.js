
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EventConfig 类为 EventConfigTable 每一行的元素对象
 * */
var EventConfig = (function() {

    /**
    * 构造函数
    */
    function EventConfig() {
        this.INDEX = 0;
        this.LIST_ID = 0;
        this.STAGE_ID = 0;
        this.STAGETYPE = 0;
        this.EVENTIMG = '';
        this.EVENTBARIMG = '';
        this.STAGEDIFFICULTY = 0;
        this.DESC = '';

    }

    return EventConfig;
})();

/**
 * [当前为生成代码，不可以修改] EventConfig 配置表
 * */
var EventConfigTableInstance = (function() {

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
            _unique = new EventConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EventConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EventConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EventConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.LIST_ID = parseInt(tmpArr[i].LIST_ID);
            obj.STAGE_ID = parseInt(tmpArr[i].STAGE_ID);
            obj.STAGETYPE = parseInt(tmpArr[i].STAGETYPE);
            obj.EVENTIMG = tmpArr[i].EVENTIMG;
            obj.EVENTBARIMG = tmpArr[i].EVENTBARIMG;
            obj.STAGEDIFFICULTY = parseInt(tmpArr[i].STAGEDIFFICULTY);
            obj.DESC = tmpArr[i].DESC;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EventConfigTable.prototype.GetLines = function() {
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
exports.Instance = EventConfigTableInstance;
