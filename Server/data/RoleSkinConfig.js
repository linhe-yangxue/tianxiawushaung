
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] RoleSkinConfig 类为 RoleSkinConfigTable 每一行的元素对象
 * */
var RoleSkinConfig = (function() {

    /**
    * 构造函数
    */
    function RoleSkinConfig() {
        this.INDEX = 0;
        this.ICON_ATLAS = '';
        this.ICON_SPRITE = '';
        this.ATLAS = '';
        this.SPRITE = '';
        this.ROLE_SKIN_HP = 0;
        this.ROLE_SKIN_MP = 0;
        this.ROLE_SKIN_ATTACK = 0;
        this.ROLE_TITLE = '';
        this.FIGHT_STRENGTH = 0;

    }

    return RoleSkinConfig;
})();

/**
 * [当前为生成代码，不可以修改] RoleSkinConfig 配置表
 * */
var RoleSkinConfigTableInstance = (function() {

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
            _unique = new RoleSkinConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function RoleSkinConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('RoleSkinConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new RoleSkinConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ICON_ATLAS = tmpArr[i].ICON_ATLAS;
            obj.ICON_SPRITE = tmpArr[i].ICON_SPRITE;
            obj.ATLAS = tmpArr[i].ATLAS;
            obj.SPRITE = tmpArr[i].SPRITE;
            obj.ROLE_SKIN_HP = parseInt(tmpArr[i].ROLE_SKIN_HP);
            obj.ROLE_SKIN_MP = parseInt(tmpArr[i].ROLE_SKIN_MP);
            obj.ROLE_SKIN_ATTACK = parseInt(tmpArr[i].ROLE_SKIN_ATTACK);
            obj.ROLE_TITLE = tmpArr[i].ROLE_TITLE;
            obj.FIGHT_STRENGTH = parseInt(tmpArr[i].FIGHT_STRENGTH);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    RoleSkinConfigTable.prototype.GetLines = function() {
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
exports.Instance = RoleSkinConfigTableInstance;
