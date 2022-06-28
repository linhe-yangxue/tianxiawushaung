/**
 * gm http 工具类
 */
var url = require('url');
var logger = require('../../../manager/log4_manager').LoggerGm;
var gmLogger = require('../../../manager/log4_manager');
var protocolBase = require('../../../common/protocol_base');
var gmCode = require('../../../common/gm_code.js');

(function () {
    var impl = {};

    /**
     * 发送错误返回给GM
     * @param reponse [object] 通讯协议的响码应对象
     * @param code [int] 错误码
     * @returns [] 无返回值
     */
    impl.sendErrorResponseToGM = function(reponse, code) {
        var res = new protocolBase.IPacket();
        /*放入GM消息通用返回结构*/
        res.type = 'json';/*写死*/
        res.msg = arguments[2]?arguments[2]:'';
        res.res = '';
        this.sendResponseWithResultToGM(reponse, res, code);
    };

    /**
     * 发送正常返回给GM工具
     * @param reponse [object] 通讯协议的响应对象
     * @param responseData [object] 服务端对客户端的响应内容对象
     * @param errorCode [string] 错误信息
     * @return [] 无返回值
     */
    impl.sendResponseWithResultToGM = function(reponse, responseData, errorCode) {
        responseData.code = errorCode;
        var responseBody = JSON.stringify(responseData);
        gmLogger.logGMRes(responseBody);
        reponse.writeHead(200, { "Content-Type": "text/html" });
        reponse.write(responseBody);
        reponse.end();
    };

    /**
     * 读取request 兼容GET和POST
     * @param request [object] 通讯协议的请求对象
     * @param response [func] 通讯协议的返回对象
     * @param onJsonData  [function] 请求信息内容对象
     * @returns 
     */
    impl.readDataFromRequest = function(request, response, onJsonData) {
        var jsonResult;
        /**
         * 处理get请求
         */
        if (request.method != 'POST') {
            impl.sendErrorResponseToGM(response, gmCode.GM_PARAM_ERR, 'request.method error:');
            return;
        }
        /**
         *
         * 持续收取BODY（POST）数据
         */
        var dataBody = [];
        var size = 0;
        request.on('data', function (data) {
            dataBody.push(data);
            size += data.length;
        });
        /**
         * POST 需要等待请求全部完成，才能读取数据，比GET略慢一点
         */
        request.on('end', function () {
            try {
                var buf = Buffer.concat(dataBody,size);
                var json = buf.toString('utf-8');
                jsonResult = JSON.parse(json);
            }
            catch (err) {
                logger.error('[http_request_parsing] ; ', dataBody, err.stack);
            }
            onJsonData(jsonResult);
        });
    };

    exports.impl = impl;
})();
