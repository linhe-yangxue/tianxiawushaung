var async = require('async');
var csvManager = require('../../manager/csv_manager').Instance();
var singleRechargeDb = require('../database/single_recharge');


function getBeginEndTime() {
    var tt = csvManager.OpenTime()[112].Condition.split('|');
    tt[0] = parseInt(tt[0]);
    tt[1] = parseInt(tt[1]);

    return tt;
}
exports.getBeginEndTime = getBeginEndTime;

/**
 * 是否在单冲活动时间
 * @timeStamp [int] Uinx时间戳(秒)
 * @returns [bool]
 */
function isInSingleRechargeTime(timeStamp) {
    var tt = getBeginEndTime();
    return (tt[0] <= timeStamp && timeStamp <= tt[1]);
}
exports.isInSingleRechargeTime = isInSingleRechargeTime;

/**
 * 初始化单冲状态
 * @param zid 区Id
 * @param zuid 用户Id
 * @param callback 返回错误码
 */
function refreshSingleRecharge(zid, zuid, callback) {
    async.waterfall([
        function(cb) {
            singleRechargeDb.getLastRechargeTime(zid, zuid, cb);
        },

        function(lastTime, cb) {
            if(isInSingleRechargeTime(lastTime)) {
                cb(null);
            }
            else {
                singleRechargeDb.delAllSingleRecharges(zid, zuid, cb);
            }
        },

        function(cb) {
            var now = parseInt(Date.now() / 1000);
            singleRechargeDb.setLastRechargeTime(zid, zuid, now);
            cb(null);
        }
    ], callback);
}
exports.refreshSingleRecharge = refreshSingleRecharge;

/**
 * 更新单冲记录
 * @param zid 区Id
 * @param zuid 用户Id
 * @param chargeIndex 充值表序号
 */
function addSingleRecharge(zid, zuid, chargeIndex) {
    var sreTable = csvManager.SingleRechargeEvent();

    async.waterfall([
        function(cb) {
            refreshSingleRecharge(zid, zuid, cb);
        },

        function(cb) {
            /* 判断是否在单冲活动时间内 */
            var now = parseInt(Date.now() / 1000);
            if(!isInSingleRechargeTime(now)) {
                cb(1); /* 结束函数 */
                return;
            }

            /* 获取单冲活动序号 */
            var sreIndex;
            for(var i in sreTable) {
                if(sreTable[i].CHARGE_INDEX == chargeIndex) {
                    sreIndex = parseInt(i);
                    break;
                }
            }
            if(null == sreIndex) {
                cb(1); /* 结束函数 */
                return;
            }

            singleRechargeDb.getSingleRecharge(zid, zuid, sreIndex, cb);
        },

        function(sr, cb) {
            if(sreTable[sr.index].REWARDE_TIME_MAX > sr.rechargeCnt) {
                sr.rechargeCnt += 1;
                singleRechargeDb.setSingleRecharge(zid, zuid, sr);
            }
            cb(null);
        }
    ]);
}
exports.addSingleRecharge = addSingleRecharge;
