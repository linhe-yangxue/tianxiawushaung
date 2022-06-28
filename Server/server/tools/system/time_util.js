var dateFormat = require('dateformat');

/**
 *
 * @param dateString {string} 日期
 * @param num {int} 时间点如17：00
 * @returns {int} 时间点的秒数
 */
function getDetailTime(dateString, num) {
    return parseInt((new Date(dateString)).setHours(num, 0, 0, 0).valueOf() / 1000);
}
exports.getDetailTime = getDetailTime;

/**
 * 获取每周的周一时间
 * */
var getMondayTime = function() {
    var date = new Date();
    var day =  date.getDay();

    if(0 == day) {
        day = 7;
    }

    date.setDate(date.getDate() - day + 1);

    return parseInt(new Date(date.toDateString()).getTime() / 1000);
};
exports.getMondayTime = getMondayTime;

/**
 * 获取当前的时间字符串 格式为 年月日
 * */
function getDateFormat(date, format) {
    return dateFormat(date, format || "yyyy-mm-dd HH:MM:ss");
}
exports.getDateFormat = getDateFormat;

/**
 * 功能: 返回当前系统时间
 * @returns {Date}
 */
var now = function () {
    return new Date();
};
exports.now = now;

/**
 * 功能: 是否是同一天
 * @param [date object] date1
 * @param [date object] date2
 * @returns {boolean}
 */
var ifSameDay = function (date1, date2) {
    return  (dateFormat(date1, 'yyyy-mm-dd') === dateFormat(date2, 'yyyy-mm-dd'));
};
exports.ifSameDay = ifSameDay;

/**
 * 功能: 是否是同一天
 * @param [date object] date
 * @returns {int} 时间点的秒数
 */
var zeroTime = function (date) {
    return parseInt((new Date(date.getYear(), date.getMonth(), date.getDate())).getTime() / 1000);
};
exports.zeroTime = zeroTime;
