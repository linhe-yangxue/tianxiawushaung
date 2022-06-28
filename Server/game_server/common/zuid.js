/**
 * 把zuid拆分为zid和uid
 * @param zuid
 * @returns {Array}
 */
var zuidSplit = function(zuid) {
    if(zuid == "" || zuid ==null){
        return zuid
    }
    var ret = zuid.split(':');
    for(var i = 0; i < 2; ++i) {
        if(isNaN(ret[i])) {
            ret[i] = 0;
        }
    }

    return ret;
};
exports.zuidSplit = zuidSplit;

/**
 * 通过zid和uid生成zuid
 * @param zid
 * @param uid
 * @returns {string}
 */
var zidUidJoin = function(zid, uid) {
    return zid + ':' + uid;
};
exports.zidUidJoin = zidUidJoin;



