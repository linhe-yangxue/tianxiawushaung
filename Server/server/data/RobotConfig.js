
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] RobotConfig 类为 RobotConfigTable 每一行的元素对象
 * */
var RobotConfig = (function() {

    /**
    * 构造函数
    */
    function RobotConfig() {
        this.INDEX = 0;
        this.ROLE_ID = 0;
        this.ROLE_LEVEL = 0;
        this.COMBAT = 0;
        this.PETID_MIN_1 = 0;
        this.PETID_MAX_1 = 0;
        this.PETID_MIN_2 = 0;
        this.PETID_MAX_2 = 0;
        this.PETID_MIN_3 = 0;
        this.PETID_MAX_3 = 0;

    }

    return RobotConfig;
})();

/**
 * [当前为生成代码，不可以修改] RobotConfig 配置表
 * */
var RobotConfigTableInstance = (function() {

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
            _unique = new RobotConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function RobotConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('RobotConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new RobotConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ROLE_ID = parseInt(tmpArr[i].ROLE_ID);
            obj.ROLE_LEVEL = parseInt(tmpArr[i].ROLE_LEVEL);
            obj.COMBAT = parseInt(tmpArr[i].COMBAT);
            obj.PETID_MIN_1 = parseInt(tmpArr[i].PETID_MIN_1);
            obj.PETID_MAX_1 = parseInt(tmpArr[i].PETID_MAX_1);
            obj.PETID_MIN_2 = parseInt(tmpArr[i].PETID_MIN_2);
            obj.PETID_MAX_2 = parseInt(tmpArr[i].PETID_MAX_2);
            obj.PETID_MIN_3 = parseInt(tmpArr[i].PETID_MIN_3);
            obj.PETID_MAX_3 = parseInt(tmpArr[i].PETID_MAX_3);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    RobotConfigTable.prototype.GetLines = function() {
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
exports.Instance = RobotConfigTableInstance;
