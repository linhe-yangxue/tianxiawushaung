/**
 * Created by Administrator on 2016/1/11.
 */

var SettlementCalculateExp = function () {

}

SettlementCalculateExp.prototype.calculate = function (baseA, baseB, level, consume) {
    //console.log('arg: ' + level + ', ' + consume + ', ' + (baseA + level * baseB) * consume);
    return (baseA + level * baseB) * consume;
}

module.exports = SettlementCalculateExp;