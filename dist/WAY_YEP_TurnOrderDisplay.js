/* globals WAY, WAYModuleLoader, Window_TurnOrderIcon */
// ===========================================================================
// WAY_YEP_TurnOrderDisplay.js
// ===========================================================================

/*:
@plugindesc v1.2.0 Addon to Yanfly's Turn Order Display Plugin. <WAY_YEP_TurnOrderDisplay>
@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Enemy

<Turn Order Image: filename, index>

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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); //eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin("WAY_YEP_TurnOrderDisplay", "1.2.0", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  var getNotetag = WAY.Util.getNotetag;
  WAY.EventEmitter.on("load-enemy-notetags", function (enemy) {
    getNotetag(enemy.note, "Turn Order Image", null, function (str) {
      var _str$split = str.split(","),
          _str$split2 = _slicedToArray(_str$split, 2),
          filename = _str$split2[0],
          faceIndex = _str$split2[1];

      filename = filename.trim();
      faceIndex = parseInt(faceIndex, 10);
      enemy.turnOrderImage = {
        filename: filename,
        faceIndex: faceIndex
      };
    });
  }); //==========================================================================
  // Game_Enemy
  //==========================================================================

  $.alias.Game_Enemy_turnOrderDisplayBitmap = Game_Enemy.prototype.turnOrderDisplayBitmap;

  Game_Enemy.prototype.turnOrderDisplayBitmap = function () {
    if (this.enemy().turnOrderImage) {
      return ImageManager.loadFace(this.enemy().turnOrderImage.fileName);
    }

    return $.alias.Game_Enemy_turnOrderDisplayBitmap.call(this);
  }; //==========================================================================
  // Window_TurnOrderIcon
  //==========================================================================


  $.alias.Window_TurnOrderIcon_drawBattler = Window_TurnOrderIcon.prototype.drawBattler;

  Window_TurnOrderIcon.prototype.drawBattler = function () {
    if (this.battler().isEnemy() && this.battler().enemy().turnOrderImage) {
      this.drawEnemyFace();
    } else {
      $.alias.Window_TurnOrderIcon_drawBattler.call(this);
    }
  };

  $.alias.Window_TurnOrderIcon_updateDestinationX = Window_TurnOrderIcon.prototype.updateDestinationX;

  Window_TurnOrderIcon.prototype.updateDestinationX = function () {
    $.alias.Window_TurnOrderIcon_updateDestinationX.call(this);
    if (this._destinationX === undefined) this._destinationX = this.x;
  };

  Window_TurnOrderIcon.prototype.drawEnemyFace = function () {
    var _this = this;

    var _this$battler$enemy$t = this.battler().enemy().turnOrderImage,
        filename = _this$battler$enemy$t.filename,
        faceIndex = _this$battler$enemy$t.faceIndex;
    var bitmap = ImageManager.loadFace(filename);
    bitmap.addLoadListener(function () {
      var sw = Window_Base._faceWidth;
      var sh = Window_Base._faceHeight;
      var dx = 0;
      var dy = 0;
      var sx = faceIndex % 4 * sw;
      var sy = Math.floor(faceIndex / 4) * sh;
      var dw = _this.contents.width - 8;
      var dh = _this.contents.height - 8;

      _this.contents.blt(bitmap, sx, sy, sw, sh, dx + 4, dy + 4, dw, dh);

      _this.drawLetter();
    });
  };
})(WAYModuleLoader.getModule("WAY_YEP_TurnOrderDisplay"));