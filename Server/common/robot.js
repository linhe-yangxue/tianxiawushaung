var globalObject = require('./global_object');
var csvManager = require('../manager/csv_manager').Instance();
var retCode = require('../common/ret_code');
var rand = require('../tools/system/math').rand;
var arenaDb = require('../game_server/database/arena');
/**
 * 判断zuid是否是机器人
 * @param zuid
 * @returns {boolean}
 */
var checkIfRobot = function(zuid) {
    return !isNaN(zuid);
};
exports.checkIfRobot = checkIfRobot;


/**
 *  获取一个机器人战斗信息
 *  @param robotConfigIndex [int] robotConfig配置文件INDEX
 * @param cb [func] 返回错误码[int](retCode)和数据(globalObject.PlayerFightDetail对象,机器人战斗信息)
 */
var createRobotFightDetail = function (robotConfigIndex, cb) {
    var robotConfig = csvManager.RobotConfig()[robotConfigIndex];
    if(undefined === robotConfig || null === robotConfig) {
        cb(retCode.ARENA_ROBOT_CONFIG_CANNON_FODDER_NOT_EXIST);
        return;
    }
    var playerFD = new (globalObject.PlayerFightDetail)();
    playerFD.name = arenaDb.getRandomName();;
    playerFD.level = robotConfig.ROLE_LEVEL;
    playerFD.power = robotConfig.COMBAT;

    var petFD = new globalObject.PetFightDetail();
    petFD.tid = robotConfig.ROLE_ID;
    playerFD.petFDs.push(petFD);
    for(var i = 1; i <= 3; ++i) {
        petFD = new globalObject.PetFightDetail();
        petFD.tid = rand(robotConfig['PETID_MIN_' + i],  robotConfig['PETID_MAX_' + i]);
        if(petFD.tid > 0) {
            playerFD.petFDs.push(petFD);
        }
    }

    for(var i = 0; i < playerFD.petFDs.length; ++i) {
        petFD =  playerFD.petFDs[i];

        var aoLine = csvManager.ActiveObject()[petFD.tid];
        var baIndex = aoLine.APTITUDE_LEVEL * 1000;
        var baLine = csvManager.BreakAttribute()[baIndex];

        petFD.attack = aoLine.BASE_ATTACK + baLine.BASE_BREAK_ATTACK
        + baLine.BREAK_ATTACK;
        petFD.hp = aoLine.BASE_HP + baLine.BASE_BREAK_HP
        + baLine.BREAK_HP;
        petFD.phyDef = aoLine.BASE_PHYSICAL_DEFENCE + baLine.BASE_BREAK_PHYSICAL_DEFENCE
        + baLine.BREAK_PHYSICAL_DEFENCE ;
        petFD.mgcDef = aoLine.BASE_MAGIC_DEFENCE + baLine.BASE_BREAK_MAGIC_DEFENCE
        + baLine.BREAK_MAGIC_DEFENCE;
        petFD.criRt = aoLine.CRITICAL_STRIKE;
        petFD.dfCriRt = 0;
        petFD.hitTrRt = aoLine.HIT;
        petFD.gdRt = aoLine.DODGE;
        petFD.hitRt = 0;
        petFD.dfHitRt = aoLine.MITIGATIONG;
    }
    cb(null, playerFD);
}
exports.createRobotFightDetail = createRobotFightDetail;
