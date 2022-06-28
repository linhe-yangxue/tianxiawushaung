/**
 * 包含的头文件
 */
var async = require('async');
var logger = require('../manager/log4_manager').LoggerDemo;
var retCode = require('../common/ret_code');

var DemoAsync = (function() {

    /**
     * 构造函数
     */
    function DemoAsync() {

    };

    /**
     * 测试async 中的each函数 ,该函数为异步函数,串行函数为 eachSeries
     * @param []
     * @returns []
     */
    DemoAsync.prototype.funcEach = function() {
        var arr = [{name:'xl',hobby:'football'},{name:'fsq',hobby:'food'},{name:'lkp',hobby:'game'}];
        /* 对集合中的所有元素执行同一个异步操作 */
        async.eachSeries(arr,function(item,callback) {
            logger.debug("my name is " + item.name);
            setTimeout(function() {
                logger.debug("I like " + item.hobby);
                callback(null);
            },100)
        },function(err) { /* 注意 这里只能有err这一个参数。如果中途出错，则出错后马上调用最终的callback,其他未执行的任务继续执行*/
            logger.debug("-----------------------------------------------------------------");
            logger.debug("this is async.each [END]");
            logger.debug("-----------------------------------------------------------------");
        })
        /* 输出
         *
         * my name is xl
         * my name is fsq
         * my name is lkp
         * I like football
         * I like food
         * I like game
         * -----------------------------------------------------------------
         * this is async.each [END]
         * -----------------------------------------------------------------
         *
         */
    };

    /**
     * 测试async中的map函数 ,该函数为异步函数,串行函数为 mapSeries
     * @param []
     * @returns []
     */
    DemoAsync.prototype.funcMap = function() {
       /* 对集合中的每个元素，执行异步操作，得到结果，所有的结果将汇总到最终的callback里*/
        var arr = [{name:'xl',hobby:'football'},{name:'fsq',hobby:'food'},{name:'lkp',hobby:'game'}];
        async.map(arr,function(item,callback) {
            logger.debug("my name is " + item.name);
            setTimeout(function() {
                logger.debug("I like " + item.hobby);
                callback(null,item.name + " LOL");
            },100)
        },function(err,res) { /* res 是另一个数组 */
            logger.debug("The results is " + JSON.stringify(res));
            logger.debug("-----------------------------------------------------------------");
            logger.debug("this is async.map [END]");
            logger.debug("-----------------------------------------------------------------");
        })
        /*输出
        *
        * my name is xl
        * my name is fsq
        * my name is lkp
        * I like football
        * I like food
        * I like game
        * The results is ["xl LOL","fsq LOL","lkp LOL"]
        * -----------------------------------------------------------------
        * this is async.map [END]
        * -----------------------------------------------------------------
        *
        */
    };

    /**
     * 测试async中的waterfall函数 ,该函数为异步函数
     * @param []
     * @returns []
     */
    DemoAsync.prototype.funcWaterfull = function() {
        /*瀑布函数，是为了避免多层的函数嵌套而诞生，每个函数产生的值都将传给下一个，如果中途出错，后面的函数将不会执行*/
        var arr = [{name:'xl',hobby:'football'},{name:'fsq',hobby:'food'},{name:'lkp',hobby:'game'}];
        async.waterfall([

            function(callback){
                logger.debug("my name is " + arr[0].name);
                logger.debug("I like " + arr[0].hobby);
                /* 一个function 只能执行一个callback */
                if('football' === arr[0].hobby) {
                    callback(null,arr[1]);
                    return;
                }
                else {
                    callback(retCode.ERR);
                    return;
                }
            },
            function(person,callback) {
                logger.debug("my name is " + person.name);
                logger.debug("I like " + person.hobby);
                test(arr[2],function(err,data) {
                    if(err) { /*return 的结果是退出function函数*/
                        callback(err);
                        return;
                    }
                    else {
                        callback(null,data); /* data 会callback给下一个function */
                        return;
                    }
                })
            },
            function(person,callback) {
                logger.debug("my name is " + person.name);
                logger.debug("I like " + person.hobby);
                callback(null);
            }
        ],function(err){
            if(err) {
               /* 有错做错误处理*/
            }
            logger.debug("-----------------------------------------------------------------");
            logger.debug("this is async.waterfull [END]");
            logger.debug("-----------------------------------------------------------------");
        });

        /*输出
         *
         * my name is xl
         * I like football
         * my name is fsq
         * I like food
         * my name is lkp
         * I like game
         * -----------------------------------------------------------------
         * this is async.waterfull [END]
         * -----------------------------------------------------------------
         *
         */
    };

    /**
     * 测试async中的whilst函数
     * @param []
     * @returns []
     */
    DemoAsync.prototype.funcWhilst = function() {
        var i = 0;
        /* 相当于while 循环 */
        async.whilst(
            function() {
                return  i < 5; /*循环条件*/
            },
            function(cb) { /*循环主体*/
                logger.debug("count is " + i);
                i++;
                setTimeout(cb,1000);
            },
            function(err) { /* 注意 这里只能有err这一个参数。如果中途出错，则出错后马上调用第三个函数,*/
                logger.debug("err is " + err);
                logger.debug("-----------------------------------------------------------------");
                logger.debug("this is async.whilst [END]");
                logger.debug("-----------------------------------------------------------------");
            }
            /*输出
            *
            * count is 0
            * count is 1
            * count is 2
            * count is 3
            * count is 4
            * err is undefined
            * -----------------------------------------------------------------
            * this is async.whilst [END]
            * -----------------------------------------------------------------
            *
            */
        );
    };

    /**
     * 返回构造函数
     */
    return DemoAsync;
})();

/**
 * 测试函数
 */
var test = function(person,cb) {
    cb(null,person);
};

var demo = new DemoAsync();
//demo.funcEach();
//demo.funcMap();
//demo.funcWaterfull();
demo.funcWhilst();





