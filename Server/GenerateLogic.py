from openpyxl import load_workbook
import os
import codecs

template = """
/**
 * 包含的头文件
 */
var packets = require('../packets/%s');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var logsCode = require('../../common/logs_code');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/
%s
/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
%s
    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
"""


A = """
/**
 * {0}
 */
var CS_{1} = (function() {{

    /**
     * 构造函数
     */
    function CS_{1}() {{
        this.reqProtocolName = packets.pCS{1};
        this.resProtocolName = packets.pSC{1};
    }}

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_{1}.prototype.handleProtocol = function (request, response) {{
        var res = new packets.SC_{1}();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {{
            /* 校验参数 */
            if(null == req{2}) {{
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }}

{3}
            if(false{4}) {{
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }}
{5}
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {{
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                }},

                function(callback) {{
                    callback(null);
                }}
            ],function(err) {{
                if(err && err !== retCode.SUCCESS) {{
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }}
                else {{
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }}
            }});
        }});
    }};
    return CS_{1};
}})();
/**-------------------------------------------------------------------------------------------------------------------*/
"""

B = """
            for(var i = 0; i < req.{0}.length; ++i) {{
                if({1}) {{
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }}

{2}
                if(false{3}) {{
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }}
            }}
"""

C = """
            if(false{0}) {{
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }}

{1}
            if(false{2}) {{
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }}
"""


def isnumber(s):
    if len(s) > 0 and (s[0] == '+' or s[0] == '-') and s[1:].isdigit():
        return True
    if s.isdigit():
        return True
    return False



root = os.getcwd()
proObj = open(os.path.join(root, "protocalsObject",
              "protocol_object.csv"), "r", encoding='unicode_escape')
m = []
for line in proObj.readlines():
    m.append(line.strip().split(","))
    
target = os.path.join(root, "logic")
if not os.path.isdir(target):
    os.mkdir(target)

for file in os.listdir(os.path.join(root, "protocals")):
    protocal = open(os.path.join(root, "protocals", file),
                    "r", encoding='unicode_escape')
    n = []
    for line in protocal.readlines():
        n.append(line.strip().split(","))

    js = codecs.open(os.path.join(target, file.split(".")[0] + ".js"), "w", encoding = "utf_8_sig")
    str1 = ""
    str2 = ""

    for row in range(0, len(n), 4):
        if n[row][0] == "": break

        sub_str2 = ""
        sub_str3 = ""
        sub_str4 = ""
        sub_str5 = ""
        for col in range(1, len(n[row+1]), 3):
            P = n[row+1][col]
            Q = n[row+1][col+1]
            if P == "": break

            sub_str2 += "\n            || null == req." + P

            if isnumber(Q): 
                sub_str3 += "            req." + P + " = parseInt(req."  + P + ");\n"
                sub_str4 += " || isNaN(req." + P + ")"

            sub_sub_str0 = ""
            sub_sub_str1 = ""
            sub_sub_str2 = ""
            sub_sub_str3 = ""
            if len(n[row+1][col+1]) > 2:
                #对象数组
                if n[row+1][col+1][0] == "[" and n[row+1][col+1][-1] == "]":
                    for row0 in range(len(m)):
                        if m[row0][1] == n[row+1][col+1][1:-1]:
                            sub_sub_str1 += "null == req." + P + "[i]"
                            for col0 in range(2, len(m[row0]), 3):
                                P0 = m[row0][col0]
                                Q0 = m[row0][col0+1]
                                if P0 == "": break
                                
                                sub_sub_str1 += "\n                    || null == req." + P + "[i]." + P0

                                if isnumber(Q0):
                                    sub_sub_str2 += "                req." + P + "[i]." + P0 + " = parseInt(req." + P + "[i]." + P0 + ");\n"
                                    sub_sub_str3 += " || isNaN(req." + P + "[i]." + P0 +")"
                                
                                
                    sub_str5 += B.format(P, sub_sub_str1, sub_sub_str2, sub_sub_str3)
                
                #单个对象
                if n[row+1][col+1][0] == "{" and n[row+1][col+1][-1] == "}":
                    for row0 in range(len(m)):
                        if m[row0][1] == n[row+1][col+1][1:-1]:
                            for col0 in range(2, len(m[row0]), 3):
                                P0 = m[row0][col0]
                                Q0 = m[row0][col0+1]
                                if P0 == "": break
                                
                                sub_sub_str0 += "\n                || null == req." + P + "." + P0

                                if isnumber(Q0):
                                    sub_sub_str1 += "            req." + P + "." + P0 + " = parseInt(req." + P + "." + P0 + ");\n"
                                    sub_sub_str2 += " || isNaN(req." + P + "." + P0 +")"           

                    sub_str5 += C.format(sub_sub_str0, sub_sub_str1, sub_sub_str2)

        str1 += A.format(n[row][0], n[row][1], sub_str2, sub_str3, sub_str4, sub_str5)
        str2 += "    exportProtocol.push(new CS_" + n[row][1] + "());\n"


    js.write(template % (file.split(".")[0], str1, str2))
    js.close()
