
/** 包含的头文件 */
var csvACHIEVECONFIG = require('../data/AchieveConfig');
var csvACTIVEOBJECT = require('../data/ActiveObject');
var csvAFFECTBUFFER = require('../data/AffectBuffer');
var csvAGREEMENT = require('../data/Agreement');
var csvANNOUNCEMENTCONFIG = require('../data/AnnouncementConfig');
var csvATTACKSTATE = require('../data/AttackState');
var csvAVATARCONFIG = require('../data/AvatarConfig');
var csvAVATARLVCONFIG = require('../data/AvatarLvConfig');
var csvBANEDTEXTCONFIG = require('../data/BanedTextConfig');
var csvBATTLEPROVE = require('../data/BattleProve');
var csvBEGINNERCONFIG = require('../data/BeginnerConfig');
var csvBEGINNERSEND = require('../data/BeginnerSend');
var csvBOARD = require('../data/Board');
var csvBOSSBIRTH = require('../data/BossBirth');
var csvBOSSCONFIG = require('../data/BossConfig');
var csvBREAKATTRIBUTE = require('../data/BreakAttribute');
var csvBREAKBUFF = require('../data/BreakBuff');
var csvBREAKLEVELCONFIG = require('../data/BreakLevelConfig');
var csvCAMERA = require('../data/Camera');
var csvCHARACTERLEVELEXP = require('../data/CharacterLevelExp');
var csvCHARGECONFIG = require('../data/ChargeConfig');
var csvCLIMBINGBUFF = require('../data/ClimbingBuff');
var csvCLIMBINGCONSUME = require('../data/ClimbingConsume');
var csvCLIMBINGTOWER = require('../data/ClimbingTower');
var csvCOMMONEVENT = require('../data/CommonEvent');
var csvCONDUIT = require('../data/Conduit');
var csvCONFIGTABLE = require('../data/ConfigTable');
var csvCOSTEVENT = require('../data/CostEvent');
var csvCOUNTCONFIG = require('../data/CountConfig');
var csvDAILYSIGN = require('../data/Dailysign');
var csvDAILYSIGNEVENT = require('../data/DailySignEvent');
var csvDAILYSTAGECONFIG = require('../data/DailyStageConfig');
var csvDEAMONSHOPCONFIG = require('../data/DeamonShopConfig');
var csvDEFAULTROLE = require('../data/DefaultRole');
var csvDEVELOPCONFIG = require('../data/DevelopConfig');
var csvDIALOG = require('../data/Dialog');
var csvEFFECT = require('../data/Effect');
var csvEFFECTSOUND = require('../data/EffectSound');
var csvELEMENT = require('../data/Element');
var csvENERGYCOST = require('../data/EnergyCost');
var csvENERGYEVENT = require('../data/EnergyEvent');
var csvEQUIPATTRIBUTEICONCONFIG = require('../data/EquipAttributeIconConfig');
var csvEQUIPCOMPOSE = require('../data/EquipCompose');
var csvEQUIPPOSTION = require('../data/EquipPostion');
var csvEQUIPRECOVERCONFIG = require('../data/EquipRecoverConfig');
var csvEQUIPREFINELVCONFIG = require('../data/EquipRefineLvConfig');
var csvEQUIPREFINESTONECONFIG = require('../data/EquipRefineStoneConfig');
var csvEQUIPSTRENGTHCOSTCONFIG = require('../data/EquipStrengthCostConfig');
var csvEVENTCONFIG = require('../data/EventConfig');
var csvFAILGUIDE = require('../data/FailGuide');
var csvFAIRYLAD = require('../data/Fairylad');
var csvFAIRYLADCOST = require('../data/FairyladCost');
var csvFAIRYLADDESC = require('../data/FairyladDesc');
var csvFATESTRENGTHCONFIG = require('../data/FateStrengthConfig');
var csvFEATAWARDCONFIG = require('../data/FeatAwardConfig');
var csvFEATEVENTCONFIG = require('../data/FeatEventConfig');
var csvFIGHTUI = require('../data/FightUi');
var csvFIGHTUINOTICE = require('../data/FightUiNotice');
var csvFIRSTNAME = require('../data/FirstName');
var csvFIRSTRECHARGEEVENT = require('../data/FirstRechargeEvent');
var csvFLASHSALEEVENT = require('../data/FlashSaleEvent');
var csvFRAGMENT = require('../data/Fragment');
var csvFRAGMENTADMIN = require('../data/FragmentAdmin');
var csvFUNCTIONCONFIG = require('../data/FunctionConfig');
var csvFUNDEVENT = require('../data/FundEvent');
var csvFUNDEVENTRULE = require('../data/FundEventRule');
var csvGAINFUNCTIONCONFIG = require('../data/GainFunctionConfig');
var csvGRABROBOTCONFIG = require('../data/GrabRobotConfig');
var csvGROUPIDCONFIG = require('../data/GroupIDConfig');
var csvGUILDBOSS = require('../data/GuildBoss');
var csvGUILDBOSSPRICE = require('../data/GuildBossPrice');
var csvGUILDCREATED = require('../data/GuildCreated');
var csvGUILDSHOPCONFIG = require('../data/GuildShopConfig');
var csvHDLOGIN = require('../data/HDlogin');
var csvHDREVELRY = require('../data/HDrevelry');
var csvHDSHOOTER = require('../data/HDshooter');
var csvHELPLIST = require('../data/HelpList');
var csvHIDDENRULE = require('../data/HiddenRule');
var csvINDIANADRAW = require('../data/IndianaDraw');
var csvIOSCHECK = require('../data/IosCheck');
var csvITEMICON = require('../data/ItemIcon');
var csvITEMID = require('../data/ItemId');
var csvKINGDOMDESCRIBE = require('../data/KingdomDescribe');
var csvLIMITTIMESALE = require('../data/LimitTimeSale');
var csvLOCALPUSHCONFIG = require('../data/LocalPushConfig');
var csvLUCKCARD = require('../data/LuckCard');
var csvMAGICEQUIPLVCONFIG = require('../data/MagicEquipLvConfig');
var csvMAGICEQUIPREFINECONFIG = require('../data/MagicEquipRefineConfig');
var csvMAILMAX = require('../data/MailMax');
var csvMAILSTRING = require('../data/MailString');
var csvMAINUINOTICE = require('../data/MainUiNotice');
var csvMALLSHOPCONFIG = require('../data/MallShopConfig');
var csvMAXNUM = require('../data/MaxNum');
var csvMODELS = require('../data/Models');
var csvMONSTEROBJECT = require('../data/MonsterObject');
var csvMOTIONSOUND = require('../data/MotionSound');
var csvMYSTERYSHOPCONFIG = require('../data/MysteryShopConfig');
var csvOPENTIME = require('../data/OpenTime');
var csvOPERATEEVENT = require('../data/OperateEvent');
var csvPETLEVELEXP = require('../data/PetLevelExp');
var csvPETPOSTIONLEVEL = require('../data/PetPostionLevel');
var csvPETRECOVERCONFIG = require('../data/PetRecoverConfig');
var csvPETTYPE = require('../data/PetType');
var csvPOINTSTARCONFIG = require('../data/PointStarConfig');
var csvPOWERENERGY = require('../data/PowerEnergy');
var csvPOWERREWORD = require('../data/PowerReword');
var csvPRESTIGESHOPCONFIG = require('../data/PrestigeShopConfig');
var csvPUMPINGCONFIG = require('../data/PumpingConfig');
var csvPVPLOOT = require('../data/PvpLoot');
var csvPVPRANKAWARDCONFIG = require('../data/PvpRankAwardConfig');
var csvQUALITYCONFIG = require('../data/QualityConfig');
var csvRANKACTIVITY = require('../data/RankActivity');
var csvRECHARGEEVENT = require('../data/RechargeEvent');
var csvRELATECONFIG = require('../data/RelateConfig');
var csvRESETCOST = require('../data/ResetCost');
var csvRESOURCEGAINCONFIG = require('../data/ResourceGainConfig');
var csvRETCODE = require('../data/RetCode');
var csvROBOTCONFIG = require('../data/RobotConfig');
var csvROLEEQUIPCONFIG = require('../data/RoleEquipConfig');
var csvROLESKINCONFIG = require('../data/RoleSkinConfig');
var csvROLEUICONFIG = require('../data/RoleUIConfig');
var csvSCENEBUFF = require('../data/SceneBuff');
var csvSCORECONFIG = require('../data/ScoreConfig');
var csvSELPETUICONFIG = require('../data/SelPetUIConfig');
var csvSERVERSTATUS = require('../data/ServerStatus');
var csvSETEQUIPCONFIG = require('../data/SetEquipConfig');
var csvSEVENDAYLOGINEVENT = require('../data/SevenDayLoginEvent');
var csvSHOPSLOTBASE = require('../data/ShopSlotBase');
var csvSINGLERECHARGEEVENT = require('../data/SingleRechargeEvent');
var csvSKILL = require('../data/Skill');
var csvSKILLCOST = require('../data/SkillCost');
var csvSOUNDMANAGE = require('../data/SoundManage');
var csvSTAGEBIRTH = require('../data/StageBirth');
var csvSTAGEBONUS = require('../data/StageBonus');
var csvSTAGECONFIG = require('../data/StageConfig');
var csvSTAGEFATHER = require('../data/StageFather');
var csvSTAGEGROUPPLOT = require('../data/StageGroupPlot');
var csvSTAGELOOTGROUPIDCONFIG = require('../data/StageLootGroupIDConfig');
var csvSTAGEPOINT = require('../data/StagePoint');
var csvSTAGESTAR = require('../data/StageStar');
var csvSTAGETASK = require('../data/StageTask');
var csvSTARREWARD = require('../data/StarReward');
var csvSTRENGMASTER = require('../data/StrengMaster');
var csvSTRINGLIST = require('../data/Stringlist');
var csvSUFFERINGTIGGER = require('../data/SufferingTigger');
var csvSUFFERINGTRIGGER = require('../data/SufferingTrigger');
var csvTASKCONFIG = require('../data/TaskConfig');
var csvTASKTYPE = require('../data/TaskType');
var csvTEAM = require('../data/Team');
var csvTEAMBATTLE = require('../data/TeamBattle');
var csvTEAMDATA = require('../data/TeamData');
var csvTIPICONCONFIG = require('../data/TipiconConfig');
var csvTOOLITEM = require('../data/ToolItem');
var csvTOWERSHOPCONFIG = require('../data/TowerShopConfig');
var csvVIPLIST = require('../data/Viplist');
var csvVIPWEEK = require('../data/VipWeek');
var csvWEEKGIFTEVENT = require('../data/WeekGiftEvent');
var csvWINDOWPOINT = require('../data/WindowPoint');
var csvWORSHIP = require('../data/WorShip');
var csvWORSHIPCONFIG = require('../data/WorshipConfig');
var csvWORSHIPSCHEDULE = require('../data/WorshipSchedule');
var csvWORSHIPSTRING = require('../data/WorShipString');


