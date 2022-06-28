/**
 * Created by 薄雪婷 on 2016/3/7.
 */
var fs = require('fs');
var path = require('path');

var root = process.cwd();                                                       //当前的绝对路径
var target = path.join(root, "server", "common");                               //要读取的文件夹的路径

var template = "{0}\n\
/**\n\
 * 声明全局对象\n\
 */\n\
{1}\n\
";

var A = "\n\
/**\n\
 * {0}\n\
 */\n\
var {1} = (function() {\n\
    function {1}() {\n\
{2}\n\
    }\n\
    return {1};\n\
})();\n\
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
    var m = [];
    var input = fs.readFileSync(pathname, 'utf-8');
    m = (input.split("\r\n")).slice(0,(input.split("\r\n")).length - 1);
    callback(m);
}

/**
 * 创建js文件，并写入数据
 */
function createJSFile(pathname){
    fs.readdirSync(pathname).forEach(function (fileName) {
        var fullPath = pathname + '/' + fileName; /* 拼接完整路径 */
        var filename = path.basename(fullPath, '.csv');                         //fileName是加后缀名的文件名称,filename是不加后缀名的文件名称
        var out1 = "";
        var out2 = "";
        readFile(fullPath, function (fileContent) {
            for(var i = 0; i < fileContent.length; i++){
                var row = [];                                  //每一行的信息
                row = fileContent[i].split(",");

                if(row[0] == "") {
                    break;
                }

                var str1 = "";

                for(var j = 2; j < row.length; j += 3){
                    if(row[j] === ""){
                        break;
                    }

                    var v = "''";
                    if(j+1 < row.length && row[j+1] != ""){
                        v = row[j+1];
                    }
                    str1 += "        this." + row[j] + " = " + v + ";";

                    if(j+2 >= row.length || row[j+2] == ""){
                        str1 += "\n";
                    }else{
                        str1 += " /* " + row[j+2] + " */ \n";
                    }
                }

                out1 += A.format(row[0], row[1], str1);
                out2 += "exports." + row[1] + " = "  + row[1] + "; /* " + row[0] + " */\n";
            }
        });
        fs.writeFile(path.join(target, filename + ".js"), (template.format(out1, out2)), { encoding:'utf-8' }, function (err) {
            if(err){
                console.error(err);
            }else{
                console.log("写入  "+filename+".js 成功");
            }
        });
    });
}

function startWrite(pn){
    if(!(fs.statSync(target).isDirectory())){
        console.log("要写入的目标文件夹不存在!!!");
        return;
    }
    createJSFile(pn);
}

startWrite(path.join(root, "protocalsObject"));