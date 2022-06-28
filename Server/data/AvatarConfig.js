
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] AvatarConfig 类为 AvatarConfigTable 每一行的元素对象
 * */
var AvatarConfig = (function() {

    /**
    * 构造函数
    */
    function AvatarConfig() {
        this.INDEX = 0;
        this.FOR_ROLE_ID = 0;
        this.ADD_ATTACK = 0;
        this.ADD_HP = 0;
        this.ADD_PHYSICAL_DEFENCE = 0;
        this.ADD_MAGIC_DEFENCE = 0;

    }

    return AvatarConfig;
})();

/**
 * [当前为生成代码，不可以修改] AvatarConfig 配置表
 * */
var AvatarConfigTableInstance = (function() {

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
            _unique = new AvatarConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function AvatarConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('AvatarConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new AvatarConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.FOR_ROLE_ID = parseInt(tmpArr[i].FOR_ROLE_ID);
            obj.ADD_ATTACK = parseInt(tmpArr[i].ADD_ATTACK);
            obj.ADD_HP = parseInt(tmpArr[i].ADD_HP);
            obj.ADD_PHYSICAL_DEFENCE = parseInt(tmpArr[i].ADD_PHYSICAL_DEFENCE);
            obj.ADD_MAGIC_DEFENCE = parseInt(tmpArr[i].ADD_MAGIC_DEFENCE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    AvatarConfigTable.prototype.GetLines = function() {
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
exports.Instance = AvatarConfigTableInstance;
