
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] CharacterLevelExp 类为 CharacterLevelExpTable 每一行的元素对象
 * */
var CharacterLevelExp = (function() {

    /**
    * 构造函数
    */
    function CharacterLevelExp() {
        this.INDEX = 0;
        this.LEVEL_EXP = 0;
        this.SIGN_GROUP_ID = '';
        this.MONEY_TREE_COINS_MIN = 0;
        this.MONEY_TREE_COINS_MAX = 0;
        this.EXTRA_COINS_MIN = 0;
        this.EXTRA_COINS_MAX = 0;
        this.MONEY_TREE_TIME = 0;
        this.LABOR = 0;
        this.ENERGY = 0;
        this.LEVEL_NOTICE = '';

    }

    return CharacterLevelExp;
})();

/**
 * [当前为生成代码，不可以修改] CharacterLevelExp 配置表
 * */
var CharacterLevelExpTableInstance = (function() {

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
            _unique = new CharacterLevelExpTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function CharacterLevelExpTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('CharacterLevelExp');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new CharacterLevelExp();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.LEVEL_EXP = parseInt(tmpArr[i].LEVEL_EXP);
            obj.SIGN_GROUP_ID = tmpArr[i].SIGN_GROUP_ID;
            obj.MONEY_TREE_COINS_MIN = parseInt(tmpArr[i].MONEY_TREE_COINS_MIN);
            obj.MONEY_TREE_COINS_MAX = parseInt(tmpArr[i].MONEY_TREE_COINS_MAX);
            obj.EXTRA_COINS_MIN = parseInt(tmpArr[i].EXTRA_COINS_MIN);
            obj.EXTRA_COINS_MAX = parseInt(tmpArr[i].EXTRA_COINS_MAX);
            obj.MONEY_TREE_TIME = parseInt(tmpArr[i].MONEY_TREE_TIME);
            obj.LABOR = parseInt(tmpArr[i].LABOR);
            obj.ENERGY = parseInt(tmpArr[i].ENERGY);
            obj.LEVEL_NOTICE = tmpArr[i].LEVEL_NOTICE;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    CharacterLevelExpTable.prototype.GetLines = function() {
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
exports.Instance = CharacterLevelExpTableInstance;
