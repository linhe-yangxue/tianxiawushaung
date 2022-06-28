/**-------------------------------------------------------------------------------------------------------------------*/
/**
 * 普通定义
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.MAX_DISCONNECT_NUM = 5;/*最大的重连次数*/
exports.RUNTIME_FILENAME = 'GameRunTime.txt';/*记录log读取位置文件的文件名*/
exports.LOGPRE = 'GameBI-';/*game log文件名前半部分*/
exports.LOGPRE1 = '_';/*game log文件名前半部分*/
exports.MAX_BATCHINSERT_NUM = 20;/*一次批量插入的最大条数*/
exports.DEFAULT_ZID_NAME = 'default';/*默认数据库，配置的id*/

exports.RUNTIME_GM_FILENAME = 'GmRunTime.txt';/*记录log读取位置文件的文件名*/
exports.GM_LOGPRE = 'GMBI-';/*game log文件名前半部分*/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *错误状态
 */
/**-------------------------------------------------------------------------------------------------------------------*/
exports.SUCCESS = 0;/*成功*/
exports.INIT_ERROR = -1;/*启动初始化失败*/
exports.FILESTATE_WRITTEN = -11;/**/

exports.FU_1 = 101;/*日志文件夹下没有文件*/
exports.FU_2 = 102;/*读文件失败*/
exports.FU_3 = 103;/*写logRunTime失败*/
exports.FU_4 = 104;/*读不到日志文件数据，原因可能没有写入，或该文件已写完（时间已过）*/
exports.FU_5 = 105;/**/
exports.FU_6 = 106;/**/
exports.FU_7 = 107;/**/
exports.FU_8 = 108;/**/
exports.FU_9 = 109;/**/
exports.FU_10 = 110;/**/

exports.W_1 = 201;/*读取日志文件其他错误*/
exports.W_2 = 202;/*真的没有要写mysql的数据*/
exports.W_3 = 203;/*没有新日志文件可读*/
exports.W_4 = 204;/*下个循环再读*/
exports.W_5 = 205;/*只累加了offset，没有可写入mysql的*/
exports.W_6 = 206;/*上轮读文件未执行完*/
exports.W_7 = 207;/**/
exports.W_8 = 208;/**/
exports.W_9 = 209;/**/
exports.W_10 = 210;/**/

/**-------------------------------------------------------------------------------------------------------------------*/
/**
 *插入表语句配置
 */
