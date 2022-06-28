
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] ClimbingTower 类为 ClimbingTowerTable 每一行的元素对象
 * */
var ClimbingTower = (function() {

    /**
    * 构造函数
    */
    function ClimbingTower() {
        this.INDEX = 0;
        this.FLOOR_NUM = 0;
        this.STAR_1 = 0;
        this.FIGHT_POINT_STAR = 0;
        this.FIGHT_POINT_1 = 0;
        this.STAR_2 = 0;
        this.FIGHT_POINT_2 = 0;
        this.STAR_3 = 0;
        this.FIGHT_POINT_3 = 0;
        this.STAR_REWARD_3 = 0;
        this.STAR_REWARD_6 = 0;
        this.STAR_REWARD_9 = 0;
        this.BASE_EQUIP_TOKEN = '';
        this.BASE_MONEY = '';
        this.LOST_GROUPID_VIP0 = '';
        this.PRICE_VIP0 = '';
        this.BASE_PRICE_VIP0 = '';
        this.LOST_GROUPID_VIP1 = '';
        this.PRICE_VIP1 = '';
        this.BASE_PRICE_VIP1 = '';
        this.LOST_GROUPID_VIP2 = '';
        this.PRICE_VIP2 = '';
        this.BASE_PRICE_VIP2 = '';
        this.LOST_GROUPID_VIP3 = '';
        this.PRICE_VIP3 = '';
        this.BASE_PRICE_VIP3 = '';
        this.LOST_GROUPID_VIP4 = '';
        this.PRICE_VIP4 = '';
        this.BASE_PRICE_VIP4 = '';
        this.LOST_GROUPID_VIP5 = '';
        this.PRICE_VIP5 = '';
        this.BASE_PRICE_VIP5 = '';
        this.LOST_GROUPID_VIP6 = '';
        this.PRICE_VIP6 = '';
        this.BASE_PRICE_VIP6 = '';
        this.LOST_GROUPID_VIP7 = '';
        this.PRICE_VIP7 = '';
        this.BASE_PRICE_VIP7 = '';
        this.LOST_GROUPID_VIP8 = '';
        this.PRICE_VIP8 = '';
        this.BASE_PRICE_VIP8 = '';
        this.LOST_GROUPID_VIP9 = '';
        this.PRICE_VIP9 = '';
        this.BASE_PRICE_VIP9 = '';
        this.LOST_GROUPID_VIP10 = '';
        this.PRICE_VIP10 = '';
        this.BASE_PRICE_VIP10 = '';
        this.LOST_GROUPID_VIP11 = '';
        this.PRICE_VIP11 = '';
        this.BASE_PRICE_VIP11 = '';
        this.LOST_GROUPID_VIP12 = '';
        this.PRICE_VIP12 = '';
        this.BASE_PRICE_VIP12 = '';

    }

    return ClimbingTower;
})();

/**
 * [当前为生成代码，不可以修改] ClimbingTower 配置表
 * */
