
/**
 * 包含的头文件
 */
var protocolBase = require('../../common/protocol_base');
var basic = require('../../tools/system/basic');
var inherit = basic.inherit;
var retCode = require('../../common/ret_code');

/**
 * 协议名称的定义
 */

exports.pCSTest = 'CS_Test';
exports.pSCTest = 'SC_Test';


/**
 * 协议结构的定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 测试 [CS]
 */
var CS_Test = (function(parent) {
    inherit(CS_Test, parent);
    function CS_Test() {
        parent.apply(this, arguments);
        this.req = 'AAA'; /* AAA */
    }
    return CS_Test;
})(protocolBase.IPacket);
exports.CS_Test = CS_Test;

/**
 * 测试 [SC]
 */
var SC_Test = (function (parent) {
    inherit(SC_Test, parent);
    function SC_Test() {
        parent.apply(this, arguments);
        this.res = 'BBB'; /* BBB */
    }
    return SC_Test;
})(protocolBase.IPacket);
exports.SC_Test = SC_Test;
/**-------------------------------------------------------------------------------------------------------------------*/