/**-------------------------------------------------------------------------------------------------------------------*/
var mapInsertTableStr = {
    1:'insert into `%s`.`logs_app_launch`(event_time,device_id,channel,ip,client_version,system_software,system_hardware,mac) values (%s)',
    2:'insert into `%s`.`logs_app_load_step`(event_time,device_id,channel,client_version,system_software,system_hardware,step,interva) values (%s)',
    3:'insert into `%s`.`logs_app_update`(event_time,device_id,channel,client_version,system_software,system_hardware,game_version_1,game_version_2,update_time) values (%s)',
    4:'insert into `%s`.`logs_character_step`(event_time,device_id,server_id,channel,user_id,character_id,client_version,system_software,system_hardware,step,sub_step,name) values (%s)',
    5:'insert into `%s`.`logs_user_create`(event_time,device_id,channel_user_id,server_id,channel,user_id,client_version,system_software,system_hardware,ip,mac) values (%s)',
    6:'insert into `%s`.`logs_character_create`(event_time,server_id,channel,user_id,character_id,character_name,character_race,first_role,system_software,system_hardware) values (%s)',
    7:'insert into `%s`.`logs_character_level_up`(event_time,server_id,channel,user_id,character_id,before_exp,after_exp,before_level,after_level) values (%s)',
    8:'insert into `%s`.`logs_online_users`(event_time,server_id,channel,count_id,user_count) values (%s)',
    9:'insert into `%s`.`logs_user_login`(event_time,device_id,server_id,channel,user_id,ip,mac,level,client_version,system_software,system_hardware,is_wifi) values (%s)',
    10:'insert into `%s`.`logs_user_logout`(event_time,server_id,channel,device_id,user_id,character_id,online_time,login_time,level,client_version,system_software,system_hardware) values (%s)',
    11:'insert into `%s`.`logs_user_money_change`(event_time,server_id,channel,user_id,character_id,level,vip,change_reason,change_subreason,change_count,change_amount,before_balance,after_balance,add_or_reduce) values (%s)',
    12:'insert into `%s`.`logs_user_yuanbao_change`(event_time,server_id,channel,user_id,character_id,level,vip,change_reason,change_subreason,change_count,change_amount,before_balance,after_balance,add_or_reduce) values (%s)',
    13:'insert into `%s`.`logs_user_item_change`(event_time,server_id,channel,user_id,character_id,level,vip,item_type,item_id,item_name,item_count,after_count,change_reason,change_subreason,money,money_type,add_or_reduce) values (%s)',
    14:'insert into `%s`.`logs_user_cash_charge`(event_time,device_id,server_id,channel,user_id,character_id,character_name,level,vip,cash_amount,yuanbao_amount,order_id,channel_order_id,is_first) values (%s)',

    101:'insert into `%s`.`logs_instance`(event_time,server_id,channel_id,user_id,character_id,character_level,reason_id,subreason_id,battle_id,battle_diff,round_start,round_time,round_result,revive_num,is_auto,is_first,get_reward,boss_tid,bossIndex,is_exit,is_sweep,power,pet_ids) values (%s)',
    102:'insert into `%s`.`logs_instance_more_reward`(,event_time,server_id,channel_id,user_id,character_id,character_level,cost,items,get_reward) values (%s)',
    103:'insert into `%s`.`logs_instance_money`(event_time,server_id,channel_id,user_id,character_id,character_level,reason_id,subreason_id,battle_id,battle_diff,round_start,round_time,round_result,revive_num,is_auto,is_first,get_reward) values (%s)',
    104:'insert into `%s`.`logs_instance_exp`(event_time,server_id,channel_id,user_id,character_id,character_level,reason_id,subreason_id,battle_id,battle_diff,round_start,round_time,round_result,revive_num,is_auto,is_first,get_reward) values (%s)',
    105:'insert into `%s`.`logs_instance_mj`(event_time,server_id,channel_id,user_id,character_id,character_level,reason_id,subreason_id,battle_id,battle_diff,round_start,round_time,round_result,revive_num,is_auto,is_first,get_reward,type,petitemid,explore_type,friend_id) values (%s)',
    106:'insert into `%s`.`logs_lottery_draw`(event_time,server_id,channel_id,user_id,character_id,character_level,action,cost,get_reward,consume) values (%s)',
    107:'insert into `%s`.`logs_friends`(event_time,server_id,channel_id,user_id,character_id,character_level,friend_count,sns_type,friend_id) values (%s)',
    108:'insert into `%s`.`logs_mission_reward`(event_time,server_id,channel_id,user_id,character_id,character_level,mission_action,mission_type,mission_id,mission_name,mission_level,get_reward) values (%s)',
    109:'insert into `%s`.`logs_gang`(event_time,server_id,channel_id,user_id,character_id,character_level,sns_type,gang_id,gang_name,other_uid) values (%s)',
    110:'insert into `%s`.`logs_sign`(event_time,server_id,channel_id,user_id,character_id,character_level,sign_number) values (%s)',
    111:'insert into `%s`.`logs_hero_foster`(event_time,server_id,channel_id,user_id,character_id,character_level,hero_id,hero_name,hero_level,before_level,after_level,get_exp) values (%s)',
    112:'insert into `%s`.`logs_hero_advanced`(event_time,server_id,channel_id,user_id,character_id,character_level,hero_id,hero_name,hero_level,action,before_level,after_level) values (%s)',
    113:'insert into `%s`.`logs_hero_star`(event_time,server_id,channel_id,user_id,character_id,character_level,hero_id,hero_name,hero_level,before_level,after_level,consume,get_reward) values (%s)',
    114:'insert into `%s`.`logs_hero_skill`(event_time,server_id,channel_id,user_id,character_id,character_level,hero_id,hero_name,hero_level,skill,before_level,after_level,skill_id) values (%s)',

    201:'insert into `%s`.`logs_arena`(event_time,server_id,channel_id,user_id,character_id,operate_type,my_rank,operate_rank,opponent_id,round_result,get_reward) values (%s)',
    202:'insert into `%s`.`logs_world_chat`(event_time,server_id,channel_id,user_id,character_id,content) values (%s)',
    203:'insert into `%s`.`logs_climb_tower`(event_time,server_id,channel_id,user_id,character_id,cur_stars,tier,result,item_on_sale,choose_buff,get_reward) values (%s)',
    204:'insert into `%s`.`logs_climb_tower_buff`(event_time,server_id,channel_id,user_id,character_id,tier,buff_id) values (%s)',
    205:'insert into `%s`.`logs_demon_boss`(event_time,server_id,channel_id,user_id,character_id,finder_id,boss_index,button_index,event_index,round_result,damage_output) values (%s)',
    206:'insert into `%s`.`logs_strengthen_equip`(event_time,server_id,channel_id,user_id,character_id,type,itemId,tid,upgrade_level,stren_times,consume) values (%s)',
    207:'insert into `%s`.`logs_fate`(event_time,server_id,channel_id,user_id,character_id,itemId,tid,consume,before_fate_level,before_fate_exp,after_fate_level,after_fate_exp) values (%s)',
    208:'insert into `%s`.`logs_fund`(event_time,server_id,channel_id,user_id,character_id,type,`index`,success) values (%s)',
    209:'insert into `%s`.`logs_code_gift`(event_time,server_id,channel_id,user_id,character_id,gift_id,gift_code,get_reward) values (%s)',
    210:'insert into `%s`.`logs_mail`(event_time,server_id,channel_id,user_id,character_id,title,content,items,type) values (%s)',
    211:'insert into `%s`.`logs_pet_upgrade`(event_time,server_id,channel_id,user_id,character_id,itemId,tid,consume,before_exp,after_exp,before_level,after_level) values (%s)',
    212:'insert into `%s`.`logs_recover`(event_time,server_id,channel_id,user_id,character_id,type,consume,get_reward) values (%s)',
    213:'insert into `%s`.`logs_indiana_fight`(event_time,server_id,channel_id,user_id,character_id,type,success,get_reward) values (%s)',
    214:'insert into `%s`.`logs_gm_code`(event_time,server_id,channel_id,user_id,character_id,id,type,use_max,name,items,code_num,media,beginTime,endTime,actual_code_num,get_reward) values (%s)',
    215:'insert into `%s`.`logs_gm_operation`(event_time,server_id,channel_id,user_id,character_id,operator_id,cmd,user_name,content) values (%s)',

    301:'insert into `%s`.`logs_online_info`(`event_time`,`server_id`,`channel_id`,`user_id`,`character_id`) values (%s)',
    302:'insert into `%s`.`logs_battleachv`(`event_time`,`server_id`,`channel_id`,`user_id`,`character_id`,`level`,`vip`,`change_reason`,`change_subreason`,`change_count`,`change_amount`,`before_balance`,`after_balance`,`add_or_reduce`) values (%s)',
    303:'insert into `%s`.`logs_soulpoint`(`event_time`,`server_id`,`channel_id`,`user_id`,`character_id`,`level`,`vip`,`change_reason`,`change_subreason`,`change_count`,`change_amount`,`before_balance`,`after_balance`,`add_or_reduce`) values (%s)',
    304:'insert into `%s`.`logs_reputation`(`event_time`,`server_id`,`channel_id`,`user_id`,`character_id`,`level`,`vip`,`change_reason`,`change_subreason`,`change_count`,`change_amount`,`before_balance`,`after_balance`,`add_or_reduce`) values (%s)',
    305:'insert into `%s`.`logs_prestige`(`event_time`,`server_id`,`channel_id`,`user_id`,`character_id`,`level`,`vip`,`change_reason`,`change_subreason`,`change_count`,`change_amount`,`before_balance`,`after_balance`,`add_or_reduce`) values (%s)',
    306:'insert into `%s`.`logs_guild_contr`(`event_time`,`server_id`,`channel_id`,`user_id`,`character_id`,`level`,`vip`,`change_reason`,`change_subreason`,`change_count`,`change_amount`,`before_balance`,`after_balance`,`add_or_reduce`) values (%s)',
    307:'insert into `%s`.`logs_stamina`(`event_time`,`server_id`,`channel_id`,`user_id`,`character_id`,`level`,`vip`,`change_reason`,`change_subreason`,`change_count`,`change_amount`,`before_balance`,`after_balance`,`add_or_reduce`) values (%s)',
    308:'insert into `%s`.`logs_integral`(`event_time`,`server_id`,`channel_id`,`user_id`,`character_id`,`level`,`vip`,`change_reason`,`change_subreason`,`change_count`,`change_amount`,`before_balance`,`after_balance`,`add_or_reduce`) values (%s)'
};
exports.mapInsertTableStr = mapInsertTableStr;
