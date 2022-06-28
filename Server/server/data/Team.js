
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Team 类为 TeamTable 每一行的元素对象
 * */
var Team = (function() {

    /**
    * 构造函数
    */
    function Team() {
        this.TEAM_ID = 0;
        this.ROLE_ID = 0;
        this.PET_ID1 = 0;
        this.PET_ID2 = 0;
        this.PET_ID3 = 0;
        this.RELATE_ID1 = 0;
        this.RELATE_ID2 = 0;
        this.RELATE_ID3 = 0;
        this.RELATE_ID4 = 0;
        this.RELATE_ID5 = 0;
        this.RELATE_ID6 = 0;
        this.STAR_LEVEL = 0;

    }

    return Team;
})();

/**
 * [当前为生成代码，不可以修改] Team 配置表
 * */
var TeamTableInstance = (function() {

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
            _unique = new TeamTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function TeamTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Team');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Team();
            obj.TEAM_ID = parseInt(tmpArr[i].TEAM_ID);
            obj.ROLE_ID = parseInt(tmpArr[i].ROLE_ID);
            obj.PET_ID1 = parseInt(tmpArr[i].PET_ID1);
            obj.PET_ID2 = parseInt(tmpArr[i].PET_ID2);
            obj.PET_ID3 = parseInt(tmpArr[i].PET_ID3);
            obj.RELATE_ID1 = parseInt(tmpArr[i].RELATE_ID1);
            obj.RELATE_ID2 = parseInt(tmpArr[i].RELATE_ID2);
            obj.RELATE_ID3 = parseInt(tmpArr[i].RELATE_ID3);
            obj.RELATE_ID4 = parseInt(tmpArr[i].RELATE_ID4);
            obj.RELATE_ID5 = parseInt(tmpArr[i].RELATE_ID5);
            obj.RELATE_ID6 = parseInt(tmpArr[i].RELATE_ID6);
            obj.STAR_LEVEL = parseInt(tmpArr[i].STAR_LEVEL);

            _lines[tmpArr[i].TEAM_ID] = obj;

        }
    }

    /**
    * 获取行队列
    */
    TeamTable.prototype.GetLines = function() {
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
exports.Instance = TeamTableInstance;
