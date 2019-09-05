/* globals WAY, WAYModuleLoader, Window_InBattleStateList */
// ===========================================================================
// WAY_EvalText.js
// ===========================================================================
/*:
@plugindesc v2.0.0 Use JavaScript Code in textboxes. <WAY_EvalText>

@author waynee95

@help
>>> To ensure compatibility with other plugins, place this one at the
bottom of your list!

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

You can support me on https://ko-fi.com/waynee.
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
  WAYModuleLoader.registerPlugin("WAY_EvalText", "2.0.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

($ => {
  function evalText(text) {
    const currentScene = SceneManager._scene;
    let item = null;
    let skill = null;
    let a = $gameParty.menuActor();

    if (currentScene instanceof Scene_ItemBase) {
      if (currentScene._itemWindow) {
        item = currentScene._itemWindow.item();
        skill = currentScene._itemWindow.item();
      }
    } else if (currentScene instanceof Scene_Equip) {
      item = currentScene._slotWindow.item();
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
      }

      // Fix for YEP_X_InBattleStatus
      if (
        Imported.YEP_X_InBattleStatus &&
        currentScene._inBattleStatusWindow &&
        currentScene._inBattleStatusWindow.active
      ) {
        a = currentScene._inBattleStatusWindow._battler;
        if (currentScene._inBattleStateList) {
          item = currentScene._inBattleStateList.item();
        }
      }
    }

    // Fix for WAY_StorageSystem
    if (Imported.WAY_StorageSystem && currentScene instanceof Scene_Storage) {
      if (currentScene._storageWindow) {
        item = currentScene._storageWindow.item();
      }
    }

    return text.replace(/\${[^{}\\]+(?=\})}/g, code => {
      try {
        const s = $gameSwitches;
        const v = $gameVariables;
        const p = $gameParty;
        return eval(code.substring(2, code.length - 1)); // eslint-disable-line no-eval
      } catch (e) {
        return e;
      }
    });
  }

  // Fix for YEP_X_InBattleStatusWindow
  if (Imported.YEP_X_InBattleStatus) {
    $.alias.Window_InBattleStateList =
      Window_InBattleStateList.prototype.setBattler;
    Window_InBattleStateList.prototype.setBattler = function(battler) {
      $.alias.Window_InBattleStateList.call(this, battler);
      this._helpWindow.refresh();
    };
  }

  //==========================================================================
  // Window_Base
  //==========================================================================
  $.alias.WindowBase_convertEscapeCharacters =
    Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    return $.alias.WindowBase_convertEscapeCharacters.call(
      this,
      evalText(text)
    );
  };
})(WAYModuleLoader.getModule("WAY_EvalText"));
