/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_CustomOnDeathEval.js
// ============================================================================
/*:
@plugindesc v1.1.0 Run code when a battler dies. <WAY_CustomOnDeathEval>

@author waynee95

@help
==============================================================================
■ Lunatic Mode - Custom On Death Eval
==============================================================================
-- Actor, Class, Enemy, Weapon, Armor, State notetag:

<Custom On Death Eval>
code
</Custom On Death Eval>

This will run when the battler dies. You can use 'user' or 'a' to reference the 
died battler. You can use 'killer' or 'b' to reference the battler who killed 
the user. Also you can use shortcuts for referencing switches, variables and 
the game party. Instead of using $gameSwitches, $gameVariables and $gameParty,
you can just use s, v, and p.

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
    WAYModuleLoader.registerPlugin('WAY_CustomOnDeathEval', '1.1.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 2.0.0'
    });
}

(function ($) {
    var _WAY$Util = WAY.Util,
        getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
        trim = _WAY$Util.trim;


    var parseNotetags = function parseNotetags(obj) {
        obj.customOnDeathEval = getMultiLineNotetag(obj.note, 'Custom On Death Eval', null, trim);
    };

    WAY.EventEmitter.on('load-actor-notetags', parseNotetags);
    WAY.EventEmitter.on('load-class-notetags', parseNotetags);
    WAY.EventEmitter.on('load-enemy-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-state-notetags', parseNotetags);

    var byCustomDeathEval = function byCustomDeathEval(obj) {
        return obj ? obj.customOnDeathEval : '';
    };
    var toCustomDeathEvalCode = function toCustomDeathEvalCode(acc, obj) {
        return String(acc) + '\n' + String(obj.customOnDeathEval || '');
    };

    var evalCustomOnDeathEval = function evalCustomOnDeathEval(code, user, killer) {
        /* eslint-disable */
        var a = user;
        var b = killer;
        var s = $gameSwitches;
        var v = $gameVariables;
        var p = $gameParty;
        try {
            eval(code);
            /* eslint-enable */
        } catch (e) {
            throw e;
        }
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================
    Game_Battler.prototype.customOnDeathEval = function () {
        return this.states().filter(byCustomDeathEval).reduce(toCustomDeathEvalCode, '');
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================
    Game_Actor.prototype.customOnDeathEval = function () {
        var code = Game_Battler.prototype.customOnDeathEval.call(this);
        code += this.equips().filter(byCustomDeathEval).reduce(toCustomDeathEvalCode, '');
        code += '\n' + String(this.currentClass().customOnDeathEval) || '';
        code += '\n' + String(this.actor().customOnDeathEval) || '';
        return code;
    };

    //=============================================================================
    // Game_Enemy
    //=============================================================================
    Game_Enemy.prototype.customOnDeathEval = function () {
        var code = Game_Battler.prototype.customOnDeathEval.call(this);
        code += '\n' + String(this.enemy().customOnDeathEval) || '';
        return code;
    };

    //=============================================================================
    // Game_Action
    //=============================================================================
    $.alias.Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
        $.alias.Game_Action_executeHpDamage.call(this, target, value);
        if (target.hp < 1 || target.isDead()) {
            evalCustomOnDeathEval(target.customOnDeathEval(), target, this.subject());
        }
    };
})(WAYModuleLoader.getModule('WAY_CustomOnDeathEval'));