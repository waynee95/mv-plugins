/* globals WAY, WAYModuleLoader, Window_SkillEquip */
// ===========================================================================
// WAY_YEP_EquipBattleSkills.js
// ===========================================================================
/*:
@plugindesc v1.2.0 Addon to Yanfly's Equip Battle Skills Plugin. <WAY_YEP_EquipBattleSkills>

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
This work is licensed under the MIT license.

More info here: https://github.com/waynee95/mv-plugins/blob/master/LICENSE

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
*/

'use strict'

if (typeof WAY === 'undefined') {
  console.error('You need to install WAY_Core!') // eslint-disable-line no-console
  if (Utils.isNwjs() && Utils.isOptionValid('test')) {
    var gui = require('nw.gui'); //eslint-disable-line
    gui.Window.get().showDevTools()
  }
  SceneManager.stop()
} else {
  WAYModuleLoader.registerPlugin('WAY_YEP_EquipBattleSkills', '1.2.0', 'waynee95', {
    name: 'WAY_Core',
    version: '>= 2.0.0'
  })
}

(($) => {
  const { getNotetag, getNotetagList, toArray } = WAY.Util

  WAY.EventEmitter.on('load-skill-notetags', obj => {
    obj.lockSkill = getNotetag(obj.note, 'Lock Skill', false)
  })

  WAY.EventEmitter.on('load-class-notetags', obj => {
    obj.lockedSkills = []
    getNotetagList(obj.note, 'Lock Skills', data => {
      const arr = toArray(data)
      obj.lockedSkills = obj.lockedSkills.concat(...arr)
    })
  })

  //==========================================================================
  // Window_SkillList
  //==========================================================================
  $.alias.Window_SkillEquip_isEnabled = Window_SkillEquip.prototype.isEnabled
  Window_SkillEquip.prototype.isEnabled = function (item) {
    const actor = this._actor

    if (item && actor.battleSkills().contains(item)) {
      if (Imported.YEP_X_Subclass) {
        const subclassId = actor._subclassId
        const subclass = subclassId > 0 ? $dataClasses[subclassId] : null
        if (subclass && subclass.lockedSkills.contains(item.id)) return false
      }
      if (actor.currentClass().lockedSkills.contains(item.id)) return false
      if (item.lockSkill) return false
    }

    return $.alias.Window_SkillEquip_isEnabled.call(this, item)
  }

  Window_SkillList.prototype.isBattleSkillEnabled = function (item) {
    const actor = this._actor

    if (item) {
      if (Imported.YEP_X_Subclass) {
        const subclassId = actor._subclassId
        const subclass = subclassId > 0 ? $dataClasses[subclassId] : null
        if (subclass && subclass.lockedSkills.contains(item.id)) return false
      }
      if (actor.currentClass().lockedSkills.contains(item.id)) return false
      if (item.lockSkill) return false
    }

    return true
  }
})(WAYModuleLoader.getModule('WAY_YEP_EquipBattleSkills'))
