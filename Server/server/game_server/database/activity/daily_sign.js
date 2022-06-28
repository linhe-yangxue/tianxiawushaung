/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：每日签到：获取签到次数和时间，刷新签到次数,保存签到次数,只获取签到次数
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var redisKey = require('../../../common/redis_key');
var redisClient = require('../../../tools/redis/redis_client');
var retCode = require('../../../common/ret_code');
var dbManager = require('../../../manager/redis_manager').Instance();
var object =  require('../../../common/global_object');


/**
 *获取签到次数和时间
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param time [long] 时间戳 用于第一次获取签到状态
 * @param cb [func] 返回错误码[int](retCode) 和数据(签到次数和时间)
 * @returns []
 */
var getSign = function(zid, uid, time, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keySignState = redisClient.joinKey(redisKey.keyStringSignStateByZuid, uid);

    redisDB.GET(keySignState,function(err, sign) {
       if(err) {
           cb(retCode.DB_ERR);
           return;
       }
       if(null == sign) {
           var signObject = new object.Sign();
           signObject.signTime = time;
           cb(null, signObject);
       }
       else {
           cb(null, JSON.parse(sign));
       }
    });
};

/**
 *刷新签到次数
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param time [long] 时间戳
 * @param num [int] 签到次数
 * @param callback [func] 返回错误码[int](retCode) 和数据(签到次数)
 */
var refreshSign = function(zid, uid, time, num, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keySignState = redisClient.joinKey(redisKey.keyStringSignStateByZuid, uid);

    var signObject = new object.Sign();
    if(28 == num) {
        num = 1;
    }
    else {
        ++num;
    }
    signObject.signNum = num;
    signObject.signTime = time;
    signObject.isSign = 0;
    redisDB.SET(keySignState, JSON.stringify(signObject), function(err) {
        if(err) {
            callback(retCode.DB_ERR);
            return;
        }
        callback(null, signObject);
    });
};

/**
 *保存签到次数
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param sign [Sign] 签到对象
 */
var saveSign = function(zid, uid, sign) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keySignState = redisClient.joinKey(redisKey.keyStringSignStateByZuid, uid);

    redisDB.SET(keySignState, JSON.stringify(sign));
};

/**
 *获取签到时间和是否已经充值
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param time [long] 时间戳 用于第一次获取签到状态
 * @param cb [func] 返回错误码[int](retCode) 和数据(签到次数和时间)
 * @returns []
 */
var getLuxurySign = function(zid, uid, time, cb) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyLuxurySignState = redisClient.joinKey(redisKey.keyStringLuxurySignStateByZuid, uid);

    redisDB.GET(keyLuxurySignState, function(err, luxurySign){
       if(err) {
           cb(retCode.DB_ERR);
           return;
       }
        if(null == luxurySign) {
            var luxurySignObjcet = new object.LuxurySign();
            luxurySignObjcet.signTime = time;
            cb(null, luxurySignObjcet);
        }
        else {
            cb(null, JSON.parse(luxurySign));
        }
    });
};

/**
 *保存签到次数
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param luxurySign [Sign] 签到对象
 */
var saveLuxurySign = function(zid, uid, luxurySign) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var keyLuxurySignState = redisClient.joinKey(redisKey.keyStringLuxurySignStateByZuid, uid);

    redisDB.SET(keyLuxurySignState, JSON.stringify(luxurySign));
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *获取签到次数和时间
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param time [long] 时间戳 用于第一次获取签到状态
 * @param cb [func] 返回错误码[int](retCode) 和数据(签到次数和时间)
 * @returns []
 */
exports.getSign = getSign;

/**
 *刷新签到状态
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param time [long] 时间戳
 * @param num [int] 签到次数
 * @param callback [func] 返回错误码[int](retCode) 和数据(签到次数)
 */
exports.refreshSign = refreshSign;

/**
*保存签到次数
* @param zid [int] 区ID
* @param uid [int] 用户ID
* @param sign [Sign] 签到对象
* @param callback [func] 返回错误码[int](retCode)
*/
exports.saveSign = saveSign;

/**
 *获取签到时间和是否已经充值
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param time [long] 时间戳 用于第一次获取签到状态
 * @param cb [func] 返回错误码[int](retCode) 和数据(签到次数和时间)
 * @returns []
 */
exports.getLuxurySign = getLuxurySign;

/**
 *保存签到次数
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param sign [Sign] 签到对象
 */
exports.saveLuxurySign = saveLuxurySign;