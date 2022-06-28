
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] BossBirth 类为 BossBirthTable 每一行的元素对象
 * */
var BossBirth = (function() {

    /**
    * 构造函数
    */
    function BossBirth() {
        this.INDEX = 0;
        this.LEVFEL_MIN = 0;
        this.LEVFEL_MAX = 0;
        this.BASE_RATE = 0;
        this.TILI_RATE = 0;
        this.XIANGMOLING_RATE = 0;
        this.LEVFEL_RATE = 0;
        this.MIN_RATE = 0;
        this.MAX_RATE = 0;
        this.STAR1_WEIGHT = 0;
        this.STAR2_WEIGHT = 0;
        this.STAR3_WEIGHT = 0;
        this.STAR4_WEIGHT = 0;
        this.STAR5_WEIGHT = 0;
        this.STAR1_TIME = 0;
        this.STAR2_TIME = 0;
        this.STAR3_TIME = 0;
        this.STAR4_TIME = 0;
        this.STAR5_TIME = 0;
        this.STAR1_BOSS = 0;
        this.STAR2_BOSS = 0;
        this.STAR3_BOSS = 0;
        this.STAR4_BOSS = 0;
        this.STAR5_BOSS = 0;
        this.BREAK_RATE = 0;
        this.DOUBLE_RATE = 0;
        this.ADD_BUFF = 0;
        this.N_ATT_RATE = 0;
        this.BOSS_BATTLE_TIME = 0;
        this.CRI_RATE_MAX = 0;

    }

    return BossBirth;
})();

/**
 * [当前为生成代码，不可以修改] BossBirth 配置表
 * */
var BossBirthTableInstance = (function() {

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
            _unique = new BossBirthTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function BossBirthTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('BossBirth');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new BossBirth();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.LEVFEL_MIN = parseInt(tmpArr[i].LEVFEL_MIN);
            obj.LEVFEL_MAX = parseInt(tmpArr[i].LEVFEL_MAX);
            obj.BASE_RATE = parseInt(tmpArr[i].BASE_RATE);
            obj.TILI_RATE = parseInt(tmpArr[i].TILI_RATE);
            obj.XIANGMOLING_RATE = parseInt(tmpArr[i].XIANGMOLING_RATE);
            obj.LEVFEL_RATE = parseInt(tmpArr[i].LEVFEL_RATE);
            obj.MIN_RATE = parseInt(tmpArr[i].MIN_RATE);
            obj.MAX_RATE = parseInt(tmpArr[i].MAX_RATE);
            obj.STAR1_WEIGHT = parseInt(tmpArr[i].STAR1_WEIGHT);
            obj.STAR2_WEIGHT = parseInt(tmpArr[i].STAR2_WEIGHT);
            obj.STAR3_WEIGHT = parseInt(tmpArr[i].STAR3_WEIGHT);
            obj.STAR4_WEIGHT = parseInt(tmpArr[i].STAR4_WEIGHT);
            obj.STAR5_WEIGHT = parseInt(tmpArr[i].STAR5_WEIGHT);
            obj.STAR1_TIME = parseInt(tmpArr[i].STAR1_TIME);
            obj.STAR2_TIME = parseInt(tmpArr[i].STAR2_TIME);
            obj.STAR3_TIME = parseInt(tmpArr[i].STAR3_TIME);
            obj.STAR4_TIME = parseInt(tmpArr[i].STAR4_TIME);
            obj.STAR5_TIME = parseInt(tmpArr[i].STAR5_TIME);
            obj.STAR1_BOSS = parseInt(tmpArr[i].STAR1_BOSS);
            obj.STAR2_BOSS = parseInt(tmpArr[i].STAR2_BOSS);
            obj.STAR3_BOSS = parseInt(tmpArr[i].STAR3_BOSS);
            obj.STAR4_BOSS = parseInt(tmpArr[i].STAR4_BOSS);
            obj.STAR5_BOSS = parseInt(tmpArr[i].STAR5_BOSS);
            obj.BREAK_RATE = parseInt(tmpArr[i].BREAK_RATE);
            obj.DOUBLE_RATE = parseInt(tmpArr[i].DOUBLE_RATE);
            obj.ADD_BUFF = parseInt(tmpArr[i].ADD_BUFF);
            obj.N_ATT_RATE = parseInt(tmpArr[i].N_ATT_RATE);
            obj.BOSS_BATTLE_TIME = parseInt(tmpArr[i].BOSS_BATTLE_TIME);
            obj.CRI_RATE_MAX = parseInt(tmpArr[i].CRI_RATE_MAX);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    BossBirthTable.prototype.GetLines = function() {
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
exports.Instance = BossBirthTableInstance;
