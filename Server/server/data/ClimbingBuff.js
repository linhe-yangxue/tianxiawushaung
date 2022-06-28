
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ClimbingBuff 类为 ClimbingBuffTable 每一行的元素对象
 * */
var ClimbingBuff = (function() {

    /**
    * 构造函数
    */
    function ClimbingBuff() {
        this.INDEX = 0;
        this.FLOOR_NUM = 0;
        this.BUFF_NAME = '';
        this.BUFF_TYPE = '';
        this.BUFF_MIN = 0;
        this.BUFF_MAX = 0;
        this.BUFF_WEIGHT = 0;
        this.MIN_ADD = 0;
        this.MAX_ADD = 0;
        this.STAR3_BUFF = 0;
        this.STAR6_BUFF = 0;
        this.STAR9_BUFF = 0;

    }

    return ClimbingBuff;
})();

/**
 * [当前为生成代码，不可以修改] ClimbingBuff 配置表
 * */
var ClimbingBuffTableInstance = (function() {

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
            _unique = new ClimbingBuffTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ClimbingBuffTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ClimbingBuff');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ClimbingBuff();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.FLOOR_NUM = parseInt(tmpArr[i].FLOOR_NUM);
            obj.BUFF_NAME = tmpArr[i].BUFF_NAME;
            obj.BUFF_TYPE = tmpArr[i].BUFF_TYPE;
            obj.BUFF_MIN = parseInt(tmpArr[i].BUFF_MIN);
            obj.BUFF_MAX = parseInt(tmpArr[i].BUFF_MAX);
            obj.BUFF_WEIGHT = parseInt(tmpArr[i].BUFF_WEIGHT);
            obj.MIN_ADD = parseInt(tmpArr[i].MIN_ADD);
            obj.MAX_ADD = parseInt(tmpArr[i].MAX_ADD);
            obj.STAR3_BUFF = parseInt(tmpArr[i].STAR3_BUFF);
            obj.STAR6_BUFF = parseInt(tmpArr[i].STAR6_BUFF);
            obj.STAR9_BUFF = parseInt(tmpArr[i].STAR9_BUFF);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ClimbingBuffTable.prototype.GetLines = function() {
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
exports.Instance = ClimbingBuffTableInstance;
