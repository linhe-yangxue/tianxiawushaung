/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：出售与合成
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/compose');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var packageDb = require('../database/package');
var playerDb = require('../database/player');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var csvManager = require('../../manager/csv_manager').Instance();
var protocolObject = require('../../common/protocol_object');
var globalObject = require('../../common/global_object');
var type =  require('../common/item_type');
var logsWater = require('../../common/logs_water');
var wallPaper = require('../database/wallPaper');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 碎片合成
 */
var CS_FragmentCompose = (function() {

    /**
     * 构造函数
     */
    function CS_FragmentCompose() {
        this.reqProtocolName = packets.pCSFragmentCompose;
        this.resProtocolName = packets.pSCFragmentCompose;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FragmentCompose.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FragmentCompose();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.fragment) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            if(null == req.fragment.itemId
                || null == req.fragment.tid
                || null == req.fragment.itemNum) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.fragment.itemId = parseInt(req.fragment.itemId);
            req.fragment.tid = parseInt(req.fragment.tid);
            req.fragment.itemNum = parseInt(req.fragment.itemNum);

            if(isNaN(req.fragment.itemId) || isNaN(req.fragment.tid) || isNaN(req.fragment.itemNum)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var fragmentData = csvManager.Fragment();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    /* 计算扣的东西和加的物品 */
                    var costArr = [];
                    var addArr = [];
                    if(null == fragmentData[req.fragment.tid]) {
                        callback(retCode.TID_NOT_EXIST);
                        return;
                    }
                    req.fragment.itemNum = fragmentData[req.fragment.tid].COST_NUM;
                    var addItem = new protocolObject.ItemObject();
                    addItem.itemNum = 1;
                    addItem.tid = fragmentData[req.fragment.tid].ITEM_ID;
                    costArr.push(req.fragment);
                    addArr.push(addItem);
                    cPackage.updateItemWithLog(req.zid, req.zuid, costArr, addArr, req.channel,
                        req.acc, logsWater.FRAGMENTCOMPOSE_LOGS, addItem.tid, function(err, arrSub, arrAdd) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.item = arrAdd[0];
                        callback(null);
                    });
                },
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },
                function(playerData, callback) {
                    var player = playerData;
                    var wallPaperType = -1;
                    /* 宠物合成 */
                    if(type.getMainType(fragmentData[req.fragment.tid].ITEM_ID) == type.MAIN_TYPE_PET) {
                        wallPaperType = 3;
                    }
                    /* 更新玩家走马灯信息 */
                    if( -1 != wallPaperType) {
                        wallPaper.updateRollingWallPaper(req.zid, req.zuid, player, -1, wallPaperType, [res.item]);
                    }
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_FragmentCompose;
})();

/**
 * 物品出售
 */
