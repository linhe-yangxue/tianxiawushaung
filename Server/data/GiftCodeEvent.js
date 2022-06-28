
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] GiftCodeEvent 类为 GiftCodeEventTable 每一行的元素对象
 * */
var GiftCodeEvent = (function() {

    /**
    * 构造函数
    */
    function GiftCodeEvent() {
        this.INDEX = 0;
        this.GROUP_ID = 0;
        this.TIMES = 0;
        this.START_DATE = 0;
        this.END_DATE = 0;

    }

    return GiftCodeEvent;
})();

/**
 * [当前为生成代码，不可以修改] GiftCodeEvent 配置表
 * */
var GiftCodeEventTableInstance = (function() {

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
            _unique = new GiftCodeEventTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function GiftCodeEventTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('GiftCodeEvent');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new GiftCodeEvent();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.GROUP_ID = parseInt(tmpArr[i].GROUP_ID);
            obj.TIMES = parseInt(tmpArr[i].TIMES);
            obj.START_DATE = parseInt(tmpArr[i].START_DATE);
            obj.END_DATE = parseInt(tmpArr[i].END_DATE);

            _lines[tmpArr[i].INDEX] = obj;
            if(isNaN(obj.INDEX)) {
                console.error('[CSV data error] [Table] GiftCodeEvent [Column] INDEX [TID]' + i);
            }
            if(isNaN(obj.GROUP_ID)) {
                console.error('[CSV data error] [Table] GiftCodeEvent [Column] GROUP_ID [TID]' + i);
            }
            if(isNaN(obj.TIMES)) {
                console.error('[CSV data error] [Table] GiftCodeEvent [Column] TIMES [TID]' + i);
            }
            if(isNaN(obj.START_DATE)) {
                console.error('[CSV data error] [Table] GiftCodeEvent [Column] START_DATE [TID]' + i);
            }
            if(isNaN(obj.END_DATE)) {
                console.error('[CSV data error] [Table] GiftCodeEvent [Column] END_DATE [TID]' + i);
            }

        }
    }

    /**
    * 获取行队列
    */
    GiftCodeEventTable.prototype.GetLines = function() {
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
exports.Instance = GiftCodeEventTableInstance;
