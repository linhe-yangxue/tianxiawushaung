/**
 * Created by Administrator on 2016/1/11.
 */
var csvManager = require('../../../manager/csv_manager').Instance();

var BattleSettlement = function (manager) {
    this.manager = manager;
    this.battleSettlementConfig = csvManager.PowerEnergy();
}


BattleSettlement.prototype.expSettlement = function () {
    console.error('please implement expSettlement');
}

BattleSettlement.prototype.coinSettlement = function () {
    console.error('please implement coinSettlement');
}

BattleSettlement.prototype.staminaSettlement = function () {
    console.error('please implement staminaSettlement');
}

module.exports = BattleSettlement;