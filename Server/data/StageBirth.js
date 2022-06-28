
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StageBirth 类为 StageBirthTable 每一行的元素对象
 * */
var StageBirth = (function() {

    /**
    * 构造函数
    */
    function StageBirth() {
        this.INDEX = 0;
        this.MONSTER = 0;
        this.DRAMA_MONSTER = 0;
        this.WAYPOINT = 0;
        this.DESC = '';
        this.DELAY = 0;
        this.GROUP = 0;

    }

    return StageBirth;
})();

/**
 * [当前为生成代码，不可以修改] StageBirth 配置表
 * */
var StageBirthTableInstance = (function() {

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
            _unique = new StageBirthTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StageBirthTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StageBirth');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StageBirth();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.MONSTER = parseInt(tmpArr[i].MONSTER);
            obj.DRAMA_MONSTER = parseInt(tmpArr[i].DRAMA_MONSTER);
            obj.WAYPOINT = parseInt(tmpArr[i].WAYPOINT);
            obj.DESC = tmpArr[i].DESC;
            obj.DELAY = parseFloat(tmpArr[i].DELAY);
            obj.GROUP = parseInt(tmpArr[i].GROUP);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StageBirthTable.prototype.GetLines = function() {
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
exports.Instance = StageBirthTableInstance;
