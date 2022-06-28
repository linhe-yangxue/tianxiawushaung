/**
 * Created by 薄雪婷 on 2016/3/7.
 */
var fs = require('fs');
var path = require('path');

var root = process.cwd();                                                       //当前的绝对路径
var target = path.join(root, "server", "game_server", "packets");               //要读取的文件夹的路径

var template = "\n\
/** \n\
 * 包含的头文件\n\
 */\n\
var protocolBase = require('../../common/protocol_base');\n\
var basic = require('../../tools/system/basic');\n\
var inherit = basic.inherit;\n\
var retCode = require('../../common/ret_code');\n\
\n\
/**\n\
 * 协议名称的定义\n\
 */\n\
{0}\n\
\n\
/**\n\
 * 协议结构的定义\n\
 */\n\
/**-------------------------------------------------------------------------------------------------------------------*/\n\
{1}\n";



var A = "\n\
exports.pCS{0} = 'CS_{0}';\n\
exports.pSC{0} = 'SC_{0}';\n";



var B = "\n\
/**\n\
 * {0} [CS]\n\
 */\n\
var CS_{1} = (function(parent) {\n\
    inherit(CS_{1}, parent);\n\
    function CS_{1}() {\n\
        parent.apply(this, arguments);\n\
{2}    }\n\
    return CS_{1};\n\
})(protocolBase.IPacket);\n\
exports.CS_{1} = CS_{1};\n\
\n\
/**\n\
 * {0} [SC]\n\
 */\n\
var SC_{1} = (function (parent) {\n\
    inherit(SC_{1}, parent);\n\
    function SC_{1}() {\n\
        parent.apply(this, arguments);\n\
{3}    }\n\
    return SC_{1};\n\
})(protocolBase.IPacket);\n\
exports.SC_{1} = SC_{1};\n\
/**-------------------------------------------------------------------------------------------------------------------*/\n\
";


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
 * 创建js文件，并写入数据
 */
function createJSFile(pathname){
    fs.readdirSync(pathname).forEach(function(fileName){
        var fullPath = pathname + '/' + fileName; /* 拼接完整路径 */
        var filename = path.basename(fullPath, '.csv');                         //fileName是加后缀名的文件名称,filename是不加后缀名的文件名称
        var out1 = "";
        var out2 = "";
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

                var str1 = "";
                var str2 = "";

                for(var j = 1; j < row2.length; j += 3){
                    if(row2[j] === ""){
                        break;
                    }

                    var v = "''";
                    if(row2[j+1] !== ""){
                        if(row2[j+1][0] === "[" && row2[j+1][row2[j+1].length - 1] ==="]"){
                            v = "[]";
                        }else if(row2[j+1][0] === "{" && row2[j+1][row2[j+1].length - 1] ==="}"){
                            v = "{}";
                        }else{
                            v = row2[j+1];
                        }
                    }
                    str1 += "        this." + row2[j] + " = " + v + ";";

                    if(j+2 >= row2.length || row2[j+2] == ""){
                        str1 += "\n";
                    }else{
                        str1 += " /* " + row2[j+2] + " */\n";
                    }
                }

                for(var k = 1; k < row3.length; k += 3){
                    if(row3[k] === ""){
                        break;
                    }

                    var v = "''";
                    if(row3[k+1] !== ""){
                        if(row3[k+1][0] === "[" && row3[k+1][row3[k+1].length - 1] ==="]"){
                            v = "[]";
                        }else if(row3[k+1][0] === "{" && row3[k+1][row3[k+1].length - 1] ==="}"){
                            v = "{}";
                        }else{
                            v = row3[k+1];
                        }
                    }
                    str2 += "        this." + row3[k] + " = " + v + ";";

                    if(k+2 >= row3.length || row3[k+2] == ""){
                        str2 += "\n";
                    }else{
                        str2 += " /* " + row3[k+2] + " */\n";
                    }
                }

                out1 += A.format(row1[1]);
                out2 += B.format(row1[0], row1[1], str1, str2);
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

startWrite(path.join(root, "protocals"));