
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] WorshipSchedule 类为 WorshipScheduleTable 每一行的元素对象
 * */
var WorshipSchedule = (function() {

    /**
    * 构造函数
    */
    function WorshipSchedule() {
        this.INDEX = 0;
        this.SCHEDULE_1 = 0;
        this.GROUP_ID_1 = 0;
        this.SCHEDULE_2 = 0;
        this.GROUP_ID_2 = 0;
        this.SCHEDULE_3 = 0;
        this.GROUP_ID_3 = 0;
        this.SCHEDULE_4 = 0;
        this.GROUP_ID_4 = 0;
        this.SCHEDULE_5 = 0;
        this.GROUP_ID_5 = 0;

    }

    return WorshipSchedule;
})();

/**
 * [当前为生成代码，不可以修改] WorshipSchedule 配置表
 * */
var WorshipScheduleTableInstance = (function() {

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
            _unique = new WorshipScheduleTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function WorshipScheduleTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('WorshipSchedule');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new WorshipSchedule();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.SCHEDULE_1 = parseInt(tmpArr[i].SCHEDULE_1);
            obj.GROUP_ID_1 = parseInt(tmpArr[i].GROUP_ID_1);
            obj.SCHEDULE_2 = parseInt(tmpArr[i].SCHEDULE_2);
            obj.GROUP_ID_2 = parseInt(tmpArr[i].GROUP_ID_2);
            obj.SCHEDULE_3 = parseInt(tmpArr[i].SCHEDULE_3);
            obj.GROUP_ID_3 = parseInt(tmpArr[i].GROUP_ID_3);
            obj.SCHEDULE_4 = parseInt(tmpArr[i].SCHEDULE_4);
            obj.GROUP_ID_4 = parseInt(tmpArr[i].GROUP_ID_4);
            obj.SCHEDULE_5 = parseInt(tmpArr[i].SCHEDULE_5);
            obj.GROUP_ID_5 = parseInt(tmpArr[i].GROUP_ID_5);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    WorshipScheduleTable.prototype.GetLines = function() {
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
exports.Instance = WorshipScheduleTableInstance;
