
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] QualityConfig 类为 QualityConfigTable 每一行的元素对象
 * */
var QualityConfig = (function() {

    /**
    * 构造函数
    */
    function QualityConfig() {
        this.INDEX = 0;
        this.QUALITY_NAME = '';
        this.QUALITY_ATLAS_NAME = '';
        this.QUALITY_SPRITE_NAME = '';
        this.CARD_BG_ATLAS_NAME_PET = '';
        this.CARD_BG_SPRITE_NAME_PET = '';
        this.CARD_BG_ATLAS_NAME_CHARACTER = '';
        this.CARD_BG_SPRITE_NAME_CHARACTER = '';
        this.ROTATE_UI = 0;
        this.ROTATE_MAIN_UI = 0;
        this.ROTATE_FIGHT_UI = 0;
        this.UI_AUREOLE = '';
        this.MAIN_UI_AUREOLE = '';
        this.FIGHT_UI_AUREOLE = '';
        this.AUREOLE_NAME = '';
        this.COLOR = '';

    }

    return QualityConfig;
})();

/**
 * [当前为生成代码，不可以修改] QualityConfig 配置表
 * */
var QualityConfigTableInstance = (function() {

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
            _unique = new QualityConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function QualityConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('QualityConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new QualityConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.QUALITY_NAME = tmpArr[i].QUALITY_NAME;
            obj.QUALITY_ATLAS_NAME = tmpArr[i].QUALITY_ATLAS_NAME;
            obj.QUALITY_SPRITE_NAME = tmpArr[i].QUALITY_SPRITE_NAME;
            obj.CARD_BG_ATLAS_NAME_PET = tmpArr[i].CARD_BG_ATLAS_NAME_PET;
            obj.CARD_BG_SPRITE_NAME_PET = tmpArr[i].CARD_BG_SPRITE_NAME_PET;
            obj.CARD_BG_ATLAS_NAME_CHARACTER = tmpArr[i].CARD_BG_ATLAS_NAME_CHARACTER;
            obj.CARD_BG_SPRITE_NAME_CHARACTER = tmpArr[i].CARD_BG_SPRITE_NAME_CHARACTER;
            obj.ROTATE_UI = parseFloat(tmpArr[i].ROTATE_UI);
            obj.ROTATE_MAIN_UI = parseFloat(tmpArr[i].ROTATE_MAIN_UI);
            obj.ROTATE_FIGHT_UI = parseFloat(tmpArr[i].ROTATE_FIGHT_UI);
            obj.UI_AUREOLE = tmpArr[i].UI_AUREOLE;
            obj.MAIN_UI_AUREOLE = tmpArr[i].MAIN_UI_AUREOLE;
            obj.FIGHT_UI_AUREOLE = tmpArr[i].FIGHT_UI_AUREOLE;
            obj.AUREOLE_NAME = tmpArr[i].AUREOLE_NAME;
            obj.COLOR = tmpArr[i].COLOR;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    QualityConfigTable.prototype.GetLines = function() {
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
exports.Instance = QualityConfigTableInstance;
