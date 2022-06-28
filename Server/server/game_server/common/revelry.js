/*
 1.登陆天数 ***
 2.通关轻松难度章节 ***
 3.主角等级 ***
 4.全部绿装 ***
 5.装备16件装备且最低强化等级大于等于 ***
 6.竞技场排名小于等于 ***
 7.装备4只符灵且最低突破单位 ***
 8.装备16件装备且最低精炼大于等于 ***
 9.封灵塔通关层数大于等于 ***
 10.装备3只符灵并且最小符灵等级大于等于 ***
 11.累计充值 ***
 12.单件装备精炼大于等于 ***
 13.三只符灵全部上场并且最小技能等级大于等于 ***
 14.主角战斗力大于等于 ***
 15.穿满8件法器并且最小精炼等级大于等于 ***
 16.合成法器数量大于等于 ***
 17.一名伙伴技能达到 ***
 18.单件法器精炼等级大于等于 ***
 19.天魔挑战次数大于等于 ***
 20.通关普通难度章节 ***
 21.封灵塔历史最高排名小于等于（活动开启后计数）
 22.合成紫色法器数量大于等于
 23.合成橙色法器数量大于等于
 24.符灵商店购买物品次数大于等于（活动开启后计数)
 25.符灵商铺刷新次数大于等于（活动开启后计算）
 26.商城中购买降魔令个数大于等于（活动开启后计算）
 27.天魔每日累计功勋大于等于（活动开启后计算）
 28.天魔最高伤害达到大于等于（活动开启后计算）
 29.封灵塔重置次数大于等于（活动开启后计算)
 31.所有上阵符灵天命等级到达x级
 32.上阵符灵中天命最高等级到达x级
 */

var async = require('async');
var retCode = require('../../common/ret_code');
var accountDb = require('../database/account');
var revelryDb = require('../database/revelry');
var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var climbTowerDb = require('../database/climb_tower');
var timeUtil = require('../../tools/system/time_util');
var packageDb = require('../database/package.js');

/**
 * 更新狂欢值
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param type [int] 狂欢类型
 * @param value [int] 属性值
 */
exports.updateRevelryProgress = function updateRevelryProgress(zid, zuid, type, value) {
    /* 对任务的开始时间做检查 */
    var specialType = [21, 24, 25, 26, 27, 28, 29];
    
    async.waterfall([
        /* 获取区信息 */
        function(callback) {
            accountDb.getZoneInfo(zid, callback);
        },

        /* 判断狂欢是否结束 */
        function(zoneInfo, callback) {
            var openSeconds = parseInt((new Date(zoneInfo.openDate)).setHours(0).valueOf() / 1000);
            var nowSeconds = parseInt(Date.now() / 1000);
            var diffSeconds = nowSeconds - openSeconds;

            if (diffSeconds > 7 * 24 * 3600) {
                callback(retCode.REVELRY_END);
                return;
            }

            if(specialType.indexOf(type) != -1) {
                var rvTable = csvManager.HDrevelry();
                var rvLine = null;
                for(var index in rvTable) {
                    if (rvTable[index].TYPE == type) {
                        rvLine = rvTable[index];
                        break;
                    }
                }
                if(null == rvLine) {
                    callback(retCode.REVELRY_NOT_EXIST);
                    return;
                }

                if (diffSeconds < (rvLine.DAY - 1) * 24 * 3600) {
                    callback(retCode.REVELRY_NOT_BEGIN);
                    return;
                }
            }

            updateRevelryTypeProgress[type](zid, zuid, value);
            callback(null);
        }
    ]);
};

/**
 * 物品变化事件
 * @param zid [int] 区Id
 * @param zuid [int] 角色Id
 * @param playerAndPkgs [array] Player对象和Package对象组成的数组
 */
