/**
 * Created by Administrator on 2016/1/11.
 */
var inherits = require('util').inherits;
var BattleCheck = require('./battle_check');

var BattleCheckGuildBoss = function () {
    BattleCheck.call(this);
}

inherits(BattleCheckGuildBoss, BattleCheck);

module.exports = BattleCheckGuildBoss;