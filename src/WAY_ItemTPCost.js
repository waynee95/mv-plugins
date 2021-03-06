/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_ItemTPCost.js
// ===========================================================================
/*:
@plugindesc v1.1.1 <WAY_ItemTPCost> Allows you to set TP Costs for items.
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

You can support me at https://ko-fi.com/waynee95
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
  WAYModuleLoader.registerPlugin("WAY_ItemTPCost", "1.1.1", "waynee95");
}

($ => {
  const { getNotetag, trim } = WAY.Util;

  WAY.EventEmitter.on("load-item-notetags", item => {
    item._itemTpCost = getNotetag(item.note, "Item TP Cost", null, trim);
  });

  function evalItemCost(user, item) {
    if (item && item._itemTpCost) {
      /* eslint-disable */
      const a = user;
      const s = $gameSwitches._data;
      const v = $gameVariables._data;
      const p = $gameParty;
      const code = item._itemTpCost;
      try {
        return eval(code);
        /* eslint-enable */
      } catch (e) {
        throw e;
      }
    }

    return 0;
  }

  $.alias.Game_Battler_consumeItem = Game_Battler.prototype.consumeItem;
  Game_Battler.prototype.consumeItem = function(item) {
    this.payItemCost(item);
    $.alias.Game_Battler_consumeItem.call(this, item);
  };

  Game_Battler.prototype.payItemCost = function(item) {
    const itemCost = evalItemCost(this, item);
    this._tp -= itemCost;
  };

  Game_Battler.prototype.canPayItemCost = function(item) {
    const itemCost = evalItemCost(this, item);
    return this._tp >= itemCost;
  };

  $.alias.Game_Battler_meetsItemConditions =
    Game_Battler.prototype.meetsItemConditions;
  Game_Battler.prototype.meetsItemConditions = function(item) {
    return (
      this.canPayItemCost(item) &&
      $.alias.Game_Battler_meetsItemConditions.call(this, item)
    );
  };

  Window_ItemList.prototype.isEnabled = function(item) {
    return BattleManager.actor().canUse(item) && $gameParty.canUse(item);
  };
})(WAYModuleLoader.getModule("WAY_ItemTPCost"));
