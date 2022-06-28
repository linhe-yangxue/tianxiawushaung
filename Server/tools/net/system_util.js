/**
 * Created by Kevin on 2015/8/18.
 */

/*
* 获取本机的内网Ip地址，返回值是一个数组，因为内网Ip可能有多个
* */
var get_inner_ip = function(){

    var ret = [];

    var os  = require("os");
    var ifaces = os.networkInterfaces();
    for(var key in ifaces){  /*遍历所有网卡*/
        var iface =  ifaces[key];
        for( var  i  = 0 ;  i< iface.length ; i++){ /*遍历网卡下面的IPv4或者是IPv6*/
            if(iface[i].family == 'IPv4'){    /*判断IPv4开头*/
                if(iface[i].address.indexOf("192.168") == 0 || /*判断是否是内网IP*/
                    iface[i].address.indexOf("10.") == 0){
                    ret.push(iface[i].address);
                }

            }

        }
    }
    return ret;
};

exports.get_inner_ip = get_inner_ip;