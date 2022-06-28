/*
 生成热更新文件列表
 */
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var cfg = require('./GenerateFileList.json');

/**
 * 生成文件列表
 * @param generateFile      生成列表目标文件
 */
function Generate(generateFile) {
    var fileList = [];
    AddFolderFilesToList('.', generateFile, fileList);

    var tmpStrFileList = JSON.stringify({
        files : fileList
    });
    
    tmpStrFileList = tmpStrFileList.replace(/\\\\/g, '/');
    
    var tmpFilePath = path.join('.', generateFile);
    fs.writeFile(tmpFilePath, tmpStrFileList, 'ascii', function(err) {
        console.log(err ? err : 'Generate success.');
    });
}

/**
 * 将制定文件夹内文件加入列表内
 * @param folder            要生成列表的文件夹路径
 * @param generateFile      生成列表目标文件
 * @param fileList          文件列表
 * @constructor
 */
function AddFolderFilesToList(folder, generateFile, fileList) {
    var files = fs.readdirSync(folder);
    
    for(var index = 0; index < files.length; ++index) {
    
        var file = files[index];
        var tmpPath = path.join(folder, file);     
        var stats = fs.statSync(tmpPath);
        
        if(stats.isDirectory()) {
            AddFolderFilesToList(tmpPath, generateFile, fileList);
            continue;
        }

        if(file == generateFile) {
            continue;
        }
        
        if(path.extname(file) != '.bytes') {
            fs.unlinkSync(tmpPath)
            continue;
        }

        var tmpFileInfo = {
            path : '/' + tmpPath,
            size : stats.size
        };
        
        //获取md5
        var md5 = crypto.createHash('md5');
        md5.update(fs.readFileSync(tmpPath));
        tmpFileInfo['md5'] = md5.digest('hex');
        fileList.push(tmpFileInfo);
    }
}

process.chdir(cfg.rootPath);
Generate(cfg.generateFile);
