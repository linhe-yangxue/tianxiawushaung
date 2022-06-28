
/**
 *包含的头文件
 *
 */
var async = require('async');
var retCode = require('../../common/ret_code');
var csvManager = require('../../manager/csv_manager').Instance();
var monthCardDb = require('../database/activity/month_card');
var timeUtil = require('../../tools/system/time_util');
var dateFormat = require('dateformat');

/**
 *
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param index [index] 配表索引
 * @param cb [function] 回调函数 返回是否可领取 null:可领取 err:不可领取
 */
var getMonthCard = function(zid, uid, index, cb) {
    var ChargeConfig = csvManager.ChargeConfig();
    async.waterfall([
        function(callback) {
            if(null == ChargeConfig[index] || 0 == ChargeConfig[index].IS_CARD) { /* 拦截无效索引 */
                callback(retCode.INVALID_INDEX);
                return;
            }
            monthCardDb.getMonthCardDate(zid, uid, index, callback);
        },
        function(dateStr, callback) {
            var date = new Date().toDateString();
            var todayDate = new Date(dateFormat(date, 'yyyy-mm-dd')); /* 今日日期 */
            var deadDate = new Date(dateStr);
            var diff = (deadDate - todayDate) / 1000 / 3600 / 24; /* 获取月卡剩余天数 */
            if(diff <= 0) {
                callback(retCode.NO_MONTH_CARD);
                return;
            }
            callback(null);
        },
        function(callback) {
            monthCardDb.receiveBefore(zid, uid, index, function(err, flag) {
                if(err) {
                    callback(err);
                    return;
                }
                if(!flag) {
                    callback(retCode.MONTH_CARD_RECEIVED);
                    return;
                }
                callback(null);
            });
        }
    ],function(err) {
        cb(err);
    });
};
exports.getMonthCard = getMonthCard;

/**
 *检查是否有大小月卡
 * @param zid [int] 区ID
 * @param uid [int] 用户ID
 * @param cb [function] 回调两个参数 cheapCard值的意义 0:没有月卡 1:有月卡且可以领取 2:有月卡已领取 expensiveCard
 * 的意义和cheapCard一样
 */
var monthCardCheck = function(zid, uid, cb) {
    var cheapCard = 0;
    var expensiveCard = 0;
    var date = new Date().toDateString();
    async.waterfall([
        function(callback) {
            monthCardDb.getMonthCardsDates(zid, uid, 1, 2, callback);
        },
        /* 是否有购买大小月卡 */
        function(array, callback) {
            var cheapDeadDate = new Date(array[0]);
            var expensiveDeadDate = new Date(array[1]);
            var  todayDate = new Date(dateFormat(date, 'yyyy-mm-dd'));
            var diff = (cheapDeadDate - todayDate) / 1000 / 3600 / 24;
            if(diff > 0) {
                cheapCard = 1;
            }
            diff = (expensiveDeadDate - todayDate) / 1000 / 3600 / 24;
            if(diff > 0) {
                expensiveCard = 1;
            }
            callback(null);
        },
        /* 获取上次请求时间 */
        function(callback) {
            var nowTime = parseInt(Date.now() / 1000);
            monthCardDb.getSetFreshTime(zid, uid, nowTime, callback);
        },
        /* 根据零点是否重置月卡领取 */
        function(time, callback) {
            var zeroTime = timeUtil.getDetailTime(date, 0);
            monthCardDb.getCardInfo(zid, uid, time, zeroTime, callback);
        },
        /* 判断月卡是否已领取更改状态 */
        function(arr, callback) {
            if(arr.indexOf(1) >= 0) {
                cheapCard = 2;
            }
            if(arr.indexOf(2) >= 0) {
                expensiveCard = 2;
            }
            callback(null);
        }
    ], function(err) {
        if(err) {
            cb(err);
            return;
        }
        cb(null, cheapCard, expensiveCard);
    });
};
exports.monthCardCheck = monthCardCheck;