var ClimbingTowerTableInstance = (function() {

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
            _unique = new ClimbingTowerTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function ClimbingTowerTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('ClimbingTower');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new ClimbingTower();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.FLOOR_NUM = parseInt(tmpArr[i].FLOOR_NUM);
            obj.STAR_1 = parseInt(tmpArr[i].STAR_1);
            obj.FIGHT_POINT_STAR = parseInt(tmpArr[i].FIGHT_POINT_STAR);
            obj.FIGHT_POINT_1 = parseInt(tmpArr[i].FIGHT_POINT_1);
            obj.STAR_2 = parseInt(tmpArr[i].STAR_2);
            obj.FIGHT_POINT_2 = parseInt(tmpArr[i].FIGHT_POINT_2);
            obj.STAR_3 = parseInt(tmpArr[i].STAR_3);
            obj.FIGHT_POINT_3 = parseInt(tmpArr[i].FIGHT_POINT_3);
            obj.STAR_REWARD_3 = parseInt(tmpArr[i].STAR_REWARD_3);
            obj.STAR_REWARD_6 = parseInt(tmpArr[i].STAR_REWARD_6);
            obj.STAR_REWARD_9 = parseInt(tmpArr[i].STAR_REWARD_9);
            obj.BASE_EQUIP_TOKEN = tmpArr[i].BASE_EQUIP_TOKEN;
            obj.BASE_MONEY = tmpArr[i].BASE_MONEY;
            obj.LOST_GROUPID_VIP0 = tmpArr[i].LOST_GROUPID_VIP0;
            obj.PRICE_VIP0 = tmpArr[i].PRICE_VIP0;
            obj.BASE_PRICE_VIP0 = tmpArr[i].BASE_PRICE_VIP0;
            obj.LOST_GROUPID_VIP1 = tmpArr[i].LOST_GROUPID_VIP1;
            obj.PRICE_VIP1 = tmpArr[i].PRICE_VIP1;
            obj.BASE_PRICE_VIP1 = tmpArr[i].BASE_PRICE_VIP1;
            obj.LOST_GROUPID_VIP2 = tmpArr[i].LOST_GROUPID_VIP2;
            obj.PRICE_VIP2 = tmpArr[i].PRICE_VIP2;
            obj.BASE_PRICE_VIP2 = tmpArr[i].BASE_PRICE_VIP2;
            obj.LOST_GROUPID_VIP3 = tmpArr[i].LOST_GROUPID_VIP3;
            obj.PRICE_VIP3 = tmpArr[i].PRICE_VIP3;
            obj.BASE_PRICE_VIP3 = tmpArr[i].BASE_PRICE_VIP3;
            obj.LOST_GROUPID_VIP4 = tmpArr[i].LOST_GROUPID_VIP4;
            obj.PRICE_VIP4 = tmpArr[i].PRICE_VIP4;
            obj.BASE_PRICE_VIP4 = tmpArr[i].BASE_PRICE_VIP4;
            obj.LOST_GROUPID_VIP5 = tmpArr[i].LOST_GROUPID_VIP5;
            obj.PRICE_VIP5 = tmpArr[i].PRICE_VIP5;
            obj.BASE_PRICE_VIP5 = tmpArr[i].BASE_PRICE_VIP5;
            obj.LOST_GROUPID_VIP6 = tmpArr[i].LOST_GROUPID_VIP6;
            obj.PRICE_VIP6 = tmpArr[i].PRICE_VIP6;
            obj.BASE_PRICE_VIP6 = tmpArr[i].BASE_PRICE_VIP6;
            obj.LOST_GROUPID_VIP7 = tmpArr[i].LOST_GROUPID_VIP7;
            obj.PRICE_VIP7 = tmpArr[i].PRICE_VIP7;
            obj.BASE_PRICE_VIP7 = tmpArr[i].BASE_PRICE_VIP7;
            obj.LOST_GROUPID_VIP8 = tmpArr[i].LOST_GROUPID_VIP8;
            obj.PRICE_VIP8 = tmpArr[i].PRICE_VIP8;
            obj.BASE_PRICE_VIP8 = tmpArr[i].BASE_PRICE_VIP8;
            obj.LOST_GROUPID_VIP9 = tmpArr[i].LOST_GROUPID_VIP9;
            obj.PRICE_VIP9 = tmpArr[i].PRICE_VIP9;
            obj.BASE_PRICE_VIP9 = tmpArr[i].BASE_PRICE_VIP9;
            obj.LOST_GROUPID_VIP10 = tmpArr[i].LOST_GROUPID_VIP10;
            obj.PRICE_VIP10 = tmpArr[i].PRICE_VIP10;
            obj.BASE_PRICE_VIP10 = tmpArr[i].BASE_PRICE_VIP10;
            obj.LOST_GROUPID_VIP11 = tmpArr[i].LOST_GROUPID_VIP11;
            obj.PRICE_VIP11 = tmpArr[i].PRICE_VIP11;
            obj.BASE_PRICE_VIP11 = tmpArr[i].BASE_PRICE_VIP11;
            obj.LOST_GROUPID_VIP12 = tmpArr[i].LOST_GROUPID_VIP12;
            obj.PRICE_VIP12 = tmpArr[i].PRICE_VIP12;
            obj.BASE_PRICE_VIP12 = tmpArr[i].BASE_PRICE_VIP12;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    ClimbingTowerTable.prototype.GetLines = function() {
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
exports.Instance = ClimbingTowerTableInstance;
