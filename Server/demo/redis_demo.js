/**
 * 包含的头文件
 */
var redisManager = require('../manager/redis_manager');
var logger = require('../manager/log4_manager').LoggerDemo;

/**
 * 关于 Redis 的测试类
 * ---------------------------------------------------------------------------------------------------------------------
 * Key（键）
 * ---------------------------------------------------------------------------------------------------------------------
 * KEYS  [func] ???  [describe]  KEYS pattern (查找所有符合给定模式pattern的key)返回字符串
 * DEL  [func] ???  [describe] DEL key (删除给定的key)返回删除key的数量
 * TTL  [func] ???  [describe] TTL key (获取key的生存时间，单位是秒) key不存在时返回-2，
 *     key存在但没有设置剩余时间时返回-1，否则返回实际生存时间。
 * DUMP [func] ??? [describe] DUMP key (序列化给定的key) 返回被序列化的值
 *     key存在则返回0，key不存在则返回nil.
 * EXISTS [func] ??? [describe] EXISTS key (检查给定的key是否存在) key存在返回1，key不存在返回0。
 * EXPIRE [func] ??? [describe] EXPIRE key (为给定key设置生存时间(以秒为单位)) key的生产周期为0时，key将被自动删除。
 * EXPIREAT [func] ??? [describe] EXPIREAT key (为给定的key设置生存时间(接受参数为时间戳)) 设置成功返回1，
 *     key不存在或无法设置，返回0。
 * MIGRATE [func] ??? [describe] MIGRATE host port key destination-db timeout [COPY][REPLACE]
 *     (将指定的key原子性的从当前实例迁移到目标实例指定的数据库)
 *     使用参数：COPY：不移除原实例上的key。
 *               REPLACE：替换目标实例上已存在的key。
 *     key迁移成功返回ok,失败返回相应错误。
 * MOVE [func] ??? [describe] MOVE key db (将当前数据库的key移动到指定数据库) 移动成功返回1，失败返回0。
 * OBJECT [func] ??? [describe] OBJECT subcommand [arguments[arguments]] (从内部查看给定key的Redis对象)
 *     子命令：OBJECT REFCOUNT <key> 返回给定key引用所存储的值的次数，用于除错。
 *             OBJECT ENCODING <key> 返回给定key锁储存的值所使用的内部表示。
 *             OBJECT IDLETIME <key> 返回给定key自存储以来的空闲时间，以秒为单位。
 *     使用REFCOUNT和IDLETIME返回数字，使用ENCODING返回相应的编码类型（raw,ziplist,intset,zipmap,ziplist）。
 * PERSIST [func] ??? [describe] PERISIST key (移除给定key的生存时间) 移除成功返回1，移除失败或key不存在返回0。
 * PEXPIRE [func] ??? [describe] PEXPIRE key milliseconds (为给定key设置生存时间(以毫秒为单位)) 设置成功返回1，
 *     设置失败或key不存在返回0.
 * PEXPIREAT [func] ??? [describe] PEXPIREAT key milliseconds-timestamp (为给定的key设置生存时间(接受参数为毫秒时间戳))。
 *     设置成功返回1，设置失败或key不存在返回0。
 * PTTL [func] ??? [describe] PTTL key (获取key的生存时间，单位为毫秒) key不存在返回-2，
 *     key存在但没有设置剩余生存时间时返回-1，否则返回实际生存时间。
 * RANDOMKEY [func] ??? [describe] RANDOMKEY (从当前数据库随机返回一个key) 数据库不为空返回key，数据库为空返回nil。
 * RENAME [func] ??? [describe] RENAME key newkey (将key更名为newkey) 改名成功提示ok，失败返回一个错误。
 * RENAMENX [func] ??? [describe] RENAMENX key newkey (当且仅当newkey不存在时，将key更名为newkey) 成功返回1，
 *     newkey存在返回0。
 * RESTORE [func] ??? [describe] RESTORE key ttl serialized-value [REPALCE](反序列化给定的序列化值，并将和给定的key关联)
 *     成功返回ok，否则返回一个错误。
 * SORT [func] ??? [describe] SORT key [BY pattern] [LIMIT offset count] [GET pattern[GET pattern ...]]
 *     [ASC|DESC][ALPHA][STORE destination] (返回或保存给定列表、集合、有序集合key中经过排序的元素，以数字为对象)
 *     SORT key 返回key从小到大排序的结果。
 *     SORT DESC key 返回key从大到小排序结果。
 *     SORT [DESC] key ALPHA 在正确设置了LC_COLLATE环境变量的情况下可以较UTF-8码进行排序。
 *     SORT key LIMIT <offset> <count> 返回指定跳过offset个元素后，count个对象。
 *     STOR key BY [other key] 返回将key按照other key的大小的排序。
 *     STOR key GET [other key] 返回根据排序结果取出相应键值。同时使用多个GET，返回多个键值。
 * TYPE [func] ??? [describe] TYPE key (返回key所存值得类型) key不存在返回none，
 *     key为字符串返回string，key为列表返回list，key为集合返回set，key为有序集返回zset，key为哈希表返回hash。
 * SCAN [func] ??? [describe] SCAN cursor [MATCH pattern] [COUNT count] (用于迭代当前数据库中的数据库键)
 *     返回一个数据库键。
 * ---------------------------------------------------------------------------------------------------------------------
 * String（字符串）
 * ---------------------------------------------------------------------------------------------------------------------
 * DECR [func] ??? [describe] DECR key (将key中存储的数字减一) 返回操作后的key值，如果值不存在则初始化为0，
 *     如果值无法转化为数字类型，则会返回错误。
 * DECRBY [func] ??? [describe] DECRBY key decrement  (将key中存储的数字减去decrement) 返回操作后的key值，
 *     如果值不存在则初始化为0，如果值无法转化为数字类型，则会返回错误。
 * INCR [func] ??? [describe] INCR key (将key中存储的数字加一) 返回操作后的key值，如果值不存在则初始化为0，
 *     如果值无法转化为数字类型，则会返回错误。
 * INCRBY [func] ??? [describe] INCRBY key increment  (将key中存储的数字加上increment) 返回操作后的key值，
 *     如果值不存在则初始化为0，如果值无法转化为数字类型，则会返回错误。
 * GET [func] ??? [describe] GET key (返回key关联的字符串) key不存在时返回null，如果key不是字符串类型，
 *     那么返回错误。
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * Hash（哈希表）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * List（列表）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * Set（集合）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * SortedSet（有序集合）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * HyperLogLog
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * GEO（地理位置）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * Pub/Sub（发布/订阅）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * Transaction（事务）
 * ---------------------------------------------------------------------------------------------------------------------
 * DISCARD [func] ??? [describe] 取消事务，放弃执行事务块内的命令
 * EXEC [func] ??? [describe] 执行所有事务块内的命令
 * MULTI [func] ??? [describe] 标记一个事务块的开始
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * Script（脚本）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * Connection（连接）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 * Server（服务器）
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *
 *
 *
 * ---------------------------------------------------------------------------------------------------------------------
 */
 /** DEL [移除给定的一个或多个key] 成功返回 1，失败返回 0
 * SET [将字符串值value关联到key] 成功返回 OK (注意大写)
 * GET [返回key所关联的字符串值] 失败返回 null
 * SETNX [若给定的key已经存在，则setnx不做任何东西] 成功返回 1，失败返回 0
 * SETEX [将值value关联到key，并将key的生存时间设为seconds(以秒为单位)] 成功返回 OK (注意大写)
 * TTL
 * EXPIRE [为给定key设置生存时间] 当key过期时，它会被自动删除
 * LPUSH [将一个或多个值value插入到列表key的表头] 成功返回列表元素数量，失败返回 0
 * RPUSH [将一个或多个值value插入到列表key的表尾] 成功返回列表元素数量，失败返回 0
 * LPOP [移除并返回列表key的头元素] 成功返回元素 value
 * RPOP [移除并返回列表key的尾元素] 成功返回元素 value
 * LRANGE [返回列表key中指定区间内的元素，区间以偏移量start和stop指定]
 *      以0表示列表的第一个元素，以1表示列表的第二个元素，
 *      以-1表示列表的最后一个元素，-2表示列表的倒数第二个元素
 * LINDEX [返回列表key中，下标为index的元素] *****
 * LTRIM [对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除] *****
 *      执行命令LTRIM list 0 2，表示只保留列表list的前三个元素，其余元素全部删除。
 *      下标(index)参数start和stop都以0为底，也就是说，以0表示列表的第一个元素，以1表示列表的第二个元素，
 *      以-1表示列表的最后一个元素，-2表示列表的倒数第二个元素，以此类推。
 * LREM [LREM key count value，根据参数count的值，移除列表中与参数value相等的元素] *****
 * LINSERT [将值value插入到列表key当中，位于值pivot之前或之后] *****
 *      LINSERT key BEFORE|AFTER pivot value，当pivot不存在于列表key时，不执行任何操作。
 *      当key不存在时，key被视为空列表，不执行任何操作。
 *      如果key不是列表类型，返回一个错误。
 * RPOPLPUSH [RPOPLPUSH source destination，命令RPOPLPUSH在一个原子时间内，执行以下两个动作] *****
 *      将列表source中的最后一个元素(尾元素)弹出，并返回给客户端。
 *      将source弹出的元素插入到列表destination，作为destination列表的的头元素。
 * SORT [返回或保存给定列表、集合、有序集合key中经过排序的元素]
 * INCR [将key中储存的数字值增一] *****
 * DECR [将key中储存的数字值减一] *****
 *
 */