/**
 * [当前为生成代码，不可以修改] CSC 配置表的管理类
 * */
var CSVManagerInstance = (function() {
    /** 类的成员变量 */
    var _unique;
    var _AchieveConfig;
    var _ActiveObject;
    var _AffectBuffer;
    var _Agreement;
    var _AnnouncementConfig;
    var _AttackState;
    var _AvatarConfig;
    var _AvatarLvConfig;
    var _BanedTextConfig;
    var _BattleProve;
    var _BeginnerConfig;
    var _BeginnerSend;
    var _Board;
    var _BossBirth;
    var _BossConfig;
    var _BreakAttribute;
    var _BreakBuff;
    var _BreakLevelConfig;
    var _Camera;
    var _CharacterLevelExp;
    var _ChargeConfig;
    var _ClimbingBuff;
    var _ClimbingConsume;
    var _ClimbingTower;
    var _CommonEvent;
    var _Conduit;
    var _ConfigTable;
    var _CostEvent;
    var _CountConfig;
    var _Dailysign;
    var _DailySignEvent;
    var _DailyStageConfig;
    var _DeamonShopConfig;
    var _DefaultRole;
    var _DevelopConfig;
    var _Dialog;
    var _Effect;
    var _EffectSound;
    var _Element;
    var _EnergyCost;
    var _EnergyEvent;
    var _EquipAttributeIconConfig;
    var _EquipCompose;
    var _EquipPostion;
    var _EquipRecoverConfig;
    var _EquipRefineLvConfig;
    var _EquipRefineStoneConfig;
    var _EquipStrengthCostConfig;
    var _EventConfig;
    var _FailGuide;
    var _Fairylad;
    var _FairyladCost;
    var _FairyladDesc;
    var _FateStrengthConfig;
    var _FeatAwardConfig;
    var _FeatEventConfig;
    var _FightUi;
    var _FightUiNotice;
    var _FirstName;
    var _FirstRechargeEvent;
    var _FlashSaleEvent;
    var _Fragment;
    var _FragmentAdmin;
    var _FunctionConfig;
    var _FundEvent;
    var _FundEventRule;
    var _GainFunctionConfig;
    var _GrabRobotConfig;
    var _GroupIDConfig;
    var _GuildBoss;
    var _GuildBossPrice;
    var _GuildCreated;
    var _GuildShopConfig;
    var _HDlogin;
    var _HDrevelry;
    var _HDshooter;
    var _HelpList;
    var _HiddenRule;
    var _IndianaDraw;
    var _IosCheck;
    var _ItemIcon;
    var _ItemId;
    var _KingdomDescribe;
    var _LimitTimeSale;
    var _LocalPushConfig;
    var _LuckCard;
    var _MagicEquipLvConfig;
    var _MagicEquipRefineConfig;
    var _MailMax;
    var _MailString;
    var _MainUiNotice;
    var _MallShopConfig;
    var _MaxNum;
    var _Models;
    var _MonsterObject;
    var _MotionSound;
    var _MysteryShopConfig;
    var _OpenTime;
    var _OperateEvent;
    var _PetLevelExp;
    var _PetPostionLevel;
    var _PetRecoverConfig;
    var _PetType;
    var _PointStarConfig;
    var _PowerEnergy;
    var _PowerReword;
    var _PrestigeShopConfig;
    var _PumpingConfig;
    var _PvpLoot;
    var _PvpRankAwardConfig;
    var _QualityConfig;
    var _RankActivity;
    var _RechargeEvent;
    var _RelateConfig;
    var _ResetCost;
    var _ResourceGainConfig;
    var _RetCode;
    var _RobotConfig;
    var _RoleEquipConfig;
    var _RoleSkinConfig;
    var _RoleUIConfig;
    var _SceneBuff;
    var _ScoreConfig;
    var _SelPetUIConfig;
    var _ServerStatus;
    var _SetEquipConfig;
    var _SevenDayLoginEvent;
    var _ShopSlotBase;
    var _SingleRechargeEvent;
    var _Skill;
    var _SkillCost;
    var _SoundManage;
    var _StageBirth;
    var _StageBonus;
    var _StageConfig;
    var _StageFather;
    var _StageGroupPlot;
    var _StageLootGroupIDConfig;
    var _StagePoint;
    var _StageStar;
    var _StageTask;
    var _StarReward;
    var _StrengMaster;
    var _Stringlist;
    var _SufferingTigger;
    var _SufferingTrigger;
    var _TaskConfig;
    var _TaskType;
    var _Team;
    var _TeamBattle;
    var _TeamData;
    var _TipiconConfig;
    var _ToolItem;
    var _TowerShopConfig;
    var _Viplist;
    var _VipWeek;
    var _WeekGiftEvent;
    var _WindowPoint;
    var _WorShip;
    var _WorshipConfig;
    var _WorshipSchedule;
    var _WorShipString;

    /**
    * 单例函数
    */
    function Instance() {
        if(_unique === undefined) {
            _unique = new CSVManager();
        }
        return _unique;
    }

    /**
    * 构造函数
    */
    function CSVManager() {
        _AchieveConfig = csvACHIEVECONFIG.Instance;
        _ActiveObject = csvACTIVEOBJECT.Instance;
        _AffectBuffer = csvAFFECTBUFFER.Instance;
        _Agreement = csvAGREEMENT.Instance;
        _AnnouncementConfig = csvANNOUNCEMENTCONFIG.Instance;
        _AttackState = csvATTACKSTATE.Instance;
        _AvatarConfig = csvAVATARCONFIG.Instance;
        _AvatarLvConfig = csvAVATARLVCONFIG.Instance;
        _BanedTextConfig = csvBANEDTEXTCONFIG.Instance;
        _BattleProve = csvBATTLEPROVE.Instance;
        _BeginnerConfig = csvBEGINNERCONFIG.Instance;
        _BeginnerSend = csvBEGINNERSEND.Instance;
        _Board = csvBOARD.Instance;
        _BossBirth = csvBOSSBIRTH.Instance;
        _BossConfig = csvBOSSCONFIG.Instance;
        _BreakAttribute = csvBREAKATTRIBUTE.Instance;
        _BreakBuff = csvBREAKBUFF.Instance;
        _BreakLevelConfig = csvBREAKLEVELCONFIG.Instance;
        _Camera = csvCAMERA.Instance;
        _CharacterLevelExp = csvCHARACTERLEVELEXP.Instance;
        _ChargeConfig = csvCHARGECONFIG.Instance;
        _ClimbingBuff = csvCLIMBINGBUFF.Instance;
        _ClimbingConsume = csvCLIMBINGCONSUME.Instance;
        _ClimbingTower = csvCLIMBINGTOWER.Instance;
        _CommonEvent = csvCOMMONEVENT.Instance;
        _Conduit = csvCONDUIT.Instance;
        _ConfigTable = csvCONFIGTABLE.Instance;
        _CostEvent = csvCOSTEVENT.Instance;
        _CountConfig = csvCOUNTCONFIG.Instance;
        _Dailysign = csvDAILYSIGN.Instance;
        _DailySignEvent = csvDAILYSIGNEVENT.Instance;
        _DailyStageConfig = csvDAILYSTAGECONFIG.Instance;
        _DeamonShopConfig = csvDEAMONSHOPCONFIG.Instance;
        _DefaultRole = csvDEFAULTROLE.Instance;
        _DevelopConfig = csvDEVELOPCONFIG.Instance;
        _Dialog = csvDIALOG.Instance;
        _Effect = csvEFFECT.Instance;
        _EffectSound = csvEFFECTSOUND.Instance;
        _Element = csvELEMENT.Instance;
        _EnergyCost = csvENERGYCOST.Instance;
        _EnergyEvent = csvENERGYEVENT.Instance;
        _EquipAttributeIconConfig = csvEQUIPATTRIBUTEICONCONFIG.Instance;
        _EquipCompose = csvEQUIPCOMPOSE.Instance;
        _EquipPostion = csvEQUIPPOSTION.Instance;
        _EquipRecoverConfig = csvEQUIPRECOVERCONFIG.Instance;
        _EquipRefineLvConfig = csvEQUIPREFINELVCONFIG.Instance;
        _EquipRefineStoneConfig = csvEQUIPREFINESTONECONFIG.Instance;
        _EquipStrengthCostConfig = csvEQUIPSTRENGTHCOSTCONFIG.Instance;
        _EventConfig = csvEVENTCONFIG.Instance;
        _FailGuide = csvFAILGUIDE.Instance;
        _Fairylad = csvFAIRYLAD.Instance;
        _FairyladCost = csvFAIRYLADCOST.Instance;
        _FairyladDesc = csvFAIRYLADDESC.Instance;
        _FateStrengthConfig = csvFATESTRENGTHCONFIG.Instance;
        _FeatAwardConfig = csvFEATAWARDCONFIG.Instance;
        _FeatEventConfig = csvFEATEVENTCONFIG.Instance;
        _FightUi = csvFIGHTUI.Instance;
        _FightUiNotice = csvFIGHTUINOTICE.Instance;
        _FirstName = csvFIRSTNAME.Instance;
        _FirstRechargeEvent = csvFIRSTRECHARGEEVENT.Instance;
        _FlashSaleEvent = csvFLASHSALEEVENT.Instance;
        _Fragment = csvFRAGMENT.Instance;
        _FragmentAdmin = csvFRAGMENTADMIN.Instance;
        _FunctionConfig = csvFUNCTIONCONFIG.Instance;
        _FundEvent = csvFUNDEVENT.Instance;
        _FundEventRule = csvFUNDEVENTRULE.Instance;
        _GainFunctionConfig = csvGAINFUNCTIONCONFIG.Instance;
        _GrabRobotConfig = csvGRABROBOTCONFIG.Instance;
        _GroupIDConfig = csvGROUPIDCONFIG.Instance;
        _GuildBoss = csvGUILDBOSS.Instance;
        _GuildBossPrice = csvGUILDBOSSPRICE.Instance;
        _GuildCreated = csvGUILDCREATED.Instance;
        _GuildShopConfig = csvGUILDSHOPCONFIG.Instance;
        _HDlogin = csvHDLOGIN.Instance;
        _HDrevelry = csvHDREVELRY.Instance;
        _HDshooter = csvHDSHOOTER.Instance;
        _HelpList = csvHELPLIST.Instance;
        _HiddenRule = csvHIDDENRULE.Instance;
        _IndianaDraw = csvINDIANADRAW.Instance;
        _IosCheck = csvIOSCHECK.Instance;
        _ItemIcon = csvITEMICON.Instance;
        _ItemId = csvITEMID.Instance;
        _KingdomDescribe = csvKINGDOMDESCRIBE.Instance;
        _LimitTimeSale = csvLIMITTIMESALE.Instance;
        _LocalPushConfig = csvLOCALPUSHCONFIG.Instance;
        _LuckCard = csvLUCKCARD.Instance;
        _MagicEquipLvConfig = csvMAGICEQUIPLVCONFIG.Instance;
        _MagicEquipRefineConfig = csvMAGICEQUIPREFINECONFIG.Instance;
        _MailMax = csvMAILMAX.Instance;
        _MailString = csvMAILSTRING.Instance;
        _MainUiNotice = csvMAINUINOTICE.Instance;
        _MallShopConfig = csvMALLSHOPCONFIG.Instance;
        _MaxNum = csvMAXNUM.Instance;
        _Models = csvMODELS.Instance;
        _MonsterObject = csvMONSTEROBJECT.Instance;
        _MotionSound = csvMOTIONSOUND.Instance;
        _MysteryShopConfig = csvMYSTERYSHOPCONFIG.Instance;
        _OpenTime = csvOPENTIME.Instance;
        _OperateEvent = csvOPERATEEVENT.Instance;
        _PetLevelExp = csvPETLEVELEXP.Instance;
        _PetPostionLevel = csvPETPOSTIONLEVEL.Instance;
        _PetRecoverConfig = csvPETRECOVERCONFIG.Instance;
        _PetType = csvPETTYPE.Instance;
        _PointStarConfig = csvPOINTSTARCONFIG.Instance;
        _PowerEnergy = csvPOWERENERGY.Instance;
        _PowerReword = csvPOWERREWORD.Instance;
        _PrestigeShopConfig = csvPRESTIGESHOPCONFIG.Instance;
        _PumpingConfig = csvPUMPINGCONFIG.Instance;
        _PvpLoot = csvPVPLOOT.Instance;
        _PvpRankAwardConfig = csvPVPRANKAWARDCONFIG.Instance;
        _QualityConfig = csvQUALITYCONFIG.Instance;
        _RankActivity = csvRANKACTIVITY.Instance;
        _RechargeEvent = csvRECHARGEEVENT.Instance;
        _RelateConfig = csvRELATECONFIG.Instance;
        _ResetCost = csvRESETCOST.Instance;
        _ResourceGainConfig = csvRESOURCEGAINCONFIG.Instance;
        _RetCode = csvRETCODE.Instance;
        _RobotConfig = csvROBOTCONFIG.Instance;
        _RoleEquipConfig = csvROLEEQUIPCONFIG.Instance;
        _RoleSkinConfig = csvROLESKINCONFIG.Instance;
        _RoleUIConfig = csvROLEUICONFIG.Instance;
        _SceneBuff = csvSCENEBUFF.Instance;
        _ScoreConfig = csvSCORECONFIG.Instance;
        _SelPetUIConfig = csvSELPETUICONFIG.Instance;
        _ServerStatus = csvSERVERSTATUS.Instance;
        _SetEquipConfig = csvSETEQUIPCONFIG.Instance;
        _SevenDayLoginEvent = csvSEVENDAYLOGINEVENT.Instance;
        _ShopSlotBase = csvSHOPSLOTBASE.Instance;
        _SingleRechargeEvent = csvSINGLERECHARGEEVENT.Instance;
        _Skill = csvSKILL.Instance;
        _SkillCost = csvSKILLCOST.Instance;
        _SoundManage = csvSOUNDMANAGE.Instance;
        _StageBirth = csvSTAGEBIRTH.Instance;
        _StageBonus = csvSTAGEBONUS.Instance;
        _StageConfig = csvSTAGECONFIG.Instance;
        _StageFather = csvSTAGEFATHER.Instance;
        _StageGroupPlot = csvSTAGEGROUPPLOT.Instance;
        _StageLootGroupIDConfig = csvSTAGELOOTGROUPIDCONFIG.Instance;
        _StagePoint = csvSTAGEPOINT.Instance;
        _StageStar = csvSTAGESTAR.Instance;
        _StageTask = csvSTAGETASK.Instance;
        _StarReward = csvSTARREWARD.Instance;
        _StrengMaster = csvSTRENGMASTER.Instance;
        _Stringlist = csvSTRINGLIST.Instance;
        _SufferingTigger = csvSUFFERINGTIGGER.Instance;
        _SufferingTrigger = csvSUFFERINGTRIGGER.Instance;
        _TaskConfig = csvTASKCONFIG.Instance;
        _TaskType = csvTASKTYPE.Instance;
        _Team = csvTEAM.Instance;
        _TeamBattle = csvTEAMBATTLE.Instance;
        _TeamData = csvTEAMDATA.Instance;
        _TipiconConfig = csvTIPICONCONFIG.Instance;
        _ToolItem = csvTOOLITEM.Instance;
        _TowerShopConfig = csvTOWERSHOPCONFIG.Instance;
        _Viplist = csvVIPLIST.Instance;
        _VipWeek = csvVIPWEEK.Instance;
        _WeekGiftEvent = csvWEEKGIFTEVENT.Instance;
        _WindowPoint = csvWINDOWPOINT.Instance;
        _WorShip = csvWORSHIP.Instance;
        _WorshipConfig = csvWORSHIPCONFIG.Instance;
        _WorshipSchedule = csvWORSHIPSCHEDULE.Instance;
        _WorShipString = csvWORSHIPSTRING.Instance;

    }
    CSVManager.prototype.AchieveConfig = function() {
        return _AchieveConfig().GetLines();
    };

    CSVManager.prototype.ActiveObject = function() {
        return _ActiveObject().GetLines();
    };

    CSVManager.prototype.AffectBuffer = function() {
        return _AffectBuffer().GetLines();
    };

    CSVManager.prototype.Agreement = function() {
        return _Agreement().GetLines();
    };

    CSVManager.prototype.AnnouncementConfig = function() {
        return _AnnouncementConfig().GetLines();
    };

    CSVManager.prototype.AttackState = function() {
        return _AttackState().GetLines();
    };

    CSVManager.prototype.AvatarConfig = function() {
        return _AvatarConfig().GetLines();
    };

    CSVManager.prototype.AvatarLvConfig = function() {
        return _AvatarLvConfig().GetLines();
    };

    CSVManager.prototype.BanedTextConfig = function() {
        return _BanedTextConfig().GetLines();
    };

    CSVManager.prototype.BattleProve = function() {
        return _BattleProve().GetLines();
    };

    CSVManager.prototype.BeginnerConfig = function() {
        return _BeginnerConfig().GetLines();
    };

    CSVManager.prototype.BeginnerSend = function() {
        return _BeginnerSend().GetLines();
    };

    CSVManager.prototype.Board = function() {
        return _Board().GetLines();
    };

    CSVManager.prototype.BossBirth = function() {
        return _BossBirth().GetLines();
    };

    CSVManager.prototype.BossConfig = function() {
        return _BossConfig().GetLines();
    };

    CSVManager.prototype.BreakAttribute = function() {
        return _BreakAttribute().GetLines();
    };

    CSVManager.prototype.BreakBuff = function() {
        return _BreakBuff().GetLines();
    };

    CSVManager.prototype.BreakLevelConfig = function() {
        return _BreakLevelConfig().GetLines();
    };

    CSVManager.prototype.Camera = function() {
        return _Camera().GetLines();
    };

    CSVManager.prototype.CharacterLevelExp = function() {
        return _CharacterLevelExp().GetLines();
    };

    CSVManager.prototype.ChargeConfig = function() {
        return _ChargeConfig().GetLines();
    };

    CSVManager.prototype.ClimbingBuff = function() {
        return _ClimbingBuff().GetLines();
    };

    CSVManager.prototype.ClimbingConsume = function() {
        return _ClimbingConsume().GetLines();
    };

    CSVManager.prototype.ClimbingTower = function() {
        return _ClimbingTower().GetLines();
    };

    CSVManager.prototype.CommonEvent = function() {
        return _CommonEvent().GetLines();
    };

    CSVManager.prototype.Conduit = function() {
        return _Conduit().GetLines();
    };

    CSVManager.prototype.ConfigTable = function() {
        return _ConfigTable().GetLines();
    };

    CSVManager.prototype.CostEvent = function() {
        return _CostEvent().GetLines();
    };

    CSVManager.prototype.CountConfig = function() {
        return _CountConfig().GetLines();
    };

    CSVManager.prototype.Dailysign = function() {
        return _Dailysign().GetLines();
    };

    CSVManager.prototype.DailySignEvent = function() {
        return _DailySignEvent().GetLines();
    };

    CSVManager.prototype.DailyStageConfig = function() {
        return _DailyStageConfig().GetLines();
    };

    CSVManager.prototype.DeamonShopConfig = function() {
        return _DeamonShopConfig().GetLines();
    };

    CSVManager.prototype.DefaultRole = function() {
        return _DefaultRole().GetLines();
    };

    CSVManager.prototype.DevelopConfig = function() {
        return _DevelopConfig().GetLines();
    };

    CSVManager.prototype.Dialog = function() {
        return _Dialog().GetLines();
    };

    CSVManager.prototype.Effect = function() {
        return _Effect().GetLines();
    };

    CSVManager.prototype.EffectSound = function() {
        return _EffectSound().GetLines();
    };

    CSVManager.prototype.Element = function() {
        return _Element().GetLines();
    };

    CSVManager.prototype.EnergyCost = function() {
        return _EnergyCost().GetLines();
    };

    CSVManager.prototype.EnergyEvent = function() {
        return _EnergyEvent().GetLines();
    };

    CSVManager.prototype.EquipAttributeIconConfig = function() {
        return _EquipAttributeIconConfig().GetLines();
    };

    CSVManager.prototype.EquipCompose = function() {
        return _EquipCompose().GetLines();
    };

    CSVManager.prototype.EquipPostion = function() {
        return _EquipPostion().GetLines();
    };

    CSVManager.prototype.EquipRecoverConfig = function() {
        return _EquipRecoverConfig().GetLines();
    };

    CSVManager.prototype.EquipRefineLvConfig = function() {
        return _EquipRefineLvConfig().GetLines();
    };

    CSVManager.prototype.EquipRefineStoneConfig = function() {
        return _EquipRefineStoneConfig().GetLines();
    };

    CSVManager.prototype.EquipStrengthCostConfig = function() {
        return _EquipStrengthCostConfig().GetLines();
    };

    CSVManager.prototype.EventConfig = function() {
        return _EventConfig().GetLines();
    };

    CSVManager.prototype.FailGuide = function() {
        return _FailGuide().GetLines();
    };

    CSVManager.prototype.Fairylad = function() {
        return _Fairylad().GetLines();
    };

    CSVManager.prototype.FairyladCost = function() {
        return _FairyladCost().GetLines();
    };

    CSVManager.prototype.FairyladDesc = function() {
        return _FairyladDesc().GetLines();
    };

    CSVManager.prototype.FateStrengthConfig = function() {
        return _FateStrengthConfig().GetLines();
    };

    CSVManager.prototype.FeatAwardConfig = function() {
        return _FeatAwardConfig().GetLines();
    };

    CSVManager.prototype.FeatEventConfig = function() {
        return _FeatEventConfig().GetLines();
    };

    CSVManager.prototype.FightUi = function() {
        return _FightUi().GetLines();
    };

    CSVManager.prototype.FightUiNotice = function() {
        return _FightUiNotice().GetLines();
    };

    CSVManager.prototype.FirstName = function() {
        return _FirstName().GetLines();
    };

    CSVManager.prototype.FirstRechargeEvent = function() {
        return _FirstRechargeEvent().GetLines();
    };

    CSVManager.prototype.FlashSaleEvent = function() {
        return _FlashSaleEvent().GetLines();
    };

    CSVManager.prototype.Fragment = function() {
        return _Fragment().GetLines();
    };

    CSVManager.prototype.FragmentAdmin = function() {
        return _FragmentAdmin().GetLines();
    };

    CSVManager.prototype.FunctionConfig = function() {
        return _FunctionConfig().GetLines();
    };

    CSVManager.prototype.FundEvent = function() {
        return _FundEvent().GetLines();
    };

    CSVManager.prototype.FundEventRule = function() {
        return _FundEventRule().GetLines();
    };

    CSVManager.prototype.GainFunctionConfig = function() {
        return _GainFunctionConfig().GetLines();
    };

    CSVManager.prototype.GrabRobotConfig = function() {
        return _GrabRobotConfig().GetLines();
    };

    CSVManager.prototype.GroupIDConfig = function() {
        return _GroupIDConfig().GetLines();
    };

    CSVManager.prototype.GuildBoss = function() {
        return _GuildBoss().GetLines();
    };

    CSVManager.prototype.GuildBossPrice = function() {
        return _GuildBossPrice().GetLines();
    };

    CSVManager.prototype.GuildCreated = function() {
        return _GuildCreated().GetLines();
    };

    CSVManager.prototype.GuildShopConfig = function() {
        return _GuildShopConfig().GetLines();
    };

    CSVManager.prototype.HDlogin = function() {
        return _HDlogin().GetLines();
    };

    CSVManager.prototype.HDrevelry = function() {
        return _HDrevelry().GetLines();
    };

    CSVManager.prototype.HDshooter = function() {
        return _HDshooter().GetLines();
    };

    CSVManager.prototype.HelpList = function() {
        return _HelpList().GetLines();
    };

    CSVManager.prototype.HiddenRule = function() {
        return _HiddenRule().GetLines();
    };

    CSVManager.prototype.IndianaDraw = function() {
        return _IndianaDraw().GetLines();
    };

    CSVManager.prototype.IosCheck = function() {
        return _IosCheck().GetLines();
    };

    CSVManager.prototype.ItemIcon = function() {
        return _ItemIcon().GetLines();
    };

    CSVManager.prototype.ItemId = function() {
        return _ItemId().GetLines();
    };

    CSVManager.prototype.KingdomDescribe = function() {
        return _KingdomDescribe().GetLines();
    };

    CSVManager.prototype.LimitTimeSale = function() {
        return _LimitTimeSale().GetLines();
    };

    CSVManager.prototype.LocalPushConfig = function() {
        return _LocalPushConfig().GetLines();
    };

    CSVManager.prototype.LuckCard = function() {
        return _LuckCard().GetLines();
    };

    CSVManager.prototype.MagicEquipLvConfig = function() {
        return _MagicEquipLvConfig().GetLines();
    };

    CSVManager.prototype.MagicEquipRefineConfig = function() {
        return _MagicEquipRefineConfig().GetLines();
    };

    CSVManager.prototype.MailMax = function() {
        return _MailMax().GetLines();
    };

    CSVManager.prototype.MailString = function() {
        return _MailString().GetLines();
    };

    CSVManager.prototype.MainUiNotice = function() {
        return _MainUiNotice().GetLines();
    };

    CSVManager.prototype.MallShopConfig = function() {
        return _MallShopConfig().GetLines();
    };

    CSVManager.prototype.MaxNum = function() {
        return _MaxNum().GetLines();
    };

    CSVManager.prototype.Models = function() {
        return _Models().GetLines();
    };

    CSVManager.prototype.MonsterObject = function() {
        return _MonsterObject().GetLines();
    };

    CSVManager.prototype.MotionSound = function() {
        return _MotionSound().GetLines();
    };

    CSVManager.prototype.MysteryShopConfig = function() {
        return _MysteryShopConfig().GetLines();
    };

    CSVManager.prototype.OpenTime = function() {
        return _OpenTime().GetLines();
    };

    CSVManager.prototype.OperateEvent = function() {
        return _OperateEvent().GetLines();
    };

    CSVManager.prototype.PetLevelExp = function() {
        return _PetLevelExp().GetLines();
    };

    CSVManager.prototype.PetPostionLevel = function() {
        return _PetPostionLevel().GetLines();
    };

    CSVManager.prototype.PetRecoverConfig = function() {
        return _PetRecoverConfig().GetLines();
    };

    CSVManager.prototype.PetType = function() {
        return _PetType().GetLines();
    };

    CSVManager.prototype.PointStarConfig = function() {
        return _PointStarConfig().GetLines();
    };

    CSVManager.prototype.PowerEnergy = function() {
        return _PowerEnergy().GetLines();
    };

    CSVManager.prototype.PowerReword = function() {
        return _PowerReword().GetLines();
    };

    CSVManager.prototype.PrestigeShopConfig = function() {
        return _PrestigeShopConfig().GetLines();
    };

    CSVManager.prototype.PumpingConfig = function() {
        return _PumpingConfig().GetLines();
    };

    CSVManager.prototype.PvpLoot = function() {
        return _PvpLoot().GetLines();
    };

    CSVManager.prototype.PvpRankAwardConfig = function() {
        return _PvpRankAwardConfig().GetLines();
    };

    CSVManager.prototype.QualityConfig = function() {
        return _QualityConfig().GetLines();
    };

    CSVManager.prototype.RankActivity = function() {
        return _RankActivity().GetLines();
    };

    CSVManager.prototype.RechargeEvent = function() {
        return _RechargeEvent().GetLines();
    };

    CSVManager.prototype.RelateConfig = function() {
        return _RelateConfig().GetLines();
    };

    CSVManager.prototype.ResetCost = function() {
        return _ResetCost().GetLines();
    };

    CSVManager.prototype.ResourceGainConfig = function() {
        return _ResourceGainConfig().GetLines();
    };

    CSVManager.prototype.RetCode = function() {
        return _RetCode().GetLines();
    };

    CSVManager.prototype.RobotConfig = function() {
        return _RobotConfig().GetLines();
    };

    CSVManager.prototype.RoleEquipConfig = function() {
        return _RoleEquipConfig().GetLines();
    };

    CSVManager.prototype.RoleSkinConfig = function() {
        return _RoleSkinConfig().GetLines();
    };

    CSVManager.prototype.RoleUIConfig = function() {
        return _RoleUIConfig().GetLines();
    };

    CSVManager.prototype.SceneBuff = function() {
        return _SceneBuff().GetLines();
    };

    CSVManager.prototype.ScoreConfig = function() {
        return _ScoreConfig().GetLines();
    };

    CSVManager.prototype.SelPetUIConfig = function() {
        return _SelPetUIConfig().GetLines();
    };

    CSVManager.prototype.ServerStatus = function() {
        return _ServerStatus().GetLines();
    };

    CSVManager.prototype.SetEquipConfig = function() {
        return _SetEquipConfig().GetLines();
    };

    CSVManager.prototype.SevenDayLoginEvent = function() {
        return _SevenDayLoginEvent().GetLines();
    };

    CSVManager.prototype.ShopSlotBase = function() {
        return _ShopSlotBase().GetLines();
    };

    CSVManager.prototype.SingleRechargeEvent = function() {
        return _SingleRechargeEvent().GetLines();
    };

    CSVManager.prototype.Skill = function() {
        return _Skill().GetLines();
    };

    CSVManager.prototype.SkillCost = function() {
        return _SkillCost().GetLines();
    };

    CSVManager.prototype.SoundManage = function() {
        return _SoundManage().GetLines();
    };

    CSVManager.prototype.StageBirth = function() {
        return _StageBirth().GetLines();
    };

    CSVManager.prototype.StageBonus = function() {
        return _StageBonus().GetLines();
    };

    CSVManager.prototype.StageConfig = function() {
        return _StageConfig().GetLines();
    };

    CSVManager.prototype.StageFather = function() {
        return _StageFather().GetLines();
    };

    CSVManager.prototype.StageGroupPlot = function() {
        return _StageGroupPlot().GetLines();
    };

    CSVManager.prototype.StageLootGroupIDConfig = function() {
        return _StageLootGroupIDConfig().GetLines();
    };

    CSVManager.prototype.StagePoint = function() {
        return _StagePoint().GetLines();
    };

    CSVManager.prototype.StageStar = function() {
        return _StageStar().GetLines();
    };

    CSVManager.prototype.StageTask = function() {
        return _StageTask().GetLines();
    };

    CSVManager.prototype.StarReward = function() {
        return _StarReward().GetLines();
    };

    CSVManager.prototype.StrengMaster = function() {
        return _StrengMaster().GetLines();
    };

    CSVManager.prototype.Stringlist = function() {
        return _Stringlist().GetLines();
    };

    CSVManager.prototype.SufferingTigger = function() {
        return _SufferingTigger().GetLines();
    };

    CSVManager.prototype.SufferingTrigger = function() {
        return _SufferingTrigger().GetLines();
    };

    CSVManager.prototype.TaskConfig = function() {
        return _TaskConfig().GetLines();
    };

    CSVManager.prototype.TaskType = function() {
        return _TaskType().GetLines();
    };

    CSVManager.prototype.Team = function() {
        return _Team().GetLines();
    };

    CSVManager.prototype.TeamBattle = function() {
        return _TeamBattle().GetLines();
    };

    CSVManager.prototype.TeamData = function() {
        return _TeamData().GetLines();
    };

    CSVManager.prototype.TipiconConfig = function() {
        return _TipiconConfig().GetLines();
    };

    CSVManager.prototype.ToolItem = function() {
        return _ToolItem().GetLines();
    };

    CSVManager.prototype.TowerShopConfig = function() {
        return _TowerShopConfig().GetLines();
    };

    CSVManager.prototype.Viplist = function() {
        return _Viplist().GetLines();
    };

    CSVManager.prototype.VipWeek = function() {
        return _VipWeek().GetLines();
    };

    CSVManager.prototype.WeekGiftEvent = function() {
        return _WeekGiftEvent().GetLines();
    };

    CSVManager.prototype.WindowPoint = function() {
        return _WindowPoint().GetLines();
    };

    CSVManager.prototype.WorShip = function() {
        return _WorShip().GetLines();
    };

    CSVManager.prototype.WorshipConfig = function() {
        return _WorshipConfig().GetLines();
    };

    CSVManager.prototype.WorshipSchedule = function() {
        return _WorshipSchedule().GetLines();
    };

    CSVManager.prototype.WorShipString = function() {
        return _WorShipString().GetLines();
    };


    /**
    * 返回一个单例函数
    */
    return Instance;
})();

/** 声明一个单例对象 */
exports.Instance = CSVManagerInstance;
