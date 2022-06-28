
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Effect 类为 EffectTable 每一行的元素对象
 * */
var Effect = (function() {

    /**
    * 构造函数
    */
    function Effect() {
        this.INDEX = 0;
        this.NAME = '';
        this.TYPE = '';
        this.MODEL = '';
        this.LIFE_TIME = 0;
        this.UPDATEPOS = 0;
        this.LOCATION_1 = '';
        this.LOCATION_2 = '';
        this.BONE = '';
        this.APPLY_DIRECTION = '';
        this.X = 0;
        this.Y = 0;
        this.Z = 0;
        this.SOUND = '';
        this.SOUND_START_TIME = 0;
        this.EFFECT_SPEED = 0;
        this.EFFECT_SIZE = 0;

    }

    return Effect;
})();

/**
 * [当前为生成代码，不可以修改] Effect 配置表
 * */
var EffectTableInstance = (function() {

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
            _unique = new EffectTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EffectTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Effect');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Effect();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.NAME = tmpArr[i].NAME;
            obj.TYPE = tmpArr[i].TYPE;
            obj.MODEL = tmpArr[i].MODEL;
            obj.LIFE_TIME = parseFloat(tmpArr[i].LIFE_TIME);
            obj.UPDATEPOS = parseInt(tmpArr[i].UPDATEPOS);
            obj.LOCATION_1 = tmpArr[i].LOCATION_1;
            obj.LOCATION_2 = tmpArr[i].LOCATION_2;
            obj.BONE = tmpArr[i].BONE;
            obj.APPLY_DIRECTION = tmpArr[i].APPLY_DIRECTION;
            obj.X = parseFloat(tmpArr[i].X);
            obj.Y = parseFloat(tmpArr[i].Y);
            obj.Z = parseFloat(tmpArr[i].Z);
            obj.SOUND = tmpArr[i].SOUND;
            obj.SOUND_START_TIME = parseFloat(tmpArr[i].SOUND_START_TIME);
            obj.EFFECT_SPEED = parseFloat(tmpArr[i].EFFECT_SPEED);
            obj.EFFECT_SIZE = parseFloat(tmpArr[i].EFFECT_SIZE);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EffectTable.prototype.GetLines = function() {
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
exports.Instance = EffectTableInstance;
