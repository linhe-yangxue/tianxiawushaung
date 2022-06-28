/**
 * Created by Administrator on 2016/1/11.
 */
var inherits = require('util').inherits;
var BattleCheck = require('./battle_check');
var playerDb = require('../../database/player');
var csvManager = require('../../../manager/csv_manager').Instance();
var retCode = require('../../../common/ret_code');
var async = require('async');
var robotCommon = require('../../../common/robot');
var arenaDb = require('../../database/arena');

var BattleCheckArena = function () {
    BattleCheck.call(this);
}

inherits(BattleCheckArena, BattleCheck);

BattleCheckArena.prototype.checkPlug = function (zid, uid, rivalUid, startTime, type, damage, cb) {
    async.waterfall([
        function(cb) {
            playerDb.getPlayerData(zid, uid, false, function (err, player) {
                if (!!err) {
                    cb(err);
                    return;
                }
                cb(null, player.power);
            });
        },
        function (principalPower, cb) {
            if(robotCommon.checkIfRobot(rivalUid)) {
                arenaDb.getArenaRobot(rivalUid, function (err, robot) {
                    if(!!err) {
                        cb(err);
                        return;
                    }
                    cb(null, principalPower, robot.power);
                });
            } else {
                playerDb.getPlayerData(zid, rivalUid, false, function (err, player) {
                    if (!!err) {
                        cb(err);
                        return;
                    }
                    cb(null, principalPower, player.power);
                });
            }
        },
        function (principalPower, rivalPower, cb) {
            //console.log('uid: ' + uid + ', rivalUid: ' + rivalUid + ', principalPower: ' + principalPower);
            //console.log('uid: ' + uid + ', rivalUid: ' + rivalUid + ', rivalPower: ' + rivalPower);
            if(principalPower >= rivalPower) {
                cb(null);
                return;
            }
            var bpTable = csvManager.BattleProve();
            for (var i in bpTable) {
                if (bpTable[i].TYPE == type && principalPower >= bpTable[i].MIN && principalPower <= bpTable[i].MAX) {
                    //console.log('principalPower / rivalPower: ' + principalPower / rivalPower + ', bpTable[i].NUM / 10000: ' + bpTable[i].NUM / 10000);
                    if(principalPower / rivalPower < bpTable[i].NUM / 10000) {
                        cb(retCode.USING_PLUG);
                        return;
                    }
                }
            }
            cb(null);
        }
    ], function (err) {
        cb(err);
    });
}
module.exports = BattleCheckArena;