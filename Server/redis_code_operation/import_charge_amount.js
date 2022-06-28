
/**
 *包含的头文件
 */
var redis = require('redis');
var fs = require('fs');
var async = require('async');
var redisKey = require('../common/redis_key');
var cfgRedis = require('../../server_config/redis.json');

(function import_charge_amount () {
    var client = redis.createClient(cfgRedis.globalRedis.port, cfgRedis.globalRedis.ip);
    if(cfgRedis.globalRedis.pwd != '') {
        client.auth(cfgRedis.globalRedis.pwd);
    }

    async.waterfall([
        function(callback) {
            var key = redisKey.keyHashRechargeAmount;
            fs.exists('charge.json',  function(isExist) {
                if(!isExist) {
                    callback('There is no such file!');
                    return;
                }
                var data = fs.readFileSync('charge.json', 'utf-8');
                if(data.length <= 0) {
                    callback('File is empty!');
                    return;
                }
                data = JSON.parse(data);
                /* 将数据写入Redis */
                client.HMSET(key,  data[key], function(err) {
                    if(err) {
                        callback('Err happened when writing !');
                        return;
                    }
                    callback(null);
                });
            });
        }
    ], function(err) {
        if(err) {
            console.log(err);
            return;
        }
        console.log("import successfully!");
    });
})();

