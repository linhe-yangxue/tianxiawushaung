
/**
 *包含的头文件
 */

var redis = require('redis');
var fs = require('fs');
var async = require('async');
var redisKey = require('../common/redis_key');
var cfgRedis = require('../../server_config/redis.json');

var export_charge_amount = function() {
    var client = redis.createClient(cfgRedis.globalRedis.port, cfgRedis.globalRedis.ip);
    if(cfgRedis.globalRedis.pwd != '') {
        client.auth(cfgRedis.globalRedis.pwd);
    }

     var chargeJson = {};
    async.waterfall([
        function(callback) {
            client.HGETALL(redisKey.keyHashRechargeAmount, function(err,  data) {
                if(err) {
                    callback('Err happened when reading!');
                    return;
                }
                chargeJson[redisKey.keyHashRechargeAmount] = data;
                callback(null);
            });
        },
        function(callback) {
            fs.writeFile('charge.json',  JSON.stringify(chargeJson), function(err) {
                if(err) {
                    callback('Err happened when writing file!');
                    return;
                }
                callback(null);
            });
        }
    ], function(err) {
        if(err) {
            console.log(err);
            return;
        }
        console.log("export successfully!");
    });

};

export_charge_amount();

