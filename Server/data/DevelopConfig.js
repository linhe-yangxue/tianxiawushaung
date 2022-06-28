
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] DevelopConfig 类为 DevelopConfigTable 每一行的元素对象
 * */
var DevelopConfig = (function() {

    /**
    * 构造函数
    */
    function DevelopConfig() {
        this.ID = 0;
        this.ACTIVE_ID = 0;
        this.LEVEL = 0;
        this.BREAK_LEVEL = 0;
        this.ARMS = 0;
        this.JEWELRY = 0;
        this.CLOTHES = 0;
        this.SHOES = 0;
        this.ATT_MAGIC = 0;
        this.DEF_MAGIC = 0;
        this.ARMS_STRENGTHEN_LEVLE = 0;
        this.JEWELRY_STRENGTHEN_LEVLE = 0;
        this.CLOTHES_STRENGTHEN_LEVLE = 0;
        this.SHOES_STRENGTHEN_LEVLE = 0;
        this.ATT_MAGIC_STRENGTHEN_LEVLE = 0;
        this.DEF_MAGIC_STRENGTHEN_LEVLE = 0;
        this.ARMS_REFINE_LEVLE = 0;
        this.JEWELRY_REFINE_LEVLE = 0;
        this.CLOTHES_REFINE_LEVLE = 0;
        this.SHOES_REFINE_LEVLE = 0;
        this.ATT_MAGIC_REFINE_LEVLE = 0;
        this.DEF_MAGIC_REFINE_LEVLE = 0;
        this.FATE_LEVEL = 0;
        this.SKILL_LEVEL1 = 0;
        this.SKILL_LEVEL2 = 0;
        this.SKILL_LEVEL3 = 0;
        this.SKILL_LEVEL4 = 0;

    }

    return DevelopConfig;
})();

/**
 * [当前为生成代码，不可以修改] DevelopConfig 配置表
 * */
var DevelopConfigTableInstance = (function() {

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
            _unique = new DevelopConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function DevelopConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('DevelopConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new DevelopConfig();
            obj.ID = parseInt(tmpArr[i].ID);
            obj.ACTIVE_ID = parseInt(tmpArr[i].ACTIVE_ID);
            obj.LEVEL = parseInt(tmpArr[i].LEVEL);
            obj.BREAK_LEVEL = parseInt(tmpArr[i].BREAK_LEVEL);
            obj.ARMS = parseInt(tmpArr[i].ARMS);
            obj.JEWELRY = parseInt(tmpArr[i].JEWELRY);
            obj.CLOTHES = parseInt(tmpArr[i].CLOTHES);
            obj.SHOES = parseInt(tmpArr[i].SHOES);
            obj.ATT_MAGIC = parseInt(tmpArr[i].ATT_MAGIC);
            obj.DEF_MAGIC = parseInt(tmpArr[i].DEF_MAGIC);
            obj.ARMS_STRENGTHEN_LEVLE = parseInt(tmpArr[i].ARMS_STRENGTHEN_LEVLE);
            obj.JEWELRY_STRENGTHEN_LEVLE = parseInt(tmpArr[i].JEWELRY_STRENGTHEN_LEVLE);
            obj.CLOTHES_STRENGTHEN_LEVLE = parseInt(tmpArr[i].CLOTHES_STRENGTHEN_LEVLE);
            obj.SHOES_STRENGTHEN_LEVLE = parseInt(tmpArr[i].SHOES_STRENGTHEN_LEVLE);
            obj.ATT_MAGIC_STRENGTHEN_LEVLE = parseInt(tmpArr[i].ATT_MAGIC_STRENGTHEN_LEVLE);
            obj.DEF_MAGIC_STRENGTHEN_LEVLE = parseInt(tmpArr[i].DEF_MAGIC_STRENGTHEN_LEVLE);
            obj.ARMS_REFINE_LEVLE = parseInt(tmpArr[i].ARMS_REFINE_LEVLE);
            obj.JEWELRY_REFINE_LEVLE = parseInt(tmpArr[i].JEWELRY_REFINE_LEVLE);
            obj.CLOTHES_REFINE_LEVLE = parseInt(tmpArr[i].CLOTHES_REFINE_LEVLE);
            obj.SHOES_REFINE_LEVLE = parseInt(tmpArr[i].SHOES_REFINE_LEVLE);
            obj.ATT_MAGIC_REFINE_LEVLE = parseInt(tmpArr[i].ATT_MAGIC_REFINE_LEVLE);
            obj.DEF_MAGIC_REFINE_LEVLE = parseInt(tmpArr[i].DEF_MAGIC_REFINE_LEVLE);
            obj.FATE_LEVEL = parseInt(tmpArr[i].FATE_LEVEL);
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
    DevelopConfigTable.prototype.GetLines = function() {
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
exports.Instance = DevelopConfigTableInstance;
