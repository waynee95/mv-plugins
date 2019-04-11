/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_YEP_ItemCore.js
// ===========================================================================
/*:
@plugindesc v1.2.0 Addon to Yanfly's Item Core Plugin. <WAY_YEP_ItemCore>

@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Items, Weapons, Armors, Skills Notetag:
<Icon Background: x>

Specify an icon index that will show a certain icon behind the normal icon.

==============================================================================
 ■ Lunatic Mode - Custom Name Eval
==============================================================================
For those who would like to have different items to have the name based on
certain conditions:

Item, Weapon, Armor and Skill Notetag:
<Custom Name Eval>
name = "Holy Sword " + $gameVariables.value(1);
</Custom Name Eval>

==============================================================================
 ■ Lunatic Mode - Custom TextColor Eval
==============================================================================
For those who would like to have different text colors of certain items based
on an eval:

Item, Weapon, Armor and Skill Notetag:
<Custom TextColor Eval>
var sum = item.params.reduce(function (a, b) {
    return a + b;
    }, 0);
if (sum < 20) {
    textColor = 14;
} else {
    textColor = 27;
}
</Custom TextColor Eval>

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
  WAYModuleLoader.registerPlugin("WAY_YEP_ItemCore", "1.2.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(() => {
  const { getNotetag, getMultiLineNotetag, trim, toInt } = WAY.Util;

  const parseNotetags = obj => {
    obj.customNameEval = getMultiLineNotetag(
      obj.note,
      "Custom Name Eval",
      null,
      trim
    );
    obj.customTextColorEval = getMultiLineNotetag(
      obj.note,
      "custom textcolor eval",
      null,
      trim
    );
    obj.iconBackground = getNotetag(obj.note, "Icon Background", null, toInt);
  };

  WAY.EventEmitter.on("load-item-notetags", parseNotetags);
  WAY.EventEmitter.on("load-weapon-notetags", parseNotetags);
  WAY.EventEmitter.on("load-armor-notetags", parseNotetags);
  WAY.EventEmitter.on("load-skill-notetags", parseNotetags);

  const evalCustomName = item => {
    const { customNameEval } = item;
    if (!customNameEval || customNameEval === "") return item.name;
    /* eslint-disable */
    let name = "";
    const s = $gameSwitches;
    const v = $gameVariables;
    const p = $gameParty;
    try {
      eval(customNameEval);
      /* eslint-enable */
    } catch (e) {
      throw e;
    }
    return name;
  };

  const evalCustomTextColor = item => {
    const { customTextColorEval } = item;
    if (!customTextColorEval || customTextColorEval === "") return 0;
    /* eslint-disable */
    let textColor = 0;
    const s = $gameSwitches;
    const v = $gameVariables;
    const p = $gameParty;
    try {
      eval(customTextColorEval);
      /* eslint-enable */
    } catch (e) {
      throw e;
    }
    return textColor;
  };

  //==========================================================================
  // Window_Base
  //==========================================================================
  Window_Base.prototype.setItemTextColorEval = function(item) {
    if (!item) return;
    this._resetTextColor = evalCustomTextColor(item) || item.textColor;
  };

  Window_Base.prototype.drawItemName = function(item, x, y, width = 312) {
    if (item) {
      this.setItemTextColor(item);
      this.setItemTextColorEval(item);
      const iconBoxWidth = Window_Base._iconWidth + 4;
      if (item.iconBackground) {
        this.drawIcon(item.iconBackground, x + 2, y + 2);
      }
      this.drawIcon(item.iconIndex, x + 2, y + 2);
      const itemName = evalCustomName(item);
      this.resetTextColor();
      this.drawText(itemName, x + iconBoxWidth, y, width - iconBoxWidth);
      this._resetTextColor = undefined;
      this.resetTextColor();
    }
  };
})(WAYModuleLoader.getModule("WAY_YEP_ItemCore"));
