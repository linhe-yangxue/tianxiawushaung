------------------------------------基础函数--------begin---------------------------------------------------------
mw,mh = getScreenSize();
mSleep(100);
scw = mw/1080;
sch = mh/1920;
toast("is:"..scw..sch);

function isColor(x,y,c,s)
    local fl,abs = math.floor,math.abs
    s = fl(0xff*(100-s)*0.01)
    local r,g,b = fl(c/0x10000),fl(c%0x10000/0x100),fl(c%0x100)
    local rr,gg,bb = getColorRGB(x,y)
    if abs(r-rr)<s and abs(g-gg)<s and abs(b-bb)<s then
        return true;
	else
		return false;
    end
end

function isThreePoint(color1,color2,color3)
	-- body
	keepScreen(true);
	if  isColor( 1, 0, color1, 90) and isColor( 2, 0, color2, 90) and isColor( 3, 0, color3, 90) then
		keepScreen(false);
		return true;
	else
		keepScreen(false);
		return false;
	end
end

function onClick(x,y)
	-- body
	touchDown(1, x * scw, y * sch);
	mSleep(50);
	touchUp(1, x* scw, y * sch);
end

function skillAct()
	-- body
	onClick( 1470, 950);
	mSleep(1000);
	onClick( 1640, 950);
	mSleep(1000);
	onClick( 1810, 950);
end

function AutoActActive()
	-- body
	onClick( 1800, 770);
end

function sendMail()
	-- body
	mSleep(1000);
	onClick( 900, 920);
	toast("戳输入框");
	mSleep(1000);
	for var = 1,30 do
		os.execute("input keyevent 22");
		mSleep(200);
		os.execute("input keyevent 67");
		mSleep(200);
	end
	mSleep(200);
	os.execute("input keyevent 21");
	mSleep(100);
	inputText("1000011*4000000,1000001*99999,1000002*999999");
	mSleep(2000);
	onClick( 0, 0);
	mSleep(2000);
	while (true) do
	-- body
		if isColor(1400*scw, 910*sch, 0x9c554a, 80) then
			toast("已关闭输入法");
			break;
		else		
			mSleep(1000);
			toast("等待关闭输入法");
		end
	end
