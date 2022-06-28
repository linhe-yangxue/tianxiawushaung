
/**
 * 包含的头文件
 */
var retCode = require('../common/ret_code');
var csvManager = require('./csv_manager').Instance();
var logger = require('../manager/log4_manager').LoggerGame;
var math = require('../tools/system/math');
var protocolObject = require('../common/protocol_object');
var globalObject = require('../common/global_object');

/**
 * CSV扩展管理类
 */
var CSVExtendManager = (function() {
    /** 类的成员变量 */
    var _unique;
    var _tableGroupIDConfig;
    var _tableStageLootGroupIDConfig;
    var _tableTidSet;

    /**
     * 单例函数
     */
    function Instance() {
        if(_unique === undefined) {
            _unique = new CSVExtendManager();
        }
        return _unique;
    }

    /**
     * 构造函数
     */
    function CSVExtendManager() {
        /* 加载GroupIDConfig表，根据dropId */
        _tableGroupIDConfig = {};
        var map = csvManager.GroupIDConfig();
        for(var key in map) {
            if(!_tableGroupIDConfig[map[key].GROUP_ID]) {
                _tableGroupIDConfig[map[key].GROUP_ID] = [];
            }
            _tableGroupIDConfig[map[key].GROUP_ID].push(map[key]);
        }

        /* 加载StageLootGroupIDConfig表，根据dropId */
        _tableStageLootGroupIDConfig = {};
        var map = csvManager.StageLootGroupIDConfig();
        for(var key in map) {
            if(!_tableStageLootGroupIDConfig[map[key].GROUP_ID]) {
                _tableStageLootGroupIDConfig[map[key].GROUP_ID] = [];
            }
            _tableStageLootGroupIDConfig[map[key].GROUP_ID].push(map[key]);
        }

        _tableTidSet = {};
        for(var i in csvManager.RoleEquipConfig()) {
            _tableTidSet[i] = 1;
        }
        for(var i in csvManager.FragmentAdmin()) {
            _tableTidSet[i] = 1;
        }
        for(var i in csvManager.ActiveObject()) {
            _tableTidSet[i] = 1;
        }
        for(var i in csvManager.Fragment()) {
            _tableTidSet[i] = 1;
        }
        for(var i in csvManager.ToolItem()) {
            _tableTidSet[i] = 1;
        }
        for(var i in csvManager.EquipRefineStoneConfig()) {
            _tableTidSet[i] = 1;
        }
    }

    /**
     * 根据掉落ID和数量，获取道具掉落队列
     * @param dropId [int] 掉落ID
     * @param dropCount [int] 掉落数量
     * @param callback [func] 回调函数第一个参数err（成功返回null），第二个参数ItemObject对象数组
     */
    CSVExtendManager.prototype.GroupIDConfig_DropId = function(dropId, dropCount, callback) {
        if(0 == dropId) {
            callback(null, []);
            return;
        }

        var arr = _tableGroupIDConfig[dropId];
        if (!arr) {
            callback(retCode.TID_NOT_EXIST, []);
            return;
        }
        var probability = 1;
        for(var i = 0; i != arr.length; ++i) {
            probability += arr[i].ITEM_DROP_WEIGHT;
        }
        var retArr = [];
        while(dropCount > 0) {
            var rand = math.rand(1, probability);
            var randCount = 1;
            for (var i = 0; i != arr.length; ++i) {
                randCount += arr[i].ITEM_DROP_WEIGHT;
                if (rand <= randCount) {
                    var item = new protocolObject.ItemObject();
                    item.itemId = -1;
                    item.tid = arr[i].ITEM_ID;
                    item.itemNum = arr[i].ITEM_COUNT * arr[i].LOOT_TIME;
                    retArr.push(item);
                    break;
                }
            }
            dropCount--;
        }
        callback(null, retArr);
    };

    /**
     * 根据掉落ID和数量，获取道具掉落队列
     * @param dropId [int] 掉落ID
     * @param dropCount [int] 掉落数量
     * @param callback [func] 回调函数第一个参数err（成功返回null），第二个参数ItemObject对象数组
     */
    CSVExtendManager.prototype.StageLootGroupIDConfig_DropId = function(dropId, dropCount, callback) {
        if(0 == dropId) {
            callback(null, []);
            return;
        }

        var arr = _tableStageLootGroupIDConfig[dropId];
        if (!arr) {
            callback(retCode.TID_NOT_EXIST, []);
            return;
        }
        var probability = 1;
        for(var i = 0; i != arr.length; ++i) {
            probability += arr[i].ITEM_DROP_WEIGHT;
        }
        var retArr = [];
        while(dropCount) {
            var rand = math.rand(1, probability);
            var randCount = 1;
            for (var i = 0; i != arr.length; ++i) {
                randCount += arr[i].ITEM_DROP_WEIGHT;
                if (rand <= randCount) {
                    var item = new protocolObject.ItemObject();
                    item.itemId = -1;
                    item.tid = arr[i].ITEM_ID;
                    item.itemNum = arr[i].ITEM_COUNT * arr[i].LOOT_TIME;
                    retArr.push(item);
                    break;
                }
            }
            dropCount--;
        }
        callback(null, retArr);
    };

    /**
     * 获取指定GroupId的记录
     * @param groupId [int] 掉落ID
     * @returns [arr] 指定GroupId的记录
     */
    CSVExtendManager.prototype.GroupIDConfigRecordsByGroupID = function(groupId) {
        return _tableGroupIDConfig[groupId];
    };

    /**
     * 获取指定GroupId的记录
     * @param groupId [int] 掉落ID
     * @returns [arr] 指定GroupId的记录
     */
    CSVExtendManager.prototype.StageLootGroupIDConfigRecordsByGroupID = function(groupId) {
        return _tableStageLootGroupIDConfig[groupId];
    };

    /**
     * 获取指定GroupId的全部掉落
     * @param groupId [int] 掉落ID
     * @returns [arr] 指定GroupId的记录
     */
    CSVExtendManager.prototype.GroupIDConfigAllByGroupID = function(groupId) {
        var retArr = [];
        if(0 == groupId) {
            return retArr;
        }
        var arr = _tableGroupIDConfig[groupId];
        if(null == arr) {
            return retArr;
        }
        for(var i  = 0; i < arr.length; ++i) {
            var item = new protocolObject.ItemObject();
            item.itemId = -1;
            item.tid = arr[i].ITEM_ID;
            item.itemNum = arr[i].ITEM_COUNT * arr[i].LOOT_TIME;
            retArr.push(item);
        }
        return retArr;
    };

    /**
     * 检查Tid是否可以放入背包
     * @param tid [int] 物品表格Id
     * @returns  [int] Tid是否可以放入背包
     */
    CSVExtendManager.prototype.CheckTidForPackage = function(tid) {
        return _tableTidSet[tid];
    };

    /**
     * 返回一个单例函数
     */
    return Instance;
})();

/**
 * 声明全局对象
 */
exports.Instance = CSVExtendManager;
