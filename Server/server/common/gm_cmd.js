/**GM消息号（cmd）*/
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * player相关
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GM_QUERYDONTCHAT = '10001'; /* 禁言查询 */
exports.GM_ADDDONTCHAT = '10002'; /* 添加禁言 */
exports.GM_DELDONTCHAT = '10003'; /* 删除禁言 */
exports.GM_QUERYSEALACCOUNT= '10004'; /* 封号查询 */
exports.GM_ADDSEALACCOUN = '10005'; /* 添加封号 */
exports.GM_DELSEALACCOUN = '10006'; /* 删除封号 */
exports.GM_QUERYPLAYER = '10007'; /* 玩家信息查询 */
exports.GM_QUERYPLAYERPET = '10008'; /* 玩家宠物查询 */
exports.GM_QUERYPLAYERPETFRAGMENT = '10009'; /* 玩家宠物碎片查询 */
exports.GM_QUERYPLAYEREQUIP = '10010'; /* 玩家装备查询 */
exports.GM_QUERYPLAYEREQUIPFRAGMENT = '10011'; /* 玩家装备碎片查询 */
exports.GM_QUERYPLAYERMAGIC = '10012'; /* 玩家法器查询 */
exports.GM_QUERYPLAYERMAGICFRAGMENT = '10013'; /* 玩家法器碎片查询 */
exports.GM_QUERYPLAYERITEMS = '10014'; /* 玩家消耗品查询 */
exports.GM_ALTERVIPLEVEL = '10015'; /*修改vip等级*/
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 全服相关
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GM_QUERYROLLPLAYING= '10101'; /* 查询走马灯 */
exports.GM_ADDROLLPLAYING = '10102'; /* 添加走马灯 */
exports.GM_DELROLLPLAYING = '10103'; /* 删除走马灯 */
exports.GM_QUERYANNOUNCE = '10104'; /* 公告查询 */
exports.GM_ADDANNOUNCE = '10105'; /* 添加公告 */
exports.GM_DELANNOUNCE = '10106'; /* 删除公告 */
exports.GM_ADDACTIVATIONGIFT = '10107'; /* 添加礼包码礼包 */
exports.GM_HOTUPDATECSV = '10108'; /* 热更新csv文件 */
exports.GM_DELACTIVATIONGIFT = '10109'; /* 删除礼包码礼包*/
exports.GM_QUERYSERVERINFO = '10110'; /* 查询服务器信息*/
exports.GM_QUERYREGISTER = '10111'; /*注册状态查询*/
exports.GM_ALTERREGISTER = '10112'; /*修改注册状态*/
exports.GM_GETALLITEMLIST = '10113'; /*获取所有道具列表*/
exports.GM_QUERYCHANNELRATE = '10114'; /*查询渠道返利*/
exports.GM_ALTERCHANNELRATE = '10115'; /*修改渠道返利*/
exports.GM_ALTERANNOUNCE = '10116'; /*修改公告*/
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 邮件
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GM_SENDMAIL = '10201'; /* 发送邮件 */
exports.GM_CUSTOMMADEMAIL = '10202'; /* 定制邮件 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 某区相关
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GM_QUERYWHITELIST = '10301'; /* 查询白名单 */
exports.GM_ADDWHITELIS = '10302'; /* 添加白名单 */
exports.GM_DELWHITELIS = '10303'; /* 删除白名单 */
exports.GM_ALTERSERVER = '10304'; /* 服务器管理 */
exports.GM_ADDORDELSERVER = '10305'; /* 添加或删除服务器 */
exports.GM_QUERYGUILD = '10306'; /* 公会查询 */
exports.GM_QUERYACTIVITY = '10307'; /* 查询运营活动 */
exports.GM_ALTERACTIVITY  = '10308'; /* 修改运营活动 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 排行榜相关
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GM_QUERYPOWERRANK = '10401'; /* 查询战斗力排行 */
exports.GM_QUERYLEVELRANK = '10402'; /* 查询等级排行 */
exports.GM_QUERYGUILDRANK = '10403'; /* 查询宗门排行 */
exports.GM_QUERYDAMAGERANK = '10404'; /* 查询天魔乱入伤害排行 */
exports.GM_QUERYFEATSRANK = '10405'; /* 查询天魔乱入功勋排行 */
exports.GM_QUERYCLIMBTOWERSTARSRANK = '10406'; /* 查询爬塔排行 */
exports.GM_QUERYARENARANK = '10407'; /* 查询竞技场排行 */
exports.GM_ALTERRANK = '10408'; /* 修改排行榜名次 */
/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 充值相关
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.GM_MAKEUPORDER = '10501'; /* 补单 */
exports.GM_CREATENEWORDER = '10502'; /* 直发补偿 */
exports.GM_RESENDORDERREWARD = '10503'; /* 重新发货 */