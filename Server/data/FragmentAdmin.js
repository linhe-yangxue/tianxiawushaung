
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] FragmentAdmin 类为 FragmentAdminTable 每一行的元素对象
 * */
var FragmentAdmin = (function() {

    /**
    * 构造函数
    */
    function FragmentAdmin() {
        this.INDEX = 0;
        this.NAME = '';
        this.ICON_ATLAS = '';
        this.ICON_NAME = '';
        this.ROLEEQUIPID = 0;
        this.ICON_BLACKATLAS = '';

    }

    return FragmentAdmin;
})();

/**
 * [当前为生成代码，不可以修改] FragmentAdmin 配置表
 * */
var FragmentAdminTableInstance = (function() {

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
            _unique = new FragmentAdminTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function FragmentAdminTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('FragmentAdmin');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new FragmentAdmin();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.ICON_ATLAS = tmpArr[i].ICON_ATLAS;
            obj.ICON_NAME = tmpArr[i].ICON_NAME;
            obj.ROLEEQUIPID = parseInt(tmpArr[i].ROLEEQUIPID);
            obj.ICON_BLACKATLAS = tmpArr[i].ICON_BLACKATLAS;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    FragmentAdminTable.prototype.GetLines = function() {
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
exports.Instance = FragmentAdminTableInstance;
