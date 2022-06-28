var crypto = require('crypto');
var os = require('os');
var fs = require('fs');
var async = require('async');


function sha1(str) {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str, 'utf8');
    str = md5sum.digest('hex');
    //console.log(str);
    return str;
}
exports.sha1 = sha1;
//var tmpBuffer = new Buffer(sha1('123456789'), "utf8");
//console.log(tmpBuffer);