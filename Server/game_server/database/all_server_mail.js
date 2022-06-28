/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：全服邮件
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：要有定时器，定时检查全服邮件集合中，是否有可删的，有的话直接删除。
 * ---------------------------------------------------------------------------------------------------------------------
 */
/**
 * 包含的头文件
 */
var async = require('async');
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var dbManager = require('../../manager/redis_manager').Instance();
var accountDb = require('./account');

/**
 * 添加全服邮件
 * @param preZid [int] 原区ID
 * @param mail 需要保存的全服邮件对象，AllServerMailInfo
 * @param callback [func] 返回错误码或null
 */
function insertAllServerMail(preZid, mail, callback) {
    var redisDB;

    async.waterfall([
        function(cb) {
            accountDb.getZoneInfo(preZid, cb);
        },

        function(zoneInfo, cb) {
            redisDB = dbManager.getZoneRedisClient().getDB(zoneInfo.areaId);
            cb(null);
        },

        function(cb) {
            var key = redisClient.joinKey(redisKey.keyStringAllServerMailId,preZid);

            redisDB.INCR(key,function(err, id) {
                if(err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                cb(null, id);
            });
        },

        function(id, cb) {
            var key = redisClient.joinKey(redisKey.keyHashAllServerMailByZid, preZid);
            mail.mailId = id;
            redisDB.HSET(key, id, JSON.stringify(mail), function (err) {
                if (err) {
                    cb(retCode.DB_ERR);
                    return;
                }
                cb(null);
            });
        }
    ], callback);
}
exports.insertAllServerMail = insertAllServerMail;
