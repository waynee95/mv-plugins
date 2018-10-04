/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_BattleCommands.js
// ===========================================================================

/*:
@plugindesc v0.0.0 <WAY_BattleCommands>
@author waynee95

@help
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
'use strict';

if (typeof WAY === 'undefined') {
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