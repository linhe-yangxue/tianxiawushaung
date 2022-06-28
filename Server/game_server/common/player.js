var async = require('async');
var protocolObject = require('../../common/protocol_object');
var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var playerDb = require('../database/player');
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var cPackage = require('../common/package');
var packageDb = require('../database/package');
var pointStarDb = require('../database/point_star');
var cPower = require('../common/power');
var retCode = require('../../common/ret_code');

/**
 * 根据zid和uid获取公会成员基础对象
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param callback [object] 返回公会成员基础对象
 */
exports.getPlayerGuildInfo = function getPlayerGuildInfo(zid, zuid, callback) {
    var obj = new protocolObject.GuildMemberBaseObject();

    async.waterfall([
        function(callback) {
            playerDb.getPlayerData(zid, zuid, false,callback);
        },

        /* 设置player属性 */
        function(player, callback) {
            obj.zuid = zuid;
            obj.nickname = player.name;
            obj.level = player.character.level;
            obj.power = player.power;
            obj.unionContr = player.unionContr;
            obj.todayWorship = player.todayWorship;
            obj.iconIndex = player.character.tid;

            playerDb.getLastHBTime(zid, zuid, callback);
        },

        /* 设置最后登出时间 */
        function(lastHBTime, callback) {
            obj.time = lastHBTime + 60;
            callback(null);
        }
    ], function(err) {
        callback(err, obj);
    });
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取玩家战斗信息
 * @param zid [int] 区Id
 * @param zuid [int] 玩家Id
 * @param callback [func] 返回错误码和玩家战斗信息
 */
exports.getPlayerFightDetail =  function getPlayerFightDetail(zid, zuid, callback) {
    var starTail = 0;
    async.waterfall([
        function(cb) {
            pointStarDb.getPointStarIndex(zid, zuid, function(err, result) {
                if(err) {
                    cb(err);
                    return;
                }
                starTail = result;
                cb(null);
            });
        },

        function(cb) {
            packageDb.getPlayerAndPackages(zid, zuid, false, cb);
        },

        function(pap,  cb) {
            var playerFD = new globalObject.PlayerFightDetail();
            cPower.updatePower(starTail, pap, playerFD.petFDs);
            playerFD.name = pap[0].name;
            playerFD.level = pap[0].character.level;
            playerFD.power = pap[0].power;
            cb(null, playerFD);
        }
    ], function(err, result) {
        callback(err, result);
    });
};

/**
 * 获取上阵宠物
 * @param zid [int] 区Id
 * @param zuid [int] 用户Id
 * @param callback [func] 返回错误码[int] (retCode)和宠物对象(ItemPet)数组[arr]
 */
exports.getPetsInBattle =  function getPetsInBattle(zid, zuid, callback) {
    async.waterfall([
        function(cb) {
            packageDb.getPackage(zid, zuid, globalObject.PACKAGE_TYPE_PET, false, cb);
        },

        function(pkg, cb) {
            var pets = [];
            for(var i = 0; i < pkg.content.length; ++i) {
                var pet = pkg.content[i];
                if(pet.teamPos > 0 && pet.teamPos < 4) {
                    pets.push(pet);
                }
            }
            cb(null, pets);
        }

    ], function(err, pets) {
        if(err) {
            callback(err);
        }
        else {
            callback(null, pets);
        }
    })
};

/**
 * 检查主角Tid
 * @param index
 * @param callback
 */
exports.checkChaModel = function checkChaModel(index, callback) {
    var chaList = csvManager.ActiveObject();
    if(chaList[index] && chaList[index].CLASS == "CHAR") {
        callback(null);
    }
    else {
        callback(retCode.TID_NOT_EXIST);
    }
};

/**
 * 检查玩家名是否合法
 * @param name
 * @param callback
 */
exports.checkPlayerName = function checkPlayerName(name, callback) {
    if(name.length < 1 || name.length > 8) {
        callback(retCode.NAME_TOO_LONG);
        return;
    }

    if(!isNaN(name)) {
        callback(retCode.NAME_ILLEGAL);
        return;
    }

    var banList = csvManager.BanedTextConfig();
    for(var index in banList) {
        var word = banList[index].BANEDLIST.trim();
        if ( word.length == 0 ) {
            continue;
        }
        if (name.indexOf(word) != -1) {
            callback(retCode.NAME_ILLEGAL);
            return;
        }
    }

    var pattern = /[^\u4e00-\u9fa5\w\d]/;
    if(pattern.test(name)) {
        callback(retCode.NAME_ILLEGAL);
    }
    else {
        callback(null);
    }
};
