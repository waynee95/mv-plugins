/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_MultipleTimers.js
// ===========================================================================
/*:
@plugindesc v1.0.0 Run and display multiple timers. <WAY_MultipleTimers>

@author waynee95

@help
=============================================================================
 ■ Usage
=============================================================================
// TODO: Add desc

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

You can support me on https://ko-fi.com/waynee95
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
  WAYModuleLoader.registerPlugin("WAY_MultipleTimers", "1.0.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

($ => {
  //==========================================================================
  // Game_Timer
  //==========================================================================
  $.alias.Game_Timer_init = Game_Timer.prototype.initialize;
  Game_Timer.prototype.initialize = function() {
    $.alias.Game_Timer_init.call(this);
    this._timers = [];
  };

  Game_Timer.prototype.startTimer = function(id, count) {
    if (this._timers[id]) {
      this._timers[id].frames = count;
    }
  };

  Game_Timer.prototype.createTimer = function(id, onExpire) {
    if (this._timers[id] === undefined) {
      this._timers[id] = {
        frames: 0,
        working: true,
        onExpire
      };
    } else {
      console.error(
        `WAY_MultipleTimers: Timer with id ${id} is already defined!`
      );
    }
  };

  // TODO: Add drawing

  $.alias.Game_Timer_update = Game_Timer.prototype.update;
  Game_Timer.prototype.update = function(sceneActive) {
    $.alias.Game_Timer_update(sceneActive);
    this._timers.forEach(current => {
      if (sceneActive && current.working && current.frames > 0) {
        current.frames--;
        if (current.frames === 0) {
          if (typeof current.onExpire === "function") {
            current.onExpire();
          }
        }
      }
    });
  };

  //==========================================================================
  // PluginManager
  //==========================================================================
  PluginManager.addCommand("Timer", {
    createTimer(id, onExpire) {
      $gameTimer.createTimer(id, onExpire);
    },
    startTimer(id, count) {
      $gameTimer.startTimer(count);
    }
  });
})(WAYModuleLoader.getModule("WAY_MultipleTimers"));