var CS_Sale = (function() {

    /**
     * 构造函数
     */
    function CS_Sale() {
        this.reqProtocolName = packets.pCSSale;
        this.resProtocolName = packets.pSCSale;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_Sale.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_Sale();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.itemArr) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            for(var i = 0; i < req.itemArr.length; ++i) {
                if(null == req.itemArr[i]
                    || null == req.itemArr[i].itemId
                    || null == req.itemArr[i].tid
                    || null == req.itemArr[i].itemNum) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }

                req.itemArr[i].itemId = parseInt(req.itemArr[i].itemId);
                req.itemArr[i].tid = parseInt(req.itemArr[i].tid);
                req.itemArr[i].itemNum = parseInt(req.itemArr[i].itemNum);

                if(isNaN(req.itemArr[i].itemId) || isNaN(req.itemArr[i].tid) || isNaN(req.itemArr[i].itemNum)) {
                    http.sendResponseWithResultCode(response, res, retCode.ERR);
                    return;
                }
            }
            var number = 0; /*出售的获得的物品数 */
            var item = new protocolObject.ItemObject; /* 出售获得的物品对象 */
            var itemArr = req.itemArr;
            var itemType = -1;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 验证同一出售数组中是否为同一物品 */
                function(callback) {
                    var len = itemArr.length;
                    if(0 == len) {
                        callback(retCode.SALE_FAILED);
                        return;
                    }
                    itemType = type.getMainType( req.itemArr[0].tid);
                    for(var i = 1; i < len; ++i) {
                        if(itemType != type.getMainType( req.itemArr[i].tid)) {
                            callback(retCode.SALE_ITEM_TID_CONFUSED);
                            return;
                        }
                    }
                    callback(null);
                },
                /* 获取出售不同道具所得到的金币数或者符魂数 */
                function(callback) {
                    var roleEquip = csvManager.RoleEquipConfig();
                    /* 符灵出售 */
                    if(type.MAIN_TYPE_PET == itemType) {
                        var breakLevelData = csvManager.BreakLevelConfig();
                        var activeObject = csvManager.ActiveObject();
                        var petLevelExp = csvManager.PetLevelExp();
                        var skillCost = csvManager.SkillCost();
                        packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_PET, false, function(err, petPackage) {
                            if(err) {
                                callback(err);
                                return;
                            }
                            var petArr = petPackage.content;
                            for(var i = 0, len = itemArr.length; i < len; ++i) {
                                var active = activeObject[itemArr[i].tid];
                                if(null == active) { /* 验证tid是否正确 */
                                    callback(retCode.WRONG_TID);
                                    return;
                                }
                                var pet = null;
                                for(var j = 0, length = petArr.length; j <length; ++j) {
                                    if(itemArr[i].itemId == petArr[j].itemId && itemArr[i].tid == petArr[j].tid) {
                                        pet =petArr[j];
                                        break;
                                    }
                                }
                                if(null == pet) {
                                    continue;
                                }

                                /*出售的基础金币数 */
                                var sale = active.SELL_PRICE;
                                sale = sale.split('#');
                                number += parseInt(sale[1]);
                                item.tid = parseInt(sale[0]);
                                /* 突破等级和当前经验值转换为金币 */
                                number = number + parseInt(breakLevelData[pet.breakLevel].TOTAL_NEED_COIN_NUM) + pet.exp;
                                /* 技能等级转换为金币 */
                                var skillArr = pet.skillLevel;
                                for(var k = 0, length =  skillArr.length; k < length; ++k) {
                                    number += skillCost[skillArr[k]].TOTAL_MONEY_COST;
                                }
                                /* 等级和星级品质转换为金币 */
                                var petStarLevel = parseInt(active.STAR_LEVEL);
                                switch (petStarLevel) {
                                    case 1:
                                        number += parseInt(petLevelExp[pet.level].TOTAL_EXP_1);
                                        break;
                                    case 2:
                                        number += parseInt(petLevelExp[pet.level].TOTAL_EXP_2);
                                        break;
                                    case 3:
                                        number += parseInt(petLevelExp[pet.level].TOTAL_EXP_3);
                                        break;
                                    case 4:
                                        number += parseInt(petLevelExp[pet.level].TOTAL_EXP_4);
                                        break;
                                    case 5:
                                        number += parseInt(petLevelExp[pet.level].TOTAL_EXP_5);
                                        break;
                                    case 6:
                                        number += parseInt(petLevelExp[pet.level].TOTAL_EXP_6);
                                        break;
                                    case 7:
                                        number += parseInt(petLevelExp[pet.level].TOTAL_EXP_7);
                                        break;
                                }
                            }
                            callback(null);
                        });
                        return;
                    }
                    /* 装备出售 */
                    if(type.MAIN_TYPE_EQUIP == itemType) {
                        packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_EQUIP, false, function(err, equipPackage) {
                            if(err) {
                                callback(err);
                                return;
                            }
                            var equipArr = equipPackage.content;
                            for(var i = 0, len = itemArr.length; i <len; ++i) {
                                var equipData = roleEquip[itemArr[i].tid];
                                if(null == equipData) { /* 验证tid是否正确 */
                                    callback(retCode.WRONG_TID);
                                    return;
                                }
                                var equip = null;
                                for(var j= 0, length = equipArr.length; j < length; ++j) {
                                    if(itemArr[i].itemId == equipArr[j].itemId && itemArr[i].tid == equipArr[j].tid) {
                                        equip = equipArr[j];
                                        break;
                                    }
                                }
                                if(null == equip) {
                                    continue;
                                }
                                /*出售的基础金币数 */
                                var sale =  equipData.SELL_PRICE;
                                sale = sale.split('#');
                                number += parseInt(sale[1]);
                                item.tid = parseInt(sale[0]);
                                /* 装备强化累计消耗的银币 */
                                number += equip.strengCostGold;
                            }
                            callback(null);
                        });
                        return;
                    }
                    /* 法器出售 */
                    if(type.MAIN_TYPE_MAGIC == itemType) {
                        var magicEquipLv = csvManager.MagicEquipLvConfig();
                        var magicRefine = csvManager.MagicEquipRefineConfig();
                        packageDb.getPackage(req.zid, req.zuid, globalObject.PACKAGE_TYPE_MAGIC, false, function(err, magicPackage) {
                            if(err) {
                                callback(err);
                                return;
                            }
                            var magicArr = magicPackage.content;
                            for(var i = 0, len = itemArr.length; i < len; ++i) {
                                var magicData = roleEquip[itemArr[i].tid];
                                if(null == magicData ) { /* 验证tid是否正确 */
                                    callback(retCode.WRONG_TID);
                                    return;
                                }
                                var magicEquip = null;
                                for(var j = 0, length = magicArr.length; j < length; ++j ) {
                                    if(itemArr[i].itemId == magicArr[j].itemId && itemArr[i].tid == magicArr[j].tid) {
                                        magicEquip = magicArr[j];
                                        break;
                                    }
                                }
                                if(null == magicEquip) {
                                    continue;
                                }
                                /*出售的基础金币数 */
                                var sale =  magicData.SELL_PRICE;
                                sale = sale.split('#');
                                number += parseInt(sale[1]);
                                item.tid = parseInt(sale[0]);
                                /* 法器的强化经验值转换为金币 */
                                number += magicEquip.strengthenExp;
                                /* 法器的精炼等级转换为金币 */
                                number += magicRefine[magicEquip.refineLevel].TOTAL_REFINE_EQUIP_MONEY;
                                /* 法器的强化等级和品质转换为金币 */
                                var quality = roleEquip[itemArr[i].tid].QUALITY;
                                switch (quality) {
                                    case 1:
                                        number += parseInt(magicEquipLv[magicEquip.strengthenLevel].TOTAL_EXP_1);
                                        break;
                                    case 2:
                                        number += parseInt(magicEquipLv[magicEquip.strengthenLevel].TOTAL_EXP_2);
                                        break;
                                    case 3:
                                        number += parseInt(magicEquipLv[magicEquip.strengthenLevel].TOTAL_EXP_3);
                                        break;
                                    case 4:
                                        number += parseInt(magicEquipLv[magicEquip.strengthenLevel].TOTAL_EXP_4);
                                        break;
                                    case 5:
                                        number += parseInt(magicEquipLv[magicEquip.strengthenLevel].TOTAL_EXP_5);
                                        break;
                                    case 6:
                                        number += parseInt(magicEquipLv[magicEquip.strengthenLevel].TOTAL_EXP_6);
                                        break;
                                    case 7:
                                        number += parseInt(magicEquipLv[magicEquip.strengthenLevel].TOTAL_EXP_7);
                                        break;
                                }
                            }
                            callback(null);
                        });
                        return;
                    }
                    /* 碎片出售 */
                    if(type.MAIN_TYPE_EQUIP_FRAGMENT == itemType ||
                        type.MAIN_TYPE_MAGIC_FRAGMENT == itemType || type.MAIN_TYPE_PET_FRAGMENT == itemType) {
                       var fragment = csvManager.Fragment();
                        for(var i = 0, len = itemArr.length; i < len; ++i) {
                            var fragData =  fragment[itemArr[i].tid];
                            if(null == fragData) { /* 验证tid是否正确 */
                                callback(retCode.WRONG_TID);
                                return;
                            }
                            var sale = fragData.SELL_PRICE;
                            sale = sale.split('#');
                            var tmpNumber = parseInt(sale[1]); /* 出售单个碎片获得的符魂数 */
                            tmpNumber =  itemArr[i].itemNum * tmpNumber;
                            item.tid = parseInt(sale[0]);
                            number += tmpNumber;
                        }
                        callback(null);
                    }
                    /* 出售的物品tid错误 */
                    else {
                        callback(retCode.WRONG_TID);
                    }
                },

                function(callback) {
                    var costArr = req.itemArr;/* 扣除欲出售的物品 */
                    var addArr = []; /* 出售所获得的物品 */

                    item.itemNum = number;
                    addArr.push(item);
                    cPackage.updateItemWithLog(req.zid, req.zuid,
                        costArr, addArr, req.channel, req.acc, logsWater.SALE_LOGS, item.tid, function(err, subArray, addArray) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.reward = addArr[0];
                        callback(null);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_Sale;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_FragmentCompose());
    exportProtocol.push(new CS_Sale());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

