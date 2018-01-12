/* globals WAY, WAYModuleLoader, Window_TurnOrderIcon */
// ============================================================================
// WAY_YEP_TurnOrderDisplay.js
// ============================================================================
/*:
@plugindesc v1.2.0 Addon to Yanfly's Turn Order Display Plugin. <WAY_YEP_TurnOrderDisplay>
@author waynee95

@help
===============================================================================
 ■ Notetags
===============================================================================
-- Enemy

<Turn Order Image: filename, index>

===============================================================================
 ■ Terms of Use
===============================================================================
Credit must be given to: waynee95
Please don't share my plugins anywhere, except if you have my permissions.

My plugins may be used in commercial and non-commercial products.

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
*/

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (typeof WAY === 'undefined') {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_YEP_TurnOrderDisplay', '1.2.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 2.0.0'
    });
}

(function ($) {
    var getNotetag = WAY.Util.getNotetag;


    WAY.EventEmitter.on('load-enemy-notetags', function (enemy) {
        getNotetag(enemy.note, 'Turn Order Image', null, function (str) {
            var _str$split = str.split(','),
                _str$split2 = _slicedToArray(_str$split, 2),
                filename = _str$split2[0],
                faceIndex = _str$split2[1];

            filename = filename.trim();
            faceIndex = parseInt(faceIndex, 10);
            enemy.turnOrderImage = { filename: filename, faceIndex: faceIndex };
        });
    });

    //=============================================================================
    // Game_Enemy
    //=============================================================================
    $.alias.Game_Enemy_turnOrderDisplayBitmap = Game_Enemy.prototype.turnOrderDisplayBitmap;
    Game_Enemy.prototype.turnOrderDisplayBitmap = function () {
        if (this.enemy().turnOrderImage) {
            return ImageManager.loadFace(this.enemy().turnOrderImage.fileName);
        }
        return $.alias.Game_Enemy_turnOrderDisplayBitmap.call(this);
    };

    //=============================================================================
    // Window_TurnOrderIcon
    //=============================================================================
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

        var _battler$enemy$turnOr = this.battler().enemy().turnOrderImage,
            filename = _battler$enemy$turnOr.filename,
            faceIndex = _battler$enemy$turnOr.faceIndex;

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
})(WAYModuleLoader.getModule('WAY_YEP_TurnOrderDisplay'));