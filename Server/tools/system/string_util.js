/**
 * 格式化字符串 'A{0}C{1}'.format('B', 'D') === 'ABCD'
 * @param args
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
