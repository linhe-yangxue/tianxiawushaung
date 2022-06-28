/**
 * Created by Kevin on 2015/8/27.
 */
var IoBuffer = require('./io_buffer').IoBuffer;

var TcpClientImpl = (function () {

    function TcpClientImpl(logger,pt,ret,login,logout) {
        this.ip = '';
        this.port = 0;
        this.socket = null;
        this.socketCloseNotifyCallback = null;  /**通知Server类，为关闭状态 */
        this.logger = logger;
        this._ioBuffer = new IoBuffer();        /**接收buffer缓存类 */
        this._recvpacketQueue = [];             /**接收队列*/
        this._isPacketProcessing = false;
        this._maxRecvPacketNumber = 8;          /** 缓存队列最大的数量，防止假客户端拼命发包影响其他客户端的正常的逻辑 */
        this._maxRecvPacketSize = 8*1024;       /** 最大报文长度 */
        this._timeout = 10 * 60 * 1000;          /** 超时时间10分钟*/
        this._protocolDispatcher = null;
        this.login = login;
        this.logout = logout;
        this.obj  = null;                        /** 挂载一个任意对象，比如player，用于存放业务逻辑信息，保证 TcpClientImpl 为网络层*/
        this.pt = pt;
        this.ret = ret;
    }
    /** 初始化和注册socket事件 */
    TcpClientImpl.prototype.attachSocket = function (socket, onClientSocketClosed) {
        var self = this;
        this.socket = socket;
        this.socketCloseNotifyCallback = onClientSocketClosed;
        this.ip = socket.remoteAddress;
        this.port = socket.remotePort;
        this.socket.setNoDelay(true);  /**  去掉Nagle算法，使write能够立即发送到客户端 */
        this.socket.on('connect', function () {
            //self.logger.info('on client connected');
        });
        /** on received */
        this.socket.on('data', function (data) {
            self.logger.debug("[TCP RECV] JSON: " + data.toString('utf8',4));
            self.parsePacket(data);
        });
        /** socket sends a FIN packet 当连接中的任意一端发送FIN数据的时候会调用这个函数 */
        this.socket.on('end', function () {
           // self.logger.debug('socket client end');
        });

        /** 当任意一端调用write发送数据时，会触发这个事件 */
        this.socket.on('drain',function() {
          //  self.logger.debug('socket write');
        });

        /**  error 异常发生 */
        this.socket.on('error', function (exception) {
            //self.logger.info(exception);
        });
        /** 当套接字完全关闭的时候，触发该事件  had_error为true表示因为错误而关闭 */
        this.socket.on('close', function (had_error) {
            self.logger.info("[TCP DISCONECT] " + had_error + " "  + self.ip + ":" + self.port );
            self._protocolDispatcher[self.logout].handleProtocol(self);
            if (self.socketCloseNotifyCallback) {
                self.socketCloseNotifyCallback(self);
            }

        });
        this.socket.setTimeout(this._timeout);
        this.socket.on('timeout', function (data) {
            self.logger.warn('[TCP TIMEOUT] ' + self.ip + ":" +  self.port);
        });
    };

    TcpClientImpl.prototype.attachProtocolDispatcher = function (dispatcher) {
        this._protocolDispatcher = dispatcher;
    };
    /** 关闭客户端 */
    TcpClientImpl.prototype.close = function() {
        this.logger.info("[TCP Closed By ServerSide]" + this.ip + ":" + this.port);
        this.socket.end();
    };

    /** 解析报文 */
    TcpClientImpl.prototype.parsePacket = function(data) {
        var self  = this;
        this._ioBuffer.write(data,  function(buffer, length) {
            var readLength = 0;
            /** 有可能会一次性收到多个报文 */
            while(true) {
                /** 读取报文长度 */
                if(readLength + 4 >= length) {
                    return readLength;
                }
                var  packetLength  = buffer.readUInt32BE(readLength);
                /** 异常长度的报文 */
                if(packetLength > self._maxRecvPacketSize) {
                    self.close();
                    return 0;
                }
                readLength += 4;
                if(packetLength> length - readLength) { /** 说明还有报文没有读完 */
                    readLength -= 4;
                    return readLength;
                }
                var jsonStr  = buffer.toString('utf-8',readLength,readLength+packetLength);
                readLength +=packetLength;
                if(!self.dispatchPacket(jsonStr)) {
                    self.close();
                }
            }
        });
    };

    /** 放入接收队列中，并且按照顺序处理 */
    TcpClientImpl.prototype.dispatchPacket = function(jsonStr) {
        if( this._recvpacketQueue.length >  this._maxRecvPacketNumber) {
            return false;
        }

        this._recvpacketQueue.push(jsonStr);
        this.processPacket();
        return true;
    };
    /** 处理报文逻辑 */
    TcpClientImpl.prototype.processPacket = function() {
        var  self = this;
        /** 如果接收队列没有报文需要处理，直接返回*/
        if (this._recvpacketQueue.length <= 0) {
            return;
        }
        /** 保证接收的报文顺序执行 */
        if (this._isPacketProcessing) {
            return;
        }
        this._isPacketProcessing = true;
        /** 解析JSON */
        var packetStream = this._recvpacketQueue.shift(); // enqueue
        try {
            var jsonObject = JSON.parse(packetStream);
            var currentProtocol = this._protocolDispatcher[jsonObject[this.pt]];
        }
        catch (e) {
            this.logger.error(e.stack);
            this.logger.error('[TCP ERROR] invalid socket stream. this socket will be closed ' + self.ip + ":" + self.port);
            return this.close();
        }

        /** 如果没有这个协议 */
        if(!currentProtocol) {
            this.logger.error('[TCP ERROR] can`t found protocol ' + packetStream   +  ",by "+ self.ip + ":" + self.port);
            return this.close();
        }

        /** 处理客户端请求 */
        currentProtocol.handleProtocol(self, jsonObject, function(data) {
            if(data == false) {
                self.logger.error("completedCallback false closed client "  + self.ip + ":" + self.port );
                return self.close();
            }
            self._isPacketProcessing = false;
            return self.processPacket();
        });

    };

    /**  发送报文 */
    TcpClientImpl.prototype.sendResponse = function (writeObject, completedCallback) {
        var self = this;
        var jsonStr = JSON.stringify(writeObject);
        var jsonStrSize = Buffer.byteLength(jsonStr, 'utf8');
        var buffer = new Buffer(jsonStrSize+4);
        buffer.writeUInt32BE(jsonStrSize,0);
        buffer.write(jsonStr,4);

        if (!this.socket.writable) {
            this.logger.error("[TCP ERROR] Socket is not allow writable " + self.ip + ":" + self.port);
            if(null != completedCallback) completedCallback(false);
            return;
        }

        try{
            this.socket.write(buffer);
        }catch (err) {
            this.logger.error("[TCP SEND ERROR]" + JSON.stringify(err));
        }

        this.logger.debug("[TCP SEND] JSON: " + buffer.toString('utf8',4));

        if(null != completedCallback) completedCallback(true);
    };

    /**发送报文，带错误代码*/
    TcpClientImpl.prototype.sendResponseWithResultCode = function(writeObject,errCode, completedCallback) {
        writeObject[this.ret] = errCode;
        this.sendResponse(writeObject, completedCallback);
    };

    return TcpClientImpl;
})();


exports.TcpClientImpl = TcpClientImpl;