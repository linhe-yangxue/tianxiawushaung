/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：将json文件中，相关激活码及激活码礼包数据，导入redis中。
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

var import_activation_code = function(){
    var client = null;
    var isDBHaveErr = false;
    async.waterfall([
        /* 获取redis配置 */
        function(callback) {
            dbManager.loadLogicDB(cfgRedis, false);
            client = dbManager.getGlobalRedisClient().getDB(0);
            callback(null);
        },
        /*读文件*/
        function(callback){
            fs.exists(config.fileName, function(isExist){
                if(!isExist){
                    console.log("json file not exist.file_name:" + config.fileName);
                    callback(errNum);
                }
                else {
                    var data = fs.readFileSync(config.fileName, 'utf-8');
                    if(data.length <= 0){/*读出的数据是空的*/
                        console.log("json file connect is null.");
                        callback(errNum);
                    }
                    else{
                        var jsonContent = JSON.parse(data);
                        var key1 = redisKey.keyStringActivationGiftId;
                        if(jsonContent[key1]){
                            client.SET(key1, jsonContent[key1], function(err){
                                if(err){
                                    console.log("SET keyStringActivationGiftId Error :" + err);
                                    isDBHaveErr = true;
                                }
                            });
                        }

                        var key2 = redisKey.keyHashActivationGift;
                        if(jsonContent[key2]){
                            client.HMSET(key2, jsonContent[key2], function(err){
                                if(err){
                                    console.HMSET("SET keyHashActivationGift Error :" + err);
                                    isDBHaveErr = true;
                                }
                            });
                        }

                        var key3 = redisKey.keyHashActivationCode;
                        if(jsonContent[key3]){
                            client.HMSET(key3, jsonContent[key3], function(err){
                                if(err){
                                    console.HMSET("SET keyHashActivationGift Error :" + err);
                                    isDBHaveErr = true;
                                }
                            });
                        }
                        if(isDBHaveErr){
                            callback(errNum);
                        }
                        else{
                            callback(null);
                        }
                    }
                }
            })
        }
    ], function(err) {
        if (err < 0) {
            console.log("import_activation_code fail.");
        }
        else {
            console.log("import_activation_code success.");
        }
    });
};
import_activation_code();

