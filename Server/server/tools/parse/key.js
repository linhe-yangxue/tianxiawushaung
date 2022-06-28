var fs = require('fs');

/**
 * 获取要处理的redis key
 * @param filePath {string} 文件路径
 * @returns {object} redis key 包装对象
 */
var parseXmlNode = function(filePath) {
    var keys = {};
    var curKey = null;
    var beginMark = /<[\w]*>/;
    var endMark = /<\/[\w]*>/;
    var data = fs.readFileSync(filePath).toString();
    var lines = data.split('\n');

    for(var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (endMark.test(line)) {
            if (line.split(/<|>/)[1] == '/' + curKey) {
                curKey = null;
            }
            continue;
        }

        if (null == curKey && beginMark.test(line)) {
            curKey = line.split(/<|>/)[1];
            if (!keys.hasOwnProperty(curKey)) {
                keys[curKey] = [];
            }
            continue;
        }

        if (curKey) {
            var k = line.split("'")[1];
            if (k) {
                keys[curKey].push(k);
            }
        }
    }

    return keys;
};
exports.parseXmlNode = parseXmlNode;

//parseXmlNode('../../common/redis_key.js');
