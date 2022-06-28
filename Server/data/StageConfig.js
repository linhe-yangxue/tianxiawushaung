
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StageConfig 类为 StageConfigTable 每一行的元素对象
 * */
var StageConfig = (function() {

    /**
    * 构造函数
    */
    function StageConfig() {
        this.INDEX = 0;
        this.TYPE = 0;
        this.DIFFICULTY = 0;
        this.NAME = '';
        this.DESC = '';
        this.SCENE_NAME = '';
        this.ROLE_BIRTH_POINT = '';
        this.MODEL_COLOR = '';
        this.BACK_MUSIC = '';
        this.MUSIC_VOLUME = 0;
        this.START_SOUND = '';
        this.WIN_SOUND = '';
        this.LOST_SOUND = '';
        this.BOSS_SOUND = '';
        this.START_X = 0;
        this.START_Z = 0;
        this.END_X = 0;
        this.END_Z = 0;
        this.MINIMAP_TEXTURE = '';
        this.MINIMAP_TEXTURE_W = 0;
        this.MINIMAP_TEXTURE_H = 0;
        this.STAGENUMBER = '';
        this.DROP_FRIST = '';
        this.DROPGROUPID = 0;
        this.GROUP_PLOT = '';
        this.LOOT_PREVEIW = '';
        this.DROPMIN = 0;
        this.DROPMAX = 0;
        this.FRONT_INDEX = 0;
        this.FRONT_INDEX_1 = 0;
        this.FRONT_INDEX_2 = 0;
        this.AFTER_INDEX_1 = 0;
        this.AFTER_INDEX_2 = 0;
        this.DIALOG = 0;
        this.CHECK_TIME = 0;
        this.CHECK_BATTLE = 0;
        this.RENFERENCE_BATTLE = 0;
        this.BOSS_ACTIVE_RATE = 0;
        this.HEADICON = 0;
        this.BOSS_MONEY = 0;
        this.ADDSTAR_0 = 0;
        this.ADDSTAR_1 = 0;
        this.ADDSTAR_2 = 0;
        this.CHALLENGE_NUM = 0;
        this.SWEEP_TIME = 0;
        this.CAMERA_PATH = 0;
        this.DRAMA_PARAM = '';
        this.STAGE_TIME = 0;
        this.AWARD_TYPE_1 = 0;
        this.AWARD_1 = 0;
        this.AWARD_TYPE_2 = 0;
        this.AWARD_2 = 0;
        this.AWARD_TYPE_3 = 0;
        this.AWARD_3 = 0;
        this.KEEPLINE = 0;
        this.MONSTER_MONEY = 0;
        this.MONSTER_EXP = 0;
        this.BOSS_EXP = 0;
        this.MONSTER_COUNT = 0;
        this.DIFFICULT = 0;
        this.STATUS = 0;
        this.OPENTIME = '';
        this.OPENDAY = 0;
        this.OPENMONTH = 0;
        this.STAGELIMIT = 0;
        this.EVENT_OPEN_COST = 0;
        this.EVENT_EXTRA_COST = 0;
        this.STAGE_TYPE = 0;
        this.DESC_MJ = '';
        this.PLAYER_EXP = 0;
        this.EXP_TIME = 0;
        this.NEED_BATTLE = 0;
        this.DIFFICULTY_NUM = 0;
        this.ROLE_BIRTH_DIRECTION = 0;

    }

    return StageConfig;
})();

/**
 * [当前为生成代码，不可以修改] StageConfig 配置表
 * */
