/**
 * Created by Administrator on 2015/12/11.
 */
var utils = require('../../../tools/system/utils');

var BattleCheckModules = utils.loadModules('game_server/common/battle_check', /battle_check.+\.(js|jx)/);

module.exports = (function () {
    var instance = null;

    var BattleCheckManager = function() {
        this.battleChecks = {};
    }

    BattleCheckManager.prototype.init = function() {
        var self = this;
        for(var battleCheck in BattleCheckModules) {
            self.battleChecks[battleCheck] = new BattleCheckModules[battleCheck]();
        }
    }

    BattleCheckManager.prototype.checkPlug = function(name, zid, uid, rivalUid, startTime, type, damage, cb) {
        var self = this;
        if(undefined === self.battleChecks[name] || null === self.battleChecks[name]) {
            console.error('battleCheck: ' + name + ', is not exist!');
            cb(null);
            return;
        }
        self.battleChecks[name].checkPlug(zid, uid, rivalUid, startTime, type, damage, cb);
    }


    if(null === instance) {
        instance = new BattleCheckManager();
        instance.init();
    }

    return instance;
})();
