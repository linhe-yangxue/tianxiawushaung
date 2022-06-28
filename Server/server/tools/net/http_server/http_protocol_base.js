/**
 * http 工具类
 */
var url = require('url');
var logger = require('../../../manager/log4_manager').LoggerGame;
var retCode = require('../../../common/ret_code');
var protocolBase = require('../../../common/protocol_base');
var cfgVersion = require('../../../../server_config/version.json');
var cfgControl = require('../../../../server_config/control.json');
var packageVerifyDb = require('../../../game_server/database/package_verify.js');
var ed_code = require('../../../game_server/common/ed_code').sendEncode;
const postLimitSize = 10240; /* post请求长度限制 */

(function () {

    /**
     * 检查版本号
     * @param v 客户端版本号
     * @returns {boolean} 是否支持
     */
    function chkVer(v) {
        if(null == v || typeof(v) != 'string') {
            return false;
        }

        var a = v.split('.');
        var b = cfgVersion.minVersion.split('.');

        if(a.length < b.length) {
            return false;
        }
        if(a.length > b.length) {
            return true;
        }

        for(var i = 0; i < a.length; ++i) {
            a[i] = parseInt(a[i]);
            b[i] = parseInt(b[i]);

            if(a[i] > b[i]) {
                return true;
            }

            if(!(a[i] >= b[i])) {
                return false;
            }
        }

        return true;
    }


    var impl = {};

    /**
     * 发送错误给客户端
     * @param response [object] 通讯协议的响应对象
     * @param resDate [object] 服务端对客户端的响应内容对象
     * @param errorCode [string] 错误信息
     */
    impl.sendResponseWithResultCode = function(response, resDate, errorCode) {
        resDate.ret = errorCode;
        var responseBody = JSON.stringify(resDate);
        /**
         */
        responseBody = ed_code(responseBody);
        /**
         * */
        response.writeHead(200, {
            'Content-Type' : 'text/plain'
        });
        response.end(responseBody);
    };

    /**
     * 发送给SDK服务端
     * @param response [object] 通讯协议的响应对象
     * @param resDate [object] 服务端对客户端的响应内容对象
     * @param errorCode [string] 错误信息
     */
    impl.sendResponseToSDK = function(response, resDate, errorCode) {
        resDate.code = errorCode;
        var responseBody = JSON.stringify(resDate);
        response.writeHead(200, {
            'Content-Type' : 'text/plain'
        });
        response.end(responseBody);
    };

    /**
     * 读取request 只用GET
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的返回对象
     * @param onJsonData [func] 回调函数，参数为:请求
     * @returns [object] 请求信息内容对象
     */
    impl.readDataFromRequest = function(request, response, onJsonData) {
        var str; /* 字符串原文 */
        var jsonResult; /* 转义json对象 */

        if (request.method == 'GET') { /* 客户端 */
            try {
                str = new Buffer(url.parse(request.url).query, 'base64').toString();
                jsonResult = JSON.parse(str);
            }
            catch (err) {
                logger.error('[jsonParseErr]:\n' + request.url);
            }

            /* 版本号校验 */
            if (!jsonResult || !chkVer(jsonResult.vs)) {
                var res = new protocolBase.IPacket();
                impl.sendResponseWithResultCode(response, res, retCode.OUTDATED_VERSION);
            }
            else {
                /* 包序号验证 */
                if (cfgControl.packageVerify) {
                    packageVerifyDb.checkPackageIndex(jsonResult, function(err){
                        if(err && err != retCode.SUCCESS) {
                            var res = new protocolBase.IPacket();
                            impl.sendResponseWithResultCode(response, res, err);
                        }
                        else{
                            onJsonData(jsonResult);
                        }
                    });
                }
                else{
                    onJsonData(jsonResult);
                }
            }
        }
        else if(request.method == 'POST') { /* SDK */
            var dataBody = [];
            var size = 0;

            request.on('data', function (data) {
                if(size < postLimitSize) {
                    dataBody.push(data);
                    size += data.length;
                }
            });

            request.on('end', function () {
                if(size > postLimitSize) {
                    response.end();
                    return;
                }

                try {
                    str = Buffer.concat(dataBody, size).toString('utf-8');
                    jsonResult = JSON.parse(str);
                }
                catch (err) {
                    logger.error('[jsonParseErr]:\n' + str + '\n' + err.stack);
                }

                onJsonData(jsonResult);
            });
        }
    };
    
    exports.impl = impl;
})();
