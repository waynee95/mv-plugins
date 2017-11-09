/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_MaxTpFormula.js
// ============================================================================
/*:
@plugindesc v1.0.1 Specify custom formulas for battler's Max TP. <WAY_MaxTpFormula>
@author waynee95

@param defaultFormula
@text Default Max TP Formula
@type note
@default "maxTp = user.level * 150;"

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Actor, Class, Enemy:
<Max TP Formula>
code
</Max TP Formula>

The following variables are available:
maxTp   - The resulting value after executing the code between the notetags
*         will determine the battler's max tp. 
user, a - This is the battler.
p       - Shortcut variable for the game party.
v[id]   - Shortcut array for game variables.
s[id]   - Shortcut array for game switches.

Example:
<Max TP Formula>
maxTp = user.weapons().contains($dataWeapons[1]) ? 250 : 150;
</Max TP Formula>

==============================================================================
 ■ Terms of Use
==============================================================================
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
    WAYModuleLoader.registerPlugin('WAY_MaxTpFormula', '1.0.1', 'waynee95');
}

(function ($) {
    var _WAY$Util = WAY.Util,
        getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
        trim = _WAY$Util.trim,
        showError = _WAY$Util.showError;
    var defaultFormula = $.parameters.defaultFormula;


    var parseNotetags = function () {
        function parseNotetags(obj) {
            obj.tpFormula = getMultiLineNotetag(obj.note, 'Max TP Formula', null, trim);
        }

        return parseNotetags;
    }();

    WAY.EventEmitter.on('load-actor-notetags', parseNotetags);
    WAY.EventEmitter.on('load-class-notetags', parseNotetags);
    WAY.EventEmitter.on('load-enemy-notetags', parseNotetags);

    Object.defineProperties(Game_BattlerBase.prototype, {
        // Max TP
        mtp: {
            get: function () {
                function get() {
                    return this.maxTp();
                }

                return get;
            }(),

            configurable: true
        }
    });

    var evalFormula = function () {
        function evalFormula(user, formula) {
            var maxTp = 0;
            var a = user;
            var s = $gameSwitches._data;
            var v = $gameVariables._data;
            var p = $gameParty;
            try {
                eval(formula); // eslint-disable-line
            } catch (e) {
                showError(e);
            }
            return maxTp;
        }

        return evalFormula;
    }();

    /* Override */
    Game_Actor.prototype.maxTp = function () {
        return evalFormula(this, this.currentClass().tpFormula || this.actor().tpFormula || defaultFormula);
    };

    /* Override */
    Game_Enemy.prototype.maxTp = function () {
        return evalFormula(this, this.enemy().tpFormula || defaultFormula);
    };
})(WAYModuleLoader.getModule('WAY_MaxTpFormula'));