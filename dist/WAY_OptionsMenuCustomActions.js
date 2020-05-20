/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_OptionsMenuCustomActions.js
// ===========================================================================

/*:
@plugindesc v2.0.0 Add custom commands to Options Menu. <WAY_OptionsMenuCustomActions>

@param actions
@text Custom Actions
@desc Add custom actions to the Options Menu
@type struct<CustomAction>[]
@default ["{\"commandName\":\"Toggle Switch 1\",\"displayText\":\"\\\"$gameSwitches.value(1) ? \\\\\\\"ON\\\\\\\" : \\\\\\\"OFF\\\\\\\"\\\"\",\"action\":\"\\\"$gameSwitches.setValue(1, !$gameSwitches.value(1))\\\"\",\"show\":\"true\"}","{\"commandName\":\"Print hello world\",\"displayText\":\"\\\"\\\"\",\"action\":\"\\\"console.log(\\\\\\\"hello world\\\\\\\");\\\"\",\"show\":\"true\"}","{\"commandName\":\"Difficulty\",\"displayText\":\"\\\"$gameVariables.value(1)\\\"\",\"action\":\"\\\"$gameVariables.setValue(1, ($gameVariables.value(1) + 1) % 3);\\\"\",\"show\":\"true\"}"]
@author waynee95

@help
This plugin allows you to add custom commands to the Options Menu, which will
run any JavaScript code specified.

To create new commands, go to the plugin settings  for this plugin. The
parameters consist of a list of custom commands, called actions.

For a custom action, you have to specify a few parameters:

1. Command Name
This is the name that will show up in the options window for this command.

2. Display Text (optional)
You can specify any text that will show on the right-hand side of the
command name. This can be anything. You can take a look at the examples below.
If you do not want to display any text, leave this blank.

3. Custom Action
This can be any JavaScript code you want. This code will be executed when
the command is clicked inside the options menu.

4. Show Condition
This determines whether the command will show up in the options menu. If it
should be visible all the time, just input true.

Examples:

1) This shows how to add a command  that will toggle the switch with id 1 on
and off. It will display the current status of that switch on the right.

----------------------------------------
commandName : Toggle Switch 1
action      : $gameSwitches.setValue(1, !$gameSwitches.value(1))
displayText : $gameSwitches.value(1) ? "ON" : "OFF"
show        : true
----------------------------------------

2) Or you can use it to display variables. This could be used for some kind of
difficulty modifier or something like that.

----------------------------------------
commandName : Difficulty
action      : $gameVariables.value(1)
displayText : $gameVariables.setValue(1, ($gameVariables.value(1) + 1) % 3)
show        : true
----------------------------------------

When you click on the difficulty setting, it would cycle through the values 0
to 3.

3) Here, the command will print "hello world" to the console. Since
displayText is left blank, this command will have no text displayed
on the right.

----------------------------------------
commandName : Say Hello
action      : console.log("hello world");
displayText :
show        : true
----------------------------------------

4) This plugin was built because someone wanted to have a command to delete
all save files in one blow. Be careful with this!!!

----------------------------------------
commandName : Delete Savefiles
action      :  for (var i = 1; i < DataManager.maxSavefiles(); i++) {
*                 if (StorageManager.exists(i)) {
*                   StorageManager.remove(i);
*                 }
*               }
displayText :
show        : $gameSwitches.value(1)
----------------------------------------

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
  WAYModuleLoader.registerPlugin("WAY_OptionsMenuCustomActions", "2.0.0", "waynee95", {
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
          displayText = _ref.displayText,
          action = _ref.action,
          show = _ref.show;

      if (eval(show)) {
        _this.addCommand(commandName, "custom_action", true, {
          displayText: displayText,
          action: action
        });
      }
    });
  };

  $.alias.Window_Options_statusText = Window_Options.prototype.statusText;

  Window_Options.prototype.statusText = function (index) {
    var symbol = this.commandSymbol(index);

    if (symbol === "custom_action") {
      var ext = this._list[index].ext;
      return ext.displayText ? eval(ext.displayText) : "";
    }

    return $.alias.Window_Options_statusText.call(this, index);
  };

  $.alias.Window_Optionss_processOk = Window_Options.prototype.processOk;

  Window_Options.prototype.processOk = function () {
    var index = this.index();
    var symbol = this.commandSymbol(index);

    if (symbol === "custom_action") {
      var f = this.currentExt().action;

      try {
        eval(f);
        this.redrawCurrentItem();
        SoundManager.playCursor();
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

@param displayText
@text Display Text
@type note
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