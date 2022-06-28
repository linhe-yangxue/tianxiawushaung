var async = require('async');
var globalObject = require('../../common/global_object');
var math = require('../../tools/system/math');
var demonBossDb = require('../database/demon_boss');
var csvManager = require('../../manager/csv_manager').Instance();
var retCode = require('../../common/ret_code');
var cMission = require('./mission');
var packageDb = require('../database/package');
var playerDb = require('../database/player');

/**
 * 常量
 */
const DEMON_BOSS_STAY_TIME = 7200; /* 天魔停留时间 */

/**
 * 发现新的天魔
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param bossBirthConfig [object] bossBirthConfig配置
 * @param callback [func] 返回天魔tid
 * @returns []
 */
var findNewDemonBoss = function(zid, zuid, bossBirthIndex, callback) {
    var bossBirthConfig = csvManager.BossBirth()[bossBirthIndex];
    var demonBoss;
    var bossReset = 0;
    var rcd;
    async.waterfall([
        function(cb) {
            demonBossDb.getDemonBossResetFlag(zid, zuid, cb);
        },

        function(flag, cb) {
            bossReset = flag;
            demonBossDb.getDemonBossRcd(zid, zuid, cb);
        },

        function(rcdCb, cb) {
            rcd = rcdCb;
            /* 已经有天魔 */
            if(getCurrentDemonBoss(rcd)) {
                cb(retCode.DEMON_BOSS_EXIST);
                return;
            }

            if(bossReset) { /* 天魔等级重置 */
                rcd.bossLevel = 1;
            }
            else { /* 天魔等级加一 */
                ++ rcd.bossLevel;
            }

            rcd.bossIndex = (rcd.bossIndex + 1) % rcd.bossAmt; /* 循环存储 */

            /* 创建新的天魔对象 */
            demonBoss = new globalObject.DemonBoss();
            /* 获取天魔品质 */
            var qualityWeightArray = [];
            for(var i = 1; i < 6; i++) {
                qualityWeightArray.push(bossBirthConfig['STAR' + i + '_WEIGHT']);
            }
            demonBoss.quality = math.getArrayIndexByWeigth(qualityWeightArray) + 1;
            demonBoss.tid = bossBirthConfig['STAR' + demonBoss.quality + '_BOSS'];
            /**/
            demonBoss.finderId = zuid;
            demonBoss.findTime = parseInt(Date.now() / 1000);
            demonBoss.hpLeft = csvManager.BossConfig()[80000 + demonBoss.quality * 1000 + rcd.bossLevel].BASE_HP;
            demonBoss.ifShareWithFriend = 0; /* 默认不共享天魔BOSS */
            demonBoss.standingTime = bossBirthConfig['STAR' + demonBoss.quality + '_TIME'];
            demonBoss.bossBirthIndex = bossBirthIndex;
            rcd.demonBoss[rcd.bossIndex] = demonBoss;
            demonBossDb.setDemonBossRcd(zid, zuid, rcd, cb);
        }
    ], function(err) {
        if(!err) {
            /* 更新任务进度 */
            cMission.updateDailyTask(zid, zuid, cMission.TASK_TYPE_23, 0, 1);
            cMission.updateAchieveTask(zid, zuid, cMission.TASK_TYPE_23, 0, 0, 1);
        }
        if(!demonBoss) {
            callback(null, demonBoss);
            return;
        }
        demonBoss.bossLevel = rcd.bossLevel;
        demonBoss.hpBase = demonBoss.hpLeft;
        playerDb.getPlayerData(zid, zuid, false, function(err, player) {
            if(!!err) {
                callback(err);
                return;
            }
            demonBoss.finderName = player.name;
            demonBoss.finderTid = player.character.tid;
            callback(null, demonBoss);
        });
    });
};


/**
 * 获取当前天魔
 * @param rcd [object] 发现天魔记录
 * @returns [object] 天魔对象
 */
