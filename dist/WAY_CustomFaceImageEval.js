/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_CustomFaceImageEval.js
// ===========================================================================

/*:
@plugindesc v1.1.2 Set different face images using Lunatic Code. <WAY_CustomFaceImageEval>

@author waynee95

@help
==============================================================================
Plugin Compatibility
==============================================================================
When you are using YEP_X_TurnOrderDisplay plugin, make sure THIS plugin is
placed below it.

==============================================================================
 ■ Lunatic Mode - Custom Face Image Eval
==============================================================================
--- Actor Notetag:

<Custom Face Image Eval>
if (user.hp / user.mhp <= 0) {
    faceName = 'Actor1';
    faceIndex = 0;
} else if (user.hp / user.mhp <= 0.5) {
    faceName = 'Actor1';
    faceIndex = 1;
} else if (user.hp / user.mhp <= 1) {
    faceName = 'Actor1';
    faceIndex = 2;
}
if (user.isStateAffected(42)) {
    faceName = 'Nature';
    faceIndex = 2;
}
</Custom Face Image Eval>

You can use 'user' to reference the actor. There are 2 variables you can change.
'faceName' refers to the filename for the face image.
'faceIndex' refers to the face index.
If any of those variables is not set, the default vaules will be used instead.

Also you can use shortcuts for referencing switches, variables and
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
  WAYModuleLoader.registerPlugin("WAY_CustomFaceImageEval", "1.1.2", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  var _WAY$Util = WAY.Util,
      getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
      trim = _WAY$Util.trim;
  WAY.EventEmitter.on("load-actor-notetags", function (actor) {
    actor.customFaceImageEval = getMultiLineNotetag(actor.note, "Custom Face Image Eval", null, trim);
  });

  var evalCode = function evalCode(user, code) {
    /* eslint-disable */
    var a = user;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var p = $gameParty;
    var faceName = user._defaultFaceName;
    var faceIndex = user._defaultFaceIndex;

    try {
      eval(code);
      /* eslint-enable */
    } catch (e) {
      throw e;
    }

    return {
      faceName: faceName,
      faceIndex: faceIndex
    };
  }; //==========================================================================
  // Game_Actor
  //==========================================================================


  $.alias.Game_Actor_initImages = Game_Actor.prototype.initImages;

  Game_Actor.prototype.initImages = function () {
    $.alias.Game_Actor_initImages.call(this);
    this._defaultFaceName = this._faceName;
    this._defaultFaceIndex = this._faceIndex;
  };

  $.alias.Game_Actor_refresh = Game_Actor.prototype.refresh;

  Game_Actor.prototype.refresh = function () {
    $.alias.Game_Actor_refresh.call(this);

    var _evalCode = evalCode(this, this.actor().customFaceImageEval),
        faceName = _evalCode.faceName,
        faceIndex = _evalCode.faceIndex;

    this.setFaceImage(faceName, faceIndex); // make the TurnOrderDisplay notice the image change

    if (Imported.YEP_X_TurnOrderDisplay && $gameParty.inBattle() && BattleManager._performedBattlers) {
      BattleManager.refreshTurnOrderDisplay();
    }
  };
})(WAYModuleLoader.getModule("WAY_CustomFaceImageEval"));