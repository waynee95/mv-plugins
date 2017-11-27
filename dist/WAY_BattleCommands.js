/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_BattleCommands.js
// ============================================================================
/*:
@plugindesc v0.0.0 <WAY_BattleCommands>
@author waynee95

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
    console.error('You need to install WAY_Core!'); // eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_BattleCommands', '0.0.0', 'waynee95');
}

(function ($) {})(WAYModuleLoader.getModule('WAY_BattleCommands'));