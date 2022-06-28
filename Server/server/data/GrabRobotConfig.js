
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] GrabRobotConfig 类为 GrabRobotConfigTable 每一行的元素对象
 * */
var GrabRobotConfig = (function() {

    /**
    * 构造函数
    */
    function GrabRobotConfig() {
        this.INDEX = 0;
        this.LEVEL_MIN = 0;
        this.LEVEL_MAX = 0;
        this.WEIGHT = 0;
        this.ROLE_LEVEL = 0;
        this.ROLE_ID = 0;
        this.PET_ID1 = 0;
        this.PET_ID2 = 0;
        this.PET_ID3 = 0;

    }

    return GrabRobotConfig;
})();

/**
 * [当前为生成代码，不可以修改] GrabRobotConfig 配置表
 * */
var GrabRobotConfigTableInstance = (function() {

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
            _unique = new GrabRobotConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function GrabRobotConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('GrabRobotConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new GrabRobotConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.LEVEL_MIN = parseInt(tmpArr[i].LEVEL_MIN);
            obj.LEVEL_MAX = parseInt(tmpArr[i].LEVEL_MAX);
            obj.WEIGHT = parseInt(tmpArr[i].WEIGHT);
            obj.ROLE_LEVEL = parseInt(tmpArr[i].ROLE_LEVEL);
            obj.ROLE_ID = parseInt(tmpArr[i].ROLE_ID);
            obj.PET_ID1 = parseInt(tmpArr[i].PET_ID1);
            obj.PET_ID2 = parseInt(tmpArr[i].PET_ID2);
            obj.PET_ID3 = parseInt(tmpArr[i].PET_ID3);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    GrabRobotConfigTable.prototype.GetLines = function() {
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
exports.Instance = GrabRobotConfigTableInstance;
