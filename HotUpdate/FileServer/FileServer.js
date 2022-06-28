/*
 文件服务器
 */

var http = require("http");
var url = require("url");
var fs = require("fs");

var Config = require("./Config.js");

var fileServer = http.createServer();
fileServer.on("request", function(req, res) {
	//将请求转为对象
	var tmpReqObj = url.parse(req.url, true);
	
	if(typeof tmpReqObj === "undefined") {
		res.writeHead(400, {
			"Context-type" : "text/plain"
		});
		res.write("The request has some invalid parameters!!!");
		res.end();
		return;
	}
	
	////检查请求路径
	//if(tmpReqObj.pathname != "/HotUpdate") {
	//	res.writeHead(400, {
	//		"Context-type" : "text/plain"
	//	});
	//	res.write("The request path is invalid!!!");
	//	res.end();
	//	return;
	//}
	
	//检查请求文件路径
	var tmpFilePath = tmpReqObj.pathname;//.query.filename;
	if(typeof tmpFilePath === "undefined") {
		res.writeHead(400, {
			"Context-type" : "text/plain"
		});
		res.write("File path is invalid!!!");
		res.end();
		return;
	}
	tmpFilePath = decodeURI(tmpFilePath);
	tmpFilePath = Config.rootPath + "/" + tmpFilePath;
	
	fs.stat(tmpFilePath, function(err, stats) {
		if(err || !stats.isFile()) {
			res.writeHead(404, {
				"Context-type" : "text/plain"
			});
			res.write("File path you request doesn't exist!!!");
			res.end();
			return;
		}
		
		fs.readFile(tmpFilePath, "binary", function(err, data) {
			if(err) {
				res.writeHead(500, {
					"Context-type" : "text/plain"
				});
				res.write(err);
				res.end();
				return;
			}

            //var tmpBuffer = new Buffer(data);
            //var tmpCurrIdx = 0, tmpBlockLen = 1;
            //var tmpFileBlock = new Buffer(tmpBlockLen);
            //var tmpSendBlock = function() {
            //    if(tmpCurrIdx >= tmpBuffer.length) {
            //        return;
            //    }
            //
            //    tmpBuffer.copy(tmpFileBlock, 0, tmpCurrIdx, tmpCurrIdx + tmpBlockLen);
            //    res.writeHead(206, {
            //        "Context-type" : "text/html",
            //        "Context-Length" : tmpBuffer.length,
            //        "Context-Range" : "bytes " + tmpCurrIdx + "-" + (tmpCurrIdx + tmpFileBlock.length - 1) + "/" + tmpBuffer.length
            //    });
            //    res.write(tmpFileBlock, "binary");
            //    res.end();
            //
            //    tmpCurrIdx += tmpBlockLen;
            //    tmpSendBlock();
            //};
            //tmpSendBlock();

            //setTimeout(function() {
            //    res.writeHead(200, {
            //        "Context-type" : "text/html",
            //        "Context-Length" : data.length
            //    });
            //    res.write(data, "binary");
            //    res.end();
            //}, 60000);

            res.writeHead(200, {
                "Context-type" : "text/html",
                "Context-Length" : data.length
            });
            res.write(data, "binary");
            res.end();
		});
	});
});
fileServer.listen(Config.fileServer.port, function() {
    console.log("File server listen at " + Config.fileServer.port + " success.");
});
