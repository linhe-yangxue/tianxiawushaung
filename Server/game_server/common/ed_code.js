var threeDes = require('./crypto.js').Crypto;
var shaOne = require('./crypto_sha').sha1;
var retCode = require('../../common/ret_code.js');
//var http = require('../../tools/net/http_server/http_protocol_base').impl;

function recvDecode(protocolLine) {
    // console.log("protocolLine :" +protocolLine);
    // protocolLine = protocolLine.substr(protocolLine.indexOf("PHO") + 3);
    //
    // if (protocolLine < 41) {
    //     return "";
    // }
    console.log("protocolLine :" +protocolLine);
    return protocolLine;

    // var strBuffer = new Buffer(protocolLine, "base64");
    // var shaBuffer = new Buffer(40);
    // strBuffer.copy(shaBuffer, 0, strBuffer.length - 15, strBuffer.length);
    // strBuffer.copy(shaBuffer, 15, 0, 25);
    // var tripleDES = new Buffer(strBuffer.length - 40);
    // strBuffer.copy(tripleDES, 0, 25, 25 + tripleDES.length + 1);
    // console.log("tripleDES :" +tripleDES);
    // var strTripleDES = threeDes.Decode(tripleDES);
    // console.log("strTripleDES :" +strTripleDES);
    // var strSha = shaBuffer.toString("utf8");
    // var strCurrSha = shaOne(strTripleDES);
    //
    // if (strSha != strCurrSha) {
    //     return "";
    // }
    // console.log("strTripleDES :/" +strTripleDES);
    // return "/" + strTripleDES;
}

function sendEncode(protocolLine) {
    return protocolLine;
    // var strCurrSha = shaOne(protocolLine);
    // var bufSha = new Buffer(strCurrSha);
    // var bufDes = threeDes.Encode(protocolLine);
    // var bufStr = new Buffer(bufSha.length + bufDes.length);
    // bufSha.copy(bufStr, 0, bufSha.length - 25, bufStr.length);
    // bufDes.copy(bufStr, 25, 0, bufDes.length);
    // bufSha.copy(bufStr, bufStr.length - 15, 0, bufSha.length - 14);
    // //console.log("result =" +"PHO" + bufStr.toString("base64"));
    // return "UHE" + bufStr.toString("base64");
}

exports.recvDecode = recvDecode;
exports.sendEncode = sendEncode;

//sendEncode("CS_TestTry?{\"tk\":\"90e58832db088b904ca15ccac35053b5\",\"zid\":\"1\",\"zuid\":\"1:16\"}");
