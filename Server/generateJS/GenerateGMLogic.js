/**
 * Created by 薄雪婷 on 2016/3/2.
 */
var fs = require('fs');
var path = require('path');

var root = process.cwd();                               //当前的绝对路径
var objContent = [];                                    //proto_object.csv的文件内容
var target = path.join(root, "gmLogic");                //gmLogic文件夹的路径

var template = "\n\
/**\n\
 * 包含的头文件\n\
 */\n\
var packets = require('../packets/gm');\n\
var http = require('../../tools/net/http_server/gm_http_protocol_base').impl;\n\
var retCode = require('../../common/ret_code');\n\
var async = require('async');\n\
var logger = require('../../manager/log4_manager');\n\
var gmCommon = require('../common/gm_common');\n\
var gmCode = require('../../common/gm_code');\n\
var gmCmd = require('../../common/gm_cmd');\n\
\n\
/**\n\
 * 协议主逻辑的实现\n\
 */\n\
/**-------------------------------------------------------------------------------------------------------------------*/\n\
{0}\n\
/**\n\
 * 绑定\n\
 * @param protocolListCallback\n\
 */\n\
function import_protocol(protocolListCallback) {\n\
    var exportProtocol = [];\n\
{1}\n\
    protocolListCallback(exportProtocol);\n\
}\n\
exports.importProtocol = import_protocol;\n";

var A = "\n\
/**\n\
 * {0}\n\
 */\n\
var CS_{1} = (function() {\n\
\n\
    /**\n\
     * 构造函数\n\
     */\n\
    function CS_{1}() {\n\
        this.reqProtocolName = packets.pCSGM;\n\
        this.resProtocolName = packets.pSCGM;\n\
    }\n\
\n\
    /**\n\
     * 继承基类，实现协议逻辑\n\
     * @param request [object] 已解析过的通讯协议的请求对象\n\
     * @param response [object] 通讯协议的响应对象\n\
     */\n\
    CS_{1}.prototype.handleProtocol = function (request, response) {\n\
        var res = new packets.SC_GM();\n\
        res.pt = this.resProtocolName;\n\
        res.type = request.type;\n\
\n\
        /* 校验外层通用参数,注意：req是null的,要验证!=null */\n\
        if(null == request\n\
            || null == request.cmd\n\
            || null == request.operatorid\n\
            || null == request.sign\n\
            || 'json' != request.type\n\
            || null == request.req) {\n\
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
            return;\n\
        }\n\
\n\
        request.operatorid = parseInt(request.operatorid);\n\
\n\
        if(isNaN(request.operatorid)) {\n\
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
            return;\n\
        }\n\
{2}\n\
        /* sign验证 */\n\
        if(!gmCommon.checkSign(request)){\n\
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);\n\
            return;\n\
        }\n\
\n\
        async.waterfall([\n\
\n\
            function(callback) {\n\
                callback(null);\n\
            },\n\
\n\
            function(callback) {\n\
                callback(null);\n\
            }\n\
        ],function(err) {\n\
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */\n\
            if(err && err !== retCode.SUCCESS) {\n\
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);\n\
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
            }\n\
            else {\n\
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);\n\
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);\n\
            }\n\
        });\n\
    };\n\
    return CS_{1};\n\
})();\n\
/**-------------------------------------------------------------------------------------------------------------------*/\n\
";


var B = "\n\
        for(var i = 0; i < request.req.{0}.length; ++i) {\n\
            if({1}) {\n\
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
                return;\n\
            }\n\
\n\
{2}\n\
            if(false{3}) {\n\
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
                return;\n\
            }\n\
        }\n\
";


var C = "\n\
        if(false{0}) {\n\
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
            return;\n\
        }\n\
\n\
{1}\n\
        if(false{2}) {\n\
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
            return;\n\
        }\n\
";

var D = "\n\
        /* 校验内层req参数 */\n\
        if(null == request.req{0}) {\n\
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
            return;\n\
        }\n\
\n\
{1}\n\
        if(false{2}) {\n\
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);\n\
            return;\n\
        }\n\
{3}";


/**
 * 读取proto_object.csv文件，将文件内容放入数组objContent
 */
(function readObjFile() {
    var pathname = path.join(root, 'protocalsGM', '无双小师妹GM消息文档', 'proto_object.csv');
    var input = fs.readFileSync(pathname, 'utf8').trim();
    objContent = input.split("\r\n");
})();

/**
 * 读取文件，将文件内容放入数组m中,参数pathname即为文件的路径
 */
function readFile(pathname, callback) {
    var m = [];
    var input = fs.readFileSync(pathname, 'utf-8');
    m = input.split("\n");
    callback(m);
}

/**
 * 判断gmLogic文件夹是否存在，若不存在，则创建gmLogic文件夹
 */
function createFolder(callback) {
    fs.exists(target, function (exists) {
        if (!exists) {
            fs.mkdir(target, function (err) {
                if (err) {
                    console.log("创建gmLogic文件夹失败");
                    return;
                }
            });
        }
        callback(true);
    })
}

/**
 * 判断字符串是否是全数字（第一个字符可为 + 或 -）
 */
function isnumber(s, callback) {
    if (s.length > 1 && /^[+-\d]/.test(s[0]) && /^\d+$/.test(s.substr(1))) {
        callback(true);
    } else if(s.length > 0 && /\d/.test(s)){
        callback(true);
    }else{
        callback(false);
    }
}

