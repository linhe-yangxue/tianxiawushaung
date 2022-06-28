
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] AchieveConfig 类为 AchieveConfigTable 每一行的元素对象
 * */
var AchieveConfig = (function() {

    /**
    * 构造函数
    */
    function AchieveConfig() {
        this.INDX = 0;
        this.TYPE = 0;
        this.TASK_NAME = '';
        this.AWARD_TIP = '';
        this.ICON_ATLAS_NAME = '';
        this.ICON_SPRITE_NAME = '';
        this.EX_TASK = 0;
        this.HEAD_TASK = 0;
        this.TASK_SHOW_LVMIN = 0;
        this.TASK_SHOW_LVMAX = 0;
        this.GATES_TYPE = 0;
        this.GATES_ID = 0;
        this.NUM = 0;
        this.LEVEL = 0;
        this.AWARD_ITEM = '';
        this.ID = 0;
        this.Item_ID = 0;

    }

    return AchieveConfig;
})();

/**
 * [当前为生成代码，不可以修改] AchieveConfig 配置表
 * */
var AchieveConfigTableInstance = (function() {

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
            _unique = new AchieveConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function AchieveConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('AchieveConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new AchieveConfig();
            obj.INDX = parseInt(tmpArr[i].INDX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.TASK_NAME = tmpArr[i].TASK_NAME;
            obj.AWARD_TIP = tmpArr[i].AWARD_TIP;
            obj.ICON_ATLAS_NAME = tmpArr[i].ICON_ATLAS_NAME;
            obj.ICON_SPRITE_NAME = tmpArr[i].ICON_SPRITE_NAME;
            obj.EX_TASK = parseInt(tmpArr[i].EX_TASK);
            obj.HEAD_TASK = parseInt(tmpArr[i].HEAD_TASK);
            obj.TASK_SHOW_LVMIN = parseInt(tmpArr[i].TASK_SHOW_LVMIN);
            obj.TASK_SHOW_LVMAX = parseInt(tmpArr[i].TASK_SHOW_LVMAX);
            obj.GATES_TYPE = parseInt(tmpArr[i].GATES_TYPE);
            obj.GATES_ID = parseInt(tmpArr[i].GATES_ID);
            obj.NUM = parseInt(tmpArr[i].NUM);
            obj.LEVEL = parseInt(tmpArr[i].LEVEL);
            obj.AWARD_ITEM = tmpArr[i].AWARD_ITEM;
            obj.ID = parseInt(tmpArr[i].ID);
            obj.Item_ID = parseInt(tmpArr[i].Item_ID);

            _lines[tmpArr[i].INDX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    AchieveConfigTable.prototype.GetLines = function() {
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
exports.Instance = AchieveConfigTableInstance;
