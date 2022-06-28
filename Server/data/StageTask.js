
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StageTask 类为 StageTaskTable 每一行的元素对象
 * */
var StageTask = (function() {

    /**
    * 构造函数
    */
    function StageTask() {
        this.INDEX = 0;
        this.TYPE = 0;
        this.POINTID = 0;
        this.FRONT_INDEX = 0;
        this.AFTER_INDEX = 0;
        this.NAME = '';
        this.DESC = '';
        this.GOALDESC = '';
        this.ICON_ATLAS = '';
        this.ICON_NAME = '';
        this.REWARD = '';
        this.TASK_SHOW_LVMIN = 0;
        this.TASK_SHOW_LVMAX = 0;

    }

    return StageTask;
})();

/**
 * [当前为生成代码，不可以修改] StageTask 配置表
 * */
var StageTaskTableInstance = (function() {

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
            _unique = new StageTaskTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StageTaskTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StageTask');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StageTask();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.POINTID = parseInt(tmpArr[i].POINTID);
            obj.FRONT_INDEX = parseInt(tmpArr[i].FRONT_INDEX);
            obj.AFTER_INDEX = parseInt(tmpArr[i].AFTER_INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.DESC = tmpArr[i].DESC;
            obj.GOALDESC = tmpArr[i].GOALDESC;
            obj.ICON_ATLAS = tmpArr[i].ICON_ATLAS;
            obj.ICON_NAME = tmpArr[i].ICON_NAME;
            obj.REWARD = tmpArr[i].REWARD;
            obj.TASK_SHOW_LVMIN = parseInt(tmpArr[i].TASK_SHOW_LVMIN);
            obj.TASK_SHOW_LVMAX = parseInt(tmpArr[i].TASK_SHOW_LVMAX);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StageTaskTable.prototype.GetLines = function() {
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
exports.Instance = StageTaskTableInstance;
