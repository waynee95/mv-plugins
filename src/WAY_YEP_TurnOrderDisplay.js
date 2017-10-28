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
*/

'use strict';

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

(($) => {
    const { getNotetag } = WAY.Util;

    WAY.EventEmitter.on('load-enemy-notetags', (enemy) => {
        getNotetag(enemy.note, 'Turn Order Image', null, (str) => {
            let [filename, index] = str.split(',');
            filename = filename.trim();
            index = parseInt(index, 10);
            enemy.turnOrderImage = { filename, index };
        });
    });

    ((Game_Enemy, alias) => {
        alias.Game_Enemy_turnOrderDisplayBitmap = Game_Enemy.turnOrderDisplayBitmap;
        Game_Enemy.turnOrderDisplayBitmap = function () {
            if (this.enemy().turnOrderDisplayFace) {
                return ImageManager.loadFace(this.enemy().turnOrderDisplayFace.fileName);
            }
            return alias.Game_Enemy_turnOrderDisplayBitmap.call(this);
        };
    })(Game_Enemy.prototype, $.alias);

    ((Window_TurnOrderIcon, alias) => {
        alias.Window_TurnOrderIcon_drawBattler = Window_TurnOrderIcon.drawBattler;
        Window_TurnOrderIcon.drawBattler = function () {
            if (this.battler().isEnemy() && this.battler().enemy().turnOrderDisplayFace) {
                this.drawEnemyFace();
            } else {
                alias.Window_TurnOrderIcon_drawBattler.call(this);
            }
        };

        Window_TurnOrderIcon.drawEnemyFace = function () {
            const { faceIndex } = this.battler().enemy().turnOrderDisplayFace;
            const sw = Window_Base._faceWidth;
            const sh = Window_Base._faceHeight;
            const dx = Math.floor(sw / 2);
            const dy = Math.floor(sh / 2);
            const sx = ((faceIndex % 4) * sw) + (sw / 2);
            const sy = (Math.floor(faceIndex / 4) * sh) + (sh / 2);
            const dw = this.contents.width - 8;
            const dh = this.contents.height - 8;
            this.contents.blt(this._image, sx, sy, sw, sh, dx + 4, dy + 4, dw, dh);
        };
    })(Window_TurnOrderIcon.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_YEP_TurnOrderDisplay'));
