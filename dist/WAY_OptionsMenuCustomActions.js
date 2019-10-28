/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_OptionsMenuCustomActions.js
// ===========================================================================

/*:
@plugindesc v1.0.0 Add custom commands to Options Menu. <WAY_OptionsMenuCustomActions>

@param actions
@text Custom Actions
@desc Add custom actions to the Options Menu
@type struct<CustomAction>[]
@default []

@author waynee95

@help
This plugin allows you to add custom commands to the Options Menu, which will
run any JavaScript code specified.

Example:

----------------------------------------
commandName: Say Hello
action     : console.log("hello world");
show       : true
----------------------------------------

This plugin was built because someone wanted to have a command to delte all
save files in one blow. Be careful with this!!!

----------------------------------------
commandName: Delete Savefiles
action     :  for (var i = 1; i < DataManager.maxSavefiles(); i++) {
*                 if (StorageManager.exists(i)) {
*                   StorageManager.remove(i);
*                 }
*               }
show: $gameSwitches.value(1)
----------------------------------------

If the show condition evaluates to true, the command will appear in the
Options Menu.

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
  WAYModuleLoader.registerPlugin("WAY_OptionsMenuCustomActions", "1.0.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  //==========================================================================
  // Window_Options
  //==========================================================================
  $.alias.Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;

  Window_Options.prototype.makeCommandList = function () {
    var _this = this;

    $.alias.Window_Options_makeCommandList.call(this);
    $.parameters.actions.forEach(function (_ref) {
      var commandName = _ref.commandName,
          action = _ref.action,
          show = _ref.show;

      if (eval(show)) {
        _this.addCommand(commandName, "custom_action", true, action);
      }
    });
  };

  $.alias.Window_Optionss_statusText = Window_Options.prototype.statusText;

  Window_Options.prototype.statusText = function (index) {
    var symbol = this.commandSymbol(index);

    if (symbol === "custom_action") {
      return "";
    } else {
      return $.alias.Window_Optionss_statusText.call(this, index);
    }
  };

  $.alias.Window_Optionss_processOk = Window_Options.prototype.processOk;

  Window_Options.prototype.processOk = function () {
    var index = this.index();
    var symbol = this.commandSymbol(index);

    if (symbol === "custom_action") {
      var f = this.currentExt();

      try {
        eval(f);
      } catch (e) {
        console.error(e);
      }
    } else {
      $.alias.Window_Optionss_processOk.call(this);
    }
  };
})(WAYModuleLoader.getModule("WAY_OptionsMenuCustomActions")); //-----------------------------------------------------------------------------
//

/*~struct~CustomAction:
@param commandName
@text Command Name
@type text
@default

@param action
@text Custom Action
@type note
@default

@param show
@text Show Condition
@type text
@default true
*/