
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Fairylad 类为 FairyladTable 每一行的元素对象
 * */
var Fairylad = (function() {

    /**
    * 构造函数
    */
    function Fairylad() {
        this.INDEX = 0;
        this.NAME = '';
        this.ATLAS_NAME = '';
        this.SPRITE_NAME = '';
        this.DESC = '';
        this.LEVEL_LIMIT = 0;
        this.STATE_ID = 0;
        this.STATE_REARD = 0;
        this.FIGHTING = 0;
        this.MONSTER_ID = 0;
        this.REWARD = '';
        this.GROUP_ID = 0;

    }

    return Fairylad;
})();

/**
 * [当前为生成代码，不可以修改] Fairylad 配置表
 * */
var FairyladTableInstance = (function() {

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
            _unique = new FairyladTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FairyladTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Fairylad');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Fairylad();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.ATLAS_NAME = tmpArr[i].ATLAS_NAME;
            obj.SPRITE_NAME = tmpArr[i].SPRITE_NAME;
            obj.DESC = tmpArr[i].DESC;
            obj.LEVEL_LIMIT = parseInt(tmpArr[i].LEVEL_LIMIT);
            obj.STATE_ID = parseInt(tmpArr[i].STATE_ID);
            obj.STATE_REARD = parseInt(tmpArr[i].STATE_REARD);
            obj.FIGHTING = parseInt(tmpArr[i].FIGHTING);
            obj.MONSTER_ID = parseInt(tmpArr[i].MONSTER_ID);
            obj.REWARD = tmpArr[i].REWARD;
            obj.GROUP_ID = parseInt(tmpArr[i].GROUP_ID);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FairyladTable.prototype.GetLines = function() {
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
exports.Instance = FairyladTableInstance;
