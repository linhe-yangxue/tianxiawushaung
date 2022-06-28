/**
 * ---------------------------------------------------------------------------------------------------------------------
 * 文件描述：SDK充值
 * 开发者：许林
 * 开发者备注：
 * 审阅者：
 * 优化建议：
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * 包含的头文件
 */
var packets = require('../packets/charge');
var http = require('../../tools/net/http_server/http_protocol_base').impl;
var retCode = require('../../common/ret_code');
var async = require('async');
var cPackage = require('../common/package');
var md5 = require('MD5');
var accountDb = require('../database/account');
var chargeDb = require('../database/charge');
var playerDb = require('../database/player');
var sdkAccountDb = require('../database/sdk_account');
var csvManager = require('../../manager/csv_manager').Instance();
var filter = require('../common/filter_common');
var logsWater = require('../../common/logs_water');
var sendMail = require('../common/send_mail');
var logger = require('../../manager/log4_manager');
var biCode = require('../../common/bi_code');
var type = require('../common/item_type');
var cRevelry = require('../common/revelry');
var simplePost = require('../../tools/net/http_request').simplePost;
var cfgSdk = require('../../../server_config/sdk.json');
var cfgControl = require('../../../server_config/control.json');
var cZuid = require('../common/zuid');
var cMission = require('../common/mission');
var cSingleRecharge = require('../common/single_recharge');
var globalObject = require('../../common/global_object');
var timeUtil = require('../../tools/system/time_util');
var chargeCommon = require('../common/charge_common');

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 生成订单号
 */
var CS_GenerateOrder = (function() {

    /**
     * 构造函数
     */
    function CS_GenerateOrder() {
        this.reqProtocolName = packets.pCSGenerateOrder;
        this.resProtocolName = packets.pSCGenerateOrder;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_GenerateOrder.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_GenerateOrder();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.shelfId) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.zid = parseInt(req.zid);
            req.shelfId = parseInt(req.shelfId);

            if(isNaN(req.zid) || isNaN(req.shelfId)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var channelId = -1;
            var  answer = null;
            async.waterfall([
                /* Game server 网络令牌验证 */
                function(callback) {
                    accountDb.checkGameToken(req.zid, req.zuid, req.tk, req.mac, callback);
                },
                /* 获得渠道id */
                function(callback) {
                    sdkAccountDb.getChannelInfoByUid(req.zuid, callback);
                },
                /* 生成订单号 */
                function(channelInfo, callback) {
                    channelId = channelInfo.channel;
                    var log = 'GenerateOrder channelId is: '+ channelId; //临时测试日志
                    logger.LoggerGame.info(retCode.SUCCESS, log);

                    var chargeConfig = csvManager.ChargeConfig();
                    if(null == chargeConfig[req.shelfId]) { /* 防止发送恶意数据 */
                        callback(retCode.INVALID_INDEX);
                        return;
                    }
                    /* 生成订单号 发给客户端和SDK服务器 */
                    res.orderNum = md5(md5(Math.random()) + Date.now() + req.shelfId + req.zid + req.zuid);
                    res.orderNum = res.orderNum.substr(0,5) + res.orderNum.substr(10,5);
                    if(cfgControl.sdkChargeOpen) {
                        if(-1 == channelId) {
                            callback(retCode.SDK_CHANNEL_ERR);
                            return;
                        }
                        var urlSite = cfgSdk.sdkServer + channelId + cfgSdk.sdkSaveOrder;
                        var sdkReqBody = {};
                        sdkReqBody.cporder = res.orderNum;
                        sdkReqBody.data = res.orderNum;
                        sdkReqBody.notifyurl = cfgSdk.cpServer;
                        sdkReqBody.verifyurl = cfgSdk.vfServer;
                        sdkReqBody.sign = md5(res.orderNum + '|' + sdkReqBody.data + '|' + chargeCommon.SIGN_KEY); /* 产生签名 */
                        simplePost(urlSite, sdkReqBody, callback); /* 给sdk服务器发送消息 */
                    }
                    else {
                        callback(null, null, null);
                    }

                },
                function(header, body, callback) {
                    if(cfgControl.sdkChargeOpen) { /* 控制是否开启SDK充值 1:是, 0:否 */
                        try{
                            answer = JSON.parse(body);
                        }catch (e) {
                            if(e) {
                                callback(retCode.SDK_BODY_ERR);
                                return;
                            }
                        }
                        if(!answer) {
                            callback(retCode.SDK_BODY_NULL);
                            return;
                        }
                        if(0 != answer.code) {
                            callback(answer.code);
                            return;
                        }
                    }

                    var orderDetail = new globalObject.OrderDetail();
                    orderDetail.zid = req.zid;
                    orderDetail.zuid = req.zuid;
                    orderDetail.status = chargeCommon.ORDER_STATE_GENERATED;
                    orderDetail.shelfId = req.shelfId;
                    orderDetail.createtime = timeUtil.getDateFormat(new Date());
                    chargeDb.saveOrderDetailByOrderNum(res.orderNum, orderDetail, callback); /* 记录订单 */
                },

                function(exist, callback) {
                    if(0 === exist) { /* 订单已经存在 */
                        callback(retCode.SDK_REPEAT_ORDER);
                        return;
                    }
                    /* 获取渠道对应的商品id，因为有的渠道需要这个id才能充值,不需要的传字符串'0' */
                    res.productId = getProductId(channelId, req.shelfId);
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    logger.LoggerGame.info(err, JSON.stringify(answer));
                    http.sendResponseWithResultCode(response, res, err);
                }
                else {
                    http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                }
            });
        });
    };
    return CS_GenerateOrder;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 充值结果会话
 */
