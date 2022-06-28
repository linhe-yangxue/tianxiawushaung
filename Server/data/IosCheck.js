
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] IosCheck 类为 IosCheckTable 每一行的元素对象
 * */
var IosCheck = (function() {

    /**
    * 构造函数
    */
    function IosCheck() {
        this.INDEX = 0;
        this.DESC = '';
        this.WINDOW_NAME = '';
        this.TYPE = '';
        this.IOS_ATLAS_NAME = '';
        this.RESOURCE_PATH = '';
        this.ANDROID = '';
        this.IOS_CHECK = '';

    }

    return IosCheck;
})();

/**
 * [当前为生成代码，不可以修改] IosCheck 配置表
 * */
var IosCheckTableInstance = (function() {

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
            _unique = new IosCheckTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function IosCheckTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('IosCheck');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new IosCheck();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DESC = tmpArr[i].DESC;
            obj.WINDOW_NAME = tmpArr[i].WINDOW_NAME;
            obj.TYPE = tmpArr[i].TYPE;
            obj.IOS_ATLAS_NAME = tmpArr[i].IOS_ATLAS_NAME;
            obj.RESOURCE_PATH = tmpArr[i].RESOURCE_PATH;
            obj.ANDROID = tmpArr[i].ANDROID;
            obj.IOS_CHECK = tmpArr[i].IOS_CHECK;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    IosCheckTable.prototype.GetLines = function() {
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
exports.Instance = IosCheckTableInstance;
