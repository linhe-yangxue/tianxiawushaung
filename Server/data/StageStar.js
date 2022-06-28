
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StageStar 类为 StageStarTable 每一行的元素对象
 * */
var StageStar = (function() {

    /**
    * 构造函数
    */
    function StageStar() {
        this.INDEX = 0;
        this.STARNAME = '';
        this.STARNAME_STATE = '';
        this.STARNAME_WIN = '';
        this.LOST_STARNAME = '';
        this.STARTYPE = 0;
        this.STARVAR = 0;

    }

    return StageStar;
})();

/**
 * [当前为生成代码，不可以修改] StageStar 配置表
 * */
var StageStarTableInstance = (function() {

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
            _unique = new StageStarTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StageStarTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StageStar');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StageStar();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.STARNAME = tmpArr[i].STARNAME;
            obj.STARNAME_STATE = tmpArr[i].STARNAME_STATE;
            obj.STARNAME_WIN = tmpArr[i].STARNAME_WIN;
            obj.LOST_STARNAME = tmpArr[i].LOST_STARNAME;
            obj.STARTYPE = parseInt(tmpArr[i].STARTYPE);
            obj.STARVAR = parseInt(tmpArr[i].STARVAR);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StageStarTable.prototype.GetLines = function() {
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
exports.Instance = StageStarTableInstance;
