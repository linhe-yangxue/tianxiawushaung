from openpyxl import load_workbook
import os
import sys
import codecs

template = """
/**
 * 包含的头文件
 */
var protocolBase = require('../../common/protocol_base');
var basic = require('../../tools/system/basic');
var inherit = basic.inherit;
var retCode = require('../../common/ret_code');

/**
 * 协议名称的定义
 */
%s

/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/
%s
"""

A = """
exports.pCS{0} = 'CS_{0}';
exports.pSC{0} = 'SC_{0}';
"""

B = """
/**
 * {0} [CS]
 */
var CS_{1} = (function(parent) {{
    inherit(CS_{1}, parent);
    function CS_{1}() {{
        parent.apply(this, arguments);
{2}    }}
    return CS_{1};
}})(protocolBase.IPacket);
exports.CS_{1} = CS_{1};

/**
 * {0} [SC]
 */
var SC_{1} = (function (parent) {{
    inherit(SC_{1}, parent);
    function SC_{1}() {{
        parent.apply(this, arguments);
{3}    }}
    return SC_{1};
}})(protocolBase.IPacket);
exports.SC_{1} = SC_{1};
/**-------------------------------------------------------------------------------------------------------------------*/
"""

root = os.getcwd()
target = os.path.join(root, "server", "game_server", "packets")
if not os.path.isdir(target): exit(0)

for file in os.listdir(os.path.join(root, "protocals")):
    protocal = open(os.path.join(root, "protocals", file),
                    "r", encoding='unicode_escape')
    n = []
    for line in protocal.readlines():
        n.append(line.strip().split(","))

    js = codecs.open(os.path.join(target, file.split(".")[0] + ".js"), "w", encoding = "utf_8_sig")
    out1 = ""
    out2 = ""

    for row in range(0, len(n), 4):
        if n[row][0] == "": break

        str1 = ""
        for col in range(1, len(n[row+1]), 3):
            if n[row+1][col] == "": break

            v = "''"
            if n[row+1][col+1] != "":
                if n[row+1][col+1][0] == "[" and n[row+1][col+1][-1] == "]":
                    v = "[]"
                elif n[row+1][col+1][0] == "{" and n[row+1][col+1][-1] == "}":
                    v = "{}"
                else:
                    v = n[row+1][col+1]
            
            str1 += "        this." + n[row+1][col] + " = " + v + ";"


            if col+2 >= len(n[row+1]) or n[row+1][col+2] == "":
                str1 += "\n"
            else:
                str1 += " /* " + n[row+1][col+2] + " */\n"

        str2 = ""
        for col in range(1, len(n[row+2]), 3):
            if n[row+2][col] == "": break

            v = "''"
            if n[row+2][col+1] != "":
                if n[row+2][col+1][0] == "[" and n[row+2][col+1][-1] == "]":
                    v = "[]"
                elif n[row+2][col+1][0] == "{" and n[row+2][col+1][-1] == "}":
                    v = "{}"
                else:
                    v = n[row+2][col+1]
            
            str2 += "        this." + n[row+2][col] + " = " + v + ";"
            
            if col+2 >= len(n[row+2]) or n[row+2][col+2] == "":
                str2 += "\n"
            else:
                str2 += " /* " + n[row+2][col+2] + " */\n";

        out1 += A.format(n[row][1])
        out2 += B.format(n[row][0], n[row][1], str1, str2)

    js.write(template % (out1, out2))
    js.close()
    
