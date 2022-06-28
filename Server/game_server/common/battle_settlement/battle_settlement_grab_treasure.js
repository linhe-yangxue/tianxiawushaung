/**
 * Created by Administrator on 2016/1/11.
 */

var inherits = require('util').inherits;
var BattleSettlement = require('./battle_settlement');

var COIN_SETTLEMENT_CONFIG_INDEX = 4;
var EXP_SETTLEMENT_CONFIG_INDEX = 3;

var EXP_CALCULATE_NAME = 'settlement_calculate_exp';
var COIN_CALCULATE_NAME = 'settlement_calculate_coin';

var BattleSettlementGrabTreasure = function(manager) {
    BattleSettlement.call(this, manager);
    this.EXP_CONT_BASE = this.battleSettlementConfig[EXP_SETTLEMENT_CONFIG_INDEX].BASE;
    this.EXP_CONT_RATIO = this.battleSettlementConfig[EXP_SETTLEMENT_CONFIG_INDEX].QUOTIETY;
    this.COIN_CONT_BASE = this.battleSettlementConfig[COIN_SETTLEMENT_CONFIG_INDEX].BASE;
    this.COIN_CONT_RATIO = this.battleSettlementConfig[COIN_SETTLEMENT_CONFIG_INDEX].QUOTIETY;
    this.expCalculate = manager.getCalculate(EXP_CALCULATE_NAME);
    this.coinCalculate = manager.getCalculate(COIN_CALCULATE_NAME);
}

inherits(BattleSettlementGrabTreasure, BattleSettlement);

BattleSettlementGrabTreasure.prototype.expSettlement = function (level, stamina) {
    return this.expCalculate.calculate(this.EXP_CONT_BASE, this.EXP_CONT_RATIO, level, stamina);
}

BattleSettlementGrabTreasure.prototype.coinSettlement = function (level, stamina) {
    return this.coinCalculate.calculate(this.COIN_CONT_BASE, this.COIN_CONT_RATIO, level, stamina);
}

module.exports = BattleSettlementGrabTreasure;