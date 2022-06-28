
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FeatAwardConfig 类为 FeatAwardConfigTable 每一行的元素对象
 * */
var FeatAwardConfig = (function() {

    /**
    * 构造函数
    */
    function FeatAwardConfig() {
        this.INDEX = 0;
        this.AWARD_TYPE = 0;
        this.AWARD_ID = 0;
        this.AWARD_NUM = 0;
        this.FEAT_NEED = 0;
        this.DAMAGE_RANK_MIN = 0;
        this.DAMAGE_RANK_MAX = 0;
        this.FEAT_RANK_MIN = 0;
        this.FEAT_RANK_MAX = 0;
        this.LEVEL_MIN = 0;
        this.LEVEL_MAX = 0;

    }

    return FeatAwardConfig;
})();

/**
 * [当前为生成代码，不可以修改] FeatAwardConfig 配置表
 * */
var FeatAwardConfigTableInstance = (function() {

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
            _unique = new FeatAwardConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FeatAwardConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FeatAwardConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FeatAwardConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.AWARD_TYPE = parseInt(tmpArr[i].AWARD_TYPE);
            obj.AWARD_ID = parseInt(tmpArr[i].AWARD_ID);
            obj.AWARD_NUM = parseInt(tmpArr[i].AWARD_NUM);
            obj.FEAT_NEED = parseInt(tmpArr[i].FEAT_NEED);
            obj.DAMAGE_RANK_MIN = parseInt(tmpArr[i].DAMAGE_RANK_MIN);
            obj.DAMAGE_RANK_MAX = parseInt(tmpArr[i].DAMAGE_RANK_MAX);
            obj.FEAT_RANK_MIN = parseInt(tmpArr[i].FEAT_RANK_MIN);
            obj.FEAT_RANK_MAX = parseInt(tmpArr[i].FEAT_RANK_MAX);
            obj.LEVEL_MIN = parseInt(tmpArr[i].LEVEL_MIN);
            obj.LEVEL_MAX = parseInt(tmpArr[i].LEVEL_MAX);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FeatAwardConfigTable.prototype.GetLines = function() {
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
exports.Instance = FeatAwardConfigTableInstance;