end
------------------------------------基础函数--------end---------------------------------------------------------
--============================================================================================================--
------------------------------------界面确定--------begin-------------------------------------------------------
function witchInterface()
	-- body
	mIndex = 0;--窗口代号
	--mw,mh = getScreenSize();
	mSleep(500);
	--scw = mw/1080;
	--sch = mh/1920;
	keepScreen(true);
	--是否在战斗中1
	if isThreePoint( 0xffffff, 0xffffff, 0x00ffff) then
		--toast("正在战斗");
		--mSleep(1000);
		keepScreen(false);
		--witchInterface();
		mIndex = 1;
		return mIndex;
	
	
	--是否战斗胜利139
	elseif isThreePoint( 0x008000, 0x008000, 0x008000) then
		keepScreen(false);
		mIndex = 100;
		return mIndex;
	
	--是否战斗失败140
	elseif isThreePoint( 0xff0000, 0xff0000, 0xff0000) then
		keepScreen(false);
		mIndex = 101;
		return mIndex;
	
	
	--是否在公告界面2
	elseif isThreePoint( 0xffffff, 0xffffff, 0x000000) then
		--toast("公告界面");
		--mSleep(2000);
		--onClick(960*scw, 940*sch);
		keepScreen(false);
		mIndex = 2;
		return mIndex;                   
	
	--是否在登录界面3
	elseif isThreePoint( 0xffffff, 0xffffff, 0xffffff) then
		--toast("登录界面");
		--mSleep(2000);
		--onClick(960*scw, 910*sch);
		keepScreen(false);
		mIndex = 3;
		return mIndex;
		
	--是否在选服界面4
	elseif isThreePoint( 0xffffff, 0xffffff, 0xffff00) then
		--toast("选服界面");
		--mSleep(2000);
		--onClick(1610*scw, 100*sch);
		--toast("登录界面");
		--mSleep(2000);
		--onClick(960*scw, 910*sch);
		--keepScreen(false);
		keepScreen(false);
		mIndex = 4;
		return mIndex;
	
	--是否有新手引导信息5
	elseif isThreePoint( 0xffffff, 0xffffff, 0x0000ff) then
		--toast("新手引导信息");
		--mSleep(1000);
		--onClick(980*scw, 1000*sch);
		keepScreen(false);
		mIndex = 5;
		return mIndex;
	
	--是否在创建人物窗口6
	elseif isThreePoint( 0xffffff, 0xffffff, 0xff0000) then
		keepScreen(false);
		mIndex = 6;
		return mIndex;
	
	--是否有手指引7
	elseif isThreePoint( 0xffffff, 0xffffff, 0x800080) then
		keepScreen(false);
		mIndex = 7;
		return mIndex;
	
	--是否在冒险关卡选择界面8
	elseif isThreePoint( 0xffffff, 0xffffff, 0x008000) then
		keepScreen(false);
		mIndex = 8;
		return mIndex;
	
	--是否在出战信息窗口9
	elseif isThreePoint( 0xffffff, 0xffffff, 0xff1493) then
		keepScreen(false);
		mIndex = 9;
		return mIndex;
	
	--是否在抽卡界面10
	elseif isThreePoint( 0xffffff, 0xffffff, 0x808080) then
		keepScreen(false);
		mIndex = 10;
		return mIndex;
	
	--是否在抽卡结果界面11
	elseif isThreePoint( 0xffffff, 0x000000, 0xffffff) then
		keepScreen(false);
		mIndex = 11;
		return mIndex;
	
	--是否在队伍信息窗口12
	elseif isThreePoint( 0xffffff, 0x000000, 0x000000) then
		keepScreen(false);
		mIndex = 12;
		return mIndex;
	
	--是否在Loding界面13
	elseif isThreePoint( 0xffffff, 0x000000, 0xffff00) then
		keepScreen(false);
		mIndex = 13;
		return mIndex;
	
	--是否在新功能开启弹窗14
	elseif isThreePoint( 0xffffff, 0x000000, 0x0000ff) then
		keepScreen(false);
		mIndex = 14;
		return mIndex;
	
	--是否在符灵列表窗口15
	elseif isThreePoint( 0xffffff, 0x000000, 0x00ffff) then
		keepScreen(false);
		mIndex = 15;
		return mIndex;
	
	--是否在关卡奖励界面16
	elseif isThreePoint( 0xffffff, 0x000000, 0xff0000) then
		keepScreen(false);
		mIndex = 16;
		return mIndex;
	
	--是否在天命升级成功界面17
	elseif isThreePoint( 0xffffff, 0x000000, 0x800080) then
		keepScreen(false);
		mIndex = 17;
		return mIndex;
	
	--是否在任务奖励领取窗口18
	elseif isThreePoint( 0xffffff, 0x000000, 0x008000) then
		keepScreen(false);
		mIndex = 18;
		return mIndex;
	
	--是否在背包窗口(非主界面背包)19
	elseif isThreePoint( 0xffffff, 0x000000, 0xff1493) then
		keepScreen(false);
		mIndex = 19;
		return mIndex;
	
	--是否在发邮件窗口20
	elseif isThreePoint( 0xffffff, 0x000000, 0x808080) then
		keepScreen(false);
		mIndex = 20;
		return mIndex;
	
	--是否在分解窗口21
	elseif isThreePoint( 0xffffff, 0xffff00, 0xffffff) then
		keepScreen(false);
		mIndex = 21;
		return mIndex;
	
	--是否在登陆注册选项窗口22
	elseif isThreePoint( 0xffffff, 0xffff00, 0x000000) then
		keepScreen(false);
		mIndex = 22;
		return mIndex;
	
	--是否在领邮件窗口23
	elseif isThreePoint( 0xffffff, 0xffff00, 0xffff00) then
		keepScreen(false);
		mIndex = 23;
		return mIndex;
	
	--是否在SDK登录窗口24
	elseif isThreePoint( 0xffffff, 0xffff00, 0x0000ff) then
		keepScreen(false);
		mIndex = 24;
		return mIndex;
	
	--是否在好友界面25
	elseif isThreePoint( 0xffffff, 0xffff00, 0xff0000) then
		keepScreen(false);
		mIndex = 25;
		return mIndex;
	
	--是否在主界面排行26
	elseif isThreePoint( 0xffffff, 0xffff00, 0x800080) then
		keepScreen(false);
		mIndex = 26;
		return mIndex;
	
	--是否在主界面27
	elseif isThreePoint( 0xffffff, 0xffff00, 0x008000) then
		keepScreen(false);
		mIndex = 27;
		return mIndex;
	
	--是否在神秘商店28
	elseif isThreePoint( 0xffffff, 0xffff00, 0xff1493) then
		keepScreen(false);
		mIndex = 28;
		return mIndex;
	
	
	--是否在换号选区登录界面29
	elseif isThreePoint( 0xffffff, 0xffff00, 0x808080) then
		keepScreen(false);
		mIndex = 29;
		return mIndex;
	
	--[[
	--是否在充值界面30
	elseif isThreePoint( 0xffffff, 0x0000ff, 0xffffff) then
		keepScreen(false);
		mIndex = 30;
		return mIndex;
	
	]]--
	--是否在历练界面31
	elseif isThreePoint( 0xffffff, 0x0000ff, 0x000000) then
		keepScreen(false);
		mIndex = 31;
		return mIndex;
	
	--是否在竞技场界面32
	elseif isThreePoint( 0xffffff, 0x0000ff, 0xffff00) then
		keepScreen(false);
		mIndex = 32;
		return mIndex;
	
	--是否在竞技场排行33
	elseif isThreePoint( 0xffffff, 0x0000ff, 0x0000ff) then
		keepScreen(false);
		mIndex = 33;
		return mIndex;
	
	--是否在访问好友窗口34
	elseif isThreePoint( 0xffffff, 0x0000ff, 0x00ffff) then
		keepScreen(false);
		mIndex = 34;
		return mIndex;
	
	--[[
	--是否在竞技场商店35
	elseif isThreePoint( 0xffffff, 0x0000ff, 0xff0000) then
		keepScreen(false);
		mIndex = 35;
		return mIndex;
	
	]]--
	--是否在夺宝界面36
	elseif isThreePoint( 0xffffff, 0x0000ff, 0x800080) then
		keepScreen(false);
		mIndex = 36;
		return mIndex;
	
	--是否在爬塔界面(群魔乱舞)37
	elseif isThreePoint( 0xffffff, 0x0000ff, 0x008000) then
		keepScreen(false);
		mIndex = 37;
		return mIndex;
	
	--是否在爬塔排行(群魔乱舞)38
	elseif isThreePoint( 0xffffff, 0x0000ff, 0xff1493) then
		keepScreen(false);
		mIndex = 38;
		return mIndex;
	
	--是否在威名商店(群魔乱舞)39
	elseif isThreePoint( 0xffffff, 0x0000ff, 0x808080) then
		keepScreen(false);
		mIndex = 39;
		return mIndex;
	
	--是否在公会列表界面40
	elseif isThreePoint( 0xffffff, 0x00ffff, 0xffffff) then
		keepScreen(false);
		mIndex = 40;
		return mIndex;
	
	--是否在公会创建界面41
	elseif isThreePoint( 0xffffff, 0x00ffff, 0x000000) then
		keepScreen(false);
		mIndex = 41;
		return mIndex;
	
	--是否在公会界面42
	elseif isThreePoint( 0xffffff, 0x00ffff, 0xffff00) then
		keepScreen(false);
		mIndex = 42;
		return mIndex;
	
	--是否在公会动态消息盒43
	elseif isThreePoint( 0xffffff, 0x00ffff, 0x0000ff) then
		keepScreen(false);
		mIndex = 43;
		return mIndex;
	
	--是否在天魔界面44
	elseif isThreePoint( 0xffffff, 0x00ffff, 0x00ffff) then
		keepScreen(false);
		mIndex = 44;
		return mIndex;
	
	--[[
	--是否在魔鳞商店45
	elseif isThreePoint( 0xffffff, 0x00ffff, 0xff0000) then
		keepScreen(false);
		mIndex = 45;
		return mIndex;
	
	]]--
	--是否在图鉴46
	elseif isThreePoint( 0xffffff, 0x00ffff, 0x800080) then
		keepScreen(false);
		mIndex = 46;
		return mIndex;
	
	--是否在图鉴符灵资料界面47
	elseif isThreePoint( 0xffffff, 0x00ffff, 0x008000) then
		keepScreen(false);
		mIndex = 47;
		return mIndex;
	
	--是否在用户协议界面48
	elseif isThreePoint( 0xffffff, 0x00ffff, 0xff1493) then
		keepScreen(false);
		mIndex = 48;
		return mIndex;
	
	--是否在队伍界面，升级界面49
	elseif isThreePoint( 0xffffff, 0x00ffff, 0x808080) then
		keepScreen(false);
		mIndex = 49;
		return mIndex;
	
	--是否在队伍界面，突破窗口50
	elseif isThreePoint( 0xffffff, 0xff0000, 0xffffff) then
		keepScreen(false);
		mIndex = 50;
		return mIndex;
	
	--是否在突破成功窗口51
	elseif isThreePoint( 0xffffff, 0xff0000, 0x000000) then
		keepScreen(false);
		mIndex = 51;
		return mIndex;
	
	--是否在角色信息窗口52
	elseif isThreePoint( 0xffffff, 0xff0000, 0xffff00) then
		keepScreen(false);
		mIndex = 52;
		return mIndex;
	
	--是否在巅峰挑战胜利窗口53
	elseif isThreePoint( 0xffffff, 0xff0000, 0x0000ff) then
		keepScreen(false);
		mIndex = 53;
		return mIndex;
	
	--是否在巅峰挑战失败窗口54
	elseif isThreePoint( 0xffffff, 0xff0000, 0x00ffff) then
		keepScreen(false);
		mIndex = 54;
		return mIndex;
	
	--是否在巅峰挑战结果窗口55
	elseif isThreePoint( 0xffffff, 0xff0000, 0xff0000) then
		keepScreen(false);
		mIndex = 55;
		return mIndex;
	
	--是否在巅峰挑战领奖三选一窗口56
	elseif isThreePoint( 0xffffff, 0xff0000, 0x800080) then
		keepScreen(false);
		mIndex = 56;
		return mIndex;
	
	--是否在竞技场声望商店57
	elseif isThreePoint( 0xffffff, 0xff0000, 0x008000) then
		keepScreen(false);
		mIndex = 57;
		return mIndex;
	
	--是否在错误或警告提示框58
	elseif isThreePoint( 0xffffff, 0xff0000, 0xff1493) then
		keepScreen(false);
		mIndex = 58;
		return mIndex;
	
	--是否在声望商店奖励或购买成功后弹窗59
	elseif isThreePoint( 0xffffff, 0xff0000, 0x808080) then
		keepScreen(false);
		mIndex = 59;
		return mIndex;
	
	--是否在竞技场记录窗口60
	elseif isThreePoint( 0xffffff, 0x800080, 0xffffff) then
		keepScreen(false);
		mIndex = 60;
		return mIndex;
	
	--是否在竞技场规则窗口61
	elseif isThreePoint( 0xffffff, 0x800080, 0x000000) then
		keepScreen(false);
		mIndex = 61;
		return mIndex;
	
	--是否在夺宝玩家界面62
	elseif isThreePoint( 0xffffff, 0x800080, 0xffff00) then
		keepScreen(false);
		mIndex = 62;
		return mIndex;
	
	--是否在夺宝结算奖励界面63
	elseif isThreePoint( 0xffffff, 0x800080, 0x800080) then
		keepScreen(false);
		mIndex = 63;
		return mIndex;
	
	--是否在夺宝失败界面64
	elseif isThreePoint( 0xffffff, 0x800080, 0x008000) then
		keepScreen(false);
		mIndex = 64;
		return mIndex;
	
	--是否在夺宝胜利界面65
	elseif isThreePoint( 0xffffff, 0x800080, 0xff1493) then
		keepScreen(false);
		mIndex = 65;
		return mIndex;
	
	--是否在法器详情界面66
	elseif isThreePoint( 0xffffff, 0x800080, 0x808080) then
		keepScreen(false);
		mIndex = 66;
		return mIndex;
	
	--是否在夺宝记录窗口67
	elseif isThreePoint( 0xffffff, 0x008000, 0xffffff) then
		keepScreen(false);
		mIndex = 67;
		return mIndex;
	
	--是否在夺宝免战牌选择界面68
	elseif isThreePoint( 0xffffff, 0x008000, 0x000000) then
		keepScreen(false);
		mIndex = 68;
		return mIndex;
	
	--是否在夺宝免战牌购买界面69
	elseif isThreePoint( 0xffffff, 0x008000, 0xffff00) then
		keepScreen(false);
		mIndex = 69;
		return mIndex;
	
	--是否在星相界面70
	elseif isThreePoint( 0xffffff, 0x008000, 0x0000ff) then
		keepScreen(false);
		mIndex = 70;
		return mIndex;
	
	--是否在星相奖励界面71
	elseif isThreePoint( 0xffffff, 0x008000, 0x00ffff) then
		keepScreen(false);
		mIndex = 71;
		return mIndex;
	
	--是否在群魔乱舞战斗胜利界面72
	elseif isThreePoint( 0xffffff, 0x008000, 0xff0000) then
		keepScreen(false);
		mIndex = 72;
		return mIndex;
	
	--是否在群魔乱舞关卡难度选择窗口73
	elseif isThreePoint( 0xffffff, 0x008000, 0x800080) then
		keepScreen(false);
		mIndex = 73;
		return mIndex;
	
	--是否在群魔乱舞战斗失败界面74
	elseif isThreePoint( 0xffffff, 0x008000, 0x008000) then
		keepScreen(false);
		mIndex = 74;
		return mIndex;
	
	--是否在群魔乱舞奖品购买界面(失败打折)75
	elseif isThreePoint( 0xffffff, 0x008000, 0xff1493) then
		keepScreen(false);
		mIndex = 75;
		return mIndex;
	
	--是否在群魔乱舞关卡全部结束或战败后窗口76
	elseif isThreePoint( 0xffffff, 0x008000, 0x808080) then
		keepScreen(false);
		mIndex = 76;
		return mIndex;
	
	--是否在天命界面77
	elseif isThreePoint( 0xffffff, 0xff1493, 0xffffff) then
		keepScreen(false);
		mIndex = 77;
		return mIndex;
	
	--是否在队伍天命等的入口78
	elseif isThreePoint( 0xffffff, 0xff1493, 0x000000) then
		keepScreen(false);
		mIndex = 78;
		return mIndex;
	
	--是否在技能升级窗口79
	elseif isThreePoint( 0xffffff, 0xff1493, 0xffff00) then
		keepScreen(false);
		mIndex = 79;
		return mIndex;
	
	--是否在宠物背包窗口80
	elseif isThreePoint( 0xffffff, 0xff1493, 0x0000ff) then
		keepScreen(false);
		mIndex = 80;
		return mIndex;
	
	--是否在(带图)提示框81
	elseif isThreePoint( 0xffffff, 0xff1493, 0x00ffff) then
		keepScreen(false);
		mIndex = 81;
		return mIndex;
	
	--是否在宠物碎片信息窗口82
	elseif isThreePoint( 0xffffff, 0xff1493, 0xff0000) then
		keepScreen(false);
		mIndex = 82;
		return mIndex;
	
	--是否在装备碎片信息窗口83
	elseif isThreePoint( 0xffffff, 0xff1493, 0x800080) then
		keepScreen(false);
		mIndex = 83;
		return mIndex;
	
	--是否在法器碎片信息窗口84
	elseif isThreePoint( 0xffffff, 0xff1493, 0x008000) then
		keepScreen(false);
		mIndex = 84;
		return mIndex;
	
	--是否在宠物分解窗口85
	elseif isThreePoint( 0xffffff, 0xff1493, 0xff1493) then
		keepScreen(false);
		mIndex = 85;
		return mIndex;
	
	--是否在装备分解窗口86
	elseif isThreePoint( 0xffffff, 0xff1493, 0x808080) then
		keepScreen(false);
		mIndex = 86;
		return mIndex;
	
	--是否在宠物重生窗口87
	elseif isThreePoint( 0xffffff, 0x808080, 0xffffff) then
		keepScreen(false);
		mIndex = 87;
		return mIndex;
	
	--是否在法器重铸界面88
	elseif isThreePoint( 0xffffff, 0x808080, 0x000000) then
		keepScreen(false);
		mIndex = 88;
		return mIndex;
	
	--是否在消费品包裹窗口89
	elseif isThreePoint( 0xffffff, 0x808080, 0xffff00) then
		keepScreen(false);
		mIndex = 89;
		return mIndex;
	
	--是否在装备列表窗口90
	elseif isThreePoint( 0xffffff, 0x808080, 0x0000ff) then
		keepScreen(false);
		mIndex = 90;
		return mIndex;
	
	--是否在法器列表窗口91
	elseif isThreePoint( 0xffffff, 0x808080, 0x00ffff) then
		keepScreen(false);
		mIndex = 91;
		return mIndex;
	
	--是否在去充值提示界面92
	elseif isThreePoint( 0xffffff, 0x808080, 0xff0000) then
		keepScreen(false);
		mIndex = 92;
		return mIndex;
	
	--是否在宠物碎片信息窗口93
	elseif isThreePoint( 0xffffff, 0x808080, 0x800080) then
		keepScreen(false);
		mIndex = 93;
		return mIndex;
	
	--是否在符灵碎片背包94
	elseif isThreePoint( 0xffffff, 0x808080, 0x008000) then
		keepScreen(false);
		mIndex = 94;
		return mIndex;
	
	--是否在装备强化窗口95
	elseif isThreePoint( 0xffffff, 0x808080, 0xff1493) then
		keepScreen(false);
		mIndex = 95;
		return mIndex;
	
	--是否在主界面等级排行96
	elseif isThreePoint( 0xffffff, 0x808080, 0x808080) then
		keepScreen(false);
		mIndex = 96;
		return mIndex;
	
	--是否在活动界面排行97
	elseif isThreePoint( 0x000000, 0xffffff, 0xffffff) then
		keepScreen(false);
		mIndex = 97;
		return mIndex;
	
	--是否在排名活动奖励说明98
	elseif isThreePoint( 0x000000, 0xffffff, 0x000000) then
		keepScreen(false);
		mIndex = 98;
		return mIndex;
	
	--是否在七日狂欢99
	elseif isThreePoint( 0x000000, 0xffffff, 0xFFFF00) then
		keepScreen(false);
		mIndex = 99;
		return mIndex;
	
	--是否在任务成就窗口100
	elseif isThreePoint( 0x000000, 0xffffff, 0x0000ff) then
		keepScreen(false);
		mIndex = 100;
		return mIndex;
	
	--是否在积分奖励窗口(日常任务)101
	elseif isThreePoint( 0x000000, 0xffffff, 0x00ffff) then
		keepScreen(false);
		mIndex = 101;
		return mIndex;
	
	--是否在奖励弹窗(自动消失)102
	elseif isThreePoint( 0x000000, 0xffffff, 0xff0000) then
		keepScreen(false);
		mIndex = 102;
		return mIndex;
	
	--是否在获取途径窗口103
	elseif isThreePoint( 0x000000, 0xffffff, 0x800080) then
		keepScreen(false);
		mIndex = 103;
		return mIndex;
	
	--是否在首充礼包104
	elseif isThreePoint( 0x000000, 0xffffff, 0x008000) then
		keepScreen(false);
		mIndex = 104;
		return mIndex;
	
	--是否在每日签到105
	elseif isThreePoint( 0x000000, 0xffffff, 0xff1439) then
		keepScreen(false);
		mIndex = 105;
		return mIndex;
	
	--是否在VIP礼包106
	elseif isThreePoint( 0x000000, 0xffffff, 0x808080) then
		keepScreen(false);
		mIndex = 106;
		return mIndex;
	
	--是否在开服基金107
	elseif isThreePoint( 0x000000, 0x000000, 0xffffff) then
		keepScreen(false);
		mIndex = 107;
		return mIndex;
	
	--是否在幸运抽牌108
	elseif isThreePoint( 0x000000, 0x000000, 0xffff00) then
		keepScreen(false);
		mIndex = 108;
		return mIndex;
	
	--是否在弹窗获得奖励时的弹窗109
	elseif isThreePoint( 0x000000, 0x000000, 0x0000ff) then
		keepScreen(false);
		mIndex = 109;
		return mIndex;
	
	--是否在月卡110
	elseif isThreePoint( 0x000000, 0x000000, 0x00ffff) then
		keepScreen(false);
		mIndex = 110;
		return mIndex;
	
	--是否在摇钱树111
	elseif isThreePoint( 0x000000, 0x000000, 0xff0000) then
		keepScreen(false);
		mIndex = 111;
		return mIndex;
	
	--是否在礼品码112
	elseif isThreePoint( 0x000000, 0x000000, 0x800080) then
		keepScreen(false);
		mIndex = 112;
		return mIndex;
	
	--是否在限时抢购113
	elseif isThreePoint( 0x000000, 0x000000, 0x008000) then
		keepScreen(false);
		mIndex = 113;
		return mIndex;
	
	--是否在VIP特权、充值父窗口114
	elseif isThreePoint( 0x000000, 0x000000, 0xff1493) then
		keepScreen(false);
		mIndex = 114;
		return mIndex;
	
	--是否在VIP窗口115
	elseif isThreePoint( 0x000000, 0x000000, 0x808080) then
		keepScreen(false);
		mIndex = 115;
		return mIndex;
	
	--是否在消耗品详情窗口116
	elseif isThreePoint( 0x000000, 0xffff00, 0xffffff) then
		keepScreen(false);
		mIndex = 116;
		return mIndex;
	
	--是否在聊天窗口117
	elseif isThreePoint( 0x000000, 0xffff00, 0x000000) then
		keepScreen(false);
		mIndex = 117;
		return mIndex;
	
	--是否在日常副本主界面118
	elseif isThreePoint( 0x000000, 0xffff00, 0xffff00) then
		keepScreen(false);
		mIndex = 118;
		return mIndex;
	
	--是否在符灵探险界面119
	elseif isThreePoint( 0x000000, 0xffff00, 0x0000ff) then
		keepScreen(false);
		mIndex = 119;
		return mIndex;
	
	--是否在符灵探险好友仙境选择界面120
	elseif isThreePoint( 0x000000, 0xffff00, 0xff0000) then
		keepScreen(false);
		mIndex = 120;
		return mIndex;
	
	--是否在符灵探险操作主界面121
	elseif isThreePoint( 0x000000, 0xffff00, 0x800080) then
		keepScreen(false);
		mIndex = 121
		return mIndex;
	
	--是否在boss功勋奖励122
	elseif isThreePoint( 0x000000, 0xffff00, 0x008000) then
		keepScreen(false);
		mIndex = 122;
		return mIndex;
	
	--是否在天魔伤害排行123
	elseif isThreePoint( 0x000000, 0xffff00, 0xff1493) then
		keepScreen(false);
		mIndex = 123;
		return mIndex;
	
	--是否在天魔功勋排行124
	elseif isThreePoint( 0x000000, 0xffff00, 0x808080) then
		keepScreen(false);
		mIndex = 122;
		return mIndex;
	
	--是否在天魔奖励窗口125
	elseif isThreePoint( 0x000000, 0x0000ff, 0xffffff) then
		keepScreen(false);
		mIndex = 125;
		return mIndex;
	
	--是否在boss战斗信息窗口126
	elseif isThreePoint( 0x000000, 0x0000ff, 0x000000) then
		keepScreen(false);
		mIndex = 126;
		return mIndex;
	
	--是否在资源提示购买和使用界面127
	elseif isThreePoint( 0x000000, 0x0000ff, 0xffff00) then
		keepScreen(false);
		mIndex = 127;
		return mIndex;
	
	--是否在魔鳞商店128
	elseif isThreePoint( 0x000000, 0x0000ff, 0x0000ff) then
		keepScreen(false);
		mIndex = 128;
		return mIndex;
	
	--是否在宗门排行窗口129
	elseif isThreePoint( 0x000000, 0x0000ff, 0x00ffff) then
		keepScreen(false);
		mIndex = 129;
		return mIndex;
	
	--是否在工会商店时装130
	elseif isThreePoint( 0x000000, 0x0000ff, 0xff0000) then
		keepScreen(false);
		mIndex = 125;
		return mIndex;
	
	--是否在工会商店道具131
	elseif isThreePoint( 0x000000, 0x0000ff, 0x800080) then
		keepScreen(false);
		mIndex = 131;
		return mIndex;
	
	--是否在工会商店奖励132
	elseif isThreePoint( 0x000000, 0x0000ff, 0x008000) then
		keepScreen(false);
		mIndex = 132;
		return mIndex;
	
	--是否在工会商店限时133
	elseif isThreePoint( 0x000000, 0x0000ff, 0xff1493) then
		keepScreen(false);
		mIndex = 133;
		return mIndex;
	
	--是否在工会动态134
	elseif isThreePoint( 0x000000, 0x0000ff, 0x808080) then
		keepScreen(false);
		mIndex = 134;
		return mIndex;
	
	--是否在工会审核135
	elseif isThreePoint( 0x000000, 0x00ffff, 0xffffff) then
		keepScreen(false);
		mIndex = 135;
		return mIndex;
	
	--是否在工会战入口136
	elseif isThreePoint( 0x000000, 0x00ffff, 0x000000) then
		keepScreen(false);
		mIndex = 136;
		return mIndex;
	
	--是否在工会战准备界面137
	elseif isThreePoint( 0x000000, 0x00ffff, 0xffff00) then
		keepScreen(false);
		mIndex = 137;
		return mIndex;
	
	--是否在宠物碎片背包窗口138
	elseif isThreePoint( 0x000000, 0x00ffff, 0x00ffff) then
		keepScreen(false);
		mIndex = 138;
		return mIndex;
	
	--未找到，标记未知窗口999
	elseif isThreePoint( 0x7a7a7a, 0x7a7a7a, 0x7a7a7a) then
		keepScreen(false);
		mIndex = 999;
		return mIndex;
	
	--还是没找到
	else
		keepScreen(false);
		UnknownNum = UnknownNum + 1;
	end
