/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_EvalText.js
// ============================================================================
/*:
@plugindesc v1.1.0 Use JavaScript Code in textboxes. <WAY_EvalText>

@author waynee95

@help
==============================================================================
 ■ Usage
==============================================================================
Inside a description or message box, you can put any JavaScript Code between
${}. It will replace that later with the result of your entered JavaScript code.

a - references the current selected actor (or the leader if there is no) 
p - game party 
s - game switches
v - game variables
p - game party
item , skill - refers to the actual item or skill you are in. (If you are inside
the description box of skill or item)

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
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_EvalText', '1.1.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 2.0.0'
    });
}

(function ($) {
    var evalText = function evalText(text) {
        var scene = SceneManager._scene;
        var a = $gameParty.leader();
        var item = scene instanceof Scene_ItemBase && scene._itemWindow ? scene._itemWindow.item() : a;
        /* eslint-disable */
        var skill = item;
        var s = $gameSwitches;
        var v = $gameVariables;
        var p = $gameParty;
        if (scene instanceof Scene_MenuBase) {
            a = $gameParty.menuActor();
        } else if (scene instanceof Scene_Battle) {
            a = BattleManager.actor();
            item = scene && scene._itemWindow ? scene._itemWindow.item() : a;
            skill = scene && scene._skillWindow ? scene._skillWindow.item() : a;
        }
        return text.replace(/\${[^{}\\]+(?=\})}/g, function (code) {
            try {
                return eval(code.substring(2, code.length - 1));
                /* eslint-enable */
            } catch (e) {
                return '';
            }
        });
    };

    //=============================================================================
    // Window_Base
    //=============================================================================
    $.alias.WindowBase_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        return $.alias.WindowBase_convertEscapeCharacters.call(this, evalText(text));
    };
})(WAYModuleLoader.getModule('WAY_EvalText'));