exports.onItemChange = function onItemChange(zid, zuid, playerAndPkgs) {
    async.waterfall([
        /* 获取区信息 */
        function(callback) {
            accountDb.getZoneInfo(zid, callback);
        },

        /* 判断狂欢是否结束 */
        function(zoneInfo, callback) {
            var openSeconds = parseInt((new Date(zoneInfo.openDate)).setHours(0).valueOf() / 1000); /* 东8区*/
            var nowSeconds = parseInt(Date.now() / 1000);

            if(nowSeconds - openSeconds > 7 * 24 * 3600) {
                callback(retCode.REVELRY_END);
            }
            else {
                callback(null);
            }
        },

        /* 获取所有的狂欢进度 */
        function(callback) {
            revelryDb.getAllRevelriesTypeProgress(zid, zuid, callback);
        },

        function(progress, callback) {
            var player = playerAndPkgs[0];
            var petOnsite = []; /* 上阵符灵 */
            var equipOnsite = []; /* 上阵装备 */
            var magicOnsite = []; /* 上阵法器 */

            var pets = playerAndPkgs[globalObject.PACKAGE_TYPE_PET].content;
            for(var i = 0; i < pets.length; ++i) {
                if(pets[i].teamPos > 0 && pets[i].teamPos < 4) {
                    petOnsite.push(pets[i]);
                }
            }

            var equips = playerAndPkgs[globalObject.PACKAGE_TYPE_EQUIP].content;
            for(var i = 0; i < equips.length; ++i) {
                if(equips[i].teamPos >= 0) {
                    equipOnsite.push(equips[i]);
                }
            }

            var magics = playerAndPkgs[globalObject.PACKAGE_TYPE_MAGIC].content;
            for(var i = 0; i < magics.length; ++i) {
                if(magics[i].teamPos >= 0) {
                    magicOnsite.push(magics[i]);
                }
            }

            /* 4.全部绿装 */
            if(equipOnsite.length == 16 && magicOnsite.length == 8 && progress[4] != 1) {
                var allGreen = true;

                for(var i = 0; i < equipOnsite.length; ++i) {
                    var line = csvManager.RoleEquipConfig()[equipOnsite[i].tid];
                    if(!line) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    if(isNaN(line.QUALITY) || line.QUALITY < 2) {
                        allGreen = false;
                        break;
                    }
                }

                if(allGreen) {
                    for(var i = 0; i < magicOnsite.length; ++i) {
                        var line = csvManager.RoleEquipConfig()[magicOnsite[i].tid];
                        if(!line) {
                            callback(retCode.TID_NOT_EXIST);
                            return;
                        }
                        if(isNaN(line.QUALITY) || line.QUALITY < 2) {
                            allGreen = false;
                            break;
                        }
                    }
                }

                if(allGreen) {
                    revelryDb.setRevelryProgress(zid, zuid, 4, 1);
                }
            }

            /* 5.装备16件装备且最低强化等级大于等于 */
            if(equipOnsite.length == 16) {
                var strengthenMin = 1000000;
                for(var i = 0; i < equipOnsite.length; ++i) {
                    if(equipOnsite[i].strengthenLevel < strengthenMin) {
                        strengthenMin = equipOnsite[i].strengthenLevel;
                    }
                }

                if(strengthenMin > progress[5]) {
                    revelryDb.setRevelryProgress(zid, zuid, 5, strengthenMin);
                }
            }

            /* 7.装备4只符灵且最低突破单位 */
            if(petOnsite.length == 3) {
                var breakMin = player.character.breakLevel;
                for(var i = 0; i < petOnsite.length; ++i) {
                    if(petOnsite[i].breakLevel < breakMin) {
                        breakMin = petOnsite[i].breakLevel;
                    }
                }

                if(breakMin > progress[7]) {
                    revelryDb.setRevelryProgress(zid, zuid, 7, breakMin);
                }
            }

            /* 8.装备16件装备且最低精炼大于等于 */
            if(equipOnsite.length == 16) {
                var refineMin = 1000000;
                for(var i = 0; i < equipOnsite.length; ++i) {
                    if(equipOnsite[i].refineLevel < refineMin) {
                        refineMin = equipOnsite[i].refineLevel;
                    }
                }

                if(refineMin > progress[8]) {
                    revelryDb.setRevelryProgress(zid, zuid, 8, refineMin);
                }
            }

            /* 10.装备3只符灵并且最小符灵等级大于等于 */
            if(petOnsite.length == 3) {
                var levelMin = player.character.level;
                for(var i = 0; i < petOnsite.length; ++i) {
                    if(petOnsite[i].level < levelMin) {
                        levelMin = petOnsite[i].level;
                    }
                }

                if(levelMin > progress[10]) {
                    revelryDb.setRevelryProgress(zid, zuid, 10, levelMin);
                }
            }

            /* 15.穿满8件法器并且最小精炼等级大于等于 */
            if(magicOnsite.length == 8) {
                var refineMin = 1000000;
                for(var i = 0; i < magicOnsite.length; ++i) {
                    if(magicOnsite[i].refineLevel < refineMin) {
                        refineMin = magicOnsite[i].refineLevel;
                    }
                }

                if(refineMin > progress[15]) {
                    revelryDb.setRevelryProgress(zid, zuid, 15, refineMin);
                }
            }


            /* 31.所有上阵符灵天命等级到达x级 */
            if(petOnsite.length == 3) {
                var fateMin = player.character.fateLevel;
                for(var i = 0; i < petOnsite.length; ++i) {
                    if(petOnsite[i].fateLevel < fateMin) {
                        fateMin = petOnsite[i].fateLevel;
                    }
                }

                if(fateMin > progress[31]) {
                    revelryDb.setRevelryProgress(zid, zuid, 31, fateMin);
                }
            }

            callback(null);
        }
    ]);
};

