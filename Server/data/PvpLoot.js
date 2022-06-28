
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PvpLoot 类为 PvpLootTable 每一行的元素对象
 * */
var PvpLoot = (function() {

    /**
    * 构造函数
    */
    function PvpLoot() {
        this.INDEX = 0;
        this.VICTORY = 0;
        this.MONEY_AWARD_TIME = 0;
        this.REPUTATION_AWARD = 0;
        this.ROLE_EXP_AWARD_TIME = 0;
        this.GROUP_AWARD = 0;
        this.LEVEL_MIN = 0;
        this.LEVEL_MAX = 0;

    }

    return PvpLoot;
})();

/**
 * [当前为生成代码，不可以修改] PvpLoot 配置表
 * */
var PvpLootTableInstance = (function() {

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
            _unique = new PvpLootTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PvpLootTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PvpLoot');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PvpLoot();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.VICTORY = parseInt(tmpArr[i].VICTORY);
            obj.MONEY_AWARD_TIME = parseInt(tmpArr[i].MONEY_AWARD_TIME);
            obj.REPUTATION_AWARD = parseInt(tmpArr[i].REPUTATION_AWARD);
            obj.ROLE_EXP_AWARD_TIME = parseInt(tmpArr[i].ROLE_EXP_AWARD_TIME);
            obj.GROUP_AWARD = parseInt(tmpArr[i].GROUP_AWARD);
            obj.LEVEL_MIN = parseInt(tmpArr[i].LEVEL_MIN);
            obj.LEVEL_MAX = parseInt(tmpArr[i].LEVEL_MAX);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    PvpLootTable.prototype.GetLines = function() {
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
exports.Instance = PvpLootTableInstance;
