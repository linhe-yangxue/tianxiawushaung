/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * GM错误码(GM文档规定的，勿动)
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GM_SUCCESS = 0; /* 成功*/
exports.GM_PROTO_ERR = 1; /* 接口错误 */
exports.GM_SIGN_PLUG = 2; /* 签名错误 */
exports.GM_PARAM_ERR = 3; /* 自定义错误，如参数错误 */
exports.GM_UNKNOWN_ERR = 4; /* 未知错误 */


/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * GM其他标识码
 * 说明：因运维有用GM工具查，BI中GM操作日志功能，我们只把err=exports.GM_SUCCESS插入数据库，且只有req信息。
 * 所以定一个，表示res的日志标识，即如下，不插入数据库，只用于自己查看。
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GM_RES = 10000; /* 记录返回GM的信息 */
exports.GM_SIGN = 10001; /* 记录发来sign错误时，正确的sign信息 */
exports.GM_SIGN_REQ = 10002; /* 记录发来sign错误时，请求的串 */

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * SC_GM返回消息结构，msg字段填的str
 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 角色相关
 */
exports.GMERR_GETUIDFAIL = 'get uid fail.'; /* 获取角色ID失败 */
exports.GMERR_GETPLAYERFAIL = 'get player fail.';/* 获取player对象失败 */
exports.GMERR_SAVEPLAYERFAIL = 'save player fail.';/* 保存player对象失败 */
exports.GMERR_QUERYREDISFAIL = 'query redis fail.';/* 查询redis失败 */
exports.GMERR_ROLLIDREPEAT = 'roll playing id repeat.';/* 走马灯id重复 */
exports.GMERR_DELANNFAIL = 'del announce fail for id not find.';/* 删除公告，公告id未找到 */
exports.GMERR_ANNIDNOTEXIST = 'announce not exist.';/* 公告id不存在 */

/**
 * 全服相关
 */
exports.GMERR_NOTZONE = 'not zone.'; /* 没有该区 */
exports.GMERR_NOTDELSERVER = 'the zone does not exist,cannot be del.'; /* 该区不存在，不能删除 */
exports.GMERR_NOTADDSERVER = 'the zone exist,cannot be add.'; /* 该区已存在，不能添加 */
exports.GMERR_NOTROLLID = 'the roll id not exist.'; /* 走马灯id不存在 */
exports.GMERR_REGISTERSTATE = 'the register state of the same.'; /* 注册状态相同 */
/**
 * 某区相关
 */
exports.GMERR_NOTGUILD = 'not guild.'; /* 没有该公会 */
exports.GMERR_NOTAID = 'not aid.'; /* 没有该活动id */
/**
 * 充值相关
 */
exports.GMERR_MAKEUP_CHARGE_PARAMETER_ERR = 'makeup charge parameter err';
exports.GMERR_CHARGE_WRONG_CPORDER = 'wrong cporder';
exports.GMERR_CHARGE_GOODID_ERR = 'good id err';