var updateRevelryTypeProgress = [];

/*  1.登陆天数 */
updateRevelryTypeProgress[1] = function(zid, zuid, value) {
    revelryDb.setRevelryProgress(zid, zuid, 1, value);
};

/* 2.通关轻松难度章节，value为关卡Id */
updateRevelryTypeProgress[2] = function(zid, zuid, value) {
    if(value % 10 == 0) {
        var progress = (value / 10) % 100;
        revelryDb.setRevelryProgress(zid, zuid, 2, progress);
    }
};

/*  3.主角等级*/
updateRevelryTypeProgress[3] = function(zid, zuid, value) {
    revelryDb.setRevelryProgress(zid, zuid, 3, value);
};

/* 6.竞技场排名小于等于 */
updateRevelryTypeProgress[6] = function(zid, zuid, value) {
    revelryDb.setRevelryProgress(zid, zuid, 6, value);
};

/* 9.封灵塔通关星数大于等于 */
updateRevelryTypeProgress[9] = function(zid, zuid, value) {
    revelryDb.IncrRevelryProgress(zid, zuid, 9, value);
};

/* 11.累计充值 */
updateRevelryTypeProgress[11] = function(zid, zuid, value) {
    async.waterfall([
        function(callback) {
            revelryDb.getRevelryProgress(zid, zuid, 11, callback);
        },

        function(prePro, callback) {
            revelryDb.setRevelryProgress(zid, zuid, 11, parseInt(prePro) + value);
            callback(null);
        }
    ]);
};

/* 12.单件装备精炼大于等于 */
updateRevelryTypeProgress[12] = function(zid, zuid, value) {
    async.waterfall([
        function(callback) {
            revelryDb.getRevelryProgress(zid, zuid, 12, callback);
        },

        function(prePro, callback) {
            if(value > prePro) {
                revelryDb.setRevelryProgress(zid, zuid, 12, value);
            }
            callback(null);
        }
    ]);
};

/*  13.三只符灵全部上场并且最小技能等级大于等于 */
updateRevelryTypeProgress[13] = function(zid, zuid, value) {
    async.waterfall([
        function(callback) {
            revelryDb.getRevelryProgress(zid, zuid, 13, callback);
        },

        function(prePro, callback) {
            if(value > prePro) {
                revelryDb.setRevelryProgress(zid, zuid, 13, value);
            }
            callback(null);
        }
    ]);
};

/* 14.主角战斗力大于等于 */
updateRevelryTypeProgress[14] = function(zid, zuid, value) {
    async.waterfall([
        function(callback) {
            revelryDb.getRevelryProgress(zid, zuid, 14, callback);
        },

        function(prePro, callback) {
            if(value > prePro) {
                revelryDb.setRevelryProgress(zid, zuid, 14, value);
            }
            callback(null);
        }
    ]);
};

/* 16.合成法器数量大于等于 */
updateRevelryTypeProgress[16] = function(zid, zuid, value) {
    revelryDb.IncrRevelryProgress(zid, zuid, 16, value);
};

/* 17.一名伙伴技能达到 */
updateRevelryTypeProgress[17] = function(zid, zuid, value) {
    async.waterfall([
        function(callback) {
            revelryDb.getRevelryProgress(zid, zuid, 17, callback);
        },

        function(prePro, callback) {
            if(value > prePro) {
                revelryDb.setRevelryProgress(zid, zuid, 17, value);
            }
            callback(null);
        }
    ]);
};

