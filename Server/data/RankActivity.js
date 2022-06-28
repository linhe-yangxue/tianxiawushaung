
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] RankActivity 类为 RankActivityTable 每一行的元素对象
 * */
var RankActivity = (function() {

    /**
    * 构造函数
    */
    function RankActivity() {
        this.INDEX = 0;
        this.TYPE = 0;
        this.IS_PVP_SHOW = 0;
        this.RANK_MIN = 0;
        this.RANK_MAX = 0;
        this.AWARD_GROUPID = '';

    }

    return RankActivity;
})();

/**
 * [当前为生成代码，不可以修改] RankActivity 配置表
 * */
var RankActivityTableInstance = (function() {

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
            _unique = new RankActivityTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function RankActivityTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('RankActivity');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new RankActivity();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.IS_PVP_SHOW = parseInt(tmpArr[i].IS_PVP_SHOW);
            obj.RANK_MIN = parseInt(tmpArr[i].RANK_MIN);
            obj.RANK_MAX = parseInt(tmpArr[i].RANK_MAX);
            obj.AWARD_GROUPID = tmpArr[i].AWARD_GROUPID;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    RankActivityTable.prototype.GetLines = function() {
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
exports.Instance = RankActivityTableInstance;
