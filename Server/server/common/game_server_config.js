/**
 * Created by kevin on 2015/8/10.
 * gameserver的配置
 */

/** Node节点的相关配置*/
var node_config = (function() {
    function node_config() {
        this.nodeId  = 0;
        this.innerIp = "";
        this.outerIp = "";
        this.name = "";
        this.port = "";
    }
    return node_config;
})();
exports.node_config = node_config;

/** Redis 单个节点的相关配置*/
var RedisConfig = (function() {
    function RedisConfig() {
        this.redisId   = 0;          /**Redis的id，很重要根据这个取模运算，一定不要出错*/
        this.redisIp   = "";         /**Redis对应的Ip*/
        this.redisPort = "";         /**Redis对应的Port*/
        this.redisPassword = "";     /**Redis对应的密码*/
    }
    return RedisConfig;
})();
exports.RedisConfig = RedisConfig;

/** Redis 所有节点的集合*/
var RedisConfigArr = (function() {
    function RedisConfigArr() {
        this.globalRedisArr = {};
        this.zoneRedisArr = {};
    }
    return RedisConfigArr;
})();
exports.RedisConfigArr = RedisConfigArr;
