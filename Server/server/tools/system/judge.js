
/**
 * 对象判空函数
 * @param target [object] 对象
 * @returns {boolean} 返回真假
 */
var objectEmpty = function(target) {
   for(var i in target) {
       return false;
   }
   return true;
};

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 对象判空函数
 * @param target [object] 对象
 * @returns {boolean} 返回真假
 */
exports.objectEmpty = objectEmpty;