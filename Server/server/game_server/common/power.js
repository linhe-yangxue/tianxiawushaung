var globalObject = require('../../common/global_object');
var csvManager = require('../../manager/csv_manager').Instance();


var ATTRIBUTE = {};
ATTRIBUTE.ATTACK = 1; /* 攻击 */
ATTRIBUTE.ATTACK_RATE = 2; /* 攻击% */
ATTRIBUTE.DEFENCE = 3;  /* 防御 */
ATTRIBUTE.DEFENCE_RATE = 4; /* 防御% */
ATTRIBUTE.HP = 5; /* 生命 */
ATTRIBUTE.HP_RATE = 6; /* 生命% */
ATTRIBUTE.HP_MAX = 7; /* 生命上限 */
ATTRIBUTE.HP_MAX_RATE = 8; /* 生命上限% */
ATTRIBUTE.HIT_TARGET_RATE = 14; /* 命中概率% */
ATTRIBUTE.CRITICAL_STRIKE_RATE = 16;  /* 暴击概率% */
ATTRIBUTE.DEFENCE_HIT_RATE = 24; /* 伤害减免 */
ATTRIBUTE.DODGE_RATE = 30; /* 闪避% */
ATTRIBUTE.PHYSICAL_DEFENCE = 40; /* 物防 */
ATTRIBUTE.MAGIC_DEFENCE = 41; /* 法防 */
ATTRIBUTE.PHYSICAL_DEFENCE_RATE = 42;  /* 物防率 */
ATTRIBUTE.MAGIC_DEFENCE_RATE = 43;  /* 法防率 */
ATTRIBUTE.DEFENCE_CRITICAL_STRIKE_RATE = 44; /* 抗暴率 */
ATTRIBUTE.HIT_RATE  = 45; /* 伤害率 */


/**
 * 战斗力属性对象
 */
function PowerAttr() {
    this.attackBase = 0; /* 攻击基础值 */
    this.hpBase = 0; /* 生命基础值 */
    this.phyDefBase = 0; /* 物防基础值 */
    this.mgcDefBase = 0; /* 法防基础值 */
    this.attackEx = 0; /* 攻击额外增加值 */
    this.attackRateEx = 0; /* 攻击额外增加百分比 */
    this.hpEx = 0; /*生命额外增加值  */
    this.hpRateEx = 0; /* 生命额外增加百分比 */
    this.phyDefEx = 0; /*物防额外增加值  */
    this.phyDefRateEx = 0; /* 物防额外增加百分比 */
    this.mgcDefEx = 0;  /*法防额外增加值  */
    this.mgcDefRateEx = 0; /* 法防额外增加百分比 */
    this.attack = 0; /* 攻击值 */
    this.hp = 0; /* 生命值 */
    this.phyDef = 0; /* 物防值 */
    this.mgcDef = 0; /* 法防值 */
    this.criRt = 0; /*暴击率 */
    this.dfCriRt = 0; /* 抗暴率 */
    this.hitTrRt = 0; /* 命中率 */
    this.gdRt = 0; /* 闪避率 */
    this.hitRt = 0; /* 伤害率 */
    this.dfHitRt = 0; /* 减伤率 */
    this.skVl = 0; /* 技能值  */
}


/**
 * 增加属性对象值
 * @param attr
 * @param type
 * @param value
 */
