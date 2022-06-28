
/**
 * 包含的头文件
 */
var packets = require('../packets/gm');
var http = require('../../tools/net/http_server/gm_http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var logger = require('../../manager/log4_manager');
var gmCommon = require('../common/gm_common');
var gmCode = require('../../common/gm_code');
var gmCmd = require('../../common/gm_cmd');
var csvManager = require('../../manager/csv_manager').Instance();
var redisKey = require('../../common/redis_key');
var dbManager = require("../../manager/redis_manager").Instance();
var playerDb = require('../database/player');
var cRevelry = require('../common/revelry');
var filter = require('../common/filter_common');
var cPackage = require('../common/package');
var md5 = require('MD5');
var accountDb = require('../database/account');
var chargeDb = require('../database/charge');
var logsWater = require('../../common/logs_water');
var sendMail = require('../common/send_mail');
var biCode = require('../../common/bi_code');
var type = require('../common/item_type');
var cZuid = require('../common/zuid');
var cMission = require('../common/mission');
var cSingleRecharge = require('../common/single_recharge');
var globalObject = require('../../common/global_object');
var timeUtil = require('../../tools/system/time_util');
var chargeCommon = require('../common/charge_common');
var sdkAccountDb = require('../database/sdk_account');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 补单
 */
var CS_MakeUpOrder = (function() {

    /**
     * 构造函数
     */
    function CS_MakeUpOrder() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_MakeUpOrder.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.cporder) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }


        if(false) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var cporder = request.req.cporder; /* 内部订单号 */
        var zid;
        var zuid;
        var shelfId; /* 游戏内的商品ID */
        var orderDetail;
        var chargeConfig = csvManager.ChargeConfig();
        async.waterfall([
            function(callback) {
                /* 订单号不为空 */
                if(0 == cporder.length) {
                    res.msg = 'parameter err!!!';
                    callback(gmCode.GMERR_MAKEUP_CHARGE_PARAMETER_ERR);
                    return;
                }
                /* 订单不为空 */
                chargeDb.getOrderDetailByOrderNum(cporder, function(err, result) {
                    if(!!err) {
                        callback(err);
                        return;
                    }
                    orderDetail = result;
                    if(null == orderDetail || null == orderDetail.zid || null == orderDetail.zuid) {
                        res.msg = 'cporder err!';
                        callback(gmCode.GMERR_CHARGE_WRONG_CPORDER);
                        return;
                    }
                    zid = orderDetail.zid;
                    zuid = orderDetail.zuid;
                    shelfId = orderDetail.shelfId;
                    callback(null);
                });
            },
            /* 保存订单状态为SDK Server验证通过 */
            function (callback) {
                orderDetail.status = chargeCommon.ORDER_STATE_SDK_CHECKED;
                chargeDb.saveOrderDetailByOrderNum(cporder, orderDetail, callback);
            },
            /* 订单商品ID校验 */
            function(exist, callback) {
                if(!chargeConfig[shelfId]) {
                    res.msg = 'good id err!!';
                    callback(gmCode.GMERR_CHARGE_GOODID_ERR);
                    return;
                }
                cSingleRecharge.addSingleRecharge(zid, zuid, shelfId);
                callback(null);
            },

            function (callback) {
                chargeCommon.chargeHandle(cporder, orderDetail, function (err) {
                    if(!!err) {
                        callback(err);
                        return;
                    }
                    callback(null);
                });
            },

            function (callback) {
                orderDetail.status = chargeCommon.ORDER_STATE_MAKEUP_ORDER;
                chargeDb.saveOrderDetailByOrderNum(cporder, orderDetail, callback);
            },

            function(exist, callback) {
                sdkAccountDb.getChannelInfoByUid(zuid, callback);
            },

            /* 签名验证 */
            function (channelInfo, callback) {
                var chargeConfig = csvManager.ChargeConfig();
                var rewards = chargeCommon.getChargeReward(orderDetail.shelfId);
                res.res.id = channelInfo.id;
                res.res.order = orderDetail.order;
                res.res.cporder = cporder;
                res.res.amount = chargeConfig[orderDetail.shelfId].PRICE;
                res.res.createtime = orderDetail.createtime;
                res.res.Itemid = rewards.length > 0 ? rewards[0].tid : '';
                res.res.itemquantity = rewards.length > 0 ? rewards[0].itemNum : '';
                res.res.status = orderDetail.status;
                res.res.info = '';
                callback(null);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {           
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_MakeUpOrder;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 直发补偿
 */
var CS_CreateNewOrder = (function() {

    /**
     * 构造函数
     */
    function CS_CreateNewOrder() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_CreateNewOrder.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.zid
            || null == request.req.name
            || null == request.req.shelfId) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.shelfId = parseInt(request.req.shelfId);

        if(false || isNaN(request.req.zid) || isNaN(request.req.shelfId)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var zid = request.req.zid;
        var shelfId = request.req.shelfId;
        var orderDetail;
        var zuid;
        var cporder;
        async.waterfall([
            /* 获取zuid */
            function(callback) {
                gmCommon.getUidByAccOrName(request.req, function(err, playerid){
                    if(err){
                        res.msg = gmCode.GMERR_GETUIDFAIL;
                        callback(err);
                        return;
                    }
                    zuid = playerid;
                    callback(null);
                })
            },

            /* 获取订单号 */
            function(callback) {
                var chargeConfig = csvManager.ChargeConfig();
                if(null == chargeConfig[shelfId]) { /* 防止发送恶意数据 */
                    res.msg = 'good id err!!';
                    callback(gmCode.GMERR_CHARGE_GOODID_ERR);
                    return;
                }
                /* 生成订单号 */
                cporder = md5(md5(Math.random()) + Date.now() + shelfId + zid + zuid);
                cporder = cporder.substr(0,5) + cporder.substr(10,5);
                callback(null, cporder);
            },

            /* 记录新的订单号 */
            function(cporder, callback) {
                orderDetail = new globalObject.OrderDetail();
                orderDetail.zid = zid;
                orderDetail.zuid = zuid;
                orderDetail.status = chargeCommon.ORDER_STATE_GENERATED;
                orderDetail.shelfId = shelfId;
                orderDetail.createtime = timeUtil.getDateFormat(new Date());
                orderDetail.order = '';
                chargeDb.saveOrderDetailByOrderNum(cporder, orderDetail, callback);
            },

            /*  */
            function(exist, callback) {
                cSingleRecharge.addSingleRecharge(zid, zuid, shelfId);
                callback(null);
            },

            function (callback) {
                chargeCommon.chargeHandle(cporder, orderDetail, function (err) {
                    if(!!err) {
                        callback(err);
                        return;
                    }
                    callback(null);
                });
            },

            function (callback) {
                orderDetail.status = chargeCommon.ORDER_STATE_CREATE_NEW_ORDER;
                chargeDb.saveOrderDetailByOrderNum(cporder, orderDetail, callback);
            },

            function(exist, callback) {
                sdkAccountDb.getChannelInfoByUid(zuid, callback);
            },

            /* 签名验证 */
            function (channelInfo, callback) {
                var chargeConfig = csvManager.ChargeConfig();
                var rewards = chargeCommon.getChargeReward(orderDetail.shelfId);
                res.res.id = channelInfo.id;
                res.res.order = orderDetail.order;
                res.res.cporder = cporder;
                res.res.amount = chargeConfig[orderDetail.shelfId].PRICE;
                res.res.createtime = orderDetail.createtime;
                res.res.Itemid = rewards.length > 0 ? rewards[0].tid : '';
                res.res.itemquantity = rewards.length > 0 ? rewards[0].itemNum : '';
                res.res.status = orderDetail.status;
                res.res.info = '';
                callback(null);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_CreateNewOrder;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 重新发货
 */
var CS_ResendReward = (function() {

    /**
     * 构造函数
     */
    function CS_ResendReward() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ResendReward.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GM();
        res.pt = this.resProtocolName;
        res.type = request.type;

        /* 校验外层通用参数,注意：req是null的,要验证!=null */
        if(null == request
            || null == request.cmd
            || null == request.operatorid
            || null == request.sign
            || 'json' != request.type
            || null == request.req) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.operatorid = parseInt(request.operatorid);

        if(isNaN(request.operatorid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* 校验内层req参数 */
        if(null == request.req
            || null == request.req.cporder) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }


        if(false) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }

        var cporder = request.req.cporder; /* 内部订单号 */
        var zid;
        var zuid;
        var shelfId; /* 游戏内的商品ID */
        var orderDetail;
        var chargeConfig = csvManager.ChargeConfig();
        async.waterfall([
            function(callback) {
                /* 订单号不为空 */
                if(0 == cporder.length) {
                    res.msg = 'parameter err!!!';
                    callback(gmCode.GMERR_MAKEUP_CHARGE_PARAMETER_ERR);
                    return;
                }
                /* 订单不为空 */
                chargeDb.getOrderDetailByOrderNum(cporder, function(err, result) {
                    if(!!err) {
                        callback(err);
                        return;
                    }
                    orderDetail = result;
                    if(null == orderDetail || null == orderDetail.zid || null == orderDetail.zuid) {
                        res.msg = 'cporder err!';
                        callback(gmCode.GMERR_CHARGE_WRONG_CPORDER);
                        return;
                    }
                    zid = orderDetail.zid;
                    zuid = orderDetail.zuid;
                    shelfId = orderDetail.shelfId;
                    callback(null);
                });
            },
            /* 保存订单状态为SDK Server验证通过 */
            function (callback) {
                orderDetail.status = chargeCommon.ORDER_STATE_SDK_CHECKED;
                chargeDb.saveOrderDetailByOrderNum(cporder, orderDetail, callback);
            },
            /* 订单商品ID校验 */
            function(exist, callback) {
                if(!chargeConfig[shelfId]) {
                    res.msg = 'good id err!!';
                    callback(gmCode.GMERR_CHARGE_GOODID_ERR);
                    return;
                }
                cSingleRecharge.addSingleRecharge(zid, zuid, shelfId);
                callback(null);
            },

            function (callback) {
                chargeCommon.chargeHandle(cporder, orderDetail, function (err) {
                    if(!!err) {
                        callback(err);
                        return;
                    }
                    callback(null);
                });
            },

            function (callback) {
                orderDetail.status = chargeCommon.ORDER_STATE_RESEND_ORDER_REWARD;
                chargeDb.saveOrderDetailByOrderNum(cporder, orderDetail, callback);
            }
        ],function(err) {
            /* 注意：request.req.name, request.req.zid获取不到请改为'' */
            if(err && err !== retCode.SUCCESS) {
                logger.logGM(gmCode.GM_PARAM_ERR, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            }
            else {
                logger.logGM(gmCode.GM_SUCCESS, request.operatorid, request.cmd, request.req.name, request.req.zid, request, false);
                http.sendResponseWithResultToGM(response, res, gmCode.GM_SUCCESS);
            }
        });
    };
    return CS_ResendReward;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push([gmCmd.GM_MAKEUPORDER, new CS_MakeUpOrder()]);
    exportProtocol.push([gmCmd.GM_CREATENEWORDER, new CS_CreateNewOrder()]);
    exportProtocol.push([gmCmd.GM_RESENDORDERREWARD, new CS_ResendReward()]);

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
