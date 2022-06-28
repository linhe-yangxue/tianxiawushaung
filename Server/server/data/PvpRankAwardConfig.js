
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PvpRankAwardConfig 类为 PvpRankAwardConfigTable 每一行的元素对象
 * */
var PvpRankAwardConfig = (function() {

    /**
    * 构造函数
    */
    function PvpRankAwardConfig() {
        this.INDEX = 0;
        this.RANK_MIN = 0;
        this.RANK_MAX = 0;
        this.AWARD_GROUPID = '';
        this.GOLD_AWARD_BY_RANK = 0;

    }

    return PvpRankAwardConfig;
})();

/**
 * [当前为生成代码，不可以修改] PvpRankAwardConfig 配置表
 * */
var PvpRankAwardConfigTableInstance = (function() {

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
            _unique = new PvpRankAwardConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PvpRankAwardConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PvpRankAwardConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PvpRankAwardConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.RANK_MIN = parseInt(tmpArr[i].RANK_MIN);
            obj.RANK_MAX = parseInt(tmpArr[i].RANK_MAX);
            obj.AWARD_GROUPID = tmpArr[i].AWARD_GROUPID;
            obj.GOLD_AWARD_BY_RANK = parseInt(tmpArr[i].GOLD_AWARD_BY_RANK);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PvpRankAwardConfigTable.prototype.GetLines = function() {
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
exports.Instance = PvpRankAwardConfigTableInstance;
