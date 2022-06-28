/**
 * GM逻辑公共方法
 */

var crypto = require('crypto');
var logger = require('../../manager/log4_manager');
var gmCode = require('../../common/gm_code');
var retCode = require('../../common/ret_code');
var playerDb = require('../database/player');
var accountDb = require('../database/account');
var gmServer = require('../../gm_server.js');
/**
 * 验证sign
 * @param request [Object] 请求消息
 */
var checkSign = function(request) {
    /**
     * 规则：req的值（json格式字符串）先base64加密；再连接operatorid和密钥（appkey）的值，组成字符串
     * （base64（req）+operatorid +appkey）,再sha1加密生成签名。
    */

    var appkey = gmServer.publicKey;//公钥
    var req_base64 = new Buffer(JSON.stringify(request.req), 'base64');
    //var req_base64 = new Buffer(request.req, 'base64'); /* 测试专用 */
    var req_str = req_base64.toString();
    var signStr = req_str + String(request.operatorid) + appkey;

    var shaStr = crypto.createHash('sha1');
    shaStr.update(signStr);
    var sign = shaStr.digest('hex');

    if(sign && sign == request.sign) {
        return true;
    }
    else {
        logger.logGM(gmCode.GM_SIGN_REQ,JSON.stringify(request),0,0,0,0,false);
        logger.logGM(gmCode.GM_SIGN,sign,0,0,0,0,false);
        return false;
    }
};

/**
 * 获取uid, 填此acc字段，用账号查对应用户信息，没填，用用户名查对应用户信息
 * @param req [Object] 请求消息
 * @param callback [err, uid]
 */
var getUidByAccOrName = function(req, callback) {
    if(null != req.acc){
        accountDb.getUserAccountByChannelAcc(req.channel, req.acc, function(err, userAccount){
            if(err){
                callback(retCode.ERR);
            }
            if(userAccount){
                callback(null, userAccount.uid);
            }
            else{
                callback(retCode.ACCOUNT_NOT_EXIST);
            }
        });
    }
    else{
        playerDb.getZuidByPreZidName(req.zid, req.name, function(err, playerId){
            if(err){
                callback(retCode.ERR);
            }
            if(playerId){
                callback(null, playerId);
            }
            else{
                callback(retCode.PLAYER_NOT_EXIST);
            }
        });
    }
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 验证sign
 * @param request [Object] 请求消息
 * @param callback [err]
 */
exports.checkSign = checkSign;

/**
 * 获取uid, 填此acc字段，用账号查对应用户信息，没填，用用户名查对应用户信息
 * @param req [Object] 请求消息
 * @param callback [err, uid]
 */
exports.getUidByAccOrName = getUidByAccOrName;





















