
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] OperateEvent 类为 OperateEventTable 每一行的元素对象
 * */
var OperateEvent = (function() {

    /**
    * 构造函数
    */
    function OperateEvent() {
        this.INDEX = 0;
        this.EVENT_TYPE = 0;
        this.TITLE = '';
        this.RESOURCE_ATLAS = '';
        this.SPRITE_NAME = '';
        this.WEIGHT = 0;

    }

    return OperateEvent;
})();

/**
 * [当前为生成代码，不可以修改] OperateEvent 配置表
 * */
var OperateEventTableInstance = (function() {

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
            _unique = new OperateEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function OperateEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('OperateEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new OperateEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.EVENT_TYPE = parseInt(tmpArr[i].EVENT_TYPE);
            obj.TITLE = tmpArr[i].TITLE;
            obj.RESOURCE_ATLAS = tmpArr[i].RESOURCE_ATLAS;
            obj.SPRITE_NAME = tmpArr[i].SPRITE_NAME;
            obj.WEIGHT = parseInt(tmpArr[i].WEIGHT);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    OperateEventTable.prototype.GetLines = function() {
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
exports.Instance = OperateEventTableInstance;
