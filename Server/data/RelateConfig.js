
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] RelateConfig 类为 RelateConfigTable 每一行的元素对象
 * */
var RelateConfig = (function() {

    /**
    * 构造函数
    */
    function RelateConfig() {
        this.INDEX = 0;
        this.RELATE_NAME = '';
        this.RELATE_DWSCRIBE = '';
        this.NEED_CONTENT_1 = 0;
        this.NEED_CONTENT_2 = 0;
        this.NEED_CONTENT_3 = 0;
        this.NEED_CONTENT_4 = 0;
        this.NEED_CONTENT_5 = 0;
        this.NEED_CONTENT_6 = 0;
        this.BUFF_ID = 0;

    }

    return RelateConfig;
})();

/**
 * [当前为生成代码，不可以修改] RelateConfig 配置表
 * */
var RelateConfigTableInstance = (function() {

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
            _unique = new RelateConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function RelateConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('RelateConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new RelateConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.RELATE_NAME = tmpArr[i].RELATE_NAME;
            obj.RELATE_DWSCRIBE = tmpArr[i].RELATE_DWSCRIBE;
            obj.NEED_CONTENT_1 = parseInt(tmpArr[i].NEED_CONTENT_1);
            obj.NEED_CONTENT_2 = parseInt(tmpArr[i].NEED_CONTENT_2);
            obj.NEED_CONTENT_3 = parseInt(tmpArr[i].NEED_CONTENT_3);
            obj.NEED_CONTENT_4 = parseInt(tmpArr[i].NEED_CONTENT_4);
            obj.NEED_CONTENT_5 = parseInt(tmpArr[i].NEED_CONTENT_5);
            obj.NEED_CONTENT_6 = parseInt(tmpArr[i].NEED_CONTENT_6);
            obj.BUFF_ID = parseInt(tmpArr[i].BUFF_ID);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    RelateConfigTable.prototype.GetLines = function() {
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
exports.Instance = RelateConfigTableInstance;
