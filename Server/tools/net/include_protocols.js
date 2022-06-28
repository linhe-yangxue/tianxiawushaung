/**
 * Created by kevin on 2015/8/10.
 * 方便Server绑定协议
 * 被绑定的协议所在的文件必须实现import_protocol方法

 example：

 function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new 协议());
    protocolListCallback(exportProtocol);
}
 exports.importProtocol = importProtocol;

 */

//系统库包含
var fs = require('fs');
var __path = require('path');


function read_http_protocols(protocol_dir, on_protocol_callback) {
    var read_files = fs.readdirSync(protocol_dir);
    for (var i = 0; i < read_files.length; ++i) {
        if (__path.extname(read_files[i]) != '.js') {
            continue;
        }
        var module_name = '../.' + protocol_dir + '/' + __path.basename(read_files[i], '.js');
        var load_protocol = require(module_name);
        if (typeof load_protocol.importProtocol === 'function') {
            load_protocol.importProtocol(function (protocol_handlers) {
                for (var j = 0; j < protocol_handlers.length; j++) {
                    on_protocol_callback(protocol_handlers[j]);
                }
            });
        }
    }
}
exports.read_http_protocols = read_http_protocols;