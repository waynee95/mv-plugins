/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_RandomEncounterFormula.js
// ===========================================================================
/*:
@plugindesc v1.1.0 Use a custom random encounter formula. <WAY_RandomEncounterFormula>

@author waynee95

@param encounterFormula
@text Random Encounter Formula
@desc Formula for chance of random encounter.
n refers to the encounter steps.
@default Math.randomInt(n) + Math.randomInt(n) + 1

@help
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

'use strict'

if (typeof WAY === 'undefined') {
  console.error('You need to install WAY_Core!') // eslint-disable-line no-console
  if (Utils.isNwjs() && Utils.isOptionValid('test')) {
    var gui = require('nw.gui'); //eslint-disable-line
    gui.Window.get().showDevTools()
  }
  SceneManager.stop()
} else {
  WAYModuleLoader.registerPlugin('WAY_RandomEncounterFormula', '1.1.0', 'waynee95', {
    name: 'WAY_Core',
    version: '>= 2.0.0'
  })
}

($ => {
  Game_Player.prototype.makeEncounterCount = function () {
    const n = $gameMap.encounterStep() // eslint-disable-line no-unused-vars
    this._encounterCount = eval($.parameters.encounterFormula) // eslint-disable-line no-eval
  }
})(WAYModuleLoader.getModule('WAY_RandomEncounterFormula'))
