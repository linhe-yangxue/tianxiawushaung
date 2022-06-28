
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] DailyStageConfig 类为 DailyStageConfigTable 每一行的元素对象
 * */
var DailyStageConfig = (function() {

    /**
    * 构造函数
    */
    function DailyStageConfig() {
        this.INDEX = 0;
        this.NAME = '';
        this.TYPE = 0;
        this.DIFFICULTY = 0;
        this.DIFFICULTY_ATLAS_NAME = '';
        this.DIFFICULTY_SPRITE_NAME = '';
        this.STAGE_ID = 0;
        this.DROP_ITEM = '';
        this.BATTLE_POINT = 0;
        this.OPEN_LEVEL = 0;
        this.OPEN_DAY = '';
        this.COST = 0;
        this.DAILY_ATTACK_NUM = 0;

    }

    return DailyStageConfig;
})();

/**
 * [当前为生成代码，不可以修改] DailyStageConfig 配置表
 * */
var DailyStageConfigTableInstance = (function() {

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
            _unique = new DailyStageConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function DailyStageConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('DailyStageConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new DailyStageConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.DIFFICULTY = parseInt(tmpArr[i].DIFFICULTY);
            obj.DIFFICULTY_ATLAS_NAME = tmpArr[i].DIFFICULTY_ATLAS_NAME;
            obj.DIFFICULTY_SPRITE_NAME = tmpArr[i].DIFFICULTY_SPRITE_NAME;
            obj.STAGE_ID = parseInt(tmpArr[i].STAGE_ID);
            obj.DROP_ITEM = tmpArr[i].DROP_ITEM;
            obj.BATTLE_POINT = parseInt(tmpArr[i].BATTLE_POINT);
            obj.OPEN_LEVEL = parseInt(tmpArr[i].OPEN_LEVEL);
            obj.OPEN_DAY = tmpArr[i].OPEN_DAY;
            obj.COST = parseInt(tmpArr[i].COST);
            obj.DAILY_ATTACK_NUM = parseInt(tmpArr[i].DAILY_ATTACK_NUM);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    DailyStageConfigTable.prototype.GetLines = function() {
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
exports.Instance = DailyStageConfigTableInstance;
