/**
 * 包含的头文件
 */
var csv = require('csv');
var fs = require('fs');

/**
 * 用于操作 CSV 配置文件的单例类
 */
var CSVConfig = (function() {
    /**
     * 私有成员变量
     */
    var _unique;
    var _tableMap;
    var _fileCount;

    /**
     * 单例函数
     * @returns [object] 返回实例化对象
     */
    function instance() {
        if (_unique === undefined) {
            _unique = new CSVConfig();
        }
        return _unique;
    }

    /**
     * 构造函数
     */
    function CSVConfig() {
        _tableMap = {};
        _fileCount = 0;
    }

    /** 递归读取配置表
     * @param rootPath [string] 配置文件根目录的路径
     * @param callback [func] 加载结束后返回的回调函数
     * @returns []
     */
    function read(rootPath, callback) {
        /* 遍历全部文件 */
        fs.readdirSync(rootPath).forEach(function(fileName) {
            var fullPath = rootPath + '/' + fileName; /* 拼接完整路径 */
            _fileCount++; /* 读取到的文件计数 */
            var input = fs.readFileSync(fullPath, 'utf8');
            csv.parse(input, { columns:true }, function(err, data) {
                if(err) {
                    console.error('[CSV loading failure] : ' +  fileName);
                    callback(err);
                }
                else {
                    addDataToMap(fileName, data, callback);
                }
            });
        });
    }

    /** 添加配置表的数据到字典队列中
     * @param fileName [string] 文件的名称
     * @param data [string] 表数据
     * @param callback [func] 加载结束后返回的回调函数
     * @returns []
     */
    function addDataToMap(fileName, data, callback) {
        var tableName = fileName.substr(0, fileName.lastIndexOf('.'));
        var curData = data;
        curData.shift();
        _tableMap[tableName] = curData;
        if (_fileCount == Object.keys(_tableMap).length) {
            callback(null);
        }
    }

    /** 加载配置表
     * @param configPath [string] 配置文件根目录的路径
     * @param callback [func] 加载结束后返回的回调函数
     * @returns []
     */
    CSVConfig.prototype.load = function(configPath, callback) {
        _tableMap = {};
        _fileCount = 0;
        read(configPath, callback);
    };

    /** 获取配置表
     * @param tableName [string] 表的名称
     * @returns [object]
     */
    CSVConfig.prototype.getTable = function(tableName) {
        return _tableMap[tableName];
    };

    /**
     * 返回单例函数
     */
    return instance;
})();

/**
 * 声明全局对象
 */
exports.Instance = CSVConfig;
