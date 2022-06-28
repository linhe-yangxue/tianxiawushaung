
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SceneBuff 类为 SceneBuffTable 每一行的元素对象
 * */
var SceneBuff = (function() {

    /**
    * 构造函数
    */
    function SceneBuff() {
        this.INDEX = 0;
        this.BUFF = 0;
        this.BUFF_DELAY = 0;
        this.BUFF_CD = 0;
        this.BUFF_TIME = 0;
        this.BUFF_RANDOM = 0;
        this.BUFF_EFFECT = 0;
        this.ABSORB_EFFECT = 0;

    }

    return SceneBuff;
})();

/**
 * [当前为生成代码，不可以修改] SceneBuff 配置表
 * */
var SceneBuffTableInstance = (function() {

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
            _unique = new SceneBuffTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SceneBuffTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SceneBuff');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SceneBuff();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.BUFF = parseInt(tmpArr[i].BUFF);
            obj.BUFF_DELAY = parseFloat(tmpArr[i].BUFF_DELAY);
            obj.BUFF_CD = parseFloat(tmpArr[i].BUFF_CD);
            obj.BUFF_TIME = parseFloat(tmpArr[i].BUFF_TIME);
            obj.BUFF_RANDOM = parseFloat(tmpArr[i].BUFF_RANDOM);
            obj.BUFF_EFFECT = parseInt(tmpArr[i].BUFF_EFFECT);
            obj.ABSORB_EFFECT = parseInt(tmpArr[i].ABSORB_EFFECT);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SceneBuffTable.prototype.GetLines = function() {
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
exports.Instance = SceneBuffTableInstance;
