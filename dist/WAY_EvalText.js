/* globals WAY, WAYModuleLoader, Window_InBattleStateList */
// ===========================================================================
// WAY_EvalText.js
// ===========================================================================

/*:
@plugindesc v2.4.1 Use JavaScript Code in textboxes. <WAY_EvalText>

@author waynee95

@help
>>> To ensure compatibility with other plugins, place this one at the
bottom of your list!

If you are using CGMV_Encyclopedia you also need to install the VE_ControlText
plugin!

=============================================================================
 ■ Usage
=============================================================================
Inside a description or message box, you can put any JavaScript Code
between ${}. It will replace that later with the result of your entered
JavaScript code.

a - references the current selected actor
p - game party
s - game switches
v - game variables
p - game party
item , skill - refers to the actual item or skill you are in.
(If you are inside the description box of skill or item)

>>> It can be possible, that it will not show the correct result. This can
especially happen on custom scenes. This will need a compatibilty fix then.

>> If you would like  to use an "if-else" inside the code block, you need
to use the "?" operator:

if (something) {
*   stuff
} else {
*   other stuff
}

is the same as

something ? stuff : other stuff

=============================================================================
 ■ Terms of Use
=============================================================================
This work is licensed under the MIT license.

More info here: https://github.com/waynee95/mv-plugins/blob/master/LICENSE

=============================================================================
 ■ Contact Information
=============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261

You can support me on https://ko-fi.com/waynee95
*/
"use strict";

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); // eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin("WAY_EvalText", "2.4.1", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  function evalText(text) {
    var currentScene = SceneManager._scene;
    var item = null;
    var skill = null;
    var a = $gameParty.menuActor();

    if (currentScene instanceof Scene_Map) {
      a = $gameParty.leader();
    } else if (currentScene instanceof Scene_ItemBase) {
      if (currentScene._itemWindow) {
        item = currentScene._itemWindow.item();
        skill = currentScene._itemWindow.item();
      }
    } else if (currentScene instanceof Scene_Equip) {
      // if cursor in slot window
      if (currentScene._slotWindow && currentScene._slotWindow.active) {
        item = currentScene._slotWindow.item();
      } // if cursor in item window
      else if (currentScene._itemWindow && currentScene._itemWindow.active) {
          item = currentScene._itemWindow.item();
        }
    } else if (currentScene instanceof Scene_Shop) {
      if (currentScene._sellWindow && currentScene._sellWindow.active) {
        item = currentScene._sellWindow.item();
      } else if (currentScene._buyWindow && currentScene._buyWindow.active) {
        item = currentScene._buyWindow.item();
      }
    } else if (currentScene instanceof Scene_Battle) {
      a = BattleManager.actor();

      if (currentScene._itemWindow) {
        item = currentScene._itemWindow.item();
      }

      if (currentScene._skillWindow) {
        skill = currentScene._skillWindow.item();
      } // Fix for YEP_X_InBattleStatus


      if (Imported.YEP_X_InBattleStatus && currentScene._inBattleStatusWindow && currentScene._inBattleStateList && currentScene._inBattleStateList.active) {
        a = currentScene._inBattleStatusWindow._battler;

        if (currentScene._inBattleStateList) {
          item = currentScene._inBattleStateList.item();
        }
      }
    } // Fix for WAY_StorageSystem


    if (Imported.WAY_StorageSystem && currentScene instanceof Scene_Storage) {
      if (currentScene._storageWindow) {
        item = currentScene._storageWindow.item();
      }
    } // Fix for YEP_X_EquipCustomize


    if (Imported.YEP_X_EquipCustomize && currentScene instanceof Scene_EquipCustomize) {
      if (currentScene._itemActionWindow) {
        item = currentScene.item();
      }
    } // Fix for CGMV_Encyclopedia. This also needs VE_ControlText to be installed


    if (Imported.CGMV_Encyclopedia && currentScene instanceof CGMV_Scene_Encyclopedia) {
      if (currentScene._listWindow && currentScene._listWindow.item()) {
        var symbol = currentScene._listWindow._symbol;

        var id = currentScene._listWindow.item()._id;

        if (symbol === "bestiary") {
          item = $dataEnemies[id];
        } else if (symbol === "items") {
          item = $dataItems[id];
        } else if (symbol === "armors") {
          item = $dataArmors[id];
        } else if (symbol === "weapons") {
          item = $dataWeapons[id];
        } else if (symbol === "skills") {
          item = $dataSkills[id];
        } else if (symbol === "states") {
          item = $dataSkills[id];
        }
      }
    } // Fix for YEP_EquipBattleSkills


    if (Imported.YEP_EquipBattleSkills && currentScene instanceof Scene_Skill) {
      if (currentScene._skillEquipWindow && currentScene._skillEquipWindow.active) {
        item = currentScene._skillEquipWindow.item();
        skill = item;
      }
    } // Fix for YEP_SkillLearnSystem


    if (Imported.YEP_SkillLearnSystem && currentScene instanceof Scene_LearnSkill) {
      if (currentScene._skillLearnWindow.active) {
        item = currentScene._skillLearnWindow.item();
        skill = item;
      }
    }

    return text.replace(/\${[^{}\\]+(?=\})}/g, function (code) {
      try {
        var s = $gameSwitches;
        var v = $gameVariables;
        var p = $gameParty;
        return eval(code.substring(2, code.length - 1)); // eslint-disable-line no-eval
      } catch (e) {
        return e;
      }
    });
  } // Fix for YEP_X_InBattleStatusWindow


  if (Imported.YEP_X_InBattleStatus) {
    $.alias.Window_InBattleStateList = Window_InBattleStateList.prototype.setBattler;

    Window_InBattleStateList.prototype.setBattler = function (battler) {
      $.alias.Window_InBattleStateList.call(this, battler);

      this._helpWindow.refresh();
    };
  } //==========================================================================
  // Window_Base
  //==========================================================================


  $.alias.WindowBase_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;

  Window_Base.prototype.convertEscapeCharacters = function (text) {
    return $.alias.WindowBase_convertEscapeCharacters.call(this, evalText(text));
  };

  if (Imported.YEP_X_MessageMacros1) {
    $.alias.Window_Base_convertMacroText = Window_Base.prototype.convertMacroText;

    Window_Base.prototype.convertMacroText = function (text) {
      return evalText($.alias.Window_Base_convertMacroText.call(this, text));
    };
  }
})(WAYModuleLoader.getModule("WAY_EvalText"));