function addValue(attr, type, value) {
    if(!type) return;

    switch (type) {
        case ATTRIBUTE.ATTACK:
            attr.attackEx += value;
            break;

        case ATTRIBUTE.ATTACK_RATE:
            attr.attackRateEx += value;
            break;

        case ATTRIBUTE.DEFENCE:
            attr.phyDefEx += value;
            attr.mgcDefEx += value;
            break;

        case ATTRIBUTE.DEFENCE_RATE:
            attr.phyDefRateEx += value;
            attr.mgcDefRateEx += value;
            break;

        case ATTRIBUTE.HP:
        case ATTRIBUTE.HP_MAX:
            attr.hpEx += value;
            break;

        case ATTRIBUTE.HP_RATE:
        case ATTRIBUTE.HP_MAX_RATE:
            attr.hpRateEx += value;
            break;

        case ATTRIBUTE.HIT_TARGET_RATE:
            attr.hitTrRt += value;
            break;

        case ATTRIBUTE.CRITICAL_STRIKE_RATE:
            attr.criRt += value;
            break;

        case ATTRIBUTE.DEFENCE_HIT_RATE:
            attr.dfHitRt += value;
            break;

        case ATTRIBUTE.DODGE_RATE:
            attr.gdRt += value;
            break;

        case ATTRIBUTE.PHYSICAL_DEFENCE:
            attr.phyDefEx += value;
            break;

        case ATTRIBUTE.MAGIC_DEFENCE:
            attr.mgcDefEx += value;
            break;

        case ATTRIBUTE.PHYSICAL_DEFENCE_RATE:
            attr.phyDefRateEx += value;
            break;

        case ATTRIBUTE.MAGIC_DEFENCE_RATE:
            attr.mgcDefRateEx += value;
            break;

        case ATTRIBUTE.DEFENCE_CRITICAL_STRIKE_RATE:
            attr.dfCriRt += value;
            break;

        case ATTRIBUTE.HIT_RATE:
            attr.hitRt += value;
            break;

        default :
            break;
    }
}

/**
 * 增加属性对象值2
 * (装备表RoleEquipConfig基础值为什么要乘10000，好蛋疼啊啊啊啊)
 * @param attr
 * @param type
 * @param value
 */
function addValue2(attr, type, value) {
    if(!type) return;

    switch (type) {
        case ATTRIBUTE.ATTACK:
            attr.attackEx += value / 10000;
            break;

        case ATTRIBUTE.ATTACK_RATE:
            attr.attackRateEx += value;
            break;

        case ATTRIBUTE.DEFENCE:
            attr.phyDefEx += value / 10000;
            attr.mgcDefEx += value / 10000;
            break;

        case ATTRIBUTE.DEFENCE_RATE:
            attr.phyDefRateEx += value;
            attr.mgcDefRateEx += value;
            break;

        case ATTRIBUTE.HP:
        case ATTRIBUTE.HP_MAX:
            attr.hpEx += value / 10000;
            break;

        case ATTRIBUTE.HP_RATE:
        case ATTRIBUTE.HP_MAX_RATE:
            attr.hpRateEx += value;
            break;

        case ATTRIBUTE.HIT_TARGET_RATE:
            attr.hitTrRt += value;
            break;

        case ATTRIBUTE.CRITICAL_STRIKE_RATE:
            attr.criRt += value;
            break;

        case ATTRIBUTE.DEFENCE_HIT_RATE:
            attr.dfHitRt += value;
            break;

        case ATTRIBUTE.DODGE_RATE:
            attr.gdRt += value;
            break;

        case ATTRIBUTE.PHYSICAL_DEFENCE:
            attr.phyDefEx += value / 10000;
            break;

        case ATTRIBUTE.MAGIC_DEFENCE:
            attr.mgcDefEx += value / 10000;
            break;

        case ATTRIBUTE.PHYSICAL_DEFENCE_RATE:
            attr.phyDefRateEx += value;
            break;

        case ATTRIBUTE.MAGIC_DEFENCE_RATE:
            attr.mgcDefRateEx += value;
            break;

        case ATTRIBUTE.DEFENCE_CRITICAL_STRIKE_RATE:
            attr.dfCriRt += value;
            break;

        case ATTRIBUTE.HIT_RATE:
            attr.hitRt += value;
            break;

        default :
            break;
    }
}

/**
 * 从基础值计算属性值
 * @param attr
 * @param cpAttr
 */
