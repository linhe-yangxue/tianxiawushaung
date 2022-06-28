/**
 * Created by Kevin on 2015/8/28.
 */

var IoBuffer = (function(){

    function IoBuffer(){
        this._totalLength  = 1024*8;
        this._buffer = new Buffer(this._totalLength);
        this._writePosition = 0;
        this._readPosittion = 0;
    }

    IoBuffer.prototype.write = function(buffer,parsePacket){
        var recvLength = buffer.length;
        /** 比较好的一种情况就是每次接收到的数据都是一个完成的报文*/
        if(this._writePosition == 0){
            var readLength = parsePacket(buffer,recvLength);
            if( readLength < recvLength){
                var leftLength = recvLength - readLength;
                buffer.copy(this._buffer,this._writePosition,readLength,buffer.length);
                this._writePosition += leftLength;
            }else if(readLength > recvLength) {
                return false;
            }
            return true;
        }
        if(recvLength > this._totalLength - this._writePosition ) {
            return false;
        }
        /** 拼接之前不完整的buffer */
        buffer.copy(this._buffer,this._writePosition);
        this._writePosition +=recvLength;
        var readLength = parsePacket(this._buffer,this._writePosition);
        if(readLength ==0){
            return true;
        }else if(readLength > this._writePosition){
            return false;
        }
        /** 移动读走的buffer */
        this._buffer.copy(this._buffer,0,this._writePosition-readLength, this._writePosition );
        this._writePosition -= readLength;
        return true;
    };



    return IoBuffer;
})();

exports.IoBuffer = IoBuffer;
