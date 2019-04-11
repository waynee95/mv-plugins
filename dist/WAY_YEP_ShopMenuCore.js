/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_YEP_ShopMenuCore.js
// ===========================================================================

/*:
@plugindesc v1.1.1 Addon to Yanfly's Shop Menu Core Plugin. <WAY_YEP_ShopMenuCore>
@author waynee95

@help
==============================================================================
 ■ Lunatic Mode - Custom Shop Show Requirements
==============================================================================

For those who would like to show certain items only if a certain condition
is met. Use the following Lunatic Code:

Item Notetag:
<Custom Buy Show Eval>
visible = !$gameParty.hasItem(item);
</Custom Buy Show Eval>

If the visible is set to false, the item will not appear in the shop.

<Custom Buy Enable Eval>
enable = $gameSwitches.value(1);
</Custom Buy Enable Eval>

If enable is set to false, the item will be greyed out in the shop.

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
  WAYModuleLoader.registerPlugin("WAY_YEP_ShopMenuCore", "1.1.1", "waynee95");
}

(function ($) {
  var _WAY$Util = WAY.Util,
      getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
      trim = _WAY$Util.trim;

  var parseNotetags = function parseNotetags(obj) {
    obj.customBuyShowEval = getMultiLineNotetag(obj.note, "Custom Buy Show Eval", null, trim);
    obj.customBuyEnableEval = getMultiLineNotetag(obj.note, "Custom Buy Enable Eval", null, trim);
  };

  WAY.EventEmitter.on("load-item-notetags", parseNotetags);
  WAY.EventEmitter.on("load-weapon-notetags", parseNotetags);
  WAY.EventEmitter.on("load-armor-notetags", parseNotetags);

  var meetsCustomBuyShowEval = function meetsCustomBuyShowEval(item) {
    if (!item || item.customBuyShowEval === null) {
      return true;
    }

    var visible = true;
    /* eslint-disable */

    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var p = $gameParty;

    try {
      eval(item.customBuyShowEval);
      /* eslint-enable */
    } catch (e) {
      throw e;
    }

    return visible;
  };

  var meetsCustomBuyEnableEval = function meetsCustomBuyEnableEval(item) {
    if (!item || item.customBuyEnableEval === null) {
      return true;
    }
    /* eslint-disable */


    var enable = true;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var p = $gameParty;

    try {
      eval(item.customBuyEnableEval);
      /* eslint-disable */
    } catch (e) {
      throw e;
    }

    return enable;
  };

  $.alias.Window_ShopBuy_makeItemList = Window_ShopBuy.prototype.makeItemList;

  Window_ShopBuy.prototype.makeItemList = function () {
    $.alias.Window_ShopBuy_makeItemList.call(this);
    this._data = this._data.filter(function (item) {
      return meetsCustomBuyShowEval(item);
    });
  };

  $.alias.Window_ShopBuy_isEnabled = Window_ShopBuy.prototype.isEnabled;

  Window_ShopBuy.prototype.isEnabled = function (item) {
    var condition = $.alias.Window_ShopBuy_isEnabled.call(this, item);
    return condition && meetsCustomBuyEnableEval(item);
  };

  $.alias.Scene_Shop_onBuyOk = Scene_Shop.prototype.onBuyOk;

  Scene_Shop.prototype.onBuyOk = function () {
    $.alias.Scene_Shop_onBuyOk.call(this);

    this._buyWindow.refresh();
  };
})(WAYModuleLoader.getModule("WAY_YEP_ShopMenuCore"));