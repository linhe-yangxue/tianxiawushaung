var async = require('async');
var playerDb = require('../database/player');
var csvManager = require('../../manager/csv_manager').Instance();
var flashSaleDb = require('../database/flash_sale');
var timeUtil = require('../../tools/system/time_util');
var globalObject = require('../../common/global_object');

/*
 * 获取上架的限时抢购商品
 * @param {object} player 玩家对象
 * @param [func] cb 返回错误码[int](retCode)和[array]限时抢购商品信息
 */
var getPutawayItemListAll = function (player, cb) {
    var flashSalePutawayItem = [];
    var flashSaleEventAll = csvManager.FlashSaleEvent();
    for(var index in flashSaleEventAll) {
        index = parseInt(index);
        var flashSaleEvent = flashSaleEventAll[index];
        // 遍历商品上架的所有条件
        if(!checkConditions(player, flashSaleEvent.CONDITION)) {
            continue;
        }
        // 初始化商品
        var flashSaleItem = new (globalObject.FlashSaleItem)();
        flashSaleItem.index = index;
        flashSaleItem.putawayTime = parseInt(Date.now() / 1000);
        flashSaleItem.state = 0;
        flashSalePutawayItem.push(flashSaleItem);
    }
    cb(null, flashSalePutawayItem);
};

/*
 * 检查商品是否满足上架条件
 * @param {object} player 玩家对象
 * @param [string] conditionsStr 商品上架条件
 * return true或者false
 */
var checkConditions = function (player, conditionsStr) {
    var conditions = conditionsStr.split('|');
    for(var i = 0; i < conditions.length; i++) {
        var conditionDetail = conditions[i].split('#');
        var conditionId = parseInt(conditionDetail[0]);
        var conditionArgs = conditionDetail.slice(1);
        if(conditionId === 1 ) {
            if(player.character.level < parseInt(conditionArgs[0]) || player.character.level > parseInt(conditionArgs[1])) {
                return false;
            }
        }
        if(conditionId === 2) {
            if(player.vipLevel < parseInt(conditionArgs[0]) || player.vipLevel > parseInt(conditionArgs[1])) {
                return false;
            }
        }
    }
    return true;
};

/*
 * 获取并刷新和玩家进行过互动的限时抢购商品
 * @param {object} player 玩家对象
 * @param [array] putawayItemListAll 所有上架的限时抢购商品
 * @param [array] putawayItemListPrincipal 和玩家进行过互动的限时抢购商品
 * @param cb [func] 返回错误码[int](retCode)和[array]限时抢购商品信息
 */
var getFlashPurchaseItems = function (player, putawayItemListAll, putawayItemListPrincipal, cb) {
    var dateNow = new Date();
    var putawayItemListShow = [];
    //
    for(var i = 0; i < putawayItemListAll.length; i ++) {
        var putawayItem = putawayItemListAll[i];
        for(var j = 0; j < putawayItemListPrincipal.length; j++) {
            if(putawayItem.index === putawayItemListPrincipal[j].index) {
                putawayItem = putawayItemListPrincipal[j];
            }
        }
        var putawayItemCsv = csvManager.FlashSaleEvent()[putawayItem.index];
        // 每日刷新
        if(putawayItemCsv.DAILY_UPDATE && putawayItem.state === 0 && !timeUtil.ifSameDay(dateNow, new Date(putawayItem.putawayTime * 1000))) {
            putawayItem.putawayTime = timeUtil.zeroTime(dateNow);
        }
        // 是否每日可购买
        if(putawayItemCsv.DAILY_PURCHASE &&  putawayItemCsv.state === 1 && !timeUtil.ifSameDay(dateNow, new Date(putawayItem.putawayTime * 1000))) {
            putawayItem.putawayTime = timeUtil.zeroTime(dateNow);
        }
        // 检查是否已经过期
        if(putawayItem.putawayTime + putawayItemCsv.LAST < parseInt(dateNow.getTime() / 1000)){
            continue;
        }
        // 是否满足条件
        if(!checkConditions(player, putawayItemCsv.CONDITION)) {
            continue;
        }
        putawayItemListShow.push(putawayItem);
    }
    cb(null, putawayItemListShow);
};

/*
 * 获取玩家可以购买的上架的限时抢购商品
 * @param [int] zid 区ID
 * @param [int] zuid 用户ZUID
 * @param [int] type 限时抢购类型
 * @param cb [func] 返回错误码[int](retCode)和[array]玩家可以购买的上架的限时抢购商品
 */
var updateFlashSale = function (zid, zuid, type, cb) {
    var player;
    async.waterfall([
        function(callback) {
            playerDb.getPlayerData(zid, zuid, false, callback);
        },

        function (playerCb, callback) {
            player = playerCb;
            getPutawayItemListAll(player, callback);
        },

        function (putawayItemListAll, callback) {
            flashSaleDb.getFlashSaleItems(zid, zuid, function (err, putawayItemListPrincipal) {
                callback(err, putawayItemListAll, putawayItemListPrincipal)
            });
        },

        function (putawayItemListAll, putawayItemListPrincipal, callback) {
            getFlashPurchaseItems(player, putawayItemListAll, putawayItemListPrincipal, callback);
        },

        function (putawayItemListShow, callback) {
            var flashSaleEventAll = csvManager.FlashSaleEvent();
            flashSaleDb.setFlashSaleItems(zid, zuid, putawayItemListShow, function (err) {
                if(!!err) {
                    callback(err);
                    return;
                }
                async.filter(putawayItemListShow, function (element, cb) {
                    if(type !== 0 && type !== flashSaleEventAll[element.index].TYPE) { // 不是一个类型
                        cb(false);
                        return;
                    }
                    cb(true);
                }, function (results) {
                    callback(null, results);
                });
            });
        }
    ], cb);
};
exports.updateFlashSale = updateFlashSale;
