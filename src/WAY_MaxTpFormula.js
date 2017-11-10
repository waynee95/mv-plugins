/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_MaxTpFormula.js
// ============================================================================
/*:
@plugindesc v1.0.2 Specify custom formulas for battler's Max TP. <WAY_MaxTpFormula>
@author waynee95

@param defaultFormula
@text Default Max TP Formula
@type note
@default "maxTp = user.isActor() ? user.level * 150 : 150;"

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
    WAYModuleLoader.registerPlugin('WAY_MaxTpFormula', '1.0.2', 'waynee95');
}

($ => {
    const { getMultiLineNotetag, trim, showError } = WAY.Util;
    const { defaultFormula } = $.parameters;

    const parseNotetags = obj => {
        obj.tpFormula = getMultiLineNotetag(obj.note, 'Max TP Formula', null, trim);
    };

    WAY.EventEmitter.on('load-actor-notetags', parseNotetags);
    WAY.EventEmitter.on('load-class-notetags', parseNotetags);
    WAY.EventEmitter.on('load-enemy-notetags', parseNotetags);

    Object.defineProperties(Game_BattlerBase.prototype, {
        // Max TP
        mtp: {
            get() {
                return this.maxTp();
            },
            configurable: true
        }
    });

    const evalFormula = (user, formula) => {
        const maxTp = 0;
        const a = user;
        const s = $gameSwitches._data;
        const v = $gameVariables._data;
        const p = $gameParty;
        try {
            eval(formula); // eslint-disable-line
        } catch (e) {
            showError(e);
        }
        return maxTp;
    };

    /* Override */
    Game_Actor.prototype.maxTp = function() {
        return evalFormula(
            this,
            this.currentClass().tpFormula || this.actor().tpFormula || defaultFormula
        );
    };

    /* Override */
    Game_Enemy.prototype.maxTp = function() {
        return evalFormula(this, this.enemy().tpFormula || defaultFormula);
    };
})(WAYModuleLoader.getModule('WAY_MaxTpFormula'));
