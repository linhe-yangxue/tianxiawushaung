/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：主角和符灵技能升级
 * 开发者：卢凯鹏
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/skill');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require("async");
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var packageDb = require('../database/package');
var cPackage = require('../common/package');
var itemType = require('../common/item_type');
var csvManager = require('../../manager/csv_manager').Instance();
var globalObject = require('../../common/global_object');
var logger = require('../../manager/log4_manager');
var cMission = require('../common/mission');
var cRevelry = require('../common/revelry');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 升级技能
 */
var CS_UpgradeSkill = (function() {

    /**
     * 构造函数
     */
    function CS_UpgradeSkill() {
        this.reqProtocolName = packets.pCSUpgradeSkill;
        this.resProtocolName = packets.pSCUpgradeSkill;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_UpgradeSkill.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_UpgradeSkill();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid
                || null == req.itemId
                || null == req.skillIndex) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.itemId = parseInt(req.itemId);
            req.skillIndex = parseInt(req.skillIndex);

            if(isNaN(req.zid) || isNaN(req.itemId) || isNaN(req.skillIndex)
                || req.skillIndex < 0 || req.skillIndex >= 4) { /* skillIndex范围0-3 */
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var heroName = '';
            var heroLevel = 0;
            var skillName = '';
            var skillLevel = 0;
            var arrSub = [];
            var skillLimit = Object.keys(csvManager.SkillCost()).length; /* 技能上限 */
            var petPkg; /* 符灵背包 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, false, callback);
                },

                function(data, callback) {
                    petPkg = data;
                    var pet = cPackage.getItemByItemId(petPkg, req.itemId);

                    if(pet == null) { /* 符灵不存在 */
                        callback(retCode.ITEM_NOT_EXIST);
                        return;
                    }

                    var acLine = csvManager.ActiveObject()[pet.tid];
                    if(!acLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    heroName = acLine.NAME;
                    heroLevel = pet.level;
                    var heroSkill = acLine['PET_SKILL_'+ (req.skillIndex + 1)];

                    skillLevel = pet.skillLevel[req.skillIndex];
                    if(skillLevel >= heroLevel || skillLevel >= skillLimit) { /* 技能等级已满 */
                        callback(retCode.SKILL_LEVEL_FULL);
                        return;
                    }

                    if(pet.breakLevel < acLine['SKILL_ACTIVE_LEVEL_' + (req.skillIndex + 1)]) {
                        callback(retCode.BREAK_LEVEL_NOT_RIGHT);
                        return;
                    }

                    var skLine;
                    if(heroSkill >= 300000 && heroSkill < 400000) {
                        skLine = csvManager.AffectBuffer()[heroSkill];
                    }
                    else {
                        skLine = csvManager.Skill()[heroSkill];
                    }
                    if(!skLine) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    skillName = skLine.NAME;

                    var line = csvManager.SkillCost()[skillLevel];
                    if(!line) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }

                    var item = new globalObject.ItemBase();
                    item.itemId = -1;
                    item.tid = itemType.ITEM_TYPE_GOLD;
                    item.itemNum = line.MONEY_COST;
                    arrSub.push(item);

                    var item = new globalObject.ItemBase();
                    item.tid = itemType.SKILL_BOOK;
                    item.itemNum = line.SKILL_BOOK_COST;
                    arrSub.push(item);

                    callback(null);
                },

                function(callback) {
                    packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_CONSUME_ITEM, false, callback);
                },

                /* 查找技能书itemId */
                function(pkg, callback) {
                    var item = null;
                    for(var i = 0; i < pkg.content.length; ++i) {
                        if(pkg.content[i].tid == itemType.SKILL_BOOK) {
                            item = pkg.content[i];
                            break;
                        }
                    }

                    if(null == item) {
                        callback(retCode.NO_SKILL_BOOK);
                        return;
                    }

                    arrSub[1].itemId = item.itemId;
                    callback(null);
                },

                function(callback) {
                    cPackage.updateItemWithLog(req.zid, req.zuid, arrSub, [], req.channel, req.acc, logsWater.UPGRADESKILL_LOGS, req.itemId, function(err) {
                        callback(err);
                    });
                },

                function(callback) {
                    var item = cPackage.getItemByItemId(petPkg, req.itemId);
                    item.skillLevel[req.skillIndex] += 1;

                    /* 更新狂欢进度 */
                    cRevelry.updateRevelryProgress(req.zid, req.zuid, 17, item.skillLevel[req.skillIndex]);
                    var petOnsite = [];
                    for(var i = 0; i < petPkg.content.length; ++i) {
                        var pet = petPkg.content[i];
                        if(pet.teamPos >= 1 && pet.teamPos <= 3) {
                            petOnsite.push(pet)
                        }
                    }
                    if(petOnsite.length == 3) {
                        var levelMin = 1000000;
                        for(var i = 0; i < petOnsite.length; ++i) {
                            for(var j = 0; j < petOnsite[i].skillLevel.length; ++j) {
                                if(petOnsite[i].skillLevel[j] < levelMin) {
                                    levelMin = petOnsite[i].skillLevel[j];
                                }
                            }
                        }
                        cRevelry.updateRevelryProgress(req.zid, req.zuid, 13, levelMin);
                    }
                    packageDb.savePackage(req.zid, req.zuid, petPkg, true, callback);
                },

                /* 更新任务进度 */
                function(callback) {
                    cMission.updateDailyTask(req.zid, req.zuid, cMission.TASK_TYPE_19, 0, 1);
                    cMission.updateAchieveTask(req.zid, req.zuid, cMission.TASK_TYPE_19, 0,  0, 1);
                    callback(null);
                }
            ],function(err) {
                if(err) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_hero_skill, preZid, req.channel, req.zuid, req.zuid, 0, req.itemId, heroName, heroLevel, skillName, (skillLevel - 1), skillLevel, req.skillIndex);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_UpgradeSkill;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_UpgradeSkill());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
