
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Element 类为 ElementTable 每一行的元素对象
 * */
var Element = (function() {

    /**
    * 构造函数
    */
    function Element() {
        this.INDEX = 0;
        this.ELEMENT_NAME = '';
        this.PROMOTING_INDEX = 0;
        this.CONSTRAINING_INDEX = 0;
        this.ELEMENT_ATLAS_NAME = '';
        this.ELEMENT_SPRITE_NAME = '';
        this.CARD_BG_ELEMENT_ATLAS_NAME = '';
        this.ELEMENT_BG_SPRITE_NAME = '';
        this.ELEMENT_ICON_ATLAS_NAME = '';
        this.ELEMENT_ICON_SPRITE_NAME = '';
        this.SELECT_PET_ELEMENT_ICON_ATLAS_NAME = '';
        this.SELECT_PET_ELEMENT_ICON_SPRITE_NAME = '';
        this.ELEMENT_COLOR = '';
        this.FRAGMENT_ATLAS_NAME = '';
        this.FRAGMENT_SPRITE_NAME = '';
        this.EQUIP_ELEMENT_ATLAS_NAME = '';
        this.EQUIP_ELEMENT_SPRITE_NAME = '';

    }

    return Element;
})();

/**
 * [当前为生成代码，不可以修改] Element 配置表
 * */
var ElementTableInstance = (function() {

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
            _unique = new ElementTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ElementTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Element');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Element();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.ELEMENT_NAME = tmpArr[i].ELEMENT_NAME;
            obj.PROMOTING_INDEX = parseInt(tmpArr[i].PROMOTING_INDEX);
            obj.CONSTRAINING_INDEX = parseInt(tmpArr[i].CONSTRAINING_INDEX);
            obj.ELEMENT_ATLAS_NAME = tmpArr[i].ELEMENT_ATLAS_NAME;
            obj.ELEMENT_SPRITE_NAME = tmpArr[i].ELEMENT_SPRITE_NAME;
            obj.CARD_BG_ELEMENT_ATLAS_NAME = tmpArr[i].CARD_BG_ELEMENT_ATLAS_NAME;
            obj.ELEMENT_BG_SPRITE_NAME = tmpArr[i].ELEMENT_BG_SPRITE_NAME;
            obj.ELEMENT_ICON_ATLAS_NAME = tmpArr[i].ELEMENT_ICON_ATLAS_NAME;
            obj.ELEMENT_ICON_SPRITE_NAME = tmpArr[i].ELEMENT_ICON_SPRITE_NAME;
            obj.SELECT_PET_ELEMENT_ICON_ATLAS_NAME = tmpArr[i].SELECT_PET_ELEMENT_ICON_ATLAS_NAME;
            obj.SELECT_PET_ELEMENT_ICON_SPRITE_NAME = tmpArr[i].SELECT_PET_ELEMENT_ICON_SPRITE_NAME;
            obj.ELEMENT_COLOR = tmpArr[i].ELEMENT_COLOR;
            obj.FRAGMENT_ATLAS_NAME = tmpArr[i].FRAGMENT_ATLAS_NAME;
            obj.FRAGMENT_SPRITE_NAME = tmpArr[i].FRAGMENT_SPRITE_NAME;
            obj.EQUIP_ELEMENT_ATLAS_NAME = tmpArr[i].EQUIP_ELEMENT_ATLAS_NAME;
            obj.EQUIP_ELEMENT_SPRITE_NAME = tmpArr[i].EQUIP_ELEMENT_SPRITE_NAME;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ElementTable.prototype.GetLines = function() {
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
exports.Instance = ElementTableInstance;
