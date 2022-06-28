
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PointStarConfig 类为 PointStarConfigTable 每一行的元素对象
 * */
var PointStarConfig = (function() {

    /**
    * 构造函数
    */
    function PointStarConfig() {
        this.INDEX = 0;
        this.POINT_STAR_CHART = '';
        this.POINT_STAR_NAME = '';
        this.POINT_ATLAS = '';
        this.DARK_ICON = '';
        this.POINT_ICON = '';
        this.REWARD_TYPE = 0;
        this.REWARD_NUMERICAL = '';
        this.TIPS = '';
        this.COST = 0;

    }

    return PointStarConfig;
})();

/**
 * [当前为生成代码，不可以修改] PointStarConfig 配置表
 * */
var PointStarConfigTableInstance = (function() {

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
            _unique = new PointStarConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PointStarConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PointStarConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PointStarConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.POINT_STAR_CHART = tmpArr[i].POINT_STAR_CHART;
            obj.POINT_STAR_NAME = tmpArr[i].POINT_STAR_NAME;
            obj.POINT_ATLAS = tmpArr[i].POINT_ATLAS;
            obj.DARK_ICON = tmpArr[i].DARK_ICON;
            obj.POINT_ICON = tmpArr[i].POINT_ICON;
            obj.REWARD_TYPE = parseInt(tmpArr[i].REWARD_TYPE);
            obj.REWARD_NUMERICAL = tmpArr[i].REWARD_NUMERICAL;
            obj.TIPS = tmpArr[i].TIPS;
            obj.COST = parseInt(tmpArr[i].COST);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PointStarConfigTable.prototype.GetLines = function() {
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
exports.Instance = PointStarConfigTableInstance;
