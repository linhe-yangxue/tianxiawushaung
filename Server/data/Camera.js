
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] Camera 类为 CameraTable 每一行的元素对象
 * */
var Camera = (function() {

    /**
    * 构造函数
    */
    function Camera() {
        this.INDEX = 0;
        this.COORDINATE_X = 0;
        this.COORDINATE_Y = 0;
        this.COORDINATE_Z = 0;
        this.ANGLE_X = 0;
        this.ANGLE_Y = 0;
        this.ANGLE_Z = 0;
        this.DISTANCE = 0;
        this.MAX_ACCELERATE = 0;
        this.DAMPING = 0;

    }

    return Camera;
})();

/**
 * [当前为生成代码，不可以修改] Camera 配置表
 * */
var CameraTableInstance = (function() {

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
            _unique = new CameraTable();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function CameraTable() {
        _lines = {};
        var tmpArr = csvParse.Instance().getTable('Camera');
        for(var i = 0; i < tmpArr.length; ++i) {
            var obj = new Camera();
            obj.INDEX = parseInt(tmpArr[i].INDEX);
            obj.COORDINATE_X = parseFloat(tmpArr[i].COORDINATE_X);
            obj.COORDINATE_Y = parseFloat(tmpArr[i].COORDINATE_Y);
            obj.COORDINATE_Z = parseFloat(tmpArr[i].COORDINATE_Z);
            obj.ANGLE_X = parseFloat(tmpArr[i].ANGLE_X);
            obj.ANGLE_Y = parseFloat(tmpArr[i].ANGLE_Y);
            obj.ANGLE_Z = parseFloat(tmpArr[i].ANGLE_Z);
            obj.DISTANCE = parseFloat(tmpArr[i].DISTANCE);
            obj.MAX_ACCELERATE = parseFloat(tmpArr[i].MAX_ACCELERATE);
            obj.DAMPING = parseFloat(tmpArr[i].DAMPING);

            _lines[tmpArr[i].INDEX] = obj;

        }
    }

    /**
    * 获取行队列
    */
    CameraTable.prototype.GetLines = function() {
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
exports.Instance = CameraTableInstance;
