/* globals WAY, WAYModuleLoader, Window_SkillEquip */
// ============================================================================
// WAY_YEP_EquipBattleSkills.js
// ============================================================================
/*:
@plugindesc v1.1.1 Addon to Yanfly's Equip Battle Skills Plugin. <WAY_YEP_EquipBattleSkills>
@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
--- Skill Notetag:
<Lock Skill>

--- Class Notetag:
<Lock Skills: x>
<Lock Skills: x, x, x>
<Lock Skills: x to y>

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
    WAYModuleLoader.registerPlugin('WAY_YEP_EquipBattleSkills', '1.1.1', 'waynee95');
}

(($) => {
    const { getNotetag, getNotetagList, toArray } = WAY.Util;

    WAY.EventEmitter.on('load-skill-notetags', obj => {
        obj.lockSkill = getNotetag(obj.note, 'Lock Skill', false);
    });

    WAY.EventEmitter.on('load-class-notetags', obj => {
        obj.lockedSkills = [];
        getNotetagList(obj.note, 'Lock Skills', data => {
            const arr = toArray(data);
            obj.lockedSkills = obj.lockedSkills.concat(...arr);
        });
    });

    Window_SkillList.prototype.isBattleSkillEnabled = function (item) {
        const actor = this._actor;

        if (item) {
            if (Imported.YEP_X_Subclass) {
                const subclassId = actor._subclassId;
                const subclass = subclassId > 0 ? $dataClasses[subclassId] : null;
                if (subclass && subclass.lockedSkills.contains(item.id)) return false;
            }
            if (actor.currentClass().lockedSkills.contains(item.id)) return false;
            if (item.lockSkill) return false;
        }

        return true;
    };

    $.alias.Window_SkillEquip_isEnabled = Window_SkillEquip.prototype.isEnabled;
    Window_SkillEquip.prototype.isEnabled = function (item) {
        const actor = this._actor;

        if (item && actor.battleSkills().contains(item)) {
            if (Imported.YEP_X_Subclass) {
                const subclassId = actor._subclassId;
                const subclass = subclassId > 0 ? $dataClasses[subclassId] : null;
                if (subclass && subclass.lockedSkills.contains(item.id)) return false;
            }
            if (actor.currentClass().lockedSkills.contains(item.id)) return false;
            if (item.lockSkill) return false;
        }

        return $.alias.Window_SkillEquip_isEnabled.call(this, item);
    };
})(WAYModuleLoader.getModule('WAY_YEP_EquipBattleSkills'));