function calAttr(attr, cpAttr) {
    attr.attack = (attr.attackBase + attr.attackEx + cpAttr.attackEx)
    * ((attr.attackRateEx + cpAttr.attackRateEx) / 10000 + 1);

     attr.hp = (attr.hpBase + attr.hpEx + cpAttr.hpEx)
     * ((attr.hpRateEx + cpAttr.hpRateEx) / 10000 + 1);

     attr.phyDef = (attr.phyDefBase + attr.phyDefEx + cpAttr.phyDefEx)
     * ((attr.phyDefRateEx + cpAttr.phyDefRateEx) / 10000 + 1);

    attr.mgcDef = (attr.mgcDefBase + attr.mgcDefEx + cpAttr.mgcDefEx)
    * ((attr.mgcDefRateEx + cpAttr.mgcDefRateEx) / 10000 + 1);

    attr.criRt += cpAttr.criRt;
    attr.dfCriRt += cpAttr.dfCriRt;
    attr.hitTrRt += cpAttr.hitTrRt;
    attr.gdRt += cpAttr.gdRt;
    attr.hitRt += cpAttr.hitRt;
    attr.dfHitRt += cpAttr.dfHitRt;
}


/**
 * 更新战斗力
 * @param starTail  [int]下次点星序号
 * @param pap [array] 玩家对象和背包对象数组
 * @param petFDs [array] 接受符灵战斗信息的数组
 */
