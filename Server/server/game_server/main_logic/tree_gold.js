/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：摇钱树功能
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * 包含的头文件
 */
var packets = require('../packets/tree_gold');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var cPackage = require('../common/package');
var logger = require('../../manager/log4_manager');
var protocolObject = require('../../common/protocol_object');
var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var type = require('../common/item_type');
var timeUtil = require('../../tools/system/time_util');
var treeDb = require('../database/activity/shake_tree');
var playerDb = require('../database/player');
var math = require('../../tools/system/math');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var cZuid = require('../common/zuid');
/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 摇钱树
 */
var CS_TreeOfGold = (function() {

    /**
     * 构造函数
     */
    function CS_TreeOfGold() {
        this.reqProtocolName = packets.pCSTreeOfGold;
        this.resProtocolName = packets.pSCTreeOfGold;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_TreeOfGold.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_TreeOfGold();
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


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var nowTime = parseInt(Date.now() / 1000);
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取玩家摇钱状态 TreeState对象 */
                function(callback) {
                    treeDb.getShakeState(req.zid, req.zuid, nowTime, callback);
                },
                function(tree, callback) {
                    var date = new Date().toDateString();
                    var zeroTime = timeUtil.getDetailTime(date, 0);
                    var treeState = tree;
                    if(treeState.refreshTime < zeroTime) {
                        /* 当日摇钱次数未满3次做中断处理，摇钱次数清零 */
                        if(treeState.dayNum < 3) {
                            treeState.allNum = 0;
                            treeState.extraGold = 0;
                        }
                        treeState.dayNum = 0;
                        treeState.shakeTime = 0;
                    }
                    else {
                        if( treeState.shakeTime + 15*60 > nowTime && treeState.dayNum < 3) { /* 是否需要倒计时 */
                            res.leftTime = treeState.shakeTime + 15*60 - nowTime;
                        }
                        res.dayNum = treeState.dayNum;
                    }
                    treeState.refreshTime = nowTime;
                    res.extraGold = treeState.extraGold;
                    res.allNum = treeState.allNum;
                    treeDb.saveShakeState(req.zid, req.zuid, treeState);
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
    return CS_TreeOfGold;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 摇一摇
 */
var CS_ShakeTree = (function() {

    /**
     * 构造函数
     */
    function CS_ShakeTree() {
        this.reqProtocolName = packets.pCSShakeTree;
        this.resProtocolName = packets.pSCShakeTree;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ShakeTree.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ShakeTree();
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


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var treeState = new globalObject.TreeState();
            var shakeData = csvManager.CharacterLevelExp();
            var nowTime = parseInt(Date.now() / 1000);
            var index = 0;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取主角等级 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        index = player.character.level;
                        callback(null);
                    });
                },
                /* 获取摇钱状态 */
                function(callback) {
                    treeDb.getShakeState(req.zid, req.zuid, nowTime, function(err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        treeState = data;
                        callback(null);
                    });
                },
                function(callback) {
                    /* 今日已摇三次 或者在倒计时内不能再摇钱 */
                    if(3 == treeState.dayNum || (treeState.shakeTime + 15*60 > nowTime)) {
                        callback(retCode.CAN_NOT_SHAKE);
                        return;
                    }
                    if(treeState.allNum < 6) {
                        treeState.dayNum += 1;
                        treeState.allNum += 1;
                        treeState.shakeTime = nowTime;
                        treeState.extraGold += math.rand(shakeData[index].EXTRA_COINS_MIN, shakeData[index].EXTRA_COINS_MAX);
                        treeDb.saveShakeState(req.zid, req.zuid, treeState);
                        callback(null);
                        return;
                    }
                    callback(retCode.GOLD_NOT_REWARD);
                },
                /* 银币加入玩家身上 */
                function(callback) {
                    var rewardArr = [];
                    var reward = new protocolObject.ItemObject();
                    reward.tid = type.ITEM_TYPE_GOLD;
                    reward.itemNum = math.rand(shakeData[index].MONEY_TREE_COINS_MIN, shakeData[index].MONEY_TREE_COINS_MAX);
                    rewardArr.push(reward);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], rewardArr,
                        req.channel, req.acc, logsWater.SHAKETREE_LOGS, reward.tid, function (err) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.goldNum = reward.itemNum;
                        res.extraGoldNum = treeState.extraGold;
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
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 5, 0, 1);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_ShakeTree;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 累计摇过六次即可领取
 */
var CS_TreeExtraGold = (function() {

    /**
     * 构造函数
     */
    function CS_TreeExtraGold() {
        this.reqProtocolName = packets.pCSTreeExtraGold;
        this.resProtocolName = packets.pSCTreeExtraGold;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_TreeExtraGold.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_TreeExtraGold();
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


            if(isNaN(req.zid)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }
            var treeState = new globalObject.TreeState();
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获取摇钱状态 */
                function(callback) {
                    var nowTime = parseInt(Date.now() / 1000);
                    treeDb.getShakeState(req.zid, req.zuid, nowTime, function(err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        treeState = data;
                        callback(null);
                    });
                },
                function(callback) {
                   if(6 > treeState.allNum) {  /* 未满六次不能领取 */
                         callback(retCode.CAN_NOT_REWARD_TREE);
                         return;
                   }
                    var rewardArr = [];
                    var reward = new protocolObject.ItemObject();
                    reward.tid = type.ITEM_TYPE_GOLD;
                    reward.itemNum = treeState.extraGold;
                    rewardArr.push(reward);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], rewardArr,
                        req.channel, req.acc, logsWater.TREEEXTRAGOLD_LOGS, reward.tid, function (err) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.extraGold = treeState.extraGold;
                        treeState.extraGold = 0;
                        treeState.allNum = 0;
                        treeDb.saveShakeState(req.zid, req.zuid, treeState);
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
    return CS_TreeExtraGold;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_TreeOfGold());
    exportProtocol.push(new CS_ShakeTree());
    exportProtocol.push(new CS_TreeExtraGold());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

