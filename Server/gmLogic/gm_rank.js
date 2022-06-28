
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

/**
 * 协议主逻辑的实现
 */
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询战斗力排行
 */
var CS_QueryPowerRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryPowerRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryPowerRank.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(false || isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([

            function(callback) {
                callback(null);
            },

            function(callback) {
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
    return CS_QueryPowerRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询等级排行
 */
var CS_QueryLevelRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryLevelRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryLevelRank.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(false || isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([

            function(callback) {
                callback(null);
            },

            function(callback) {
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
    return CS_QueryLevelRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询宗门排行
 */
var CS_QueryGuildRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryGuildRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryGuildRank.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(false || isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([

            function(callback) {
                callback(null);
            },

            function(callback) {
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
    return CS_QueryGuildRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询天魔乱入伤害排行
 */
var CS_QueryDamageRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryDamageRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryDamageRank.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(false || isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([

            function(callback) {
                callback(null);
            },

            function(callback) {
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
    return CS_QueryDamageRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询天魔乱入功勋排行
 */
var CS_QueryFeatsRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryFeatsRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryFeatsRank.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(false || isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([

            function(callback) {
                callback(null);
            },

            function(callback) {
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
    return CS_QueryFeatsRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询爬塔排行
 */
var CS_QueryClimbTowerStarsRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryClimbTowerStarsRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryClimbTowerStarsRank.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(false || isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([

            function(callback) {
                callback(null);
            },

            function(callback) {
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
    return CS_QueryClimbTowerStarsRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 查询竞技场排行
 */
var CS_QueryArenaRank = (function() {

    /**
     * 构造函数
     */
    function CS_QueryArenaRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_QueryArenaRank.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.zid) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);

        if(false || isNaN(request.req.zid)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([

            function(callback) {
                callback(null);
            },

            function(callback) {
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
    return CS_QueryArenaRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 修改排行榜名次
 */
var CS_AlterRank = (function() {

    /**
     * 构造函数
     */
    function CS_AlterRank() {
        this.reqProtocolName = packets.pCSGM;
        this.resProtocolName = packets.pSCGM;
    }

    /**
     * 继承基类，实现协议逻辑
     * @param request [object] 已解析过的通讯协议的请求对象
     * @param response [object] 通讯协议的响应对象
     */
    CS_AlterRank.prototype.handleProtocol = function (request, response) {
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
            || null == request.req.rankId) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        request.req.zid = parseInt(request.req.zid);
        request.req.rankId = parseInt(request.req.rankId);

        if(false || isNaN(request.req.zid) || isNaN(request.req.rankId)) {
            http.sendResponseWithResultToGM(response, res, gmCode.GM_PARAM_ERR);
            return;
        }

        /* sign验证 */
        if(!gmCommon.checkSign(request)){
            http.sendResponseWithResultToGM(response, res, gmCode.GM_SIGN_PLUG);
            return;
        }
        
        async.waterfall([

            function(callback) {
                callback(null);
            },

            function(callback) {
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
    return CS_AlterRank;
})();
/**-------------------------------------------------------------------------------------------------------------------*/

/**
 * 绑定
 * @param protocolListCallback
 */
function import_protocol(protocolListCallback) {
    var exportProtocol = [];
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_QueryPowerRank()]);
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_QueryLevelRank()]);
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_QueryGuildRank()]);
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_QueryDamageRank()]);
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_QueryFeatsRank()]);
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_QueryClimbTowerStarsRank()]);
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_QueryArenaRank()]);
    exportProtocol.push([gmCmd.GM_QUERYDONTCHAT, new CS_AlterRank()]);

    protocolListCallback(exportProtocol);
}
exports.importProtocol = import_protocol;