end

--function end
------------------------------------界面确定--------end-------------------------------------------------------
--==========================================================================================================--
------------------------------------分组逻辑--------Begin1----------------------------------------------------
--function begin
--界面响应机制
function switch0()--流程控制
	-- body
end
function switch1()--在战斗
	-- body
	mSleep(200);
	if mActIndex == 0 then
		AutoActActive();
		mActIndex = 1;
	end
	mSleep(2000);
	skillAct();--间接自动战斗--防战斗时因为新手引导卡死
	mDianfengIndex = 1;--巅峰标志位
end
function switch2()--公告界面
	-- body
	onClick( 960, 940);
	mSleep(1000);
end
function switch3()--登录界面
	-- body
	
end
function switch4()--服务器列表
	-- body
	onClick( 1600, 100);
	mInterFaceTime = 1;
end
function switch5()--剧情内容对话框
	-- body
	onClick( 1000, 1000);
	mSleep(1000);
end
function switch6()--角色选择界面
	-- body
	onClick( 1200, 150);
	mSleep(1000);
	onClick( 1200, 400);
	mSleep(1000);
	onClick( 1200, 150);
	mSleep(1000);
	onClick( 1670, 850);
	mSleep(1000);
	onClick( 1420, 960);
end
function switch7()--小手遮罩(不定位置的戳)
	-- body
	onClick( 1350, 350);--装B战斗地图寻路
	mSleep(200);
	onClick( 1470, 950);--技能1
	mSleep(200);
	onClick( 1840, 100);--引导冒险1-2
	mSleep(200);
	onClick( 370, 710);--引导1-1
	mSleep(200);
	onClick( 770, 480);--引导1-2
	mSleep(200);
	onClick( 1350, 410);--引导1-3
	mSleep(200);
	onClick( 1250, 890);--引导开始降妖
	mSleep(200);
	onClick( 1450, 300);--引导1-1战斗寻路
	mSleep(200);
	onClick( 1430, 860);--引导下一关
	mSleep(200);
	onClick( 1800, 960);--引导任务
	mSleep(200);
	onClick( 1450, 450);--引导任务领取
	mSleep(200);
	onClick( 1620, 80);--引导关闭奖励窗口
	mSleep(200);
	onClick( 100, 50);--引导冒险返回--引导商城返回--引导队伍返回
	mSleep(200);
	onClick( 1860, 180);--引导商城
	mSleep(200);
	onClick( 1490, 900);--引导高级抽卡一次
	mSleep(200);
	onClick( 60, 1000);--引导队伍
	mSleep(200);
	onClick( 190, 480);--引导符灵站位
	mSleep(200);
	onClick( 880, 230);--引导选择符灵1
	mSleep(200);
	onClick( 1650, 230);--引导选择符灵2
	mSleep(200);
	onClick( 960, 950);--引导选符灵确定
	mSleep(200);
	onClick( 1500, 180);--引导星级宝箱1
	mSleep(200);
	onClick( 1650, 180);--引导星级宝箱2
	mSleep(200);
	onClick( 960, 650);--引导领奖励
	mSleep(200);
	onClick( 1700, 370);--引导升级
	mSleep(200);
	onClick( 1500, 350);--引导点击材料槽
	mSleep(200);
	onClick( 1680, 800);--引导点击升级
	mSleep(200);
	onClick( 1300, 280);--引导点击升级
	mSleep(200);
	onClick( 1700, 500);--引导突破
	mSleep(200);
