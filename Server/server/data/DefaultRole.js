
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] DefaultRole 类为 DefaultRoleTable 每一行的元素对象
 * */
var DefaultRole = (function() {

    /**
    * 构造函数
    */
    function DefaultRole() {
        this.INDEX = 0;
        this.TITLE = '';
        this.INFO = '';
        this.ROLE_INFO = '';
        this.PET_INFO_1 = '';
        this.PET_INFO_2 = '';
        this.PET_INFO_3 = '';
        this.HELP_PET_INFO = '';

    }

    return DefaultRole;
})();

/**
 * [当前为生成代码，不可以修改] DefaultRole 配置表
 * */
var DefaultRoleTableInstance = (function() {

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
            _unique = new DefaultRoleTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function DefaultRoleTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('DefaultRole');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new DefaultRole();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TITLE = tmpArr[i].TITLE;
            obj.INFO = tmpArr[i].INFO;
            obj.ROLE_INFO = tmpArr[i].ROLE_INFO;
            obj.PET_INFO_1 = tmpArr[i].PET_INFO_1;
            obj.PET_INFO_2 = tmpArr[i].PET_INFO_2;
            obj.PET_INFO_3 = tmpArr[i].PET_INFO_3;
            obj.HELP_PET_INFO = tmpArr[i].HELP_PET_INFO;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    DefaultRoleTable.prototype.GetLines = function() {
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
exports.Instance = DefaultRoleTableInstance;
