
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] GroupIDConfig 类为 GroupIDConfigTable 每一行的元素对象
 * */
var GroupIDConfig = (function() {

    /**
    * 构造函数
    */
    function GroupIDConfig() {
        this.INDEX = 0;
        this.GROUP_ID = 0;
        this.INFO = '';
        this.ITEM_ID = 0;
        this.ITEM_COUNT = 0;
        this.ITEM_DROP_WEIGHT = 0;
        this.LOOT_TIME = 0;
        this.QUALITY = 0;

    }

    return GroupIDConfig;
})();

/**
 * [当前为生成代码，不可以修改] GroupIDConfig 配置表
 * */
var GroupIDConfigTableInstance = (function() {

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
            _unique = new GroupIDConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function GroupIDConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('GroupIDConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new GroupIDConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.GROUP_ID = parseInt(tmpArr[i].GROUP_ID);
            obj.INFO = tmpArr[i].INFO;
            obj.ITEM_ID = parseInt(tmpArr[i].ITEM_ID);
            obj.ITEM_COUNT = parseInt(tmpArr[i].ITEM_COUNT);
            obj.ITEM_DROP_WEIGHT = parseInt(tmpArr[i].ITEM_DROP_WEIGHT);
            obj.LOOT_TIME = parseInt(tmpArr[i].LOOT_TIME);
            obj.QUALITY = parseInt(tmpArr[i].QUALITY);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    GroupIDConfigTable.prototype.GetLines = function() {
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
exports.Instance = GroupIDConfigTableInstance;
