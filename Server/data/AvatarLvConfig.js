
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] AvatarLvConfig 类为 AvatarLvConfigTable 每一行的元素对象
 * */
var AvatarLvConfig = (function() {

    /**
    * 构造函数
    */
    function AvatarLvConfig() {
        this.INDEX = 0;
        this.AVATAR_EXP_1 = 0;
        this.TOTAL_AVATAR_EXP_1 = 0;
        this.AVATAR_MONEY_1 = 0;
        this.TOTAL_AVATAR_MONEY_1 = 0;
        this.AVATAR_EXP_2 = 0;
        this.TOTAL_AVATAR_EXP_2 = 0;
        this.AVATAR_MONEY_2 = 0;
        this.TOTAL_AVATAR_MONEY_2 = 0;
        this.AVATAR_EXP_3 = 0;
        this.TOTAL_AVATAR_EXP_3 = 0;
        this.AVATAR_MONEY_3 = 0;
        this.TOTAL_AVATAR_MONEY_3 = 0;
        this.AVATAR_EXP_4 = 0;
        this.TOTAL_AVATAR_EXP_4 = 0;
        this.AVATAR_MONEY_4 = 0;
        this.TOTAL_AVATAR_MONEY_4 = 0;
        this.AVATAR_EXP_5 = 0;
        this.TOTAL_AVATAR_EXP_5 = 0;
        this.AVATAR_MONEY_5 = 0;
        this.TOTAL_AVATAR_MONEY_5 = 0;
        this.AVATAR_EXP_6 = 0;
        this.TOTAL_AVATAR_EXP_6 = 0;
        this.AVATAR_MONEY_6 = 0;
        this.TOTAL_AVATAR_MONEY_6 = 0;
        this.AVATAR_EXP_7 = 0;
        this.TOTAL_AVATAR_EXP_7 = 0;
        this.AVATAR_MONEY_7 = 0;
        this.TOTAL_AVATAR_MONEY_7 = 0;

    }

    return AvatarLvConfig;
})();

/**
 * [当前为生成代码，不可以修改] AvatarLvConfig 配置表
 * */
var AvatarLvConfigTableInstance = (function() {

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
            _unique = new AvatarLvConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function AvatarLvConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('AvatarLvConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new AvatarLvConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.AVATAR_EXP_1 = parseInt(tmpArr[i].AVATAR_EXP_1);
            obj.TOTAL_AVATAR_EXP_1 = parseInt(tmpArr[i].TOTAL_AVATAR_EXP_1);
            obj.AVATAR_MONEY_1 = parseInt(tmpArr[i].AVATAR_MONEY_1);
            obj.TOTAL_AVATAR_MONEY_1 = parseInt(tmpArr[i].TOTAL_AVATAR_MONEY_1);
            obj.AVATAR_EXP_2 = parseInt(tmpArr[i].AVATAR_EXP_2);
            obj.TOTAL_AVATAR_EXP_2 = parseInt(tmpArr[i].TOTAL_AVATAR_EXP_2);
            obj.AVATAR_MONEY_2 = parseInt(tmpArr[i].AVATAR_MONEY_2);
            obj.TOTAL_AVATAR_MONEY_2 = parseInt(tmpArr[i].TOTAL_AVATAR_MONEY_2);
            obj.AVATAR_EXP_3 = parseInt(tmpArr[i].AVATAR_EXP_3);
            obj.TOTAL_AVATAR_EXP_3 = parseInt(tmpArr[i].TOTAL_AVATAR_EXP_3);
            obj.AVATAR_MONEY_3 = parseInt(tmpArr[i].AVATAR_MONEY_3);
            obj.TOTAL_AVATAR_MONEY_3 = parseInt(tmpArr[i].TOTAL_AVATAR_MONEY_3);
            obj.AVATAR_EXP_4 = parseInt(tmpArr[i].AVATAR_EXP_4);
            obj.TOTAL_AVATAR_EXP_4 = parseInt(tmpArr[i].TOTAL_AVATAR_EXP_4);
            obj.AVATAR_MONEY_4 = parseInt(tmpArr[i].AVATAR_MONEY_4);
            obj.TOTAL_AVATAR_MONEY_4 = parseInt(tmpArr[i].TOTAL_AVATAR_MONEY_4);
            obj.AVATAR_EXP_5 = parseInt(tmpArr[i].AVATAR_EXP_5);
            obj.TOTAL_AVATAR_EXP_5 = parseInt(tmpArr[i].TOTAL_AVATAR_EXP_5);
            obj.AVATAR_MONEY_5 = parseInt(tmpArr[i].AVATAR_MONEY_5);
            obj.TOTAL_AVATAR_MONEY_5 = parseInt(tmpArr[i].TOTAL_AVATAR_MONEY_5);
            obj.AVATAR_EXP_6 = parseInt(tmpArr[i].AVATAR_EXP_6);
            obj.TOTAL_AVATAR_EXP_6 = parseInt(tmpArr[i].TOTAL_AVATAR_EXP_6);
            obj.AVATAR_MONEY_6 = parseInt(tmpArr[i].AVATAR_MONEY_6);
            obj.TOTAL_AVATAR_MONEY_6 = parseInt(tmpArr[i].TOTAL_AVATAR_MONEY_6);
            obj.AVATAR_EXP_7 = parseInt(tmpArr[i].AVATAR_EXP_7);
            obj.TOTAL_AVATAR_EXP_7 = parseInt(tmpArr[i].TOTAL_AVATAR_EXP_7);
            obj.AVATAR_MONEY_7 = parseInt(tmpArr[i].AVATAR_MONEY_7);
            obj.TOTAL_AVATAR_MONEY_7 = parseInt(tmpArr[i].TOTAL_AVATAR_MONEY_7);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    AvatarLvConfigTable.prototype.GetLines = function() {
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
exports.Instance = AvatarLvConfigTableInstance;
