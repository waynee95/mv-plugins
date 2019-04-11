/* globals WAY, WAYModuleLoader, Window_InBattleStateList */
// ===========================================================================
// WAY_EvalText.js
// ===========================================================================

/*:
@plugindesc v1.2.1 Use JavaScript Code in textboxes. <WAY_EvalText>

@author waynee95

@help
>>> If you are using YEP_X_InBattleStatus, make sure to place this plugin
below that!

==============================================================================
 ■ Usage
==============================================================================
Inside a description or message box, you can put any JavaScript Code between
${}. It will replace that later with the result of your entered JavaScript code.

a - references the current selected actor (or the leader if there is no)
p - game party
s - game switches
v - game variables
p - game party
item , skill - refers to the actual item or skill you are in. (If you are inside
the description box of skill or item)

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

You can support me on https://ko-fi.com/waynee.
*/
"use strict";

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); //eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin("WAY_EvalText", "1.2.1", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  var evalText = function evalText(text) {
    var scene = SceneManager._scene;
    var a = $gameParty.leader();
    var item = scene instanceof Scene_ItemBase && scene._itemWindow ? scene._itemWindow.item() : a;
    /* eslint-disable */

    var skill = item;
    var s = $gameSwitches;
    var v = $gameVariables;
    var p = $gameParty;
    /* eslint-enable */

    if (scene instanceof Scene_MenuBase) {
      a = $gameParty.menuActor();
    } else if (scene instanceof Scene_Battle) {
      a = BattleManager.actor();
      item = scene && scene._itemWindow ? scene._itemWindow.item() : a;
      skill = scene && scene._skillWindow ? scene._skillWindow.item() : a;
    } // Fix for YEP_X_InBattleStatusWindow


    if (Imported.YEP_X_InBattleStatus && $gameParty.inBattle() && SceneManager._scene._inBattleStatusWindow.visible) {
      a = SceneManager._scene._inBattleStatusWindow._battler;
    }

    return text.replace(/\${[^{}\\]+(?=\})}/g, function (code) {
      try {
        return eval(code.substring(2, code.length - 1)); // eslint-disable-line no-eval
      } catch (e) {
        return "";
      }
    });
  }; // Fix for YEP_X_InBattleStatusWindow


  if (Imported.YEP_X_InBattleStatus) {
    $.alias.Window_InBattleStateList = Window_InBattleStateList.prototype.setBattler;

    Window_InBattleStateList.prototype.setBattler = function (battler) {
      $.alias.Window_InBattleStateList.call(this, battler);

      this._helpWindow.refresh();
    };
  } //= =========================================================================
  // Window_Base
  //= =========================================================================


  $.alias.WindowBase_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;

  Window_Base.prototype.convertEscapeCharacters = function (text) {
    return $.alias.WindowBase_convertEscapeCharacters.call(this, evalText(text));
  };
})(WAYModuleLoader.getModule("WAY_EvalText"));