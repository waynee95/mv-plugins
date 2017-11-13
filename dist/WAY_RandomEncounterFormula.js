/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_RandomEncounterFormula.js
// ============================================================================
/*:
@plugindesc v1.0.0 Use a custom random encounter formula. <WAY_RandomEncounterFormula>
@author waynee95

@param encounterFormula
@text Random Encounter Formula
@desc Formula for chance of random encounter.
n refers to the encounter steps.
@default Math.randomInt(n) + Math.randomInt(n) + 1

@help
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
    WAYModuleLoader.registerPlugin('WAY_RandomEncounterFormula', '1.0.0', 'waynee95');
}

(function ($) {
    /* Override */
    Game_Player.prototype.makeEncounterCount = function () {
        var n = $gameMap.encounterStep();
        this._encounterCount = eval($.parameters.encounterFormula);
    };
})(WAYModuleLoader.getModule('WAY_RandomEncounterFormula'));