end
function switch8()--星级宝箱
	-- body
	if mStarBoxIndex == 0 then
	mSleep(200);
	onClick( 1500, 160);
	mStarBoxIndex = mStarBoxIndex + 1;
	end
	if mStarBoxIndex == 1 then
	mSleep(200);
	onClick( 1650, 160);
	mStarBoxIndex = mStarBoxIndex + 1;
	end
	if mStarBoxIndex == 2 then
	mSleep(200);
	onClick( 1800, 160);
	mStarBoxIndex = 0;
	end
end
function switch9()
	-- body
	mSleep(200);
	onClick( 1250, 900);
end
function switch10()--抽卡ing
	-- body
	mSleep(200);
	onClick( 850, 190);
	mSleep(2000);
	onClick( 1000, 200);
	mSleep(1000);
	onClick( 100, 60);
end
function switch12()--队伍界面(return main)
	-- body  mTeamFlowControl
	--toast("in 12");
	toast(mTeamFlowControl);
	if mTeamFlowControl == 0 then
		onClick( 400, 160);
		mSleep(1000);
	end
	if mTeamFlowControl == 1 then
		onClick( 600, 160);
		mSleep(1000);
	end
	if mTeamFlowControl == 2 then
		onClick( 200, 160);
		mSleep(1000);
	end
