
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] GuildBoss 类为 GuildBossTable 每一行的元素对象
 * */
var GuildBoss = (function() {

    /**
    * 构造函数
    */
    function GuildBoss() {
        this.INDEX = 0;
        this.NAME = '';
        this.EX_BOSS_ID = 0;
        this.STAGE_ID = 0;
        this.GUILD_EXP = 0;
        this.OPEN_GUILD_LEVEL = 0;
        this.DEAD_GROUP_ID = 0;
        this.LASTHIT_CONTRIBUTE = 0;
        this.ATTACK_GROUP_ID = 0;
        this.ATTACK_CONTRIBUTE = 0;
        this.FIRST_KILL_REWARD = '';

    }

    return GuildBoss;
})();

/**
 * [当前为生成代码，不可以修改] GuildBoss 配置表
 * */
var GuildBossTableInstance = (function() {

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
            _unique = new GuildBossTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function GuildBossTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('GuildBoss');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new GuildBoss();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.EX_BOSS_ID = parseInt(tmpArr[i].EX_BOSS_ID);
            obj.STAGE_ID = parseInt(tmpArr[i].STAGE_ID);
            obj.GUILD_EXP = parseInt(tmpArr[i].GUILD_EXP);
            obj.OPEN_GUILD_LEVEL = parseInt(tmpArr[i].OPEN_GUILD_LEVEL);
            obj.DEAD_GROUP_ID = parseInt(tmpArr[i].DEAD_GROUP_ID);
            obj.LASTHIT_CONTRIBUTE = parseInt(tmpArr[i].LASTHIT_CONTRIBUTE);
            obj.ATTACK_GROUP_ID = parseInt(tmpArr[i].ATTACK_GROUP_ID);
            obj.ATTACK_CONTRIBUTE = parseInt(tmpArr[i].ATTACK_CONTRIBUTE);
            obj.FIRST_KILL_REWARD = tmpArr[i].FIRST_KILL_REWARD;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    GuildBossTable.prototype.GetLines = function() {
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
exports.Instance = GuildBossTableInstance;
