/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：射手乐园相关功能：射手乐园请求，射击
 * 开发者：余金堂
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/shooter_park');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var globalObject = require('../../common/global_object');
var timeUtil = require('../../tools/system/time_util');
var shootDB = require('../database/activity/shooter_park');
var csvManager = require('../../manager/csv_manager').Instance();
var itemType = require('../common/item_type');
var rand = require('../../tools/system/math').rand;
var logsWater = require('../../common/logs_water');
var biCode = require('../../common/bi_code');
var cZuid = require('../common/zuid');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 进入射手乐园 
 */
var CS_ShooterQuery = (function() {

    /**
     * 构造函数
     */
    function CS_ShooterQuery() {
        this.reqProtocolName = packets.pCSShooterQuery;
        this.resProtocolName = packets.pSCShooterQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ShooterQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ShooterQuery();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
            || null == req.tk
            || null == req.zid
            || null == req.zuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(false || isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    shootDB.getShoot(req.zid, req.zuid, function (err, shoot) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        res.addDiamond = shoot.addDiamond;
                        res.usingTimes = shoot.usingTimes;
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
    return CS_ShooterQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 射击
 */
var CS_ShooterPark = (function() {

    /**
     * 构造函数
     */
    function CS_ShooterPark() {
        this.reqProtocolName = packets.pCSShooterPark;
        this.resProtocolName = packets.pSCShooterPark;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ShooterPark.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ShooterPark();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.channel
                || null == req.acc
                || null == req.zid
                || null == req.zuid) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);


            if(false || isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var shootTimes = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取开服时间 */
                function(callback){
                    accountDb.getZoneInfo(req.zid, callback);
                },
                function(zoneInfo, callback){
                    var nowTime = parseInt(new Date().getTime() / 1000);
                    var endTime = parseInt(timeUtil.getDetailTime(zoneInfo.openDate, 0)) + 3 * 24 * 3600;
                    if( nowTime > endTime){
                        callback(retCode.NOT_EVENT_TIME);
                        return;
                    }
                    shootDB.getShoot(req.zid, req.zuid, callback);
                },


                function(shoot, callback) {
                    var diamondData = csvManager.HDshooter();
                    if (shoot.usingTimes > Object.keys(diamondData).length) {
                        callback(retCode.CAN_NOT_SHOOT);
                        return;
                    }
                    /* 花费的射击次数和元宝*/
                    shoot.usingTimes += 1;
                    shootTimes = shoot.usingTimes;
                    var index = shoot.usingTimes;
                    var itemCost = new globalObject.ItemBase();
                    itemCost.tid = itemType.ITEM_TYPE_DIAMOND;
                    var costNum = diamondData[shoot.usingTimes].COST;
                    if(null == costNum) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    itemCost.itemNum = parseInt(costNum);
                    var costArr = [];
                    costArr.push(itemCost);

                    var itemOne = diamondData[index].NUMBER.split('|');
                    /* 首次切割，分成 元宝#概率 的数组 */
                    var itemTwo = [];
                    /* 二次切割，分成大小为2的数组 [0]为获得元宝，[1]为概率 */
                    var itemEarn = [];
                    var itemRate = [];
                    var sumRate = 0;
                    /* 权重和 */
                    for (var i = 0; i < itemOne.length; i++) {
                        itemTwo = itemOne[i].split('#');
                        itemEarn[i] = itemTwo[0];
                        itemRate[i] = itemTwo[1];
                        sumRate += parseInt(itemRate[i]);
                    }
                    var randomRate = rand(1, sumRate);
                    var j = 0;
                    for (j = 0; j < itemRate.length; j++) {
                        if (randomRate <= parseInt(itemRate[j])) { /* 概率落在此范围 */
                            break;
                        }
                        randomRate -= parseInt(itemRate[j]);
                    }
                    var earnDiamond = parseInt(itemEarn[j]);
                    /* 得到的元宝 */
                    var addArr = [];
                    var add = new globalObject.ItemBase();
                    add.itemId = -1;
                    add.itemNum = earnDiamond;
                    add.tid = itemType.ITEM_TYPE_DIAMOND;
                    addArr.push(add);
                    res.earnRatio = earnDiamond;
                    shoot.addDiamond = parseInt(shoot.addDiamond) + parseInt(earnDiamond);

                    cPackage.updateItemWithLog(req.zid, req.zuid, costArr, addArr, req.channel, req.acc, logsWater.SHOOTERQUERY_LOGS, add.tid, function (err, costArr , addArr) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        shootDB.saveShoot(req.zid, req.zuid, shoot);
                        callback(null);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 9, shootTimes, 1);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ShooterPark;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function importProtocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_ShooterQuery());
    exportProtocol.push(new CS_ShooterPark());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = importProtocol;
