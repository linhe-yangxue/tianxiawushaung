/**
 * 包含的头文件
 */
var redis = require('redis');

/**
 * 用于操作Redis的对象类，支持分布式集群配置。
 */
exports.RedisClient = (function() {
    /**
     * 构造函数
     */
    function RedisClient() {
        this.dbArr = [];
    }

    /**
     * 创建一个Redis连接对象
     * @param port [int] Redis数据库的端口
     * @param host [string] Redis数据库的IP
     * @param pwd [string] Redis数据库的密码
     * @param useBuffer [bool] 是否使用buffer
     * @returns [object] Redis连接对象
     */
    RedisClient.prototype.createDB = function(port, host, pwd,  useBuffer) {
        host = host || '127.0.0.1';
        pwd = pwd || '';

        var options = {};
        if(pwd != '') {
            options.auth_pass = pwd;
        }
        if(useBuffer === true) {
            options.return_buffers = true;
        }

        for(var i = 0; i < 10; ++i) {
            var clt =  redis.createClient(port, host, options);
            clt.select(i);
            this.dbArr.push(clt);
        }
    };

    /**
     * 根据分布式ID获取对应的Redis连接对象
     * @param id [int] 分布式ID
     * @returns [object] Redis连接对象
     */
    RedisClient.prototype.getDB = function(id) {
        id = parseInt(id);
        return this.dbArr[id];
    };

    /**
     * 返回构造函数
     */
    return RedisClient;
})();

/**
 * 拼接Redis使用的 KEY 值
 * @param arguments ... [string] 变长参数，拼接需要的字符串KEY
 * @returns {string} 拼接完成的KEY
 */
exports.joinKey = function() {
    return Array.prototype.slice.call(arguments).join(':');
};

/**
 * 拼接Redis使用的 Lock KEY 值
 * @param key [string] 拼接需要的字符串KEY，一般为需要加锁的KEY值
 * @returns {string} 拼接完成的KEY
 */
exports.joinLockKey = function(key) {
    return 'Lock:' + key;
};
