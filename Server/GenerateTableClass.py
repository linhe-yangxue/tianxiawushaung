import os
import codecs

out1 = """
/** 包含的头文件 */
%s

/**
 * [当前为生成代码，不可以修改] CSC 配置表的管理类
 * */
var CSVManagerInstance = (function() {
    /** 类的成员变量 */
    var _unique;
%s
    /**
    * 单例函数
    */
    function Instance() {
        if(_unique === undefined) {
            _unique = new CSVManager();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function CSVManager() {
%s
    }
%s
    /**
    * 返回一个单例函数
    */
    return Instance;
})();

/** 声明一个单例对象 */
exports.Instance = CSVManagerInstance;
"""

out2 = """
/** 包含的头文件 */
var csvParse = require('../tools/parse/csv');

/**
 * [当前为生成代码，不可以修改] {0} 类为 {0}Table 每一行的元素对象
 * */
var {0} = (function() {{

    /**
    * 构造函数
    */
    function {0}() {{
{1}
    }}

    return {0};
}})();

/**
 * [当前为生成代码，不可以修改] {0} 配置表
 * */
var {0}TableInstance = (function() {{

    /**
    * 类的成员变量
    */
    var _unique;
    var _lines;

    /**
    * 单例函数
    */
    function Instance() {{
        if(_unique === undefined) {{
            _unique = new {0}Table();
        }}
        return _unique;
    }}

    /**
    * 构造函数
    */
    function {0}Table() {{
        _lines = {{}};
        var tmpArr = csvParse.Instance().getTable('{0}');
        for(var i = 0; i < tmpArr.length; ++i) {{
            var obj = new {0}();
{2}
            _lines[{4}] = obj;
{3}
        }}
    }}

    /**
    * 获取行队列
    */
    {0}Table.prototype.GetLines = function() {{
        return _lines;
    }};
    
    /**
    * 返回一个单例函数
    */
    return Instance;
}})();

/**
* 声明一个单例对象
*/
exports.Instance = {0}TableInstance;
"""

dirName = "data";
rroot = os.path.join(os.getcwd(), 'csvTables')
a1 = []
a2 = []
a3 = []
a4 = []

table_js_root = os.path.join(os.getcwd(), "server", "data")
if not os.path.isdir(table_js_root): exit(0)

manager_js_root = os.path.join(os.getcwd(), "server", "manager")
if not os.path.isdir(manager_js_root): exit(0)

h = open(os.path.join(manager_js_root, 'csv_manager.js'), 'w', encoding = "utf8")


for root, subdirs, files in os.walk(rroot):
    for file in files:
        if(file.find('.csv') == -1): continue
        filename = file.split(".")[0]

        a1.append("var csv" + filename.upper() + " = require('../"+dirName+"/" + filename + "');\n");
        a2.append("    var _" + filename + ";\n");
        a3.append("        _" + filename +  " = csv" + filename.upper() + ".Instance;\n");
        a4.append("    CSVManager.prototype." + filename + " = function() {\n" + "        return _" + filename + "().GetLines();\n    };\n\n")

        f = codecs.open(os.path.join(root, file), 'r', encoding = "utf_8_sig")
        g = open(os.path.join(table_js_root, filename + '.js'), 'w', encoding = "utf8")

        line = f.readline().strip()
        nm = line.split(",")

        line = f.readline().strip()
        tp = line.split(",")

        ln = len(nm)

        b1 = []
        b2 = []
        b3 = []
        field = '';
        for i in range(ln):
            if i == 0:
                field = 'tmpArr[i].' + nm[i];
            if tp[i] == 'INT':
                b1.append("        this." + nm[i] + " = 0;\n")
                b2.append("            obj." + nm[i] + " = parseInt(tmpArr[i]." + nm[i] + ");\n")
                
            elif tp[i] == "FLOAT":
                b1.append("        this." + nm[i] + " = 0;\n")
                b2.append("            obj." + nm[i] + " = parseFloat(tmpArr[i]." + nm[i] + ");\n")

            elif tp[i] == "STRING":
                b1.append("        this." + nm[i] + " = '';\n")
                b2.append("            obj." + nm[i] + " = tmpArr[i]." + nm[i] + ";\n")
                
        b1 = "".join(b1)
        b2 = "".join(b2)
        b3 = "".join(b3)

        
        g.write(out2.format(filename, b1, b2, b3, field))
        f.close()
        g.close()


a1 = "".join(a1)
a2 = "".join(a2)
a3 = "".join(a3)
a4 = "".join(a4)
h.write(out1 % (a1, a2, a3, a4))
h.close()

































