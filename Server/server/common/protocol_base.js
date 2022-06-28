var base = require('./../tools/system/basic');
var inherit = base.inherit;

//所有协议的基类
var ICode = (function () {
    function ICode() {
        this.vs = "";  // version
    }
    return ICode;
})();
exports.ICode = ICode;

//所有协议的基类
var IPacket = (function (parent) {
    inherit(IPacket, parent);
    function IPacket() {
        parent.apply(this, arguments);
        this.pt = ''; // packet type;
        this.pi = 0; // packet index
    }
    return IPacket;
})(ICode);
exports.IPacket = IPacket;