/* 18.单件法器精炼等级大于等于 */
updateRevelryTypeProgress[18] = function(zid, zuid, value) {
    async.waterfall([
        function(callback) {
            revelryDb.getRevelryProgress(zid, zuid, 18, callback);
        },

        function(prePro, callback) {
            if(value > prePro) {
                revelryDb.setRevelryProgress(zid, zuid, 18, value);
            }
            callback(null);
        }
    ]);
};

/* 19.天魔挑战次数大于等于 */
updateRevelryTypeProgress[19] = function(zid, zuid) {
    async.waterfall([
        function(callback) {
            revelryDb.getRevelryProgress(zid, zuid, 19, callback);
        },

        function(prePro, callback) {
            revelryDb.setRevelryProgress(zid, zuid, 19, parseInt(prePro) + 1);
            callback(null);
        }
    ]);
};

/* 20.通关普通难度章节 */
updateRevelryTypeProgress[20] = function(zid, zuid, value) {
    if(value % 10 == 0) {
        var progress = (value / 10) % 100;
        revelryDb.setRevelryProgress(zid, zuid, 20, progress);
    }
};

/* 21.封灵塔历史最高排名小于等于 */
updateRevelryTypeProgress[21] = function(zid, zuid) {
    climbTowerDb.getStarsRanklistIndex(zid, zuid, function (err, index) {
        if(index > 0) {
            revelryDb.setRevelryProgress(zid, zuid, 21, index);
        }
    });
};

/* 22.合成紫色法器数量大于等于 */
updateRevelryTypeProgress[22] = function(zid, zuid, value) {
    revelryDb.IncrRevelryProgress(zid, zuid, 22, value);
};

/* 23.合成橙色法器数量大于等于 */
updateRevelryTypeProgress[23] = function(zid, zuid, value) {
    revelryDb.IncrRevelryProgress(zid, zuid, 23, value);
};

/*  24.符灵商店购买物品次数大于等于（活动开启后计数) */
updateRevelryTypeProgress[24] = function(zid, zuid, value) {
    revelryDb.IncrRevelryProgress(zid, zuid, 24, value);
};

/*  25.符灵商铺刷新次数大于等于（活动开启后计算）*/
updateRevelryTypeProgress[25] = function(zid, zuid, value) {
    revelryDb.IncrRevelryProgress(zid, zuid, 25, value);
};

/*  26.商城中购买降魔令个数大于等于（活动开启后计算）*/
updateRevelryTypeProgress[26] = function(zid, zuid, value) {
    revelryDb.IncrRevelryProgress(zid, zuid, 26, value);
};

/*  27.天魔每日累计功勋大于等于（活动开启后计算）*/
updateRevelryTypeProgress[27] = function(zid, zuid, value) {
    async.waterfall([
        function (cb) {
            revelryDb.getRevelryProgress(zid, zuid, 27, cb);
        },

        function (revelryProgress, cb) {
            if(revelryProgress > value) {
                cb(null);
                return;
            }
            revelryDb.setRevelryProgress(zid, zuid, 27, value);
        }
    ]);
};

/*  28.天魔最高伤害达到大于等于（活动开启后计算）*/
updateRevelryTypeProgress[28] = function(zid, zuid, value) {
    async.waterfall([
        function (cb) {
            revelryDb.getRevelryProgress(zid, zuid, 28, cb);
        },

        function (revelryProgress, cb) {
            if(revelryProgress > value) {
                cb(null);
                return;
            }
            revelryDb.setRevelryProgress(zid, zuid, 28, value);
        }
    ]);
};

/*  29.封灵塔重置次数大于等于（活动开启后计算）*/
updateRevelryTypeProgress[29] = function(zid, zuid, value) {
    revelryDb.IncrRevelryProgress(zid, zuid, 29, value);
};

/* 32.上阵符灵中天命最高等级到达x级 */
updateRevelryTypeProgress[32] = function(zid, zuid, value) {
    async.waterfall([
        function(callback) {
            revelryDb.getRevelryProgress(zid, zuid, 32, callback);
        },

        function(prePro, callback) {
            if(value > prePro) {
                revelryDb.setRevelryProgress(zid, zuid, 32, value);
            }
            callback(null);
        }
    ]);
};