var CS_ChargeResult = (function() {

    /**
     * 构造函数
     */
    function CS_ChargeResult() {
        this.reqProtocolName = packets.pCSChargeResult;
        this.resProtocolName = packets.pSCChargeResult;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChargeResult.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChargeResult();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.code
                || null == req.id
                || null == req.order
                || null == req.cporder
                || null == req.info
                || null == req.amount
                || null == req.sign) {
                res.msg = 'parameter err!';
                http.sendResponseToSDK(response, res, retCode.SDK_PARAMETER_ERR);
                return;
            }

            req.code = parseInt(req.code);
            req.amount = parseInt(req.amount);

            if(isNaN(req.amount) || isNaN(req.code)) {
                res.msg = 'parameter err!!';
                http.sendResponseToSDK(response, res, retCode.SDK_PARAMETER_ERR);
                return;
            }
            var zid = null;
            var zuid = null;
            var channelInfo = null;
            var shelfId = null;
            var playerInfo = null;
            var addDiamond = 0;
            var isFirst = 0;
            var chargeConfig = csvManager.ChargeConfig();
            var orderDetail;

            async.waterfall([
                function(callback) {
                   var log = "Charge Result is: " + JSON.stringify(req);
                    logger.LoggerGame.info(req.code, log);
                    /* 订单号不为空 */
                    if(0 == req.cporder.length || 0 == req.amount) {
                        res.msg = 'parameter err!!!';
                        callback(retCode.SDK_PARAMETER_ERR);
                        return;
                    }
                    /* 通过订单号获取zuid和zid */
                    chargeDb.getOrderDetailByOrderNum(req.cporder, function(err, result) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        orderDetail = result;
                        if(null == orderDetail || null == orderDetail.zid || null == orderDetail.zuid) {
                            res.msg = 'cporder err!';
                            callback(retCode.SDK_WRONG_ORDER);
                            return;
                        }
                        zid = orderDetail.zid;
                        zuid = orderDetail.zuid;
                        shelfId = orderDetail.shelfId;
                        callback(null);
                    });
                },

                /* 验证签名 */
                function(callback) {
                    if(0 != req.code) { /* 充值失败 */
                        res.msg = 'charge failed!';
                        callback(retCode.SDK_CHARGE_FAILED);
                        return;
                    }
                    var sign = md5( req.code + '|' +  req.id + '|' +
                    req.order + '|' +  req.cporder + '|' + req.info + '|' + chargeCommon.SIGN_KEY); /*该apiKey字符串请勿随便修改,除非sdk告知修改*/
                    if(sign !== req.sign) { /* 签名参数错误 */
                        res.msg = 'sign err!';
                        callback(retCode.SDK_SIGN_ERR);
                        return;
                    }
                    callback(null);
                },

                /* 保存订单状态为SDK Server验证通过 */
                function (callback) {
                    orderDetail.order = req.order;
                    orderDetail.status = chargeCommon.ORDER_STATE_SDK_CHECKED;
                    chargeDb.saveOrderDetailByOrderNum(req.cporder, orderDetail, callback);
                },

                function(exist, callback) {
                    sdkAccountDb.getChannelInfoByUid(zuid, callback);
                },

                function(info, callback) {
                    channelInfo = info;
                    callback(null);
                },

                function(callback) {
                    if(!chargeConfig[shelfId]) {
                        res.msg = 'cporder err!!';
                        callback(retCode.SDK_WRONG_ORDER);
                        return;
                    }

                    /* 金额校验 临时 */
                    if(chargeConfig[shelfId].PRICE != req.amount) {
                        res.msg = 'parameter err!!!!';
                        callback(retCode.SDK_WRONG_ORDER);
                        return;
                    }
                    cSingleRecharge.addSingleRecharge(zid, zuid, shelfId);
                    callback(null);
                },

                function (callback) {
                    chargeCommon.chargeHandle(req.cporder, orderDetail, function (err, _addDiamon, _isFirst, _playerInfo) {
                        if(!!err) {
                            callback(err);
                            return;
                        }
                        addDiamond = _addDiamon;
                        isFirst = _isFirst;
                        playerInfo = _playerInfo;
                        callback(null);
                    });
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    /* 错误日志 当有错时请看该条日志 */
                    logger.LoggerGame.info(err, JSON.stringify(req));
                    if(retCode.SDK_REPEAT_ORDER == err) {
                        res.msg = 'cporder repeated!';
                    }
                    if(req.flag) {
                        http.sendResponseWithResultCode(response, res, err);
                        return;
                    }
                    http.sendResponseToSDK(response, res, err);
                }
                else {
                    /*写BT*/
                    var preZid = cZuid.zuidSplit(zuid)[0];
                    logger.logBI(preZid, biCode.logs_user_cash_charge, '', preZid, channelInfo.channel, zuid, zuid, playerInfo.name, playerInfo.character.level,
                        playerInfo.vipLevel, req.amount, addDiamond, req.cporder, req.order, isFirst);
                    if(req.flag) {
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                        return;
                    }
                    http.sendResponseToSDK(response, res, retCode.SDK_CHARGE_SUCCESS);
                }
            });
        });
    };
    return CS_ChargeResult;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 每种金额首次充值记录
 */
