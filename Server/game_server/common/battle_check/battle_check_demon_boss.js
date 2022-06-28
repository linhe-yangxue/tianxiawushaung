/**
 * Created by Administrator on 2016/1/11.
 */
var inherits = require('util').inherits;
var BattleCheck = require('./battle_check');

var BattleCheckDemonBoss = function () {
    BattleCheck.call(this);
}

inherits(BattleCheckDemonBoss, BattleCheck);

module.exports = BattleCheckDemonBoss;