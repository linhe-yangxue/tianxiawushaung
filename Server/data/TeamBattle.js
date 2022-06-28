
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] TeamBattle 类为 TeamBattleTable 每一行的元素对象
 * */
var TeamBattle = (function() {

    /**
    * 构造函数
    */
    function TeamBattle() {
        this.INDEX = 0;
        this.TEAM_IDA = 0;
        this.TEAM_IDB = 0;
        this.BATTLE_NUM = 0;
        this.BATTLE_TIME = 0;

    }

    return TeamBattle;
})();

/**
 * [当前为生成代码，不可以修改] TeamBattle 配置表
 * */
var TeamBattleTableInstance = (function() {

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
            _unique = new TeamBattleTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function TeamBattleTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('TeamBattle');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new TeamBattle();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TEAM_IDA = parseInt(tmpArr[i].TEAM_IDA);
            obj.TEAM_IDB = parseInt(tmpArr[i].TEAM_IDB);
            obj.BATTLE_NUM = parseInt(tmpArr[i].BATTLE_NUM);
            obj.BATTLE_TIME = parseInt(tmpArr[i].BATTLE_TIME);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    TeamBattleTable.prototype.GetLines = function() {
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
exports.Instance = TeamBattleTableInstance;
