/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_ItemTPCost.js
// ===========================================================================

/*:
@plugindesc v1.0.0 <WAY_ItemTPCost> Allows you to set TP Costs for items.
@author waynee95

@help
==============================================================================
 ■ Usage
==============================================================================
--- Item Notetag:

<Item TP Cost: x>

Examples:
*   <Item TP Cost: 25>
*   <Item TP Cost: user.atk * 0.2>

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

You can support me at https://ko-fi.com/waynee
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
  WAYModuleLoader.registerPlugin("WAY_ItemTPCost", "1.0.0", "waynee95");
}

(function ($) {
  var _WAY$Util = WAY.Util,
      getNotetag = _WAY$Util.getNotetag,
      trim = _WAY$Util.trim;
  WAY.EventEmitter.on("load-item-notetags", function (item) {
    item._itemTpCost = getNotetag(item.note, "Item TP Cost", null, trim);
  });

  function evalItemCost(user, item) {
    if (item && item._itemTpCost) {
      /* eslint-disable */
      var a = user;
      var s = $gameSwitches._data;
      var v = $gameVariables._data;
      var p = $gameParty;
      var code = item._itemTpCost;

      try {
        return eval(code);
        /* eslint-enable */
      } catch (e) {
        throw e;
      }
    }

    return true;
  }

  $.alias.Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;

  Game_BattlerBase.prototype.refresh = function () {
    this._tp = Math.floor(this._tp);
    $.alias.Game_BattlerBase_refresh.call(this);
  };

  $.alias.Game_Battler_consumeItem = Game_Battler.prototype.consumeItem;

  Game_Battler.prototype.consumeItem = function (item) {
    this.payItemCost(item);
    $.alias.Game_Battler_consumeItem.call(this, item);
  };

  Game_Battler.prototype.payItemCost = function (item) {
    var itemCost = evalItemCost(this, item);
    this._tp -= itemCost;
  };

  Game_Battler.prototype.canPayItemCost = function (item) {
    var itemCost = evalItemCost(this, item);
    return this._tp >= itemCost;
  };

  $.alias.Game_Battler_meetsItemConditions = Game_Battler.prototype.meetsItemConditions;

  Game_Battler.prototype.meetsItemConditions = function (item) {
    return this.canPayItemCost(item) && $.alias.Game_Battler_meetsItemConditions.call(this, item);
  };

  Window_ItemList.prototype.isEnabled = function (item) {
    return $gameParty.menuActor().canUse(item) && $gameParty.canUse(item);
  };
})(WAYModuleLoader.getModule("WAY_ItemTPCost"));