/**
 * Created by Kevin on 2015/8/27.
 */

var net  = require('net');
var tcp_client = require('./tcp_client');
var include_protocol = require('../include_protocols');

var TcpServerImpl = (function () {
    function TcpServerImpl(logger,pt,ret,login,logout) {
        this.maxConnections = 10000 ; /* 最大连接数 */
        this._netServer = null;
        this.clientCount = 0;
        this.port = 0;
        this.logger = logger;
        this.requestHandler = [];
        this.login = login;
        this.logout = logout;
        this.pt = pt;
        this.ret = ret;
    }

    TcpServerImpl.prototype.bindTcpProtocols = function (path) {
        var self = this;
        include_protocol.read_http_protocols(path, function (exportedProtocol) {
            self.logger.info('[TCP Protocol Register] : ' + exportedProtocol.reqProtocolName + '--' + exportedProtocol.resProtocolName + ' -- [Object] : ' +  exportedProtocol.constructor.name);
            self.bindProtocol(exportedProtocol);
        });
    };

    TcpServerImpl.prototype.bindProtocol = function (protocolHandler) {
        if(undefined == protocolHandler.reqProtocolName ) {
            this.logger.error('[TCP Protocol Register] : ' + protocolHandler.reqProtocolName + '--' + protocolHandler.resProtocolName + ' -- [Object] : ' +  protocolHandler.constructor.name);
            //process.exit(-2);
        }
        this.requestHandler[protocolHandler.reqProtocolName] = protocolHandler;
    };

    TcpServerImpl.prototype.start = function (port) {
        /** allowHalfOpen: false 当socket接收到客户端的FIN的时候完成待写入会自动调用End，destroy文件描述符  */
        this._netServer = net.createServer({ allowHalfOpen: false });
        this._netServer.maxConnections = this.maxConnections;
        /** server event setting **/
        this.onListening();
        this.onConnection();
        this.onClose();
        this.onError();
        this.port = port;
        this._netServer.listen(this.port);
    };

    /** 服务器监听端口 */
    TcpServerImpl.prototype.onListening  = function () {
        var _self = this;
        this._netServer.on('listening', function () {
            _self.logger.info("[TCP LISTENING] " +_self.port);
        });
    };

    /** 当有客户端连接 */
    TcpServerImpl.prototype.onConnection  = function () {
        var self = this;
        this._netServer.on('connection',function(socket) {
            self.logger.debug("[TCP CONNECT] " + socket.remoteAddress + ":" + socket.remotePort);
            var client = new tcp_client.TcpClientImpl(self.logger,self.pt,self.ret,self.login,self.logout);
            client.attachProtocolDispatcher(self.requestHandler);
            client.attachSocket(socket, function(client) { /** 客户端关闭的回调*/
                self.clientCount--;
            });
            self.clientCount++;
        });
    };

    /** 服务端关闭，调用server.close()之后 */
    TcpServerImpl.prototype.onClose  = function () {
        var _self =this;
        this._netServer.on('close', function() {
            _self._netServer.close();
            _self.logger.info("[TCP Server Closed]");
        });
    };

    /** 服务端异常，比如正在监听一个使用中的端口 */
    TcpServerImpl.prototype.onError = function (error) {
        var self = this;
        this._netServer.on('error', function (error) {
            self.logger.error(error);
            if (error.code == 'EADDRINUSE') {
                self.logger.error('[TCP] address in use, retry start listen after 1000ms');
                setTimeout(function () {
                    self._netServer.close();
                    // restart...
                    self._netServer(self.port);
                }, 1000);
            }
        })
    };

    /** 服务器停止 */
    TcpServerImpl.prototype.stop = function() {
        var self = this;
        if(null != this._netServer) {
            try{
                this._netServer.close();
            }catch (err) {
                self.logger.error(err.stack);
            }
        }
    };

    return TcpServerImpl;
})();



exports.TcpServerImpl = TcpServerImpl;