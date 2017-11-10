/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_EvalText.js
// ============================================================================
/*:
@plugindesc v1.0.2 Use JavaScript Code in textboxes. <WAY_EvalText>
@author waynee95

@help
==============================================================================
 ■ Usage
==============================================================================
Inside a description or message box, you can put any JavaScript Code between
${}. It will replace that later with the result of your entered JavaScript code.

a - references the current selected actor (or the leader if there is no) 
p - game party 
s - switch 
v - variable 
item , skill - refers to the actual item or skill you are in. (If you are inside
the description box of skill or item)

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
    WAYModuleLoader.registerPlugin('WAY_EvalText', '1.0.2', 'waynee95');
}

(function ($) {
    var isScene = WAY.Util.isScene;


    (function (Window_Base, alias) {
        var evalText = function () {
            function evalText(text) {
                var a = $gameParty.leader();
                var item = isScene(Scene_ItemBase) ? SceneManager._scene.item() : a;
                var skill = item;
                if (isScene(Scene_MenuBase)) {
                    a = $gameParty.menuActor();
                } else if (isScene(Scene_Battle)) {
                    a = BattleManager.actor();
                }
                var s = $gameSwitches._data;
                var v = $gameVariables._data;
                var p = $gameParty;
                return text.replace(/\${[^{}\\]+(?=\})}/g, function (code) {
                    try {
                        return eval(code.substring(2, code.length - 1));
                    } catch (e) {
                        return '';
                    }
                });
            }

            return evalText;
        }();

        alias.WindowBase_convertEscapeCharacters = Window_Base.convertEscapeCharacters;

        /* Override */
        Window_Base.convertEscapeCharacters = function (text) {
            return alias.WindowBase_convertEscapeCharacters.call(this, evalText(text));
        };
    })(Window_Base.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_EvalText'));