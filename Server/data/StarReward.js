
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] StarReward 类为 StarRewardTable 每一行的元素对象
 * */
var StarReward = (function() {

    /**
    * 构造函数
    */
    function StarReward() {
        this.INDEX = 0;
        this.STARNUMBER_1 = 0;
        this.REWARD_1 = '';
        this.STARNUMBER_2 = 0;
        this.REWARD_2 = '';
        this.STARNUMBER_3 = 0;
        this.REWARD_3 = '';

    }

    return StarReward;
})();

/**
 * [当前为生成代码，不可以修改] StarReward 配置表
 * */
var StarRewardTableInstance = (function() {

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
            _unique = new StarRewardTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function StarRewardTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('StarReward');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new StarReward();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.STARNUMBER_1 = parseInt(tmpArr[i].STARNUMBER_1);
            obj.REWARD_1 = tmpArr[i].REWARD_1;
            obj.STARNUMBER_2 = parseInt(tmpArr[i].STARNUMBER_2);
            obj.REWARD_2 = tmpArr[i].REWARD_2;
            obj.STARNUMBER_3 = parseInt(tmpArr[i].STARNUMBER_3);
            obj.REWARD_3 = tmpArr[i].REWARD_3;

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    StarRewardTable.prototype.GetLines = function() {
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
exports.Instance = StarRewardTableInstance;
