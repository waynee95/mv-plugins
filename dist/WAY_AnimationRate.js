/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_AnimationRate.js
// ============================================================================
/*:
@plugindesc v1.0.1 Allows you to set the animation rate for each animation individually.
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
    WAYModuleLoader.registerPlugin('WAY_AnimationRate', '1.0.1', 'waynee95');
}

(function ($) {
    (function (Sprite_Animation, params, alias) {
        alias.Sprite_Animation_setRate = Sprite_Animation.setupRate;

        /* override */
        Sprite_Animation.setupRate = function (animation) {
            var re = /<(?:RATE): ([0-9]+)>/i;
            if (animation.name.match(re)) {
                this._rate = Number(RegExp.$1);
            } else {
                this._rate = params.animationRate;
            }
        };
    })(Sprite_Animation.prototype, $.parameters, $.alias);
})(WAYModuleLoader.getModule('WAY_AnimationRate'));