
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] KingdomDescribe 类为 KingdomDescribeTable 每一行的元素对象
 * */
var KingdomDescribe = (function() {

    /**
    * 构造函数
    */
    function KingdomDescribe() {
        this.INDEX = 0;
        this.DESCRIBE = '';
        this.EXCELLENT_PET = '';

    }

    return KingdomDescribe;
})();

/**
 * [当前为生成代码，不可以修改] KingdomDescribe 配置表
 * */
var KingdomDescribeTableInstance = (function() {

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
            _unique = new KingdomDescribeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function KingdomDescribeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('KingdomDescribe');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new KingdomDescribe();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.DESCRIBE = tmpArr[i].DESCRIBE;
            obj.EXCELLENT_PET = tmpArr[i].EXCELLENT_PET;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    KingdomDescribeTable.prototype.GetLines = function() {
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
exports.Instance = KingdomDescribeTableInstance;
