
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] HelpList 类为 HelpListTable 每一行的元素对象
 * */
var HelpList = (function() {

    /**
    * 构造函数
    */
    function HelpList() {
        this.INDEX = 0;
        this.FUNC_ID = '';
        this.DESC = '';
        this.STRING_HELP = '';

    }

    return HelpList;
})();

/**
 * [当前为生成代码，不可以修改] HelpList 配置表
 * */
var HelpListTableInstance = (function() {

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
            _unique = new HelpListTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function HelpListTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('HelpList');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new HelpList();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.FUNC_ID = tmpArr[i].FUNC_ID;
            obj.DESC = tmpArr[i].DESC;
            obj.STRING_HELP = tmpArr[i].STRING_HELP;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    HelpListTable.prototype.GetLines = function() {
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
exports.Instance = HelpListTableInstance;
