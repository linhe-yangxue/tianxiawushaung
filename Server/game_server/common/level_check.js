var csvManager = require('../../manager/csv_manager').Instance();

/**
 * 检查主角等级是否可以使用某功能
 * @param player 主角对象
 * @param type 类型
 * @returns {boolean} 是否可以使用
 */
module.exports = function levelCheck(player, type) {
    var fcTable = csvManager.FunctionConfig();
    var vipLevel = player.vipLevel;
    var chaLevel = player.character.level;

    var line;
    switch (type) {
        case 'guild':
            line = fcTable[900];
            break;

        case 'climbTower':
            line = fcTable[1407];
            break;

        case  'arena':
            line = fcTable[1406];
            break;

        case 'robOneKey':
            line = fcTable[2202];
            break;

        default :
            break;
    }

    if(!line) {
        return true;
    }

    var words = line.FUNC_CONDITION_USE.split('|');
    if(words.length < 13) {
        return true;
    }

    return chaLevel >= parseInt(words[vipLevel]);
};
