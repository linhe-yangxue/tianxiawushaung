var schedule = require('node-schedule');
var redisKey  = require('../../common/redis_key');
var logger = require('../../manager/log4_manager');
var async = require('async');
var accountDb = require('../database/account');
var rollPlayingDb = require('../database/roll_playing');
var biCode = require('../../common/bi_code');
var customMadeMailDb = require('../database/custom_made_mail');

var setTimers = function() {
    setInterval( rollPlayingDb.timerUpdateRollPlayingList, 600*1000); /*10min*/
    beginStatisticsOnlineNum();/*统计在线人数*/
    setInterval( delCustomMadeMail, 600*1000); /*10min,删除过期的定制邮件*/
};
exports.setTimers = setTimers;

/**
 * 因每个服务器集群，在线人数打点的event_time必须相同，因此，
 * 从每日0时0分0秒开始，每隔五分钟记一次日志。
 */
var beginStatisticsOnlineNum = function(){
    var arrMinute = [];
    for(var i=0; i<59; i+=5){
        arrMinute.push(i);
    }
    var rule = new schedule.RecurrenceRule();
    rule.minute = arrMinute;
    rule.second = 0;
    schedule.scheduleJob(rule, function() {
        statisticsOnlineNum();
    });
};

/**
 * 统计在线人数写BI
 */
var statisticsOnlineNum = function() {
    var mapZidChannelStr = {};/*map<zid,array['区Id:渠道']>*/
    var now = new Date();
    var timeStr = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
    async.waterfall([
        /*获取所有区id*/
        function(callback) {
            accountDb.getAllZoneId(callback);
        },
        /*赋值mapZidChannelStr*/
        function(zidList, callback) {
            async.eachSeries(zidList, function(zid, eachCb) {
                accountDb.getChannelsInZone(zid, function(err, arrChannels){
                    var arr = [];
                    for(var i=0; i<arrChannels.length; i++){
                        arr.push(zid + ':' + arrChannels[i]);
                    }
                    if(arr.length > 0){
                        mapZidChannelStr[zid] = arr;
                    }
                    eachCb(null);
                })
            }, callback);
        },
        /*查在线人数*/
        function(callback){
            async.eachSeries(mapZidChannelStr, function(arr, eachCb) {
                accountDb.getResetZoneOnlinePlayerCnt(arr, function(err, arrChannels){
                    for(var j=0; j<arrChannels.length; j+=2){
                        var arrKey = arr[j/2].split(':');
                        /* 写BI */
                        logger.logBIHaveTime(arrKey[0], biCode.logs_online_users, timeStr, arrKey[0], arrKey[1], 0, parseInt(arrChannels[j]/10));
                        if(arrChannels[j+1] != 'OK'){
                            /*记错误日志*/
                            logger.LoggerGm.error("reset onlineNum fail, key=", arr[j/2]);
                        }
                    }
                    eachCb(null);
                })
            }, callback);
        }
    ], function() {});
};

/**
 * 删除过期的定制邮件
 */
var delCustomMadeMail = function(){
    var newUtcTime = parseInt(new Date().getTime() / 1000);
    async.waterfall([
        /*获取所有区id*/
        function(callback) {
            accountDb.getAllZoneId(callback);
        },

        function(zidList, callback) {
            async.eachSeries(zidList, function(zid, eachCb) {
                customMadeMailDb.getAllCustomMadeMail(zid, newUtcTime, function(err, arrMails){
                    var arr = [];
                    for(var i=0; i<arrMails.length; i+=2){
                        if(arrMails[i].endTime <= newUtcTime){
                            arr.push(arrMails[i]);
                        }
                    }
                    if(arr.length > 0){
                        customMadeMailDb.delCustomMadeMail(zid, arr);
                    }
                    eachCb(null);
                })
            }, callback);
        }
    ], function() {});
};