end
function switch13()--loding界面
	-- body
	mSleep(2000);
end
function switch15()--符灵选择框
	-- body
	if mFulingBagIndex == 1 then
		onClick( 1750, 70);
		mSleep(1000);
	else
		mSleep(1000);	
		onClick( 870, 230);
		mSleep(500);
		onClick( 1360, 950);
		mSleep(2000);
		onClick( 970, 720);
		mSleep(1000);
		onClick( 1600, 960);--确定
		mFulingBagIndex = 1;
	end
end
function switch16()--星级宝箱
	-- body
	mSleep(200);
	onClick( 960, 650);
	mSleep(2000);
	onClick( 1300, 280);
end
function switch20()--发邮件
	-- body
	mSleep(1000);
	sendMail();--发邮件400W经验，99999，99999
	onClick( 1480, 920);--戳发送
	mSleep(2000);
	onClick( 1610, 100);--戳x,关闭
	mMainIndex = 7;
end
function switch22()--登录界面
	-- body
	onClick( 960, 760);--快速游戏
	mSleep(1000);
	onClick( 1130, 760);--确认快速游戏
end
function switch23()--飞书界面
	-- body
	onClick( 1670, 400);--领取
	mSleep(2000);
	onClick( 100, 60);--返回
	mMainIndex = 8;
