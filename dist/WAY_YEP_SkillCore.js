/* globals WAY, WAYModuleLoader, Yanfly */
// ===========================================================================
// WAY_YEP_SkillCore.js
// ===========================================================================

/*:
@plugindesc v1.2.0 Addon to Yanfly's Skill Core Plugin. <WAY_YEP_SkillCore>

@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================

-- Actor Notetag:
<Hide SType: x>
<Hide SType: x, x, x>
<Hide SType: x to y>
This will hide the skillTypes in the Actor Command Window.

-- Skill Notetag:
<Custom HP Cost Text Eval>
if (user.hp >= 0.2 * user.mhp) {
*    text = "\\fs[20]" + "\\c[18]" + 3 + "%" + "\\i[162]";
} else {
*    text = "\\fs[20]" + "\\c[18]" + cost + "\\i[162]";
}
</Custom HP Cost Text Eval>
This will override the normal HP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill hp cost.

<Custom MP Cost Text Eval>
if (user.mp >= 0.2 * user.mmp) {
*    text = "\\fs[20]" + "\\c[23]" + 3 + "%" + "\\i[160]";
} else {
*    text = "\\fs[20]" + "\\c[23]" + cost + "\\i[160]";
}
</Custom MP Cost Text Eval>
This will override the normal MP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill mp cost.

<Custom TP Cost Text Eval>
if (user.tp >= 0.2 * user.maxTp()) {
*    text = "\\fs[20]" + "\\c[29]" + 3 + "%" + "\\i[164]";
} else {
*    text = "\\fs[20]" + "\\c[29]" + cost + "\\i[164]";
}
</Custom TP Cost Text Eval>
This will override the normal TP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill mp cost.

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
  WAYModuleLoader.registerPlugin("WAY_YEP_SkillCore", "1.2.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.1"
  });
}

(function ($) {
  var _WAY$Util = WAY.Util,
      getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
      getNotetag = _WAY$Util.getNotetag,
      toArray = _WAY$Util.toArray,
      trim = _WAY$Util.trim,
      difference = _WAY$Util.difference;
  WAY.EventEmitter.on("load-actor-notetags", function (actor) {
    actor.hiddenSTypes = getNotetag(actor.note, "Hide SType", [], toArray);
  });
  WAY.EventEmitter.on("load-skill-notetags", function (skill) {
    skill.customHpCostTextEval = getMultiLineNotetag(skill.note, "Custom HP Cost Text Eval", "", trim);
    skill.customMpCostTextEval = getMultiLineNotetag(skill.note, "Custom MP Cost Text Eval", "", trim);
    skill.customTpCostTextEval = getMultiLineNotetag(skill.note, "Custom TP Cost Text Eval", "", trim);
  }); //==========================================================================
  // Window_ActorCommand
  //==========================================================================

  $.alias.Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;

  Window_ActorCommand.prototype.addSkillCommands = function () {
    var _this = this;

    var _this$_actor$actor = this._actor.actor(),
        hiddenSTypes = _this$_actor$actor.hiddenSTypes;

    var skillTypes = this._actor.addedSkillTypes();

    skillTypes = difference(skillTypes, hiddenSTypes);
    skillTypes.sort(function (a, b) {
      return a - b;
    });
    skillTypes.forEach(function (stypeId) {
      var name = $dataSystem.skillTypes[stypeId];

      _this.addCommand(name, "skill", true, stypeId);
    });
  };

  function customCostTextEval(skill, cost, code, a) {
    var text = "";
    /* eslint-disable */

    var user = a;
    var subject = a;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var p = $gameParty;

    try {
      eval(code);
      /* eslint-enable */
    } catch (e) {
      throw e;
    }

    return text;
  } //==========================================================================
  // Window_SkillList
  //==========================================================================


  $.alias.Window_SkillList_drawHpCost = Window_SkillList.prototype.drawHpCost;

  Window_SkillList.prototype.drawHpCost = function (skill, wx, wy, dw) {
    var cost = this._actor.skillHpCost(skill);

    var code = skill.customHpCostTextEval;

    if (cost > 0 && code !== "") {
      var text = customCostTextEval(skill, cost, code, this._actor);
      return this.drawCustomCostText(text, wx, wy, dw);
    }

    return $.alias.Window_SkillList_drawHpCost.call(this, skill, wx, wy, dw);
  };

  $.alias.Window_SkillList_drawMpCost = Window_SkillList.prototype.drawMpCost;

  Window_SkillList.prototype.drawMpCost = function (skill, wx, wy, dw) {
    var cost = this._actor.skillMpCost(skill);

    var code = skill.customMpCostTextEval;

    if (cost > 0 && code !== "") {
      var text = customCostTextEval(skill, cost, code, this._actor);
      return this.drawCustomCostText(text, wx, wy, dw);
    }

    return $.alias.Window_SkillList_drawMpCost.call(this, skill, wx, wy, dw);
  };

  $.alias.Window_SkillList_drawTpCost = Window_SkillList.prototype.drawTpCost;

  Window_SkillList.prototype.drawTpCost = function (skill, wx, wy, dw) {
    var cost = this._actor.skillTpCost(skill);

    var code = skill.customTpCostTextEval;

    if (cost > 0 && code !== "") {
      var text = customCostTextEval(skill, cost, code, this._actor);
      return this.drawCustomCostText(text, wx, wy, dw);
    }

    return $.alias.Window_SkillList_drawTpCost.call(this, skill, wx, wy, dw);
  };

  Window_SkillList.prototype.drawCustomCostText = function (text, wx, wy, dw) {
    var width = this.textWidthEx(text);
    this.drawTextEx(text, wx - width + dw, wy);
    var returnWidth = dw - width - Yanfly.Param.SCCCostPadding;
    this.resetFontSettings();
    return returnWidth;
  };
})(WAYModuleLoader.getModule("WAY_YEP_SkillCore"));