exports.updatePower = function(starTail, pap, petFDs) {
    var pets = pap[globalObject.PACKAGE_TYPE_PET].content;
    var petOnsite = []; /* 上阵和缘分位的符灵 */
    for (var i = 0; i < pets.length; ++i) {
        if (pets[i].teamPos > 0) {
            petOnsite.push(pets[i]);
        }
    }
    var equips = pap[globalObject.PACKAGE_TYPE_EQUIP].content;
    var equipOnsite = []; /*上阵装备  */
    for (var i = 0; i < equips.length; ++i) {
        if (equips[i].teamPos >= 0) {
            equipOnsite.push(equips[i]);
        }
    }
    var magics = pap[globalObject.PACKAGE_TYPE_MAGIC].content;
    var magicOnsite = []; /* 上阵法器 */
    for (var i = 0; i < magics.length; ++i) {
        if (magics[i].teamPos >= 0) {
            magicOnsite.push(magics[i]);
        }
    }

    var rolesInBattle = []; /* 主角和上阵符灵 */
    rolesInBattle.push(pap[0].character);
    for (var i = 1; i < 4; ++i) {
        for (var j = 0; j < petOnsite.length; ++j) {
            if (petOnsite[j].teamPos == i) {
                rolesInBattle.push(petOnsite[j]);
                break;
            }
        }
    }

    var cpAttr = new PowerAttr(); /* 公共属性 */
    var roleAttrs = []; /* 主角和符灵属性 */
    var allRoleBuffs = [];

    /*---------------------------------------点星增益------------------------------------*/
    for (var i = 1; i < starTail; ++i) {
        var starTable = csvManager.PointStarConfig();
        var add = parseInt(starTable[i].REWARD_NUMERICAL);

        if (starTable[i].REWARD_TYPE == 1) {
            cpAttr.attackEx += add;
        }
        else if (starTable[i].REWARD_TYPE == 2) {
            cpAttr.phyDefEx += add;
        }
        else if (starTable[i].REWARD_TYPE == 3) {
            cpAttr.mgcDefEx += add;
        }
        else if (starTable[i].REWARD_TYPE == 4) {
            cpAttr.hpEx += add;
        }
    }

    /*-----------------------------------基础值和buff---------------------------------*/
    for (var tp = 0; tp < rolesInBattle.length; ++tp) {
        var role = rolesInBattle[tp];
        var aoLine = csvManager.ActiveObject()[role.tid];

        var baIndex = aoLine.APTITUDE_LEVEL * 1000 + role.breakLevel;
        var baLine = csvManager.BreakAttribute()[baIndex];

        var sgAttr = new PowerAttr();
        roleAttrs.push(sgAttr);

        /* ！注意 buff初始化 */
        allRoleBuffs[tp] = [];
        var buffs =  allRoleBuffs[tp];

        /*----------------------------------------基础值-------------------------------------*/
        sgAttr.attackBase = aoLine.BASE_ATTACK + baLine.BASE_BREAK_ATTACK
        + baLine.BREAK_ATTACK * role.level;

        sgAttr.hpBase = aoLine.BASE_HP + baLine.BASE_BREAK_HP
        + baLine.BREAK_HP * role.level;

        sgAttr.phyDefBase = aoLine.BASE_PHYSICAL_DEFENCE + baLine.BASE_BREAK_PHYSICAL_DEFENCE
        + baLine.BREAK_PHYSICAL_DEFENCE * role.level;

        sgAttr.mgcDefBase = aoLine.BASE_MAGIC_DEFENCE + baLine.BASE_BREAK_MAGIC_DEFENCE
        + baLine.BREAK_MAGIC_DEFENCE * role.level;

        sgAttr.criRt = aoLine.CRITICAL_STRIKE;
        sgAttr.dfCriRt = 0;
        sgAttr.hitTrRt = aoLine.HIT;
        sgAttr.gdRt = aoLine.DODGE;
        sgAttr.hitRt = 0;
        sgAttr.dfHitRt = aoLine.MITIGATIONG;

        /*---------------------------------------突破增益------------------------------------*/
        var bbLine = csvManager.BreakBuff()[role.tid];
        for (var i = 1; i <= role.breakLevel; ++i) {
            var bufIndex = bbLine['BREAK_' + i];
            if (!bufIndex) {
                continue;
            }
            var abLine = csvManager.AffectBuffer()[bufIndex];
            if (abLine) {
                buffs.push(abLine);
            }
        }

        /*-------------------------------------装备与法器-----------------------------------*/
        var equipOnTp = []; /* 在tp位的装备 */
        var magicOnTp = []; /* 在tp位的法器 */
        var emOnTp = []; /* 在tp位的装备与法器 */
        for (var i = 0; i < equipOnsite.length; ++i) {
            if (equipOnsite[i].teamPos == tp) {
                equipOnTp.push(equipOnsite[i]);
            }
        }
        for (var i = 0; i < magicOnsite.length; ++i) {
            if (magicOnsite[i].teamPos == tp) {
                magicOnTp.push(magicOnsite[i]);
            }
        }
        emOnTp = equipOnTp.concat(magicOnTp);

        for (var i = 0; i < emOnTp.length; ++i) {
            var recLine = csvManager.RoleEquipConfig()[emOnTp[i].tid];

            for (var j = 0; j <= 1; ++j) {
                /* 强化加成 */
                var type = recLine['ATTRIBUTE_TYPE_' + j];
                var v1 = recLine['BASE_ATTRIBUTE_' + j];
                var v2 = recLine['STRENGTHEN_' + j];
                var value = v1 + v2 * (emOnTp[i].strengthenLevel - 1);
                addValue2(sgAttr, type, value);

                /* 精炼加成 */
                type = recLine['REFINE_TYPE_' + j];
                v1 = recLine['REFINE_VALUE_' + j];
                value = v1 * emOnTp[i].refineLevel;
                addValue2(sgAttr, type, value);
            }
        }

        /*---------------------------------------套装增益-----------------------------------*/
        var suits = {};
        for (var i = 0; i < equipOnTp.length; ++i) {
            var suitIndex = equipOnTp[i].tid % 100;
            if (suits.hasOwnProperty(suitIndex)) {
                suits[suitIndex] += 1;
            }
            else {
                suits[suitIndex] = 1;
            }
        }

        for (var i in suits) {
            if (suits[i] < 2) {
                continue;
            }
            var secLine = csvManager.SetEquipConfig()[13000 + parseInt(i)];
            if (!secLine) {
                continue;
            }

            for (var j = 2; j <= suits[i]; ++j) {
                for (var k = 1; k <= 3; ++k) {
                    var bufIndex = secLine['SET' + j + '_BUFF_ID_' + k];
                    if (!bufIndex) {
                        continue;
                    }
                    var abLine = csvManager.AffectBuffer()[bufIndex];
                    if (abLine) {
                        buffs.push(abLine);
                    }
                }
            }
        }

        /*---------------------------------------强化大师-------------------------------------*/
        var smTable = csvManager.StrengMaster();
        var smLine, lvl;
        if (equipOnTp.length == 4) {
            /*装备最低强化等级  */
            var equipMinStrengLevel = equipOnTp[0].strengthenLevel;
            for (var i = 1; i < 4; ++i) {
                if (equipOnTp[i].strengthenLevel < equipMinStrengLevel) {
                    equipMinStrengLevel = equipOnTp[i].strengthenLevel;
                }
            }

            smLine = null;
            lvl = 0;
            for (var i in smTable) {
                if (equipMinStrengLevel >= smTable[i].EQUIP_STERNG_LEVEL && smTable[i].EQUIP_STERNG_LEVEL > lvl) {
                    lvl = smTable[i].EQUIP_STERNG_LEVEL;
                    smLine = smTable[i];
                }
            }
            if (smLine) {
                for (var i = 1; i <= 4; ++i) {
                    var bufIndex = smLine['EQUIP_STERNG_BUFF' + i];
                    if (bufIndex) {
                        var abLine = csvManager.AffectBuffer()[bufIndex];
                        if (abLine) {
                            buffs.push(abLine);
                        }
                    }
                }
            }

            /* 装备最低精炼等级 */
            var equipMinRefineLevel = equipOnTp[0].refineLevel;
            for (var i = 1; i < 4; ++i) {
                if (equipOnTp[i].refineLevel < equipMinRefineLevel) {
                    equipMinRefineLevel = equipOnTp[i].refineLevel;
                }
            }

            smLine = null;
            lvl = 0;
            for (var i in smTable) {
                if (equipMinRefineLevel >= smTable[i].EQUIP_REFINE_LEVEL && smTable[i].EQUIP_REFINE_LEVEL > lvl) {
                    lvl = smTable[i].EQUIP_REFINE_LEVEL;
                    smLine = smTable[i];
                }
            }
            if (smLine) {
                for (var i = 1; i <= 2; ++i) {
                    var bufIndex = smLine['EQUIP_REFINE_BUFF' + i];
                    if (bufIndex) {
                        var abLine = csvManager.AffectBuffer()[bufIndex];
                        if (abLine) {
                            buffs.push(abLine);
                        }
                    }
                }
            }
        }

        if (magicOnTp.length == 2) {
            /*法器最低强化等级  */
            var magicMinStrengLevel = magicOnTp[0].strengthenLevel;
            if (magicOnTp[1].strengthenLevel < magicMinStrengLevel) {
                magicMinStrengLevel = magicOnTp[1].strengthenLevel;
            }

            smLine = null;
            lvl = 0;
            for (var i in smTable) {
                if (magicMinStrengLevel >= smTable[i].MAGIC_STERNG_LEVEL && smTable[i].MAGIC_STERNG_LEVEL > lvl) {
                    lvl = smTable[i].MAGIC_STERNG_LEVEL;
                    smLine = smTable[i];
                }
            }
            if (smLine) {
                for (var i = 1; i <= 3; ++i) {
                    var bufIndex = smLine['MAGIC_STERNG_BUFF' + i];
                    if (bufIndex) {
                        var abLine = csvManager.AffectBuffer()[bufIndex];
                        if (abLine) {
                            buffs.push(abLine);
                        }
                    }
                }
            }

            /* 法器最低精炼等级 */
            var magicMinRefineLevel = magicOnTp[0].refineLevel;
            if (magicOnTp[1].refineLevel < magicMinRefineLevel) {
                magicMinRefineLevel = magicOnTp[1].refineLevel;
            }

            smLine = null;
            lvl = 0;
            for (var i in smTable) {
                if (magicMinRefineLevel >= smTable[i].MAGIC_REFINE_LEVEL && smTable[i].MAGIC_REFINE_LEVEL > lvl) {
                    lvl = smTable[i].MAGIC_REFINE_LEVEL;
                    smLine = smTable[i];
                }
            }
            if (smLine) {
                for (var i = 1; i <= 2; ++i) {
                    var bufIndex = smLine['MAGIC_REFINE_BUFF' + i];
                    if (bufIndex) {
                        var abLine = csvManager.AffectBuffer()[bufIndex];
                        if (abLine) {
                            buffs.push(abLine);
                        }
                    }
                }
            }
        }
    }

    /*------------------------------------------缘分buff----------------------------------------*/
    for (var tp = 0; tp < rolesInBattle.length; ++tp) {
        var buffs =  allRoleBuffs[tp];
        var role = rolesInBattle[tp];
        var acLine = csvManager.ActiveObject()[role.tid];
        for (var k = 1; k <= 15; ++k) {
            var reIndex = acLine['RELATE_ID_' + k];
            if (!reIndex) {
                continue;
            }
            var rcLine = csvManager.RelateConfig()[reIndex];
            if (!rcLine) {
                continue;
            }

            var reActive = 1;
            /* 缘分激活标志 */
            for (var j = 1; j <= 6; ++j) {
                var tid = rcLine['NEED_CONTENT_' + j];
                if (!tid) {
                    continue;
                }

                var conMeet = 0;
                /* 缘分条件满足标志位 */
                if (pap[0].character.tid == tid) {
                    conMeet = 1;
                }
                for (var i = 0; i < petOnsite.length; ++i) {
                    if (petOnsite[i].tid == tid) {
                        conMeet = 1;
                    }
                }
                for (var i = 0; i < equipOnsite.length; ++i) {
                    if (equipOnsite[i].tid == tid && equipOnsite[i].teamPos == tp) {
                        conMeet = 1;
                    }
                }
                for (var i = 0; i < magicOnsite.length; ++i) {
                    if (magicOnsite[i].tid == tid && magicOnsite[i].teamPos == tp) {
                        conMeet = 1;
                    }
                }

                if (conMeet == 0) {
                    reActive = 0;
                    break;
                }
            }
            if (!reActive) {
                continue;
            }

            var bufIndex = rcLine['BUFF_ID'];
            abLine = csvManager.AffectBuffer()[bufIndex];
            if (!abLine) {
                continue;
            }

            buffs.push(abLine);
        }
    }

    /*----------------------------------------天命--------------------------------------*/
    for (var tp = 0; tp < rolesInBattle.length; ++tp) {
        var sgAttr = roleAttrs[tp];
        var fateLevel = rolesInBattle[tp].fateLevel;
        var extra = 100 * csvManager.FateStrengthConfig()[fateLevel].TOTAL_ADD_RATE; /* 天命增益 */

        addValue(sgAttr, ATTRIBUTE.ATTACK_RATE, extra);
        addValue(sgAttr, ATTRIBUTE.HP_MAX_RATE, extra);
        addValue(sgAttr, ATTRIBUTE.DEFENCE_RATE, extra);
    }

    /*---------------------------------------计算buff-------------------------------------*/
    for (var tp = 0; tp < rolesInBattle.length; ++tp) {
        var buffs =  allRoleBuffs[tp];
        var sgAttr = roleAttrs[tp];

        for (var i = 0; i < buffs.length; ++i) {
            if (buffs[i].EXTRA_CONDITION == 4) {
                addValue(cpAttr, ATTRIBUTE[buffs[i].AFFECT_TYPE], buffs[i].AFFECT_VALUE);
                addValue(cpAttr, ATTRIBUTE[buffs[i].AFFECT_TYPE_1], buffs[i].AFFECT_VALUE_1);
            }
            else if(buffs[i].EXTRA_CONDITION == 0) {
                addValue(sgAttr, ATTRIBUTE[buffs[i].AFFECT_TYPE], buffs[i].AFFECT_VALUE);
                addValue(sgAttr, ATTRIBUTE[buffs[i].AFFECT_TYPE_1], buffs[i].AFFECT_VALUE_1);
            }
        }
    }

    for (var tp = 0; tp < roleAttrs.length; ++tp) {
        calAttr(roleAttrs[tp], cpAttr);
    }

    /*-----------------------------------------技能值------------------------------------------*/
    for (var tp = 1; tp < roleAttrs.length; ++tp) { /* 主角没有技能 */
        var t = roleAttrs[tp];

        for (var i = 0; i < 4; ++i) {
            var aoLine = csvManager.ActiveObject()[rolesInBattle[tp].tid];
            var skillId = aoLine['PET_SKILL_' + (i + 1)];
            var skLine = null;

            if (skillId >= 300000 && skillId < 400000) {
                skLine = csvManager.AffectBuffer()[skillId];
            }
            else {
                skLine = csvManager.Skill()[skillId];
            }

            if(null == skLine) {
                continue;
            }

            t.skVl += skLine.START_BATTLE + skLine.UPGRADE_BATTLE * rolesInBattle[tp].skillLevel[i];
        }
    }

    /*-----------------------------------------战斗力-----------------------------------------*/
    var attack = 0;
    var power = 0;
    var eaTable = csvManager.EquipAttributeIconConfig();

    for (var tp = 0; tp < roleAttrs.length; ++tp) {
        var t = roleAttrs[tp];
        attack += t.attack;
        power += t.attack * eaTable[ATTRIBUTE.ATTACK].ATTRIBUTE_BATTLE
        + t.phyDef * eaTable[ATTRIBUTE.PHYSICAL_DEFENCE].ATTRIBUTE_BATTLE
        + t.mgcDef * eaTable[ATTRIBUTE.MAGIC_DEFENCE].ATTRIBUTE_BATTLE
        + t.hp * eaTable[ATTRIBUTE.HP_MAX].ATTRIBUTE_BATTLE
        + t.criRt * eaTable[ATTRIBUTE.CRITICAL_STRIKE_RATE].ATTRIBUTE_BATTLE / 10000
        + t.dfCriRt * eaTable[ATTRIBUTE.DEFENCE_CRITICAL_STRIKE_RATE].ATTRIBUTE_BATTLE / 10000
        + (t.hitTrRt - 10000) * eaTable[ATTRIBUTE.HIT_TARGET_RATE].ATTRIBUTE_BATTLE / 10000
        + t.gdRt * eaTable[ATTRIBUTE.DODGE_RATE].ATTRIBUTE_BATTLE / 10000
        + t.hitRt * eaTable[ATTRIBUTE.HIT_RATE].ATTRIBUTE_BATTLE / 10000
        + t.dfHitRt * eaTable[ATTRIBUTE.DEFENCE_HIT_RATE].ATTRIBUTE_BATTLE / 10000
        + t.skVl;
    }
    attack = Math.round(attack);
    power = Math.round(power);

    pap[0].attack = attack;
    pap[0].power = power;

    /*-------------------------------------生成战斗信息-----------------------------------*/
    if(null == petFDs || !Array.isArray(petFDs) || petFDs.length != 0) {
        return;
    }

    for(var tp = 0; tp < roleAttrs.length; ++tp) {
        var t = roleAttrs[tp];
        var petFD = new (globalObject.PetFightDetail)();
        petFD.tid = rolesInBattle[tp].tid;
        petFD.attack = parseInt(t.attack);
        petFD.hp = parseInt(t.hp);
        petFD.phyDef = parseInt(t.phyDef);
        petFD.mgcDef = parseInt(t.mgcDef);
        petFD.criRt = parseInt(t.criRt);
        petFD.dfCriRt = parseInt(t.dfCriRt);
        petFD.hitTrRt = parseInt(t.hitTrRt);
        petFD.gdRt = parseInt(t.gdRt);
        petFD.hitRt = parseInt(t.hitRt);
        petFD.dfHitRt = parseInt(t.dfHitRt);
        petFDs.push(petFD);
    }   
};


