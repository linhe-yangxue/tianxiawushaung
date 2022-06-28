/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : log_db_wsxsm_0

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2016-02-23 14:06:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `logs_app_launch`
-- ----------------------------
DROP TABLE IF EXISTS `logs_app_launch`;
CREATE TABLE `logs_app_launch` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '游戏事件的时间',
  `device_id` varchar(64) DEFAULT '' COMMENT '设备ID,Android_id/IOS IDFA',
  `channel` varchar(32) DEFAULT '' COMMENT '渠道名称',
  `ip` varchar(32) DEFAULT '' COMMENT 'IP地址',
  `client_version` varchar(32) DEFAULT '' COMMENT 'App版本',
  `system_software` text COMMENT 'Android版本、IOS版本',
  `system_hardware` text COMMENT '设备型号',
  `mac` text COMMENT 'MAC地址',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_app_launch
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_app_load_step`
-- ----------------------------
DROP TABLE IF EXISTS `logs_app_load_step`;
CREATE TABLE `logs_app_load_step` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '游戏事件的时间',
  `device_id` varchar(64) NOT NULL DEFAULT '' COMMENT '设备ID',
  `channel` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道名称',
  `client_version` varchar(64) NOT NULL DEFAULT '' COMMENT '客户端版本',
  `system_software` text NOT NULL COMMENT '移动终端操作系统版本',
  `system_hardware` text NOT NULL COMMENT '移动终端机型',
  `step` int(11) NOT NULL DEFAULT '0' COMMENT '完成第1步加载记录10；完成第2步加载记录20；以此类推',
  `interva` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '从初始化到当前步骤的时间。单位秒',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_app_load_step
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_app_update`
-- ----------------------------
DROP TABLE IF EXISTS `logs_app_update`;
CREATE TABLE `logs_app_update` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime DEFAULT NULL COMMENT '游戏事件的时间',
  `device_id` varchar(64) DEFAULT '' COMMENT '设备ID',
  `channel` varchar(32) DEFAULT '' COMMENT '渠道名称',
  `client_version` varchar(64) DEFAULT '' COMMENT '客户端版本',
  `system_software` text COMMENT '移动终端操作系统版本',
  `system_hardware` text COMMENT '移动终端机型',
  `game_version_1` varchar(32) DEFAULT '' COMMENT '更新前版本号',
  `game_version_2` varchar(32) DEFAULT '' COMMENT '更新后版本号',
  `update_time` bigint(20) DEFAULT '0' COMMENT '更新过程所花的时间。单位秒',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_app_update
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_arena`
-- ----------------------------
DROP TABLE IF EXISTS `logs_arena`;
CREATE TABLE `logs_arena` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `operate_type` int(11) NOT NULL COMMENT '操作类型 1-开始挑战 2-结束挑战',
  `my_rank` int(11) NOT NULL COMMENT '角色名次',
  `operate_rank` int(11) NOT NULL COMMENT '对手名次',
  `opponent_id` varchar(64) NOT NULL COMMENT '对手游戏内角色唯一编号/ID',
  `round_result` int(11) NOT NULL COMMENT '结果评价 0失败 1成功',
  `get_reward` text NOT NULL COMMENT '获得奖励数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_arena
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_battleachv`
-- ----------------------------
DROP TABLE IF EXISTS `logs_battleachv`;
CREATE TABLE `logs_battleachv` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号/ID',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '玩家等级',
  `vip` int(11) NOT NULL DEFAULT '0' COMMENT '玩家VIP等级',
  `change_reason` varchar(32) NOT NULL DEFAULT '0' COMMENT '货币流动一级原因',
  `change_subreason` varchar(32) NOT NULL COMMENT '货币流动二级原因',
  `change_count` int(11) NOT NULL DEFAULT '0' COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动后余额',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_battleachv
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_character_create`
-- ----------------------------
DROP TABLE IF EXISTS `logs_character_create`;
CREATE TABLE `logs_character_create` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '角色创建时间',
  `server_id` int(11) NOT NULL DEFAULT '0',
  `channel` varchar(32) NOT NULL DEFAULT '',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号',
  `character_name` varchar(64) NOT NULL DEFAULT '',
  `character_race` varchar(32) NOT NULL DEFAULT '' COMMENT '阵营或职业',
  `first_role` int(4) NOT NULL DEFAULT '0',
  `system_software` text,
  `system_hardware` text,
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_character_create
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_character_level_up`
-- ----------------------------
DROP TABLE IF EXISTS `logs_character_level_up`;
CREATE TABLE `logs_character_level_up` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `event_time` datetime NOT NULL,
  `server_id` int(11) NOT NULL DEFAULT '0',
  `channel` varchar(32) NOT NULL DEFAULT '',
  `user_id` varchar(64) NOT NULL DEFAULT '',
  `character_id` varchar(64) NOT NULL DEFAULT '',
  `before_exp` bigint(20) NOT NULL DEFAULT '0',
  `after_exp` bigint(20) NOT NULL DEFAULT '0',
  `before_level` bigint(20) NOT NULL DEFAULT '0',
  `after_level` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_character_level_up
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_character_step`
-- ----------------------------
DROP TABLE IF EXISTS `logs_character_step`;
CREATE TABLE `logs_character_step` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '游戏事件的时间',
  `device_id` varchar(64) NOT NULL DEFAULT '' COMMENT '设备ID',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '服务器编号',
  `channel` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道名称',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号/ID',
  `client_version` varchar(32) DEFAULT '' COMMENT '客户端版本',
  `system_software` text COMMENT '移动终端操作系统版本',
  `system_hardware` text COMMENT '移动终端机型',
  `step` int(11) NOT NULL DEFAULT '0' COMMENT '用户刚刚完成该步引导',
  `sub_step` int(11) DEFAULT NULL COMMENT '引导中小步骤',
  `name` text COMMENT '新手引导名字',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_character_step
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_climb_tower`
-- ----------------------------
DROP TABLE IF EXISTS `logs_climb_tower`;
CREATE TABLE `logs_climb_tower` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `cur_stars` int(11) NOT NULL COMMENT '当前挑战的星数',
  `tier` int(11) NOT NULL COMMENT '层数',
  `result` int(11) NOT NULL COMMENT '结果评价 0失败 1成功',
  `item_on_sale` varchar(512) NOT NULL COMMENT '打折商品',
  `choose_buff` varchar(512) NOT NULL COMMENT '备选的新buff',
  `get_reward` text NOT NULL COMMENT '获得奖励数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_climb_tower
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_climb_tower_buff`
-- ----------------------------
DROP TABLE IF EXISTS `logs_climb_tower_buff`;
CREATE TABLE `logs_climb_tower_buff` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `tier` int(11) NOT NULL COMMENT '层数',
  `buff_id` int(11) NOT NULL COMMENT 'buff的ID',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_climb_tower_buff
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_code_gift`
-- ----------------------------
DROP TABLE IF EXISTS `logs_code_gift`;
CREATE TABLE `logs_code_gift` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `gift_id` int(11) NOT NULL COMMENT '礼包ID',
  `gift_code` varchar(64) NOT NULL COMMENT '礼包码',
  `get_reward` text NOT NULL COMMENT '获得奖励数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_code_gift
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_demon_boss`
-- ----------------------------
DROP TABLE IF EXISTS `logs_demon_boss`;
CREATE TABLE `logs_demon_boss` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `finder_id` varchar(64) NOT NULL COMMENT '发现者ID',
  `boss_index` int(11) NOT NULL COMMENT '天魔Id',
  `button_index` int(11) NOT NULL COMMENT '活动序号',
  `event_index` int(11) NOT NULL COMMENT '活动序号',
  `round_result` int(11) NOT NULL COMMENT '结果评价 0失败 1成功',
  `damage_output` bigint(20) NOT NULL COMMENT '伤害输出',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_demon_boss
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_fate`
-- ----------------------------
DROP TABLE IF EXISTS `logs_fate`;
CREATE TABLE `logs_fate` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `itemId` int(11) NOT NULL COMMENT '宠物ID',
  `tid` int(11) NOT NULL COMMENT '主角或宠物模板ID',
  `consume` text NOT NULL COMMENT '消耗',
  `before_fate_level` int(11) NOT NULL COMMENT '升级前天命等级',
  `before_fate_exp` int(11) NOT NULL COMMENT '升级前天命值',
  `after_fate_level` int(11) NOT NULL COMMENT '升级后天命等级',
  `after_fate_exp` int(11) NOT NULL COMMENT '升级后天命值',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_fate
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_friends`
-- ----------------------------
DROP TABLE IF EXISTS `logs_friends`;
CREATE TABLE `logs_friends` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `friend_count` int(11) NOT NULL COMMENT '好友数',
  `sns_type` int(11) NOT NULL COMMENT '1添加  2通过  3删除 4拒绝',
  `friend_id` varchar(64) NOT NULL COMMENT '好友ID',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_friends
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_fund`
-- ----------------------------
DROP TABLE IF EXISTS `logs_fund`;
CREATE TABLE `logs_fund` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(128) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(128) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `type` int(11) NOT NULL COMMENT '操作类型 1-开服基金购买 2-开服基金领取 3-全民福利领取 4领仙桃 5-摇钱树 6-VIP每日福利 7-VIP每周福利',
  `index` int(11) NOT NULL COMMENT '序号',
  `success` int(11) NOT NULL COMMENT '0失败 1成功',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_fund
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_gang`
-- ----------------------------
DROP TABLE IF EXISTS `logs_gang`;
CREATE TABLE `logs_gang` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `sns_type` int(11) NOT NULL COMMENT '1申请  2加入  3创建 4任命 5罢免 6提出 7拒绝 8解散 9普通祭天 10中级祭天 11高级祭天',
  `gang_id` int(11) NOT NULL COMMENT '帮派编号',
  `gang_name` varchar(32) NOT NULL COMMENT '帮派名称',
  `other_uid` varchar(64) NOT NULL COMMENT '被操作角色ID',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_gang
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_gm_code`
-- ----------------------------
DROP TABLE IF EXISTS `logs_gm_code`;
CREATE TABLE `logs_gm_code` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `id` int(11) NOT NULL COMMENT '序号',
  `type` int(11) NOT NULL COMMENT '礼包类型',
  `use_max` int(11) NOT NULL COMMENT '使用上限',
  `name` varchar(64) NOT NULL COMMENT '礼包名称',
  `items` text NOT NULL COMMENT '附件物品',
  `code_num` int(11) NOT NULL COMMENT '生成数量',
  `media` varchar(64) NOT NULL COMMENT '媒体',
  `beginTime` int(11) NOT NULL COMMENT '开始时间（utc时间）',
  `endTime` int(11) NOT NULL COMMENT '结束时间（utc时间）',
  `actual_code_num` int(11) NOT NULL COMMENT '实际生成数量',
  `get_reward` text NOT NULL COMMENT '生成的礼包码',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_gm_code
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_gm_operation`
-- ----------------------------
DROP TABLE IF EXISTS `logs_gm_operation`;
CREATE TABLE `logs_gm_operation` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` varchar(32) NOT NULL COMMENT '服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '游戏内角色唯一编号/ID',
  `operator_id` int(11) NOT NULL COMMENT '操作人编号',
  `cmd` int(11) NOT NULL COMMENT '消息号',
  `user_name` varchar(64) NOT NULL COMMENT '被操作人姓名',
  `content` text NOT NULL COMMENT '操作内容',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_gm_operation
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_guild_contr`
-- ----------------------------
DROP TABLE IF EXISTS `logs_guild_contr`;
CREATE TABLE `logs_guild_contr` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号/ID',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '玩家等级',
  `vip` int(11) NOT NULL DEFAULT '0' COMMENT '玩家VIP等级',
  `change_reason` varchar(32) NOT NULL DEFAULT '0' COMMENT '货币流动一级原因',
  `change_subreason` varchar(32) NOT NULL COMMENT '货币流动二级原因',
  `change_count` int(11) NOT NULL DEFAULT '0' COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动后余额',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_guild_contr
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_hero_advanced`
-- ----------------------------
DROP TABLE IF EXISTS `logs_hero_advanced`;
CREATE TABLE `logs_hero_advanced` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `hero_id` varchar(32) NOT NULL COMMENT '英雄ID',
  `hero_name` varchar(32) NOT NULL COMMENT '英雄名称',
  `hero_level` int(11) NOT NULL COMMENT '英雄等级',
  `action` varchar(32) NOT NULL COMMENT '动作：进阶／装备',
  `before_level` int(11) NOT NULL COMMENT '强化后等级',
  `after_level` int(11) NOT NULL COMMENT '强化前等级',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_hero_advanced
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_hero_foster`
-- ----------------------------
DROP TABLE IF EXISTS `logs_hero_foster`;
CREATE TABLE `logs_hero_foster` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `hero_id` varchar(32) NOT NULL COMMENT '英雄ID',
  `hero_name` varchar(32) NOT NULL COMMENT '英雄名称',
  `hero_level` int(11) NOT NULL COMMENT '英雄等级',
  `before_level` int(11) NOT NULL COMMENT '强化后等级',
  `after_level` int(11) NOT NULL COMMENT '强化前等级',
  `get_exp` bigint(20) NOT NULL COMMENT '得到经验',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_hero_foster
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_hero_skill`
-- ----------------------------
DROP TABLE IF EXISTS `logs_hero_skill`;
CREATE TABLE `logs_hero_skill` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `hero_id` varchar(32) NOT NULL COMMENT '英雄ID(升级宠物，此填宠物ID)',
  `hero_name` varchar(32) NOT NULL COMMENT '英雄名称',
  `hero_level` int(11) NOT NULL COMMENT '英雄等级',
  `skill` varchar(32) NOT NULL COMMENT '技能名称',
  `before_level` int(11) NOT NULL COMMENT '强化后等级',
  `after_level` int(11) NOT NULL COMMENT '强化前等级',
  `skill_id` int(11) NOT NULL COMMENT '技能ID',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_hero_skill
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_hero_star`
-- ----------------------------
DROP TABLE IF EXISTS `logs_hero_star`;
CREATE TABLE `logs_hero_star` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `hero_id` varchar(32) NOT NULL COMMENT '英雄ID',
  `hero_name` varchar(32) NOT NULL COMMENT '英雄名称',
  `hero_level` int(11) NOT NULL COMMENT '英雄等级',
  `before_level` int(11) NOT NULL COMMENT '升星后等级',
  `after_level` int(11) NOT NULL COMMENT '升星前等级',
  `consume` varchar(512) NOT NULL COMMENT '消耗',
  `get_reward` text NOT NULL COMMENT '获得奖励数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_hero_star
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_indiana_fight`
-- ----------------------------
DROP TABLE IF EXISTS `logs_indiana_fight`;
CREATE TABLE `logs_indiana_fight` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `type` int(11) NOT NULL COMMENT '1为单次夺宝 2为5次夺宝',
  `success` int(11) NOT NULL COMMENT '0失败 1成功',
  `get_reward` text NOT NULL COMMENT '获得的数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_indiana_fight
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_instance`
-- ----------------------------
DROP TABLE IF EXISTS `logs_instance`;
CREATE TABLE `logs_instance` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `reason_id` int(11) NOT NULL COMMENT '副本类型 ',
  `subreason_id` int(11) NOT NULL COMMENT '0',
  `battle_id` int(11) NOT NULL COMMENT '副本ID',
  `battle_diff` int(11) NOT NULL COMMENT '副本难度等级',
  `round_start` int(11) NOT NULL COMMENT '开始时间',
  `round_time` int(11) NOT NULL COMMENT '耗时',
  `round_result` int(11) NOT NULL COMMENT '结果评价 0失败 1-3 评价等级',
  `revive_num` int(11) NOT NULL COMMENT '复活次数',
  `is_auto` int(11) NOT NULL COMMENT '是否自动操作 0否/1是',
  `is_first` int(11) NOT NULL COMMENT '是否首次挑战次关卡 0否/1是',
  `get_reward` text NOT NULL COMMENT '获得奖励数据',
  `boss_tid` int(11) NOT NULL COMMENT '天魔表ID',
  `bossIndex` int(11) NOT NULL COMMENT '天魔序号',
  `is_exit` int(11) NOT NULL DEFAULT '0' COMMENT '是否退出 0否/1是',
  `is_sweep` int(11) NOT NULL DEFAULT '0' COMMENT '是否扫荡 0否/1是',
  `power` int(11) NOT NULL DEFAULT '0' COMMENT '角色战斗力',
  `pet_ids` varchar(64) NOT NULL COMMENT '携带符灵tid',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_instance
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_instance_exp`
-- ----------------------------
DROP TABLE IF EXISTS `logs_instance_exp`;
CREATE TABLE `logs_instance_exp` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `reason_id` int(11) NOT NULL COMMENT '副本类型 ',
  `subreason_id` int(11) NOT NULL COMMENT '0',
  `battle_id` int(11) NOT NULL COMMENT '副本ID',
  `battle_diff` int(11) NOT NULL COMMENT '副本难度等级',
  `round_start` datetime NOT NULL COMMENT '开始时间',
  `round_time` int(11) NOT NULL COMMENT '耗时',
  `round_result` int(11) NOT NULL COMMENT '结果评价 0失败 1-3 评价等级',
  `revive_num` int(11) NOT NULL COMMENT '复活次数',
  `is_auto` bit(1) NOT NULL COMMENT '是否自动操作 0否/1是',
  `is_first` bit(1) NOT NULL COMMENT '是否首次挑战次关卡 0否/1是',
  `get_reward` varchar(512) NOT NULL COMMENT '获得奖励数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_instance_exp
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_instance_mj`
-- ----------------------------
DROP TABLE IF EXISTS `logs_instance_mj`;
CREATE TABLE `logs_instance_mj` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `reason_id` int(11) NOT NULL COMMENT '副本类型 ',
  `subreason_id` int(11) NOT NULL COMMENT '0',
  `battle_id` int(11) unsigned NOT NULL COMMENT '副本ID（仙境ID）',
  `battle_diff` int(11) NOT NULL COMMENT '副本难度等级',
  `round_start` int(11) NOT NULL COMMENT '开始时间',
  `round_time` int(11) unsigned NOT NULL COMMENT '耗时',
  `round_result` int(11) NOT NULL COMMENT '结果评价 0失败 1-3 评价等级',
  `revive_num` int(11) NOT NULL COMMENT '复活次数',
  `is_auto` int(11) NOT NULL COMMENT '是否自动操作 0否/1是',
  `is_first` int(11) NOT NULL COMMENT '是否首次挑战次关卡 0否/1是',
  `get_reward` text NOT NULL COMMENT '获得奖励数据',
  `type` int(11) NOT NULL COMMENT '操作类型 1-开始征服仙境 2-结束征服仙境 3-探索仙境 4-镇压暴乱',
  `petitemid` int(11) NOT NULL COMMENT '寻仙符灵itemid',
  `explore_type` int(11) unsigned zerofill NOT NULL COMMENT '探索方式',
  `friend_id` varchar(64) NOT NULL COMMENT '好友id',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_instance_mj
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_instance_money`
-- ----------------------------
DROP TABLE IF EXISTS `logs_instance_money`;
CREATE TABLE `logs_instance_money` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `reason_id` int(11) NOT NULL COMMENT '副本类型 ',
  `subreason_id` int(11) NOT NULL COMMENT '0',
  `battle_id` int(11) NOT NULL COMMENT '副本ID',
  `battle_diff` int(11) NOT NULL COMMENT '副本难度等级',
  `round_start` datetime NOT NULL COMMENT '开始时间',
  `round_time` int(11) NOT NULL COMMENT '耗时',
  `round_result` int(11) NOT NULL COMMENT '结果评价 0失败 1-3 评价等级',
  `revive_num` int(11) NOT NULL COMMENT '复活次数',
  `is_auto` bit(1) NOT NULL COMMENT '是否自动操作 0否/1是',
  `is_first` bit(1) NOT NULL COMMENT '是否首次挑战次关卡 0否/1是',
  `get_reward` varchar(512) NOT NULL COMMENT '获得奖励数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_instance_money
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_instance_more_reward`
-- ----------------------------
DROP TABLE IF EXISTS `logs_instance_more_reward`;
CREATE TABLE `logs_instance_more_reward` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `cost` int(11) NOT NULL COMMENT '花费钻石',
  `items` varchar(64) NOT NULL COMMENT '备选道具,使用逗号分割',
  `get_reward` varchar(512) NOT NULL COMMENT '获得奖励',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_instance_more_reward
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_integral`
-- ----------------------------
DROP TABLE IF EXISTS `logs_integral`;
CREATE TABLE `logs_integral` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号/ID',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '玩家等级',
  `vip` int(11) NOT NULL DEFAULT '0' COMMENT '玩家VIP等级',
  `change_reason` varchar(32) NOT NULL DEFAULT '0' COMMENT '货币流动一级原因',
  `change_subreason` varchar(32) NOT NULL COMMENT '货币流动二级原因',
  `change_count` int(11) NOT NULL DEFAULT '0' COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动后余额',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_integral
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_lottery_draw`
-- ----------------------------
DROP TABLE IF EXISTS `logs_lottery_draw`;
CREATE TABLE `logs_lottery_draw` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `action` varchar(32) NOT NULL COMMENT '类型：1-免费抽奖 2-普通抽奖 3-普通十连抽 4-高级抽奖 5-高级十连抽',
  `cost` int(11) NOT NULL COMMENT '消耗钻石/友情/金币数量',
  `get_reward` varchar(512) NOT NULL COMMENT '获得奖励',
  `consume` varchar(512) NOT NULL COMMENT '具体消耗',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_lottery_draw
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_mail`
-- ----------------------------
DROP TABLE IF EXISTS `logs_mail`;
CREATE TABLE `logs_mail` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `content` varchar(512) NOT NULL COMMENT '内容',
  `items` text NOT NULL COMMENT '附件',
  `type` int(11) NOT NULL COMMENT '操作类型 1-发送 2-已读 3-已删除 ',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_mail
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_mission_reward`
-- ----------------------------
DROP TABLE IF EXISTS `logs_mission_reward`;
CREATE TABLE `logs_mission_reward` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(128) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(128) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `mission_action` int(11) NOT NULL COMMENT '1点击前往 2点击领取',
  `mission_type` int(11) NOT NULL COMMENT '任务类型  1主线 2活动 3每周 4每日 5成就 6-积分宝箱',
  `mission_id` int(11) NOT NULL COMMENT '任务编号',
  `mission_name` varchar(32) NOT NULL COMMENT '任务名称',
  `mission_level` int(11) NOT NULL COMMENT '任务等级等级',
  `get_reward` text NOT NULL COMMENT '获得奖励数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_mission_reward
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_online_info`
-- ----------------------------
DROP TABLE IF EXISTS `logs_online_info`;
CREATE TABLE `logs_online_info` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `event_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '(必填)游戏内角色唯一编号/ID',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_online_info
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_online_users`
-- ----------------------------
DROP TABLE IF EXISTS `logs_online_users`;
CREATE TABLE `logs_online_users` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '统计时间',
  `server_id` int(11) NOT NULL DEFAULT '0',
  `channel` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道名称',
  `count_id` int(11) NOT NULL COMMENT '在线用户统计执行编号，一次统计不同渠道使用相同执行编号',
  `user_count` int(11) NOT NULL DEFAULT '0' COMMENT '在线用户数',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_online_users
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_pet_upgrade`
-- ----------------------------
DROP TABLE IF EXISTS `logs_pet_upgrade`;
CREATE TABLE `logs_pet_upgrade` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `itemId` int(11) NOT NULL COMMENT '宠物流水ID',
  `tid` int(11) NOT NULL COMMENT '宠物ID',
  `consume` text NOT NULL COMMENT '消耗',
  `before_exp` bigint(20) NOT NULL COMMENT '升级前经验',
  `after_exp` bigint(20) NOT NULL COMMENT '升级后经验',
  `before_level` bigint(20) NOT NULL COMMENT '动作前等级',
  `after_level` bigint(20) NOT NULL COMMENT '到达等级',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_pet_upgrade
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_prestige`
-- ----------------------------
DROP TABLE IF EXISTS `logs_prestige`;
CREATE TABLE `logs_prestige` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号/ID',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '玩家等级',
  `vip` int(11) NOT NULL DEFAULT '0' COMMENT '玩家VIP等级',
  `change_reason` varchar(32) NOT NULL DEFAULT '0' COMMENT '货币流动一级原因',
  `change_subreason` varchar(32) NOT NULL COMMENT '货币流动二级原因',
  `change_count` int(11) NOT NULL DEFAULT '0' COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动后余额',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_prestige
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_recover`
-- ----------------------------
DROP TABLE IF EXISTS `logs_recover`;
CREATE TABLE `logs_recover` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `type` int(11) NOT NULL COMMENT '1-宠物分解 2-宠物重生 3-装备分解 4-法器重生 5-法宝合成',
  `consume` text NOT NULL COMMENT '消耗',
  `get_reward` text NOT NULL COMMENT '获得的数据',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_recover
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_reputation`
-- ----------------------------
DROP TABLE IF EXISTS `logs_reputation`;
CREATE TABLE `logs_reputation` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号/ID',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '玩家等级',
  `vip` int(11) NOT NULL DEFAULT '0' COMMENT '玩家VIP等级',
  `change_reason` varchar(32) NOT NULL DEFAULT '0' COMMENT '货币流动一级原因',
  `change_subreason` varchar(32) NOT NULL COMMENT '货币流动二级原因',
  `change_count` int(11) NOT NULL DEFAULT '0' COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动后余额',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_reputation
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_sign`
-- ----------------------------
DROP TABLE IF EXISTS `logs_sign`;
CREATE TABLE `logs_sign` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `character_level` int(11) NOT NULL COMMENT '角色等级',
  `sign_number` int(11) NOT NULL COMMENT '签到次数',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_sign
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_soulpoint`
-- ----------------------------
DROP TABLE IF EXISTS `logs_soulpoint`;
CREATE TABLE `logs_soulpoint` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号/ID',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '玩家等级',
  `vip` int(11) NOT NULL DEFAULT '0' COMMENT '玩家VIP等级',
  `change_reason` varchar(32) NOT NULL DEFAULT '0' COMMENT '货币流动一级原因',
  `change_subreason` varchar(32) NOT NULL COMMENT '货币流动二级原因',
  `change_count` int(11) NOT NULL DEFAULT '0' COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动后余额',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_soulpoint
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_stamina`
-- ----------------------------
DROP TABLE IF EXISTS `logs_stamina`;
CREATE TABLE `logs_stamina` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '游戏事件的时间',
  `server_id` int(11) NOT NULL DEFAULT '0' COMMENT '服务器编号',
  `channel_id` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内角色唯一编号/ID',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '玩家等级',
  `vip` int(11) NOT NULL DEFAULT '0' COMMENT '玩家VIP等级',
  `change_reason` varchar(32) NOT NULL DEFAULT '0' COMMENT '货币流动一级原因',
  `change_subreason` varchar(32) NOT NULL COMMENT '货币流动二级原因',
  `change_count` int(11) NOT NULL DEFAULT '0' COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '变动后余额',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_stamina
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_strengthen_equip`
-- ----------------------------
DROP TABLE IF EXISTS `logs_strengthen_equip`;
CREATE TABLE `logs_strengthen_equip` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `type` int(11) NOT NULL COMMENT '操作类型 1-强化装备 2-精炼装备 3-强化法器 4-精炼法器 5-时装强化 6-时装重铸',
  `itemId` int(11) NOT NULL COMMENT '物品流水ID',
  `tid` int(11) NOT NULL COMMENT '物品ID',
  `upgrade_level` int(11) NOT NULL COMMENT '操作后的的等级数',
  `stren_times` int(11) NOT NULL COMMENT '请求强化的次数',
  `consume` text NOT NULL COMMENT '消耗',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_strengthen_equip
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_user_cash_charge`
-- ----------------------------
DROP TABLE IF EXISTS `logs_user_cash_charge`;
CREATE TABLE `logs_user_cash_charge` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '充值时间',
  `device_id` varchar(64) NOT NULL DEFAULT '' COMMENT '设备唯一ID',
  `server_id` int(11) NOT NULL DEFAULT '0',
  `channel` varchar(32) NOT NULL DEFAULT '' COMMENT '充值支付渠道名称',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '',
  `character_name` varchar(64) NOT NULL DEFAULT '',
  `level` int(11) NOT NULL DEFAULT '0',
  `vip` int(11) NOT NULL DEFAULT '1',
  `cash_amount` int(11) NOT NULL DEFAULT '0' COMMENT '充值金额单位(人民币元)',
  `yuanbao_amount` int(11) NOT NULL DEFAULT '0' COMMENT '兑换元宝数量',
  `order_id` varchar(128) NOT NULL DEFAULT '' COMMENT '订单编号',
  `channel_order_id` varchar(128) DEFAULT '',
  `is_first` int(11) DEFAULT '0',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_user_cash_charge
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_user_create`
-- ----------------------------
DROP TABLE IF EXISTS `logs_user_create`;
CREATE TABLE `logs_user_create` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数据主键',
  `event_time` datetime NOT NULL COMMENT '用户创建日期',
  `device_id` varchar(64) DEFAULT NULL COMMENT '设备唯一编号',
  `channel_user_id` varchar(64) DEFAULT '' COMMENT '渠道用户编号/ID',
  `server_id` int(11) NOT NULL DEFAULT '0',
  `channel` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道名称',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `client_version` varchar(32) DEFAULT '',
  `system_software` text,
  `system_hardware` text,
  `ip` varchar(32) DEFAULT '',
  `mac` varchar(32) DEFAULT '',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_user_create
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_user_item_change`
-- ----------------------------
DROP TABLE IF EXISTS `logs_user_item_change`;
CREATE TABLE `logs_user_item_change` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `event_time` datetime NOT NULL,
  `server_id` int(11) DEFAULT NULL,
  `channel` varchar(32) NOT NULL DEFAULT '0',
  `user_id` varchar(64) NOT NULL,
  `character_id` varchar(64) NOT NULL DEFAULT 'NULL',
  `level` int(11) NOT NULL DEFAULT '0',
  `vip` int(11) NOT NULL DEFAULT '0',
  `item_type` int(11) NOT NULL DEFAULT '0',
  `item_id` int(11) NOT NULL DEFAULT '0',
  `item_name` varchar(64) NOT NULL,
  `item_count` int(11) NOT NULL DEFAULT '0',
  `after_count` int(11) NOT NULL DEFAULT '0',
  `change_reason` varchar(32) NOT NULL DEFAULT '0',
  `change_subreason` varchar(32) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT '0',
  `money_type` int(11) NOT NULL DEFAULT '0',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`log_id`),
  KEY `idx_luic_event_time` (`event_time`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_user_item_change
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_user_login`
-- ----------------------------
DROP TABLE IF EXISTS `logs_user_login`;
CREATE TABLE `logs_user_login` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '用户账号登录时间',
  `device_id` varchar(64) NOT NULL DEFAULT '',
  `server_id` int(11) NOT NULL,
  `channel` varchar(32) NOT NULL DEFAULT '0' COMMENT '渠道名称',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `ip` varchar(32) NOT NULL DEFAULT '' COMMENT '客户端IP地址',
  `mac` varchar(32) DEFAULT '',
  `level` int(11) NOT NULL DEFAULT '0',
  `client_version` varchar(32) DEFAULT '',
  `system_software` text,
  `system_hardware` text,
  `is_wifi` int(11) NOT NULL DEFAULT '0' COMMENT '是否是wifi(1是0不是)',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_user_login
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_user_logout`
-- ----------------------------
DROP TABLE IF EXISTS `logs_user_logout`;
CREATE TABLE `logs_user_logout` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '用户账号登出时间',
  `server_id` int(11) NOT NULL DEFAULT '0',
  `channel` varchar(32) NOT NULL DEFAULT '' COMMENT '渠道名称',
  `device_id` varchar(64) NOT NULL DEFAULT '',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '',
  `online_time` bigint(20) NOT NULL DEFAULT '0',
  `login_time` datetime NOT NULL,
  `level` int(11) NOT NULL DEFAULT '0',
  `client_version` varchar(32) DEFAULT '',
  `system_software` text,
  `system_hardware` text,
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_user_logout
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_user_money_change`
-- ----------------------------
DROP TABLE IF EXISTS `logs_user_money_change`;
CREATE TABLE `logs_user_money_change` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) DEFAULT '0',
  `channel` varchar(32) NOT NULL DEFAULT '' COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL DEFAULT '' COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL DEFAULT '',
  `level` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)玩家等级',
  `vip` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)玩家VIP等级',
  `change_reason` varchar(32) NOT NULL DEFAULT '0' COMMENT '(必填)货币流动一级原因iReasonType',
  `change_subreason` varchar(32) DEFAULT NULL COMMENT '(可选)货币流动二级原因',
  `change_count` int(11) NOT NULL DEFAULT '0' COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)变动后余额',
  `money_type` int(11) NOT NULL DEFAULT '0' COMMENT '钱的类型 金币0/元宝1',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_user_money_change
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_user_yuanbao_change`
-- ----------------------------
DROP TABLE IF EXISTS `logs_user_yuanbao_change`;
CREATE TABLE `logs_user_yuanbao_change` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) DEFAULT NULL,
  `channel` varchar(32) NOT NULL DEFAULT '0' COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL,
  `level` int(11) DEFAULT '0' COMMENT '(必填)玩家等级',
  `vip` int(11) DEFAULT '0' COMMENT '(必填)玩家VIP等级',
  `change_reason` varchar(11) NOT NULL DEFAULT '0' COMMENT '(必填)货币流动一级原因iReasonType',
  `change_subreason` varchar(11) DEFAULT NULL COMMENT '(可选)货币流动二级原因',
  `change_count` int(11) DEFAULT NULL COMMENT '数量列 如:商品数量',
  `change_amount` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)变动金额',
  `before_balance` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)变动前余额',
  `after_balance` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)变动后余额',
  `add_or_reduce` int(11) NOT NULL DEFAULT '0' COMMENT '(必填)增加 0/减少 1',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_user_yuanbao_change
-- ----------------------------

-- ----------------------------
-- Table structure for `logs_world_chat`
-- ----------------------------
DROP TABLE IF EXISTS `logs_world_chat`;
CREATE TABLE `logs_world_chat` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志表自增数字主键',
  `event_time` datetime NOT NULL COMMENT '(必填)游戏事件的时间',
  `server_id` int(11) NOT NULL COMMENT '(必填)服务器编号',
  `channel_id` varchar(32) NOT NULL COMMENT '(必填)渠道编号',
  `user_id` varchar(64) NOT NULL COMMENT '(必填)游戏内用户唯一编号/ID',
  `character_id` varchar(64) NOT NULL COMMENT '(必填)游戏内角色唯一编号/ID',
  `content` text NOT NULL COMMENT '聊天内容',
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of logs_world_chat
-- ----------------------------
