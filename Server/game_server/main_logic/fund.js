/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：开服基金购买 开服基金领取 全民福利领取 开服基金请求
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/fund');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var accountDb = require('../database/account');
var playerDb = require('../database/player');
var fundDb =  require('../database/activity/fund');
var cPackage = require('../common/package');
var csvManager = require('../../manager/csv_manager').Instance();
var logger = require('../../manager/log4_manager');
var protocolObject =  require('../../common/protocol_object');
var type =  require('../common/item_type');
var biCode = require('../../common/bi_code');
var logsWater = require('../../common/logs_water');
var filter = require('../common/filter_common');
var cZuid = require('../common/zuid');
var timeUtil = require('../../tools/system/time_util');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开服基金购买
 */
var CS_FundPurchase = (function() {

    /**
     * 构造函数
     */
    function CS_FundPurchase() {
        this.reqProtocolName = packets.pCSFundPurchase;
        this.resProtocolName = packets.pSCFundPurchase;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FundPurchase.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FundPurchase();
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

            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 验证vip等级是否满足 */
                function(callback) {
                    playerDb.getPlayerData(req.zid, req.zuid, false, callback);
                },
                /* 购买条件判断 */
                function(player, callback) {
                    if(!player) {
                        callback(retCode.PLAYER_NOT_EXIST);
                        return;
                    }
                    if(player.vipLevel < 2) { /* vip等级2以上写死 */
                        callback(retCode.LACK_OF_VIP_LEVEL);
                        return;
                    }
                    fundDb.buyFund(req.zid, req.zuid, function(err, bought) { /* 拦截重复购买 */
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(0 == bought) {
                            callback(retCode.CAN_NOT_BUY_AGAIN);
                            return;
                        }
                        callback(null);
                    });
                },
                /* 扣元宝 */
                function(callback) {
                    var costArr = [];
                    var cost = new protocolObject.ItemObject();
                    cost.itemNum = 1000;
                    cost.tid = type.ITEM_TYPE_DIAMOND;
                    costArr.push(cost);
                    cPackage.updateItemWithLog(req.zid, req.zuid, costArr,
                        [], req.channel, req.acc, logsWater.FUNDPURCHASE_LOGS, cost.tid, function(err) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        fundDb.incrBuyNum(req.zid); /* 购买人数加一 */
                            res.isBuySuccess = 1;
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
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 1, 0, res.isBuySuccess);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_FundPurchase;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开服基金领取
 */
var CS_FundReward = (function() {

    /**
     * 构造函数
     */
    function CS_FundReward() {
        this.reqProtocolName = packets.pCSFundReward;
        this.resProtocolName = packets.pSCFundReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FundReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FundReward();
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
                || null == req.index) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);

            req.index = parseInt(req.index);

            if(isNaN(req.zid) || isNaN(req.index)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var csvFundTb; /* 开服基金配表数据 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                function(callback) {
                    fundDb.isBought(req.zid, req.zuid, callback);
                },
                /* 判断是否满足领取要求 */
                function(flag, callback) {
                    csvFundTb = csvManager.FundEvent()[req.index];
                     if(null == flag) { /* 未购买 无权限领取 */
                         callback(retCode.CAN_NOT_REWARD_FUND);
                         return;
                     }

                    if(!csvFundTb) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(csvFundTb.LEVEL && player.character.level < csvFundTb.LEVEL) {
                            callback(retCode.LACK_OF_LEVEL);
                            return;
                        }
                        callback(null);
                    });
                },
                /* 判断是否已经领取，不可再次领取 */
                function(callback) {
                    fundDb.isFundReward(req.zid, req.zuid, req.index, function(err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(data) {
                            callback(retCode.CAN_NOT_REWARD_FUND);
                            return;
                        }
                        callback(null);
                    });
                },
                /* 物品发放玩家背包 */
                function(callback) {
                    var rewardArr = [];
                    var reward = new protocolObject.ItemObject();
                    reward.tid = csvFundTb.ITEM_ID;
                    reward.itemNum = csvFundTb.NUM;
                    rewardArr.push(reward);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], rewardArr, req.channel, req.acc, logsWater.FUNDREWARD_LOGS, reward.tid, function(err) {
                        callback(err);
                    });
                },
                function(callback) {
                    /* 设置为已领取 */
                    fundDb.setFundReward(req.zid, req.zuid, req.index);
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 2, req.index, 1);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_FundReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 全民福利领取
 */
var CS_WelfareReward = (function() {

    /**
     * 构造函数
     */
    function CS_WelfareReward() {
        this.reqProtocolName = packets.pCSWelfareReward;
        this.resProtocolName = packets.pSCWelfareReward;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_WelfareReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_WelfareReward();
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
                || null == req.index) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.index = parseInt(req.index);

            if(isNaN(req.zid) || isNaN(req.index)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var csvFundTb; /* 开服基金配表数据 */
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 判断是否满足领取条件 */
                function(callback) {
                    csvFundTb = csvManager.FundEvent()[req.index];
                    if(!csvFundTb) {
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    fundDb.getBuyNum(req.zid, callback);
                },
                function(number, callback) {
                    if(csvFundTb.COUNT && number < csvFundTb.COUNT) { /* 全民购买数量不足 */
                        callback(retCode.LACK_OF_BUY_NUM);
                        return;
                    }
                    /* 判断是否已经领取，不可再次领取 */
                    fundDb.isFundReward(req.zid, req.zuid, req.index, function(err, data) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        if(data) {
                            callback(retCode.CAN_NOT_REWARD_FUND);
                            return;
                        }
                        callback(null);
                    });
                },
                /* 物品发放玩家背包 */
                function(callback) {
                    var rewardStr =csvFundTb.REWARD;
                    var rewardArr = filter.splitItemStr(rewardStr, '|', '#');
                    var tmpArr = filter.getItemsInPackageOrNot(rewardArr, false);
                    cPackage.updateItemWithLog(req.zid, req.zuid, [], rewardArr,
                        req.channel, req.acc, logsWater.WELFAREREWARD_LOGS, req.index, function(err, subArr, addArr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.items = addArr.concat(tmpArr);
                        callback(null);
                    });
                },
                function(callback) {
                    /* 设置为已领取 */
                    fundDb.setFundReward(req.zid, req.zuid, req.index);
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    /* 写BI */
                    var preZid = cZuid.zuidSplit(req.zuid)[0];
                    logger.logBI(preZid, biCode.logs_fund, preZid, req.channel, req.zuid, req.zuid, 3, req.index, 1);
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_WelfareReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 开服基金请求
 */
var CS_FundQuery = (function() {

    /**
     * 构造函数
     */
    function CS_FundQuery() {
        this.reqProtocolName = packets.pCSFundQuery;
        this.resProtocolName = packets.pSCFundQuery;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_FundQuery.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_FundQuery();
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

            var zoneInfo;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },

                /* 获取区状态 */
                function(callback) {
                    accountDb.getZoneInfo(req.zid, function (err, result) {
                        zoneInfo = result;
                        callback(err);
                    });
                },

                /* 判断是否已购买 */
                function(callback) {
                    fundDb.isBought(req.zid, req.zuid, callback);
                },
                function(flag, callback) {
                    res.isBuy = flag;
                    fundDb.getBuyNum(req.zid, callback); /* 获取全民福利购买人数 */
                },

                /* 返回已领取的配表索引 */
                function(number, callback) {
                    res.buyNum = number;

                    var openTime = parseInt(timeUtil.getDetailTime(zoneInfo.openDate, 0));
                    var nowTime = parseInt(new Date().getTime() / 1000);
                    var openSeconds = nowTime - openTime;
                    var ferTable = csvManager.FundEventRule();
                    for(var i in ferTable) {
                        if(openSeconds > ferTable[i].TIME  && res.buyNum < ferTable[i].BUY_TIMES) {
                            res.buyNum = ferTable[i].BUY_TIMES;
                        }
                    }
                    
                    if(res.buyNum > number) {
                        fundDb.setBuyNum(req.zid, res.buyNum);
                    }

                    fundDb.getAllFundRewardInfo(req.zid, req.zuid, function(err, arr) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.fundArr = arr;
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
    return CS_FundQuery;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_FundPurchase());
    exportProtocol.push(new CS_FundReward());
    exportProtocol.push(new CS_WelfareReward());
    exportProtocol.push(new CS_FundQuery());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;

