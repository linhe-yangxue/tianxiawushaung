/**
 * Created by boxt on 2016/3/23.
 */
var xlsx = require("xlsx");
var fs = require("fs");
var path = require("path");

function readFile(pathname){
    fs.readdirSync(pathname).forEach(function (fileName) {
        var fullPath = pathname + '/' + fileName;
        var filename = path.basename(fullPath, '.xlsx');
        var fileContent = xlsx.readFile(fullPath);

        toCSV(fileContent, function(result){
            result = "\uFEFF" + result;
            fs.writeFile(path.join("./CSV", filename + ".csv"), result, {encoding: 'utf8'}, function (err) {
                if(err){
                    console.error(err);
                }else {
                    console.log("写入 " + filename + ".csv 成功");
                }
            });
        });
    });
}

function toCSV(workbook, callback){
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var csv = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if(csv.length > 0){
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(csv);
        }
    });
    callback(result.join("\n"));
}

function createFolder(){
    var pathname = "./CSV";
    fs.exists(pathname, function (exists) {
        if(!exists){
            fs.mkdir(pathname, function(err){
               if(err){
                   console.log("创建CSV文件夹失败");
                   return;
               }
            });
        }
    });
}

function startWrite(pathname){
    createFolder();
    readFile(pathname);
}

startWrite("./Excel");