/**
 * Created by Administrator on 2015/12/11.
 */
var utils = require('../../../tools/system/utils');

var BattleSettlementCalculateModules = utils.loadModules('game_server/common/battle_settlement', /settlement_calculate.+\.(js|jx)/);
var BattleSettlementModules = utils.loadModules('game_server/common/battle_settlement', /battle_settlement.+\.(js|jx)/);

module.exports = (function () {
    var instance = null;

    var BattleSettlementManager = function() {
        this.battleSettlements = {};
        this.ballteSettlementCalculates = {};
    }

    BattleSettlementManager.prototype.init = function() {
        var self = this;
        for(var calculate in BattleSettlementCalculateModules) {
            self.ballteSettlementCalculates[calculate] = new BattleSettlementCalculateModules[calculate]();
        }
        for(var battlement in BattleSettlementModules) {
            self.battleSettlements[battlement] = new BattleSettlementModules[battlement](self);
        }
    }

    BattleSettlementManager.prototype.expSettlement = function(name, level, consume) {
        var self = this;
        if(undefined === self.battleSettlements[name] || null === self.battleSettlements[name]) {
            console.error('battleSettlement: ' + name + ', is not exist!');
            return;
        }
        return self.battleSettlements[name].expSettlement(level, consume);
    }

    BattleSettlementManager.prototype.coinSettlement = function(name, level, consume) {
        var self = this;
        if(undefined === self.battleSettlements[name] || null === self.battleSettlements[name]) {
            console.error('battleSettlement: ' + name + ', is not exist!');
            return;
        }
        return self.battleSettlements[name].coinSettlement(level, consume);
    }

    BattleSettlementManager.prototype.getCalculate = function(name) {
        var self = this;
        if(undefined === self.ballteSettlementCalculates[name] || null === self.ballteSettlementCalculates[name]) {
            console.error('settlementCalculate: ' + name + ', is not exist!');
            return;
        }
        return self.ballteSettlementCalculates[name];
    }

    if(null === instance) {
        instance = new BattleSettlementManager();
        instance.init();
    }

    return instance;
})();