var DemoRedis = (function() {
    /**
     * 私有成员变量
     */
    var _dbConnArr;

    /**
     * 构造函数
     */
    function DemoRedis() {
        var dbManager = redisManager.Instance(); /* 获取Redis管理类的对象单例 */
        dbManager.loadTestDB(6378); /* 加载Redis数据库连接 */
        _dbConnArr = dbManager.getRedisClientTest(); /* 获取Redis测试集群对象 */
    }

    /**
     * 测试 del 、set and get 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.delAndSetAndGet = function() {
        var key = _dbConnArr.joinKey('string'); /* 定义Redis数据库对象中，使用的 KEY */
        var redisDB = _dbConnArr.getDB(0); /* 获取一个Redis连接对象 */
        redisDB.MULTI()
            .DEL(key)
            .SET(key, 'value')
            .DEL(key)
            .GET(key)
            .EXEC(function(err, res) {
                for (var i = 0; i != res.length; ++i) {
                    logger.debug(res[i]);
                }
                /* 输出
                 * 1
                 * OK
                 * 1
                 * null
                 */
            });
    };

    /**
     * 测试 setnx 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.setNX= function() {
        var key = _dbConnArr.joinKey('string'); /* 定义Redis数据库对象中，使用的 KEY */
        var redisDB = _dbConnArr.getDB(0); /* 获取一个Redis连接对象 */
        redisDB.MULTI()
            .DEL(key)
            .SETNX(key, 'value1')
            .SETNX(key, 'value2')
            .EXEC(function(err, res) {
                for (var i = 0; i != res.length; ++i) {
                    logger.debug(res[i]);
                }
                /* 输出
                 * 1
                 * 1
                 * 0
                 */
            });
    };

    /**
     * 测试 setex and expire 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.setEXAndExpire = function() {
        var key = _dbConnArr.joinKey('string'); /* 定义Redis数据库对象中，使用的 KEY */
        var redisDB = _dbConnArr.getDB(0); /* 获取一个Redis连接对象 */
        redisDB.MULTI()
            .DEL(key)
            .SETEX(key, '60', 'value1')
            .EXPIRE(key, '120')
            .SET(key, 'value2')
            .EXEC(function(err, res) {
                for (var i = 0; i != res.length; ++i) {
                    logger.debug(res[i]);
                }
                /* 输出
                 * 1
                 * OK
                 * 1
                 * OK
                 */
            });
    };

    /**
     * 测试 list1 中的 lpush、rpush、lpop、rpop、lrange 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.list1 = function() {
        var key = _dbConnArr.joinKey('list'); /* 定义Redis数据库对象中，使用的 KEY */
        var redisDB = _dbConnArr.getDB(0); /* 获取一个Redis连接对象 */
        redisDB.MULTI()
            .DEL(key)
            .RPUSH(key, 1, 2, 3)
            .LPUSH(key, 0)
            .LRANGE(key, 0, -1)
            .LPOP(key)
            .LRANGE(key, 0, -1)
            .RPOP(key)
            .LRANGE(key, 0, -1)
            .EXEC(function(err, res) {
                for (var i = 0; i != res.length; ++i) {
                    logger.debug(res[i]);
                }
                /* 输出
                 * 1
                 * 3
                 * 4
                 * ['0','1','2','3']
                 * 0
                 * ['1','2','3']
                 * 3
                 * ['1','2']
                 */
            });
    };

    /**
     * 测试 sort 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.sort = function() {
        var key = _dbConnArr.joinKey('list'); /* 定义Redis数据库对象中，使用的 KEY */
        var redisDB = _dbConnArr.getDB(0); /* 获取一个Redis连接对象 */
        redisDB.MULTI()
            .DEL(key)
            .RPUSH(key, JSON.stringify({'id3':'3'}))
            .RPUSH(key, JSON.stringify({'id2':'2'}))
            .LRANGE(key, 0, -1)
            .SORT(key)
            .EXEC(function(err, res) {
                logger.debug(JSON.parse(res[0]));
                logger.debug(JSON.parse(res[1]));
                logger.debug(JSON.parse(res[2]));
                logger.debug(JSON.parse(res[3][0]));
                logger.debug(JSON.parse(res[3][1]));
                logger.debug(res[4]);
                /* 输出
                 * 1
                 * 1
                 * 2
                 * { id3: '3' }
                 * { id2: '2' }
                 */
            });
    };
    /**
     * 测试 dump 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.dump = function()
    {
        var key = _dbConnArr.joinKey('string');/*定义Redis数据库对象中，使用的KEY*/
        var redisDB = _dbConnArr.getDB(0);/* 获取一个Redis连接对象 */
        redisDB.MULTI()
            .DEL(key)
            .SET(key,'hello,dumping world')
            .DUMP(key)
            .DEL(key)
            .DUMP(key)
            .EXEC(function(err, res){
                for(var i=0;i!=res.length;++i) {
                    logger.debug(res[i]);
                }
                /*输出
                * 0
                * OK
                * hello,dumping world ��7�ÿ(编码方式问题，乱码部分'\x06\x00E\xa0Z\x82\xd8r\xc1\xde')
                * 1
                * null
                */
            });
    };

    /**
     * 测试 EXISTS 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.exists = function()
    {
        var key = _dbConnArr.joinKey('string');
        var redisDB = _dbConnArr.getDB(0);
        redisDB.MULTI()
            .DEL(key)
            .SET(key,"redis")
            .EXISTS(key)
            .DEL(key)
            .EXISTS(key)
            .EXEC(function(err, res)
            {
                for(var i=0;i!=res.length;++i);
                {
                    logger.debug(res[i]);
                }
                /*输出
                * 0
                * ok
                * 1
                * 1
                * 0*/
            });
    };

    /**
     * 测试 EXPIRE 和 EXPIREAT 和 TTL 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.expireAndexpireatAndttl = function()
    {
        var key = _dbConnArr.joinKey('string');
        var redisDB = _dbConnArr.getDB(0);
        redisDB.MULTI()
            .DEL(key)
            .EXPIRE(key,'100')
            .SET(key,'value')
            .EXPIRE(key,'100')
            .TTL(key)
            .EXPIREAT(key,'1447317317')/*2015.11.11的时间戳*/
            .TTL(key)
            .EXEC(function(err, res){
                for(var i = 0; i != res.length; ++i )
                {
                    logger.debug(res[i]);
                }
                /*输出
                 *0
                 * 0
                 * OK
                 * 1
                 * 100
                 * 1
                 * 86004
                 */
            });
    }

     /**
      * 测试 MIGRATE 函数
      * @param []
      * @returns []
      */
     DemoRedis.prototype.migrate = function()
     {
         var key = _dbConnArr.joinKey('string');
         var redisDB = _dbConnArr.getDB(0);

         redisDB.MULTI()
             .DEL(key)
             .SET (key,'hello from 6379')
             .MIGRATE ('127.0.0.1','7777','key,0,1000')
             .EXISTS (key)
             .EXEC(function(err,res){
                 for(var i = 0; i < res.length; ++i )
                 {
                     logger.debug(res[i]);
                 }
             });
     }


    /**
     * 测试 keys 函数
     * @param []
     * @returns []
     */
    DemoRedis.prototype.keys = function(){
        var key = _dbConnArr.joinKey('string');
        var redisDB = _dbConnArr.getDB(0);
        redisDB.MULTI()
            .DEL(key)
            .MSET('one','1','two','2','three','3','four','4')
            .KEYS('*o*')
            .KEYS('t??')
            .KEYS('*')
            .EXEC(function(err, res){
                for(var i = 0; i != res.length; ++i)
                {
                   logger.debug(res[i]);
                }
                /*输出
                * 1
                * OK
                * 'four'
                * 'two'
                * 'one'
                * 'two'
                * 'four'
                * 'three'
                * 'two'
                * 'one'
                * */
            });
    };

    DemoRedis.prototype.hset1 = function() {
        var key = 'hashTest';
        var redisDB = _dbConnArr.getDB(0);

        redisDB.MULTI()
            .HSET(key, 4, '4444444444')
            .HSET(key, 2, '2')
            .HSET(key, 3, '333333333333333333333')
            .HSET(key, 1, '111111')
            .HVALS(key)
            .DEL(key)
            .EXEC(function(err, res) {
                for(var i = 0; i < 6; ++i) {
                    console.log(res[i]);
                }
        });
    };

    /**
     * 返回构造函数
     */
    return DemoRedis;
})();


/**
 * 测试功能
 */
var demo = new DemoRedis();
demo.migrate();