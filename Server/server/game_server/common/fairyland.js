var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();
var csvExtendManager = require('../../manager/csv_extend_manager').Instance();
var rand = require('../../tools/system/math').rand;

/**
 * 更新仙境事件
 * @param fairylands {Array} 仙境对象数组
 */
var updateFairylandsEvents = function(fairylands) {
    var event;

    for(var j = 0; j < 6; ++j) {
        var fairyland = fairylands[j];
        if (globalObject.FAIRYLAND_EXPLORING == fairyland.state
            || globalObject.FAIRYLAND_RIOTING == fairyland.state) {
            var line = csvManager.FairyladCost()[fairyland.exploreType];

            var curTime = parseInt(Date.now() / 1000);
            if (curTime > fairyland.endTime) {
                curTime = fairyland.endTime;
            }
            /* 当前时间应该发生事件总数，不包括好友事件 */
            var totEvents = parseInt((curTime - fairyland.beginTime) / 60 / line.REWARD_TIME);
            /* 已发生的事件数，不包括好友事件 */
            var hpdEvents = 0;
            for (var i = 0; i < fairyland.events.length; ++i) {
                if (parseInt(fairyland.events[i].index / 10000) != 2) {
                    ++hpdEvents;
                }
            }

            for (var i = 0; i < totEvents - hpdEvents; ++i) {
                /* 发生暴乱 */
                if (globalObject.FAIRYLAND_EXPLORING == fairyland.state && Math.random() < 0.2) {
                    fairyland.state = globalObject.FAIRYLAND_RIOTING;
                    event = new globalObject.FairylandEvent();
                    event.index = rand(10001, 10010);
                    fairyland.events.push(event);
                }
                else {
                    event = new globalObject.FairylandEvent();
                    event.index = rand(30001, 30010);
                    var groupId = csvManager.Fairylad()[j + 1].GROUP_ID;
                    csvExtendManager.GroupIDConfig_DropId(groupId, 1, function (err, arr) {
                        if(!err) {
                            event.tid = arr[0].tid;
                            event.itemNum = arr[0].itemNum;
                            fairyland.events.push(event);
                        }
                    });
                }
            }
        }

        /* 寻仙结束 */
        if (curTime == fairyland.endTime) {
            var fragTable = csvManager.Fragment();
            for(var i in fragTable) {
                if(fragTable[i].ITEM_ID == fairyland.tid) {
                    event = new globalObject.FairylandEvent();
                    event.index = 40001;
                    event.tid = fragTable[i].INDEX;

                    var u = parseInt((curTime - fairyland.beginTime) / 3600 / 4);
                    if(u == 1) {
                        event.itemNum = 1;
                    }
                    else if (u == 2 || u == 3) {
                        event.itemNum = rand(u-1, u);
                    }
                    else {
                        event.itemNum = 0;
                    }

                    fairyland.events.push(event);
                }
            }

            fairyland.state = globalObject.FAIRYLAND_WAIT_HARVEST;
        }
    }
};
exports.updateFairylandsEvents = updateFairylandsEvents;
