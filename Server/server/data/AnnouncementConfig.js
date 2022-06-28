
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] AnnouncementConfig 类为 AnnouncementConfigTable 每一行的元素对象
 * */
var AnnouncementConfig = (function() {

    /**
    * 构造函数
    */
    function AnnouncementConfig() {
        this.INDEX = 0;
        this.ANNOUNCEMENT_TYPE = '';
        this.ANNOUNCEMENT_TXT = '';

    }

    return AnnouncementConfig;
})();

/**
 * [当前为生成代码，不可以修改] AnnouncementConfig 配置表
 * */
var AnnouncementConfigTableInstance = (function() {

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
            _unique = new AnnouncementConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function AnnouncementConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('AnnouncementConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new AnnouncementConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ANNOUNCEMENT_TYPE = tmpArr[i].ANNOUNCEMENT_TYPE;
            obj.ANNOUNCEMENT_TXT = tmpArr[i].ANNOUNCEMENT_TXT;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    AnnouncementConfigTable.prototype.GetLines = function() {
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
exports.Instance = AnnouncementConfigTableInstance;
