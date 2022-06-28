
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] TeamData 类为 TeamDataTable 每一行的元素对象
 * */
var TeamData = (function() {

    /**
    * 构造函数
    */
    function TeamData() {
        this.ID = 0;
        this.ACTIVE_ID = 0;
        this.NAME = '';
        this.LEVEL = 0;
        this.ATTACK = 0;
        this.PHYSICAL_DEFENCE = 0;
        this.MAGIC_DEFENCE = 0;
        this.HP = 0;
        this.MP = 0;
        this.HIT = 0;
        this.DODGE = 0;
        this.CRITICAL_STRIKE = 0;
        this.CRITICAL_DERATE = 0;
        this.ATTACK_DAMAGE = 0;
        this.MITIGATIONG = 0;
        this.SKILL_LEVEL1 = 0;
        this.SKILL_LEVEL2 = 0;
        this.SKILL_LEVEL3 = 0;
        this.SKILL_LEVEL4 = 0;

    }

    return TeamData;
})();

/**
 * [当前为生成代码，不可以修改] TeamData 配置表
 * */
var TeamDataTableInstance = (function() {

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
            _unique = new TeamDataTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function TeamDataTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('TeamData');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new TeamData();
            obj.ID = parseInt(tmpArr[i].ID);
            obj.ACTIVE_ID = parseInt(tmpArr[i].ACTIVE_ID);
            obj.NAME = tmpArr[i].NAME;
            obj.LEVEL = parseInt(tmpArr[i].LEVEL);
            obj.ATTACK = parseInt(tmpArr[i].ATTACK);
            obj.PHYSICAL_DEFENCE = parseInt(tmpArr[i].PHYSICAL_DEFENCE);
            obj.MAGIC_DEFENCE = parseInt(tmpArr[i].MAGIC_DEFENCE);
            obj.HP = parseInt(tmpArr[i].HP);
            obj.MP = parseInt(tmpArr[i].MP);
            obj.HIT = parseInt(tmpArr[i].HIT);
            obj.DODGE = parseInt(tmpArr[i].DODGE);
            obj.CRITICAL_STRIKE = parseInt(tmpArr[i].CRITICAL_STRIKE);
            obj.CRITICAL_DERATE = parseInt(tmpArr[i].CRITICAL_DERATE);
            obj.ATTACK_DAMAGE = parseInt(tmpArr[i].ATTACK_DAMAGE);
            obj.MITIGATIONG = parseInt(tmpArr[i].MITIGATIONG);
            obj.SKILL_LEVEL1 = parseInt(tmpArr[i].SKILL_LEVEL1);
            obj.SKILL_LEVEL2 = parseInt(tmpArr[i].SKILL_LEVEL2);
            obj.SKILL_LEVEL3 = parseInt(tmpArr[i].SKILL_LEVEL3);
            obj.SKILL_LEVEL4 = parseInt(tmpArr[i].SKILL_LEVEL4);

            _lines[tmpArr[i].ID] = obj;

        }
    }

    /**
    * 获取行队列
    */
    TeamDataTable.prototype.GetLines = function() {
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
exports.Instance = TeamDataTableInstance;