/**
 * 创建gmLogic里的js文件，并写入数据
 */
function createJSFile(pathname){
    fs.readdirSync(pathname).forEach(function(fileName) {
        var fullPath = pathname + '/' + fileName; /* 拼接完整路径 */
        var filename = path.basename(fullPath, '.csv');
        if(/gm_/.test(filename)){
            var str0 = "";
            var str1 = "";
            var str2 = "";
            readFile(fullPath, function (fileContent) {
                for(var i = 0; i < fileContent.length; i += 4){
                    var row1 = [];                                  //每一组第一行的信息（标题）
                    var row2 = [];                                  //每一组第二行的信息（req）
                    var row3 = [];                                  //每一组第三行的信息（res）
                    row1 = fileContent[i].split(",");
                    row2 = fileContent[i+1].split(",");
                    row3 = fileContent[i+2].split(",");
                    if(row1[0] == "") {
                        break;
                    }

                    var sub_str2 = "";
                    var sub_str3 = "";
                    var sub_str4 = "";
                    var sub_str5 = "";
                    for(var j = 1; j < row2.length; j += 3){
                        if(row2[j] === ""){
                            break;
                        }

                        sub_str2 += "\n            || null == request.req." + row2[j];

                        isnumber(row2[j+1], function (result) {
                            if(result){
                                sub_str3 += "        request.req." + row2[j] + " = parseInt(request.req."  + row2[j] + ");\n";
                                sub_str4 += " || isNaN(request.req." + row2[j] + ")";
                            }
                        });

                        var sub_sub_str0 = "";
                        var sub_sub_str1 = "";      //字段是否为null
                        var sub_sub_str2 = "";      //转int
                        var sub_sub_str3 = "";      //判断int

                        if(row2[j+1].length > 2){
                            //对象数组
                            if(row2[j+1][0] === "[" && row2[j+1][row2[j+1].length - 1] ==="]"){
                                for(var k = 0; k < objContent.length; k++){
                                    var objRow = [];
                                    objRow = objContent[k].split(",");      //object.csv的每一行
                                    if(objRow[1] === row2[j+1].substring(1, row2[j+1].length - 1)){
                                        sub_sub_str1 += "null == request.req." + row2[j] + "[i]";

                                        for(var n = 2; n < objRow.length; n += 3){
                                            if(objRow[n] == ""){
                                                break;
                                            }

                                            sub_sub_str1 += "\n                 || null == request.req." + row2[j] + "[i]." + objRow[n];

                                            isnumber(objRow[n+1], function (result) {
                                                if(result){
                                                    sub_sub_str2 += "            request.req." + row2[j] + "[i]." + objRow[n] + " = parseInt(request.req." + row2[j] + "[i]." + objRow[n] + ");\n";
                                                    sub_sub_str3 += " || isNaN(request.req." + row2[j] + "[i]." + objRow[n] +")";
                                                }
                                            });
                                        }
                                    }
                                }
                                sub_str5 += B.format(row2[j], sub_sub_str1, sub_sub_str2, sub_sub_str3);
                            }

                            //单个对象
                            if(row2[j+1][0] === "{" && row2[j+1][row2[j+1].length - 1] ==="}"){
                                for(var k = 0; k < objContent.length; k++){
                                    var objRow = [];
                                    objRow = objContent[k].split(",");      //object.csv的每一行
                                    if(objRow[1] === row2[j+1].substring(1, row2[j+1].length - 1)){
                                        for(var n = 2; n < objRow.length; n += 3){
                                            if(objRow[n] == ""){
                                                break;
                                            }

                                            sub_sub_str0 += "\n                || null == request.req." + row2[j] + "." + objRow[n];

                                            isnumber(objRow[n+1], function (result) {
                                                if(result){
                                                    sub_sub_str1 += "            request.req." + row2[j] + "." + objRow[n] + " = parseInt(request.req." + row2[j] + "." + objRow[n] + ");\n";
                                                    sub_sub_str2 += " || isNaN(request.req." + row2[j] + "." + objRow[n] +")";
                                                }
                                            });
                                        }
                                    }
                                    sub_str5 += C.format(sub_sub_str0, sub_sub_str1, sub_sub_str2);
                                }
                            }
                        }
                    }
                    if(sub_str2.length <= 0){
                        str1 += A.format(row1[0], row1[1], '');
                    }else{
                        str0 = D.format(sub_str2, sub_str3, sub_str4, sub_str5);
                        str1 += A.format(row1[0], row1[1], str0);
                    }
                    str2 += "    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_" + row1[1] + "()]);\n";
                }
                fs.writeFile(path.join(target, filename + ".js"), (template.format(str1, str2)), { encoding:'utf-8' }, function (err) {
                    if(err){
                        console.error(err);
                    }else{
                        console.log("写入  "+filename+".js 成功");
                    }
                });
            });
        }
    });
}

/**
 * 格式化字符串
 */
String.prototype.format = function (args) {
    var ret = this;
    if(arguments.length > 0) {
        for(var i = 0; i < arguments.length; ++i) {
            var reg = new RegExp('({)' + i + '(})', 'g');
            ret = ret.replace(reg, arguments[i]);
        }
    }
    return ret;
};

function startWrite(pn){
    createFolder(function (result) {
        if(result){
        }
        createJSFile(pn);
    })
}

startWrite(path.join(root, "protocalsGM", "无双小师妹GM消息文档"));