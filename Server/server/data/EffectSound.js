
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] EffectSound 类为 EffectSoundTable 每一行的元素对象
 * */
var EffectSound = (function() {

    /**
    * 构造函数
    */
    function EffectSound() {
        this.OBJECT_NAME = '';
        this.SOUND_FILE = '';
        this.HIT_SOUND_FILE = '';
        this.DELAY_TIME = 0;
        this.IS_LOOP = 0;
        this.INTERVAL_TIME = 0;
        this.IS_NEED_REPLAY = 0;
        this.SOUND_TYPE = 0;
        this.INFO = '';

    }

    return EffectSound;
})();

/**
 * [当前为生成代码，不可以修改] EffectSound 配置表
 * */
var EffectSoundTableInstance = (function() {

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
            _unique = new EffectSoundTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function EffectSoundTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('EffectSound');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new EffectSound();
            obj.OBJECT_NAME = tmpArr[i].OBJECT_NAME;
            obj.SOUND_FILE = tmpArr[i].SOUND_FILE;
            obj.HIT_SOUND_FILE = tmpArr[i].HIT_SOUND_FILE;
            obj.DELAY_TIME = parseFloat(tmpArr[i].DELAY_TIME);
            obj.IS_LOOP = parseInt(tmpArr[i].IS_LOOP);
            obj.INTERVAL_TIME = parseFloat(tmpArr[i].INTERVAL_TIME);
            obj.IS_NEED_REPLAY = parseInt(tmpArr[i].IS_NEED_REPLAY);
            obj.SOUND_TYPE = parseInt(tmpArr[i].SOUND_TYPE);
            obj.INFO = tmpArr[i].INFO;

            _lines[tmpArr[i].OBJECT_NAME] = obj;

        }
    }

    /**
    * 获取行队列
    */
    EffectSoundTable.prototype.GetLines = function() {
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
exports.Instance = EffectSoundTableInstance;
