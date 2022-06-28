/**
 * Created by Administrator on 2016/1/14.
 */

//var request = require('request');
var http = require('http');
var schedule = require('node-schedule');

var req_str = 'eyJ2cyI6IjAuNy44IiwicGkiOjAsInB0IjoiQ1NfQXBwTGF1bmNoIiwiZGV2aWNlSWQiOiI4M2YzNDM1YmI1YTNhNjcxNDk0OTAxYTYwZTEzMWVkNzhjMzIzZiIsImNoYW5uZWwiOiIxIiwiaXAiOiIxMjcuMC4wLjEiLCJjbGllbnRWZXJzaW9uIjoiMC43LjgiLCJzeXN0ZW1Tb2Z0d2FyZSI6ImFhYWEiLCJzeXN0ZW1IYXJkd2FyZSI6ImJiYmJiYmIiLCJtYWMiOiJjY2NjY2NjY2NjY2NjY2MifQ==';

var go = function(){
    http.get("http://10.0.0.212:8080/CS_AppLaunch?" + req_str,function(res){
        console.log('Got res:'+ res.statusCode);
    }).on('error',function(e){
        console.log('Got error:'+ e.message);
    });
};


var arrSecond = [];
for(var i=0; i<60; i+=1){
    arrSecond.push(i);
}
var rule = new schedule.RecurrenceRule();
rule.second = arrSecond;
schedule.scheduleJob(rule, function() {
    go();
});