var getCurrentDemonBoss = function(rcd) {
    var currentTime = parseInt(Date.now() / 1000);

    if(rcd.bossIndex >= 0) {
        var boss = rcd.demonBoss[rcd.bossIndex];

        if(boss.hpLeft > 0 && currentTime - boss.findTime < boss.standingTime) {
            return boss;
        }
    }

    return null;
};

/**
 * 天魔BOSS触发器
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param battleId [int] 关卡ID
 * @param player {object} 角色
 * @param res {object} 返回对象
 * @param cb {function} 返回错误码
 */
var demonBossTrigger = function (zid, zuid, battleId, player, res, cb) {
    var computeHitProbility = function (bossBirthConfig, cb) {
        async.waterfall([
            function (cb) {
                packageDb.getPackage(zid, zuid, globalObject.PACKAGE_TYPE_CONSUME_ITEM, false, cb)
            },

            /* 获取体力丹数量 */
            function (pkg, cb) {
                var staminaDanNum = 0;
                var hitDemonCard = 0;
                for(var i = 0; i < pkg.content.length; i++) {
                    /* 体力丹的itemId是2000013 */
                    if(2000013 === pkg.content[i].tid) {
                        staminaDanNum = pkg.content[i].itemNum;
                        continue;
                    }
                    /* 降魔令的itemId是2000015 */
                    if(2000015 === pkg.content[i].tid) {
                        hitDemonCard = pkg.content[i].itemNum;
                        continue;
                    }
                    if(staminaDanNum > 0 && hitDemonCard > 0) {
                        break;
                    }
                }
                cb(null, staminaDanNum, hitDemonCard);
            },

            /* 计算触发概率 */
            function (staminaDanNum, hitDemonCard, cb) {
                // boss触发概率公式: (基础概率 + 体力系数 * 体力 + 屠魔令系数 * 屠魔令数量 + 等级 * 等级系数）/ 10000 [体力=当前体力+体力丹数量*25]
                var hitRate = (bossBirthConfig.BASE_RATE + bossBirthConfig.TILI_RATE * (player.stamina + staminaDanNum * 25) +
                    bossBirthConfig.XIANGMOLING_RATE * hitDemonCard +
                    bossBirthConfig.LEVFEL_RATE * player.character.level);
                if(hitRate < bossBirthConfig.MIN_RATE) {
                    hitRate = bossBirthConfig.MIN_RATE
                }
                if(hitRate > bossBirthConfig.MAX_RATE) {
                    hitRate = bossBirthConfig.MAX_RATE;
                }
                cb(null, hitRate / 10000);
            }
        ], cb)
    };
    /*  */
    var bossBirthCsv = csvManager.BossBirth();
    for(var bossBirthIndex in bossBirthCsv) {
        var bossBirthConfig = bossBirthCsv[bossBirthIndex];
        if(player.character.level >= bossBirthConfig.LEVFEL_MIN && player.character.level <= bossBirthConfig.LEVFEL_MAX) {
            /* 触发概率 */
            computeHitProbility(bossBirthConfig, function (err, hitRate) {
                if(!!err) {
                    cb(err);
                    return;
                }
                if(player.character.level >= 35 && Math.random() < hitRate) {
                    findNewDemonBoss(zid, zuid, bossBirthIndex, function (err, demonBoss) {
                        res.demonBoss = demonBoss;
                        cb(null);
                    });
                    return;
                }
                cb(null);
            });
            return;
        }
    }
    cb(null);
}

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 发现新的天魔
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param callback [func] 返回天魔tid
 * @returns []
 */
exports.findNewDemonBoss = findNewDemonBoss;

/**
 * 获取当前天魔
 * @param rcd [object] 发现天魔记录
 * @returns [object] 天魔对象
 */
exports.getCurrentDemonBoss = getCurrentDemonBoss;

/**
 * 天魔BOSS触发器
 * @param zid [int] 区ID
 * @param zuid [int] 用户ID
 * @param battleId [int] 关卡ID
 * @param player {object} 角色
 * @param res {object} 返回对象
 * @param cb {function} 返回错误码
 */
exports.demonBossTrigger = demonBossTrigger;









