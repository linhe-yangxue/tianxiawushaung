/**
 * Created by Administrator on 2016/1/11.
 */

var fs = require('fs');
var path = require('path');

var utils = module.exports;

utils.require = function(relPath) {
    return require(path.join('../../', relPath));
}

utils.basename = function(filePath, exts) {
    var ext, idx;
    for(var i = 0; i < exts.length; i++) {
        ext = exts[i];
        idx = filePath.indexOf(ext);
        if(idx >= 0 && idx === (filePath.length - ext.length)) {
            return path.basename(filePath, ext);
        }
    }
}

utils.loadModules = function (relPath, regexp) {
    var Modules = {};
    var filenames = fs.readdirSync(path.join(process.cwd(), relPath));
    try {
        filenames.forEach(function(filename) {
            if(regexp.test(filename)) {
                var name = utils.basename(filename, ['.js', '.jx']);
                var modulePath = path.join(relPath, name);
                var Mod = utils.require(modulePath);
                var key = Mod.__type__ !== undefined ? Mod._type : name;
                Modules[key] = Mod;
            }
        });
    } catch(e) {
        console.error(relPath, e.stack);
    }
    return Modules;
}