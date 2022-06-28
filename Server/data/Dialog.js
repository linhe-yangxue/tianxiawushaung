
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Dialog 类为 DialogTable 每一行的元素对象
 * */
var Dialog = (function() {

    /**
    * 构造函数
    */
    function Dialog() {
        this.INDEX = 0;
        this.ISLEFT = 0;
        this.DIALOG = '';
        this.NEXT = 0;
        this.MODEL = 0;
        this.SCALE = 0;
        this.OFFSET = 0;
        this.BACKUP = '';
        this.SOUND = '';

    }

    return Dialog;
})();

/**
 * [当前为生成代码，不可以修改] Dialog 配置表
 * */
var DialogTableInstance = (function() {

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
            _unique = new DialogTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function DialogTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Dialog');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Dialog();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ISLEFT = parseInt(tmpArr[i].ISLEFT);
            obj.DIALOG = tmpArr[i].DIALOG;
            obj.NEXT = parseInt(tmpArr[i].NEXT);
            obj.MODEL = parseInt(tmpArr[i].MODEL);
            obj.SCALE = parseFloat(tmpArr[i].SCALE);
            obj.OFFSET = parseFloat(tmpArr[i].OFFSET);
            obj.BACKUP = tmpArr[i].BACKUP;
            obj.SOUND = tmpArr[i].SOUND;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    DialogTable.prototype.GetLines = function() {
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
exports.Instance = DialogTableInstance;