var CS_ChargeFirst = (function() {

    /**
     * 构造函数
     */
    function CS_ChargeFirst() {
        this.reqProtocolName = packets.pCSChargeFirst;
        this.resProtocolName = packets.pSCChargeFirst;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChargeFirst.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChargeFirst();
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
                    chargeDb.getFirstChargeShelfIdArr(req.zid, req.zuid, function(err, array) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.infoArr = array;
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
    return CS_ChargeFirst;
})();

/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 充值成功后返回相关数据
 */
var CS_ChargeFeedBack = (function() {

    /**
     * 构造函数
     */
    function CS_ChargeFeedBack() {
        this.reqProtocolName = packets.pCSChargeFeedBack;
        this.resProtocolName = packets.pSCChargeFeedBack;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChargeFeedBack.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChargeFeedBack();
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
                    playerDb.getPlayerData(req.zid, req.zuid, false, function(err, player) {
                        if(err) {
                            callback(err);
                            return;
                        }
                        res.diamond = player.diamond;
                        res.vipLevel = player.vipLevel;
                        res.vipExp = player.vipExp;
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
    return CS_ChargeFeedBack;
})();

/**
 * 用户支付订单
 */
var CS_ChargePayOrder = (function() {

    /**
     * 构造函数
     */
    function CS_ChargePayOrder() {
        this.reqProtocolName = packets.pCSChargePayOrder;
        this.resProtocolName = packets.pSCChargePayOrder;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChargePayOrder.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChargePayOrder();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.cporder) {
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
                    chargeDb.getOrderDetailByOrderNum(req.cporder, callback);
                },

                function (orderDetail, callback) {
                    if(null === orderDetail) {
                        callback(retCode.SDK_WRONG_ORDER);
                        return;
                    }
                    if(chargeCommon.ORDER_STATE_GENERATED !== orderDetail.status) {
                        callback(retCode.SDK_CANNOT_PAY_PAYED_ORDER);
                        return;
                    }
                    orderDetail.status = chargeCommon.ORDER_STATE_PAYED;
                    chargeDb.saveOrderDetailByOrderNum(req.cporder, orderDetail, callback);
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
    return CS_ChargePayOrder;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 用户取消订单
 */
var CS_ChargeCancelOrder = (function() {

    /**
     * 构造函数
     */
    function CS_ChargeCancelOrder() {
        this.reqProtocolName = packets.pCSChargeCancelOrder;
        this.resProtocolName = packets.pSCChargeCancelOrder;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChargeCancelOrder.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChargeCancelOrder();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.tk
                || null == req.zid
                || null == req.zuid
                || null == req.cporder) {
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
                    chargeDb.getOrderDetailByOrderNum(req.cporder, callback);
                },

                function (orderDetail, callback) {
                    if(null === orderDetail) {
                        callback(retCode.SDK_WRONG_ORDER);
                        return;
                    }
                    if(chargeCommon.ORDER_STATE_GENERATED !== orderDetail.status) {
                        callback(retCode.SDK_CANNOT_CANCEL_PAYED_ORDER);
                        return;
                    }
                    orderDetail.status = chargeCommon.ORDER_STATE_CANCEL;
                    chargeDb.saveOrderDetailByOrderNum(req.cporder, orderDetail, callback);
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
    return CS_ChargeCancelOrder;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 获取订单情况
 */
var CS_ChargeGetInfo = (function() {

    /**
     * 构造函数
     */
    function CS_ChargeGetInfo() {
        this.reqProtocolName = packets.pCSChargeGetInfo;
        this.resProtocolName = packets.pSCChargeGetInfo;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_ChargeGetInfo.prototype.handleProtocol = function (request, response) {
        var res = new packets.SC_ChargeGetInfo();
        res.pt = this.resProtocolName;
        /* 解析协议 */
        http.readDataFromRequest(request, response, function (req) {
            /* 校验参数 */
            if(null == req
                || null == req.code
                || null == req.id
                || null == req.order
                || null == req.cporder
                || null == req.info
                || null == req.sign) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            req.code = parseInt(req.code);

            if(false || isNaN(req.code)) {
                http.sendResponseWithResultCode(response, res, retCode.ERR);
                return;
            }

            var orderDetail;
            var chargeConfig = csvManager.ChargeConfig();
            var channelInfo;
            async.waterfall([
                function(callback) {
                    chargeDb.getOrderDetailByOrderNum(req.cporder, callback);
                },

                /* 检查订单是否存在 */
                function (orderDetailCb, callback) {
                    orderDetail = orderDetailCb;
                    if(null === orderDetail) {
                        res.msg = 'cporder err';
                        callback(retCode.SDK_WRONG_ORDER);
                        return;
                    }
                    callback(null);
                },

                function(callback) {
                    sdkAccountDb.getChannelInfoByUid(orderDetail.zuid, callback);
                },

                /* 签名验证 */
                function (channelInfoCb, callback) {
                    channelInfo = channelInfoCb;
                    if(-1 == channelInfo.channel) {
                        callback(retCode.SDK_CHANNEL_ERR);
                        res.msg = 'channel err';
                        return;
                    }
                    var sign = md5(req.code + '|' + req.id + '|' + req.order + '|' + req.cporder + '|' + req.info + '|' + chargeCommon.SIGN_KEY); /* 产生签名 */
                    if(req.sign !== sign) {
                        res.msg = 'sign err';
                        callback(retCode.SDK_SIGN_ERR);
                        return;
                    }
                    callback(null);
                },

                function(callback) {
                    var rewards = chargeCommon.getChargeReward(orderDetail.shelfId);
                    res.id = channelInfo.id;
                    res.order = orderDetail.order;
                    res.cporder = req.cporder;
                    res.amount = chargeConfig[orderDetail.shelfId].PRICE;
                    res.createtime = orderDetail.createtime;
                    res.Itemid = rewards.length > 0 ? rewards[0].tid : '';
                    res.itemquantity = rewards.length > 0 ? rewards[0].itemNum : '';
                    res.status = orderDetail.status;
                    res.info = '';
                    callback(null);
                }
            ],function(err) {
                if(err && err !== retCode.SUCCESS) {
                    if(req.flag) {
                        http.sendResponseWithResultCode(response, res, err);
                        return;
                    }
                    http.sendResponseToSDK(response, res, err);
                }
                else {
                    if(req.flag) {
                        http.sendResponseWithResultCode(response, res, retCode.SUCCESS);
                        return;
                    }
                    http.sendResponseToSDK(response, res, retCode.SDK_CHARGE_SUCCESS);
                }
            });
        });
    };
    return CS_ChargeGetInfo;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 函数区
 */
/**
 * 获取对应渠道的商品id
 * @param channelId [int] 渠道id
 * @param index [int] ChargeConfig配表中的索引
 * @returns {string} 渠道对应商品id
 */
var getProductId = function(channelId, index) {
    var chargeConfig = csvManager.ChargeConfig();
    var productList = getProductList(channelId);
    var idStr = '0';
    if(null == chargeConfig[index] || null == productList) {
        return idStr;
    }
    /* 根据索引获得配表中的奖励元宝数 */
    var itemArr = filter.splitItemStr(chargeConfig[index].REWARD_BUY, '|', '#');
    if(0 == itemArr.length) {
        return idStr;
    }
    /* 根据元宝数得到渠道对应商品id */
    idStr = productList[itemArr[0].itemNum];
    if(null == idStr) {
        idStr = '0';
    }
    return idStr;
};
/**
 * 根据渠道号返回渠道对应的商品id列表
 * @param channel [int] 渠道号
 * @returns {*}
 */
var getProductList = function(channel) {
    /* 数字字符串表示元宝数 */
    var coolPad = { /* 酷派渠道商品id */
        "250":1,
        "500":2,
        "60":3,
        "300":5,
        "600":7,
        "980":9,
        "1980":11,
        "3280":13,
        "6480":15
    };
    var lenovo = { /* 联想渠道商品id */
        "250":42939,
        "500":42940,
        "60":42941,
        "300":42943,
        "600":42945,
        "980":42947,
        "1980":42949,
        "3280":42951,
        "6480":42953
    };
    var iosUC = { /* ios版的UC渠道商品id */
        "250":'ws_yk_25',
        "500":'ws_yk_50',
        "60":'ws_60',
        "300":'ws_300',
        "600":'ws_600',
        "980":'ws_980',
        "1980":'ws_1980',
        "3280":'ws_3280',
        "6480":'ws_6480'
    };
    var chongChong = { /* 虫虫渠道商品id */
        "250":'104597',
        "500":'104598',
        "60":'104599',
        "300":'104601',
        "600":'104603',
        "980":'104605',
        "1980":'104607',
        "3280":'104609',
        "6480":'104611'
    };
    var qihu = { /* 奇虎商品id */
        "250":'1',
        "500":'1',
        "60":'1',
        "300":'1',
        "600":'1',
        "980":'1',
        "1980":'1',
        "3280":'1',
        "6480":'1'
    };
    if(3 == channel) {
        return qihu;
    }
    if(17 == channel) {
        return coolPad;
    }
    if(18 == channel) {
        return lenovo;
    }
    if(72 == channel) {
        return chongChong;
    }
    if(74 == channel) {
        return iosUC;
    }
    return null;
};
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push(new CS_GenerateOrder());
    exportProtocol.push(new CS_ChargeResult());
    exportProtocol.push(new CS_ChargeFirst());
    exportProtocol.push(new CS_ChargeFeedBack());
    exportProtocol.push(new CS_ChargePayOrder());
    exportProtocol.push(new CS_ChargeCancelOrder());
    exportProtocol.push(new CS_ChargeGetInfo());

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
