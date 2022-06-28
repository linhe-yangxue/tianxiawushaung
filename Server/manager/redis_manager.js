
/** 包含的头文件 */
var client = require('../tools/redis/redis_client');

/**
 * 关于Redis集群的管理类，用于管理Redis数据库的连接对象。
 * 使用步骤需要先加载连接对象，然后才能调用连接对象，否则返回 null 。
 */
var RedisManager = (function() {
    /**
     * 私有成员变量
     */
    var _unique;
    var _redisClient_Test;
    var _redisClient_Zone;
    var _redisClient_GL;

    /**
     * 单例函数
     * @returns [object] 返回实例化对象
     */
    function instance() {
        if (_unique === undefined) {
            _unique = new RedisManager();
        }
        return _unique;
    }

    /**
     * 构造函数
     */
    function RedisManager() {
        _redisClient_Test = null;
        _redisClient_Zone = null;
        _redisClient_GL = null;
    }

    /**
     * 加载Redis测试数据库连接对象
     * @param port [int] Redis数据库的端口
     * @param host [string] Redis数据库的IP
     * @param pwd [string] Redis数据库的密码
     * @returns []
     */
    RedisManager.prototype.loadTestDB = function(port, host, pwd) {
        host = host || '127.0.0.1';
        pwd = pwd || '';
        _redisClient_Test = new client.RedisClient();
        _redisClient_Test.createDB(port, host, pwd, useBuffer);
    };

    /**
     * 加载逻辑Redis数据库连接
     * @param cfgRedis [arr] Redis配置数组对象
     * @param useBuffer [bool] 是否使用buffer
     */
    RedisManager.prototype.loadLogicDB = function(cfgRedis, useBuffer) {
        /* 初始化全局redis */
        _redisClient_GL = new client.RedisClient();
        var g = cfgRedis.globalRedis;
        _redisClient_GL.createDB(
            g.port,
            g.ip,
            g.pwd,
            useBuffer
        );

        /* 初始化逻辑区redis集群 */
        _redisClient_Zone = new client.RedisClient();
        var z = cfgRedis.zoneRedisArr;
        for(var i in z) {
            _redisClient_Zone.createDB(
                z[i].port,
                z[i].ip,
                z[i].pwd,
                useBuffer
            );
        }
    };

    /**
     * 获取Redis测试数据库的客户端对象
     */
    RedisManager.prototype.getRedisClientTest = function() {
        return _redisClient_Test;
    };

    /**
     * 获取一个全局Redis 对象。
     */
    RedisManager.prototype.getGlobalRedisClient = function() {
        return _redisClient_GL;
    };

    /**
     * 获取一个逻辑区的 Redis 集群对象。
     */
    RedisManager.prototype.getZoneRedisClient = function() {
        return _redisClient_Zone;
    };

    /**
     * 返回单例函数
     */
    return instance;
})();

/**
 * 声明全局对象
 */
exports.Instance = RedisManager;