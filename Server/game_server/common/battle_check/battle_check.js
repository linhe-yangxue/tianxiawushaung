/**
 * Created by Administrator on 2016/1/16.
 */
var csvManager = require('../../../manager/csv_manager').Instance();
var retCode = require('../../../common/ret_code');
var cPlayer = require('../../common/player');

var BattleCheck = function () {
    
}
/**
 * 检测外挂
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param startTime [int] 战斗开始时间
 * @param type [int] 战斗类型
 * @param damage [int] 对BOSS造成的伤害
 * @param cb [func] 返回错误码[int](retCode)
 */
BattleCheck.prototype.checkPlug = function (zid, uid, rivalUid, startTime, type, damage, cb) {
    //console.log('uid: ' + uid + ', rivalUid: ' + rivalUid + ', damage: ' + damage);
    cPlayer.getPlayerFightDetail(zid, uid, function (err, playerFightDetail) {
        if(!!err) {
            cb(err);
            return;
        }
        var attack = 0;
        for(var i = 0; i < playerFightDetail.petFDs.length; i++){
            var pet = playerFightDetail.petFDs[i];
            attack += pet.attack;
        }
        var bpTable = csvManager.BattleProve();
        for (var i in bpTable) {
            if (bpTable[i].TYPE == type && attack >= bpTable[i].MIN && attack <= bpTable[i].MAX) {
                if(damage  > attack * bpTable[i].NUM / 10000) {
                    cb(retCode.USING_PLUG);
                    return;
                }
            }
        }
        cb(null);
    });
}
module.exports = BattleCheck;