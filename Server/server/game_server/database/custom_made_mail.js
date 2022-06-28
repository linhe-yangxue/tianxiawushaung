/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：定制邮件相关
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */
/**
 * 包含的头文件
 */
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var async = require('async');
var dbManager = require('../../manager/redis_manager').Instance();
var accountDb = require('./account');

/**
 * 添加定制邮件
 * @param preZid [int] 原区ID
 * @param mail 需要保存的定制邮件对象，CustomMadeMailInfo
 * @param callback [func] 返回错误码或null
 */
function insertCustomMadeMail(preZid, mail, callback) {
    async.waterfall([
        function(cb) {
            accountDb.getZoneInfo(preZid, cb);
        },
        
        function(zoneInfo, cb) {
            var redisDB = dbManager.getZoneRedisClient().getDB(zoneInfo.areaId);
            var key = redisClient.joinKey(redisKey.keySortedCustomMadeMailByZid, preZid);
            redisDB.ZADD(key, mail.beginTime, JSON.stringify(mail), function (err) {
                if (err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                cb(null);
            });
        }
    ], callback);
}
exports.insertCustomMadeMail = insertCustomMadeMail;

/**
 * 查询所有定制邮件
 * @param preZid [int] 原区ID
 * @param nowTime [int] 时间
 * @param callback [func] 返回错误码或null,CustomMadeMailInfo对象
 */
function getAllCustomMadeMail(preZid, nowTime, callback) {
    async.waterfall([
        function(cb) {
            accountDb.getZoneInfo(preZid, cb);
        },

        function(zoneInfo, cb) {
            var redisDB = dbManager.getZoneRedisClient().getDB(zoneInfo.areaId);
            var key = redisClient.joinKey(redisKey.keySortedCustomMadeMailByZid, preZid);

            redisDB.ZRANGEBYSCORE(key, 0, nowTime, 'WITHSCORES', function (err, data) {
                if (err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                for(var i = 0; i < data.length; i++) {
                    data[i] = JSON.parse(data[i]);
                }
                cb(null, data);
            });
        }
    ],callback);
}
exports.getAllCustomMadeMail = getAllCustomMadeMail;

/**
 * 删除多个定制邮件
 * @param preZid [int] 原区ID
 * @param arrDelMail [arr] 要删除的邮件数组
 */
function delCustomMadeMail(preZid, arrDelMail) {
    async.waterfall([
        function(cb) {
            accountDb.getZoneInfo(preZid, cb);
        },

        function(zoneInfo, cb) {
            var redisDB = dbManager.getZoneRedisClient().getDB(zoneInfo.areaId);
            var key = redisClient.joinKey(redisKey.keySortedCustomMadeMailByZid, preZid);

            var client = redisDB.MULTI();
            for(var i = 0; i < arrDelMail.length; i++) {
                redisDB.ZREM(key, JSON.stringify(arrDelMail[i]));
            }
            client.EXEC();
            cb(null);
        }
    ]);
}
exports.delCustomMadeMail = delCustomMadeMail;
