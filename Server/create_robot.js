var fs = require('fs');
var async = require('async');
var csvParse = require('./tools/parse/csv');
var globalObject = require('./common/global_object');
var rand = require('./tools/system/math').rand;
var csvManager;

/**
 * 随机生成名字
 * @returns {string}
 */
var getRandomName = function() {
    var table = csvManager.FirstName();
    var a = table[rand(1000, 1558)].FIRSTNAME;
    var b = table[rand(1000, 1558)].MIDDLENAME;
    var c = table[rand(1000, 1558)].LASTNAME;

    return a + b + c;
};


async.series([
    function(callback) {
        csvParse.Instance().load('../csvTables', callback);
    },

    function(callback) {
        csvManager = require('./manager/csv_manager').Instance();
        var robotConfig = csvManager.RobotConfig();
        var arenaRobots = {};

        for(var idx in robotConfig) {
            var robot = robotConfig[idx];
            var playerFD = new globalObject.PlayerFightDetail();
            playerFD.name = getRandomName();
            playerFD.level = robot.ROLE_LEVEL;
            playerFD.power = robot.COMBAT;

            var petFD = new globalObject.PetFightDetail();
            petFD.tid = robot.ROLE_ID;
            playerFD.petFDs.push(petFD);
            for (var i = 1; i <= 3; ++i) {
                petFD = new globalObject.PetFightDetail();
                petFD.tid = rand(robot['PETID_MIN_' + i], robot['PETID_MAX_' + i]);

                if(petFD.tid != 0) {
                    playerFD.petFDs.push(petFD);
                }
            }

            for (var i = 0; i < playerFD.petFDs.length; ++i) {
                petFD = playerFD.petFDs[i];

                var aoLine = csvManager.ActiveObject()[petFD.tid];
                var baIndex = aoLine.APTITUDE_LEVEL * 1000;
                var baLine = csvManager.BreakAttribute()[baIndex];

                petFD.attack = aoLine.BASE_ATTACK + baLine.BASE_BREAK_ATTACK
                + baLine.BREAK_ATTACK;
                petFD.hp = aoLine.BASE_HP + baLine.BASE_BREAK_HP
                + baLine.BREAK_HP;
                petFD.phyDef = aoLine.BASE_PHYSICAL_DEFENCE + baLine.BASE_BREAK_PHYSICAL_DEFENCE
                + baLine.BREAK_PHYSICAL_DEFENCE;
                petFD.mgcDef = aoLine.BASE_MAGIC_DEFENCE + baLine.BASE_BREAK_MAGIC_DEFENCE
                + baLine.BREAK_MAGIC_DEFENCE;
                petFD.criRt = aoLine.CRITICAL_STRIKE;
                petFD.dfCriRt = 0;
                petFD.hitTrRt = aoLine.HIT;
                petFD.gdRt = aoLine.DODGE;
                petFD.hitRt = 0;
                petFD.dfHitRt = aoLine.MITIGATIONG;
            }
            arenaRobots[idx] = playerFD;
        }
        fs.writeFileSync('./game_server/database/arena.json', JSON.stringify(arenaRobots));
        callback(null);
    },

    function(callback) {
        process.exit(0);
        callback(null);
    }
]);