end
function switch25()--好友界面
	-- body
	onClick( 420, 190);
	mSleep(2000);
	onClick( 1710, 450);
	mSleep(1000);
	onClick( 1000, 60);
	mMainIndex = 6;
end
function switch26()--主界面排行榜
	-- body
	onClick( 300, 400);
	mSleep(2000);
	onClick( 100, 60);
	mMainIndex = 5;
end
------------------------------------分组逻辑--------end1----------------------------------------------------
------------------------------------主流程控制--------Begin----------------------------------------------------
function switch27()--主界面
	-- body
	-- 主界面需要流程控制(后加)
	toast("mMainIndex = "..mMainIndex);
	if mMainIndex == 0 then
		toast("队伍");
		onClick( 60, 1000);
		--toast("out");
	elseif mMainIndex == 1 then
		toast("包裹");
		onClick( 220, 1000);
	elseif mMainIndex == 2 then
		toast("装备");
		onClick( 680, 1000);
		mSleep(1000);
		onClick( 300, 180);
	elseif mMainIndex == 3 then
		toast("图鉴");
		onClick( 1000, 1000);
	elseif mMainIndex == 4 then
		toast("排行榜");
		onClick( 100, 250);
	elseif mMainIndex == 5 then
		toast("好友");
		onClick( 80, 400);
	elseif mMainIndex == 6 then
		toast("发邮件");
		onClick( 1120, 1000);
	elseif mMainIndex == 7 then
		toast("飞书");
		onClick( 80, 550);
	elseif mMainIndex == 8 then
		toast("排名活动");
		onClick( 1180, 180);
	elseif mMainIndex == 9 then
		toast("星相");
		onClick( 820, 1000);
		mSleep(2000);
	elseif mMainIndex == 10 then
		toast("开服狂欢");
		onClick( 1310, 180);
	elseif mMainIndex == 11 then
		toast("任务成就")
		onClick( 1440, 180);
	elseif mMainIndex == 12 then
		toast("符灵商铺");
		onClick( 1580, 180);
	elseif mMainIndex == 13 then
		toast("活动");
		onClick( 1710, 180);
		--颜色检测问题，临时解决方案
		mSleep(1000);
		onClick( 580, 300);--领头天的50000
		mSleep(2000);
		onClick( 300, 400);--首充礼包
	elseif mMainIndex == 14 then
		toast("角色信息");
		onClick( 100, 100);
	elseif mMainIndex == 15 then
		toast("历练");
		onClick( 1650, 1000);
	elseif mMainIndex == 16 then
		toast("over");
		dialog("脚本运行结束,请查看录像！", 0);
	else
		toast("error");
	end
end
------------------------------------主流程控制--------end----------------------------------------------------
--=========================================================================================================--
------------------------------------分组逻辑--------Begin2----------------------------------------------------
function switch28()--符灵商铺
	-- body
	mSleep(200);
	if mFulingShopIndex == 0 then
		onClick( 820, 410);
	else
		onClick( 100, 60);
		mMainIndex = 13;
	end
end
function switch29()--选服换区界面
	-- body
	if mInterFaceTime == 0 then
		onClick( 1270, 740);
	else
		onClick( 960, 910);
		mInterFaceTime = 0;
	end
end
function switch31()--历练入口
	-- body
	if mLilianIndex == 0 then
		onClick( 300, 500);--巅峰挑战
    elseif mLilianIndex == 1 then
		onClick( 850, 720);--夺宝之战
	elseif mLilianIndex == 2 then
		onClick( 1350, 430);--封灵塔
	elseif mLilianIndex == 3 then
		touchDown(1, 1400, 400);
		mSleep(200);
		touchMove(1, 500, 400);--滑动900dp
		mSleep(200);
		touchUp(1, 500, 400);
		onClick( 1800, 700);--寻仙
	elseif mLilianIndex == 4 then
		touchDown(1, 1400, 400);
		mSleep(200);
		touchMove(1, 500, 400);--滑动900dp(保障)
		mSleep(200);
		touchUp(1, 500, 400);
		onClick( 1600, 500);--天魔降临
	elseif mLilianIndex == 5 then
		mSleep(1000);
		mMainIndex = 16;
		onClick( 100, 60);
	end
end
function switch32()--巅峰挑战
	-- body
	mSleep(500);
	if mDianfengIndex == 0 then
		onClick( 930, 960);--戳挑战
	elseif mDianfengIndex == 1 then
		onClick( 1360, 960);--记录
	elseif mDianfengIndex == 2 then
		onClick( 1600, 950);--规则
	elseif mDianfengIndex == 3 then
		onClick( 1520, 140);--巅峰挑战排行榜
	elseif mDianfengIndex == 4 then
		onClick( 1740, 140);--声望商店
	elseif mDianfengIndex == 5 then
		onClick( 100, 60);--返回
		mLilianIndex = 1;--历练选择index
	end
end
function switch33()--巅峰挑战排行榜
	-- body
	mSleep(2000);
	onClick( 1600, 100);--关闭
	mDianfengIndex = 4;
end
function switch36()--夺宝之战
	-- body
	mSleep(1000);
	if mDuobaoIndex == 0 then
		onClick( 950, 300);--灰色的那个碎片
	elseif mDuobaoIndex == 1 then
		mSleep(1000);
		onClick( 1250, 1000);--一键夺宝
		mSleep(1000);
		onClick( 1130, 540);--提示确定
		mSleep(2000);
		onClick( 960, 930);--抢夺完成
		mSleep(1000);
		onClick( 1000, 1000);--合成
	elseif mDuobaoIndex == 2 then--处理点击合成后弹出的法器信息框..66
		onClick( 1760, 330);--护宝记录
	elseif mDuobaoIndex == 3 then
		onClick( 1770, 540);--免战牌
	elseif mDuobaoIndex == 4 then
		onClick( 100, 60);--返回
		mLilianIndex = 2;
	end
end
function switch37()--封灵塔
	-- body
	if mFenglingIndex == 0 then
		mSleep(2000);
		onClick( 1650, 880);--一键3星
		mSleep(1000)
		onClick( 1500, 150);--排行榜
	elseif mFenglingIndex == 1 then
		mSleep(1000);
		onClick( 1750, 170);--灵核商店
	elseif mFenglingIndex == 2 then
		mSleep(1000);
		onClick( 100, 60);--返回
		mLilianIndex = 3;
	end
end
function switch38()--排行榜
	-- body
	mSleep(1000);
	onClick( 1620, 100);--关闭
	mFenglingIndex = 1;
end
function switch39()--灵核商店
	-- body
	mSleep(1000);
	onClick( 440, 180);--紫
	mSleep(2000);
	onClick( 600, 180);--橙
	mSleep(2000);
	onClick( 800, 180);--奖励
	mSleep(2000);
	mFenglingIndex = 2;
	onClick( 100, 60);--返回
end
function switch44()--天魔降临
	-- body
	toast("如有天魔请自行测试")
	mSleep(2000)
	mLilianIndex = 5;
	onClick( 100, 60);
end
function switch46()--图鉴界面
	-- body
	onClick( 400, 190);
	mSleep(2000);
	onClick( 600, 190);
	mSleep(2000);
	onClick( 800, 190);
	mSleep(2000);
	onClick( 950, 190);
	mSleep(2000);
	onClick( 220, 450);
