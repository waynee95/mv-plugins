/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_CustomOnDeathEval.js
// ===========================================================================
/*:
@plugindesc v1.1.1 Run code when a battler dies. <WAY_CustomOnDeathEval>

@author waynee95

@help
==============================================================================
■ Lunatic Mode - Custom On Death Eval
==============================================================================
-- Actor, Class, Enemy, Weapon, Armor, State notetag:

<Custom On Death Eval>
code
</Custom On Death Eval>

This will run when the battler dies. You can use 'user' or 'a' to reference the
died battler. You can use 'killer' or 'b' to reference the battler who killed
the user. Also you can use shortcuts for referencing switches, variables and
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
  WAYModuleLoader.registerPlugin("WAY_CustomOnDeathEval", "1.1.1", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

($ => {
  const { getMultiLineNotetag, trim } = WAY.Util;

  const parseNotetags = obj => {
    obj.customOnDeathEval = getMultiLineNotetag(
      obj.note,
      "Custom On Death Eval",
      null,
      trim
    );
  };

  WAY.EventEmitter.on("load-actor-notetags", parseNotetags);
  WAY.EventEmitter.on("load-class-notetags", parseNotetags);
  WAY.EventEmitter.on("load-enemy-notetags", parseNotetags);
  WAY.EventEmitter.on("load-armor-notetags", parseNotetags);
  WAY.EventEmitter.on("load-weapon-notetags", parseNotetags);
  WAY.EventEmitter.on("load-state-notetags", parseNotetags);

  const byCustomDeathEval = obj => (obj ? obj.customOnDeathEval : "");
  const toCustomDeathEvalCode = (acc, obj) =>
    `${acc}\n${obj.customOnDeathEval || ""}`;

  const evalCustomOnDeathEval = function(code, user, killer) {
    /* eslint-disable */
    const a = user;
    const b = killer;
    const s = $gameSwitches;
    const v = $gameVariables;
    const p = $gameParty;
    try {
      eval(code);
      /* eslint-enable */
    } catch (e) {
      throw e;
    }
  };

  //==========================================================================
  // Game_Battler
  //==========================================================================
  Game_Battler.prototype.customOnDeathEval = function() {
    return this.states()
      .filter(byCustomDeathEval)
      .reduce(toCustomDeathEvalCode, "");
  };

  //==========================================================================
  // Game_Actor
  //==========================================================================
  Game_Actor.prototype.customOnDeathEval = function() {
    let code = Game_Battler.prototype.customOnDeathEval.call(this);
    code += this.equips()
      .filter(byCustomDeathEval)
      .reduce(toCustomDeathEvalCode, "");
    code += `\n${this.currentClass().customOnDeathEval}` || "";
    code += `\n${this.actor().customOnDeathEval}` || "";
    return code;
  };

  //==========================================================================
  // Game_Enemy
  //==========================================================================
  Game_Enemy.prototype.customOnDeathEval = function() {
    let code = Game_Battler.prototype.customOnDeathEval.call(this);
    code += `\n${this.enemy().customOnDeathEval}` || "";
    return code;
  };

  //==========================================================================
  // Game_Action
  //==========================================================================
  $.alias.Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
  Game_Action.prototype.executeHpDamage = function(target, value) {
    $.alias.Game_Action_executeHpDamage.call(this, target, value);
    if (target.hp < 1 || target.isDead()) {
      evalCustomOnDeathEval(target.customOnDeathEval(), target, this.subject());
    }
  };

  // Compatibility with YEP_X_ExtDot
  if (Imported.YEP_X_ExtDot) {
    Game_Battler.prototype.processDamageOverTimeStateEffect = function(state) {
      var stateId = state.id;
      var state = $dataStates[stateId];
      if (!state) return;
      if (state.dotFormula === "") return;
      var a = this.stateOrigin(stateId);
      var b = this;
      var user = this;
      var target = this;
      var origin = this.stateOrigin(stateId);
      var s = $gameSwitches._data;
      var v = $gameVariables._data;
      var healing = false;
      var variance = state.dotVariance;
      var element = state.dotElement;
      var code = state.dotFormula;
      try {
        eval(code);
        if (healing) {
          value = Math.abs(Math.max(0, value));
        } else {
          value = Math.abs(Math.max(0, value)) * -1;
        }
        value = this.applyDamageOverTimeVariance(value, variance);
        value = this.applyDamageOverTimeElement(value, element);
        value = Math.round(value);
        if (value !== 0) {
          this.clearResult();
          this.gainHp(value);
          this.startDamagePopup();
          if (state.dotAnimation > 0) {
            this.startAnimation(state.dotAnimation);
          }
          if (this.isDead()) {
            ///--edit by waynee95
            var evalCustomOnDeathEval = function evalCustomOnDeathEval(
              code,
              user,
              killer
            ) {
              var a = user;
              var b = killer;
              var s = $gameSwitches;
              var v = $gameVariables;
              var p = $gameParty;

              try {
                eval(code);
              } catch (e) {
                throw e;
              }
            };
            evalCustomOnDeathEval(user.customOnDeathEval(), user, user);
            ///--edit by waynee95
            this.performCollapse();
          }
          this.clearResult();
        }
      } catch (e) {
        Yanfly.Util.displayError(
          e,
          code,
          "CUSTOM DOT " + stateId + " CODE ERROR"
        );
      }
    };
  }
})(WAYModuleLoader.getModule("WAY_CustomOnDeathEval"));
