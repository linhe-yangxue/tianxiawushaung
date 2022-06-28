/**
 * Created by Administrator on 2016/1/11.
 */

var SettlementCalculateCoin = function () {

}

SettlementCalculateCoin.prototype.calculate = function (baseA, baseB, level, consume) {
    //console.log('arg: ' + level + ', ' + consume + ', ' + (baseA + level * baseB) * consume);
    return (baseA + level * baseB) * consume;
}

module.exports = SettlementCalculateCoin;