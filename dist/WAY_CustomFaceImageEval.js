/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_CustomFaceImageEval.js
// ============================================================================
/*:
@plugindesc v1.0.0 Set different face images using Lunatic Code. <WAY_CustomFaceImageEval>
@author waynee95

@help
==============================================================================
 ■ Lunatic Mode - Custom Face Image Eval
==============================================================================
--- Actor Notetag:

<Custom Face Image Eval>
if (user.hp / user.mhp <= 0) {
	faceName = 'Actor1';
	faceIndex = 0;
} else if (user.hp / user.mhp <= 0.5) {
	faceName = 'Actor1';
	faceIndex = 1;
} else if (user.hp / user.mhp <= 1) {
	faceName = 'Actor1';
	faceIndex = 2;
} 
if (user.isStateAffected(42)) {
	faceName = 'Nature';
	faceIndex = 2;
}
</Custom Face Image Eval>

You can use 'user' to reference the actor. There are 2 variables you can change.
'faceName' refers to the filename for the face image.
'faceIndex' refers to the face index.
If any of those variables is not set, the default vaules will be used instead.

Also you can use shortcuts for referencing switches, variables and 
the game party. Instead of using $gameSwitches, $gameVariables and $gameParty,
you can just use s, v, and p.

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
    WAYModuleLoader.registerPlugin('WAY_CustomFaceImageEval', '1.0.0', 'waynee95');
}

(function ($) {
    var _WAY$Util = WAY.Util,
        extend = _WAY$Util.extend,
        getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
        trim = _WAY$Util.trim;


    WAY.EventEmitter.on('load-actor-notetags', function (actor) {
        actor.customFaceImageEval = getMultiLineNotetag(actor.note, 'Custom Face Image Eval', null, trim);
    });

    var evalCode = function () {
        function evalCode(user, code) {
            var a = user;
            var s = $gameSwitches._data;
            var v = $gameVariables._data;
            var p = $gameParty;
            var faceName = user._defaultFaceName;
            var faceIndex = user._defaultFaceIndex;
            try {
                eval(code);
            } catch (e) {
                throw e;
            }

            return { faceName: faceName, faceIndex: faceIndex };
        }

        return evalCode;
    }();

    (function (Game_Actor, alias) {
        alias.Game_Actor_initImages = Game_Actor.initImages;
        extend(Game_Actor, 'initImages', function () {
            this._defaultFaceName = this._faceName;
            this._defaultFaceIndex = this._faceIndex;
        });

        alias.Game_Actor_refresh = Game_Actor.refresh;
        extend(Game_Actor, 'refresh', function () {
            var _evalCode = evalCode(this, this.actor().customFaceImageEval),
                faceName = _evalCode.faceName,
                faceIndex = _evalCode.faceIndex;

            this.setFaceImage(faceName, faceIndex);
        });
    })(Game_Actor.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_CustomFaceImageEval'));