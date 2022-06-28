
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BeginnerConfig 类为 BeginnerConfigTable 每一行的元素对象
 * */
var BeginnerConfig = (function() {

    /**
    * 构造函数
    */
    function BeginnerConfig() {
        this.INDEX = 0;
        this.FOLLOW_GUIDE = '';
        this.RELOAD_INDEX = 0;
        this.DESCRIBE = '';
        this.TRIGGER_TYPE = 0;
        this.TRIGGER_DELAY = 0;
        this.TRIGGER_PARAM = '';
        this.GUIDE_TYPE = 0;
        this.GUIDE_PARAM = '';
        this.GUIDE_TXT_SET = '';
        this.GUIDE_HAND_SET = '';
        this.PROTECT_TIME = 0;

    }

    return BeginnerConfig;
})();

/**
 * [当前为生成代码，不可以修改] BeginnerConfig 配置表
 * */
var BeginnerConfigTableInstance = (function() {

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
            _unique = new BeginnerConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BeginnerConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BeginnerConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BeginnerConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.FOLLOW_GUIDE = tmpArr[i].FOLLOW_GUIDE;
            obj.RELOAD_INDEX = parseInt(tmpArr[i].RELOAD_INDEX);
            obj.DESCRIBE = tmpArr[i].DESCRIBE;
            obj.TRIGGER_TYPE = parseInt(tmpArr[i].TRIGGER_TYPE);
            obj.TRIGGER_DELAY = parseInt(tmpArr[i].TRIGGER_DELAY);
            obj.TRIGGER_PARAM = tmpArr[i].TRIGGER_PARAM;
            obj.GUIDE_TYPE = parseInt(tmpArr[i].GUIDE_TYPE);
            obj.GUIDE_PARAM = tmpArr[i].GUIDE_PARAM;
            obj.GUIDE_TXT_SET = tmpArr[i].GUIDE_TXT_SET;
            obj.GUIDE_HAND_SET = tmpArr[i].GUIDE_HAND_SET;
            obj.PROTECT_TIME = parseInt(tmpArr[i].PROTECT_TIME);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BeginnerConfigTable.prototype.GetLines = function() {
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
exports.Instance = BeginnerConfigTableInstance;
