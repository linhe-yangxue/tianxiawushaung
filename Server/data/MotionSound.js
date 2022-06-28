
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] MotionSound 类为 MotionSoundTable 每一行的元素对象
 * */
var MotionSound = (function() {

    /**
    * 构造函数
    */
    function MotionSound() {
        this.MOTION = '';
        this.SOUND_FILE = '';
        this.INFO = '';
        this.PLAY_SOUND_MODEL_TYPE = 0;
        this.SOUND_TYPE = 0;

    }

    return MotionSound;
})();

/**
 * [当前为生成代码，不可以修改] MotionSound 配置表
 * */
var MotionSoundTableInstance = (function() {

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
            _unique = new MotionSoundTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function MotionSoundTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('MotionSound');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new MotionSound();
            obj.MOTION = tmpArr[i].MOTION;
            obj.SOUND_FILE = tmpArr[i].SOUND_FILE;
            obj.INFO = tmpArr[i].INFO;
            obj.PLAY_SOUND_MODEL_TYPE = parseInt(tmpArr[i].PLAY_SOUND_MODEL_TYPE);
            obj.SOUND_TYPE = parseInt(tmpArr[i].SOUND_TYPE);

            _lines[tmpArr[i].MOTION] = obj;

        }
    }

    /**
    * 获取行队列
    */
    MotionSoundTable.prototype.GetLines = function() {
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
exports.Instance = MotionSoundTableInstance;
