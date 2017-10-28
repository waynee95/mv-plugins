/* globals WAY, WAYModuleLoader, Window_TurnOrderIcon */
// ============================================================================
// WAY_YEP_TurnOrderDisplay.js
// ============================================================================
/**
 * @file Addon to Yanfly's Turn Order Display Plugin.
 * @author waynee95
 * @version 1.0.1
 */
/*:
@plugindesc Addon to Yanfly's Turn Order Display Plugin. <WAY_YEP_TurnOrderDisplay>
@author waynee95

@help
===============================================================================
 ■ Plugin Commands
===============================================================================
-- Enemy

<Turn Order Image: filename, index>

===============================================================================
 ■ Terms of Use
===============================================================================
Credit must be given to: waynee95
Please don't share my plugins anywhere, except if you have my permissions.

My plugins may be used in commercial and non-commercial products.
*/

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (WAY === undefined) {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_YEP_TurnOrderDisplay', '1.0.0', 'waynee95');
}

(function ($) {
    var getNotetag = WAY.Util.getNotetag;


    WAY.EventEmitter.on('load-enemy-notetags', function (enemy) {
        getNotetag(enemy.note, 'Turn Order Image', null, function (str) {
            var _str$split = str.split(','),
                _str$split2 = _slicedToArray(_str$split, 2),
                filename = _str$split2[0],
                index = _str$split2[1];

            filename = filename.trim();
            index = parseInt(index, 10);
            enemy.turnOrderImage = { filename: filename, index: index };
        });
    });

    (function (Game_Enemy, alias) {
        alias.Game_Enemy_turnOrderDisplayBitmap = Game_Enemy.turnOrderDisplayBitmap;
        Game_Enemy.turnOrderDisplayBitmap = function () {
            if (this.enemy().turnOrderDisplayFace) {
                return ImageManager.loadFace(this.enemy().turnOrderDisplayFace.fileName);
            }
            return alias.Game_Enemy_turnOrderDisplayBitmap.call(this);
        };
    })(Game_Enemy.prototype, $.alias);

    (function (Window_TurnOrderIcon, alias) {
        alias.Window_TurnOrderIcon_drawBattler = Window_TurnOrderIcon.drawBattler;
        Window_TurnOrderIcon.drawBattler = function () {
            if (this.battler().isEnemy() && this.battler().enemy().turnOrderDisplayFace) {
                this.drawEnemyFace();
            } else {
                alias.Window_TurnOrderIcon_drawBattler.call(this);
            }
        };

        Window_TurnOrderIcon.drawEnemyFace = function () {
            var faceIndex = this.battler().enemy().turnOrderDisplayFace.faceIndex;

            var sw = Window_Base._faceWidth;
            var sh = Window_Base._faceHeight;
            var dx = Math.floor(sw / 2);
            var dy = Math.floor(sh / 2);
            var sx = faceIndex % 4 * sw + sw / 2;
            var sy = Math.floor(faceIndex / 4) * sh + sh / 2;
            var dw = this.contents.width - 8;
            var dh = this.contents.height - 8;
            this.contents.blt(this._image, sx, sy, sw, sh, dx + 4, dy + 4, dw, dh);
        };
    })(Window_TurnOrderIcon.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_YEP_TurnOrderDisplay'));