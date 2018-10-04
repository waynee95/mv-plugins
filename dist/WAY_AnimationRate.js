/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_AnimationRate.js
// ===========================================================================

/*:
@plugindesc v1.1.0 Allows you to set the animation rate for each animation individually.
<WAY_AnimationRate>

@author waynee95

@param animationRate
@text Default Animation Rate
@type number
@min 1
@desc Adjusts the rate of battle animations. The higher, the slower.
Default: 4
@default 4

@help

Just add <rate: x> to the name of the Animation. The higher, the slower.

==============================================================================
 ■ Terms of Use
==============================================================================
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

if (typeof WAY === 'undefined') {
  console.error('You need to install WAY_Core!'); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid('test')) {
    var gui = require('nw.gui'); //eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin('WAY_AnimationRate', '1.1.0', 'waynee95', {
    name: 'WAY_Core',
    version: '>= 2.0.0'
  });
}

($ => {
  //==========================================================================
  // Sprite_Animation
  //==========================================================================
  $.alias.Sprite_Animation_setRate = Sprite_Animation.prototype.setupRate;

  Sprite_Animation.prototype.setupRate = function () {
    const re = /<(?:RATE): (\d+)>/i;

    if (this._animation.name.match(re)) {
      this._rate = Number(RegExp.$1);
    } else {
      this._rate = $.parameters.animationRate;
    }
  };
})(WAYModuleLoader.getModule('WAY_AnimationRate'));