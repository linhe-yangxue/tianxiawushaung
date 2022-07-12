from openpyxl import load_workbook
import os
import sys
import codecs

template = """%s
/**
 * 声明全局对象
 */
%s
"""

A = """
/**
 * {0}
 */
var {1} = (function() {{
    function {1}() {{
{2}
    }}
    return {1};
}})();
"""

root = os.getcwd()
target = os.path.join(root, "server", "common")
if not os.path.isdir(target): exit(0)



for file in os.listdir(os.path.join(root, "protocalsObject")):
    proObj = open(os.path.join(root, "protocalsObject", file),
                  "r", encoding='unicode_escape')
    n = []
    for line in proObj.readlines():
        n.append(line.strip().split(","))

    js = codecs.open(os.path.join(target, file.split(".")[0] + ".js"), "w", encoding = "utf_8_sig")
    out1 = ""
    out2 = ""

    for row in range(0, len(n)):
        if n[row][0] == "": break

        str1 = ""
        for col in range(2, len(n[row]), 3):
            if n[row][col] == "": break

            v = "''"
            if col + 1 < len(n[row]) and n[row][col+1] != "":
                v = n[row][col+1]
            str1 += "        this." + n[row][col] + " = " + v + ";"

            if col + 2 >= len(n[row]) or n[row][col+2] == "":
                str1 += "\n"
            else:
                str1 += " /* " + n[row][col+2] + " */ \n"

        out1 += A.format(n[row][0], n[row][1], str1)
        out2 += "exports." + n[row][1] + " = "  + n[row][1] + "; /* " + n[row][0] + " */\n"

    js.write(template % (out1, out2))
    js.close()
    
