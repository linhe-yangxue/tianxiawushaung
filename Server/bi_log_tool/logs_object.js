/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：bi tool会用到的全局对象
 * 开发者：高骏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 记录实时log解析的文件和偏移等信息
 */
var logRunTime = (function() {
    function logRunTime() {
        this.fileNameEnd = '';/*上一次解析的文件名*/
        this.offset = 0;/*上一次解析的文件的偏移*/
        this.surplusStr = '';/*上一次剩余的字符串*/

    }
    return logRunTime;
})();
exports.logRunTime = logRunTime;

/**
 * 日志内容对象
 */
var logContent = (function() {
    function logContent() {
        this.zid = 0;/*区id*/
        this.tableIndex = 0;/*表名序号*/
        this.content = '';/*要插入的内容*/

    }
    return logContent;
})();
exports.logContent = logContent;