/* globals WAY, WAYModuleLoader, Window_SkillEquip */
// ============================================================================
// WAY_YEP_EquipBattleSkills.js
// ============================================================================
/**
 * @file Addon to Yanfly's Equip Battle Skills Plugin.
 * @author waynee95
 * @version 1.0.1
 */
/*:
@plugindesc Addon to Yanfly's Equip Battle Skills Plugin. <WAY_YEP_EquipBattleSkills>
@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
---Skill Notetag:
<Lock Skill>

This skill cannot be unequipped in the EquipBattleSkills menu.

==============================================================================
 ■ Terms of Use
==============================================================================
Credit must be given to: waynee95
Please don't share my plugins anywhere, except if you have my permissions.

My plugins may be used in commercial and non-commercial products.
*/

'use strict';

if (WAY === undefined) {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_YEP_EquipBattleSkills', '1.0.1', 'waynee95');
}

(() => {
    const { getNotetag, toBool } = WAY.Util;

    WAY.EventEmitter.on('load-skill-notetags', skill => {
        skill.lockSkill = getNotetag(skill.note, 'Lock Skill', false, toBool);
    });

    Window_SkillList.prototype.isBattleSkillEnabled = item => item && !item.lockSkill;
    Window_SkillEquip.prototype.isEnabled = item => item && !item.lockSkill;
})(WAYModuleLoader.getModule('WAY_YEP_EquipBattleSkills'));
