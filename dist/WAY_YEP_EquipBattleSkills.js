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
Credit must be given to: waynee95
Please don't share my plugins anywhere, except if you have my permissions.

My plugins may be used in commercial and non-commercial products.

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
*/
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

if (typeof WAY === 'undefined') {
  console.error('You need to install WAY_Core!'); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid('test')) {
    var gui = require('nw.gui'); //eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin('WAY_YEP_EquipBattleSkills', '1.2.0', 'waynee95', {
    name: 'WAY_Core',
    version: '>= 2.0.0'
  });
}

(function ($) {
  var _WAY$Util = WAY.Util,
      getNotetag = _WAY$Util.getNotetag,
      getNotetagList = _WAY$Util.getNotetagList,
      toArray = _WAY$Util.toArray;
  WAY.EventEmitter.on('load-skill-notetags', function (obj) {
    obj.lockSkill = getNotetag(obj.note, 'Lock Skill', false);
  });
  WAY.EventEmitter.on('load-class-notetags', function (obj) {
    obj.lockedSkills = [];
    getNotetagList(obj.note, 'Lock Skills', function (data) {
      var _obj$lockedSkills;

      var arr = toArray(data);
      obj.lockedSkills = (_obj$lockedSkills = obj.lockedSkills).concat.apply(_obj$lockedSkills, _toConsumableArray(arr));
    });
  }); //==========================================================================
  // Window_SkillList
  //==========================================================================

  $.alias.Window_SkillEquip_isEnabled = Window_SkillEquip.prototype.isEnabled;

  Window_SkillEquip.prototype.isEnabled = function (item) {
    var actor = this._actor;

    if (item && actor.battleSkills().contains(item)) {
      if (Imported.YEP_X_Subclass) {
        var subclassId = actor._subclassId;
        var subclass = subclassId > 0 ? $dataClasses[subclassId] : null;
        if (subclass && subclass.lockedSkills.contains(item.id)) return false;
      }

      if (actor.currentClass().lockedSkills.contains(item.id)) return false;
      if (item.lockSkill) return false;
    }

    return $.alias.Window_SkillEquip_isEnabled.call(this, item);
  };

  Window_SkillList.prototype.isBattleSkillEnabled = function (item) {
    var actor = this._actor;

    if (item) {
      if (Imported.YEP_X_Subclass) {
        var subclassId = actor._subclassId;
        var subclass = subclassId > 0 ? $dataClasses[subclassId] : null;
        if (subclass && subclass.lockedSkills.contains(item.id)) return false;
      }

      if (actor.currentClass().lockedSkills.contains(item.id)) return false;
      if (item.lockSkill) return false;
    }

    return true;
  };
})(WAYModuleLoader.getModule('WAY_YEP_EquipBattleSkills'));