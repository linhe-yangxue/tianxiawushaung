control.json
    |
    |--"cheatProtocal" 作弊协议,正式环境设为0
    |
    |--"sdkChargeOpen" 开启真实充值，正式环境设为1
    |
    |--"isWriteLogs" 输出BI日志，正式环境设为1
    |
    |
    |--"packageVerify" 包序号验证功能，默认值为0，受到http flood攻击时开启


gm_config--GM工具请求密码

mysql.json--BI日志数据库配置

redis.json
    |
    |--"globalRedis" 全局redis配置，务必global_redis.json与保持
    |
    |--"zoneRedisArr" 游戏redis集群配置（区数量必须*小于*游戏redis集群实例数量的十倍，例如配置了10个redis实例，可以开99个区）

sdk.json--SDK配置

server.json
    |
    |--"gmServer" GM服务器配置
    |       |
    |       |--"port" GM服务器端口
    |
    | 
    |--"gameServers" 游戏服务器集群配置
            |
            |--"port" 游戏服务器端口

            
            
version.json--版本信息

zone.json--区初始化配置，正式环境设为"[]"(是的，只有一对中括号！！！)        