end
function switch47()--图鉴符灵信息
	-- body
	onClick( 1300, 940);
	mSleep(2000);
	onClick( 1500, 940);
	mSleep(2000);
	onClick( 1610, 100);
end
function switch48()--用户协议界面
	-- body
	onClick( 1600, 100);
	mSleep(1000);
end
function switch49()--符灵升级
	-- body
	if mCommonIndex == 0 then
	onClick( 1340, 800);
	mSleep(2000);
	onClick( 1700, 820);
	mSleep(1000);
	mCommonIndex = 1;
	end
	if mCommonIndex == 1 then
	onClick( 580, 170);--戳符灵碎片选项卡
	mSleep(1000);
	end
end
function switch50()--突破界面
	-- body
	onClick( 1500, 840);
	mSleep(1000);
	onClick( 100, 50);
end
function switch52()--角色信息界面
	-- body
	mSleep(500);
	onClick( 1700, 140);--关了
	mMainIndex = 15;
end
function switch55()--pvp战斗胜利
	-- body
	mSleep(500);
	onClick( 1430, 860);--关闭
end
function switch56()--pvp战斗奖励 1 in 3
	-- body
	mSleep(500);
	onClick( 940, 550);--戳中间箱子
	mSleep(2000);
	onClick( 940, 550);--再戳一下
	mDianfengIndex = 1;--巅峰标志位
end
function switch57()--声望商店
	-- body
	if mShengWangIndex == 0 then
		mSleep(2000);
		onClick( 380, 190);--戳奖励
		mSleep(2000);
		onClick( 830, 400);--购买第一个
		mSleep(1000);
    elseif mShengWangIndex == 1 then
		onClick( 100, 60);
		mDianfengIndex = 5;
	end
end
function switch58()--massage弹框
	-- body
	onClick( 960, 570);
end
function switch59()--奖励信息
	-- body
	onClick( 950, 780);--确定
	mShengWangIndex = 1;--声望商店index
end
function switch60()--pvp对战记录
	-- body
	mSleep(2000);
	onClick( 1480, 150);--关闭
	mDianfengIndex = 2;--巅峰标志位
end
function switch61()--各种规则框
	-- body
	onClick( 1400, 200);
	mDianfengIndex = 3;
end
function switch62()--夺宝之战对手列表
	-- body
	mSleep(1000);
	onClick( 1450 ,600);--夺宝列表,关闭
	mDuobaoIndex = 1;
end
function switch66()--法器详情页
	-- body
	mSleep(2000);
	onClick( 1620, 130);--关闭
	mDuobaoIndex = 2;
end
function switch67()--夺宝记录
	-- body
	mSleep(500);
	onClick( 1420, 100);--关闭记录
	mDuobaoIndex = 3;
end
function switch68()--免战牌界面
	-- body
	mSleep(1000);
	mDuobaoIndex = 4;
	onClick( 1350 ,280);--关闭(之后看逻辑添加69)
end
function switch70()--星相界面
	-- body
	onClick( 830, 950);--点亮
	mSleep(2000);
	touchDown(1, 200, 600);
	mSleep(200);
	touchMove(1, 200, 300);--滑动
	touchUp(1, 200, 300)
	mSleep(1000);
	onClick( 100, 60);--Exit
	mMainIndex = 10;
end
function switch77()--天命界面
	-- body
	--onClick( )
end
function switch80()--符灵背包(出售升级突破)
	-- body
	if mFulingBagIndex == 0 then
		onClick( 400, 1000);
		mSleep(1000);
		mFulingBagIndex = 1;	
	elseif mFulingBagIndex == 1 then
		onClick( 1700, 380);
		mSleep(1000);
		mFulingBagIndex = 2;
		mTeamFlowControl = 1;
	end
end
function switch81()--带图提示框
	-- body
	onClick( 1160, 640);
	mSleep(1000);
end
function switch83()--装备碎片
	-- body
	onClick( 580, 180);--下一项
	mSleep(2000);
	onClick( 100, 60);--返回
	mMainIndex = 4;
end
function switch85()--符灵分解
	-- body
	onClick( 550, 930);
	mSleep(1000);
	onClick( 1460 ,920);
	mSleep(1000);
	onClick( 420, 170);
end
function switch86()--装备分解
	-- body
	onClick( 550, 930);
	mSleep(1000);
	onClick( 1460 ,920);
	mSleep(1000);
	onClick( 600, 170);
end
function switch87()--符灵重生
	-- body
	mSleep(1000);
	onClick( 800, 170);
end
function switch88()--法器重铸
	-- body
	mSleep(1000);
	onClick( 100, 50);--返回
	mMainIndex = 3;
end
function switch89()--包裹界面
	-- body
	onClick( 100, 60);
	mMainIndex = 2;
end
function switch93()--符灵碎片
	-- body
	if mChoiseFuLingBlockIndex == 0 then
		mSleep(500);
		onClick( 300, 370);
		mSleep(500);
		onClick( 800, 370);
		mSleep(500);
		onClick( 300, 550);
		mSleep(500);
		onClick( 800, 550);
		mSleep(1000);
		onClick( 550, 1000);--出售
		mSleep(1000);
	elseif mChoiseFuLingBlockIndex == 1 then
		onClick( 100, 60);--返回Main
		mSleep(1000);
		mMainIndex = 1;
	end
end
function switch94()--选择符灵碎片
	-- body
	toast(mChoiseFuLingBlockIndex);
	if mChoiseFuLingBlockIndex == 0 then
	mSleep(500);
	onClick( 860, 220);--选择碎片1
	mSleep(1000);
	onClick( 1699, 950);--确定
	mChoiseFuLingBlockIndex = 1;
	else
	mSleep(500)
	onClick( 1740, 60);--关掉
	end
end
function switch96()--主界面等级排行榜
	-- body
	onClick( 300, 400);
	mSleep(2000);
	onClick( 100, 60);
	mMainIndex = 5;
end
function switch97()--排名奖励界面
	-- body
	onClick( 1620, 250);--查看奖励
	if mRankActIndex == 1 then
		onClick( 300, 400);
		mSleep(1000);
		onClick( 100, 60);
	end
	mMainIndex = 9;
end
function switch98()--巅峰挑战查看奖励
	-- body
	mSleep(2000);
	onClick(1500, 150);
	mRankActIndex = 1;
end
function switch99()--开服狂欢
	-- body
	mSleep(1000);
	onClick( 1600, 400);--领取
	mSleep(2000);
	onClick( 100, 60);--返回
	mMainIndex = 11;
end
function switch100()--主界面任务成就
	-- body
	mSleep(1000);
	onClick( 850, 180);--戳成就
	mSleep(1000);
	onClick( 1700, 360);--领取奖励
	mMainIndex = 12;
end
function switch103()--获取途径
	-- body
	mSleep(1000);
	onClick( 960, 900);
	mFulingShopIndex = 1;
end
function switch104()--首充礼包
	-- body
	mSleep(500);
	onClick( 300, 530);--vip礼包
end
function switch106()--vip礼包
	-- body
	mSleep(500);
	onClick( 1570, 550);--领取vip0
	mSleep(2000);
	onClick( 300, 660);--开服基金
end
function switch107()--开服基金
	-- body
	mSleep(500);
	onClick( 1600, 1000);--全民福利
	mSleep(1000);
	onClick( 300, 800);--幸运翻牌
