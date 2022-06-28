
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] PetFragment 类为 PetFragmentTable 每一行的元素对象
 * */
var PetFragment = (function() {

    /**
    * 构造函数
    */
    function PetFragment() {
        this.INDEX = 0;
        this.NAME = '';
        this.DESCRIPTION = '';
        this.COST_NUM = 0;
        this.PET_INDEX = 0;
        this.COST_COIN = 0;

    }

    return PetFragment;
})();

/**
 * [当前为生成代码，不可以修改] PetFragment 配置表
 * */
var PetFragmentTableInstance = (function() {

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
            _unique = new PetFragmentTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function PetFragmentTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('PetFragment');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new PetFragment();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.DESCRIPTION = tmpArr[i].DESCRIPTION;
            obj.COST_NUM = parseInt(tmpArr[i].COST_NUM);
            obj.PET_INDEX = parseInt(tmpArr[i].PET_INDEX);
            obj.COST_COIN = parseInt(tmpArr[i].COST_COIN);

            _lines[tmpArr[i].INDEX] = obj;
            if(isNaN(obj.INDEX)) {
                console.error('[CSV data error] [Table] PetFragment [Column] INDEX [TID]' + i);
            }
            if(isNaN(obj.COST_NUM)) {
                console.error('[CSV data error] [Table] PetFragment [Column] COST_NUM [TID]' + i);
            }
            if(isNaN(obj.PET_INDEX)) {
                console.error('[CSV data error] [Table] PetFragment [Column] PET_INDEX [TID]' + i);
            }
            if(isNaN(obj.COST_COIN)) {
                console.error('[CSV data error] [Table] PetFragment [Column] COST_COIN [TID]' + i);
            }

        }
    }

    /**
    * 获取行队列
    */
    PetFragmentTable.prototype.GetLines = function() {
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
exports.Instance = PetFragmentTableInstance;
