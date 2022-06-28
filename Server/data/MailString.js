
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MailString 类为 MailStringTable 每一行的元素对象
 * */
var MailString = (function() {

    /**
    * 构造函数
    */
    function MailString() {
        this.MAIL_ID = 0;
        this.MAIL_NAME = '';
        this.MAIL_TITLE = '';
        this.MAIL_WORD = '';

    }

    return MailString;
})();

/**
 * [当前为生成代码，不可以修改] MailString 配置表
 * */
var MailStringTableInstance = (function() {

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
            _unique = new MailStringTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MailStringTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MailString');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MailString();
            obj.MAIL_ID = parseInt(tmpArr[i].MAIL_ID);
            obj.MAIL_NAME = tmpArr[i].MAIL_NAME;
            obj.MAIL_TITLE = tmpArr[i].MAIL_TITLE;
            obj.MAIL_WORD = tmpArr[i].MAIL_WORD;

            _lines[tmpArr[i].MAIL_ID] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MailStringTable.prototype.GetLines = function() {
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
exports.Instance = MailStringTableInstance;