end
function switch108()--幸运翻牌
	-- body
	mSleep(500);
	onClick( 1100, 870);--开始翻牌
	mSleep(5000);--等动画
	onClick( 700, 500);--翻一张牌
	mSleep(3000);--等动画
	onClick( 300, 930);--月卡
end
function switch110()--月卡
	-- body
	mSleep(1000);
	onClick( 300, 740);--领仙桃
end
function switch111()--领仙桃
	-- body
	mSleep(500);
	onClick( 1400, 880);--领取(目前不考虑结果)
	mSleep(1000);
	onClick( 300, 880);--摇钱树(缺少窗口颜色，目前合并处理)
	mSleep(500);
	onClick( 1100, 870);--戳摇一摇
	mSleep(2000);
	onClick( 300, 900)--礼品码
end
function switch112()--礼品码
	-- body
	mSleep(1000);
	onClick( 300, 970);--单充福利
	mSleep(2000);
	onClick( 100, 60);--返回
	mMainIndex = 14;
end
function switch119()--寻仙
	-- body
	onClick( 100, 60);--返回
	mLilianIndex = 4;
end
------------------------------------分组逻辑--------end----------------------------------------------------
--=======================================================================================================--
------------------------------------流程数组--------Begin--------------------------------------------------
action = {
		-- body
		[0] = function () switch0() end,
		[1] = function () switch1() end,
		[2] = function () switch2() end,
		--[3] = function () switch3() end,
		[4] = function () switch4() end,
		[5] = function () switch5() end,
		[6] = function () switch6() end,
		[7] = function () switch7() end,
		[8] = function () switch8() end,
		[9] = function () switch9() end,
		[10] = function () switch10() end,
		--[11] = function () switch11() end,
		[12] = function () switch12() end,
		[13] = function () switch13() end,
		--[14] = function () switch14() end,
		[15] = function () switch15() end,
		[16] = function () switch16() end,
		--[17] = function () switch17() end,
		--[18] = function () switch18() end,
		--[19] = function () switch19() end,
		[20] = function () switch20() end,
		--[21] = function () switch21() end,
		[22] = function () switch22() end,
		[23] = function () switch23() end,
		--[24] = function () switch24() end,
		[25] = function () switch25() end,
		[26] = function () switch26() end,
		[27] = function () switch27() end,
		[28] = function () switch28() end,
		[29] = function () switch29() end,
		--[30] = function () switch30() end,
		[31] = function () switch31() end,
		[32] = function () switch32() end,
		[33] = function () switch33() end,
		--[34] = function () switch34() end,
		--[35] = function () switch35() end,
		[36] = function () switch36() end,
		[37] = function () switch37() end,
		[38] = function () switch38() end,
		[39] = function () switch39() end,
		--[40] = function () switch40() end,
		--[41] = function () switch41() end,
		--[42] = function () switch42() end,
		--[43] = function () switch43() end,
		[44] = function () switch44() end,
		--[45] = function () switch45() end,
		[46] = function () switch46() end,
		[47] = function () switch47() end,
		[48] = function () switch48() end,
		[49] = function () switch49() end,
		[50] = function () switch50() end,
		--[51] = function () switch51() end,
		[52] = function () switch52() end,
		--[53] = function () switch53() end,
		--[54] = function () switch54() end,
		[55] = function () switch55() end,
		[56] = function () switch56() end,
		[57] = function () switch57() end,
		[58] = function () switch58() end,
		[59] = function () switch59() end,
		[60] = function () switch60() end,
		[61] = function () switch61() end,
		[62] = function () switch62() end,
		--[63] = function () switch63() end,
		--[64] = function () switch64() end,
		--[65] = function () switch65() end,
		[66] = function () switch66() end,
		[67] = function () switch67() end,
		[68] = function () switch68() end,
		--[69] = function () switch69() end,
		[70] = function () switch70() end,
		--[71] = function () switch71() end,
		--[72] = function () switch72() end,
		--[73] = function () switch73() end,
		--[74] = function () switch74() end,
		--[75] = function () switch75() end,
		--[76] = function () switch76() end,
		[77] = function () switch77() end,
		--[78] = function () switch78() end,
		--[79] = function () switch79() end,
		[80] = function () switch80() end,
		[81] = function () switch81() end,
		--[82] = function () switch82() end,
		[83] = function () switch83() end,
		--[84] = function () switch84() end,
		[85] = function () switch85() end,
		[86] = function () switch86() end,
		[87] = function () switch87() end,
		[88] = function () switch88() end,
		[89] = function () switch89() end,
		--[90] = function () switch90() end,
		--[91] = function () switch91() end,
		--[92] = function () switch92() end,
		[93] = function () switch93() end,
		[94] = function () switch94() end,
		--[95] = function () switch95() end,
		[96] = function () switch96() end,
		[97] = function () switch97() end,
		[98] = function () switch98() end,
		[99] = function () switch99() end,
		[100] = function () switch100() end,
		[101] = function () switch101() end,
		--[102] = function () switch102() end,
		[103] = function () switch103() end,
		[104] = function () switch104() end,
		--[105] = function () switch105() end,
		[106] = function () switch106() end,
		[107] = function () switch107() end,
		[108] = function () switch108() end,
		[109] = function () switch109() end,
		[110] = function () switch110() end,
		[111] = function () switch111() end,
		[112] = function () switch112() end,
		[119] = function () switch119() end
	-- body
	}
--end
	
------------------------------------流程数组--------end--------------------------------------------------
function main()
	-- body
	--==================================================--
	toast("初始化方向,请保持当前屏幕的方向");
	mSleep(5000);
	toast("Home 键朝右右右右右右右右右右!!");
	mSleep(5000);
	init(1);
	toast("运行进程...");
	runApp("com.hengxiang.wsxsm.uc");
	--==================================================--
	
	
	--流程控制开关begin
	mInterFaceTime = 0;
	mAutoActtion = 0;
	mActIndex = 0;
	mStarBoxIndex = 0;--星级宝箱
	mFulingBagIndex = 0;--符灵背包
	mMainIndex = 0;--主界面
	mTeamFlowControl =0;--队伍
	mCommonIndex = 0;--通用标志位
	mChoiseFuLingBlockIndex = 0;--选择符灵碎片
	mRankActIndex = 0;--巅峰挑战
	mFulingShopIndex = 0;--符灵商铺
	mLilianIndex = 0;--历练入口选择标志位
	mDianfengIndex = 0;--巅峰挑战流程标志位
	mShengWangIndex = 0;--声望商店index
	mDuobaoIndex = 0;--夺宝index
	mFenglingIndex = 0;--封灵塔index
	UnknownNum = 0;--错误计数
	
	--end
	while (true) do	
		f = witchInterface();
		toast(f);
		--[[]]
		if f ~= nil then
			if f == 0 then
				mSleep(200);
			elseif f > 0 and f <= 150 then
				toast(f);
				action[f](1);
			else
				toast("Unknown Interface Index!");
				current_time = os.date("%Y-%m-%d-%H%M%S", os.time());
				keepScreen(true);
				snapshot(current_time..".png", 0, 0, 1536, 2048); --以时间戳命名进行截图
				keepScreen(false);
				if UnknownNum > 50 then
					dialog("There Have More Unknown or No Massage ,Script will exit", 0);
					mSleep(5000);
					lua_exit();
				end
			end
		end	--[[]]--
	end
end main()
------------------执行main()---------------------------------------------------------------------------
main();
 