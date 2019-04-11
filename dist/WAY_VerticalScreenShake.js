/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_VerticalScreenShake.js
// ===========================================================================

/*:
@plugindesc v1.1.0 Adds Vertical Screen Shake. <WAY_VerticalScreenShake>

@author waynee95

@help
==============================================================================
 ■ Plugin Command
==============================================================================
VerticalScreenShake start power speed duration

VerticalScreenShake - Main Command Identifier
start - Command to start the screen shake
power - optional, default: 5
speed - optional, default: 5
duration - optional, default: 60

>>> If you want to wait for completion, you need to insert a wait command
after the Plugin Command with the same duration!

==============================================================================
 ■ Scriptcall
==============================================================================
$gameScreen.startShakeY(power, speed, duration);

>>> If you want to wait for completion, you need to insert a wait command
after the ScriptCall with the same duration!

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
  WAYModuleLoader.registerPlugin("WAY_VerticalScreenShake", "1.1.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  //==========================================================================
  // Spriteset_Base
  //==========================================================================
  $.alias.Spriteset_Base_updatePosition = Spriteset_Base.prototype.updatePosition;

  Spriteset_Base.prototype.updatePosition = function () {
    $.alias.Spriteset_Base_updatePosition.call(this);
    this.y += Math.round($gameScreen.shakeY());
  }; //==========================================================================
  // Game_Screen
  //==========================================================================


  $.alias.Game_Screen_clear = Game_Screen.prototype.clear;

  Game_Screen.prototype.clear = function () {
    $.alias.Game_Screen_clear.call(this);
    this.clearShakeY();
  };

  $.alias.Game_Screen_onBattleStart = Game_Screen.prototype.onBattleStart;

  Game_Screen.prototype.onBattleStart = function () {
    $.alias.Game_Screen_onBattleStart.call(this);
    this.clearShakeY();
  };

  $.alias.Game_Screen_update = Game_Screen.prototype.update;

  Game_Screen.prototype.update = function () {
    $.alias.Game_Screen_update.call(this);
    this.updateShakeY();
  };

  Game_Screen.prototype.shakeY = function () {
    return this._shakeY;
  };

  Game_Screen.prototype.clearShakeY = function () {
    this._shakePowerY = 0;
    this._shakeSpeedY = 0;
    this._shakeDurationY = 0;
    this._shakeDirectionY = 1;
    this._shakeY = 0;
  };

  Game_Screen.prototype.updateShakeY = function () {
    if (this._shakeDurationY > 0 || this._shakeY !== 0) {
      var delta = this._shakePowerY * this._shakeSpeedY * this._shakeDirectionY / 10;

      if (this._shakeDurationY <= 1 && this._shakeY * (this._shakeY + delta) < 0) {
        this._shakeY = 0;
      } else {
        this._shakeY += delta;
      }

      if (this._shakeY > this._shakePowerY * 2) {
        this._shakeDirectionY = -1;
      }

      if (this._shakeY < -this._shakePowerY * 2) {
        this._shakeDirectionY = 1;
      }

      this._shakeDurationY--;
    }
  };

  Game_Screen.prototype.startShakeY = function (power, speed, duration) {
    this._shakePowerY = power;
    this._shakeSpeedY = speed;
    this._shakeDurationY = duration;
  }; //==========================================================================
  // PluginManager
  //==========================================================================


  PluginManager.addCommand("VerticalScreenShake", {
    start: function start() {
      var power = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
      $gameScreen.startShakeY(power, speed, duration);
    }
  });
})(WAYModuleLoader.getModule("WAY_VerticalScreenShake"));