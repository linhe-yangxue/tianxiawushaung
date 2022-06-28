/**
 * HTTP错误的处理
 */

/**
 * 404异常
 * @param res [object]　响应对象
 */
function handleError404(res) {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write("404 Not found");
    res.end();
}

/**
 * 服务器错误的返回，目前把异常信息返回给客户端，上线时把错误信息注释掉
 * @param res [object]　响应对象
 */
function handleError500(res) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.write("500 Sever Error \n");
    res.end();
}

/**
 * 403异常
 * @param res [object]　响应对象
 */
function handleError403(res) {
    res.writeHead(403, { "Content-Type": "text/html" });
    res.write("403 Massage Error \n");
    res.end();
}
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 声明全局对象
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 404异常
 * @param command [string]　路径名　
 * @param res [object]　响应对象
 * @returns []　无返回值
 */
exports.handleError404 = handleError404;

/**
 * 服务器错误的返回，目前把异常信息返回给客户端，上线时把错误信息注释掉
 * @param command [string]　路径名
 * @param res [object]　响应对象
 * @param err [string]　错误信息
 * @returns [] 无返回值
 */
exports.handleError500 = handleError500;

/**
 * 403协议异常
 * @param res [object]　响应对象
 */
exports.handleError403 = handleError403;