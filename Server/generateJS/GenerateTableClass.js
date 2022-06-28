/**
 * Created by 薄雪婷 on 2016/3/8.
 */
var fs = require('fs');
var path = require('path');

var root = path.join(process.cwd(), 'csvTables');                               //当前的绝对路径
var table_js_root = path.join(process.cwd(), "server", "data");                   //要读取的文件夹的路径
var manager_js_root = path.join(process.cwd(), "server", "manager");

var out1 = "\n\
/** 包含的头文件 */\n\
{0}\n\
\n\
/**\n\
 * [当前为生成代码，不可以修改] CSC 配置表的管理类\n\
 * */\n\
var CSVManagerInstance = (function() {\n\
    /** 类的成员变量 */\n\
    var _unique;\n\
{1}\n\
    /**\n\
     * 单例函数\n\
     */\n\
    function Instance() {\n\
        if(_unique === undefined) {\n\
            _unique = new CSVManager();\n\
        }\n\
        return _unique;\n\
    }\n\
\n\
    /**\n\
     * 构造函数\n\
     */\n\
    function CSVManager() {\n\
{2}\n\
    }\n\
{3}\n\
    /**\n\
     * 返回一个单例函数\n\
     */\n\
    return Instance;\n\
})();\n\
\n\
/** 声明一个单例对象 */\n\
exports.Instance = CSVManagerInstance;\n\
";

var out2 = "\n\
/** 包含的头文件 */\n\
var csvParse = require('../tools/parse/csv');\n\
\n\
/**\n\
 * [当前为生成代码，不可以修改] {0} 类为 {0}Table 每一行的元素对象\n\
 * */\n\
var {0} = (function() {\n\
\n\
    /**\n\
     * 构造函数\n\
     */\n\
    function {0}() {\n\
{1}\n\
    }\n\
\n\
    return {0};\n\
})();\n\
\n\
/**\n\
 * [当前为生成代码，不可以修改] {0} 配置表\n\
 * */\n\
var {0}TableInstance = (function() {\n\
\n\
    /**\n\
     * 类的成员变量\n\
     */\n\
    var _unique;\n\
    var _lines;\n\
\n\
    /**\n\
     * 单例函数\n\
     */\n\
    function Instance() {\n\
        if(_unique === undefined) {\n\
            _unique = new {0}Table();\n\
        }\n\
        return _unique;\n\
    }\n\
\n\
    /**\n\
     * 构造函数\n\
     */\n\
    function {0}Table() {\n\
        _lines = {};\n\
        var tmpArr = csvParse.Instance().getTable('{0}');\n\
        for(var i = 0; i < tmpArr.length; ++i) {\n\
            var obj = new {0}();\n\
{2}\n\
            _lines[{4}] = obj;\n\
{3}\n\
        }\n\
    }\n\
\n\
    /**\n\
     * 获取行队列\n\
     */\n\
    {0}Table.prototype.GetLines = function() {\n\
        return _lines;\n\
    };\n\
\n\
    /**\n\
     * 返回一个单例函数\n\
     */\n\
    return Instance;\n\
})();\n\
\n\
/**\n\
 * 声明一个单例对象\n\
 */\n\
exports.Instance = {0}TableInstance;\n\
";

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

/**
 * 读取文件，将文件内容放入数组m中,参数pathname即为文件的路径
 */
function readFile(pathname, callback) {
    //var m = [];
    var input = fs.readFileSync(pathname, 'utf-8').trim().split("\n");
    //m = (input.split("\r\n")).slice(0,(input.split("\r\n")).length - 1);
    callback(input);
}

/**
 * 创建js文件，并写入数据
 */
function createJSFile(pathname) {
    var a1 = [];
    var a2 = [];
    var a3 = [];
    var a4 = [];
    fs.readdirSync(pathname).forEach(function (fileName) {
        var fullPath = path.join(pathname, fileName);/* 拼接完整路径 */
        var filename = '';
        if (fs.statSync(fullPath).isFile() && (fileName.indexOf('.csv') !== -1)) {
            filename = path.basename(fullPath, '.csv');                         //filename是不加后缀名的文件名称
        }

        if (filename !== '') {
            a1.push("var csv" + filename.toUpperCase() + " = require('../" + "data" + "/" + filename + "');\n");
            a2.push("    var _" + filename + ";\n");
            a3.push("        _" + filename + " = csv" + filename.toUpperCase() + ".Instance;\n");
            a4.push("    CSVManager.prototype." + filename + " = function() {\n" + "        return _" + filename + "().GetLines();\n    };\n\n");

            var b1 = [];
            var b2 = [];
            var b3 = [];
            var field = '';

            readFile(fullPath, function (fileContent) {
                var row = [];                                   //第一行的信息
                var row1 = [];                                  //第二行的信息
                row = fileContent[0].split(",");
                row1 = fileContent[1].split(",");

                for (var j = 0; j < row.length; j++) {
                    if (j === 0) {
                        field = 'tmpArr[i].' + row[j];
                    }

                    if (row1[j] === 'INT') {
                        b1.push("        this." + row[j] + " = 0;\n");
                        b2.push("            obj." + row[j] + " = parseInt(tmpArr[i]." + row[j] + ");\n");
                    } else if (row1[j] === "FLOAT") {
                        b1.push("        this." + row[j] + " = 0;\n");
                        b2.push("            obj." + row[j] + " = parseFloat(tmpArr[i]." + row[j] + ");\n");
                    } else if (row1[j] === "STRING") {
                        b1.push("        this." + row[j] + " = '';\n");
                        b2.push("            obj." + row[j] + " = tmpArr[i]." + row[j] + ";\n");
                    }
                }

            });
            var b11 = b1.join("");
            var b22 = b2.join("");
            var b33 = b3.join("");

            fs.writeFile(path.join(table_js_root, filename + '.js'), (out2.format(filename, b11, b22, b33, field)), {encoding: 'utf-8'}, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("写入 " + filename + ".js 成功");
                }
            });
        }
    });
    var a11 = a1.join("");
    var a22 = a2.join("");
    var a33 = a3.join("");
    var a44 = a4.join("");
    fs.writeFile(path.join(manager_js_root, 'csv_manager.js'), (out1.format(a11, a22, a33, a44)), { encoding:'utf-8' }, function (err) {
        if(err){
            console.error(err);
        }else{
            console.log("写入 csv_manager.js 成功");
        }
    });
}

function startWrite(pn){
    if((!(fs.statSync(table_js_root).isDirectory())) || (!(fs.statSync(manager_js_root).isDirectory()))){
        console.log("要写入的目标文件夹不存在!!!");
        return;
    }
    createJSFile(pn);
}

startWrite(root);
