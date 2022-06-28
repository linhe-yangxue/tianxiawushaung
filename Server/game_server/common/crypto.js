var crypto = require('crypto');
var os = require('os');
var fs = require('fs');
var async = require('async');

function CreateCipheriv(Crypto, data, encoding) {
    if(Crypto == null)
        return;
    if(typeof encoding === "undefined")
        encoding = "utf8";
    var tmpBuffer1 = Crypto.update(data, encoding);
    var tmpBuffer2 = Crypto.final();
    var tmpBuffer = new Buffer(tmpBuffer1.length + tmpBuffer2.length);
    tmpBuffer1.copy(tmpBuffer);
    tmpBuffer2.copy(tmpBuffer, tmpBuffer1.length);
    return tmpBuffer;
}

var cryp = (function (){

    function cryp() {
        //this.filePath = "./game_server/common/BytesDictionary";
        this.encKey = [];
        this.indexList = [];
        this.desCryptoData;


        var data = "53,223,177,252,67,167,191,222,187,39,199,112,75,229,133,140,55,162,7,22,161,141,18,212,7,182,195,128,13,197,114,28,125,236,219,134,140,26,128,76,95,114,73,193,205,251,110,81,103,153,150,17,181,60,65,154,195,87,99,24,220,148,81,158,150,198,225,189,15,30,205,84,117,163,89,169,204,220,54,185,235,207,165,205,200,48,224,78,246,210,181,218,108,97,116,151,136,83,11,200,84,28,112,158,7,161,63,80,207,240,165,110,205,46,124,114,97,208,183,152,169,15,1,239,68,149,161,176,92,125,161,207,227,122,47,209,28,86,67,221,94,159,130,21,21,157,99,39,9,134,144,30,227,245,143,127,237,153,161,145,25,42,234,252,69,162,211,149,189,169,173,121,1,81,151,89,201,3,161,20,71,186,49,139,172,110,166,177,237,212,60,225,199,68,47,117,1,250,36,148,241,130,196,75,65,110,170,223,243,74,127,98,163,210,99,133,12,98,143,173,206,173,57,73,111,178,184,98,159,236,233,115,192,201,209,124,165,94,132,82,154,89,69,57,165,55,238,180,12,183,147,156,23,142,98,112";
        this.desKey = data.split(",");
        //console.log(desKey);

        this.cryptoKey();
        this.cryptoMassage();
    }

    cryp.prototype.ConvertArrayToString = function(bytesArray, encoding) {
        if(typeof encoding === "undefined")
            encoding = "binary";
        var tmpBuffer = new Buffer(bytesArray);
        var a = tmpBuffer.toString(encoding);
        return a;
    };

    cryp.prototype.Encode = function(str) {
        var key = this.desCryptoData.key;
        var iv = this.desCryptoData.iv;
        var encoding = this.desCryptoData.encoding;
        var alg = this.desCryptoData.alg;
        var tmpDESEnBuffer = CreateCipheriv(crypto.createCipheriv(alg, key, iv), str, encoding);
        return tmpDESEnBuffer;
    };

    cryp.prototype.Decode = function(data) {
        var key = this.desCryptoData.key;
        var iv = this.desCryptoData.iv;
        var encoding = this.desCryptoData.encoding;
        var alg = this.desCryptoData.alg;
        var tmpDESDeBuffer = CreateCipheriv(crypto.createDecipheriv(alg, key, iv), data, encoding);
        return tmpDESDeBuffer.toString("utf8");
    };

    cryp.prototype.cryptoKey = function() {
        var indexNum = "66#39#102#80#252#191#74#108#102#176#198#140#42#48#187#203#39#222#230#224#157#245#81#173";
        this.indexList = indexNum.split("#");
        //console.log(indexList);
        /*取密钥*/
        for(var i = 0; i < this.indexList.length; i++){
            if( null != this.indexList[i]){
                var num = this.indexList[i];
                num = parseInt(num);
                this.encKey.push(parseInt(this.desKey[num]));
            }
        }
        //console.log(this.encKey);
    };
    cryp.prototype.cryptoMassage = function() {
        /*加密信息*/
        this.desCryptoData = {
            "alg" : "des-ede3",
            "key" : this.ConvertArrayToString(this.encKey),
            "iv" : this.ConvertArrayToString([]),
            "encoding" : "utf8"
        };
    };

    return cryp;
})();

exports.Crypto = new cryp();

