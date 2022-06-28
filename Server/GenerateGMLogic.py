from openpyxl import load_workbook
import os
import codecs

template = """
/**
 * 包含的头文件
 */
var packets = require('../packets/gm');
var http = require('../../tools/net/http_server/gm_http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var logger = require('../../manager/log4_manager');
var gmCommon = require('../common/gm_common');
var gmCode = require('../../common/gm_code');
var gmCmd = require('../../common/gm_cmd');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/
%s
/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
%s
    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
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
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }}

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_{1}.prototype.handleProtocol = function (request, response) {{
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {{
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }}

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {{
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }}
{2}
        /* sign验证 */
        if(!gmCommon.checkSign(request)){{
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }}
        
        async.waterfall([

            function(callback) {{
                callback(null);
            }},

            function(callback) {{
                callback(null);
            }}
        ],function(err) {{
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {{           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }}
            else {{
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }}
        }});
    }};
    return CS_{1};
}})();
/**-------------------------------------------------------------------------------------------------------------------*/
"""

B = """
        for(var i = 0; i < request.req.{0}.length; ++i) {{
            if({1}) {{
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }}
                
{2}
            if(false{3}) {{
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
                return;
            }}
        }}
"""

C = """
        if(false{0}) {{
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }}

{1}
        if(false{2}) {{
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }}
"""

D = """
        /* 校验内层req参数 */
        if(null == request.req{0}) {{
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }}

{1}
        if(false{2}) {{
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }}
{3}"""


def isnumber(s):
    if len(s) > 0 and (s[0] == '+' or s[0] == '-') and s[1:].isdigit():
        return True
    if s.isdigit():
        return True
    return False



root = os.getcwd()
proObj = open(os.path.join(root, "protocalsGM", "无双小师妹GM消息文档", "proto_object.csv"), "r")
m = []#object.csv
for line in proObj.readlines():
    m.append(line.strip().split(","))
    
target = os.path.join(root, "gmLogic")#创建gmLogic文件夹
if not os.path.isdir(target):
    os.mkdir(target)

for file in os.listdir(os.path.join(root, "protocalsGM", "无双小师妹GM消息文档")):
    if not file.startswith("gm_"):
        continue
    protocal = open(os.path.join(root, "protocalsGM", "无双小师妹GM消息文档", file), "r")
    n = []#'gm_'开头的csv
    for line in protocal.readlines():
        n.append(line.strip().split(","))

    js = codecs.open(os.path.join(target, file.split(".")[0] + ".js"), "w", encoding = "utf_8_sig")#建gmLogic里文件
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
            
            sub_str2 += "\n            || null == request.req." + P

            if isnumber(Q): 
                sub_str3 += "        request.req." + P + " = parseInt(request.req."  + P + ");\n"
                sub_str4 += " || isNaN(request.req." + P + ")"

            sub_sub_str0 = ""
            sub_sub_str1 = ""#字段是否为null
            sub_sub_str2 = ""#转int
            sub_sub_str3 = ""#判断int
            if len(n[row+1][col+1]) > 2:
                #对象数组
                if n[row+1][col+1][0] == "[" and n[row+1][col+1][-1] == "]":
                    for row0 in range(len(m)):
                        if m[row0][1] == n[row+1][col+1][1:-1]:
                            sub_sub_str1 += "null == request.req." + P + "[i]"
                            for col0 in range(2, len(m[row0]), 3):
                                P0 = m[row0][col0]
                                Q0 = m[row0][col0+1]
                                if P0 == "": break
                                
                                sub_sub_str1 += "\n                 || null == request.req." + P + "[i]." + P0

                                if isnumber(Q0):
                                    sub_sub_str2 += "            request.req." + P + "[i]." + P0 + " = parseInt(request.req." + P + "[i]." + P0 + ");\n"
                                    sub_sub_str3 += " || isNaN(request.req." + P + "[i]." + P0 +")"
                                
                                
                    sub_str5 += B.format(P, sub_sub_str1, sub_sub_str2, sub_sub_str3)
                
                #单个对象
                if n[row+1][col+1][0] == "{" and n[row+1][col+1][-1] == "}":
                    for row0 in range(len(m)):
                        if m[row0][1] == n[row+1][col+1][1:-1]:
                            for col0 in range(2, len(m[row0]), 3):
                                P0 = m[row0][col0]
                                Q0 = m[row0][col0+1]
                                if P0 == "": break
                                
                                sub_sub_str0 += "\n                || null == request.req." + P + "." + P0

                                if isnumber(Q0):
                                    sub_sub_str1 += "            request.req." + P + "." + P0 + " = parseInt(request.req." + P + "." + P0 + ");\n"
                                    sub_sub_str2 += " || isNaN(request.req." + P + "." + P0 +")"           

                    sub_str5 += C.format(sub_sub_str0, sub_sub_str1, sub_sub_str2)

        if len(sub_str2) <= 0: 
            str1 += A.format(n[row][0], n[row][1], '')
        else:
            str0 = D.format(sub_str2, sub_str3, sub_str4, sub_str5)
            str1 += A.format(n[row][0], n[row][1], str0)
        str2 += "    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_" + n[row][1] + "()]);\n"

    #print('str1 = ', str1)
    #print('str2 = ', str2)
    js.write(template % (str1, str2))
    js.close()





































