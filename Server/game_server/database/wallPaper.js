/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：玩家游戏的操作的走马灯数据库操作
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var dbManager = require("../../manager/redis_manager").Instance();
var csvManager = require('../../manager/csv_manager').Instance();
var redisKey = require('../../common/redis_key');
var redisClient = require('../../tools/redis/redis_client');
var retCode = require('../../common/ret_code');
var cZuid = require('../common/zuid');
var itemType = require("../common/item_type");
var async = require('async');
var playerDb = require('./player');

const MEMBERS = 200;

/**
 * 更新播报玩家游戏行为的走马灯信息
 * @param zid [int] 合区后的区id
 * @param zuid [string] 角色id 由合区前的区id拼上uid而成
 * @param player [object] 玩家数据
 * @param propTid [int]
 * @param type [int] 走马灯信息类型
 * @param itemArr [array]
 */
function updateRollingWallPaper (zid, zuid, player, propTid, type, itemArr) {
    var tidArr = [];
    var tids = [];
    var tableConfig = null;
    for(var i = 0, itemObject;itemObject = itemArr[i]; ++i) {
        tidArr[i] = itemObject.tid;
    }
    if(0 >= tidArr.length) {
        return;
    }
    if( itemType.MAIN_TYPE_PET == itemType.getMainType(tidArr[0])) {
        tableConfig = csvManager.ActiveObject();
        tids = tidArr.filter(function(tid) {
            return  tableConfig[tid] && (tableConfig[tid].STAR_LEVEL >= 4 || tableConfig[tid].APTITUDE_LEVEL >= 10);
        });
    } else if(itemType.getMainType(tidArr[0]) == itemType.MAIN_TYPE_EQUIP ||
        itemType.getMainType(tidArr[0]) == itemType.MAIN_TYPE_MAGIC) {
            tableConfig = csvManager.RoleEquipConfig();
            tids = tidArr.filter(function(tid) {
                return  tableConfig[tid] && (tableConfig[tid].QUALITY >= 4);
            });
    }
    if(0 >= tids.length) {
        return;
    }

    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(zuid)[0];
    var key = redisClient.joinKey(redisKey.keySortedSetWallPaperByZid,  preZid);
    var score = Date.now();
    var wallPaper = {};

    wallPaper.type = type; /* 走马灯信息类型 */
    wallPaper.name = player.name;
    wallPaper.tidArr = tids; /*获取到的道具tid数组  */
    wallPaper.propId = propTid; /* 当使用宝箱时该字段为宝箱tid */
    wallPaper.charTid = player.character.tid; /* 主角tid */
    wallPaper.score = score;
    async.waterfall([
        function(cb) {
            redisDB.ZCARD(key, cb);
        },
        function(num, cb) {
            num = num ? num : 0;
            if(num > MEMBERS) {
                var client = redisDB.MULTI();
                client.DEL(key);
                client.ZADD(key, score, JSON.stringify(wallPaper));
                client.EXEC(function(err) {});
            } else {
                redisDB.ZADD(key, score, JSON.stringify(wallPaper));
            }
            cb(null);
        }
    ],function(err) {});

}

/**
 * 获取玩家游戏行为的走马灯信息
 * @param zid [int] 合区后的区id
 * @param zuid [string] 角色id 由合区前的区id拼上uid而成
 * @param callback [function] 回调函数
 */
function getRollingWallPaper(zid, zuid, callback) {
    var redisDB = dbManager.getZoneRedisClient().getDB(zid);
    var preZid = cZuid.zuidSplit(zuid)[0];
    var key =redisClient.joinKey(redisKey.keySortedSetWallPaperByZid, preZid);
    var key1 = redisClient.joinKey(redisKey.keyStringWallPaperTimerByZuid, zuid);
    async.waterfall([
        function(cb) {
            redisDB.GET(key1,cb);
        },
        function(time, cb) {
            time = time ? time : 0;
            var now  = Date.now();
            redisDB.ZRANGEBYSCORE(key, '('+time, now, cb);
        },
        function(array, cb) {
            /* 随机获取一个走马灯信息 */
            var index = parseInt(Math.random()*(array.length));
            var wallPaper = array[index] ? JSON.parse(array[index]) : null;
            cb(null, wallPaper);
            if(wallPaper) {
                redisDB.SET(key1, wallPaper.score);
            }
        }
    ],function(err, wallPaper) {
        wallPaper = wallPaper ? wallPaper : null;
       callback(err, wallPaper);
    });
}

module.exports = {
    updateRollingWallPaper : updateRollingWallPaper,
    getRollingWallPaper : getRollingWallPaper
};

