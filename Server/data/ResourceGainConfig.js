
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ResourceGainConfig 类为 ResourceGainConfigTable 每一行的元素对象
 * */
var ResourceGainConfig = (function() {

    /**
    * 构造函数
    */
    function ResourceGainConfig() {
        this.INDEX = 0;
        this.GAIY_BY_STAGE = '';
        this.GAIN_BY_FUNCTION = '';
        this.GAIN_BY_SHOPINDEX = 0;

    }

    return ResourceGainConfig;
})();

/**
 * [当前为生成代码，不可以修改] ResourceGainConfig 配置表
 * */
var ResourceGainConfigTableInstance = (function() {

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
            _unique = new ResourceGainConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ResourceGainConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ResourceGainConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ResourceGainConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.GAIY_BY_STAGE = tmpArr[i].GAIY_BY_STAGE;
            obj.GAIN_BY_FUNCTION = tmpArr[i].GAIN_BY_FUNCTION;
            obj.GAIN_BY_SHOPINDEX = parseInt(tmpArr[i].GAIN_BY_SHOPINDEX);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ResourceGainConfigTable.prototype.GetLines = function() {
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
exports.Instance = ResourceGainConfigTableInstance;
