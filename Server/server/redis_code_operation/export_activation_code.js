/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：导出redis中，相关激活码及激活码礼包数据，到code.json文件中。
 * ---------------------------------------------------------------------------------------------------------------------
 */

var redis = require('redis');
var fs = require('fs');
var config = require('./code_config.json');
var redisKey = require('../common/redis_key');
var async = require('async');
var dbManager = require("../manager/redis_manager").Instance();
var cfgRedis = require('../../server_config/redis.json');

var errNum = -1;/*因会输出错误信息，这里的错误码不重要*/

var export_activation_code = function(){
    var client = null;
    var jsonContent = {};/*要写入json的数据*/

    async.waterfall([
        /* 获取redis配置 */
        function(callback) {
            dbManager.loadLogicDB(cfgRedis, false);
            client = dbManager.getGlobalRedisClient().getDB(0);
            callback(null);
        },
        /*获取激活码ID自增*/
        function(callback){
            var key = redisKey.keyStringActivationGiftId;
            client.GET(key, function(err, data) {
                if(err) {
                    console.log("GET keyStringActivationGiftId Error :" + err);
                    callback(errNum);
                }
                else {
                    jsonContent[key] = data;
                    callback(null);
                }
            });
        },
        /*获取所有激活码礼包信息*/
        function(callback){
            var key = redisKey.keyHashActivationGift;
            client.HGETALL(key, function(err, data) {
                if(err) {
                    console.log("HGETALL keyHashActivationGift Error :" + err);
                    callback(errNum);
                }
                else {
                    jsonContent[key] = data;
                    callback(null);
                }
            });
        },
        /*获取所有激活码信息*/
        function(callback){
            var key = redisKey.keyHashActivationCode;
            client.HGETALL(key, function(err, data) {
                if(err) {
                    console.log("HGETALL keyHashActivationCode Error :" + err);
                    callback(errNum);
                }
                else {
                    jsonContent[key] = data;
                    callback(null);
                }
            });
        },
        /*写文件*/
        function(callback){
            fs.writeFile(config.fileName, JSON.stringify(jsonContent), function(err){
                if(err){
                    console.log('fs.writeFile fail.err:' + err);
                    callback(errNum);
                }
                else{
                    callback(null);
                }
            });
        }
    ], function(err) {
        if (err < 0) {
            console.log("export_activation_code fail.");
        }
        else{
            console.log("export_activation_code success.");
        }
    });
};
export_activation_code();

