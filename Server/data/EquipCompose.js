
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EquipCompose 类为 EquipComposeTable 每一行的元素对象
 * */
var EquipCompose = (function() {

    /**
    * 构造函数
    */
    function EquipCompose() {
        this.INDEX = 0;
        this.NAME = '';
        this.BASE_SHOW = 0;
        this.NUM = 0;
        this.FRAGMENT_1 = 0;
        this.FRAGMENT_2 = 0;
        this.FRAGMENT_3 = 0;
        this.FRAGMENT_4 = 0;
        this.FRAGMENT_5 = 0;
        this.FRAGMENT_6 = 0;

    }

    return EquipCompose;
})();

/**
 * [当前为生成代码，不可以修改] EquipCompose 配置表
 * */
var EquipComposeTableInstance = (function() {

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
            _unique = new EquipComposeTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EquipComposeTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EquipCompose');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EquipCompose();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.BASE_SHOW = parseInt(tmpArr[i].BASE_SHOW);
            obj.NUM = parseInt(tmpArr[i].NUM);
            obj.FRAGMENT_1 = parseInt(tmpArr[i].FRAGMENT_1);
            obj.FRAGMENT_2 = parseInt(tmpArr[i].FRAGMENT_2);
            obj.FRAGMENT_3 = parseInt(tmpArr[i].FRAGMENT_3);
            obj.FRAGMENT_4 = parseInt(tmpArr[i].FRAGMENT_4);
            obj.FRAGMENT_5 = parseInt(tmpArr[i].FRAGMENT_5);
            obj.FRAGMENT_6 = parseInt(tmpArr[i].FRAGMENT_6);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EquipComposeTable.prototype.GetLines = function() {
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
exports.Instance = EquipComposeTableInstance;
