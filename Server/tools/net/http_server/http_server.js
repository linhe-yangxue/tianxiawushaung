/**
 * http server 的二次封装类，包含了错误处理和协议绑定
 */

var http = require('http');
var url = require('url');
var domain = require('domain');
var cluster = require('cluster');
var httpErrorHandler = require('./http_error_handler');
var includeProtocol = require('../include_protocols');
var gm_http_protocol_base = require('./gm_http_protocol_base').impl;
var gmCode = require('../../../common/gm_code');
var ed_code = require('../../../game_server/common/ed_code.js').recvDecode;
var retCode = require('../../../common/ret_code.js');

/**
 *  http server 的二次封装类，包含了错误处理和协议绑定
 */
var HttpServerImpl = (function () {
    /**
     * 构造函数 HttpServerImpl
     * @param logger [object] log对象
     * @param bandHttpProtoType [int] 绑定消息方式
     * @return [] 无返回值
     */
    function HttpServerImpl(logger, bandHttpProtoType) {
        this.port = 0;
        this.requestHandler = {};
        this.logger = logger;
        this.server = null;
        this.status = 'noRunning';
        this.bandHttpProtoType = bandHttpProtoType;
    }

    /**
     * 公开函数  bindHttpProtocols
     * @param path [string] 路径
     * @return [] 无返回值
     */
    HttpServerImpl.prototype.bindHttpProtocols = function (path) {
        var self = this;
        includeProtocol.read_http_protocols(path, function (exported_protocol) {
            if (self.bandHttpProtoType == exports.protoTypePath) {
                self.logger.info('[HTTP Protocol Register] : ' + exported_protocol.reqProtocolName + ' -- [Object] : ' + exported_protocol.constructor.name);
                self.bindProtocol(exported_protocol);
            }
            else {
                self.logger.info('[HTTP Protocol Register] : ' + exported_protocol[1].reqProtocolName + ' -- [Object] : ' + exported_protocol[1].constructor.name);
                self.bindProtocolCmd(exported_protocol);
            }
        });
    };

    /**
     * 公开函数 bindProtocol
     * @param protocolHandler [object]
     */
    HttpServerImpl.prototype.bindProtocol = function (protocolHandler) {
        if (undefined == protocolHandler.reqProtocolName) {
            this.logger.error('[TCP Protocol Register] : ' + protocolHandler.reqProtocolName + ' -- [Object] : ' + protocolHandler.constructor.name);
        }
        this.requestHandler['/' + protocolHandler.reqProtocolName] = protocolHandler;
    };

    /**
     * 公开函数 bindProtocolCmd
     * @param protocolHandler [object]
     */
    HttpServerImpl.prototype.bindProtocolCmd = function (protocolHandler) {
        if (undefined == protocolHandler[1].reqProtocolName) {
            this.logger.error('[TCP Protocol Register] : ' + protocolHandler[1].reqProtocolName + ' -- [Object] : ' + protocolHandler[1].constructor.name);
        }
        this.requestHandler[protocolHandler[0]] = protocolHandler[1];
    };

    /**
     * 公开函数 onRequested
     * @param req [object] 请求对象
     * @param res [object] 响应对象
     */
    HttpServerImpl.prototype.onRequested = function (req, res) {
        var command = null;
        if (this.bandHttpProtoType == exports.protoTypePath) {
            if ('POST' != req.method) {
                try {
                    var edUrl;
                    edUrl = ed_code(req.url);
                    if (edUrl == "") {
                        httpErrorHandler.handleError403(res);
                        return;
                    }
                    req.url = edUrl;
                }
                catch (exception) {
                    httpErrorHandler.handleError403(res);
                    return;
                }
            }
            command = url.parse(req.url).pathname;
            if (!this.requestHandler[command]) {
                httpErrorHandler.handleError404(res);
                return;
            }
            this.requestHandler[command].handleProtocol(req, res);
        }
        else {
            var self = this;
            gm_http_protocol_base.readDataFromRequest(req, res, function (request) {
                if (request == null) {
                    return;
                }
                self.logger.info('request===' + JSON.stringify(request));
                command = request.cmd;
                if (!self.requestHandler[command]) {
                    gm_http_protocol_base.sendErrorResponseToGM(res, gmCode.GM_PROTO_ERR);
                    return;
                }
                self.requestHandler[command].handleProtocol(request, res);
            });
        }
    };

    /**
     * 公开函数  start
     * @param port [string] 端口号
     */
    HttpServerImpl.prototype.start = function (port) {
        var self = this;
        this.port = port;
        this.status = 'starting';
        this.server = http.createServer(function (req, res) {
            var d = domain.create();

            d.on('error', function (err) {
                self.logger.error('[codeLogicErr]' + err.stack);
                /* 代码逻辑错误 */
                httpErrorHandler.handleError500(res);
            });

            d.add(req);
            d.add(res);
            d.run(function () {
                self.onRequested(req, res);
            });
        }).listen(port);
        this.status = 'running';
    };

    HttpServerImpl.prototype.stop = function () {
        /**
         * 如果已经停止过，不需要停止
         */
        if (this.status == 'stoped') {
            return;
        }

        this.status = 'stoped';
        try {
            if (this.server != null) {
                /**
                 * 回调延时函数
                 */
                var killTimer = setTimeout(function () {
                    throw new Error('exit');
                }, 30000);
                killTimer.unref();

                this.server.close(function () {
                    throw new Error('exit');
                });
            }
        } catch (err) {
            this.logger.error('[server stop error]' + err.stack);
        }
    };
    return HttpServerImpl;
})();
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *  http server 的二次封装类，包含了错误处理和协议绑定
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.HttpServerImpl = HttpServerImpl;


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明消息类型全局变量
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.protoTypePath = 1;
/* 根据path找消息处理函数 */
exports.protoTypeCmd = 2;
/* 根据cmd找消息处理函数 */