var StageConfigTableInstance = (function() {

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
            _unique = new StageConfigTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StageConfigTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StageConfig');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StageConfig();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.TYPE = parseInt(tmpArr[i].TYPE);
            obj.DIFFICULTY = parseInt(tmpArr[i].DIFFICULTY);
            obj.NAME = tmpArr[i].NAME;
            obj.DESC = tmpArr[i].DESC;
            obj.SCENE_NAME = tmpArr[i].SCENE_NAME;
            obj.ROLE_BIRTH_POINT = tmpArr[i].ROLE_BIRTH_POINT;
            obj.MODEL_COLOR = tmpArr[i].MODEL_COLOR;
            obj.BACK_MUSIC = tmpArr[i].BACK_MUSIC;
            obj.MUSIC_VOLUME = parseFloat(tmpArr[i].MUSIC_VOLUME);
            obj.START_SOUND = tmpArr[i].START_SOUND;
            obj.WIN_SOUND = tmpArr[i].WIN_SOUND;
            obj.LOST_SOUND = tmpArr[i].LOST_SOUND;
            obj.BOSS_SOUND = tmpArr[i].BOSS_SOUND;
            obj.START_X = parseFloat(tmpArr[i].START_X);
            obj.START_Z = parseFloat(tmpArr[i].START_Z);
            obj.END_X = parseFloat(tmpArr[i].END_X);
            obj.END_Z = parseFloat(tmpArr[i].END_Z);
            obj.MINIMAP_TEXTURE = tmpArr[i].MINIMAP_TEXTURE;
            obj.MINIMAP_TEXTURE_W = parseFloat(tmpArr[i].MINIMAP_TEXTURE_W);
            obj.MINIMAP_TEXTURE_H = parseFloat(tmpArr[i].MINIMAP_TEXTURE_H);
            obj.STAGENUMBER = tmpArr[i].STAGENUMBER;
            obj.DROP_FRIST = tmpArr[i].DROP_FRIST;
            obj.DROPGROUPID = parseInt(tmpArr[i].DROPGROUPID);
            obj.GROUP_PLOT = tmpArr[i].GROUP_PLOT;
            obj.LOOT_PREVEIW = tmpArr[i].LOOT_PREVEIW;
            obj.DROPMIN = parseInt(tmpArr[i].DROPMIN);
            obj.DROPMAX = parseInt(tmpArr[i].DROPMAX);
            obj.FRONT_INDEX = parseInt(tmpArr[i].FRONT_INDEX);
            obj.FRONT_INDEX_1 = parseInt(tmpArr[i].FRONT_INDEX_1);
            obj.FRONT_INDEX_2 = parseInt(tmpArr[i].FRONT_INDEX_2);
            obj.AFTER_INDEX_1 = parseInt(tmpArr[i].AFTER_INDEX_1);
            obj.AFTER_INDEX_2 = parseInt(tmpArr[i].AFTER_INDEX_2);
            obj.DIALOG = parseInt(tmpArr[i].DIALOG);
            obj.CHECK_TIME = parseInt(tmpArr[i].CHECK_TIME);
            obj.CHECK_BATTLE = parseInt(tmpArr[i].CHECK_BATTLE);
            obj.RENFERENCE_BATTLE = parseInt(tmpArr[i].RENFERENCE_BATTLE);
            obj.BOSS_ACTIVE_RATE = parseInt(tmpArr[i].BOSS_ACTIVE_RATE);
            obj.HEADICON = parseInt(tmpArr[i].HEADICON);
            obj.BOSS_MONEY = parseInt(tmpArr[i].BOSS_MONEY);
            obj.ADDSTAR_0 = parseInt(tmpArr[i].ADDSTAR_0);
            obj.ADDSTAR_1 = parseInt(tmpArr[i].ADDSTAR_1);
            obj.ADDSTAR_2 = parseInt(tmpArr[i].ADDSTAR_2);
            obj.CHALLENGE_NUM = parseInt(tmpArr[i].CHALLENGE_NUM);
            obj.SWEEP_TIME = parseFloat(tmpArr[i].SWEEP_TIME);
            obj.CAMERA_PATH = parseInt(tmpArr[i].CAMERA_PATH);
            obj.DRAMA_PARAM = tmpArr[i].DRAMA_PARAM;
            obj.STAGE_TIME = parseInt(tmpArr[i].STAGE_TIME);
            obj.AWARD_TYPE_1 = parseInt(tmpArr[i].AWARD_TYPE_1);
            obj.AWARD_1 = parseInt(tmpArr[i].AWARD_1);
            obj.AWARD_TYPE_2 = parseInt(tmpArr[i].AWARD_TYPE_2);
            obj.AWARD_2 = parseInt(tmpArr[i].AWARD_2);
            obj.AWARD_TYPE_3 = parseInt(tmpArr[i].AWARD_TYPE_3);
            obj.AWARD_3 = parseInt(tmpArr[i].AWARD_3);
            obj.KEEPLINE = parseInt(tmpArr[i].KEEPLINE);
            obj.MONSTER_MONEY = parseInt(tmpArr[i].MONSTER_MONEY);
            obj.MONSTER_EXP = parseInt(tmpArr[i].MONSTER_EXP);
            obj.BOSS_EXP = parseInt(tmpArr[i].BOSS_EXP);
            obj.MONSTER_COUNT = parseInt(tmpArr[i].MONSTER_COUNT);
            obj.DIFFICULT = parseInt(tmpArr[i].DIFFICULT);
            obj.STATUS = parseInt(tmpArr[i].STATUS);
            obj.OPENTIME = tmpArr[i].OPENTIME;
            obj.OPENDAY = parseInt(tmpArr[i].OPENDAY);
            obj.OPENMONTH = parseInt(tmpArr[i].OPENMONTH);
            obj.STAGELIMIT = parseInt(tmpArr[i].STAGELIMIT);
            obj.EVENT_OPEN_COST = parseInt(tmpArr[i].EVENT_OPEN_COST);
            obj.EVENT_EXTRA_COST = parseInt(tmpArr[i].EVENT_EXTRA_COST);
            obj.STAGE_TYPE = parseInt(tmpArr[i].STAGE_TYPE);
            obj.DESC_MJ = tmpArr[i].DESC_MJ;
            obj.PLAYER_EXP = parseInt(tmpArr[i].PLAYER_EXP);
            obj.EXP_TIME = parseInt(tmpArr[i].EXP_TIME);
            obj.NEED_BATTLE = parseInt(tmpArr[i].NEED_BATTLE);
            obj.DIFFICULTY_NUM = parseInt(tmpArr[i].DIFFICULTY_NUM);
            obj.ROLE_BIRTH_DIRECTION = parseInt(tmpArr[i].ROLE_BIRTH_DIRECTION);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StageConfigTable.prototype.GetLines = function() {
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
exports.Instance = StageConfigTableInstance;
