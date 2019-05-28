/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_CustomOnEquipEval.js
// ===========================================================================

/*:
@plugindesc v1.2.1 Run code when an actor equips or unequips an item. <WAY_CustomOnEquipEval>

@author waynee95

@help
==============================================================================
 ■ Compatibility
==============================================================================
This plugin needs to be below YEP EquipCore and Ramza_DualWield, if you are
using said plugins!

==============================================================================
 ■ Lunatic Mode - Custom On Equip Eval
==============================================================================
Weapon and Armor Notetag:

<Custom On Equip Eval>
code
</Custom On Equip Eval>
This code will run when an actor equips the item. You can use 'user' or 'a' to
reference the actor who equipped the item. To reference the item you can use
'item'. Also you can use shortcuts for referencing switches, variables and
the game party. Instead of using $gameSwitches, $gameVariables and $gameParty,
you can just use s, v, and p.

<Custom On Remove Equip Eval>
code
</Custom On Remove Equip Eval>
This code will run when an actor unequips the item. You can use 'user' or 'a' to
reference the actor who unequipped the item. To reference the item you can use
'item'. Also you can use shortcuts for referencing switches, variables and
the game party. Instead of using $gameSwitches, $gameVariables and $gameParty,
you can just use s, v, and p.

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
"use strict";

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); //eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin("WAY_CustomOnEquipEval", "1.2.1", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  var _WAY$Util = WAY.Util,
      getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
      trim = _WAY$Util.trim;
  var CUSTOM_ON_EQUIP_EVAL = "customOnEquipEval";
  var CUSTOM_ON_REMOVE_EQUIP_EVAL = "customOnRemoveEquipEval";

  var parseNotetags = function parseNotetags(obj) {
    obj.customOnEquipEval = getMultiLineNotetag(obj.note, "Custom On Equip Eval", null, trim);
    obj.customOnRemoveEquipEval = getMultiLineNotetag(obj.note, "Custom On Remove Equip Eval", null, trim);
  };

  WAY.EventEmitter.on("load-weapon-notetags", parseNotetags);
  WAY.EventEmitter.on("load-armor-notetags", parseNotetags);

  var evalCode = function evalCode(user, item, type) {
    if (item && item[type]) {
      /* eslint-disable */
      var a = user;
      var s = $gameSwitches._data;
      var v = $gameVariables._data;
      var p = $gameParty;
      var code = item[type];

      try {
        return eval(code);
        /* eslint-enable */
      } catch (e) {
        throw e;
      }
    }

    return false;
  }; //==========================================================================
  // Game_Actor
  //==========================================================================


  $.alias.Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;

  Game_Actor.prototype.changeEquip = function () {
    var _this = this;

    var equips = this.equips();

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    $.alias.Game_Actor_changeEquip.apply(this, args);
    this.equips().forEach(function (item, slotId) {
      if (item !== equips[slotId]) {
        evalCode(_this, equips[slotId], CUSTOM_ON_REMOVE_EQUIP_EVAL);
        evalCode(_this, item, CUSTOM_ON_EQUIP_EVAL);
      }
    });
  };

  if (!Imported.YEP_EquipCore) {
    $.alias.Game_Actor_initEquips = Game_Actor.prototype.initEquips;

    Game_Actor.prototype.initEquips = function () {
      var _this2 = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      $.alias.Game_Actor_initEquips.apply(this, args);
      this.equips().forEach(function (item) {
        evalCode(_this2, item, CUSTOM_ON_EQUIP_EVAL);
      });
    };
  } else {
    $.alias.Game_Actor_equipInitEquips = Game_Actor.prototype.equipInitEquips;

    Game_Actor.prototype.equipInitEquips = function () {
      var _this3 = this;

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      $.alias.Game_Actor_equipInitEquips.apply(this, args);
      this.equips().forEach(function (item) {
        evalCode(_this3, item, CUSTOM_ON_EQUIP_EVAL);
      });
    };
  }
})(WAYModuleLoader.getModule("WAY_CustomOnEquipEval"));