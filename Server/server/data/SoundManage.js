
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] SoundManage 类为 SoundManageTable 每一行的元素对象
 * */
var SoundManage = (function() {

    /**
    * 构造函数
    */
    function SoundManage() {
        this.INDEX = 0;
        this.DESCRIBE = '';
        this.MAX_SENCE_SOUND = 0;
        this.MAX_TYPE_SOUND = 0;
        this.PRIORITY = 0;

    }

    return SoundManage;
})();

/**
 * [当前为生成代码，不可以修改] SoundManage 配置表
 * */
var SoundManageTableInstance = (function() {

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
            _unique = new SoundManageTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function SoundManageTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('SoundManage');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new SoundManage();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DESCRIBE = tmpArr[i].DESCRIBE;
            obj.MAX_SENCE_SOUND = parseInt(tmpArr[i].MAX_SENCE_SOUND);
            obj.MAX_TYPE_SOUND = parseInt(tmpArr[i].MAX_TYPE_SOUND);
            obj.PRIORITY = parseInt(tmpArr[i].PRIORITY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    SoundManageTable.prototype.GetLines = function() {
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
exports.Instance = SoundManageTableInstance;
