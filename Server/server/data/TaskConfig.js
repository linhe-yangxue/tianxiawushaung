
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] TaskConfig 类为 TaskConfigTable 每一行的元素对象
 * */
var TaskConfig = (function() {

    /**
    * 构造函数
    */
    function TaskConfig() {
        this.INDX = 0;
        this.TYPE = 0;
        this.TASK_NAME = '';
        this.AWARD_TIP = '';
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.TASK_SHOW_LVMIN = 0;
        this.TASK_SHOW_LVMAX = 0;
        this.GATES_TYPE = 0;
        this.NUM = 0;
        this.LEVEL = 0;
        this.AWARD_ITEM = '';
        this.SCORE_NUM = 0;
        this.ID = 0;
        this.Item_ID = 0;

    }

    return TaskConfig;
})();

/**
 * [当前为生成代码，不可以修改] TaskConfig 配置表
 * */
var TaskConfigTableInstance = (function() {

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
            _unique = new TaskConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function TaskConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('TaskConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new TaskConfig();
            obj.INDX = parseInt(tmpArr[i].INDX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.TASK_NAME = tmpArr[i].TASK_NAME;
            obj.AWARD_TIP = tmpArr[i].AWARD_TIP;
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.TASK_SHOW_LVMIN = parseInt(tmpArr[i].TASK_SHOW_LVMIN);
            obj.TASK_SHOW_LVMAX = parseInt(tmpArr[i].TASK_SHOW_LVMAX);
            obj.GATES_TYPE = parseInt(tmpArr[i].GATES_TYPE);
            obj.NUM = parseInt(tmpArr[i].NUM);
            obj.LEVEL = parseInt(tmpArr[i].LEVEL);
            obj.AWARD_ITEM = tmpArr[i].AWARD_ITEM;
            obj.SCORE_NUM = parseInt(tmpArr[i].SCORE_NUM);
            obj.ID = parseInt(tmpArr[i].ID);
            obj.Item_ID = parseInt(tmpArr[i].Item_ID);

            _lines[tmpArr[i].INDX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    TaskConfigTable.prototype.GetLines = function() {
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
exports.Instance = TaskConfigTableInstance;
